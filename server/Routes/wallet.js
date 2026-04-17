const router = require("express").Router();
const Wallet = require("../Models/wallet");
const TokenTransaction = require("../Models/tokenTransaction");
const User = require("../Models/user");
const Book = require("../Models/books");
const Chapter = require("../Models/chapter");
const UnlockedChapter = require("../Models/unlockedChapter");
const { auth } = require("./userAuth");
const mongoose = require("mongoose");

// Initialize or Get Wallet
router.get("/get_wallet", auth, async (req, res) => {
    try {
        const userId = req.headers.id;
        let wallet = await Wallet.findOne({ userId });

        // Auto-create wallet if it doesn't exist
        if (!wallet) {
            wallet = new Wallet({ userId, balance: 0, totalEarned: 0, totalSpent: 0 });
            await wallet.save();
        }

        res.status(200).json({ data: wallet });
    } catch (err) {
        console.error("Error fetching wallet:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Mock Purchase Tokens Flow (Phase 2 - replace with Razorpay/Stripe later)
router.post("/buy_tokens", auth, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userId = req.headers.id;
        const { amount, paymentMethod } = req.body; // Mock amounts like 100, 500

        if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });

        let wallet = await Wallet.findOne({ userId }).session(session);
        if (!wallet) {
            wallet = new Wallet({ userId, balance: 0, totalEarned: 0, totalSpent: 0 });
        }

        wallet.balance += parseInt(amount);
        await wallet.save({ session });

        const transaction = new TokenTransaction({
            userId,
            type: "purchase",
            amount: parseInt(amount),
            description: `Purchased ${amount} tokens via ${paymentMethod || 'MockPayment'}`,
            paymentId: "MOCK_PAYMENT_ID_" + Date.now(),
        });
        await transaction.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: "Tokens purchased successfully", balance: wallet.balance });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error purchasing tokens:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Unlock Chapter Flow
router.post("/unlock_chapter/:chapterId", auth, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { chapterId } = req.params;
        const userId = req.headers.id;

        const chapter = await Chapter.findById(chapterId).session(session);
        if (!chapter) throw new Error("Chapter not found");

        if (chapter.isFree) {
            return res.status(200).json({ message: "Chapter is already free!" });
        }

        const novel = await Book.findById(chapter.novelId).session(session);
        if (!novel) throw new Error("Novel not found");

        // Check if already unlocked
        const existingUnlock = await UnlockedChapter.findOne({ userId, chapterId }).session(session);
        if (existingUnlock) {
            return res.status(200).json({ message: "Chapter already unlocked" });
        }

        // Deduct from wallet
        const price = novel.chapterPrice || 5;
        const wallet = await Wallet.findOne({ userId }).session(session);

        if (!wallet || wallet.balance < price) {
            throw new Error("INSUFFICIENT_FUNDS");
        }

        wallet.balance -= price;
        wallet.totalSpent += price;
        await wallet.save({ session });

        // Record Unlock
        const unlockRecord = new UnlockedChapter({
            userId,
            novelId: novel._id,
            chapterId,
            tokenSpent: price
        });
        await unlockRecord.save({ session });

        // Record Transaction for Reader
        const spendTx = new TokenTransaction({
            userId,
            type: "spend",
            amount: -price,
            description: `Unlocked Chapter ${chapter.chapterNumber} of ${novel.title}`,
            relatedNovel: novel._id,
            relatedChapter: chapterId,
        });
        await spendTx.save({ session });

        // Optional: Credit the author's wallet
        const authorWallet = await Wallet.findOne({ userId: novel.authorId }).session(session);
        if (authorWallet) {
            // Example: Platform takes 30%, Author gets 70%
            const authorShare = Math.floor(price * 0.7);
            authorWallet.balance += authorShare;
            authorWallet.totalEarned += authorShare;
            await authorWallet.save({ session });

            const earnTx = new TokenTransaction({
                userId: novel.authorId,
                type: "earn",
                amount: authorShare,
                description: `Earnings from user unlocking Chapter ${chapter.chapterNumber} of ${novel.title}`,
                relatedNovel: novel._id,
                relatedChapter: chapterId,
            });
            await earnTx.save({ session });
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: "Chapter unlocked successfully", balance: wallet.balance });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();

        if (err.message === "INSUFFICIENT_FUNDS") {
            return res.status(402).json({ message: "Insufficient tokens balance. Please recharge." });
        }
        console.error("Error unlocking chapter:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Transaction History
router.get("/transaction_history", auth, async (req, res) => {
    try {
        const userId = req.headers.id;
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        const history = await TokenTransaction.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await TokenTransaction.countDocuments({ userId });

        res.status(200).json({
            data: history,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error("Error getting transaction history:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get Unlocked Chapters for a Novel
router.get("/get_unlocked_chapters/:novelId", auth, async (req, res) => {
    try {
        const userId = req.headers.id;
        const { novelId } = req.params;

        const unlocked = await UnlockedChapter.find({ userId, novelId }).select("chapterId");

        // Return array of chapter ID strings that are unlocked
        res.status(200).json({
            data: unlocked.map(u => u.chapterId.toString())
        });
    } catch (err) {
        console.error("Error getting unlocked chapters:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
