const express = require("express");
const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

/* GET ALL MESSAGES */
router.get("/", auth, async (req, res) => {
  try {
    const messages = await ChatMessage.find()
      .sort({ createdAt: 1 })
      .limit(200);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: "Failed to load messages" });
  }
});

/* GET UNREAD COUNT */
router.get("/unread-count", auth, async (req, res) => {
  try {
    const count = await ChatMessage.countDocuments({
      readBy: { $ne: req.user.id },
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ msg: "Failed to get unread count" });
  }
});

/* MARK ALL AS READ */
router.post("/mark-read", auth, async (req, res) => {
  try {
    await ChatMessage.updateMany(
      { readBy: { $ne: req.user.id } },
      { $addToSet: { readBy: req.user.id } }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ msg: "Failed to mark as read" });
  }
});

/* SEND MESSAGE */
router.post("/", auth, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ msg: "Message required" });
    }

    const user = await User.findById(req.user.id).select("name");

    const newMsg = await ChatMessage.create({
      senderId: req.user.id,
      senderName: user.name, // ✅ FIX
      message,
      readBy: [req.user.id],
    });

    res.json(newMsg);
  } catch (err) {
    console.error("CHAT SEND ERROR:", err);
    res.status(500).json({ msg: "Failed to send message" });
  }
});

module.exports = router;
