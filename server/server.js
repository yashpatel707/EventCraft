import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import paymentRoutes from "./routes/payment.js";

import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/booking.js";
import eventRoutes from "./routes/event.js";
import contactRoutes from "./routes/contact.js";

dotenv.config();

const app = express(); // ✅ app pehle create hoga

app.use(cors());
app.use(express.json());

// static folder for images
app.use("/uploads", express.static("uploads"));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/contact", contactRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ DB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
