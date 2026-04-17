const router = require("express").Router();
const User = require("../Models/user");
const Book = require("../Models/books");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { auth } = require("./userAuth");
const {
  isUsernameInFilter,
  addToBloomFilter,
} = require("../utils/bloomFilter");

// Sign-up route
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
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
    });

    await newUser.save();

    // Add to bloom filter instantly to keep in memory fast access up to date
    addToBloomFilter(username);

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error during sign-up:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Check Username Availability route (Bloom Filter)
router.get("/check-username", async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res
        .status(400)
        .json({ message: "Username query parameter is required" });
    }

    // Fast check: Is it in the Bloom filter?
    const mightBeTaken = isUsernameInFilter(username);

    // If it's definitely NOT in the filter, it's available. No DB call needed!
    if (!mightBeTaken) {
      return res
        .status(200)
        .json({ available: true, message: "Username is available" });
    }

    // Bloom filters can have false positives, so if it returns true, we MUST verify with DB
    console.log(
      `[Bloom Filter] False positive check triggered for username: ${username}`,
    );
    const existingUser = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, "i") },
    });

    if (existingUser) {
      return res
        .status(200)
        .json({ available: false, message: "Username is already taken" });
    } else {
      return res
        .status(200)
        .json({ available: true, message: "Username is available" });
    }
  } catch (err) {
    console.error("Error checking username:", err);
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

// Add to library route
router.post("/add_to_library", auth, async (req, res) => {
  try {
    const userId = req.headers.id;
    const book_id = req.headers.book_id;

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

    // Check if book is already in library
    if (user.library && user.library.includes(book_id)) {
      return res.status(400).json({ message: "Book is already in library" });
    }

    // Add book to library
    if (!user.library) {
      user.library = [];
    }
    user.library.push(book_id);
    await user.save();

    res.status(200).json({ message: "Book added to library successfully" });
  } catch (err) {
    console.error("Error adding to library:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get library route
router.get("/get_library", auth, async (req, res) => {
  try {
    const userId = req.headers.id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId).populate("library");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ data: user.library || [] });
  } catch (err) {
    console.error("Error getting library:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Remove from library route
router.delete("/remove_from_library", auth, async (req, res) => {
  try {
    const userId = req.headers.id;
    const book_id = req.headers.book_id;

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

    // Remove book from library
    user.library = user.library.filter((id) => id.toString() !== book_id);
    await user.save();

    res.status(200).json({ message: "Book removed from library successfully" });
  } catch (err) {
    console.error("Error removing from library:", err);
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
    user.role = "author";
    user.authorName = authorName;
    user.bio = bio;
    await user.save();
    res.status(200).json({ message: "You are now an author (admin)!" });
  } catch (err) {
    console.error("Error updating user role to admin:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Verify password route (used before sensitive actions like delete)
router.post("/verify_password", auth, async (req, res) => {
  try {
    const id = req.headers.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.status(200).json({ message: "Password verified" });
  } catch (err) {
    console.error("Error verifying password:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
