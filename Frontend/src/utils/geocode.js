// utils/geocode.js
// Free geocoding via Nominatim (OpenStreetMap) — no API key needed
// Replaces the Google Maps geocoding that required a paid API key

/**
 * Get coordinates for a location string
 * @param {string} location - city name e.g. "Udaipur" or "Udaipur, Rajasthan"
 * @returns {{ lat: number, lng: number } | null}
 */
export const getCoords = async (location) => {
  if (!location) return null;

  try {
    const query = location.toLowerCase().includes("india")
      ? location
      : `${location}, India`;

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;

    const res  = await fetch(url, {
      headers: {
        "Accept-Language": "en",
        "User-Agent": "CabShare-App/1.0",   // Nominatim requires a User-Agent
      },
    });

    const data = await res.json();

    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
  } catch (err) {
    console.error("Geocoding failed for:", location, err);
  }

  return null;
};

/**
 * Get coordinates as [lat, lng] array (legacy format for map markers)
 */
export const getCoordsArray = async (location) => {
  const coords = await getCoords(location);
  return coords ? [coords.lat, coords.lng] : null;
};