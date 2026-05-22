import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

import { connectDB } from "./lib/db.js";
import { swaggerOptions } from "./lib/swagger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const startTime = Date.now();

const __dirname = path.resolve();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors({
	origin: process.env.CLIENT_URL || "http://localhost:3000",
	credentials: true,
}));

// Health Check Endpoint
app.get("/api/health", async (req, res) => {
	try {
		const mongoStatus = require("mongoose").connection.readyState;
		const dbConnected = mongoStatus === 1 ? "connected" : "disconnected";
		const uptime = Math.floor((Date.now() - startTime) / 1000);

		res.status(200).json({
			status: "ok",
			db: dbConnected,
			uptime,
			timestamp: new Date().toISOString(),
			environment: process.env.NODE_ENV || "development",
		});
	} catch (error) {
		res.status(500).json({
			status: "error",
			db: "disconnected",
			message: error.message,
		});
	}
});

// Swagger Documentation
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
	swaggerOptions: {
		url: "/api/swagger.json",
	},
}));
app.get("/api/swagger.json", (req, res) => {
	res.setHeader("Content-Type", "application/json");
	res.send(swaggerSpec);
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

// Production Setup
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

// Error Handler
app.use((err, req, res, next) => {
	console.error("Error:", err);
	res.status(500).json({
		message: "Server error",
		error: process.env.NODE_ENV === "production" ? {} : err.message,
	});
});

app.listen(PORT, () => {
	console.log("Server is running on http://localhost:" + PORT);
	console.log("Swagger UI available at http://localhost:" + PORT + "/api/docs");
	connectDB();
});
