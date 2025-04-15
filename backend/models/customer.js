const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    kodeCustomer: {
        type: String,
        required: true,
    },
    namaCustomer: {
        type: String,
        required: true,
    },
    alamatCustomer: {
        type: String,
        required: true,
    },    
    noHPCustomer: {
        type: String,
        required: true,
    },
    emailCustomer: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Customer", customerSchema);