const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token || token === "null") {
      return res.status(401).json({ message: "Unauthorized, token missing" });
    }

    jwt.verify(token, "secret", (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      req.user = decoded; // Attach decoded token payload to the request object
      next();
    });
  } catch (error) {
    console.error("Error in auth middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { auth };
