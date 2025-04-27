const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/auth");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    //Cek apakah user ada
    const user = await User.findOne({ username });
    if (!user) return res.render("/", { error: "Username atau Password Salah" });

    //Cek apakah password sesuai
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.render("/", { error: "Username atau Password Salah" });

    //Generate token
    const token = generateToken(user._id);

    //Simpan token ke cookie
    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Tambah user
exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    //Cek apakah username sudah ada
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.render("/user", { error: "Username sudah ada" });

    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Buat user baru
    const user = new User({ username, password: hashedPassword, role });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get all user
exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: 1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by id
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const userById = await User.findById(id);
    if (!userById) return res.status(404).json({ error: "User not found" });
    res.status(200).json(userById);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, { username, role }, { new: true });
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout berhasil" });
};
