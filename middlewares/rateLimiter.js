// // backend/middleware/rateLimiter.js
// const rateLimit = require("express-rate-limit");

// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 dakika
//   max: 100, // Her IP için 100 istek
//   message: "Çok fazla istek yaptınız. Lütfen daha sonra tekrar deneyin.",
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// module.exports = apiLimiter;

const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 dakika
  max: 1000,
  handler: (req, res) => {
    const now = Date.now();
    const retryAfter = req.rateLimit?.resetTime
      ? Math.ceil((req.rateLimit.resetTime - now) / 1000)
      : 10 * 60;
    res.set("Retry-After", retryAfter);
    res.status(429).json({
      message: "Çok fazla istek yaptınız. Lütfen daha sonra tekrar deneyin.",
      retryAfter, // saniye cinsinden
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = apiLimiter;
