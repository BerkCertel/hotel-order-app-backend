const Order = require("../models/Orders");

// Sipariş oluştur ve websocket ile yayınla
exports.createOrder = async (req, res) => {
  try {
    const { location, label, items, roomNumber, birthDate, customerName } =
      req.body;

    const newOrder = await Order.create({
      location,
      label,
      items,
      status: "pending",
      roomNumber,
      birthDate,
      customerName,
    });

    req.app.get("io").emit("newOrder", newOrder);

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: "Sipariş oluşturulamadı", error: err });
  }
};

// Siparişleri listele (lokasyon/label filtresiyle)
exports.listOrders = async (req, res) => {
  try {
    const { location, label } = req.query;
    const filter = {};
    if (location) filter.location = location;
    if (label) filter.label = label;

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Siparişler alınamadı", error: err });
  }
};

// Sipariş durumunu güncelle
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedOrder)
      return res.status(404).json({ message: "Sipariş bulunamadı" });
    req.app
      .get("io")
      .emit("orderStatusUpdated", { orderId: updatedOrder._id, status });
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: "Durum güncellenemedi", error: err });
  }
};
