const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const BBRoutes = require("./routes/BBRoutes");
const jenisBBRoutes = require("./routes/jenisBBRoutes");
const pembelianRoutes = require("./routes/pembelianRoutes");
const penjualanRoutes = require("./routes/penjualanRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const customerRoutes = require("./routes/customerRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

//Koneksi ke database
require("./config/db");

//Set EJS sebagai view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Menyajikan folder public sebagai folder statis
app.use(express.static("public"));

//Middleware
app.use(cors());
app.use(express.json());

//Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

//Routes
app.use("/api/BB", BBRoutes);
app.use("/api/jenisBB", jenisBBRoutes);
app.use("/api/pembelian", pembelianRoutes);
app.use("/api/penjualan", penjualanRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/auth", authRoutes);

// Rute halaman login
app.get("/", (req, res) => {
  res.render("index");
});

// Rute untuk halaman Dashboard
app.get("/dashboard", (req, res) => {
  res.render("layout", {
    title: "Dashboard",
    body: "dashboard",
    activePage: "dashboard",
  });
});

// Rute untuk halaman Produk
app.get("/produk", (req, res) => {
  res.render("layout", {
    title: "Produk",
    body: 'produk',
    activePage: "produk",
  });
});

// Rute untuk halaman Penjualan
app.get("/penjualan", (req, res) => {
  res.render("layout", {
    title: "Penjualan",
    body: 'penjualan',
    activePage: "penjualan",
  });
});

// Rute untuk halaman Pembelian
app.get("/pembelian", (req, res) => {
  res.render("layout", {
    title: "Pembelian",
    body: 'pembelian',
    activePage: "pembelian",
  });
});

// Rute untuk halaman Customer
app.get("/customer", (req, res) => {
  res.render("layout", {
    title: "Customer",
    body: 'customer',
    activePage: "customer",
  });
});

// Rute untuk halaman Supplier
app.get("/supplier", (req, res) => {
  res.render("layout", {
    title: "Supplier",
    body: 'supplier',
    activePage: "supplier",
  });
});

// Rute untuk halaman user
app.get("/user", (req, res) => {
  res.render("layout", {
    title: "User",
    body: 'user',
    activePage: "user",
  });
});

//Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
