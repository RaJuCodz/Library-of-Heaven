import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaHeart,
  FaCartPlus,
  FaArrowLeft,
  FaStar,
  FaTruck,
  FaShare,
  FaBookmark,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const ViewBook = () => {
  const { book_id } = useParams();
  const [book, setBook] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [moreBooks, setMoreBooks] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = localStorage.getItem("role");

  useEffect(() => {
    console.log("[ViewBook] book_id:", book_id); // Debug log for book_id
    const fetchBook = async () => {
      try {
        const response = await axios.get(
          `https://library-of-heaven.onrender.com/api/v1/get_book_by_id/${book_id}`
        );
        setBook(response.data.data);
        // Fetch more books after getting the current book
        fetchMoreBooks();
      } catch (error) {
        console.error("Error fetching book details:", error);
        toast.error("Failed to fetch book details");
      }
    };

    if (book_id) {
      fetchBook();
    }
  }, [book_id]);

  const fetchMoreBooks = async () => {
    setIsLoadingMore(true);
    try {
      const response = await axios.get(
        "https://library-of-heaven.onrender.com/api/v1/get_recent_books"
      );
      // Filter out the current book and get 10 random books
      const filteredBooks = response.data.data
        .filter((b) => b._id !== book_id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);
      setMoreBooks(filteredBooks);
    } catch (error) {
      console.error("Error fetching more books:", error);
      toast.error("Failed to load more books");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const headers = {
    id: localStorage.getItem("id"),
    book_id: book_id,
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const handleAddToFavourites = async () => {
    if (!localStorage.getItem("token")) {
      toast.info("Please login to add favorites");
      return;
    }

    try {
      const response = await axios.post(
        "https://library-of-heaven.onrender.com/api/v1/add_to_fav",
        { book_id: book_id },
        { headers }
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast.error(
        error.response?.data?.message || "Failed to add to favorites"
      );
    }
  };

  const handleAddToCart = async () => {
    try {
      const response = await axios.put(
        "https://library-of-heaven.onrender.com/api/v1/add_to_cart",
        { book_id: book_id },
        { headers }
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          to="/books"
          className="inline-flex items-center mb-8 text-gray-600 hover:text-red-600 transition-all duration-300 hover:translate-x-[-4px]"
        >
          <FaArrowLeft className="mr-2" /> Back to Books
        </Link>

        {/* Book Details Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:shadow-2xl transition-all duration-500 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Image Section */}
            <div className="relative group">
              <div className="aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={book.cover_image}
                  alt={book.title}
                  className={`w-full h-full object-cover transform transition-all duration-700 ${
                    isImageLoaded ? "scale-100" : "scale-110 blur-sm"
                  } group-hover:scale-105`}
                  onLoad={() => setIsImageLoaded(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={handleAddToFavourites}
                  className="p-3 bg-white/90 hover:bg-red-100 rounded-full text-gray-500 hover:text-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                >
                  <FaHeart className="w-5 h-5" />
                </button>
                <button className="p-3 bg-white/90 hover:bg-red-100 rounded-full text-gray-500 hover:text-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110">
                  <FaShare className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Details Section */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                  New Release
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium flex items-center gap-1">
                  <FaTruck className="w-3 h-3" /> Free Shipping
                </span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600 mb-6">by {book.author}</p>

              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-5 h-5 text-red-500" />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">5.0 (120 reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-8">
                <p className="text-4xl font-bold text-red-600 mb-2">
                  ${book.price}
                </p>
                <p className="text-green-600 font-medium flex items-center gap-2">
                  <FaTruck className="w-4 h-4" /> Free Shipping
                </p>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaBookmark className="w-5 h-5 text-red-600" />
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {book.description}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-gray-700 font-medium mb-2">
                  Quantity
                </label>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 border border-gray-300 rounded-l-lg hover:bg-gray-100 transition-all duration-300 hover:border-red-500 hover:text-red-600"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 text-center border-t border-b border-gray-300 py-2 focus:outline-none focus:border-red-500"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 border border-gray-300 rounded-r-lg hover:bg-gray-100 transition-all duration-300 hover:border-red-500 hover:text-red-600"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              {role !== "admin" && (
                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <FaCartPlus className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <button className="flex-1 border-2 border-red-600 text-red-600 hover:bg-red-50 py-4 px-6 rounded-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                    Buy Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* More Books Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            More Books You Might Like
          </h2>
          {isLoadingMore ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {moreBooks.map((book) => (
                <Link
                  key={book._id}
                  to={`/view_detail/${book._id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden transform hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={book.cover_image}
                      alt={book.title}
                      className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      by {book.author}
                    </p>
                    <p className="text-lg font-bold text-red-600">
                      ${book.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewBook;
