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

//Fungsi untuk menghitung total penjualan untuk satu invoice
penjualanSchema.methods.hitungTotalPenjualan = function () {
  let total = 0;

  // Hitung total
  this.detailPenjualan.forEach((item) => {
    total += item.subtotal;
    ppnPenjualan += item.ppnItem || 0;
  });

  // Tambahkan PPN ke total
  this.totalPenjualan += ppnPenjualan;
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
