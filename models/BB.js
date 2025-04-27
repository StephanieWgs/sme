const mongoose = require("mongoose");

const bbSchema = new mongoose.Schema({
  kodeBB: {
    type: String,
    required: true,
  },
  namaBB: {
    type: String,
    required: true,
  },
  jenisBB: {
    type: String,
    required: true,
  },
  unitBB: {
    type: String,
    required: true,
  },
  stok: {
    type: Number,
    required: true,
  },
  avgLeadTime: {
    type: Number,
    required: true,
  },
  maxLeadTime: {
    type: Number,
    required: true,
  },
  avgUsage: {
    type: Number,
    required: true,
  },
  maxUsage: {
    type: Number,
    required: true,
  },
  safetyStock: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["Safe", "Need Restock", "Out of Stock"],
    default: "Need Restock",
  },
});

// Constants
const STATUS_SAFE = "Safe";
const STATUS_NEED_RESTOCK = "Need Restock";
const STATUS_OUT_OF_STOCK = "Out of Stock";

// Hitung safety stock
bbSchema.methods.hitungSafetyStock = function () {
  const result = this.maxLeadTime * this.maxUsage - this.avgLeadTime * this.avgUsage;
  return Math.max(0, result);
};

// Menentukan status berdasarkan safety stok
bbSchema.methods.statusStock = function () {
  const safetyStock = this.hitungSafetyStock();

  if (this.stok === 0) {
    return STATUS_OUT_OF_STOCK;
  } else if (this.stok > safetyStock) {
    return STATUS_SAFE;
  } else {
    return STATUS_NEED_RESTOCK;
  }
};

// Middleware sebelum saving
bbSchema.pre("save", function (next) {
  this.safetyStock = this.hitungSafetyStock();
  this.status = this.statusStock();
  next();
});

const BB = mongoose.model("BB", bbSchema);

module.exports = {
  BB,
  STATUS_SAFE,
  STATUS_NEED_RESTOCK,
  STATUS_OUT_OF_STOCK,
};
