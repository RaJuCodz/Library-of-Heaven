import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaEye, FaBookOpen } from "react-icons/fa";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";

const BookCard = ({ book, onFavoriteClick, small }) => {
  const [isHovered, setIsHovered] = useState(false);
  const rating = parseFloat((4 + Math.random()).toFixed(1));
  const navigate = useNavigate();

  /* ── Small variant ─────────────────────────────────── */
  if (small) {
    return (
      <div
        className="book-card bg-parchment-50 dark:bg-navy-700 rounded-xl overflow-hidden
          shadow-card dark:shadow-card-dark border border-parchment-300 dark:border-navy-500
          hover:shadow-card-hover hover:border-gilt-500/40 dark:hover:border-gilt-500/40
          transition-all duration-300 hover:-translate-y-1 group"
        style={{ maxWidth: 180 }}
      >
        <Link to={`/view_detail/${book._id}`} className="block">
          <div className="relative h-36 overflow-hidden">
            <img src={book.cover_image} alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Gilt spine accent */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5"
              style={{ background: 'linear-gradient(to bottom, #F0DE9A, #C9A84C, #9A7A1F)' }}
            />
          </div>
          <div className="p-2.5">
            <h3 className="font-serif font-bold text-sm text-parchment-900 dark:text-parchment-100 line-clamp-1">
              {book.title}
            </h3>
            <p className="font-sans text-xs text-toffee-600 dark:text-toffee-300 mt-0.5">by {book.author}</p>
            <p className="font-serif font-bold text-sm text-gilt-600 dark:text-gilt-400 mt-1">
              {book.totalChapters || 0} Chs
            </p>
          </div>
        </Link>
      </div>
    );
  }

  /* ── Full card ─────────────────────────────────────── */
  return (
    <div
      className="book-card group relative rounded-2xl overflow-hidden
        bg-parchment-50 dark:bg-navy-700
        border border-parchment-300 dark:border-navy-500
        shadow-card dark:shadow-card-dark
        hover:shadow-card-hover hover:border-gilt-500/50 dark:hover:border-gilt-500/40
        transition-all duration-350"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gilt left spine accent */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] z-10"
        style={{ background: 'linear-gradient(to bottom, #F0DE9A, #C9A84C, #9A7A1F)', opacity: isHovered ? 1 : 0.45, transition: 'opacity 0.3s' }}
      />

      {/* Favourite button */}
      {onFavoriteClick && (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFavoriteClick(book._id); }}
          className="absolute top-3 right-3 z-20 p-2 rounded-full
            bg-parchment-50/90 dark:bg-navy-800/90 backdrop-blur-sm
            text-parchment-400 dark:text-parchment-500
            hover:text-wine-600 dark:hover:text-wine-400
            hover:bg-wine-50 dark:hover:bg-wine-900/30
            shadow-sm transition-all duration-250"
          aria-label="Add to favourites"
        >
          <FaHeart className="w-3.5 h-3.5" />
        </button>
      )}

      <Link to={`/view_detail/${book._id}`} className="block">
        {/* Cover image */}
        <div className="relative h-72 overflow-hidden bg-parchment-300 dark:bg-navy-600">
          <img
            src={book.cover_image}
            alt={book.title}
            className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700"
            style={{ transform: isHovered ? 'scale(1.06)' : 'scale(1)' }}
          />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-navy-950/70 to-transparent" />

          {/* Rating badge */}
          <div className="absolute top-3 left-4 flex items-center gap-1 px-2 py-1 rounded-full
            bg-navy-950/65 backdrop-blur-sm"
          >
            <FaStar className="w-2.5 h-2.5 text-gilt-400" />
            <span className="font-sans text-xs text-parchment-100 font-medium">{rating}</span>
          </div>

          {/* Status badge */}
          <div className="absolute bottom-3 left-4 flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${book.status === 'Completed' ? 'bg-green-400' : 'bg-amber-400'}`} />
            <span className="font-sans text-xs text-parchment-200 font-medium tracking-wide">
              {book.status || 'Ongoing'}
            </span>
          </div>

          {/* Hover overlay */}
          <div className={`absolute inset-0 flex items-center justify-center
            transition-all duration-300
            ${isHovered ? 'opacity-100 bg-navy-950/50 backdrop-blur-[2px]' : 'opacity-0'}`}
          >
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/view_detail/${book._id}`); }}
              className="p-3.5 bg-gilt-500 rounded-full text-navy-950 shadow-lg shadow-gilt-500/30
                hover:bg-gilt-400 transition-all duration-250 hover:scale-110"
              aria-label="View book"
            >
              <FaEye className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="p-5 pl-6">
          {/* Stars */}
          <div className="flex items-center gap-1.5 mb-3">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-gilt-500' : 'text-parchment-400 dark:text-navy-500'}`} />
            ))}
            <span className="font-sans text-xs text-toffee-600 dark:text-toffee-400 ml-1">{rating}</span>
          </div>

          <h3 className="font-serif font-bold text-lg text-parchment-900 dark:text-parchment-100 mb-1 line-clamp-1
            group-hover:text-gilt-600 dark:group-hover:text-gilt-400 transition-colors duration-250"
          >
            {book.title}
          </h3>
          <p className="font-sans text-xs text-toffee-600 dark:text-toffee-300 mb-3 font-medium">
            by {book.author}
          </p>

          <p className="font-sans text-xs text-toffee-700 dark:text-parchment-400 line-clamp-2 leading-relaxed mb-5">
            {book.synopsis || book.description}
          </p>

          {/* Footer row */}
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-xl text-gilt-600 dark:text-gilt-400">
              {book.totalChapters || 0} Ch
            </span>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/view_detail/${book._id}`); }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg
                bg-gilt-500 hover:bg-gilt-400 text-navy-950
                font-sans font-semibold text-xs
                shadow-sm hover:shadow-glow-gilt transition-all duration-250"
            >
              <FaBookOpen className="w-3 h-3" />
              Read Now
            </button>
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
