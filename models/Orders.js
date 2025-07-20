import mongoose from "mongoose";

const OrdersSchema = new mongoose.Schema(
  {
    qrId: String,
    location: String,
    tableName: String,
    guestName: String,
    roomNumber: String,
    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Orders", OrdersSchema);
