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

export default router;
