const router = require("express").Router();
const User = require("../models/User");
const Case = require("../models/Case");
const ClientOtp = require("../models/ClientOtp");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
require("dotenv").config();

const hashOtp = (otp) => crypto.createHash("sha256").update(String(otp)).digest("hex");

const issueTokenFromPayload = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

const issueToken = (user) =>
  issueTokenFromPayload({ id: user._id, role: user.role });


// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ msg: "User not found" });

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) return res.status(401).json({ msg: "Invalid password" });

  const token = issueToken(user);

  res.json({ token, user });
});

// REQUEST EMAIL OTP LOGIN
router.post("/login/request-otp", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!email) return res.status(400).json({ msg: "Email is required" });

    const user = await User.findOne({ email });
    // Prevent account enumeration
    if (!user) return res.json({ msg: "If account exists, OTP was sent" });

    const now = Date.now();
    const cooldownMs = 60 * 1000;
    if (user.loginOtpLastSentAt && now - new Date(user.loginOtpLastSentAt).getTime() < cooldownMs) {
      return res.status(429).json({ msg: "Please wait before requesting OTP again" });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ msg: "Email service is not configured" });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    user.loginOtpHash = hashOtp(otp);
    user.loginOtpExpiry = new Date(now + 10 * 60 * 1000);
    user.loginOtpAttempts = 0;
    user.loginOtpLastSentAt = new Date(now);
    await user.save();

    await sendEmail(
      user.email,
      "Your Login OTP",
      `Your OTP is ${otp}. It expires in 10 minutes.`
    );

    res.json({ msg: "If account exists, OTP was sent" });
  } catch (err) {
    console.error("OTP request failed:", err);
    res.status(500).json({ msg: "Failed to send OTP" });
  }
});

// REQUEST OTP AFTER VALIDATING EMAIL + PASSWORD
router.post("/login/password/request-otp", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ msg: "Invalid username or password" });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid username or password" });

    const now = Date.now();
    const cooldownMs = 60 * 1000;
    if (user.loginOtpLastSentAt && now - new Date(user.loginOtpLastSentAt).getTime() < cooldownMs) {
      return res.status(429).json({ msg: "Please wait before requesting OTP again" });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ msg: "Email service is not configured" });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    user.loginOtpHash = hashOtp(otp);
    user.loginOtpExpiry = new Date(now + 10 * 60 * 1000);
    user.loginOtpAttempts = 0;
    user.loginOtpLastSentAt = new Date(now);
    await user.save();

    await sendEmail(
      user.email,
      "Your Secure Login OTP",
      `Your OTP is ${otp}. It expires in 10 minutes.`
    );

    res.json({ msg: "OTP sent to your email" });
  } catch (err) {
    console.error("Password+OTP request failed:", err);
    res.status(500).json({ msg: "Failed to send OTP" });
  }
});

// VERIFY EMAIL OTP LOGIN
router.post("/login/verify-otp", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const otp = String(req.body?.otp || "").trim();

    if (!email || !otp) return res.status(400).json({ msg: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ msg: "Invalid OTP" });

    if (!user.loginOtpHash || !user.loginOtpExpiry || new Date(user.loginOtpExpiry).getTime() < Date.now()) {
      return res.status(400).json({ msg: "OTP expired or not requested" });
    }

    if ((user.loginOtpAttempts || 0) >= 5) {
      user.loginOtpHash = undefined;
      user.loginOtpExpiry = undefined;
      user.loginOtpAttempts = 0;
      await user.save();
      return res.status(429).json({ msg: "Too many invalid attempts. Request a new OTP." });
    }

    const isValid = user.loginOtpHash === hashOtp(otp);
    if (!isValid) {
      user.loginOtpAttempts = (user.loginOtpAttempts || 0) + 1;
      await user.save();
      return res.status(401).json({ msg: "Invalid OTP" });
    }

    user.loginOtpHash = undefined;
    user.loginOtpExpiry = undefined;
    user.loginOtpAttempts = 0;
    await user.save();

    const token = issueToken(user);
    res.json({ token, user });
  } catch (err) {
    console.error("OTP verify failed:", err);
    res.status(500).json({ msg: "OTP verification failed" });
  }
});

// CLIENT LOGIN: REQUEST OTP BY CASE EMAIL
router.post("/client/request-otp", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!email) return res.status(400).json({ msg: "Email is required" });

    const caseMatch = await Case.findOne({
      partyEmail: { $regex: `^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" }
    });

    if (!caseMatch) {
      return res.status(404).json({ msg: "No case found for this email" });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ msg: "Email service is not configured" });
    }

    const existing = await ClientOtp.findOne({ email });
    const now = Date.now();
    if (existing?.lastSentAt && now - new Date(existing.lastSentAt).getTime() < 60 * 1000) {
      return res.status(429).json({ msg: "Please wait before requesting OTP again" });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpDoc = existing || new ClientOtp({ email });

    otpDoc.otpHash = hashOtp(otp);
    otpDoc.expiry = new Date(now + 10 * 60 * 1000);
    otpDoc.attempts = 0;
    otpDoc.lastSentAt = new Date(now);
    await otpDoc.save();

    await sendEmail(
      email,
      "Your Client Login OTP",
      `Your OTP is ${otp}. It expires in 10 minutes.`
    );

    res.json({ msg: "OTP sent to your email" });
  } catch (err) {
    console.error("Client OTP request failed:", err);
    res.status(500).json({ msg: "Failed to send OTP" });
  }
});

// CLIENT LOGIN: VERIFY OTP
router.post("/client/verify-otp", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const otp = String(req.body?.otp || "").trim();

    if (!email || !otp) return res.status(400).json({ msg: "Email and OTP are required" });

    const otpDoc = await ClientOtp.findOne({ email });
    if (!otpDoc) return res.status(400).json({ msg: "OTP expired or not requested" });

    if (new Date(otpDoc.expiry).getTime() < Date.now()) {
      await ClientOtp.deleteOne({ _id: otpDoc._id });
      return res.status(400).json({ msg: "OTP expired. Request a new one." });
    }

    if ((otpDoc.attempts || 0) >= 5) {
      await ClientOtp.deleteOne({ _id: otpDoc._id });
      return res.status(429).json({ msg: "Too many invalid attempts. Request a new OTP." });
    }

    const isValid = otpDoc.otpHash === hashOtp(otp);
    if (!isValid) {
      otpDoc.attempts = (otpDoc.attempts || 0) + 1;
      await otpDoc.save();
      return res.status(401).json({ msg: "Invalid OTP" });
    }

    const clientCase = await Case.findOne({
      partyEmail: { $regex: `^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" }
    });
    if (!clientCase) {
      await ClientOtp.deleteOne({ _id: otpDoc._id });
      return res.status(404).json({ msg: "No case found for this email" });
    }

    await ClientOtp.deleteOne({ _id: otpDoc._id });

    const userPayload = {
      id: `client:${email}`,
      role: "client",
      email
    };
    const token = issueTokenFromPayload(userPayload);
    res.json({ token, user: { role: "client", email, name: clientCase.partyName || "Client" } });
  } catch (err) {
    console.error("Client OTP verify failed:", err);
    res.status(500).json({ msg: "OTP verification failed" });
  }
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
