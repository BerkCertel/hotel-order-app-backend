const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema(
  {
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    location: { type: String, required: true },
    label: { type: String, required: true },
    items: [OrderItemSchema],
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    roomNumber: { type: String, required: true },
    birthDate: { type: String, required: true },
    customerName: { type: String }, // opsiyonel
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
