const express = require("express");
const router = express.Router();
const penjualanController = require("../controllers/penjualanController");
const validateFields = require("../middlewares/validateMiddleware");

const penjualanFields = ["noInv", "tglPenjualan", "kodeCustomer", "detailPenjualan", "ppnPenjualan", "totalPenjualan"];

// Routes untuk mendapatkan semua penjualan
router.get("/", penjualanController.getAllPenjualan);

// Routes untuk mendapatkan penjualan berdasarkan id
router.get("/:id", penjualanController.getPenjualanById);

// Routes untuk membuat penjualan
router.post("/", validateFields(penjualanFields), penjualanController.createPenjualan);

// Routes untuk memperbarui penjualan
router.put("/:id", validateFields(penjualanFields), penjualanController.updatePenjualan);

// Routes untuk menghapus penjualan
router.delete("/:id", penjualanController.deletePenjualan);

module.exports = router;
