// app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config(); // Ensure environment variables are loaded

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON requests

// Routes
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);

// Start the server
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
