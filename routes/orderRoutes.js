const express = require("express");
const router = express.Router();
const {
  createOrder,
  listOrders,
  updateStatus,
} = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/", listOrders);
router.put("/:id/status", updateStatus);

module.exports = router;
