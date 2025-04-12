const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const BBRoutes = require("./routes/BBRoutes");
const jenisBBRoutes = require("./routes/jenisBBRoutes");
const pembelianRoutes = require("./routes/pembelianRoutes");
const supplierRoutes = require("./routes/supplierRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

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
app.use("/api/supplier", supplierRoutes);

//Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));