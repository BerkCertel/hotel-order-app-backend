// backend/middleware/rateLimiter.js
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // Her IP için 100 istek
  message: "Çok fazla istek yaptınız. Lütfen daha sonra tekrar deneyin.",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = apiLimiter;
