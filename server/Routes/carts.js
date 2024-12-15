const router = require("express").Router();
const User = require("../Models/user");
const jwt = require("jsonwebtoken");
const { auth } = require("./userAuth");
const Book = require("../Models/books");

router.post("/add_to_cart", auth, async (req, res) => {
  try {
    const { id, book_id } = req.headers;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.cart.includes(book_id)) {
      return res.status(200).json({ message: "Book already added to cart" });
    }
    user.cart.push(book_id);
    await user.save();
    res.status(200).json({ message: "Book added to cart" });
  } catch (err) {}
});

// remove from cart

router.post("/remove_from_cart", auth, async (req, res) => {
  try {
    const { id, book_id } = req.headers;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isAdded = user.cart.includes(book_id);
    if (!isAdded) {
      return res.status(200).json({ message: "Book not added to cart" });
    }
    user.cart = user.cart.filter((item) => item != book_id);
    await user.save();
    return res.status(200).json({ message: "Book removed from cart" });
  } catch (rrr) {}
});

// show cart

router.get("/show_cart", auth, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id).populate("cart");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ data: user.cart });
  } catch (err) {
    console.error("Error getting favourite books:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
