const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/AdminAuthorityMiddleware");
const {
  createOrder,
  getAllOrders,
  getOrdersByLocation,
  updateOrderStatus,
} = require("../controllers/orderController");

// Sipariş oluştur
router.post("/create-order", createOrder);

// Sipariş güncelle (status)
router.patch("/update-order-status/:id", protect, updateOrderStatus);

// Lokasyona göre sipariş getir
router.get("/get-orders-by-location/:locationId", protect, getOrdersByLocation);

// Tüm siparişleri getir
router.get("/get-all-orders", protect, isAdmin, getAllOrders);

module.exports = router;
