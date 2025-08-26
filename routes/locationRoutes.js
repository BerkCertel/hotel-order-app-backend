const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/AdminAuthorityMiddleware");
const {
  createLocation,
  getAllLocations,
  updateLocation,
  deleteLocation,
} = require("../controllers/locationController");

router.delete("/delete-location/:id", protect, isAdmin, deleteLocation);
router.get("/get-all-locations", protect, getAllLocations);
router.post("/create-location", protect, isAdmin, createLocation);
router.put("/update-location/:id", protect, isAdmin, updateLocation);

module.exports = router;
