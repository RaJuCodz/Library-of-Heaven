const router = require("express").Router();
const Book = require("../Models/books");
const Chapter = require("../Models/chapter");
const UnlockedChapter = require("../Models/unlockedChapter");
const Wallet = require("../Models/wallet");
const TokenTransaction = require("../Models/tokenTransaction");
const { auth } = require("./userAuth");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "bookstore_chapters",
    allowed_formats: ["pdf", "epub", "jpg", "png", "jpeg"],
  },
});
const upload = multer({ storage: storage });

// Add new chapter
router.post(
  "/add_chapter/:novelId",
  auth,
  upload.single("contentFile"),
  async (req, res) => {
    try {
      const { novelId } = req.params;
      const authorId = req.headers.id;
      const {
        chapterNumber,
        title,
        content,
        contentType,
        isPublished,
        price,
        isFree: manualIsFree,
      } = req.body;

      // Verify novel ownership
      const novel = await Book.findById(novelId);
      if (!novel) return res.status(404).json({ message: "Novel not found" });
      if (novel.authorId.toString() !== authorId) {
        return res
          .status(403)
          .json({ message: "Not authorized to add chapters to this novel" });
      }

      // Determine if it's free (either manually set, or determined by novel's free chapters)
      let isFree = parseInt(chapterNumber) <= novel.freeChapters;
      if (manualIsFree !== undefined) {
        isFree = manualIsFree === "true" || manualIsFree === true;
      }
      let contentFileUrl = "";

      if (req.file) {
        contentFileUrl = req.file.path;
      }

      const newChapter = new Chapter({
        novelId,
        chapterNumber: parseInt(chapterNumber),
        title,
        content,
        contentFile: contentFileUrl,
        contentType: contentType || "text",
        isFree,
        price: price !== undefined && price !== "" ? Number(price) : null,
        isPublished: isPublished === "true" || isPublished === true,
        publishedAt:
          isPublished === "true" || isPublished === true ? new Date() : null,
      });

      const savedChapter = await newChapter.save();

      // Update novel total chapters
      novel.totalChapters = await Chapter.countDocuments({
        novelId,
        isPublished: true,
      });
      await novel.save();

      res
        .status(200)
        .json({ message: "Chapter added successfully", chapter: savedChapter });
    } catch (err) {
      if (err.code === 11000) {
        return res
          .status(400)
          .json({ message: "Chapter number already exists for this novel" });
      }
      console.error("Error adding chapter:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

// Update chapter
router.put(
  "/update_chapter/:chapterId",
  auth,
  upload.single("contentFile"),
  async (req, res) => {
    try {
      const { chapterId } = req.params;
      const authorId = req.headers.id;

      const chapter = await Chapter.findById(chapterId);
      if (!chapter)
        return res.status(404).json({ message: "Chapter not found" });

      const novel = await Book.findById(chapter.novelId);
      if (!novel || novel.authorId.toString() !== authorId) {
        return res
          .status(403)
          .json({ message: "Not authorized to edit this chapter" });
      }

      const { title, content, isPublished, contentType } = req.body;

      if (title !== undefined) chapter.title = title;
      if (content !== undefined) chapter.content = content;
      if (contentType !== undefined) chapter.contentType = contentType;
      if (req.file) chapter.contentFile = req.file.path;

      if (isPublished !== undefined) {
        const pubMode = isPublished === "true" || isPublished === true;
        if (pubMode && !chapter.isPublished) {
          chapter.publishedAt = new Date();
        }
        chapter.isPublished = pubMode;
      }

      await chapter.save();

      // Update novel total chapters (if publish state changed)
      novel.totalChapters = await Chapter.countDocuments({
        novelId: novel._id,
        isPublished: true,
      });
      await novel.save();

      res.status(200).json({ message: "Chapter updated successfully" });
    } catch (err) {
      console.error("Error updating chapter:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

// Get chapter list for a novel (Titles only + locked status)
router.get("/get_chapters/:novelId", async (req, res) => {
  try {
    const { novelId } = req.params;
    const chapters = await Chapter.find({ novelId, isPublished: true })
      .select("chapterNumber title isFree contentType createdAt viewCount")
      .sort({ chapterNumber: 1 });

    res.status(200).json({ data: chapters });
  } catch (err) {
    console.error("Error getting chapters", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Read chapter content
router.get("/read_chapter/:chapterId", auth, async (req, res) => {
  try {
    const { chapterId } = req.params;
    const userId = req.headers.id;

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) return res.status(404).json({ message: "Chapter not found" });
    if (!chapter.isPublished)
      return res.status(403).json({ message: "Chapter is not published yet" });

    // If chapter is free, everyone can read it
    if (chapter.isFree) {
      // Increment view count
      chapter.viewCount += 1;
      await chapter.save();
      return res.status(200).json({ data: chapter });
    }

    // If chapter is paid, check if author OR if user unlocked it
    const novel = await Book.findById(chapter.novelId);
    if (novel.authorId.toString() === userId) {
      return res.status(200).json({ data: chapter }); // Author can read their own
    }

    const isUnlocked = await UnlockedChapter.findOne({ userId, chapterId });
    if (isUnlocked) {
      chapter.viewCount += 1;
      await chapter.save();
      return res.status(200).json({ data: chapter });
    }

    // If neither, return 402 Payment Required
    res.status(402).json({
      message: "Chapter is locked. Please spend tokens to unlock.",
      price:
        chapter.price !== null && chapter.price !== undefined
          ? chapter.price
          : novel.chapterPrice || 5,
    });
  } catch (err) {
    console.error("Error reading chapter", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get ALL chapters for a novel (including drafts) — author only
router.get("/get_author_chapters/:novelId", auth, async (req, res) => {
  try {
    const { novelId } = req.params;
    const authorId = req.headers.id;

    const novel = await Book.findById(novelId);
    if (!novel) return res.status(404).json({ message: "Novel not found" });
    if (novel.authorId.toString() !== authorId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const chapters = await Chapter.find({ novelId })
      .select(
        "chapterNumber title isFree isPublished price contentType viewCount publishedAt createdAt",
      )
      .sort({ chapterNumber: 1 });

    res.status(200).json({ data: chapters });
  } catch (err) {
    console.error("Error fetching author chapters", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a chapter — author only
router.delete("/delete_chapter/:chapterId", auth, async (req, res) => {
  try {
    const { chapterId } = req.params;
    const authorId = req.headers.id;

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) return res.status(404).json({ message: "Chapter not found" });

    const novel = await Book.findById(chapter.novelId);
    if (!novel || novel.authorId.toString() !== authorId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this chapter" });
    }

    await Chapter.findByIdAndDelete(chapterId);

    // Keep novel's totalChapters count in sync
    novel.totalChapters = await Chapter.countDocuments({
      novelId: novel._id,
      isPublished: true,
    });
    await novel.save();

    res.status(200).json({ message: "Chapter deleted successfully" });
  } catch (err) {
    console.error("Error deleting chapter:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
