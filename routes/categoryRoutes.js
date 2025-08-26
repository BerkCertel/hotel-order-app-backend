const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { isAdmin } = require("../middlewares/AdminAuthorityMiddleware");
const { protect } = require("../middlewares/authMiddleware");

const {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} = require("../controllers/categoryController.js");

// Tüm kategoriler
router.get("/get-all-categories", protect, getAllCategories);
// Kategori oluştur (resim upload!)
router.post(
  "/create-category",
  protect,
  isAdmin,
  upload.single("image"),
  createCategory
);
// Kategori güncelle (resim upload opsiyonel)
router.put(
  "/update-category/:id",
  protect,
  isAdmin,
  upload.single("image"),
  updateCategory
);
// Kategori sil
router.delete("/delete-category/:id", protect, isAdmin, deleteCategory);

module.exports = router;
