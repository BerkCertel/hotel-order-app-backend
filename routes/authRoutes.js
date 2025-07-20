const express = require("express");
const { protect } = require("../middlewares/authMiddleware");

const {
  register,
  login,
  getUserInfo,
  getAllUsers,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// router.get("/getUser", protect, getUserInfo);
router.get("/get-all-users", protect, getAllUsers);

module.exports = router;
