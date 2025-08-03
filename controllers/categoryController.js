const Category = require("../models/Category.js");
const cloudinary = require("../config/cloudinary.js");

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
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

    const newCategory = await Category.create({
      name,
      image: uploadRes.secure_url,
      publicId: uploadRes.public_id,
    });
    res.status(201).json(newCategory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create category", error: error.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }
    // Görseli sil
    if (category.publicId) {
      await cloudinary.uploader.destroy(category.publicId);
    }
    res
      .status(200)
      .json({ deletedCategory: category, message: "Category deleted." });
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

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
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
    await category.save();

    res
      .status(200)
      .json({
        updatedCategory: category,
        message: "Category updated successfully.",
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update category", error: error.message });
  }
};
