const db = require("../db"); // Your MySQL connection pool

const Order = {
  // Create a new order
  create: async ({ userId, items, totalAmount, orderId }) => {
    const [result] = await db.execute(
      "INSERT INTO orders (user_id, items, total_amount, order_id, status) VALUES (?, ?, ?, ?, ?)",
      [userId, JSON.stringify(items), totalAmount, orderId, "pending"]
    );
    return result;
  },

  // Find order by Razorpay order ID
  findByOrderId: async (orderId) => {
    const [rows] = await db.execute(
      "SELECT * FROM orders WHERE order_id = ?",
      [orderId]
    );
    return rows[0];
  },

  // Update order after payment
  updatePayment: async (orderId, paymentId) => {
    await db.execute(
      "UPDATE orders SET payment_id = ?, status = 'completed' WHERE order_id = ?",
      [paymentId, orderId]
    );
  }
};

module.exports = Order;
