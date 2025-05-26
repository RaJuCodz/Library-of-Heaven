import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";
import Button from "./ui/Button";

const BookCard = ({ book, onFavoriteClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const rating = (4 + Math.random()).toFixed(1);

  return (
    <div
      className="book-card bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 transform group relative border-2 border-red-500/20 hover:border-red-500 hover:shadow-2xl hover:-translate-y-2"
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
        <div className="relative w-full h-80 overflow-hidden">
          <img
            src={book.cover_image}
            alt={book.title}
            className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-red-900/30 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-all duration-300"></div>

          {/* Quick Actions Overlay */}
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
        </div>

        {/* Book details */}
        <div className="p-6">
          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`w-4 h-4 transition-all duration-300 ${
                    i < Math.floor(rating)
                      ? "text-red-500 transform hover:scale-125"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-500 font-medium">{rating}</span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-red-600 transition-colors duration-300">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 font-medium">
            by {book.author}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-2xl font-bold text-red-600">${book.price}</p>
            <span className="text-sm text-gray-500">Free Shipping</span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-6 line-clamp-2">
            {book.description}
          </p>

          {/* Action Buttons */}
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
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;
