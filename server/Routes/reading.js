const router = require("express").Router();
const ReadingProgress = require("../Models/readingProgress");
const Book = require("../Models/books");
const { auth } = require("./userAuth");

// Save or Update Reading Progress
router.post("/update_progress", auth, async (req, res) => {
    try {
        const userId = req.headers.id;
        const { novelId, chapterId, chapterNumber, scrollPosition } = req.body;

        if (!novelId || !chapterId || chapterNumber === undefined) {
            return res.status(400).json({ message: "Novel ID, Chapter ID, and Chapter Number are required" });
        }

        let progress = await ReadingProgress.findOne({ userId, novelId });

        if (!progress) {
            progress = new ReadingProgress({
                userId,
                novelId,
                lastChapterId: chapterId,
                lastChapterNumber: chapterNumber,
                scrollPosition: scrollPosition || 0,
                lastReadAt: new Date(),
            });
        } else {
            progress.lastChapterId = chapterId;
            progress.lastChapterNumber = chapterNumber;
            progress.scrollPosition = scrollPosition || 0;
            progress.lastReadAt = new Date();
        }

        await progress.save();

        res.status(200).json({ message: "Progress saved successfully" });
    } catch (err) {
        console.error("Error updating reading progress:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get Reading Progress for a specific Novel
router.get("/get_progress/:novelId", auth, async (req, res) => {
    try {
        const userId = req.headers.id;
        const { novelId } = req.params;

        const progress = await ReadingProgress.findOne({ userId, novelId })
            .select("lastChapterId lastChapterNumber scrollPosition lastReadAt");

        if (!progress) {
            return res.status(200).json({ data: null });
        }

        res.status(200).json({ data: progress });
    } catch (err) {
        console.error("Error fetching progress:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get "Continue Reading" List
router.get("/get_reading_list", auth, async (req, res) => {
    try {
        const userId = req.headers.id;
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        // Retrieve recent reading progress, populated with novel details
        const list = await ReadingProgress.find({ userId })
            .sort({ lastReadAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'novelId',
                select: 'title author cover_image totalChapters'
            });

        const total = await ReadingProgress.countDocuments({ userId });

        res.status(200).json({
            data: list,
            page,
            totalPages: Math.ceil(total / limit)
        });

    } catch (err) {
        console.error("Error fetching reading list:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
