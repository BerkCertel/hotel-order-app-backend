const Order = require("../models/Orders");
const cron = require("node-cron");

cron.schedule("0 0 * * *", async () => {
  // Her dakika çalışır!
  console.log("CRON başladı");
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const result = await Order.deleteMany({ createdAt: { $lt: oneWeekAgo } });
  console.log("[CRON] Haftası dolan siparişler silindi.", result);
});
