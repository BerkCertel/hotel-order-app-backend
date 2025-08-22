const QrCodeModel = require("../models/QrCode.js"); // Mongoose QR Code modeli
const QRCodeLib = require("qrcode"); // QR görseli üretici kütüphane
const cloudinary = require("../config/cloudinary.js");
const Location = require("../models/Location.js");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

// Create a new QR code for a location
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

    // Aynı label/location varsa hata döndür
    const existingQr = await QrCodeModel.findOne({
      location: location._id,
      label,
    });
    if (existingQr) {
      return res.status(409).json({
        message: "A QR code with this label already exists for this location.",
      });
    }

    const qrId = new mongoose.Types.ObjectId();

    // 1. Linki oluştur
    const qrData = `${process.env.CLIENT_URL}/tr/order/menu/${qrId}`;

    // 2. QR görselini oluştur
    const qrCodeImage = await QRCodeLib.toDataURL(qrData);

    // 3. Cloudinary'ye yükle
    const uploadRes = await cloudinary.uploader.upload(qrCodeImage, {
      folder: "hotel_qrs",
      public_id: `qr-${location.location}-${label}-${Date.now()}`,
      overwrite: true,
    });

    // 4. QR kodu kaydet (required alanlar dolu!)
    const qr = new QrCodeModel({
      _id: qrId,
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
    const qrs = await QrCodeModel.find()
      .populate("location")
      .sort({ createdAt: -1 });

    res.json(qrs); // Boşsa [] döner, hata değildir.
  } catch (err) {
    console.error("getAllQrCodes error:", err);
    res.status(500).json({ message: "QR kodlar çekilemedi." });
  }
};

// Get all QR codes grouped by location
exports.getAllQrCodesGrouped = async (req, res) => {
  try {
    const qrs = await QrCodeModel.find()
      .populate("location")
      .sort({ createdAt: -1 });

    const grouped = {};
    qrs.forEach((qr) => {
      const locId = qr.location._id;
      if (!grouped[locId]) {
        grouped[locId] = {
          location: qr.location,
          qrCodes: [],
        };
      }
      grouped[locId].qrCodes.push(qr);
    });

    const groupedArr = Object.values(grouped);

    res.status(200).json(groupedArr);
  } catch (err) {
    console.error("getAllQrCodesGrouped error:", err);
    res.status(500).json({ message: "QR kodlar çekilemedi." });
  }
};

exports.getQrCodeDataById = async (req, res) => {
  const id = req.params.id;

  // ObjectId olup olmadığını kontrol et!
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid QR code ID." });
  }

  if (id === undefined || id === null || id === "") {
    return res.status(400).json({ message: "Invalid QR code ID." });
  }
  try {
    const qr = await QrCodeModel.findById(id).populate("location");
    if (!qr) {
      return res.status(404).json({ message: "QR code not found." });
    }

    res.status(200).json(qr);
  } catch (error) {
    console.error("Error fetching QR code data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// getQRCodesByLocation
exports.getQRCodesByLocation = async (req, res) => {
  try {
    const locationId = req.body.locationId || req.query.locationId;
    if (!locationId) {
      return res.status(400).json({ message: "locationId is required" });
    }
    if (typeof locationId !== "string" || locationId.length !== 24) {
      return res.status(400).json({ message: "Invalid locationId format." });
    }
    const qrCodes = await QrCodeModel.find({ location: locationId }).populate(
      "location"
    );
    res.json(qrCodes);
  } catch (error) {
    console.error("getQRCodesByLocation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a QR code
exports.deleteQrCode = async (req, res) => {
  try {
    const { id } = req.params;
    const qr = await QrCodeModel.findByIdAndDelete(id);
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
