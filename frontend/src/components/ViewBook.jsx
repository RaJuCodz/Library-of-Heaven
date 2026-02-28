import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaStar,
  FaTruck,
  FaShare,
  FaBookmark,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewBook = () => {
  const { book_id } = useParams();
  const [book, setBook] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [moreBooks, setMoreBooks] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/add_book_to_fav/${book_id}`,
          {}
        );
        setBook(response.data.data);
        fetchMoreBooks();

        // Check if user has purchased this book
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");
        if (token && id) {
          const userRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/user_profile`,
            { headers: { Authorization: `Bearer ${token}`, id } }
          );
          setHasPurchased(userRes.data.data.purchasedBooks?.includes(book_id));
        }
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
        `${import.meta.env.VITE_API_URL}/get_recent_books`
      );
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

  const handlePurchase = async () => {
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/purchase_book`,
        { book_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-User-Id": id,
          },
        }
      );
      toast.success("Book purchased and unlocked for download!");
      setHasPurchased(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to purchase book. Try again."
      );
    }
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center pt-24 transition-colors duration-300">
        <div className="w-16 h-16 border-4 border-red-600 dark:border-red-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 transition-colors duration-300">
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
          className="inline-flex items-center mb-8 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 hover:translate-x-[-4px]"
        >
          <FaArrowLeft className="mr-2" /> Back to Books
        </Link>

        {/* Book Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/50 overflow-hidden transform hover:shadow-2xl dark:hover:shadow-red-900/20 transition-all duration-500 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Image Section */}
            <div className="relative group">
              <div className="aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={book.cover_image}
                  alt={book.title}
                  className={`w-full h-full object-cover transform transition-all duration-700 ${isImageLoaded ? "scale-100" : "scale-110 blur-sm"
                    } group-hover:scale-105`}
                  onLoad={() => setIsImageLoaded(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-3 bg-white/90 dark:bg-gray-900/90 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110">
                  <FaShare className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Details Section */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-medium">
                  New Release
                </span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm font-medium flex items-center gap-1">
                  <FaTruck className="w-3 h-3" /> Free Shipping
                </span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">by {book.author}</p>

              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-5 h-5 text-red-500 dark:text-red-400" />
                  ))}
                </div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">5.0 (120 reviews)</span>
              </div>

              <div className="mb-8">
                <p className="text-4xl font-bold text-red-600 dark:text-red-500 mb-2">
                  ${book.price}
                </p>
                <p className="text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
                  <FaTruck className="w-4 h-4" /> Free Shipping
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <FaBookmark className="w-5 h-5 text-red-600 dark:text-red-400" />
                  Description
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {book.description}
                </p>
              </div>

              {/* Purchase/Download Button */}
              {book.pdf_url &&
                (hasPurchased ? (
                  <a
                    href={`https://library-of-heaven.onrender.com/api/v1/download_pdf/${book._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md text-center"
                    download
                  >
                    Download PDF
                  </a>
                ) : (
                  <button
                    onClick={handlePurchase}
                    className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md text-center"
                  >
                    Purchase to Unlock
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* More Books Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
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
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 overflow-hidden transform hover:shadow-xl dark:hover:shadow-red-900/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={book.cover_image}
                      alt={book.title}
                      className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      by {book.author}
                    </p>
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">
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
