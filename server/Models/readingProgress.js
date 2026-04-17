const mongoose = require("mongoose");

const readingProgressSchema = new mongoose.Schema(
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
        lastChapterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chapter",
            required: true,
        },
        lastChapterNumber: {
            type: Number,
            required: true,
        },
        lastReadAt: {
            type: Date,
            default: Date.now,
        },
        scrollPosition: {
            type: Number, // Percentage or pixel offset for resume functionality
            default: 0,
        },
    },
    { timestamps: false }
);

// One progress record per user per novel
readingProgressSchema.index({ userId: 1, novelId: 1 }, { unique: true });

module.exports = mongoose.model("ReadingProgress", readingProgressSchema);
