import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { createServer } from "http";
import { initSocket } from "./config/socket.js";
import swaggerUi from "swagger-ui-express";
import mongoose from "mongoose";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { asyncHandler } from "./utils/asyncHandler.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import { limiter } from "./middleware/ratelimit.js";
import orderRoutes from "./routes/orderRoutes.js";
import { swaggerSpec } from "./config/swagger.js";
import path from "path";
// Load environment variables
dotenv.config();
// Connect MongoDB
connectDB();
const app = express();
const httpServer = createServer(app);
const io = initSocket(httpServer);
// Security Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(limiter);
// Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
// Logging Middleware
app.use(morgan("combined"));
app.use(requestLogger);
// Swagger Documentation
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
        persistAuthorization: true,
    },
}));
// Root and health routes
app.get("/", asyncHandler(async (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the MERN backend API",
        apiBase: "/api/v1",
        docs: "/api/docs",
    });
}));
app.get("/api/v1", asyncHandler(async (req, res) => {
    res.json({
        success: true,
        message: "API v1 root",
        routes: [
            "/api/v1/products",
            "/api/v1/auth/login",
            "/api/v1/auth/register",
            "/api/v1/orders",
        ],
    });
}));
app.get("/api/health", asyncHandler(async (req, res) => {
    const dbConnected = mongoose.connection.readyState === 1;
    res.json({
        status: "ok",
        db: dbConnected ? "connected" : "disconnected",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
        version: "3.0.0",
    });
}));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// Product Routes (Module 2 )
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/orders", orderRoutes);
// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path,
    });
});
// Error Handler
app.use(errorHandler);
// Socket.IO Connection (for live orders)
io.on("connection", (socket) => {
    console.log(`[Socket.IO] User connected: ${socket.id}`);
    socket.on("disconnect", () => {
        console.log(`[Socket.IO] User disconnected: ${socket.id}`);
    });
});
// Export for testing
export { app, httpServer, io };
// Start Server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
    console.log(` API Base: http://localhost:${PORT}/api/v1`);
    console.log(` Socket.IO: http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map