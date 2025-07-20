import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
  {
    location: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Location", LocationSchema);
