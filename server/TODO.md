### jo abhi update karna hai voh

admin role me se hatana
payment method add karana hai

====================================================================================================================
middleware

auth.js
]import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
const token = req.header("Authorization")?.replace("Bearer ", "");

if (!token) return res.status(401).json("No token");

try {
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded;
next();
} catch (err) {
res.status(401).json("Invalid token");
}
};

export const adminAuth = (req, res, next) => {
if (req.user.role !== "admin") return res.status(403).json("Admin only");
next();
};

export const employeeAuth = (req, res, next) => {
if (req.user.role !== "employee")
return res.status(403).json("Employee only");
next();
};
========================================================================================================================
models

Booking.js
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

========================================================================================================================
Event.js
import mongoose from "mongoose";

const schema = new mongoose.Schema(
{
title: String,
place: String,
price: Number,
image: String,
},
{ timestamps: true },
);

# export default mongoose.model("Event", schema);

User.js
import mongoose from "mongoose";

const schema = new mongoose.Schema({
name: String,
email: String,
password: String,
role: { type: String, default: "user" },
});

# export default mongoose.model("User", schema);

routes
auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// register
router.post("/register", async (req, res) => {
const hash = await bcrypt.hash(req.body.password, 10);
const user = new User({ ...req.body, password: hash });
await user.save();
res.json("Registered");
});

// login
router.post("/login", async (req, res) => {
const user = await User.findOne({ email: req.body.email });
if (!user) return res.status(400).json("User not found");

const valid = await bcrypt.compare(req.body.password, user.password);
if (!valid) return res.status(400).json("Wrong credentials");

const token = jwt.sign(
{ id: user.\_id, role: user.role },
process.env.JWT_SECRET,
);

res.json({ token, role: user.role, userId: user.\_id, name: user.name });
});

// get profile
router.get("/profile", auth, async (req, res) => {
const user = await User.findById(req.user.id).select("name email role");
res.json(user);
});

// get users by role (admin for dropdown)
router.get("/users", auth, async (req, res) => {
const { role } = req.query;
const filter = role ? { role } : {};
const users = await User.find(filter).select("-password");
res.json(users);
});

# export default router;

booking.js
import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

// CREATE BOOKING (CUSTOMER)

router.post("/", async (req, res) => {
try {
const booking = new Booking({
userId: req.body.userId,
name: req.body.name,
eventType: req.body.eventType,
date: req.body.date,

      // IMPORTANT FIX
      price: Number(req.body.price),

      status: "pending",
      employeeStatus: "unassigned",
    });

    await booking.save();

    res.json(booking);

} catch (err) {
console.log(err);
res.status(500).json(err);
}
});

// GET ALL BOOKINGS (ADMIN)

router.get("/", async (req, res) => {
try {
const data = await Booking.find().populate("assignedTo").populate("userId");

    res.json(data);

} catch (err) {
res.status(500).json(err);
}
});

// EMPLOYEE BOOKINGS

router.get("/employee", async (req, res) => {
try {
const data = await Booking.find({
assignedTo: { $ne: null },
})
.populate("assignedTo")
.populate("userId");

    res.json(data);

} catch (err) {
res.status(500).json(err);
}
});

// APPROVE / REJECT

router.put("/:id/status", async (req, res) => {
try {
const booking = await Booking.findByIdAndUpdate(
req.params.id,
{ status: req.body.status },
{ new: true },
);

    res.json(booking);

} catch (err) {
res.status(500).json(err);
}
});

// ASSIGN EMPLOYEE

router.put("/:id/assign", async (req, res) => {
try {
const booking = await Booking.findByIdAndUpdate(
req.params.id,
{
assignedTo: req.body.employeeId,
employeeStatus: "unassigned",
},
{ new: true },
)
.populate("assignedTo")
.populate("userId");

    res.json(booking);

} catch (err) {
res.status(500).json(err);
}
});

// EMPLOYEE PROGRESS UPDATE

router.put("/:id/progress", async (req, res) => {
try {
const booking = await Booking.findByIdAndUpdate(
req.params.id,
{ employeeStatus: req.body.employeeStatus },
{ new: true },
);

    res.json(booking);

} catch (err) {
res.status(500).json(err);
}
});

# export default router;

event.js
import express from "express";
import multer from "multer";
import Event from "../models/Event.js";
import { auth, adminAuth } from "../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
destination: (req, file, cb) => {
cb(null, "uploads");
},
filename: (req, file, cb) => {
cb(null, Date.now() + "-" + file.originalname);
},
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
const events = await Event.find();
res.json(events);
});

router.post("/", auth, adminAuth, upload.single("image"), async (req, res) => {
const event = new Event({
title: req.body.title,
place: req.body.place,
price: req.body.price,
image: "/uploads/" + req.file.filename,
});

await event.save();
res.json(event);
});

router.delete("/:id", auth, adminAuth, async (req, res) => {
await Event.findByIdAndDelete(req.params.id);
res.json("Deleted");
});

# export default router;

payment.js

import express from "express";
import Razorpay from "razorpay";
import Booking from "../models/Booking.js";

const router = express.Router();

const razorpay = new Razorpay({
key_id: process.env.RAZORPAY_KEY || "demo",
key_secret: process.env.RAZORPAY_SECRET || "demo",
});

// create order
router.post("/create-order", async (req, res) => {
try {
const order = await razorpay.orders.create({
amount: req.body.amount \* 100,
currency: "INR",
});

    res.json(order);

} catch (err) {
res.json({
id: "demo_order",
amount: req.body.amount \* 100,
});
}
});

// ADVANCE PAYMENT SUCCESS
router.post("/advance-success", async (req, res) => {
const { bookingId } = req.body;

await Booking.findByIdAndUpdate(bookingId, {
advancePayment: "paid",
});

res.json({ message: "Advance payment updated" });
});

// REMAINING PAYMENT SUCCESS
router.post("/remaining-success", async (req, res) => {
const { bookingId } = req.body;

await Booking.findByIdAndUpdate(bookingId, {
remainingPayment: "paid",
});

res.json({ message: "Remaining payment updated" });
});

# export default router;

.env

MONGO_URI=mongodb://localhost:27017/eventcraft
JWT_SECRET=mysecretkey123
//RAZORPAY_KEY=rzp_test_xxxxxxxxx
//RAZORPAY_SECRET=xxxxxxxxx

========================================================================================================================
server.js

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import paymentRoutes from "./routes/payment.js";

import authRoutes from "./routes/auth.js";
import bookingRoutes from "./routes/booking.js";
import eventRoutes from "./routes/event.js";

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

mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log("✅ DB Connected"))
.catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
console.log("🚀 Server running on port " + PORT);
});
