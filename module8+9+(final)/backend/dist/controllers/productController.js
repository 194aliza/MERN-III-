import { Product } from "../models/product.js";
import { AppError } from "../utils/apperror.js";
// GET ALL
export const getProducts = async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};
    if (search) {
        query.name = { $regex: search, $options: "i" };
    }
    const products = await Product.find(query)
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));
    res.json(products);
};
export const uploadProductImage = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    const imagePath = `/uploads/${req.file.filename}`;
    product.images.push(imagePath);
    await product.save();
    res.json({
        message: "Image uploaded",
        image: imagePath,
    });
};
// GET ONE
export const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        throw new AppError("Product not found", 404);
    }
    res.json(product);
};
// CREATE
export const createProduct = async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).json(product);
};
// UPDATE
export const updateProduct = async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
        throw new AppError("Product not found", 404);
    }
    res.json(product);
};
// DELETE
export const deleteProduct = async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        throw new AppError("Product not found", 404);
    }
    res.json({ message: "Deleted successfully" });
};
// STATS
export const getProductStats = async (req, res) => {
    const stats = await Product.aggregate([
        {
            $group: {
                _id: "$category",
                avgPrice: { $avg: "$price" },
                count: { $sum: 1 }
            }
        }
    ]);
    res.json(stats);
};
//# sourceMappingURL=productController.js.map