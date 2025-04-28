const mongoose = require("mongoose");

const pembelianSchema = new mongoose.Schema({
  noInv: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  tglPembelian: {
    type: Date,
    required: true,
  },
  kodeSupplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "supplier",
    required: true,
  },
  detailPembelian: [
    {
      kodeBB: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BB",
        required: true,
      },
      hargaBeli: {
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
  ppnPembelian: {
    type: Number,
    required: true,
  },
  totalPembelian: {
    type: Number,
    required: true,
  },
});

//Fungsi untuk menghitung subtotal per item setelah diskon (tidak termasuk ppn)
pembelianSchema.methods.hitungSubtotalItemSetelahDiskon = function () {
  this.detailPembelian.forEach((item) => {
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
pembelianSchema.methods.hitungPPNTotalItem = function () {
  this.detailPembelian.forEach((item) => {
    const ppnItem = item.isPPNActive ? Math.floor(item.subtotal * 0.11) : 0;
    item.ppnItem = ppnItem;
  });
};

//Fungsi untuk menghitung ppn total untuk satu invoice
pembelianSchema.methods.hitungPPNTotal = function () {
  let ppnTotal = 0;
  this.detailPembelian.forEach((item) => {
    ppnTotal += item.ppnItem;
  });
  this.ppnPembelian = ppnTotal;
};

//Fungsi untuk menghitung total pembelian untuk satu invoice
pembelianSchema.methods.hitungTotalPembelian = function () {
  let total = 0;

  // Hitung total
  this.detailPembelian.forEach((item) => {
    total += item.subtotal;
    ppnPembelian += item.ppnItem || 0;
  });

  // Tambahkan PPN ke total
  this.totalPembelian += ppnPembelian;
};

pembelianSchema.methods.prosesPerhitungan = function () {
  this.hitungSubtotalItemSetelahDiskon();
  this.hitungPPNTotalItem();
  this.hitungTotalPembelian();
};

// Middleware sebelum saving
pembelianSchema.pre("save", function (next) {
  this.prosesPerhitungan();
  next();
});

module.exports = mongoose.model("Pembelian", pembelianSchema);
