exports.isAdmin = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "ADMIN" || req.user.role === "SUPERADMIN")
  ) {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Yalnızca admin veya superadmin yetkili!" });
};

exports.isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === "SUPERADMIN") {
    return next();
  }
  return res.status(403).json({ message: "Yalnızca superadmin yetkili!" });
};
