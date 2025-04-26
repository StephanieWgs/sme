const express = require("express");
const mongoose = require("mongoose");
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

// Rute halaman
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

//Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
