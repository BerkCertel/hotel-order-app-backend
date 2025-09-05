const Order = require("../models/Orders");
const QrCode = require("../models/QrCode");
const Location = require("../models/Location");
const User = require("../models/User");

// Sipariş oluştur
exports.createOrder = async (req, res) => {
  console.log("createOrder called with body:", req.body);

  try {
    const {
      items,
      roomNumber,
      orderUserName,
      qrCodeId,
      TotalPrice,
      orderNote,
    } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "You must provide at least one item." });
    }
    if (!roomNumber) {
      return res.status(400).json({ message: "Room number is required." });
    }
    if (!orderUserName) {
      return res.status(400).json({ message: "Invalid order user name." });
    }
    if (!qrCodeId) {
      return res.status(400).json({ message: "QR code ID is required." });
    }

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "You must provide at least one item." });
    }

    if (TotalPrice <= 0 && !TotalPrice) {
      return res.status(400).json({ message: "Invalid total price." });
    }

    // QR kodu ve location kontrolü
    const qrcode = await QrCode.findById(qrCodeId);
    if (!qrcode) return res.status(400).json({ message: "QR Code bulunamadı" });
    if (!qrcode.location)
      return res.status(400).json({ message: "QR kodun location'u yok" });

    const order = await Order.create({
      items,
      roomNumber,
      orderUserName,
      qrcodeId: qrcode._id,
      qrcodeLabel: qrcode.label,
      location: qrcode.location._id,
      status: "pending",
      TotalPrice,
      orderNote: orderNote || "",
    });

    // CANLI YAYIN (Socket emit SADECE BURADA!)
    req.app.get("io").emit("orderUpdate", { type: "new", order });

    res.status(201).json(order);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Sipariş oluşturulamadı." });
  }
};

// Sipariş durumunu güncelle
exports.updateOrderStatus = async (req, res) => {
  if (!req.body.status) {
    return res.status(400).json({ message: "Status is required." });
  }

  if (!["pending", "success", "rejected"].includes(req.body.status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  if (!req.params.id) {
    return res.status(400).json({ message: "Order ID is required." });
  }

  if (
    req.params.id === undefined ||
    req.params.id === null ||
    req.params.id === ""
  ) {
    return res.status(400).json({ message: "Invalid location ID." });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Sipariş bulunamadı" });

    // CANLI GÜNCELLEME (Socket emit SADECE BURADA!)
    req.app.get("io").emit("orderUpdate", { type: "update", order });

    res.json(order);
  } catch (e) {
    res.status(500).json({ message: "Sipariş güncellenemedi." });
  }
};

// Lokasyona göre sipariş getir
exports.getOrdersByLocation = async (req, res) => {
  const { locationId } = req.params;
  const user = req.user;

  if (!req.params.locationId) {
    return res.status(400).json({ message: "Location ID is required." });
  }

  if (
    typeof req.params.locationId !== "string" ||
    req.params.locationId.length !== 24
  ) {
    return res.status(400).json({ message: "Invalid location ID format." });
  }

  if (
    req.params.locationId === undefined ||
    req.params.locationId === null ||
    req.params.locationId === ""
  ) {
    return res.status(400).json({ message: "Invalid location ID." });
  }

  const locationExists = await Location.findById(locationId);
  if (!locationExists) {
    return res
      .status(404)
      .json({ message: "Bu ID'de bir lokasyon bulunamadı." });
  }

  const freshUser = await User.findById(user._id);
  if (!freshUser) {
    return res.status(401).json({ message: "Kullanıcı bulunamadı." });
  }

  if (!["ADMIN", "SUPERADMIN"].includes(freshUser.role)) {
    const userLocations = (freshUser.locations || []).map((l) => l.toString());
    if (!userLocations.includes(locationId)) {
      return res
        .status(403)
        .json({ message: "Bu lokasyona erişim yetkiniz yok." });
    }
  }

  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const orders = await Order.find({ location: locationId })
      .populate("location")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await Order.countDocuments({ location: locationId });

    res.json({
      orders,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    });
  } catch (e) {
    res.status(500).json({ message: "Siparişler çekilemedi" });
  }
};

// Tüm siparişleri getir
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("location")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) {
    res.status(500).json({ message: "Siparişler çekilemedi" });
  }
};
