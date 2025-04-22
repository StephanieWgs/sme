const express = require("express");
const router = express.Router();
const jenisBBController = require("../controllers/jenisBBController");

// Routes untuk mendapatkan semua jenisBB
router.get("/", jenisBBController.getAllJenisBB);

// Routes untuk mendapatkan jenisBB berdasarkan id
router.get("/:id", jenisBBController.getJenisBBById);

// Routes untuk membuat jenisBB
router.post("/", jenisBBController.createJenisBB);

// Routes untuk memperbarui jenisBB
router.put("/:id", jenisBBController.updateJenisBB);

// Routes untuk menghapus jenisBB
router.delete("/:id", jenisBBController.deleteJenisBB);

module.exports = router;
