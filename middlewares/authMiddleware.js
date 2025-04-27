// Middleware untuk Authentication

const { verifyToken } = require("../config/auth");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Ambil token dari cookie, jika ada
  if (!token) {
    return res.redirect("/");
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Menyimpan informasi pengguna dalam objek req
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = authMiddleware;
