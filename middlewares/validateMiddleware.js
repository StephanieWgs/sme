// Middleware untuk validasi input (semua field wajib diisi)
const validateFields = (requiredFields) => {
  return (req, res, next) => {
    const errors = [];
    requiredFields.forEach((field) => {
      if (!req.body[field] || req.body[field].toString().trim() === "") {
        errors.push(`${field} harus diisi`);
      }
    });
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    next();
  };
};

module.exports = validateFields;
