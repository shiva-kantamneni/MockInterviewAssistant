const express = require('express');
const router = express.Router();
const User = require('./../Models/user');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

require('dotenv').config();

// ── Auth helper ───────────────────────────────────────────────────────────────
const getUserFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    throw new Error("Unauthorized");
  const token = authHeader.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET);
};

// ── SIGN UP ───────────────────────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    let { name, email, password } = req.body;

    name     = name?.trim();
    email    = email?.trim();
    password = password?.trim();

    if (!name || !email || !password) {
      return res.status(400).json({ status: "Failed", message: "Empty input fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: "Failed", message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const savedUser = await new User({ name, email, password: hashedPassword }).save();

    res.status(200).json({ status: "Success", message: "Signup successful", data: savedUser });
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).json({ status: "Failed", message: "An internal error occurred" });
  }
});

// ── SIGN IN ───────────────────────────────────────────────────────────────────
router.post('/signin', async (req, res) => {
  try {
    let { email, password } = req.body;
    email    = email?.trim();
    password = password?.trim();

    if (!email || !password) {
      return res.status(400).json({ status: "Failed", message: "Empty input fields" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ status: "Failed", message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ status: "Failed", message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email, name: existingUser.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ status: "Success", message: "Signin successful", token });
  } catch (error) {
    console.error("Error in signin:", error);
    res.status(500).json({ status: "Failed", message: "An internal error occurred" });
  }
});

// ── LOGOUT ────────────────────────────────────────────────────────────────────
// Stateless JWT: client drops the token. This route just confirms success.
router.post('/logout', (req, res) => {
  res.status(200).json({ status: "Success", message: "Logged out successfully" });
});

// ── UPDATE NAME ───────────────────────────────────────────────────────────────
router.put('/updateName', async (req, res) => {
  try {
    const decoded = getUserFromToken(req);
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ status: "Failed", message: "Name cannot be empty" });
    }
    const updated = await User.findByIdAndUpdate(
      decoded.userId,
      { name: name.trim() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ status: "Failed", message: "User not found" });
    }

    // Issue a fresh token so the new name is reflected immediately
    const newToken = jwt.sign(
      { userId: updated._id, email: updated.email, name: updated.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      status: "Success",
      message: "Name updated successfully",
      name: updated.name,
      token: newToken   // frontend should replace the stored token with this
    });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return res.status(401).json({ status: "Failed", message: "Unauthorized" });
    }
    console.error("Error in updateName:", error);
    res.status(500).json({ status: "Failed", message: "An internal error occurred" });
  }
});

// ── UPDATE PASSWORD ───────────────────────────────────────────────────────────
router.put('/updatePassword', async (req, res) => {
  try {
    const decoded = getUserFromToken(req);
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ status: "Failed", message: "Both passwords are required" });
    }
    if (newPassword.trim().length < 6) {
      return res.status(400).json({ status: "Failed", message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ status: "Failed", message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: "Failed", message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword.trim(), 10);
    await user.save();

    res.status(200).json({ status: "Success", message: "Password updated successfully" });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return res.status(401).json({ status: "Failed", message: "Unauthorized" });
    }
    console.error("Error in updatePassword:", error);
    res.status(500).json({ status: "Failed", message: "An internal error occurred" });
  }
});

// ── DELETE ACCOUNT ────────────────────────────────────────────────────────────
router.delete('/deleteAccount', async (req, res) => {
  try {
    const decoded = getUserFromToken(req);

    const deleted = await User.findByIdAndDelete(decoded.userId);
    if (!deleted) {
      return res.status(404).json({ status: "Failed", message: "User not found" });
    }

    // Optionally: also delete the user's sessions/interviews here
    // await Interview.deleteMany({ userId: decoded.userId });
    // await Session.deleteMany({ userId: decoded.userId });

    res.status(200).json({ status: "Success", message: "Account deleted successfully" });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return res.status(401).json({ status: "Failed", message: "Unauthorized" });
    }
    console.error("Error in deleteAccount:", error);
    res.status(500).json({ status: "Failed", message: "An internal error occurred" });
  }
});

module.exports = router;