const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { isAdmin } = require("../middlewares/AdminAuthorityMiddleware");
const { protect } = require("../middlewares/authMiddleware");
const {
  createSubcategory,
  deleteSubcategory,
  getAllSubcategories,
  updateSubcategory,
  getSubcategoriesByCategory,
} = require("../controllers/subcategoryController.js");

// Tüm alt kategoriler
router.get("/get-all-subcategories", protect, isAdmin, getAllSubcategories);
// Alt kategori oluştur (resim upload!)
router.post(
  "/create-subcategory",
  protect,
  isAdmin,
  upload.single("image"),
  createSubcategory
);
// Alt kategori güncelle (resim upload opsiyonel)
router.put(
  "/update-subcategory/:id",
  protect,
  isAdmin,
  upload.single("image"),
  updateSubcategory
);
// Alt kategori sil
router.delete("/delete-subcategory/:id", protect, isAdmin, deleteSubcategory);

router.get("/by-category/:id", protect, getSubcategoriesByCategory);

module.exports = router;
