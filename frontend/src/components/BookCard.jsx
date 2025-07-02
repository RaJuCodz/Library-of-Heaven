import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";
import Button from "./ui/Button";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import axios from "axios";

const BookCard = ({ book, onFavoriteClick, small }) => {
  const [isHovered, setIsHovered] = useState(false);
  const rating = (4 + Math.random()).toFixed(1);

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      await axios.post(
        "https://library-of-heaven.onrender.com/api/v1/place_order",
        { order: [{ book_id: book._id }] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            id,
          },
        }
      );
      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    }
  };

  return (
    <div
      className={`book-card bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 transform group relative border-2 border-red-500/20 hover:border-red-500 hover:shadow-2xl hover:-translate-y-2 ${
        small ? "p-2" : ""
      }`}
      style={small ? { maxWidth: 180 } : {}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Favorite Button */}
      {onFavoriteClick && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFavoriteClick(book._id);
          }}
          className="absolute top-3 right-3 z-10 p-2 bg-white/80 hover:bg-red-100 rounded-full text-gray-500 hover:text-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <FaHeart className="w-5 h-5" />
        </button>
      )}

      <Link to={`/view_detail/${book._id}`} className="block">
        {/* Book cover image container */}
        <div
          className={`relative w-full ${
            small ? "h-36" : "h-80"
          } overflow-hidden`}
        >
          <img
            src={book.cover_image}
            alt={book.title}
            className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-red-900/30 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-all duration-300"></div>

          {/* Quick Actions Overlay */}
          {!small && (
            <div
              className={`absolute inset-0 bg-black/50 flex items-center justify-center gap-4 transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <button className="p-3 bg-white rounded-full text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-110">
                <FaShoppingCart className="w-6 h-6" />
              </button>
              <button className="p-3 bg-white rounded-full text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:scale-110">
                <FaEye className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {/* Book details */}
        <div className={small ? "p-2" : "p-6"}>
          {/* Rating */}
          <div className={`flex items-center ${small ? "mb-1" : "mb-3"}`}>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`transition-all duration-300 ${
                    small ? "w-3 h-3" : "w-4 h-4"
                  } ${
                    i < Math.floor(rating)
                      ? "text-red-500 transform hover:scale-125"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span
              className={`ml-2 text-gray-500 font-medium ${
                small ? "text-xs" : ""
              }`}
            >
              {rating}
            </span>
          </div>

          <h3
            className={`font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-red-600 transition-colors duration-300 ${
              small ? "text-base" : "text-xl"
            }`}
          >
            {book.title}
          </h3>
          <p
            className={`text-gray-600 mb-2 font-medium ${
              small ? "text-xs" : "text-sm"
            }`}
          >
            by {book.author}
          </p>

          {/* Price */}
          <div
            className={`flex items-center justify-between ${
              small ? "mb-2" : "mb-4"
            }`}
          >
            <p
              className={`font-bold text-red-600 ${
                small ? "text-base" : "text-2xl"
              }`}
            >
              ${book.price}
            </p>
            {!small && (
              <span className="text-sm text-gray-500">Free Shipping</span>
            )}
          </div>

          {/* Description */}
          <p
            className={`text-gray-600 ${
              small ? "text-xs mb-2 line-clamp-1" : "text-sm mb-6 line-clamp-2"
            }`}
          >
            {book.description}
          </p>

          {/* Action Buttons */}
          {!small && (
            <div className="flex gap-3">
              <Button
                variant="secondary"
                fullWidth
                className="bg-red-600 hover:bg-red-700 text-white transform hover:scale-105 transition-all duration-300"
              >
                Add to Cart
              </Button>
              <Button
                variant="outline"
                fullWidth
                className="border-red-600 text-red-600 hover:bg-red-50 transform hover:scale-105 transition-all duration-300"
              >
                Quick View
              </Button>
              {localStorage.getItem("role") !== "admin" && (
                <Button
                  variant="primary"
                  fullWidth
                  className="bg-green-600 hover:bg-green-700 text-white transform hover:scale-105 transition-all duration-300 opacity-50 cursor-not-allowed"
                  onClick={handleBuyNow}
                  disabled
                  title="This feature is temporarily disabled"
                >
                  Buy Now
                </Button>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

BookCard.propTypes = {
  book: PropTypes.object.isRequired,
  onFavoriteClick: PropTypes.func,
  small: PropTypes.bool,
};

export default BookCard;
