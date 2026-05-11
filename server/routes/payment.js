import express from "express";
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// ✅ Razorpay instance (ENV use)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ============================
// CREATE ORDER
// ============================
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: "INR",
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ IMPORTANT: default export
export default router;
