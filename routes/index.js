const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const ensureAuth = require("../middleware/ensureAuth");

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
router.get("/about", (req, res) => {
  res.render("about", {
    title: "About Us",
    currentPath: "/about",
    user: req.session.user,
  });
});

router.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Contact Us",
    currentPath: "/contact",
    user: req.session.user,
  });
});

router.post("/contact", async (req, res) => {
  // You could send this to email, log it, or store in DB
  console.log("Contact form submitted:", req.body);
  res.redirect("/contact");
});

router.get("/product/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");

    res.render("product-detail", {
      title: product.name,
      product,
      currentPath: req.path,
      user: req.session.user,
      cartCount: req.session.cart?.length || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

router.get("/search/suggestions", async (req, res) => {
  const query = req.query.query || "";
  try {
    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    })
      .select("name imageUrl _id")
      .limit(6);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
});
router.get("/order/confirmation", ensureAuth, (req, res) => {
  res.render("order-confirmation", {
    user: req.user,
  });
});

module.exports = router;
