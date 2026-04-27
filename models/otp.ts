
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // ৩০০ সেকেন্ড (৫ মিনিট) পর ডিলিট হয়ে যাবে
});

export const Otp = mongoose.models.Otp || mongoose.model("Otp", otpSchema);