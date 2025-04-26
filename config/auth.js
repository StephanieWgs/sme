// Auth menggunakan jsonwebtoken

const jwt = require("jsonwebtoken");
require("dotenv").config();

// Generate Token yang berisi id user & berlaku selama 1 jam
const generateToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: "1h" }); // Disini id akan disimpan di payload
};

// Verifikasi Token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
