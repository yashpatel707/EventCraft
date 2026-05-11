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

const app = express();

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

// MongoDB connection (Global scope mein rakhein taaki Vercel ise cache kar sake)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ DB Connected"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

// Vercel ke liye app ko export karna zaroori hai
export default app; 

// Local development ke liye ye condition zaroori hai
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log("🚀 Server running on port " + PORT);
  });
}
