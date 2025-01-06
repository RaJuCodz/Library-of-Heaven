import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
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
      const response = await axios.get(
        "http://localhost:4000/api/v1/get_fav_books",
        { headers }
      );
      setFavouriteBooks(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching favourite books:", error);
      toast.error("Failed to fetch favourite books");
      setLoading(false);
    }
  };

  // Remove a book from favourites
  const removeFromFavourites = async (bookId) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/remove_favourite",
        {},
        { headers: { ...headers, book_id: bookId } }
      );
      toast.success(response.data.message);
      fetchFavouriteBooks(); // Refresh the list after removal
    } catch (error) {
      console.error("Error removing book from favourites:", error);
      toast.error("Failed to remove book from favourites");
    }
  };

  useEffect(() => {
    fetchFavouriteBooks();
    console.log("its loaded");
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400">Loading favourite books...</p>
      </div>
    );
  }

  if (favouriteBooks.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">You have no favourite books yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400">
        Favourite Books
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favouriteBooks.map((book) => (
          <div
            key={book._id}
            className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-bold mb-2">{book.title}</h3>
            <p className="text-sm text-gray-400 mb-2">by {book.author}</p>
            <p className="text-lg font-semibold text-yellow-400 mb-4">
              ${book.price}
            </p>
            <button
              onClick={() => removeFromFavourites(book._id)}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
            >
              Remove from Favourites
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favourites;
