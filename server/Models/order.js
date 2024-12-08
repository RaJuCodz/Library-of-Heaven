const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Book",
    },
    status: {
      type: String,
      default: "Order Placed",
      enum: [
        "Order Placed",
        "Order Shipped",
        "Order Delivered",
        "Order Cancelled",
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
