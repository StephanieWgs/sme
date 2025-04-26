const express = require("express");
const router = express.Router();
const penjualanController = require("../controllers/penjualanController");

//Middleware
const authMiddleware = require('../middlewares/authMiddleware'); 
router.use(authMiddleware);

// Routes untuk mendapatkan semua penjualan
router.get("/", penjualanController.getAllPenjualan);

// Routes untuk mendapatkan penjualan berdasarkan id
router.get("/:id", penjualanController.getPenjualanById);

// Routes untuk membuat penjualan
router.post("/", penjualanController.createPenjualan);

// Routes untuk memperbarui penjualan
router.put("/:id", penjualanController.updatePenjualan);

// Routes untuk menghapus penjualan
router.delete("/:id", penjualanController.deletePenjualan);

module.exports = router;
