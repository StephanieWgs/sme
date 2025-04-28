const Pembelian = require("../models/pembelian");
const { addStokBB, reduceStokBB } = require("./BBController");
const { sendNotification } = require("../websocket");

// Create pembelian
exports.createPembelian = async (req, res) => {
  try {
    const dataPembelian = new Pembelian(req.body);
    const savedPembelian = await dataPembelian.save();

    //Tambah stok untuk setiap item pembelian
    for (const item of savedPembelian.detailPembelian) {
      await addStokBB(item.kodeBB, item.qty);
    }

    // Kirim notifikasi
    sendNotification("Data pembelian berhasil ditambahkan");

    res.status(201).json({
      message: "Pembelian created successfully",
      savedPembelian,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all pembelian
exports.getAllPembelian = async (req, res) => {
  try {
    const pembelianList = await Pembelian.find().sort({ createdAt: -1 }).populate("kodeSupplier").populate("detailPembelian.kodeBB");
    res.status(200).json(pembelianList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get pembelian by id
exports.getPembelianById = async (req, res) => {
  try {
    const { id } = req.params;
    const pembelian = await Pembelian.findById(id).populate("kodeSupplier").populate("detailPembelian.kodeBB");

    if (!pembelian) return res.status(404).json({ error: "Pembelian not found" });

    res.status(200).json(pembelian);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update pembelian
exports.updatePembelian = async (req, res) => {
  try {
    const { id } = req.params;
    let pembelian = await Pembelian.findById(id);
    if (!pembelian) return res.status(404).json({ error: "Pembelian not found" });

    // Jika ada perubahan pada qty, maka kembalikan stok lama dan tambahkan stok baru
    // 1. Kembalikan stok lama
    for (const item of pembelian.detailPembelian) {
      await reduceStokBB(item.kodeBB, item.qty); // ini berarti stok dikembalikan
    }

    // 2. Update data
    pembelian.set(req.body);
    pembelian.prosesPerhitungan();

    const updatedPembelian = await pembelian.save();

    // 3. Tambahkan stok baru
    for (const item of updatedPembelian.detailPembelian) {
      await addStokBB(item.kodeBB, item.qty);
    }

    // Kirim notifikasi
    sendNotification("Data pembelian berhasil diupdate");

    res.status(200).json({
      message: "Pembelian updated successfully",
      updatedPembelian,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete pembelian
exports.deletePembelian = async (req, res) => {
  try {
    const { id } = req.params;
    const pembelian = await Pembelian.findById(id);
    if (!pembelian) return res.status(404).json({ error: "Pembelian not found" });

    // Kurangi stok sesuai data pembelian
    for (const item of pembelian.detailPembelian) {
      await reduceStokBB(item.kodeBB, item.qty);
    }

    const deletedPembelian = await Pembelian.findByIdAndDelete(id);

    // Kirim notifikasi
    sendNotification("Data pembelian berhasil dihapus");

    res.status(200).json({
      message: "Pembelian deleted successfully",
      deletedPembelian,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
