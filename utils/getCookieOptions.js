// // Cookie ayarlarını ortam bazlı döndüren fonksiyon
// function getCookieOptions() {
//   const isProd = process.env.NODE_ENV === "production" ? true : false;
//   return {
//     httpOnly: true,
//     secure: isProd, // prod'da true, localde false
//     sameSite: isProd ? "None" : "Lax",
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
//     path: "/",
//   };
// }

// // Auth cookie setle
// function setAuthCookie(res, token) {
//   res.cookie("token", token, getCookieOptions());
// }

// // Auth cookie sil (logout)
// function clearAuthCookie(res) {
//   res.clearCookie("token", getCookieOptions());
// }

// module.exports = { setAuthCookie, clearAuthCookie };

// Cookie ayarlarını ortam bazlı döndüren fonksiyon
function getCookieOptions() {
  return {
    httpOnly: true,
    secure: true, // prod'da true, localde false
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
    path: "/",
  };
}

// Auth cookie setle
function setAuthCookie(res, token) {
  res.cookie("token", token, getCookieOptions());
}

// Auth cookie sil (logout)
function clearAuthCookie(res) {
  res.clearCookie("token", getCookieOptions());
}

module.exports = { setAuthCookie, clearAuthCookie };
