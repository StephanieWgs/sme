const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");
const validateFields = require("../middlewares/validateMiddleware");

const supplierFields = ["kodeSupplier", "namaSupplier", "alamatSupplier", "noHPSupplier", "emailSupplier"];

// Routes untuk mendapatkan semua supplier
router.get("/", supplierController.getAllSupplier);

// Routes untuk mendapatkan supplier berdasarkan id
router.get("/:id", supplierController.getSupplierById);

// Routes untuk membuat supplier
router.post("/", validateFields(supplierFields), supplierController.createSupplier);

// Routes untuk memperbarui supplier
router.put("/:id", validateFields(supplierFields), supplierController.updateSupplier);

// Routes untuk menghapus supplier
router.delete("/:id", supplierController.deleteSupplier);

module.exports = router;
