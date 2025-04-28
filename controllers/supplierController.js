const supplier = require("../models/supplier");
const { sendNotification } = require("../websocket");

// Create supplier
exports.createSupplier = async (req, res) => {
  try {
    const { kodeSupplier, namaSupplier, alamatSupplier, noHPSupplier, emailSupplier } = req.body;
    const newSupplier = new supplier({ kodeSupplier, namaSupplier, alamatSupplier, noHPSupplier, emailSupplier });
    const savedSupplier = await newSupplier.save();

    // Kirim notifikasi
    sendNotification(`Supplier ${namaSupplier} berhasil ditambahkan`);

    res.status(201).json({
      message: "Supplier created successfully",
      savedSupplier,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all supplier
exports.getAllSupplier = async (req, res) => {
  try {
    const suppliers = await supplier.find().sort({ createdAt: -1 });
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get supplier by id
exports.getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const supplierById = await supplier.findById(id);
    if (!supplierById) return res.status(404).json({ error: "Supplier not found" });
    res.status(200).json(supplierById);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update supplier
exports.updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { kodeSupplier, namaSupplier, alamatSupplier, noHPSupplier, emailSupplier } = req.body;
    const updatedSupplier = await supplier.findByIdAndUpdate(id, { kodeSupplier, namaSupplier, alamatSupplier, noHPSupplier, emailSupplier }, { new: true });
    if (!updatedSupplier) return res.status(404).json({ error: "Supplier not found" });

    // Kirim notifikasi
    sendNotification("Data supplier berhasil diupdate");

    res.status(200).json({
      message: "Supplier updated successfully",
      updatedSupplier,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete supplier
exports.deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSupplier = await supplier.findByIdAndDelete(id);
    if (!deletedSupplier) return res.status(404).json({ error: "Supplier not found" });

    // Kirim notifikasi
    sendNotification("Data supplier berhasil dihapus");

    res.status(200).json({
      message: "Supplier deleted successfully",
      deletedSupplier,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
