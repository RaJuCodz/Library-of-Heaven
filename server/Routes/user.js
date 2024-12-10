const router = require("express").Router();
const User = require("../Models/user");
const bcrypt = require("bcryptjs");

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

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
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error occurred:", err); // Log the error details
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
