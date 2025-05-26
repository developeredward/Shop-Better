const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");
const ensureAuth = require("../middleware/ensureAuth");
const { title } = require("process");

router.post("/add", async (req, res) => {
  const product = await Product.findById(req.body.productId);
  const quantity = parseInt(req.body.quantity);

  if (!req.session.cart) req.session.cart = [];

  // Check if product already exists in cart
  const existingIndex = req.session.cart.findIndex(
    (item) => item.product._id.toString() === product._id.toString()
  );

  if (existingIndex > -1) {
    req.session.cart[existingIndex].quantity += quantity;
  } else {
    req.session.cart.push({ product, quantity });
  }

  res.redirect("/");
});

router.get("/", (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  res.render("cart", { title: "Your Cart", cart, total });
});
router.get("/checkout", ensureAuth, (req, res) => {
  const cart = req.session.cart || [];
  const total = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  res.render("checkout", { title: "Checkout", cart, total });
});

router.post("/checkout", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");

  const cart = req.session.cart || [];
  if (cart.length === 0) return res.redirect("/cart");

  const order = new Order({
    userId: req.session.user._id,
    products: cart.map((item) => ({
      productId: item.product._id,
      quantity: item.quantity,
    })),
    amount: cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ),
  });

  await order.save();
  req.session.cart = []; // clear after checkout
  res.redirect("/");
});

router.post("/remove/:productId", (req, res) => {
  const productId = req.params.productId;

  if (!req.session.cart) {
    return res.redirect("/cart");
  }

  // Filter out the item to remove by product ID
  req.session.cart = req.session.cart.filter(
    (item) => item.product._id !== productId
  );

  // Optionally, recalculate total or do other logic here

  res.redirect("/cart");
});
router.post("/remove-all", (req, res) => {
  req.session.cart = []; // Empty the cart array
  res.redirect("/cart");
});

module.exports = router;
