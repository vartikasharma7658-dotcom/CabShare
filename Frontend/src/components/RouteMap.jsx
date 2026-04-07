import { useEffect, useState, useRef, useCallback } from "react";
import {
  MapContainer, TileLayer, Marker, Popup, Polyline, useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const BACKEND = process.env.REACT_APP_API_URL || "http://localhost:5000";

const makeIcon = (color) => L.divIcon({
  className: "",
  iconAnchor: [14, 40],
  popupAnchor: [0, -42],
  html: `<div style="filter:drop-shadow(0 3px 8px rgba(0,0,0,0.4))">
    <svg viewBox="0 0 28 40" xmlns="http://www.w3.org/2000/svg" width="28" height="40">
      <path d="M14 2C7.373 2 2 7.373 2 14c0 9.333 12 26 12 26S26 23.333 26 14C26 7.373 20.627 2 14 2z"
            fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="14" cy="14" r="5" fill="white" opacity="0.95"/>
    </svg>
  </div>`,
});

const PICKUP_ICON  = makeIcon("#6366f1");
const DROPOFF_ICON = makeIcon("#ef4444");

const FitBounds = ({ coords }) => {
  const map    = useMap();
  const fitted = useRef(false);
  useEffect(() => {
    if (coords.length >= 2 && !fitted.current) {
      fitted.current = true;
      setTimeout(() => {
        try { map.fitBounds(L.latLngBounds(coords), { padding: [50, 50], animate: true }); }
        catch (_) {}
      }, 300);
    }
  }, [coords, map]);
  return null;
};

const fmt = {
  duration: (seconds) => {
    if (!seconds || seconds <= 0) return null;
    const h = Math.floor(seconds / 3600);
    const m = Math.round((seconds % 3600) / 60);
    if (h > 0) return `${h} h ${m} min`;
    return m <= 0 ? "< 1 min" : `${m} min`;
  },
  distance: (meters) => {
    if (!meters || meters <= 0) return null;
    return meters >= 1000
      ? `${(meters / 1000).toFixed(1)} km`
      : `${Math.round(meters)} m`;
  },
};

const geocodeCity = async (name) => {
  if (!name) return null;
  const q = name.toLowerCase().includes("india") ? name : `${name}, India`;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&countrycodes=in&addressdetails=1`,
      { headers: { "Accept-Language": "en", "User-Agent": "CabShare/1.0" } },
    );
    const data = await res.json();
    if (!data?.length) return null;
    const preferred = ["city", "town", "village", "municipality", "administrative"];
    const best =
      data.find(r => preferred.some(t => r.type?.includes(t) || r.class?.includes(t))) ||
      data.find(r => r.importance > 0.5) ||
      data[0];
    return { lat: parseFloat(best.lat), lng: parseFloat(best.lon) };
  } catch (e) { console.error("Geocode error:", e); }
  return null;
};

const DIST_FACTOR = 1.0;
const TIME_FACTOR = 1.0;

const parseOSRM = (data) => {
  if (data?.code === "Ok" && data.routes?.[0]) {
    const r = data.routes[0];
    const coords = r.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    const isFallback = !r.distance && !r.duration;
    return {
      coords,
      distance: isFallback ? null : r.distance * DIST_FACTOR,
      duration: isFallback ? null : r.duration * TIME_FACTOR,
      isFallback,
    };
  }
  return null;
};

// Strategy 1: backend proxy (primary)
const tryBackendProxy = async (src, dst) => {
  const url = `${BACKEND}/api/route?srcLat=${src.lat}&srcLng=${src.lng}&dstLat=${dst.lat}&dstLng=${dst.lng}`;
  const res  = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!res.ok) return null;
  return parseOSRM(await res.json());
};

// Strategy 2: direct OSRM
const tryDirectOSRM = async (src, dst) => {
  const url =
    `http://router.project-osrm.org/route/v1/driving/` +
    `${src.lng},${src.lat};${dst.lng},${dst.lat}` +
    `?overview=full&geometries=geojson`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  return parseOSRM(await res.json());
};

// Strategy 3: allorigins CORS proxy
const tryAllOrigins = async (src, dst) => {
  const osrm  = `http://router.project-osrm.org/route/v1/driving/${src.lng},${src.lat};${dst.lng},${dst.lat}?overview=full&geometries=geojson`;
  const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(osrm)}`;
  const res   = await fetch(proxy, { signal: AbortSignal.timeout(18000) });
  const json  = await res.json();
  if (!json?.contents) return null;
  return parseOSRM(JSON.parse(json.contents));
};

// Strategy 4: openrouteservice
const tryORS = async (src, dst) => {
  const url =
    `https://api.openrouteservice.org/v2/directions/driving-car` +
    `?api_key=5b3ce3597851110001cf6248a3f7e0bef9104e92b5d77d1b5c87a1a4` +
    `&start=${src.lng},${src.lat}&end=${dst.lng},${dst.lat}`;
  const res  = await fetch(url, { signal: AbortSignal.timeout(12000) });
  const data = await res.json();
  if (data?.features?.[0]) {
    const feat  = data.features[0];
    const coords = feat.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    const props  = feat.properties.segments?.[0];
    return {
      coords,
      distance: (props?.distance || 0) * DIST_FACTOR,
      duration: (props?.duration || 0) * TIME_FACTOR,
      isFallback: false,
    };
  }
  return null;
};

