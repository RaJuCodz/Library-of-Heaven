import React, { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";
import { toast } from "react-toastify";
import { FaBook } from "react-icons/fa";

const RecentlyAdded = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/get_recent_novels`)
      .then((res) => { setData(res.data.data); setLoading(false); })
      .catch(() => {
        setError("Failed to fetch recently added novels. Please try again later.");
        setLoading(false);
        toast.error("Failed to fetch recently added novels");
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-wine-600 border-t-transparent animate-spin" />
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
        <p className="font-sans text-sm text-toffee-500 dark:text-parchment-500">No recently added novels found.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Section header */}
      <div className="flex flex-col items-center text-center mb-12">
        <p className="section-subheading mb-3">Fresh Arrivals</p>
        <h2 className="section-heading mb-4">Recently Added Novels</h2>
        <div className="flex items-center gap-3">
          <div className="h-px w-16 bg-wine-600/30 dark:bg-wine-500/30" />
          <div className="w-2 h-2 rounded-full bg-wine-600 dark:bg-wine-500" />
          <div className="h-px w-16 bg-wine-600/30 dark:bg-wine-500/30" />
        </div>
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
