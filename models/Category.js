const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    translations: {
      tr: { type: String, default: "" },
      en: { type: String, default: "" },
      ru: { type: String, default: "" },
      de: { type: String, default: "" },
      fr: { type: String, default: "" },
    },
    image: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

CategorySchema.pre("validate", function (next) {
  if (this.name) {
    this.translations = this.translations || {};
    this.translations.tr = this.name;
  }
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
