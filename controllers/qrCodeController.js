const QrCodeSchema = require("../models/QrCode.js");
const QrCode = require("qrcode");
const cloudinary = require("../config/cloudinary.js");
const Location = require("../models/Location.js");

// Create a new QR code for  location
exports.createQrCode = async (req, res) => {
  try {
    const { locationId, label } = req.body;

    if (!locationId || !label) {
      return res
        .status(400)
        .json({ message: "Location ID and label are required" });
    }

    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).json({ message: "Location not found." });
    }

    const qrData = JSON.stringify({ location: location.location, label });
    const qrCode = await QrCode.toDataURL(qrData);

    const uploadRes = await cloudinary.uploader.upload(qrCode, {
      folder: "hotel_qrs",
      public_id: `qr-${location.location}-${label}-${Date.now()}`,
      overwrite: true,
    });

    const qr = new QrCodeSchema({
      location: location._id,
      label,
      qrCodeUrl: uploadRes.secure_url,
      publicId: uploadRes.public_id,
    });
    await qr.save();
    res.status(201).json(qr);
  } catch (error) {
    console.error("Error creating QR code:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Qr Codes
exports.getAllQrCodes = async (req, res) => {
  try {
    const qrs = await QrCode.find()
      .populate("location")
      .sort({ createdAt: -1 });

    if (qrs.length === 0) {
      return res.status(404).json({ message: "No QR codes found." });
    }

    res.json(qrs);
  } catch (err) {
    res.status(500).json({ message: "QR kodlar çekilemedi." });
  }
};

exports.getQrCodeDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const qr = await QrCodeSchema.findById(id).populate("location");
    if (!qr) {
      return res.status(404).json({ message: "QR code not found." });
    }
    res.status(200).json(qr);
  } catch (error) {
    console.error("Error fetching QR code data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getQRCodesByLocation = async (req, res) => {
  try {
    const { locationId } = req.query;
    if (!locationId) {
      return res.status(400).json({ message: "locationId is required" });
    }
    const qrCodes = await QrCode.find({ location: locationId });
    res.json(qrCodes);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a QR code
exports.deleteQrCode = async (req, res) => {
  try {
    const { id } = req.params;
    const qr = await QrCode.findByIdAndDelete(id);
    if (!qr) {
      return res.status(404).json({ message: "QR code not found." });
    }

    // Cloudinary'den sil
    if (qr.publicId) {
      await cloudinary.uploader.destroy(qr.publicId);
    }

    res.status(200).json({ message: "QR code deleted successfully." });
  } catch (error) {
    console.error("Error deleting QR code:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
