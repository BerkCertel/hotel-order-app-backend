const mongoose = require("mongoose");

const QrCodeSchema = new mongoose.Schema(
  {
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    label: { type: String, required: true },
    qrCodeUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QrCode", QrCodeSchema);
