const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
require("dotenv").config();

const BBRoutes = require("./routes/BBRoutes");
const jenisBBRoutes = require("./routes/jenisBBRoutes");
const pembelianRoutes = require("./routes/pembelianRoutes");
const penjualanRoutes = require("./routes/penjualanRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const customerRoutes = require("./routes/customerRoutes");
const authRoutes = require("./routes/authRoutes");

const authMiddleware = require("./middlewares/authMiddleware"); // Import authMiddleware

//Websocket
const { initWebSocket } = require("./websocket");
const server = http.createServer(app);
initWebSocket(server);

//Port
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
app.use(cookieParser());
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
app.get("/dashboard", authMiddleware, (req, res) => {
  res.render("layout", {
    title: "Dashboard",
    body: "dashboard",
    activePage: "dashboard",
  });
});

// Rute untuk halaman Produk
app.get("/produk", authMiddleware, (req, res) => {
  res.render("layout", {
    title: "Produk",
    body: "produk",
    activePage: "produk",
  });
});

// Rute untuk halaman jenisBB
app.get("/jenisBB", authMiddleware, (req, res) => {
  res.render("layout", {
    title: "Jenis Produk",
    body: "jenisBB",
    activePage: "jenisBB",
  });
});

// Rute untuk halaman Penjualan
app.get("/penjualan", authMiddleware, (req, res) => {
  res.render("layout", {
    title: "Penjualan",
    body: "penjualan",
    activePage: "penjualan",
  });
});

// Rute untuk tambah penjualan
app.get("/tambahPenjualan", (req, res) => {
  res.render("layout", {
    title: "Tambah Penjualan",
    body: "tambahPenjualan",
    activePage: "penjualan",
  });
});

// Rute untuk edit penjualan
app.get("/editPenjualan/:id", (req, res) => {
  res.render("layout", {
    title: "Edit Penjualan",
    body: "editPenjualan",
    activePage: "penjualan",
  });
});

// Rute untuk halaman Pembelian
app.get("/pembelian", authMiddleware, (req, res) => {
  res.render("layout", {
    title: "Pembelian",
    body: "pembelian",
    activePage: "pembelian",
  });
});

// Rute untuk tambah pembelian
app.get("/tambahPembelian", (req, res) => {
  res.render("layout", {
    title: "Tambah Pembelian",
    body: "tambahPembelian",
    activePage: "pembelian",
  });
});

// Rute untuk edit pembelian
app.get("/editPembelian/:id", (req, res) => {
  res.render("layout", {
    title: "Edit Pembelian",
    body: "editPembelian",
    activePage: "pembelian",
  });
});

// Rute untuk halaman Customer
app.get("/customer", authMiddleware, (req, res) => {
  res.render("layout", {
    title: "Customer",
    body: "customer",
    activePage: "customer",
  });
});

// Rute untuk halaman Supplier
app.get("/supplier", authMiddleware, (req, res) => {
  res.render("layout", {
    title: "Supplier",
    body: "supplier",
    activePage: "supplier",
  });
});

// Rute untuk halaman user
app.get("/user", authMiddleware, (req, res) => {
  res.render("layout", {
    title: "User",
    body: "user",
    activePage: "user",
  });
});

//Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
