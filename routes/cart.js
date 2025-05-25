const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");

let cart = [];

router.post("/add", async (req, res) => {
  const product = await Product.findById(req.body.productId);
  cart.push({ product, quantity: parseInt(req.body.quantity) });
  res.redirect("/cart");
});

router.get("/", (req, res) => {
  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  res.render("cart", { title: "Your Cart", cart, total });
});

router.post("/checkout", async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
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
  cart = [];
  res.redirect("/");
});

module.exports = router;
