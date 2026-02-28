import React, { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RecentlyAdded = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/get_recent_books`
        );
        setData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          "Failed to fetch recently added books. Please try again later."
        );
        setLoading(false);
        toast.error("Failed to fetch recently added books");
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 dark:border-primary-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 transition-colors duration-300">
        <p className="text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 transition-colors duration-300">
        <p className="text-gray-500 dark:text-gray-400">No recently added books found.</p>
      </div>
    );
  }

  return (
    <div className="py-12 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-primary-600 dark:text-primary-400">
          Recently Added Books
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((book) => (
            <div
              key={book._id}
              className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg dark:shadow-gray-900/50 hover:shadow-xl dark:hover:shadow-primary-900/20 transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyAdded;
