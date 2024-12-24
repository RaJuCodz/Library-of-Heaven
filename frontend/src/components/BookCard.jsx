// BookCard.js
import React from "react";
import { Link } from "react-router-dom";
const BookCard = ({ book }) => {
  return (
    <Link to={`/view_detail/${book._id}`}>
      <div className="bg-[#1a1a1a] shadow-lg rounded-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 transform">
        {/* Book cover image container */}
        <div className="relative w-full h-72">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="p-4 relative z-10">
          <h3 className="text-lg font-bold text-white">{book.title}</h3>
          <p className="text-sm text-gray-400 mb-2">by {book.author}</p>
          {/* Moved the price above the description */}
          <p className="text-lg font-semibold text-[#ff7043] mt-4">
            ${book.price}
          </p>
          <p className="text-sm text-gray-300 mb-4 line-clamp-3">
            {book.description}
          </p>
          {/* View Details button with hover effect */}
          <a
            href={book.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-4 py-2 bg-[#ff7043] text-white text-sm font-semibold rounded hover:bg-[#ff5722] transition-all duration-300 transform hover:scale-105"
          >
            View Details
          </a>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
