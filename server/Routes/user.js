const router = require("express").Router();
const User = require("../Models/user");
const Book = require("../Models/books");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { auth } = require("./userAuth");

// Sign-up route
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;
    // console.log("gg");
    if (!username || username.length < 4) {
      return res
        .status(400)
        .json({ message: "Username must be at least 4 characters long" });
    }

    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      address: address,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error during sign-up:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Sign-in route
router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const authClaims = {
      name: user.username,
      role: user.role,
    };

    const token = jwt.sign(authClaims, "secret", { expiresIn: "30d" });

    res.status(200).json({ id: user._id, role: user.role, token });
  } catch (err) {
    console.error("Error during sign-in:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user info route
router.get("/get_user_info", auth, async (req, res) => {
  try {
    const id = req.headers.id;
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user info:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
//update user info

router.put("/update_address", auth, async (req, res) => {
  try {
    const id = req.headers.id;
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.address = address;
    await user.save();

    res.status(200).json({ message: "Address updated successfully" });
  } catch (err) {
    console.error("Error updating address:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add to favorites route
router.post("/add_to_fav", auth, async (req, res) => {
  try {
    const userId = req.headers.id;
    const { book_id } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!book_id) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const book = await Book.findById(book_id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if book is already in favorites
    if (user.fav && user.fav.includes(book_id)) {
      return res.status(400).json({ message: "Book is already in favorites" });
    }

    // Add book to favorites
    if (!user.fav) {
      user.fav = [];
    }
    user.fav.push(book_id);
    await user.save();

    res.status(200).json({ message: "Book added to favorites successfully" });
  } catch (err) {
    console.error("Error adding to favorites:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get favorites route
router.get("/get_favorites", auth, async (req, res) => {
  try {
    const userId = req.headers.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId).populate("fav");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ favorites: user.fav || [] });
  } catch (err) {
    console.error("Error getting favorites:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Remove from favorites route
router.delete("/remove_from_fav", auth, async (req, res) => {
  try {
    const userId = req.headers.id;
    const { book_id } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!book_id) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove book from favorites
    user.fav = user.fav.filter((id) => id.toString() !== book_id);
    await user.save();

    res
      .status(200)
      .json({ message: "Book removed from favorites successfully" });
  } catch (err) {
    console.error("Error removing from favorites:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Become Author route
router.put("/become_author", auth, async (req, res) => {
  try {
    const id = req.headers.id;
    const { authorName, bio } = req.body;
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (!authorName || !bio) {
      return res
        .status(400)
        .json({ message: "Author Name and Bio are required" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.role = "admin";
    user.authorName = authorName;
    user.bio = bio;
    await user.save();
    res.status(200).json({ message: "You are now an author (admin)!" });
  } catch (err) {
    console.error("Error updating user role to admin:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
