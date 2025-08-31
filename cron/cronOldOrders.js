const Orders = require("../models/Orders");
const cron = require("node-cron");

cron.schedule("0 0 * * 1", async () => {
  try {
    console.log("CRON başladı");
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const result = await Orders.deleteMany({ createdAt: { $lt: oneWeekAgo } });
    console.log("[CRON] Haftası dolan siparişler silindi.", result);
  } catch (err) {
    console.error("[CRON ERROR]", err);
  }
});
