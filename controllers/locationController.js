const Location = require("../models/Location.js");
const QrCodeSchema = require("../models/QrCode.js");
const QrCodeLib = require("qrcode"); // QR kod kütüphanen
const cloudinary = require("../utils/cloudinary"); // Cloudinary fonksiyonun

// Get all locations
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new location
exports.createLocation = async (req, res) => {
  try {
    const { location } = req.body;
    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }
    const newLocation = await Location.create({ location });
    res.status(201).json(newLocation);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create location", error: error.message });
  }
};

// Delete a location
exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Location ID is required" });
    }

    const location = await Location.findByIdAndDelete(id);

    if (!location) {
      return res.status(404).json({ message: "Location not found." });
    }

    // Ona bağlı QR kodları sil
    await QrCodeSchema.deleteMany({ location: id });

    res.status(200).json({ message: "Location and related QR codes deleted." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete location", error: error.message });
  }
};

// Update a location and its QR codes

exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { location } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Location ID is required" });
    }

    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }
    // 1. Location güncelle
    const updatedLocation = await Location.findByIdAndUpdate(
      id,
      { location },
      { new: true }
    );
    if (!updatedLocation) {
      return res.status(404).json({ message: "Location not found." });
    }

    // 2. Bu location'a bağlı QRCode'ları bul
    const qrCodes = await QrCodeSchema.find({ location: id });

    for (const qr of qrCodes) {
      // 3. Eski görseli sil
      if (qr.publicId) {
        await cloudinary.uploader.destroy(qr.publicId);
      }

      // 4. Yeni QR görseli oluştur
      const qrData = JSON.stringify({
        location: updatedLocation.location,
        label: qr.label,
      });
      const qrCodeImage = await QrCodeLib.toDataURL(qrData);
      const newPublicId = `hotel_qrs/qr-${updatedLocation.location}-${
        qr.label
      }-${Date.now()}`;
      const uploadRes = await cloudinary.uploader.upload(qrCodeImage, {
        folder: "hotel_qrs",
        public_id: newPublicId,
        overwrite: true,
      });

      // 5. QRCode'u güncelle
      qr.qrCodeUrl = uploadRes.secure_url;
      qr.publicId = uploadRes.public_id;
      // location ve label zaten değişmedi, gerek yok
      await qr.save();
    }

    res.status(200).json({
      updatedLocation,
      updatedQRCodes: qrCodes.length,
      message: "Location and related QR codes updated successfully.",
    });
  } catch (error) {
    console.error("Error updating location and QR codes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
