const mongoose = require("mongoose");

//Models
const jenisBBSchema = new mongoose.Schema({
  jenisBB: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("JenisBB", jenisBBSchema);
