const Subcategory = require("../models/Subcategory.js");
const cloudinary = require("../config/cloudinary.js");
const { default: mongoose } = require("mongoose");
const {
  getActualPrice,
  normalizePriceSchedule,
} = require("../utils/SubcategoryUtils.js");

// // Get all subcategories
// exports.getAllSubcategories = async (req, res) => {
//   try {
//     const subcategories = await Subcategory.find().populate("category");
//     // Anlık fiyat ekle
//     const result = subcategories.map((sc) => ({
//       ...sc.toObject(),
//       displayPrice: getActualPrice(sc.price, sc.priceSchedule),
//     }));
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// Get all subcategories
exports.getAllSubcategories = async (req, res) => {
  try {
    // .lean() ile plain JS objesi alıyoruz
    const subcategories = await Subcategory.find().populate("category").lean();

    const result = subcategories.map((sc) => {
      const schedule = normalizePriceSchedule(sc.priceSchedule);
      let displayPrice = 0;
      try {
        displayPrice = getActualPrice(sc.price, schedule);
      } catch (err) {
        console.error(
          "getAllSubcategories: getActualPrice error for id:",
          sc._id,
          err
        );
        displayPrice = 0;
      }
      return {
        ...sc,
        displayPrice,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("getAllSubcategories error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new subcategory
exports.createSubcategory = async (req, res) => {
  try {
    const { name, category, description, price, priceSchedule, isActive } =
      req.body;
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

    // Fiyat ve saat aralığı mantığı:
    let actualPrice = 0;
    let schedule = { activeFrom: "", activeTo: "" };
    if (price > 0) {
      actualPrice = price;
      if (priceSchedule?.activeFrom && priceSchedule?.activeTo) {
        schedule = {
          activeFrom: priceSchedule.activeFrom,
          activeTo: priceSchedule.activeTo,
        };
      }
    }

    const newSubcategory = await Subcategory.create({
      name,
      category,
      image: uploadRes.secure_url,
      publicId: uploadRes.public_id,
      description,
      price: actualPrice,
      priceSchedule: schedule,
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    // displayPrice ekle
    const responseSubcategory = {
      ...newSubcategory.toObject(),
      displayPrice: getActualPrice(
        newSubcategory.price,
        newSubcategory.priceSchedule
      ),
    };
    res.status(201).json(responseSubcategory);
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

exports.updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, price, priceSchedule, isActive } =
      req.body;

    const subcategory = await Subcategory.findById(id);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found." });
    }

    if (price && isNaN(price)) {
      return res.status(400).json({ message: "Price must be a valid number." });
    }

    if (price < 0) {
      return res.status(400).json({ message: "Price cannot be negative." });
    }

    if (price === undefined || price === null || price === "") {
      price = subcategory.price;
    }

    if (priceSchedule) {
      if (
        (priceSchedule.activeFrom && !priceSchedule.activeTo) ||
        (!priceSchedule.activeFrom && priceSchedule.activeTo)
      ) {
        return res.status(400).json({
          message:
            "Başlangıç ve bitiş saatleri birlikte sağlanmalıdır yada birlikte kaldırılmalıdır.",
        });
      }

      if (
        (priceSchedule.activeFrom === undefined &&
          priceSchedule.activeTo === undefined) ||
        (priceSchedule.activeFrom === null &&
          priceSchedule.activeTo === null) ||
        (priceSchedule.activeFrom && priceSchedule.activeTo === "") ||
        (priceSchedule.activeFrom === "" && priceSchedule.activeTo)
      ) {
        return res.status(400).json({
          message: "Both activeFrom and activeTo must be provided.",
        });
      }
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

    // Fiyat ve saat aralığı mantığı:
    let actualPrice = 0;
    let schedule = { activeFrom: "", activeTo: "" };
    if (price > 0) {
      actualPrice = price;
      if (priceSchedule?.activeFrom && priceSchedule?.activeTo) {
        schedule = {
          activeFrom: priceSchedule.activeFrom,
          activeTo: priceSchedule.activeTo,
        };
      }
    }

    subcategory.name = name || subcategory.name;
    subcategory.category = category || subcategory.category;
    subcategory.description = description || subcategory.description;
    subcategory.image = image;
    subcategory.publicId = publicId;
    subcategory.price =
      typeof price !== "undefined" ? actualPrice : subcategory.price;
    subcategory.priceSchedule = schedule;
    subcategory.isActive =
      typeof isActive === "boolean" ? isActive : subcategory.isActive;

    await subcategory.save();

    const responseSubcategory = {
      ...subcategory.toObject(),
      displayPrice: getActualPrice(
        subcategory.price,
        subcategory.priceSchedule
      ),
    };

    res.status(200).json({
      updatedSubcategory: responseSubcategory,
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

    if (
      !id ||
      !mongoose.Types.ObjectId.isValid(id) ||
      id.length !== 24 ||
      id === "" ||
      id === undefined ||
      id === null
    ) {
      return res.status(400).json({ message: "Invalid category ID." });
    }

    const subcategories = await Subcategory.find({ category: id }).populate(
      "category"
    );

    if (!subcategories || subcategories.length === 0) {
      return res.status(404).json({ message: "No subcategories found." });
    }

    res.status(200).json(subcategories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get subcategories", error: error.message });
  }
};
