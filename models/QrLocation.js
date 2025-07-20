import mongoose from "mongoose";

const QrLocationSchema = new mongoose.Schema(
  {
    location: String,
    name: String,
    qrId: { type: String, unique: true },
    qrImage: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("QrLocation", QrLocationSchema);
