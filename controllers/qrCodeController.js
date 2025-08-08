const QrCodeModel = require("../models/QrCode.js"); // Mongoose QR Code modeli
const QRCodeLib = require("qrcode"); // QR görseli üretici kütüphane
const cloudinary = require("../config/cloudinary.js");
const Location = require("../models/Location.js");

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

    const qrData = JSON.stringify({ location: location.location, label });
    const qrCodeImage = await QRCodeLib.toDataURL(qrData);

    const uploadRes = await cloudinary.uploader.upload(qrCodeImage, {
      folder: "hotel_qrs",
      public_id: `qr-${location.location}-${label}-${Date.now()}`,
      overwrite: true,
    });

    const qr = new QrCodeModel({
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
  try {
    const { id } = req.params;
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

exports.getQRCodesByLocation = async (req, res) => {
  try {
    // Hem GET hem POST'a uygun olsun: body'den veya query'den al
    const locationId = req.body.locationId || req.query.locationId;
    if (!locationId) {
      return res.status(400).json({ message: "locationId is required" });
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
