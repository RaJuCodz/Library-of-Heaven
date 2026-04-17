const mongoose = require("mongoose");

const unlockedChapterSchema = new mongoose.Schema(
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
        chapterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chapter",
            required: true,
        },
        unlockedAt: {
            type: Date,
            default: Date.now,
        },
        tokenSpent: {
            type: Number,
            required: true, // Amount of tokens spent to unlock (could be 0 if promo)
        },
    },
    { timestamps: false }
);

// A user can only unlock a specific chapter once
unlockedChapterSchema.index({ userId: 1, chapterId: 1 }, { unique: true });

module.exports = mongoose.model("UnlockedChapter", unlockedChapterSchema);
