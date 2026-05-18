import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/oderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// USER
router.post("/", protect, asyncHandler(createOrder));
router.get("/my", protect, asyncHandler(getMyOrders));
router.get("/:id", protect, asyncHandler(getOrderById));
router.patch("/:id", protect, asyncHandler(updateOrderStatus));

// ADMIN
router.get("/", protect, admin, asyncHandler(getAllOrders));
router.put("/:id/status", protect, admin, asyncHandler(updateOrderStatus));

export default router;