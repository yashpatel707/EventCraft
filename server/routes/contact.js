import express from "express";

const router = express.Router();

// store messages (simple)
let messages = [];

// POST contact
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newMsg = {
      name,
      email,
      message,
      date: new Date(),
    };

    messages.push(newMsg);

    res.json("Message saved");
  } catch (err) {
    res.status(500).json("Error");
  }
});

// GET messages (admin use)
router.get("/", async (req, res) => {
  res.json(messages);
});

export default router;
