import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats, // ✅ FIXED NAME
  uploadProductImage,
} from "../controllers/productController.js";

import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { productSchema, productUpdateSchema } from "../schemas/product.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { addReview } from "../controllers/reviewController.js";
import { upload } from "../middleware/uploadMiddlerware.js";



const router = Router();

//  Public routes
router.get("/", asyncHandler(getProducts));
router.get("/stats", asyncHandler(getProductStats));
router.get("/:id", asyncHandler(getProductById));

//  Protected routes
router.post(
  "/:id/image",
  protect,
  admin,
  upload.single("image"),
  asyncHandler(uploadProductImage)
);

// ✅ Reviews (authenticated users)
router.post("/:id/reviews", protect, asyncHandler(addReview));

// ✅ Admin only routes
router.post("/", protect, admin, validate(productSchema), asyncHandler(createProduct));
router.put("/:id", protect, admin, validate(productSchema), asyncHandler(updateProduct));
router.patch("/:id", protect, admin, validate(productUpdateSchema), asyncHandler(updateProduct));
router.delete("/:id", protect, admin, asyncHandler(deleteProduct));

export default router;