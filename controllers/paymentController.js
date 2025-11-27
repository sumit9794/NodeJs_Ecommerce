const Razorpay = require("razorpay");
const Order = require("../models/paymentModel");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency, cart, userId } = req.body;
    const options = { amount: amount * 100, currency: currency || "INR", payment_capture: 1 };
    const order = await razorpay.orders.create(options);

    await Order.create({ userId, items: cart, totalAmount: amount, orderId: order.id });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id } = req.body;
    const order = await Order.findByOrderId(razorpay_order_id);
    console.log(order);
    if (!order) return res.status(404).json({ error: "Order not found" });

    await Order.updatePayment(razorpay_order_id, razorpay_payment_id);
    res.json({ message: "Payment verified and order completed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment verification failed" });
  }
};
