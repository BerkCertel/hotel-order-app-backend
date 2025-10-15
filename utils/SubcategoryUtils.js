const { isWithinInterval, parse } = require("date-fns");
const { formatInTimeZone } = require("date-fns-tz");

// Saat aralığına göre fiyat aktif mi? (Europe/Istanbul timezone)
function isPriceActive(priceSchedule) {
  if (!priceSchedule?.activeFrom || !priceSchedule?.activeTo) return false;
  const timeZone = "Europe/Istanbul";

  // Türkiye saatine göre şu anki zaman (string olarak)
  const nowTurkeyStr = formatInTimeZone(
    new Date(),
    timeZone,
    "yyyy-MM-dd HH:mm"
  );
  // Türkiye saatine göre şu an (Date objesi)
  const nowTurkey = parse(nowTurkeyStr, "yyyy-MM-dd HH:mm", new Date());

  // Bugünkü tarih string (Türkiye saatine göre)
  const todayTurkey = formatInTimeZone(new Date(), timeZone, "yyyy-MM-dd");

  // Aralıkları oluştur (Date objesi olarak)
  const from = parse(
    `${todayTurkey} ${priceSchedule.activeFrom}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );
  const to = parse(
    `${todayTurkey} ${priceSchedule.activeTo}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );

  // Şu an Türkiye saatine göre aralıkta mı?
  return isWithinInterval(nowTurkey, { start: from, end: to });
}

// Gerçek fiyatı döndürür
function getActualPrice(price, priceSchedule) {
  if (!price || price === 0) return 0;
  if (!priceSchedule?.activeFrom || !priceSchedule?.activeTo) return price;
  return isPriceActive(priceSchedule) ? price : 0;
}

module.exports = { isPriceActive, getActualPrice };
