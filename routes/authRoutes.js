// routes/authRoutes.js
const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth"); 
const paymentController = require("../controllers/paymentController");

// Register Route
router.post("/register", authController.register);

// Login Route
router.post("/login", authController.login);

// Checkout Route (requires authentication)
router.post("/checkout", authenticateToken, authController.checkout);

// Route to create Razorpay order
router.post("/create-order", authenticateToken, paymentController.createOrder);

// Route to verify payment
router.post("/verify-payment",  paymentController.verifyPayment);

module.exports = router;
