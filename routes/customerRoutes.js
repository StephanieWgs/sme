const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const validateFields = require("../middlewares/validateMiddleware");

const customerFields = ["kodeCustomer", "namaCustomer", "alamatCustomer", "noHPCustomer", "emailCustomer"];

// Routes untuk mendapatkan semua customer
router.get("/", customerController.getAllCustomer);

// Routes untuk mendapatkan customer berdasarkan id
router.get("/:id", customerController.getCustomerById);

// Routes untuk membuat customer
router.post("/", validateFields(customerFields), customerController.createCustomer);

// Routes untuk memperbarui customer
router.put("/:id", validateFields(customerFields), customerController.updateCustomer);

// Routes untuk menghapus customer
router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
