import express from "express";
const router = express.Router();

import Booking from "../models/Booking.js";

// ============================
// CREATE BOOKING
// ============================
router.post("/", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// GET ALL BOOKINGS
// ============================
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name")
      .populate("assignedTo", "name");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// GET BOOKINGS FOR EMPLOYEE
// ============================
router.get("/employee", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name")
      .populate("assignedTo", "name");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// UPDATE STATUS
// ============================
router.put("/:id/status", async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    });

    res.json({ msg: "Status Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// ASSIGN EMPLOYEE
// ============================
router.put("/:id/assign", async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, {
      assignedTo: req.body.employeeId,
      employeeStatus: "unassigned",
    });

    res.json({ msg: "Employee Assigned" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// UPDATE PROGRESS
// ============================
router.put("/:id/progress", async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, {
      employeeStatus: req.body.employeeStatus,
    });

    res.json({ msg: "Progress Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// ADVANCE PAID
// ============================
router.put("/:id/advance-paid", async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, {
      advancePayment: "paid",
    });

    res.json({ msg: "Advance Paid" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// REMAINING PAID
// ============================
router.put("/:id/remaining-paid", async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, {
      remainingPayment: "paid",
    });

    res.json({ msg: "Remaining Paid" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
