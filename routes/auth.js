const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Show login form
router.get("/login", (req, res) => res.render("login", { title: "Login" }));

// Login POST
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    req.session.user = user;
    res.redirect("/");
  } else {
    res.render("login", {
      title: "login",
      error: "Invalid email or password",
    });
  }
});

// Show register form
router.get("/register", (req, res) =>
  res.render("register", { title: "Register" })
);

// Register POST
router.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new User({ ...req.body, password: hashedPassword });
  await user.save();
  req.session.user = user;
  res.redirect("/");
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
