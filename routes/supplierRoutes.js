const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");

//Middleware
const authMiddleware = require('../middlewares/authMiddleware'); 
router.use(authMiddleware);

// Routes untuk mendapatkan semua supplier
router.get("/", supplierController.getAllSupplier);

// Routes untuk mendapatkan supplier berdasarkan id
router.get("/:id", supplierController.getSupplierById);

// Routes untuk membuat supplier
router.post("/", supplierController.createSupplier);

// Routes untuk memperbarui supplier
router.put("/:id", supplierController.updateSupplier);

// Routes untuk menghapus supplier
router.delete("/:id", supplierController.deleteSupplier);

module.exports = router;
