const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["admin", "user", "viewer"], // ✅ IMPORTANT
      default: "user"
    },

    resetToken: {
      type: String
    },

    resetTokenExpiry: {
      type: Date
    },

    loginOtpHash: {
      type: String
    },

    loginOtpExpiry: {
      type: Date
    },

    loginOtpAttempts: {
      type: Number,
      default: 0
    },

    loginOtpLastSentAt: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
