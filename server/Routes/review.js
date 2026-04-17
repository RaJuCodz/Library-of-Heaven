const router = require("express").Router();
const Review = require("../Models/review");
const Book = require("../Models/books");
const { auth } = require("./userAuth");

async function updateNovelRating(novelId) {
    // Calculate new average
    const stats = await Review.aggregate([
        { $match: { novelId: novelId } },
        { $group: { _id: "$novelId", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
    ]);

    if (stats.length > 0) {
        await Book.findByIdAndUpdate(novelId, {
            rating: Math.round(stats[0].avgRating * 10) / 10,  // round to 1 decimal
            ratingCount: stats[0].count
        });
    } else {
        await Book.findByIdAndUpdate(novelId, { rating: 0, ratingCount: 0 });
    }
}

// Add Review
router.post("/add_review/:novelId", auth, async (req, res) => {
    try {
        const userId = req.headers.id;
        const { novelId } = req.params;
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Valid rating (1-5) is required" });
        }

        const existingReview = await Review.findOne({ userId, novelId });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this novel" });
        }

        const review = new Review({
            userId,
            novelId,
            rating,
            comment
        });

        await review.save();
        await updateNovelRating(novelId);

        res.status(200).json({ message: "Review added successfully", review });
    } catch (err) {
        console.error("Error adding review:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Update Review
router.put("/update_review/:reviewId", auth, async (req, res) => {
    try {
        const userId = req.headers.id;
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ message: "Review not found" });

        if (review.userId.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to update this review" });
        }

        if (rating) review.rating = rating;
        if (comment !== undefined) review.comment = comment;

        await review.save();
        await updateNovelRating(review.novelId);

        res.status(200).json({ message: "Review updated successfully", review });
    } catch (err) {
        console.error("Error updating review:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Delete Review
router.delete("/delete_review/:reviewId", auth, async (req, res) => {
    try {
        const userId = req.headers.id;
        const { reviewId } = req.params;

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ message: "Review not found" });

        // Currently, only author of review can delete. Later can add admin logic
        if (review.userId.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to delete this review" });
        }

        const novelId = review.novelId;
        await Review.findByIdAndDelete(reviewId);
        await updateNovelRating(novelId);

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
        console.error("Error deleting review:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get Reviews for a Novel
router.get("/get_reviews/:novelId", async (req, res) => {
    try {
        const { novelId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const reviews = await Review.find({ novelId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("userId", "username avatar");

        const total = await Review.countDocuments({ novelId });

        res.status(200).json({
            data: reviews,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error("Error getting reviews:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
