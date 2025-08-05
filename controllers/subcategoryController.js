const Subcategory = require("../models/Subcategory.js");
const cloudinary = require("../config/cloudinary.js");

// Get all subcategories
exports.getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate("category");
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new subcategory
exports.createSubcategory = async (req, res) => {
  try {
    const { name, category, description } = req.body;
    if (!name || !category || !req.file) {
      return res
        .status(400)
        .json({ message: "Name, category and image are required" });
    }
    // Cloudinary upload from buffer
    const streamifier = require("streamifier");
    const uploadFromBuffer = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "subcategories" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };
    const uploadRes = await uploadFromBuffer(req.file.buffer);

    const newSubcategory = await Subcategory.create({
      name,
      category,
      image: uploadRes.secure_url,
      publicId: uploadRes.public_id,
      description,
    });
    res.status(201).json(newSubcategory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create subcategory", error: error.message });
  }
};

// Delete a subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await Subcategory.findByIdAndDelete(id);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found." });
    }
    // Görseli sil
    if (subcategory.publicId) {
      await cloudinary.uploader.destroy(subcategory.publicId);
    }
    res.status(200).json({
      deletedSubcategory: subcategory,
      message: "Subcategory deleted.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete subcategory", error: error.message });
  }
};

// Update a subcategory
exports.updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description } = req.body;

    const subcategory = await Subcategory.findById(id);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found." });
    }

    // Görsel güncellemesi
    let image = subcategory.image;
    let publicId = subcategory.publicId;
    if (req.file) {
      if (publicId) await cloudinary.uploader.destroy(publicId);

      const streamifier = require("streamifier");
      const uploadFromBuffer = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "subcategories" },
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

    subcategory.name = name || subcategory.name;
    subcategory.category = category || subcategory.category;
    subcategory.description = description || subcategory.description;
    subcategory.image = image;
    subcategory.publicId = publicId;
    await subcategory.save();

    res.status(200).json({
      updatedSubcategory: subcategory,
      message: "Subcategory updated successfully.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update subcategory", error: error.message });
  }
};

// Get subcategories by category
exports.getSubcategoriesByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategories = await Subcategory.find({ category: id }).populate(
      "category"
    );
    res.status(200).json(subcategories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get subcategories", error: error.message });
  }
};
