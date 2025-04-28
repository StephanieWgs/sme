const mongoose = require("mongoose");

const penjualanSchema = new mongoose.Schema({
  noInv: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  tglPenjualan: {
    type: Date,
    required: true,
  },
  kodeCustomer: {
    type: String,
    required: true,
  },
  detailPenjualan: [
    {
      kodeBB: {
        type: String,
        required: true,
      },
      hargaJual: {
        type: Number,
        min: 0,
        required: true,
      },
      qty: {
        type: Number,
        required: true,
      },
      diskonItem: {
        type: Number,
        min: 0,
        required: true,
      },
      tipeDiskon: {
        type: String,
        enum: ["persen", "nominal"],
        default: "nominal",
      },
      isPPNActive: {
        type: Boolean,
        required: true,
      },
      ppnItem: {
        type: Number,
        required: true,
      },
      subtotal: {
        type: Number,
        required: true,
      },
    },
  ],
  ppnPenjualan: {
    type: Number,
    required: true,
  },
  totalPenjualan: {
    type: Number,
    required: true,
  },
});

//Fungsi untuk menghitung subtotal per item setelah diskon (tidak termasuk ppn)
penjualanSchema.methods.hitungSubtotalItemSetelahDiskon = function () {
  this.detailPenjualan.forEach((item) => {
    const subtotalDPP = item.hargaJual * item.qty;
    let diskonValue = 0;

    if (item.tipeDiskon === "persen") {
      diskonValue = subtotalDPP * (item.diskonItem / 100);
    } else {
      diskonValue = item.diskonItem; // anggap diskon nominal untuk semua item
    }

    item.subtotal = subtotalDPP - diskonValue;
  });
};

//Fungsi untuk menghitung ppn total per item
penjualanSchema.methods.hitungPPNTotalItem = function () {
  this.detailPenjualan.forEach((item) => {
    const ppnItem = item.isPPNActive ? Math.floor(item.subtotal * 0.11) : 0;
    item.ppnItem = ppnItem;
  });
};

// Fungsi untuk menghitung PPN per item DAN total PPN sekaligus
penjualanSchema.methods.hitungPPNTotalItem = function () {
  let ppnTotal = 0; // Initialize total PPN

  this.detailPenjualan.forEach((item) => {
    const ppnItem = item.isPPNActive ? Math.floor(item.subtotal * 0.11) : 0;
    item.ppnItem = ppnItem;
    ppnTotal += ppnItem; // Accumulate total PPN
  });

  this.ppnPenjualan = ppnTotal; // Set total PPN for the invoice
};

// Fungsi untuk menghitung total penjualan (termasuk PPN)
penjualanSchema.methods.hitungTotalPenjualan = function () {
  let subtotal = 0;

  // Sum subtotals (exclude PPN)
  this.detailPenjualan.forEach((item) => {
    subtotal += item.subtotal;
  });

  // Total = Subtotal + PPN (ppnPenjualan already calculated in hitungPPNTotalItem)
  this.totalPenjualan = subtotal + this.ppnPenjualan;
};

penjualanSchema.methods.prosesPerhitungan = function () {
  this.hitungSubtotalItemSetelahDiskon();
  this.hitungPPNTotalItem();
  this.hitungTotalPenjualan();
};

// Middleware sebelum saving
penjualanSchema.pre("save", function (next) {
  this.prosesPerhitungan();
  next();
});

module.exports = mongoose.model("Penjualan", penjualanSchema);
