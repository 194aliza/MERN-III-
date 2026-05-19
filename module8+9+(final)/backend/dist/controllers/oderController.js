import mongoose from "mongoose";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { AppError } from "../utils/apperror.js";
//  CREATE ORDER (WITH TRANSACTION, FALLBACK FOR TEST ENV)
import { getIo } from "../config/socket.js";
import { sendEmail } from "../utils/sendemail.js";
export const createOrder = async (req, res) => {
    const incomingItems = req.body.items || [];
    const items = incomingItems.map((item) => ({
        product: item.product || item.productId,
        quantity: item.quantity,
    }));
    let totalPrice = 0;
    let session = null;
    let useTransaction = true;
    // Check if we're in a test environment
    const isTest = process.env.NODE_ENV === 'test';
    if (!isTest) {
        // Try to use transaction for production
        try {
            session = await mongoose.startSession();
            session.startTransaction();
        }
        catch (err) {
            // Transactions not supported, continue without
            useTransaction = false;
        }
    }
    else {
        // Skip transactions in test environment
        useTransaction = false;
    }
    try {
        for (const item of items) {
            const product = await Product.findById(item.product).session(useTransaction ? session : null);
            if (!product)
                throw new AppError("Product not found", 404);
            if (product.stock < item.quantity)
                throw new AppError("Not enough stock", 400);
            product.stock -= item.quantity;
            await product.save({ session: useTransaction ? session : null });
            totalPrice += product.price * item.quantity;
        }
        const order = await Order.create([{ user: req.user._id, items, totalPrice }], useTransaction ? { session } : {});
        // Only send email in production environment
        if (!isTest && req.user && req.user.email) {
            try {
                await sendEmail(req.user.email, "Order Confirmed ", `<h2>Order Placed Successfully</h2>
           <p>Total: $${totalPrice}</p>`);
            }
            catch (err) {
                console.log("Email sending failed but order was created:", err);
            }
        }
        if (useTransaction && session) {
            await session.commitTransaction();
            session.endSession();
        }
        // SOCKET EMIT (only if initialized)
        try {
            getIo().emit("newOrder", {
                id: order[0]._id,
                amount: order[0].totalPrice,
                time: new Date().toLocaleTimeString(),
            });
        }
        catch (err) {
            // Socket.IO not initialized (e.g., in tests)
            console.log("Socket.IO not available, skipping emit");
        }
        //  RESPONSE
        res.status(201).json(order[0]);
    }
    catch (error) {
        if (useTransaction && session) {
            await session.abortTransaction();
            session.endSession();
        }
        throw error;
    }
};
// GET MY ORDERS
export const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .populate("items.product")
        .sort("-createdAt");
    res.json(orders);
};
export const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate("items.product")
        .populate("user", "name email role");
    if (!order) {
        throw new AppError("Order not found", 404);
    }
    if (req.user.role !== "admin" && order.user._id.toString() !== req.user._id.toString()) {
        throw new AppError("Not authorized", 403);
    }
    res.json(order);
};
//  ADMIN: GET ALL ORDERS
export const getAllOrders = async (req, res) => {
    const orders = await Order.find()
        .populate("user", "email")
        .populate("items.product");
    res.json(orders);
};
//  UPDATE ORDER STATUS (User can update their own, Admin can update any)
export const updateOrderStatus = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        throw new AppError("Order not found", 404);
    }
    // Check authorization: user must be admin or own the order
    if (req.user.role !== "admin" && order.user.toString() !== req.user._id.toString()) {
        throw new AppError("Not authorized to update this order", 403);
    }
    order.status = req.body.status || order.status;
    await order.save();
    res.json(order);
};
//# sourceMappingURL=oderController.js.map