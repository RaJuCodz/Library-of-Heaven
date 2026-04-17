const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
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
        addedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: false }
);

// One bookmark per user per novel
bookmarkSchema.index({ userId: 1, novelId: 1 }, { unique: true });

module.exports = mongoose.model("Bookmark", bookmarkSchema);
