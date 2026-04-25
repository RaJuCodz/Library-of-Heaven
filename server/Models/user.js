const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR74nwayFqBU2c60l_hbOyERXzGF2IPEvVSTQ&s",
    },
    role: {
      type: String,
      default: "reader",
      enum: ["reader", "author", "admin"],
    },
    library: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book", // Note we still use Book schema internally to avoid huge refactors everywhere immediately
      },
    ],
    authorName: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    penName: {
      type: String,
    },
    socialLinks: {
      twitter: String,
      instagram: String,
      website: String,
    },
    isVerifiedAuthor: {
      type: Boolean,
      default: false,
    },
    lastDailyReward: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
