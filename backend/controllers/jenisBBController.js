const jenisBB = require("../models/jenisBB");

// Create jenisBB
exports.createJenisBB = async (req, res) => {
  try {
    const { jenisBB } = req.body;
    const newJenisBB = new jenisBB({ jenisBB });
    const savedJenisBB = await newJenisBB.save();
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
    const jenisBBs = await jenisBB.find();
    res.status(200).json(jenisBBs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get jenisBB by id
exports.getJenisBBById = async (req, res) => {
  try {
    const { id } = req.params;
    const jenisBB = await jenisBB.findById(id);
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
    const updatedJenisBB = await jenisBB.findByIdAndUpdate(id, { jenisBB }, { new: true });
    if (!updatedJenisBB) return res.status(404).json({ error: "JenisBB not found" });
    res.status(200).json({
      message: "JenisBB updated successfully",
      updatedBB,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete jenisBB
exports.deleteJenisBB = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJenisBB = await jenisBB.findByIdAndDelete(id);
    if (!deletedJenisBB) return res.status(404).json({ error: "JenisBB not found" });
    res.status(200).json({
      message: "JenisBB deleted successfully",
      deletedJenisBB,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
