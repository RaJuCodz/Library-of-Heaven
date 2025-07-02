import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaStar,
  FaHeart,
  FaShoppingCart,
  FaArrowLeft,
  FaShare,
  FaTruck,
  FaBookmark,
} from "react-icons/fa";
import Button from "../components/ui/Button";
import axios from "axios";

const ViewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      console.log("Book ID param:", id);
      const fullUrl = `https://library-of-heaven.onrender.com/api/v1/get_book_by_id/${id}`;
      console.log("Fetching book from:", fullUrl);
      try {
        const response = await axios.get(fullUrl);
        console.log("Book data:", response.data); // Debug log
        setBook(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching book:", error); // Debug log
        setError("Failed to fetch book details");
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {error || "Book not found"}
          </h2>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-red-600 mb-8 transition-all duration-300 hover:translate-x-[-4px]"
        >
          <FaArrowLeft className="mr-2" /> Back to Books
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:shadow-2xl transition-all duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Book Image Section */}
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
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-3 bg-white/90 hover:bg-red-100 rounded-full text-gray-500 hover:text-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                >
                  <FaHeart
                    className={`w-5 h-5 ${isFavorite ? "text-red-600" : ""}`}
                  />
                </button>
                <button className="p-3 bg-white/90 hover:bg-red-100 rounded-full text-gray-500 hover:text-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110">
                  <FaShare className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Book Details Section */}
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
              <div className="flex gap-4">
                <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <FaShoppingCart className="inline-block mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-2 border-red-600 text-red-600 hover:bg-red-50 py-4 transform hover:scale-105 transition-all duration-300"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetail;
