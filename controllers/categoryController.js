const Category = require("../models/Category.js");
const Subcategory = require("../models/Subcategory.js");
const cloudinary = require("../config/cloudinary.js");
const {
  getActualPrice,
  normalizePriceSchedule,
} = require("../utils/SubcategoryUtils.js");
const { translateText } = require("../utils/translator.js");

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all categories with their subcategories
exports.getAllCategoriesWithSubcategories = async (req, res) => {
  try {
    const categories = await Category.find().lean();

    const categoriesWithSubcategories = await Promise.all(
      categories.map(async (category) => {
        const subcategories = await Subcategory.find({
          category: category._id,
        }).lean();

        const subcategoriesWithPrice = subcategories.map((sc) => {
          const schedule = normalizePriceSchedule(sc.priceSchedule);
          let displayPrice = 0;
          try {
            displayPrice = getActualPrice(sc.price, schedule);
          } catch (err) {
            console.error(
              "getAllCategoriesWithSubcategories: getActualPrice error for subcategory id:",
              sc._id,
              err
            );
            displayPrice = 0;
          }
          return {
            ...sc,
            priceSchedule: schedule ?? { activeFrom: "", activeTo: "" },
            displayPrice,
          };
        });

        return {
          ...category,
          subcategories: subcategoriesWithPrice,
        };
      })
    );

    res.status(200).json(categoriesWithSubcategories);
  } catch (error) {
    console.error("getAllCategoriesWithSubcategories error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !req.file) {
      return res.status(400).json({ message: "Name and image are required" });
    }

    // Cloudinary upload from buffer
    const streamifier = require("streamifier");
    const uploadFromBuffer = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "categories" },
          (error, result) => {
            if (result) resolve(result);
            else {
              console.log(error);
              reject(error);
            }
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };
    const uploadRes = await uploadFromBuffer(req.file.buffer);

    // Prepare target languages to translate into (keys match your schema)
    const targets = {
      en: "en",
      ru: "ru",
      de: "de",
      fr: "fr",
    };

    // Translate all target languages in parallel
    const translationEntries = await Promise.all(
      Object.entries(targets).map(async ([key, langCode]) => {
        const translated = await translateText(name, langCode);
        // If translator returns empty for English, fallback to original name
        const value = translated || (key === "en" ? name : "");
        return [key, value];
      })
    );

    const translations = Object.fromEntries(translationEntries);

    const newCategory = await Category.create({
      name,
      translations,
      image: uploadRes.secure_url,
      publicId: uploadRes.public_id,
    });

    console.log(newCategory);

    res.status(201).json(newCategory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create category", error: error.message });
  }
};

// Delete a category and its subcategories
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Kategoriye bağlı tüm subcategory'leri bul ve sil
    const subcategories = await Subcategory.find({ category: id });
    for (const sub of subcategories) {
      // Alt kategorinin görselini sil
      if (sub.publicId) {
        await cloudinary.uploader.destroy(sub.publicId);
      }
      await Subcategory.findByIdAndDelete(sub._id);
    }

    // Kategori görselini sil
    if (category.publicId) {
      await cloudinary.uploader.destroy(category.publicId);
    }

    res.status(200).json({
      deletedCategory: category,
      deletedSubcategories: subcategories,
      message: "Category and related subcategories deleted.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete category", error: error.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    let translations = req.body.translations;

    console.log(translations);

    if (!translations) {
      return res.status(400).json({ message: "Translations are required." });
    }

    // Eğer translations bir string ise parse et (frontend genelde JSON.stringify ile gönderir)
    if (typeof translations === "string") {
      try {
        translations = JSON.parse(translations);
      } catch (err) {
        return res
          .status(400)
          .json({ message: "Invalid translations format." });
      }
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    if (!translations) {
      return res.status(400).json({ message: "Translations are required." });
    }

    // Güvenli trim: önce string olduğundan emin ol
    const getTrimmed = (val) => (typeof val === "string" ? val.trim() : "");

    if (!getTrimmed(translations.tr)) {
      return res
        .status(400)
        .json({ message: "Turkish translation is required." });
    }

    if (!getTrimmed(translations.de)) {
      return res
        .status(400)
        .json({ message: "German translation is required." });
    }

    if (!getTrimmed(translations.en)) {
      return res
        .status(400)
        .json({ message: "English translation is required." });
    }

    if (!getTrimmed(translations.ru)) {
      return res
        .status(400)
        .json({ message: "Russian translation is required." });
    }

    if (!getTrimmed(translations.fr)) {
      return res
        .status(400)
        .json({ message: "French translation is required." });
    }

    // Görsel güncellemesi
    let image = category.image;
    let publicId = category.publicId;
    if (req.file) {
      if (publicId) await cloudinary.uploader.destroy(publicId);

      const streamifier = require("streamifier");
      const uploadFromBuffer = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "categories" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });
      };
      const uploadRes = await uploadFromBuffer(req.file.buffer);

      image = uploadRes.secure_url;
      publicId = uploadRes.public_id;
    }

    category.name = name || category.name;
    category.image = image;
    category.publicId = publicId;
    category.translations = translations;
    await category.save();

    res.status(200).json({
      updatedCategory: category,
      message: "Category updated successfully.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update category", error: error.message });
  }
};
