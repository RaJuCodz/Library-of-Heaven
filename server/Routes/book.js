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
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});
const upload = multer({ storage: storage });

// Add single book
router.post("/add_book", auth, async (req, res) => {
  try {
    const { title, author, cover_image, price, description } = req.body;
    const authorId = req.headers.id;
    // Validate required fields
    if (!title || !author || !cover_image || !price || !description) {
      return res.status(400).json({
        message:
          "All fields are required: title, author, cover_image, price, description",
      });
    }
    if (!authorId) {
      return res.status(400).json({ message: "Author ID is required" });
    }
    const newBook = new Book({
      title,
      author,
      cover_image,
      price,
      description,
      authorId,
    });
    const savedBook = await newBook.save();
    res.status(200).json({
      message: "Book added successfully",
      book_id: savedBook._id,
      book: savedBook,
    });
  } catch (err) {
    console.error("Error adding book:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add multiple books at once
router.post("/add_books_bulk", auth, async (req, res) => {
  try {
    const { books } = req.body;

    if (!Array.isArray(books) || books.length === 0) {
      return res.status(400).json({
        message: "Please provide an array of books",
      });
    }

    // Validate each book in the array
    const validBooks = books.filter((book) => {
      return (
        book.title &&
        book.author &&
        book.cover_image &&
        book.price &&
        book.description
      );
    });

    if (validBooks.length !== books.length) {
      return res.status(400).json({
        message:
          "Some books are missing required fields. Each book must have: title, author, cover_image, price, description",
      });
    }

    // Insert all books at once
    const savedBooks = await Book.insertMany(validBooks);

    res.status(200).json({
      message: `${savedBooks.length} books added successfully`,
      books: savedBooks,
    });
  } catch (err) {
    console.error("Error adding books in bulk:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

//update book
router.put("/update_book", auth, async (req, res) => {
  try {
    const { book_id } = req.headers;
    if (!book_id) {
      return res.status(400).json({ message: "Book ID is required" });
    }
    const { url, title, author, price, description, image } = req.body;
    const book = await Book.findById(book_id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    book.url = url;
    book.title = title;
    book.author = author;
    book.price = price;
    book.description = description;
    book.image = image;
    await book.save();
    res.status(200).json({ message: "Book updated successfully" });
  } catch {}
});
module.exports = router;

// delete the book
router.delete("/delete_book", auth, async (req, res) => {
  try {
    const { book_id } = req.headers;
    const authorId = req.headers.id;
    if (!book_id) {
      return res.status(400).json({ message: "Book ID is required" });
    }
    if (!authorId) {
      return res.status(400).json({ message: "Author ID is required" });
    }
    const book = await Book.findById(book_id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.authorId.toString() !== authorId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this book" });
    }
    await Book.findByIdAndDelete(book_id);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
// get all books
router.get("/get_all_books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json({ data: books });
  } catch (err) {
    console.error("Error getting books:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/get_recent_books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json({ data: books });
  } catch (err) {
    console.error("Error getting books:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get book by id
router.get("/get_book_by_id/:book_id", async (req, res) => {
  try {
    const { book_id } = req.params;
    if (!book_id) {
      return res.status(400).json({ message: "Book ID is required" });
    }
    const book = await Book.findById(book_id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ data: book });
  } catch (err) {
    console.error("Error getting book by ID:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all books by the logged-in author
router.get("/get_my_books", auth, async (req, res) => {
  try {
    const authorId = req.headers.id;
    if (!authorId) {
      return res.status(400).json({ message: "Author ID is required" });
    }
    const books = await Book.find({ authorId }).sort({ createdAt: -1 });
    res.status(200).json({ data: books });
  } catch (err) {
    console.error("Error getting author's books:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Image upload route
router.post("/upload_image", auth, upload.single("image"), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.status(200).json({ imageUrl: req.file.path });
});
