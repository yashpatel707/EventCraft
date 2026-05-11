import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    eventType: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    // PRICE FIX
    price: {
      type: Number,
      required: true,
      default: 0,
    },

    status: {
      type: String,
      default: "pending",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    employeeStatus: {
      type: String,
      default: "unassigned",
    },

    advancePayment: {
      type: String,
      default: "pending",
    },

    remainingPayment: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Booking", schema);
