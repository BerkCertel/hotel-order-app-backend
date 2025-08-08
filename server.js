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

const app = express();
app.use(express.json());

// Middleware to handle Cors

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Doğru! Cookie için olmalı
  })
);

app.use(apiLimiter);

app.use(cookieParser());
connectDB();

// Auth routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/qrcode", qrcodeRoutes);
app.use("/api/v1/location", locationRoutes);
app.use("/api/v1/subcategory", subcategoryRoutes);
app.use("/api/v1/category", categoryRoutes);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

server.on("error", (err) => {
  console.error("❌ Sunucu başlatılamadı:", err.message);
});
