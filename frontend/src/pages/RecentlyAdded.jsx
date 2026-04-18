import { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";
import { toast } from "react-toastify";
import { FaBook, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const RecentlyAdded = () => {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/get_recent_novels`)
      .then((res) => { setData(res.data.data); setLoading(false); })
      .catch(() => {
        setError("Failed to fetch recently added novels.");
        setLoading(false);
        toast.error("Failed to fetch recently added novels");
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-gilt-500 border-t-transparent animate-spin" />
        <p className="font-sans text-sm text-toffee-600 dark:text-toffee-400">Loading novels…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="font-sans text-sm text-wine-600 dark:text-wine-400">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <FaBook className="w-10 h-10 text-parchment-400 dark:text-navy-500" />
        <p className="font-sans text-sm text-toffee-500">No recently added novels found.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Section header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
        <div>
          <p className="section-subheading mb-3">Fresh Arrivals</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-parchment-900 dark:text-parchment-100 leading-tight">
            Recently Added
          </h2>
          <div className="flex items-center gap-3 mt-4">
            <div className="h-px w-14 bg-gilt-500/50" />
            <div className="w-2 h-2 rounded-full bg-gilt-500 animate-gilt-pulse" />
            <div className="h-px w-14 bg-gilt-500/50" />
          </div>
        </div>

        <Link to="/books"
          className="inline-flex items-center gap-2 font-sans text-sm font-semibold
            text-gilt-600 dark:text-gilt-400 hover:text-gilt-500 dark:hover:text-gilt-300
            transition-colors duration-200 group shrink-0"
        >
          View All
          <FaArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default RecentlyAdded;
