const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

//Middleware
const authMiddleware = require('../middlewares/authMiddleware'); 
router.use(authMiddleware);

// Routes untuk mendapatkan semua customer
router.get("/", customerController.getAllCustomer);

// Routes untuk mendapatkan customer berdasarkan id
router.get("/:id", customerController.getCustomerById);

// Routes untuk membuat customer
router.post("/", customerController.createCustomer);

// Routes untuk memperbarui customer
router.put("/:id", customerController.updateCustomer);

// Routes untuk menghapus customer
router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
