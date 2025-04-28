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
    type: String,
    required: true,
  },
  detailPembelian: [
    {
      kodeBB: {
        type: String,
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

//Fungsi untuk menghitung ppn per item DAN total ppn
pembelianSchema.methods.hitungPPNTotalItem = function () {
  let ppnTotal = 0; // Initialize total PPN

  this.detailPembelian.forEach((item) => {
    const ppnItem = item.isPPNActive ? Math.floor(item.subtotal * 0.11) : 0;
    item.ppnItem = ppnItem;
    ppnTotal += ppnItem; // Accumulate total PPN
  });

  this.ppnPembelian = ppnTotal; // Set total PPN for the invoice
};


//Fungsi untuk menghitung total pembelian (termasuk PPN)
pembelianSchema.methods.hitungTotalPembelian = function () {
  let subtotal = 0;

  // Sum subtotals (exclude PPN)
  this.detailPembelian.forEach((item) => {
    subtotal += item.subtotal;
  });

  // Total = Subtotal + PPN (already calculated in hitungPPNTotalItem)
  this.totalPembelian = subtotal + this.ppnPembelian;
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
