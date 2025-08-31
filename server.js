require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const apiLimiter = require("./middlewares/rateLimiter");
const authRoutes = require("./routes/authRoutes");
const qrcodeRoutes = require("./routes/qrCodeRoutes");
const locationRoutes = require("./routes/locationRoutes");
const subcategoryRoutes = require("./routes/subcategoryRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

// JSON body parser
app.use(express.json());

// CORS ayarları
app.use(
  cors({
    // origin: process.env.CLIENT_URL,
    origin: "https://hotel-order-app-frontend.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Rate limiter ve cookie-parser
app.use(apiLimiter);
app.use(cookieParser());

// Veritabanı bağlantısı
connectDB();

// API route'ları
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/qrcode", qrcodeRoutes);
app.use("/api/v1/location", locationRoutes);
app.use("/api/v1/subcategory", subcategoryRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/order", orderRoutes);

// HTTP ve Socket.io server'ı oluştur
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://hotel-order-app-frontend.vercel.app",
    // origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  },
});
app.set("io", io);

// Socket.io bağlantısı
io.on("connection", (socket) => {
  console.log("Yeni bir kullanıcı bağlandı:", socket.id);
  socket.on("disconnect", () => {
    console.log("Kullanıcı ayrıldı:", socket.id);
  });
});

// Haftalık cron job (sipariş temizliği)
require("./cron/cronOldOrders");

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(
    `✅ Socket.io server running with CORS: ${process.env.CLIENT_URL}`
  );
});
server.on("error", (err) => {
  console.error("❌ Sunucu başlatılamadı:", err.message);
});
