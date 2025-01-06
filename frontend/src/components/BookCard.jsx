import React from "react";
import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  return (
    <Link to={`/view_detail/${book._id}`}>
      <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 transform group">
        {/* Book cover image container */}
        <div className="relative w-full h-72 overflow-hidden">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover object-top transform group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-10 transition-all duration-300"></div>
        </div>

        {/* Book details */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2">{book.title}</h3>
          <p className="text-sm text-gray-400 mb-4">by {book.author}</p>

          {/* Price */}
          <p className="text-lg font-semibold text-yellow-400 mb-4">
            ${book.price}
          </p>

          {/* Description */}
          <p className="text-sm text-gray-300 mb-6 line-clamp-3">
            {book.description}
          </p>

          {/* View Details button */}
          <a
            href={book.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full px-6 py-3 bg-yellow-500 text-white text-sm font-semibold rounded-lg hover:bg-yellow-600 hover:shadow-lg transition-all duration-300 text-center"
          >
            View Details
          </a>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
