const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).limit(5);
    const flashSaleProducts = await Product.find({ isFlashSale: true }).limit(
      10
    );
    const categories = await Product.distinct("category");
    const products = await Product.find().limit(20); // fetch all or paginated

    res.render("index", {
      title: "ShopBetter - Home",
      featuredProducts,
      flashSaleProducts,
      categories,
      products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
