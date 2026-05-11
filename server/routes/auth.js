import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json("User already exists");

    const hash = await bcrypt.hash(password, 10);

    // ✅ FIX: role properly set
    const user = new User({
      name,
      email,
      password: hash,
      role: role || "employee", // default employee
    });

    await user.save();

    res.json("Registered");
  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json("Server error");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json("User not found");

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(400).json("Wrong credentials");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
    );

    res.json({
      token,
      role: user.role,
      userId: user._id,
      name: user.name,
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json("Server error");
  }
});

// GET PROFILE
router.get("/profile", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("name email role");
  res.json(user);
});

// GET USERS (for admin dropdown)
router.get("/users", auth, async (req, res) => {
  try {
    const { role } = req.query;

    let users;

    if (role) {
      users = await User.find({ role }).select("-password");
    } else {
      users = await User.find().select("-password");
    }

    res.json(users);
  } catch (err) {
    console.log("FETCH USERS ERROR:", err);
    res.status(500).json("Server error");
  }
});

export default router;
