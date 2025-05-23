const { BB, STATUS_SAFE, STATUS_NEED_RESTOCK, STATUS_OUT_OF_STOCK } = require("../models/BB");
const { sendNotification } = require("../websocket");

//Create BB
exports.createBB = async (req, res) => {
  const { kodeBB, namaBB, jenisBB, unitBB, stok, avgLeadTime, maxLeadTime, avgUsage, maxUsage } = req.body;

  // Konversi string menjadi number (agar data tersimpan dengan tipe yang benar)
  const convertedStok = Number(stok);
  const convertedAvgLeadTime = Number(avgLeadTime);
  const convertedMaxLeadTime = Number(maxLeadTime);
  const convertedAvgUsage = Number(avgUsage);
  const convertedMaxUsage = Number(maxUsage);

  try {
    const newBB = new BB({
      kodeBB,
      namaBB,
      jenisBB,
      unitBB,
      stok: convertedStok,
      avgLeadTime: convertedAvgLeadTime,
      maxLeadTime: convertedMaxLeadTime,
      avgUsage: convertedAvgUsage,
      maxUsage: convertedMaxUsage,
    });

    const savedBB = await newBB.save();

    // Kirim notifikasi
    sendNotification(`Produk ${namaBB} berhasil ditambahkan`);

    res.status(201).json({
      message: "BB created successfully",
      savedBB,
    });
  } catch (error) {
    console.error("Error while creating BB:", error);
    res.status(500).json({ error: error.message });
  }
};

//Get all BB
exports.getAllBB = async (req, res) => {
  try {
    //-1 = Z → A, 10 → 1, Terbaru → Terlama
    // 1 = A → Z, 1 → 10, Terlama → Terbaru
    const BBs = await BB.find().sort({ createdAt: -1 }).populate("jenisBB");
    res.status(200).json(BBs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get BB by id
exports.getBBById = async (req, res) => {
  try {
    const { id } = req.params;
    const BBById = await BB.findById(id).populate("jenisBB");
    if (!BBById) return res.status(404).json({ error: "BB not found" });
    res.status(200).json(BBById);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Update BB
exports.updateBB = async (req, res) => {
  try {
    const { id } = req.params;
    const { kodeBB, namaBB, jenisBB, unitBB, stok, avgLeadTime, maxLeadTime, avgUsage, maxUsage } = req.body;

    // Cari BB berdasarkan id dan update data yang dikirim
    const updatedBB = await BB.findById(id);

    if (!updatedBB) return res.status(404).json({ error: "BB not found" });

    // Update data yang diterima
    updatedBB.kodeBB = kodeBB || updatedBB.kodeBB;
    updatedBB.namaBB = namaBB || updatedBB.namaBB;
    updatedBB.jenisBB = jenisBB || updatedBB.jenisBB;
    updatedBB.unitBB = unitBB || updatedBB.unitBB;
    updatedBB.stok = stok || updatedBB.stok;
    updatedBB.avgLeadTime = avgLeadTime || updatedBB.avgLeadTime;
    updatedBB.maxLeadTime = maxLeadTime || updatedBB.maxLeadTime;
    updatedBB.avgUsage = avgUsage || updatedBB.avgUsage;
    updatedBB.maxUsage = maxUsage || updatedBB.maxUsage;

    // Hitung ulang safety stock dan status
    updatedBB.safetyStock = updatedBB.hitungSafetyStock();
    updatedBB.status = updatedBB.statusStock();

    // Simpan perubahan ke database
    await updatedBB.save();

    // Kirim notifikasi
    sendNotification("Data produk berhasil diupdate");

    res.status(200).json({
      message: "BB updated successfully",
      updatedBB,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Delete BB
exports.deleteBB = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBB = await BB.findByIdAndDelete(id);
    if (!deletedBB) return res.status(404).json({ error: "BB not found" });

    // Kirim notifikasi
    sendNotification("Data produk berhasil dihapus");

    res.status(200).json({
      message: "BB deleted successfully",
      deletedBB,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Add Stok BB
exports.addStokBB = async (kodeBB, qty) => {
  const bb = await BB.findOne({ kodeBB: kodeBB });
  if (bb) {
    bb.stok += qty;
    const updatedBB = await bb.save();
    return updatedBB;
  }
};

//Reduce Stok BB
exports.reduceStokBB = async (kodeBB, qty) => {
  const bb = await BB.findOne({ kodeBB: kodeBB });
  if (bb) {
    bb.stok -= qty;
    const updatedBB = await bb.save();
    return updatedBB;
  }
};

// Dapat nama BB berdasarkan kode
exports.getBBNameByCode = async (req, res) => {
  try {
    const { kodeBB } = req.params;
    const bb = await BB.findOne({ kodeBB: kodeBB });
    if (!bb) return res.status(404).json({ error: "BB not found" });
    res.status(200).json({ namaBB: bb.namaBB });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Hitung banyak BB dengan status tertentu
exports.countStatus = async (req, res) => {
  try {
    const needRestock = await BB.countDocuments({ status: STATUS_NEED_RESTOCK });
    const outOfStock = await BB.countDocuments({ status: STATUS_OUT_OF_STOCK });
    const safe = await BB.countDocuments({ status: STATUS_SAFE });

    res.status(200).json({ needRestock, outOfStock, safe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
