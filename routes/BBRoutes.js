const express = require("express");
const router = express.Router();
const BBController = require("../controllers/BBController");
const validateFields = require("../middlewares/validateMiddleware");

const bbFields = ["kodeBB", "namaBB", "jenisBB", "unitBB", "stok", "avgLeadTime", "maxLeadTime", "avgUsage", "maxUsage"];

// Routes untuk mendapatkan jumlah BB dengan status tertentu
router.get("/count-status", BBController.countStatus);

// Routes untuk mendapatkan semua BB
router.get("/", BBController.getAllBB);

// Routes untuk mendapatkan BB berdasarkan id
router.get("/:id", BBController.getBBById);

// Routes untuk membuat BB
router.post("/", validateFields(bbFields), BBController.createBB);

// Routes untuk memperbarui BB
router.put("/:id", validateFields(bbFields), BBController.updateBB);

// Routes untuk menghapus BB
router.delete("/:id", BBController.deleteBB);

// Routes untuk mendapatkan BB berdasarkan kode
router.get("/nama/:kodeBB", BBController.getBBNameByCode);

module.exports = router;
