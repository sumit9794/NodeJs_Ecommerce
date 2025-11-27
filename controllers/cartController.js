// controllers/cartController.js
const Cart = require("../models/cartModel");

const getCartItems = async (req, res) => {
  const cart = await Cart.getCart();
  res.json(cart);
};

const addCartItem = async (req, res) => {
  const product = req.body;
  const cart = await Cart.addToCart(product);
  res.json(cart);
};

const removeCartItem = async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.removeFromCart(productId);
  res.json(cart);
};

const updateCartItem = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const cart = await Cart.updateQuantity(productId, quantity);
  res.json(cart);
};

const decreaseCartItem = async (req, res) => {
  try {
    const productId = req.params.id;
    const cart = await Cart.decreaseQuantity(productId);
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const increaseCartItem = async (req, res) => {
  try {
    const id = req.params.id;
    const cart = await Cart.increaseQuantity(id);
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCartItems, addCartItem, removeCartItem, updateCartItem,
   decreaseCartItem, increaseCartItem };
