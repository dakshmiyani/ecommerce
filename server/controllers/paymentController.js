const crypto = require("crypto");
const razorpayInstance = require("../config/razorpayConfig");

const Order = require("../models/order.model");

/**
 * CREATE ORDER
 */
exports.createOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ success: false, message: "Order ID is required" });
        }

        const orderDB = await Order.findById(orderId);
        if (!orderDB) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const options = {
            amount: Math.round(orderDB.totalAmount * 100), // Razorpay works in paise
            currency: "INR",
            receipt: `receipt_${orderId}`,
        };

        const order = await razorpayInstance.orders.create(options);

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Order creation failed",
            error: error.message,
        });
    }
};

/**
 * VERIFY PAYMENT
 */
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId,
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest("hex");

        console.log("Expected Signature:", expectedSign);
        console.log("Received Signature:", razorpay_signature);

        if (razorpay_signature === expectedSign) {
            if (orderId) {
                const order = await Order.findByIdAndUpdate(orderId, { paymentStatus: "paid" });

                // Clear the user's cart after successful payment
                if (order && order.userId) {
                    const cart = await require('../models/cart.model').findOne({ userId: order.userId });
                    if (cart) {
                        cart.items = [];
                        cart.totalPrice = 0;
                        await cart.save();
                    }
                }
            }

            res.status(200).json({
                success: true,
                message: "Payment verified successfully",
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid signature",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Payment verification failed",
            error: error.message,
        });
    }
};