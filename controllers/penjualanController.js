const Penjualan = require("../models/penjualan");
const { addStokBB, reduceStokBB } = require("../controllers/BBController");

// Create pembelian
exports.createPenjualan = async (req, res) => {
  try {
    const dataPenjualan = new Penjualan(req.body);
    const savedPenjualan = await dataPenjualan.save();

    //kurang stok untuk setiap item penjualan 
    for (const item of savedPenjualan.detailPenjualan) {
      await reduceStokBB(item.kodeBB, item.qty);
    }

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
  try {
    const { id } = req.params;
    let penjualan = await Penjualan.findById(id);
    if (!penjualan) return res.status(404).json({ error: "Penjualan not found" });

    // Jika ada perubahan pada qty, maka kembalikan stok lama dan tambahkan stok baru
    // 1. Kembalikan stok lama
    for (const item of penjualan.detailPenjualan) {
      await reduceStokBB(item.kodeBB, item.qty); // ini berarti stok dikembalikan
    }

    // 2. Update data
    penjualan.set(req.body);
    penjualan.prosesPerhitungan();

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

    res.status(200).json({
      message: "Penjualan deleted successfully",
      deletedPenjualan,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
