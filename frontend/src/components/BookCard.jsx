import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";
import Button from "./ui/Button";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import axios from "axios";

const BookCard = ({ book, onFavoriteClick, small }) => {
  const [isHovered, setIsHovered] = useState(false);
  const rating = parseFloat((4 + Math.random()).toFixed(1));
  const navigate = useNavigate();

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      const id    = localStorage.getItem("id");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/place_order`,
        { order: [{ book_id: book._id }] },
        { headers: { Authorization: `Bearer ${token}`, id } }
      );
      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order.");
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      const id    = localStorage.getItem("id");
      if (!token || !id) { toast.error("Please login to add to cart"); return; }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/add_to_cart`,
        {},
        { headers: { Authorization: `Bearer ${token}`, id, book_id: book._id } }
      );
      if (response.data.message === "Book already added to cart") {
        toast.error("Book is already in cart");
      } else {
        toast.success("Added to cart!");
      }
      setTimeout(() => navigate("/cart"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart.");
    }
  };

  if (small) {
    return (
      <div
        className="book-card bg-parchment-50 dark:bg-navy-700 rounded-xl overflow-hidden shadow-card dark:shadow-card-dark border border-parchment-300 dark:border-navy-500 hover:shadow-card-hover hover:border-wine-400 dark:hover:border-wine-600 transition-all duration-300 hover:-translate-y-1"
        style={{ maxWidth: 180 }}
      >
        <Link to={`/view_detail/${book._id}`} className="block">
          <div className="relative h-36 overflow-hidden">
            <img
              src={book.cover_image}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-2.5">
            <h3 className="font-serif font-bold text-sm text-parchment-900 dark:text-parchment-100 line-clamp-1">
              {book.title}
            </h3>
            <p className="font-sans text-xs text-toffee-600 dark:text-toffee-300 mt-0.5">by {book.author}</p>
            <p className="font-sans font-bold text-sm text-wine-600 dark:text-wine-400 mt-1">${book.price}</p>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div
      className="book-card group bg-parchment-50 dark:bg-navy-700 rounded-2xl overflow-hidden shadow-card dark:shadow-card-dark border border-parchment-300 dark:border-navy-500 hover:shadow-card-hover hover:border-wine-400 dark:hover:border-wine-600 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Favourite button */}
      {onFavoriteClick && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFavoriteClick(book._id);
          }}
          className="absolute top-3 right-3 z-10 p-2 bg-parchment-50/90 dark:bg-navy-800/90 backdrop-blur-sm rounded-full text-parchment-400 dark:text-parchment-500 hover:text-wine-600 dark:hover:text-wine-400 hover:bg-wine-50 dark:hover:bg-wine-900/30 shadow-sm transition-all duration-250"
          aria-label="Add to favourites"
        >
          <FaHeart className="w-4 h-4" />
        </button>
      )}

      <Link to={`/view_detail/${book._id}`} className="block">
        {/* Cover image */}
        <div className="relative h-72 overflow-hidden bg-parchment-300 dark:bg-navy-600">
          <img
            src={book.cover_image}
            alt={book.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          {/* Subtle bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-parchment-900/50 to-transparent" />

          {/* Quick-action overlay */}
          <div
            className={[
              "absolute inset-0 flex items-center justify-center gap-4 transition-all duration-300",
              isHovered
                ? "opacity-100 bg-navy-900/55 backdrop-blur-[2px]"
                : "opacity-0 bg-transparent",
            ].join(" ")}
          >
            <button
              onClick={handleAddToCart}
              className="p-3 bg-parchment-50 rounded-full text-wine-600 hover:bg-wine-600 hover:text-white shadow-lg transition-all duration-250 hover:scale-110"
              aria-label="Add to cart"
            >
              <FaShoppingCart className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/view_detail/${book._id}`);
              }}
              className="p-3 bg-parchment-50 rounded-full text-toffee-600 hover:bg-toffee-500 hover:text-white shadow-lg transition-all duration-250 hover:scale-110"
              aria-label="Quick view"
            >
              <FaEye className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="p-5">
          {/* Stars */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={[
                    "w-3.5 h-3.5 transition-colors",
                    i < Math.floor(rating)
                      ? "text-toffee-500"
                      : "text-parchment-400 dark:text-navy-500",
                  ].join(" ")}
                />
              ))}
            </div>
            <span className="font-sans text-xs text-toffee-600 dark:text-toffee-400 font-medium">{rating}</span>
          </div>

          <h3 className="font-serif font-bold text-lg text-parchment-900 dark:text-parchment-100 mb-1 line-clamp-1 group-hover:text-wine-700 dark:group-hover:text-wine-400 transition-colors duration-250">
            {book.title}
          </h3>
          <p className="font-sans text-xs text-toffee-600 dark:text-toffee-300 mb-3 font-medium">
            by {book.author}
          </p>

          {/* Price row */}
          <div className="flex items-center justify-between mb-3">
            <p className="font-sans font-bold text-2xl text-wine-600 dark:text-wine-400">
              ${book.price}
            </p>
            <span className="text-xs text-toffee-500 dark:text-toffee-400 font-sans flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
              Free Shipping
            </span>
          </div>

          <p className="font-sans text-xs text-toffee-700 dark:text-parchment-400 line-clamp-2 leading-relaxed mb-5">
            {book.description}
          </p>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              variant="primary"
              fullWidth
              size="sm"
              onClick={handleAddToCart}
            >
              <FaShoppingCart className="w-3.5 h-3.5" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/view_detail/${book._id}`);
              }}
              className="shrink-0 !px-3"
              aria-label="Quick view"
            >
              <FaEye className="w-3.5 h-3.5" />
            </Button>
          </div>
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
