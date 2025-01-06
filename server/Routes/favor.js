const router = require("express").Router();
const User = require("../Models/user");
const jwt = require("jsonwebtoken");
const { auth } = require("./userAuth");

// adding favourite
router.put("/add_favourite", auth, async (req, res) => {
  try {
    const { id, book_id } = req.headers;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.fav.includes(book_id)) {
      return res
        .status(200)
        .json({ message: "Book already added to favourites" });
    }
    user.fav.push(book_id);
    await user.save();
    res.status(200).json({ message: "Book added to favourites" });
  } catch (err) {}
});

//removing favourite
router.post("/remove_favourite", auth, async (req, res) => {
  try {
    const { id, book_id } = req.headers;
    const user = await User.findById(id);
    const isFav = user.fav.includes(book_id);
    if (!isFav) {
      return res.status(200).json({ message: "Book not found in favourites" });
    }
    user.fav.pull(book_id);
    await user.save();
    res.status(200).json({ message: "Book removed from favourites" });
  } catch (err) {
    console.error("Error removing book from favourites:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get fav books
router.get("/get_fav_books", auth, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id).populate("fav");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const favBooks = user.fav;
    res.status(200).json({ data: favBooks });
  } catch (err) {
    console.error("Error getting favourite books:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
