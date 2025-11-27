// middleware/auth.js
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Ensure environment variables are loaded

const JWT_SECRET = process.env.JWT_SECRET_KEY; // Make sure this is in your .env file

// Authentication Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded; // Attach decoded user data to the request
    next(); // Continue to the next middleware or route handler
  });
};

module.exports = { authenticateToken };
