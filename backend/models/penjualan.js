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
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer",
    required: true,
  },
  detailPenjualan: [
    {
      kodeBB: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BB",
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
  diskonPenjualan: {
    type: Number,
    min: 0,
    required: true,
  },
  tipeDiskonPenjualan: {
    type: String,
    enum: ["persen", "nominal"],
    default: "nominal",
  },
  ppnPenjualan: {
    type: Number,
    required: true,
  },
  biayaLain: {
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
    const subtotalDPP = item.hargaBeli * item.qty;
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

//Fungsi untuk menghitung ppn total untuk satu invoice
penjualanSchema.methods.hitungPPNTotal = function () {
  let ppnTotal = 0;
  this.detailPenjualan.forEach((item) => {
    ppnTotal += item.ppnItem;
  });
  this.ppnPenjualan = ppnTotal;
};

//Fungsi untuk menghitung total penjualan untuk satu invoice
penjualanSchema.methods.hitungTotalPenjualan = function () {
  let total = 0;

  // Hitung total
  this.detailPenjualan.forEach((item) => {
    total += item.subtotal;
  });

  // Hitung total diskon dan PPN secara keseluruhan
  if (this.tipeDiskonPenjualan === "persen") {
    const diskonPersen = (total * this.diskonPenjualan) / 100;
    total -= diskonPersen;
  } else {
    total -= this.diskonPenjualan;
  }
  total += this.ppnPenjualan; // Tambahkan PPN total
  total += this.biayaLain; // Tambahkan biaya lain (misal ongkir)

  this.totalPenjualan= total;
};

penjualanSchema.methods.prosesPerhitungan = function () {
  this.hitungSubtotalItemSetelahDiskon();
  this.hitungPPNTotalItem();
  this.hitungPPNTotal();
  this.hitungTotalPenjualan();
};

// Middleware sebelum saving
penjualanSchema.pre("save", function (next) {
  this.prosesPerhitungan();
  next();
});

module.exports = mongoose.model("{Penjualan}", penjualanSchema);
