const express = require("express");
const router  = express.Router();

router.get("/route", async (req, res) => {
  const { srcLat, srcLng, dstLat, dstLng } = req.query;

  if (!srcLat || !srcLng || !dstLat || !dstLng)
    return res.status(400).json({ error: "Missing coordinates" });

  const urls = [
    `http://router.project-osrm.org/route/v1/driving/${srcLng},${srcLat};${dstLng},${dstLat}?overview=full&geometries=geojson`,
    `http://routing.openstreetmap.de/routed-car/route/v1/driving/${srcLng},${srcLat};${dstLng},${dstLat}?overview=full&geometries=geojson`,
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "CabShare/1.0" },
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) continue;
      const data = await response.json();
      if (data?.code === "Ok") return res.json(data);
    } catch (e) {
      console.warn(`[routeProxy] Failed: ${e.message}`);
    }
  }

  // Straight-line fallback so frontend never gets a 500
  console.warn("[routeProxy] All OSRM sources failed, returning straight-line fallback");
  return res.json({
    code: "Ok",
    routes: [{
      geometry: {
        coordinates: [
          [parseFloat(srcLng), parseFloat(srcLat)],
          [parseFloat(dstLng), parseFloat(dstLat)],
        ],
        type: "LineString",
      },
      distance: 0,
      duration: 0,
    }],
  });
});

module.exports = router;