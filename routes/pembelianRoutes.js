const express = require("express");
const router = express.Router();
const pembelianController = require("../controllers/pembelianController");
const validateFields = require("../middlewares/validateMiddleware");

const pembelianFields = ["noInv", "tglPembelian", "kodeSupplier", "detailPembelian", "ppnPembelian", "totalPembelian"];

// Routes untuk mendapatkan semua pembelian
router.get("/", pembelianController.getAllPembelian);

// Routes untuk mendapatkan pembelian berdasarkan id
router.get("/:id", pembelianController.getPembelianById);

// Routes untuk membuat pembelian
router.post("/", validateFields(pembelianFields), pembelianController.createPembelian);

// Routes untuk memperbarui pembelian
router.put("/:id", validateFields(pembelianFields), pembelianController.updatePembelian);

// Routes untuk menghapus pembelian
router.delete("/:id", pembelianController.deletePembelian);

module.exports = router;
