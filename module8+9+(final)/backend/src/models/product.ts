import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    stock: { type: Number, default: 0 },
    images: [String],
    ratings: [Number]
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);