const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    author: {
      type: String, // Author display name
      required: true,
      trim: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cover_image: {
      type: String, // Cloudinary URL
      required: true,
    },
    synopsis: {
      type: String,
      required: true,
      trim: true,
    },
    genres: [
      {
        type: String,
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ["ongoing", "completed", "hiatus"],
      default: "ongoing",
    },
    totalChapters: {
      type: Number,
      default: 0,
    },
    freeChapters: {
      type: Number,
      default: 3,
    },
    chapterPrice: {
      type: Number, // tokens per chapter
      default: 5,
    },
    rating: {
      type: Number, // average 0-5
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    bookmarkCount: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
      default: "English",
    },
    contentRating: {
      type: String,
      enum: ["everyone", "teen", "mature"],
      default: "everyone",
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for sorting by createdAt and searching
bookSchema.index({ createdAt: -1 });
bookSchema.index({ genres: 1 });
bookSchema.index({ title: "text", tags: "text" });

module.exports = mongoose.model("Book", bookSchema);
