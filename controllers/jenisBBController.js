const JenisBB = require("../models/jenisBB");
const { sendNotification } = require("../websocket");

// Create jenisBB
exports.createJenisBB = async (req, res) => {
  const { jenisBB } = req.body;
  try {
    const newJenisBB = new JenisBB({ jenisBB });
    const savedJenisBB = await newJenisBB.save();

    // Kirim notifikasi
    sendNotification(`Jenis produk ${jenisBB} berhasil ditambahkan`);

    res.status(201).json({
      message: "JenisBB created successfully",
      savedJenisBB,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all jenisBB
exports.getAllJenisBB = async (req, res) => {
  try {
    const jenisBBs = await JenisBB.find().sort({ createdAt: -1 });
    res.status(200).json(jenisBBs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get jenisBB by id
exports.getJenisBBById = async (req, res) => {
  try {
    const { id } = req.params;
    const jenisBB = await JenisBB.findById(id);
    res.status(200).json(jenisBB);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update jenisBB
exports.updateJenisBB = async (req, res) => {
  try {
    const { id } = req.params;
    const { jenisBB } = req.body;
    const updatedJenisBB = await JenisBB.findByIdAndUpdate(id, { jenisBB }, { new: true });
    if (!updatedJenisBB) return res.status(404).json({ error: "JenisBB not found" });

    // Kirim notifikasi
    sendNotification("Data jenis produk berhasil diupdate");

    res.status(200).json({
      message: "JenisBB updated successfully",
      updatedJenisBB,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete jenisBB
exports.deleteJenisBB = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJenisBB = await JenisBB.findByIdAndDelete(id);
    if (!deletedJenisBB) return res.status(404).json({ error: "JenisBB not found" });

    // Kirim notifikasi
    sendNotification("Data jenis produk berhasil dihapus");

    res.status(200).json({
      message: "JenisBB deleted successfully",
      deletedJenisBB,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
