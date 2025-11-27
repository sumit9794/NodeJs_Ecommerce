// models/cartModel.js
const db = require("../db");

// Get all cart items
const getCart = async () => {
  const [rows] = await db.query("SELECT * FROM cart");
  return rows;
};

// Add or update product in cart
const addToCart = async (product) => {
  const [rows] = await db.query("SELECT * FROM cart WHERE productId = ?", [
    product.productId,
  ]);

  if (rows.length > 0) {
    // Update quantity
    await db.query("UPDATE cart SET quantity = quantity + ? WHERE productId = ?", [
      product.quantity,
      product.productId,
    ]);
  } else {
    // Insert new product
    await db.query(
      "INSERT INTO cart (productId, name, price, quantity) VALUES (?, ?, ?, ?)",
      [product.productId, product.name, product.price, product.quantity]
    );
  }

  return getCart();
};

// Remove product
const removeFromCart = async (productId) => {
  await db.query("DELETE FROM cart WHERE id = ?", [productId]);
  return getCart();
};

// Update quantity
const updateQuantity = async (productId, quantity) => {
  await db.query("UPDATE cart SET quantity = ? WHERE productId = ?", [quantity, productId]);
  return getCart();
};

const decreaseQuantity = async (id) => {
  const [rows] = await db.query("SELECT quantity FROM cart WHERE id = ?", [id]);
  if (rows.length === 0) throw new Error("Item not found");

  let qty = rows[0].quantity;

  
  if (qty > 1) qty -= 1;

  await db.query("UPDATE cart SET quantity = ? WHERE id = ?", [qty, id]);
  return getCart();
};

const increaseQuantity = async (id) => {
  const [rows] = await db.query("SELECT quantity FROM cart WHERE id = ?", [id]);
  if (rows.length === 0) throw new Error("Item not found");

  let qty = rows[0].quantity;
  if (qty > 0) qty += 1;

  await db.query("UPDATE cart SET quantity = ? WHERE id = ?", [qty, id]);
  return getCart();
};



module.exports = { getCart, addToCart, removeFromCart, updateQuantity, decreaseQuantity, increaseQuantity};
