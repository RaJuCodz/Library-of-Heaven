import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FaBookmark, FaTrash, FaBook, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const Favourites = () => {
  const [books, setBooks]     = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = {
    id:            localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchFavourites = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/get_library`, { headers });
      setBooks(res.data?.data || res.data?.favorites || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch library books");
    } finally {
      setLoading(false);
    }
  };

  const removeFavourite = async (bookId) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/remove_from_library`, {
        headers: { ...headers, book_id: bookId },
      });
      toast.success(res.data.message || "Removed from library");
      setBooks((prev) => prev.filter((b) => b._id !== bookId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove from library");
    }
  };

  useEffect(() => { fetchFavourites(); }, []);

  /* ── Loading ──────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-56 gap-4">
        <div className="w-8 h-8 border-2 border-gilt-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-sans text-sm text-toffee-600 dark:text-toffee-400">Loading your library…</p>
      </div>
    );
  }

  /* ── Empty ────────────────────────────────────── */
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-5 text-center">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.04))' }}
        >
          <FaBookmark className="w-8 h-8 text-gilt-500 dark:text-gilt-400" />
        </div>
        <div>
          <p className="font-serif text-2xl font-bold text-parchment-800 dark:text-parchment-200 mb-1">
            Your library is empty
          </p>
          <p className="font-sans text-sm text-toffee-600 dark:text-toffee-400">
            Browse novels and add them to your collection.
          </p>
        </div>
        <Link to="/books"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
            font-sans text-sm font-semibold text-navy-950
            shadow-sm hover:shadow-glow-gilt transition-all duration-250"
          style={{ background: 'linear-gradient(135deg, #F0DE9A, #C9A84C, #B8922A)' }}
        >
          <FaBook className="w-3.5 h-3.5" /> Browse Books
        </Link>
      </div>
    );
  }

  /* ── List ─────────────────────────────────────── */
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h2 className="font-serif text-2xl font-bold text-parchment-900 dark:text-parchment-100">
            My Library
          </h2>
          <p className="font-sans text-xs text-toffee-600 dark:text-toffee-400 mt-0.5">
            {books.length} novel{books.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))' }}
        >
          <FaBookmark className="w-4 h-4 text-gilt-600 dark:text-gilt-400" />
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {books.map((book, i) => {
            const rating = (4 + Math.random()).toFixed(1);
            return (
              <motion.div
                key={book._id}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="group relative rounded-xl overflow-hidden
                  bg-parchment-100 dark:bg-navy-700
                  border border-parchment-300 dark:border-navy-500
                  hover:border-gilt-500/50 dark:hover:border-gilt-500/40
                  hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5"
              >
                {/* Gilt spine */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                  style={{ background: 'linear-gradient(to bottom, #F0DE9A, #C9A84C, #9A7A1F)', opacity: 0.5 }}
                />

                <Link to={`/view_detail/${book._id}`} className="block">
                  {/* Cover */}
                  <div className="relative h-44 overflow-hidden bg-parchment-300 dark:bg-navy-600">
                    <img
                      src={book.cover_image} alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-navy-950/65 to-transparent" />

                    {/* Rating */}
                    <div className="absolute top-2.5 left-3.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-navy-950/65 backdrop-blur-sm">
                      <FaStar className="w-2.5 h-2.5 text-gilt-400" />
                      <span className="font-sans text-xs text-parchment-100 font-medium">{rating}</span>
                    </div>
                  </div>
                </Link>

                {/* Details */}
                <div className="p-4 pl-5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <Link to={`/view_detail/${book._id}`} className="flex-1 min-w-0">
                      <h3 className="font-serif font-bold text-base text-parchment-900 dark:text-parchment-100 line-clamp-1
                        group-hover:text-gilt-600 dark:group-hover:text-gilt-400 transition-colors">
                        {book.title}
                      </h3>
                    </Link>
                    <button
                      onClick={() => removeFavourite(book._id)}
                      className="p-1.5 rounded-lg text-toffee-400 dark:text-toffee-600
                        hover:bg-wine-50 dark:hover:bg-wine-900/20
                        hover:text-wine-600 dark:hover:text-wine-400
                        transition-all duration-200 shrink-0"
                      aria-label="Remove from library"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="font-sans text-xs text-toffee-600 dark:text-toffee-400 mb-3">by {book.author}</p>

                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-lg text-gilt-600 dark:text-gilt-400">
                      {book.chapterPrice} Tok/Ch
                    </span>
                    <Link to={`/view_detail/${book._id}`}
                      className="font-sans text-xs font-semibold px-3 py-1.5 rounded-lg
                        text-navy-950 transition-all duration-200 hover:shadow-glow-gilt"
                      style={{ background: 'linear-gradient(135deg, #F0DE9A, #C9A84C)' }}
                    >
                      Read
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Favourites;
