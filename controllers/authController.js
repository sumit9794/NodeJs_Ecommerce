// controllers/authController.js
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config(); // Ensure environment variables are loaded

const JWT_SECRET = process.env.JWT_SECRET_KEY; // Make sure this is in your .env file

// ===================== REGISTER =====================
exports.register = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!name || !email || !mobile || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user (hashed password)
    const user = new User(name, email, mobile, hashedPassword);
    const result = await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: result.insertId, email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully!",
      token,
      userId: result.insertId,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

// ===================== LOGIN =====================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      userId: user.id,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// ===================== CHECKOUT =====================
exports.checkout = async (req, res) => {
  try {
    // 1. Get cart from the request body
    const { cart } = req.body;
    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2. User ID is extracted from the decoded JWT (added to req.user by the middleware)
    const userId = req.user.id; // This assumes the middleware is setting req.user correctly

    // 3. Find the user by ID using the custom findById method
    const user = await User.findById(userId); // Use the custom findById method

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 4. Calculate total price of the cart
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.quantity;
    });

    // 5. Return the cart products and total in the response
    return res.status(200).json({
      message: `Checkout successful. Total: $${total}`,
      cart, // Return the cart with product details
      total, // Send total price to the frontend
    });

  

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
