const express = require("express");
const router = express.Router();
const pembelianController = require("../controllers/pembelianController");

// Routes untuk mendapatkan semua pembelian
router.get("/", pembelianController.getAllPembelian);

// Routes untuk mendapatkan pembelian berdasarkan id
router.get("/:id", pembelianController.getPembelianById);

// Routes untuk membuat pembelian
router.post("/", pembelianController.createPembelian);

// Routes untuk memperbarui pembelian
router.put("/:id", pembelianController.updatePembelian);

// Routes untuk menghapus pembelian
router.delete("/:id", pembelianController.deletePembelian);

module.exports = router;
