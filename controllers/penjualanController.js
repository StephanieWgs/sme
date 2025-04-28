const Penjualan = require("../models/penjualan");
const { addStokBB, reduceStokBB } = require("../controllers/BBController");
const { sendNotification } = require("../websocket");

// Create penjualan
exports.createPenjualan = async (req, res) => {
  try {
    const dataPenjualan = new Penjualan(req.body);
    const savedPenjualan = await dataPenjualan.save();

    //kurang stok untuk setiap item penjualan
    for (const item of savedPenjualan.detailPenjualan) {
      await reduceStokBB(item.kodeBB, item.qty);
    }

    // Kirim notifikasi
    sendNotification("Data penjualan berhasil ditambahkan");

    res.status(201).json({
      message: "Penjualan created successfully",
      savedPenjualan,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all penjualan
exports.getAllPenjualan = async (req, res) => {
  try {
    const penjualanList = await Penjualan.find().sort({ createdAt: -1 }).populate("kodeCustomer").populate("detailPenjualan.kodeBB");
    res.status(200).json(penjualanList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get penjualan by id
exports.getPenjualanById = async (req, res) => {
  try {
    const { id } = req.params;
    const penjualan = await Penjualan.findById(id).populate("kodeCustomer").populate("detailPenjualan.kodeBB");

    if (!penjualan) return res.status(404).json({ error: "Penjualan not found" });

    res.status(200).json(penjualan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update penjualan
exports.updatePenjualan = async (req, res) => {
  console.log("Received data:", req.body); // Menampilkan data yang diterima

  try {
    const { id } = req.params;
    let penjualan = await Penjualan.findById(id);
    if (!penjualan) {
      return res.status(404).json({ error: "Penjualan not found" });
    }

    // Jika ada perubahan pada qty, maka kembalikan stok lama dan tambahkan stok baru
    // 1. Kembalikan stok lama
    for (const item of penjualan.detailPenjualan) {
      await reduceStokBB(item.kodeBB, item.qty); // kembalikan stok lama
    }

    // 2. Update data penjualan
    const updatedData = req.body;

    // Pastikan data yang diterima sesuai dan valid
    if (!updatedData.noInv || !updatedData.tglPenjualan || !updatedData.kodeCustomer || updatedData.detailPenjualan.length === 0) {
      return res.status(400).json({ error: "Harap lengkapi semua field yang diperlukan" });
    }

    // Update penjualan
    penjualan.set(updatedData);
    const updatedPenjualan = await penjualan.save();

    // 3. Tambahkan stok baru
    for (const item of updatedPenjualan.detailPenjualan) {
      await addStokBB(item.kodeBB, item.qty);
    }

    res.status(200).json({
      message: "Penjualan updated successfully",
      updatedPenjualan,
    });
  } catch (error) {
    console.error("Error updating penjualan:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete penjualan
exports.deletePenjualan = async (req, res) => {
  try {
    const { id } = req.params;
    const penjualan = await Penjualan.findById(id);
    if (!penjualan) return res.status(404).json({ error: "Penjualan not found" });

    // Tambah stok sesuai data penjualan yang dihapus
    for (const item of penjualan.detailPenjualan) {
      await addStokBB(item.kodeBB, item.qty);
    }

    const deletedPenjualan = await Penjualan.findByIdAndDelete(id);

    // Kirim notifikasi
    sendNotification("Data penjualan berhasil dihapus");

    res.status(200).json({
      message: "Penjualan deleted successfully",
      deletedPenjualan,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
