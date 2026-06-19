const express = require("express");
const { registerUser, loginUser, verifyOtp, forgotPassword, resetPassword, resendOtp, getMe, updateUserProfile, getUserProfileById, } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/me", authMiddleware, getMe);
router.put("/profile", authMiddleware, updateUserProfile);
router.get("/user/:id", authMiddleware, getUserProfileById);

module.exports = router;