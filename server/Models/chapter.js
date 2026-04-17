const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
    {
        novelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true,
        },
        chapterNumber: {
            type: Number,
            required: true,
        },
        title: {
            type: String, // e.g., "Chapter 1: The Beginning"
            required: true,
            trim: true,
        },
        content: {
            type: String, // Rich text / HTML for inline reading
        },
        contentFile: {
            type: String, // Cloudinary URL for uploaded PDF/EPUB
        },
        contentType: {
            type: String,
            enum: ["text", "pdf", "epub"],
            default: "text",
        },
        wordCount: {
            type: Number,
            default: 0,
        },
        isFree: {
            type: Boolean,
            default: false, // Computed when saving based on novel's freeChapters, but can be overridden
        },
        price: {
            type: Number,
            default: null, // Overrides novel.chapterPrice if set
        },
        isPublished: {
            type: Boolean,
            default: false, // Allows authors to draft
        },
        publishedAt: {
            type: Date,
        },
        viewCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Compound index to ensure chapter numbers are unique per novel
chapterSchema.index({ novelId: 1, chapterNumber: 1 }, { unique: true });

module.exports = mongoose.model("Chapter", chapterSchema);
