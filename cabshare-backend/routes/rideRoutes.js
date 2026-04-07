const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/authMiddleware");
const ctrl    = require("../controllers/rideController");

router.post("/",             auth, ctrl.createRide);
router.get("/",              auth, ctrl.getRides);
router.put("/:id/start",     auth, ctrl.startRide);
router.put("/:id/cancel",    auth, ctrl.cancelRide);
router.put("/:id/complete",  auth, ctrl.completeRide);

module.exports = router;