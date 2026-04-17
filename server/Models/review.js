const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        novelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            trim: true,
        },
        likes: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// One review per user per novel
reviewSchema.index({ userId: 1, novelId: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
