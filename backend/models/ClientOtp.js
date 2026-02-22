const mongoose = require("mongoose");

const ClientOtpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    otpHash: { type: String, required: true },
    expiry: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    lastSentAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClientOtp", ClientOtpSchema);
