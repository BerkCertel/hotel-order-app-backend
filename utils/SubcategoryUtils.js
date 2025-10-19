// utils/SubcategoryUtils.js

const { isWithinInterval, addDays } = require("date-fns");
const dateFnsTz = require("date-fns-tz");

// Güvenli referanslar (varsa kullanacağız)
const toDateFn =
  dateFnsTz && typeof dateFnsTz.toDate === "function" ? dateFnsTz.toDate : null;
const fromZonedTimeFn =
  dateFnsTz && typeof dateFnsTz.fromZonedTime === "function"
    ? dateFnsTz.fromZonedTime
    : null;
const formatInTimeZone =
  dateFnsTz && typeof dateFnsTz.formatInTimeZone === "function"
    ? dateFnsTz.formatInTimeZone
    : null;
const getTimezoneOffset =
  dateFnsTz && typeof dateFnsTz.getTimezoneOffset === "function"
    ? dateFnsTz.getTimezoneOffset
    : null;

function makeUtcDateFromLocalTime(dateYmd, timeHhMm, timeZone) {
  // 1) toDate varsa deneyelim
  if (toDateFn) {
    try {
      // toDate supports string + options { timeZone }
      return toDateFn(`${dateYmd} ${timeHhMm}`, { timeZone });
    } catch (err) {
      // fallback'e düşecek
      console.warn(
        "makeUtcDateFromLocalTime: toDate failed, falling back:",
        err
      );
    }
  }

  // 2) fromZonedTime varsa deneyelim
  if (fromZonedTimeFn) {
    try {
      return fromZonedTimeFn(`${dateYmd} ${timeHhMm}`, timeZone);
    } catch (err) {
      console.warn(
        "makeUtcDateFromLocalTime: fromZonedTime failed, falling back:",
        err
      );
    }
  }

  // 3) formatInTimeZone ile offset alıp ISO oluştur
  if (formatInTimeZone) {
    try {
      const offset = formatInTimeZone(new Date(), timeZone, "xxx"); // örn "+03:00"
      const iso = `${dateYmd}T${timeHhMm}:00${offset}`; // "2025-10-19T09:30:00+03:00"
      return new Date(iso);
    } catch (err) {
      console.warn(
        "makeUtcDateFromLocalTime: formatInTimeZone fallback failed:",
        err
      );
    }
  }

  // 4) Çok kaba fallback: UTC Z ekle (doğru olmayabilir ama sonuç verir)
  return new Date(`${dateYmd}T${timeHhMm}:00Z`);
}

function isPriceActive(priceSchedule) {
  if (!priceSchedule || !priceSchedule.activeFrom || !priceSchedule.activeTo)
    return false;

  const timeZone = "Europe/Istanbul";
  const nowUtc = new Date();

  // Bugünün Türkiye tarihini almalıyız. formatInTimeZone varsa doğru lokal tarihi verir.
  const todayTurkey = formatInTimeZone
    ? formatInTimeZone(nowUtc, timeZone, "yyyy-MM-dd")
    : nowUtc.toISOString().slice(0, 10);

  const fromUtc = makeUtcDateFromLocalTime(
    todayTurkey,
    priceSchedule.activeFrom,
    timeZone
  );
  let toUtc = makeUtcDateFromLocalTime(
    todayTurkey,
    priceSchedule.activeTo,
    timeZone
  );

  // cross-midnight: toUtc <= fromUtc ise toUtc'u bir gün ileri al
  if (toUtc <= fromUtc) {
    toUtc = addDays(toUtc, 1);
  }

  return isWithinInterval(nowUtc, { start: fromUtc, end: toUtc });
}

function getActualPrice(price, priceSchedule) {
  if (!price || price === 0) return 0;
  if (!priceSchedule || !priceSchedule.activeFrom || !priceSchedule.activeTo)
    return price;
  return isPriceActive(priceSchedule) ? price : 0;
}

function normalizePriceSchedule(raw) {
  if (raw === null || typeof raw === "undefined") return undefined;
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed === "") return undefined;
    try {
      const parsed = JSON.parse(trimmed);
      if (
        parsed &&
        (parsed.activeFrom !== undefined || parsed.activeTo !== undefined)
      ) {
        return parsed;
      }
      return undefined;
    } catch (err) {
      console.warn("normalizePriceSchedule: JSON parse failed for:", raw);
      return undefined;
    }
  }
  // zaten obje ise
  return raw;
}

module.exports = {
  makeUtcDateFromLocalTime,
  isPriceActive,
  getActualPrice,
  normalizePriceSchedule,
};
