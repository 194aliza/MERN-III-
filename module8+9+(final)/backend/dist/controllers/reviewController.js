import { Review } from "../models/review.js";
import { Product } from "../models/product.js";
//  ADD REVIEW
export const addReview = async (req, res) => {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const review = await Review.create({
        user: req.user._id,
        product: productId,
        rating,
        comment,
    });
    // 🔥 RECALCULATE AVERAGE RATING
    const stats = await Review.aggregate([
        { $match: { product: review.product } },
        {
            $group: {
                _id: "$product",
                avgRating: { $avg: "$rating" },
                numReviews: { $sum: 1 },
            },
        },
    ]);
    await Product.findByIdAndUpdate(productId, {
        avgRating: stats[0]?.avgRating || 0,
        numReviews: stats[0]?.numReviews || 0,
    });
    res.status(201).json(review);
};
//# sourceMappingURL=reviewController.js.map