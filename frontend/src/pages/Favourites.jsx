import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaHeart, FaTrash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const Favourites = () => {
  const [favouriteBooks, setFavouriteBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Fetch favourite books
  const fetchFavouriteBooks = async () => {
    try {
      console.log("Fetching favorites with headers:", headers);
      const response = await axios.get(
        "https://library-of-heaven.onrender.com/api/v1/get_favorites",
        { headers }
      );
      console.log("Favorites response:", response.data);

      if (response.data && response.data.favorites) {
        console.log("Found favorites:", response.data.favorites);
        setFavouriteBooks(response.data.favorites);
      } else {
        console.log("No favorites found in response");
        setFavouriteBooks([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching favourite books:", error.response || error);
      toast.error(
        error.response?.data?.message || "Failed to fetch favourite books"
      );
      setLoading(false);
    }
  };

  // Remove a book from favourites
  const removeFromFavourites = async (bookId) => {
    try {
      console.log("Removing book from favorites:", bookId);
      // Debug log for remove_from_fav
      console.log(
        "Removing from fav:",
        "https://library-of-heaven.onrender.com/api/v1/remove_from_fav",
        "with id:",
        bookId
      );
      const response = await axios.delete(
        "https://library-of-heaven.onrender.com/api/v1/remove_from_fav",
        {
          headers: { ...headers, book_id: bookId },
        }
      );
      console.log("Remove from favorites response:", response.data);
      toast.success(response.data.message);
      fetchFavouriteBooks(); // Refresh the list after removal
    } catch (error) {
      console.error(
        "Error removing book from favourites:",
        error.response || error
      );
      toast.error(
        error.response?.data?.message || "Failed to remove book from favourites"
      );
    }
  };

  useEffect(() => {
    fetchFavouriteBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading your favorite books...</p>
        </div>
      </div>
    );
  }

  if (favouriteBooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <FaHeart className="w-16 h-16 text-red-200 mb-4" />
        <p className="text-xl text-gray-600 mb-2">No favorite books yet</p>
        <p className="text-gray-500">Start adding books to your favorites!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Your Favorite Books
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favouriteBooks.map((book) => (
          <div
            key={book._id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
          >
            <div className="relative">
              <img
                src={book.cover_image}
                alt={book.title}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => removeFromFavourites(book._id)}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors duration-300"
              >
                <FaTrash className="w-5 h-5 text-red-500" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {book.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-red-600">
                  ${book.price}
                </p>
                <span className="text-sm text-gray-500">
                  {book.description?.slice(0, 50)}...
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favourites;
