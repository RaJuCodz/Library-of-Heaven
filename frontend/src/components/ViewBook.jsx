import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaCartPlus, FaArrowLeft } from "react-icons/fa";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const ViewBook = () => {
  const { book_id } = useParams();
  const [book, setBook] = useState(null);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/get_book_by_id/${book_id}`
        );
        setBook(response.data.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
        toast.error("Failed to fetch book details");
      }
    };

    if (book_id) {
      fetchBook();
    }
  }, [book_id]);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
    book_id: book_id,
  };

  const handleAddToFavourites = async () => {
    try {
      const response = await axios.put(
        "http://localhost:4000/api/v1/add_favourite",
        {},
        { headers }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to add to favourites");
    }
  };

  const handleAddToCart = async () => {
    try {
      const response = await axios.put(
        "http://localhost:4000/api/v1/add_to_cart",
        {},
        { headers }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  if (!book) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-900 to-black text-white">
        <p>Loading book details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-black text-white py-8">
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
      <div className="container mx-auto px-6">
        {/* Back Button */}
        <Link
          to="/books"
          className="inline-flex items-center mb-6 text-gray-400 hover:text-white transition-colors duration-300"
        >
          <FaArrowLeft className="mr-2" /> Back to Books
        </Link>

        {/* Book Details Card */}
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="md:w-1/3 p-6">
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-auto rounded-lg transform hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Details Section */}
            <div className="md:w-2/3 p-8 flex flex-col justify-between">
              {/* Title */}
              <h1 className="text-4xl font-bold mb-4 text-white">
                {book.title}
              </h1>

              {/* Description */}
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                {book.description}
              </p>

              {/* Price and Buttons */}
              {role !== "admin" && (
                <div>
                  <p className="text-3xl font-bold text-yellow-400 mb-6">
                    Price: ${book.price}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Buy Now Button */}
                    <a
                      href={book.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-6 py-3 bg-yellow-500 text-white text-lg font-semibold rounded-lg hover:bg-yellow-600 hover:shadow-lg transition-all duration-300 text-center"
                    >
                      Buy Now
                    </a>

                    {isLoggedIn && (
                      <>
                        {/* Add to Favourites Button */}
                        <button
                          onClick={handleAddToFavourites}
                          className="flex-1 px-6 py-3 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-700 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <FaHeart /> Add to Favourites
                        </button>

                        {/* Add to Cart Button */}
                        <button
                          onClick={handleAddToCart}
                          className="flex-1 px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <FaCartPlus /> Add to Cart
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBook;
