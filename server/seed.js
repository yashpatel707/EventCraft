import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Booking from "./models/Booking.js";
import bcrypt from "bcryptjs";

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  // Admin user
  const hash = await bcrypt.hash("admin123", 10);
  await User.findOneAndUpdate(
    { email: "admin@test.com" },
    { name: "Admin", email: "admin@test.com", password: hash, role: "admin" },
    { upsert: true },
  );

  // Test user
  const hash2 = await bcrypt.hash("user123", 10);
  await User.findOneAndUpdate(
    { email: "user@test.com" },
    {
      name: "Test User",
      email: "user@test.com",
      password: hash2,
      role: "user",
    },
    { upsert: true },
  );

  // Employee user
  const hash3 = await bcrypt.hash("emp123", 10);
  await User.findOneAndUpdate(
    { email: "employee@test.com" },
    {
      name: "John Employee",
      email: "employee@test.com",
      password: hash3,
      role: "employee",
    },
    { upsert: true },
  );

  // Test booking (update userId to ObjectId compatible)
  const testUser = await User.findOne({ email: "user@test.com" });
  await Booking.findOneAndUpdate(
    { eventType: "Wedding" },
    {
      userId: testUser._id,
      eventType: "Wedding",
      date: "2024-12-25",
      budget: 50000,
      status: "pending",
    },
    { upsert: true },
  );

  console.log(
    "✅ Seeded:\n" +
      "- Admin: admin@test.com / admin123\n" +
      "- User: user@test.com / user123\n" +
      "- Employee: employee@test.com / emp123\n" +
      "- Test booking (pending)",
  );

  mongoose.connection.close();
}

seed();
