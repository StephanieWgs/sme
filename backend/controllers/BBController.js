const BB = require("../models/BB");

//Create BB
exports.createBB = async (req, res) => {
  try {
    const { kodeBB, namaBB, jenisBB, unitBB, stok, avgLeadTime, maxLeadTime, avgUsage, maxUsage } = req.body;
    const newBB = new BB({ kodeBB, namaBB, jenisBB, unitBB, stok, avgLeadTime, maxLeadTime, avgUsage, maxUsage });
    const savedBB = await newBB.save();
    res.status(201).json({
      message: "BB created successfully",
      savedBB,
    });
  } catch (error) {
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
    const updatedBB = await BB.findByIdAndUpdate(id, { kodeBB, namaBB, jenisBB, unitBB, stok, avgLeadTime, maxLeadTime, avgUsage, maxUsage }, { new: true });
    if (!updatedBB) return res.status(404).json({ error: "BB not found" });
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
