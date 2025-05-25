const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { isAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Admin dashboard
router.get("/", isAdmin, async (req, res) => {
  const [products, orders, users] = await Promise.all([
    Product.find(),
    Order.find().populate("userId").populate("products.productId"),
    User.find(),
  ]);
  res.render("admin/dashboard", {
    title: "Admin Dashboard",
    products,
    orders,
    users,
  });
});

// Admin login page
router.get("/login", (req, res) => {
  res.render("admin/login", { title: "Admin Login" });
});

// Admin login POST
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !user.isAdmin) {
    return res.render("admin/login", {
      title: "Admin Login",
      error: "Invalid credentials or not an admin.",
    });
  }

  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) {
    return res.render("admin/login", {
      title: "Admin Login",
      error: "Invalid credentials.",
    });
  }

  req.session.user = user;
  res.redirect("/admin");
});

// Admin product list
router.get("/products", isAdmin, async (req, res) => {
  const products = await Product.find();
  res.render("admin/products", { title: "Admin - Products", products });
});

// Admin add product form
router.get("/products/add", isAdmin, (req, res) => {
  res.render("admin/add-product", { title: "Admin - Add Product" });
});

router.get("/products/edit/:id", isAdmin, async (req, res) => {
  const product = await Product.findById(req.params.id);
  const categories = ["Clothing", "Phones", "Computers", "Watches"];
  const tagsByCategory = {
    Clothing: ["Men", "Women", "Children"],
    Phones: ["Android", "iPhone", "Accessories"],
    Computers: ["Laptops", "Desktops", "Accessories"],
    Watches: ["Smartwatches", "Analog", "Digital"],
  };
  res.render("admin/edit-product", { product, categories, tagsByCategory });
});

router.post(
  "/products/edit/:id",
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        category,
        isFeatured,
        isFlashSale,
        discountActive,
        discountPercent,
        tags,
      } = req.body;

      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).send("Product not found");

      product.name = name;
      product.description = description;
      product.price = parseFloat(price);
      product.category = category;
      product.tags = Array.isArray(tags)
        ? tags
        : tags?.split(",").map((tag) => tag.trim()) || [];
      product.isFeatured = !!isFeatured;
      product.isFlashSale = !!isFlashSale;
      product.discountActive = !!discountActive;
      product.discountPercent = discountActive ? discountPercent : 0;

      // Handle optional image update
      if (req.file) {
        product.imageUrl = `/uploads/${req.file.filename}`;
      }

      await product.save();
      res.redirect("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).send("Internal server error");
    }
  }
);
// DELETE a product
router.post("/products/delete/:id", isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/admin/products");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send("Failed to delete product");
  }
});

// Admin add product POST
router.post(
  "/products/add",
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    const {
      name,
      description,
      price,
      category,
      isFeatured,
      isFlashSale,
      discountActive,
      discountPercent,
      tags,
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      tags: Array.isArray(tags)
        ? tags
        : tags?.split(",").map((tag) => tag.trim()) || [],
      isFeatured: !!isFeatured,
      isFlashSale: !!isFlashSale,
      discountActive: !!discountActive,
      discountPercent: discountActive ? discountPercent : 0,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : "",
    });

    await product.save();
    res.redirect("/admin/products");
  }
);

// Admin registration (special route)
router.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const isAdminFlag = req.body.email === "admin@example.com"; // you can customize this
  const user = new User({
    ...req.body,
    password: hashedPassword,
    isAdmin: isAdminFlag,
  });
  await user.save();
  req.session.user = user;
  res.redirect("/");
});

// Admin orders list
router.get("/orders", isAdmin, async (req, res) => {
  const orders = await Order.find()
    .populate("userId")
    .populate("products.productId");
  res.render("admin/orders", { title: "Admin - Orders", orders });
});

module.exports = router;
