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

// EDIT MESSAGE
router.put("/:id", auth, async (req, res) => {
  const msg = await ChatMessage.findById(req.params.id);
  if (!msg) return res.status(404).json({ msg: "Not found" });

  if (msg.senderId.toString() !== req.user.id) {
    return res.status(403).json({ msg: "Not allowed" });
  }

  const FIVE_MIN = 5 * 60 * 1000;
  if (Date.now() - msg.createdAt.getTime() > FIVE_MIN) {
    return res.status(403).json({ msg: "Edit time expired" });
  }

  msg.message = req.body.message;
  msg.edited = true;
  await msg.save();

  res.json(msg);
});


// DELETE MESSAGE
router.delete("/:id", auth, async (req, res) => {
  try {
    const msg = await ChatMessage.findById(req.params.id);
    if (!msg) return res.status(404).json({ msg: "Message not found" });

    const isAdmin = req.user.role === "admin";
    const isOwner = msg.senderId.toString() === req.user.id;

    // ❌ Not admin and not owner
    if (!isAdmin && !isOwner) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    // ⏱️ Time restriction ONLY for normal users
    if (!isAdmin) {
      const FIVE_MIN = 5 * 60 * 1000;
      if (Date.now() - msg.createdAt.getTime() > FIVE_MIN) {
        return res.status(403).json({ msg: "Delete time expired" });
      }
    }

    await msg.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ msg: "Delete failed" });
  }
});


module.exports = router;
