const router = require("express").Router();
const User = require("../Models/user");
const jwt = require("jsonwebtoken");
const { auth } = require("./userAuth");
const Book = require("../Models/books");
const Order = require("../Models/order");

router.post("/place_order", auth, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;
    for (const orderData of order) {
      const newOrder = new Order({
        user: id,
        book: orderData.book_id,
      });
      const orderDatafromDB = await newOrder.save();
      await User.findOneAndUpdate(id, {
        $push: { orders: orderDatafromDB._id },
      });
      await User.findOneAndUpdate(id, {
        $pull: { cart: orderData.book_id },
      });
    }
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/get_order_history", auth, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id).populate({
      path: "orders",
      populate: {
        path: "book",
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ data: user.orders });
  } catch (err) {
    console.error("Error getting order history:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/get_all_orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "book",
      })
      .populate({
        path: "user",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ data: orders });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/update_order_status", async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    await Order.findByIdAndUpdate(id, {
      status: req.body.status,
    });
    res.status(200).json({ message: "Order status updated successfully" });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all orders for books by the logged-in author
router.get("/get_author_orders", auth, async (req, res) => {
  try {
    const authorId = req.headers.id;
    if (!authorId) {
      return res.status(400).json({ message: "Author ID is required" });
    }
    // Find all books by this author
    const books = await Book.find({ authorId }).select("_id");
    const bookIds = books.map((b) => b._id);
    // Find all orders for these books
    const orders = await Order.find({ book: { $in: bookIds } })
      .populate("user")
      .populate("book")
      .sort({ createdAt: -1 });
    res.status(200).json({ data: orders });
  } catch (err) {
    console.error("Error getting author orders:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
