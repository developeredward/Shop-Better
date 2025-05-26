const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "ejsstore",
    resave: false,
    saveUninitialized: false,
  })
);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Auth Middleware to make user available in all views
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// Import routes
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const indexRoutes = require("./routes/index");

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (["POST", "PUT"].includes(req.method)) {
    console.log("Body:", req.body);
  }
  next();
});

// Use routes
app.use("/", indexRoutes);
app.use("/admin", adminRoutes);
app.use("/", authRoutes); // login, register, logout
app.use("/cart", cartRoutes);

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server started on port ", process.env.PORT || 3000);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

startServer();
