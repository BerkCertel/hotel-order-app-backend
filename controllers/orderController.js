const Order = require("../models/Orders");
const QrCode = require("../models/QrCode");

// Sipariş oluştur
exports.createOrder = async (req, res) => {
  try {
    const { items, roomNumber, orderUserName, qrCodeId } = req.body;

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
    });

    // CANLI YAYIN (Socket emit SADECE BURADA!)
    req.app.get("io").emit("orderUpdate", { type: "new", order });

    res.status(201).json(order);
  } catch (e) {
    res.status(500).json({ message: "Sipariş oluşturulamadı." });
  }
};

// Sipariş durumunu güncelle
exports.updateOrderStatus = async (req, res) => {
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
    res.status(500).json({ message: "Sipariş güncellenemedi" });
  }
};

// Lokasyona göre sipariş getir
exports.getOrdersByLocation = async (req, res) => {
  try {
    const { locationId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const orders = await Order.find({ location: locationId })
      .populate("location")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const count = await Order.countDocuments({ location: locationId });

    //!!! BURADA EMIT YOK !!!
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
