require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
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
app.use(express.json());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(apiLimiter);
app.use(cookieParser());
connectDB();

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/qrcode", qrcodeRoutes);
app.use("/api/v1/location", locationRoutes);
app.use("/api/v1/subcategory", subcategoryRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/order", orderRoutes);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// HTTP ve Socket.io server'ı oluştur
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// io'yu app globaline ekle
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Yeni bir kullanıcı bağlandı:", socket.id);
  // Diğer socket işlemleri...
});

// Dinlemeye başla
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

server.on("error", (err) => {
  console.error("❌ Sunucu başlatılamadı:", err.message);
});
