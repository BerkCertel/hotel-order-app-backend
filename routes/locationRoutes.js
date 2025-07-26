const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  isAdmin,
  isSuperAdmin,
} = require("../middlewares/AdminAuthorityMiddleware");
const {
  getAllLocations,
  createLocation,
  deleteLocation,
  updateLocation,
} = require("../controllers/locationController");

router.delete("/delete-location", protect, isAdmin, deleteLocation);
router.get("/get-all-locations", protect, getAllLocations);
router.post("/create-location", protect, isAdmin, createLocation);
router.put("/update-location/:id", protect, isAdmin, updateLocation);

module.exports = router;