const RouteMap = ({ sourceCoords, destCoords, sourceName, destName, height = "420px" }) => {
  const [src,       setSrc]       = useState(null);
  const [dst,       setDst]       = useState(null);
  const [routeLine, setRouteLine] = useState([]);
  const [info,      setInfo]      = useState(null);
  const [phase,     setPhase]     = useState("init");
  const cancelled = useRef(false);

  const srcKey = sourceCoords?.lat
    ? `${sourceCoords.lat},${sourceCoords.lng}`
    : (sourceName || "");
  const dstKey = destCoords?.lat
    ? `${destCoords.lat},${destCoords.lng}`
    : (destName || "");

  const resolveAndRoute = useCallback(async () => {
    cancelled.current = false;
    setPhase("geocoding");
    setRouteLine([]);
    setInfo(null);

    let resolvedSrc = (sourceCoords?.lat && sourceCoords?.lng) ? sourceCoords : await geocodeCity(sourceName);
    let resolvedDst = (destCoords?.lat   && destCoords?.lng)   ? destCoords   : await geocodeCity(destName);

    if (cancelled.current) return;
    if (!resolvedSrc || !resolvedDst) { setPhase("error"); return; }

    setSrc(resolvedSrc);
    setDst(resolvedDst);
    setPhase("routing");

    const strategies = [tryBackendProxy, tryDirectOSRM, tryAllOrigins, tryORS];
    let route = null;

    for (const strategy of strategies) {
      if (cancelled.current) return;
      try {
        route = await strategy(resolvedSrc, resolvedDst);
        // Accept real route only (not fallback straight-line from backend)
        if (route?.coords?.length > 1 && !route.isFallback) break;
      } catch (e) {
        console.warn(`[RouteMap] ${strategy.name} failed:`, e.message);
      }
    }

    // If only fallback available, still use it so map renders
    if (!route && cancelled.current) return;
    if (!route) {
      setPhase("error");
      return;
    }

    if (cancelled.current) return;
    setRouteLine(route.coords);
    setInfo({ distance: route.distance, duration: route.duration });
    setPhase(route.isFallback ? "fallback" : "done");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [srcKey, dstKey]);

  useEffect(() => {
    if (!srcKey || !dstKey) return;
    resolveAndRoute();
    return () => { cancelled.current = true; };
  }, [srcKey, dstKey, resolveAndRoute]);

  const mapCenter = src ? [src.lat, src.lng] : [22.9734, 78.6569];
  const etaStr    = fmt.duration(info?.duration);
  const distStr   = fmt.distance(info?.distance);
  const loading   = phase === "init" || phase === "geocoding" || phase === "routing";

  return (
    <div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
        <div style={badge("rgba(99,102,241,0.08)", "rgba(99,102,241,0.22)")}>
          <span>🕐</span>
          <div>
            <div style={badgeLabel}>ETA</div>
            <div style={{ fontWeight: 700, color: "rgb(99,102,241)", fontSize: "0.95rem" }}>
              {phase === "done" && etaStr
                ? etaStr
                : phase === "fallback"
                ? "Unavailable"
                : phase === "error"
                ? "N/A"
                : "Calculating…"}
            </div>
          </div>
        </div>

        <div style={badge("rgba(22,163,74,0.08)", "rgba(22,163,74,0.22)")}>
          <span>📏</span>
          <div>
            <div style={badgeLabel}>Distance</div>
            <div style={{ fontWeight: 700, color: "rgb(22,163,74)", fontSize: "0.95rem" }}>
              {phase === "done" && distStr
                ? distStr
                : phase === "fallback"
                ? "Unavailable"
                : phase === "error"
                ? "N/A"
                : "Calculating…"}
            </div>
          </div>
        </div>
      </div>

      <div style={{
        height,
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid rgba(99,102,241,0.15)",
        position: "relative",
      }}>
        {loading && (
          <div style={overlayStyle}>
            <div style={spinnerStyle} />
            <p style={{ color: "#6366f1", fontSize: "0.9rem", fontWeight: 600, margin: 0 }}>
              {phase === "geocoding" ? "📍 Locating cities…" : "🗺️ Calculating road route…"}
            </p>
            <style>{`@keyframes rspin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {phase === "error" && (
          <div style={overlayStyle}>
            <span style={{ fontSize: "2.5rem" }}>😕</span>
            <p style={{ color: "#ef4444", fontWeight: 700, margin: 0 }}>Couldn't locate these cities</p>
            <p style={{ color: "#6b7280", fontSize: "0.85rem", margin: 0 }}>
              Check spelling: "{sourceName}" → "{destName}"
            </p>
          </div>
        )}

        <MapContainer center={mapCenter} zoom={7} style={{ width: "100%", height: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          />

          {src && (
            <Marker position={[src.lat, src.lng]} icon={PICKUP_ICON}>
              <Popup>
                <div style={{ textAlign: "center", padding: "4px 2px" }}>
                  <div style={{ fontWeight: 700, color: "#6366f1", fontSize: "0.9rem" }}>📍 Pickup</div>
                  <div style={{ color: "#374151", marginTop: "2px" }}>{sourceName}</div>
                </div>
              </Popup>
            </Marker>
          )}

          {dst && (
            <Marker position={[dst.lat, dst.lng]} icon={DROPOFF_ICON}>
              <Popup>
                <div style={{ textAlign: "center", padding: "4px 2px" }}>
                  <div style={{ fontWeight: 700, color: "#ef4444", fontSize: "0.9rem" }}>🏁 Drop-off</div>
                  <div style={{ color: "#374151", marginTop: "2px" }}>{destName}</div>
                </div>
              </Popup>
            </Marker>
          )}

          {routeLine.length > 1 && (
            <>
              <Polyline
                positions={routeLine}
                pathOptions={{ color: "#818cf8", weight: 14, opacity: 0.15 }}
              />
              <Polyline
                positions={routeLine}
                pathOptions={{
                  color: "#6366f1",
                  weight: 5,
                  opacity: 1,
                  lineJoin: "round",
                  lineCap: "round",
                }}
              />
              <FitBounds coords={routeLine} />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

const badge = (bg, border) => ({
  display: "flex", alignItems: "center", gap: "8px",
  padding: "8px 18px", borderRadius: "100px",
  background: bg, border: `1px solid ${border}`,
});
const badgeLabel = {
  fontSize: "0.6rem", color: "var(--text-muted, #9ca3af)",
  textTransform: "uppercase", letterSpacing: "0.08em",
};
const overlayStyle = {
  position: "absolute", inset: 0, zIndex: 999,
  display: "flex", alignItems: "center", justifyContent: "center",
  flexDirection: "column", gap: "14px",
  background: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)",
};
const spinnerStyle = {
  width: "40px", height: "40px",
  border: "3px solid rgba(99,102,241,0.15)",
  borderTop: "3px solid #6366f1",
  borderRadius: "50%",
  animation: "rspin 0.8s linear infinite",
};

export default RouteMap;