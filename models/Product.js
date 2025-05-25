const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: {
    type: String,
    enum: [
      "Watches",
      "Phones",
      "Computers",
      "Accessories",
      "Clothing",
      "Other",
    ],
  },
  tags: [String], // New: array of strings
  isFeatured: { type: Boolean, default: false },
  isFlashSale: { type: Boolean, default: false },
  discountActive: { type: Boolean, default: false },
  discountPercent: { type: Number, default: 0 },
  imageUrl: String,
});

module.exports = mongoose.model("Product", productSchema);
