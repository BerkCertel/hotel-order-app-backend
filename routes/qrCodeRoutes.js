const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/AdminAuthorityMiddleware");
const {
  createQrCode,
  deleteQrCode,
  getAllQrCodes,
  getQRCodesByLocation,
  getQrCodeDataById,
  getAllQrCodesGrouped,
} = require("../controllers/qrCodeController");

router.delete("/delete-qrcode/:id", protect, isAdmin, deleteQrCode);
router.get("/get-all-qrcodes", protect, getAllQrCodes);
router.post("/get-qrcodes-by-location", protect, getQRCodesByLocation);
router.post("/create-qrcode", protect, isAdmin, createQrCode);
router.get("/get-qrcode-data/:id", getQrCodeDataById);

module.exports = router;
