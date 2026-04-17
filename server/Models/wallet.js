const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        balance: {
            type: Number,
            default: 0,
        },
        totalEarned: {
            type: Number,
            default: 0, // For authors: lifetime tokens earned
        },
        totalSpent: {
            type: Number,
            default: 0, // For readers: lifetime tokens spent
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Wallet", walletSchema);
