// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const {
  getCartItems,
  addCartItem,
  removeCartItem,
  updateCartItem,
  decreaseCartItem,
  increaseCartItem,
} = require("../controllers/cartController");

router.get("/", getCartItems);
router.post("/", addCartItem);
router.delete("/:productId", removeCartItem);
router.put("/:productId", updateCartItem);
router.put("/:id/decrease", decreaseCartItem);
router.put("/:id/increase", increaseCartItem);


module.exports = router;
