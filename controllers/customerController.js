const customer = require("../models/customer");
const { sendNotification } = require("../websocket"); 

// Create customer
exports.createCustomer = async (req, res) => {
  try {
    const { kodeCustomer, namaCustomer, alamatCustomer, noHPCustomer, emailCustomer } = req.body;
    const newCustomer = new customer({ kodeCustomer, namaCustomer, alamatCustomer, noHPCustomer, emailCustomer });
    const savedCustomer = await newCustomer.save();

    // Kirim notifikasi
    sendNotification(`Customer ${namaCustomer} berhasil ditambahkan`);

    res.status(201).json({
      message: "Customer created successfully",
      savedCustomer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all customer
exports.getAllCustomer = async (req, res) => {
  try {
    const customers = await customer.find().sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get customer by id
exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customerById = await customer.findById(id);
    if (!customerById) return res.status(404).json({ error: "Customer not found" });
    res.status(200).json(customerById);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update customer
exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { kodeCustomer, namaCustomer, alamatCustomer, noHPCustomer, emailCustomer } = req.body;
    const updatedCustomer = await customer.findByIdAndUpdate(id, { kodeCustomer, namaCustomer, alamatCustomer, noHPCustomer, emailCustomer }, { new: true });
    if (!updatedCustomer) return res.status(404).json({ error: "Customer not found" });

    // Kirim notifikasi
    sendNotification("Data customer berhasil diupdate");

    res.status(200).json({
      message: "Customer updated successfully",
      updatedCustomer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCustomer = await customer.findByIdAndDelete(id);
    if (!deletedCustomer) return res.status(404).json({ error: "Customer not found" });

    //kirim notifikasi
    sendNotification("Data customer berhasil dihapus");

    res.status(200).json({
      message: "Customer deleted successfully",
      deletedCustomer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
