import mongoose from "mongoose";

const EmailVerification = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  OTP: {
    type: String,
    required: true
  },
  expireAt: {
    type: Date,
    default: Date.now,
    expires: 600
  }
});

module.exports = mongoose.models.VerificationOTP || mongoose.model("VerificationOTP", EmailVerification);
