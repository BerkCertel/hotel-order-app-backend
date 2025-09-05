const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: false, default: 0 },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    items: [OrderItemSchema],
    roomNumber: { type: String, required: true },
    orderUserName: String,
    qrcodeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "QrCode",
    },
    qrcodeLabel: String,
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "rejected"],
      default: "pending",
    },
    TotalPrice: { type: Number, required: true },
    orderNote: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
