const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// Routes untuk dapat semua user
router.get("/", authController.getAllUser);

// Routes untuk menghapus user
router.delete("/:id", authController.deleteUser);

module.exports = router;
