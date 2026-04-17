const router = require("express").Router();
const User = require("../Models/user");
const jwt = require("jsonwebtoken");
const { auth } = require("./userAuth");
const Book = require("../Models/books");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary config (ensure your .env has CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "bookstore_books",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
  },
});
const upload = multer({ storage: storage });

// Add single novel
router.post("/add_novel", auth, async (req, res) => {
  try {
    const {
      title,
      author,
      cover_image,
      synopsis,
      genres,
      tags,
      totalChapters,
      freeChapters,
      chapterPrice,
      language,
      contentRating,
    } = req.body;
    const authorId = req.headers.id;

    if (!title || !author || !cover_image || !synopsis) {
      return res.status(400).json({
        message: "Required fields missing: title, author, cover_image, synopsis",
      });
    }

    if (!authorId) {
      return res.status(400).json({ message: "Author ID is required" });
    }

    const newNovel = new Book({
      title,
      author,
      cover_image,
      synopsis,
      genres: genres || [],
      tags: tags || [],
      totalChapters: totalChapters || 0,
      freeChapters: freeChapters || 3,
      chapterPrice: chapterPrice !== undefined ? chapterPrice : 5,
      language: language || "English",
      contentRating: contentRating || "everyone",
      authorId,
    });

    const savedNovel = await newNovel.save();
    res.status(200).json({
      message: "Novel added successfully",
      novel_id: savedNovel._id,
      novel: savedNovel,
    });
  } catch (err) {
    console.error("Error adding novel:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update novel
router.put("/update_novel", auth, async (req, res) => {
  try {
    const { novel_id } = req.headers;
    const authorId = req.headers.id; // added auth check
    if (!novel_id) {
      return res.status(400).json({ message: "Novel ID is required" });
    }

    const {
      title,
      author,
      cover_image,
      synopsis,
      genres,
      tags,
      status,
      freeChapters,
      chapterPrice,
      language,
      contentRating,
    } = req.body;

    const novel = await Book.findById(novel_id);
    if (!novel) {
      return res.status(404).json({ message: "Novel not found" });
    }

    if (novel.authorId.toString() !== authorId) {
      return res.status(403).json({ message: "Not authorized to update this novel" });
    }

    if (title !== undefined) novel.title = title;
    if (author !== undefined) novel.author = author;
    if (cover_image !== undefined) novel.cover_image = cover_image;
    if (synopsis !== undefined) novel.synopsis = synopsis;
    if (genres !== undefined) novel.genres = genres;
    if (tags !== undefined) novel.tags = tags;
    if (status !== undefined) novel.status = status;
    if (freeChapters !== undefined) novel.freeChapters = freeChapters;
    if (chapterPrice !== undefined) novel.chapterPrice = chapterPrice;
    if (language !== undefined) novel.language = language;
    if (contentRating !== undefined) novel.contentRating = contentRating;

    await novel.save();
    res.status(200).json({ message: "Novel updated successfully" });
  } catch (err) {
    console.error("Error updating novel:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete novel
router.delete("/delete_novel", auth, async (req, res) => {
  try {
    const { novel_id } = req.headers;
    const authorId = req.headers.id;
    if (!novel_id) {
      return res.status(400).json({ message: "Novel ID is required" });
    }
    if (!authorId) {
      return res.status(400).json({ message: "Author ID is required" });
    }
    const novel = await Book.findById(novel_id);
    if (!novel) {
      return res.status(404).json({ message: "Novel not found" });
    }
    if (novel.authorId.toString() !== authorId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this novel" });
    }
    await Book.findByIdAndDelete(novel_id);
    res.status(200).json({ message: "Novel deleted successfully" });
  } catch (err) {
    console.error("Error deleting novel:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all novels
router.get("/get_all_novels", async (req, res) => {
  try {
    const novels = await Book.find({}).sort({ createdAt: -1 });
    res.status(200).json({ data: novels });
  } catch (err) {
    console.error("Error getting novels:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get recent novels
router.get("/get_recent_novels", async (req, res) => {
  try {
    const novels = await Book.find({}).sort({ createdAt: -1 }).limit(20);
    res.status(200).json({ data: novels });
  } catch (err) {
    console.error("Error getting recent novels:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get novel by id
router.get("/get_novel_by_id/:novel_id", async (req, res) => {
  try {
    const { novel_id } = req.params;
    if (!novel_id) {
      return res.status(400).json({ message: "Novel ID is required" });
    }
    const novel = await Book.findById(novel_id);
    if (!novel) {
      return res.status(404).json({ message: "Novel not found" });
    }
    res.status(200).json({ data: novel });
  } catch (err) {
    console.error("Error getting novel by ID:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all novels by the logged-in author
router.get("/get_my_novels", auth, async (req, res) => {
  try {
    const authorId = req.headers.id;
    if (!authorId) {
      return res.status(400).json({ message: "Author ID is required" });
    }
    const novels = await Book.find({ authorId }).sort({ createdAt: -1 });
    res.status(200).json({ data: novels });
  } catch (err) {
    console.error("Error getting author's novels:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get trending novels (sorted by views/rating)
router.get("/get_trending_novels", async (req, res) => {
  try {
    // Basic trending logic: sort by viewCount and rating descending
    const novels = await Book.find({}).sort({ viewCount: -1, rating: -1 }).limit(20);
    res.status(200).json({ data: novels });
  } catch (err) {
    console.error("Error getting trending novels:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Search novels
router.get("/search_novels", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Search query required" });

    // Assuming text index on title and tags is properly built
    const novels = await Book.find({ $text: { $search: query } }).limit(50);
    res.status(200).json({ data: novels });
  } catch (err) {
    console.error("Error searching novels:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get novels by genre
router.get("/get_novels_by_genre", async (req, res) => {
  try {
    const { genre } = req.query;
    if (!genre) return res.status(400).json({ message: "Genre query parameter required" });

    const novels = await Book.find({ genres: genre }).sort({ createdAt: -1 });
    res.status(200).json({ data: novels });
  } catch (err) {
    console.error("Error getting novels by genre", err);
    res.status(500).json({ message: "Internal Server error" });
  }
});

// Image upload route
router.post("/upload_image", auth, upload.single("image"), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.status(200).json({ imageUrl: req.file.path });
});

// Get Author Novels
router.get("/get_author_novels", auth, async (req, res) => {
  try {
    const authorId = req.headers.id;
    if (!authorId) {
      return res.status(400).json({ message: "Author ID is required" });
    }
    const novels = await Book.find({ authorId }).sort({ createdAt: -1 });
    res.status(200).json({ data: novels });
  } catch (err) {
    console.error("Error fetching author novels", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
