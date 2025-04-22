const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
    kodeSupplier: {
        type: String,
        required: true,
    },
    namaSupplier: {
        type: String,
        required: true,
    },
    alamatSupplier: {
        type: String,
        required: true,
    },    
    noHPSupplier: {
        type: String,
        required: true,
    },
    emailSupplier: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Supplier", supplierSchema);