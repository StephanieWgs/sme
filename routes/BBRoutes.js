const express = require("express");
const router = express.Router();
const BBController = require("../controllers/BBController");

//Middleware
const authMiddleware = require('../middlewares/authMiddleware'); 
router.use(authMiddleware);

// Routes untuk mendapatkan semua BB
router.get("/", BBController.getAllBB);

// Routes untuk mendapatkan BB berdasarkan id
router.get("/:id", BBController.getBBById);

// Routes untuk membuat BB
router.post("/", BBController.createBB);

// Routes untuk memperbarui BB
router.put("/:id", BBController.updateBB);

// Routes untuk menghapus BB
router.delete("/:id", BBController.deleteBB);

module.exports = router;
