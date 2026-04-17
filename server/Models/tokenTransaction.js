const mongoose = require("mongoose");

const tokenTransactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["purchase", "spend", "earn", "refund", "bonus"],
            required: true,
        },
        amount: {
            type: Number, // positive = credit, negative = debit
            required: true,
        },
        description: {
            type: String, // "Purchased 100 tokens", "Unlocked Ch 4 of Novel X"
            required: true,
        },
        relatedNovel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
        },
        relatedChapter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chapter",
        },
        paymentId: {
            type: String, // e.g. Razorpay payment ID
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("TokenTransaction", tokenTransactionSchema);
