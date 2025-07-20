const express = require("express");
const { protect } = require("../middlewares/authMiddleware");

const {
  addUser,
  login,
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/authController");

const {
  isAdmin,
  isSuperAdmin,
} = require("../middlewares/AdminAuthorityMiddleware");

const router = express.Router();

router.post("/add-user", protect, isAdmin, addUser); // ADMIN & SUPERADMIN
router.put("/update-role", protect, isAdmin, updateUserRole); // ADMIN & SUPERADMIN
router.delete("/delete-user", protect, isAdmin, deleteUser); // ADMIN & SUPERADMIN
router.post("/login", login);
router.get("/get-all-users", protect, isAdmin, getAllUsers);

module.exports = router;
