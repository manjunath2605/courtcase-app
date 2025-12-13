const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
require("dotenv").config();


// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ msg: "User not found" });

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) return res.status(401).json({ msg: "Invalid password" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, user });
});

// REGISTER (ADMIN ONLY)
router.post("/register", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Admin only" });

  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ msg: "User already exists" });

  const user = new User({
    name,
    email,
    role: role || "user",
    password: bcrypt.hashSync(password, 10)
  });

  await user.save();
  res.json(user);
});

// LIST USERS (ADMIN)
router.get("/users", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Admin only" });

  res.json(await User.find().select("-password"));
});

// DELETE USER (ADMIN)
router.delete("/users/:id", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Admin only" });

  await User.findByIdAndDelete(req.params.id);
  res.sendStatus(200);
});


// UPDATE USER ROLE (ADMIN ONLY)
router.put("/users/:id/role", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ msg: "Admin only" });

  const { role } = req.body;

  if (!["admin", "user", "viewer"].includes(role)) {
    return res.status(400).json({ msg: "Invalid role" });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select("-password");

  res.json(user);
});

router.post("/forgot-password", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.sendStatus(200);

  const token = crypto.randomBytes(32).toString("hex");

  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
  await user.save();

  const link = `http://localhost:3000/reset-password/${token}`;

  await sendEmail(
    user.email,
    "Password Reset",
    `Reset password link: ${link}`
  );

  res.json({ msg: "Reset link sent" });
});

router.post("/reset-password/:token", async (req, res) => {
  const user = await User.findOne({
    resetToken: req.params.token,
    resetTokenExpiry: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ msg: "Invalid token" });

  user.password = bcrypt.hashSync(req.body.password, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();
  res.json({ msg: "Password updated" });
});


module.exports = router;
