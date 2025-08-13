const Order = require("../models/Orders");
const cron = require("node-cron");

cron.schedule("0 0 * * 1", async () => {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  await Order.deleteMany({ createdAt: { $lt: oneWeekAgo } });
  console.log("[CRON] Haftası dolan siparişler silindi.");
});
