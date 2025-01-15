import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const Carts = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Fetch cart items
  const fetchCartItems = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/show_cart",
        { headers }
      );
      setCartItems(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast.error("Failed to fetch cart items");
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (bookId) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/remove_from_cart",
        {},
        { headers: { ...headers, book_id: bookId } }
      );
      toast.success(response.data.message);
      fetchCartItems(); // Refresh the cart after removal
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff7043]"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-black text-white">
        <p className="text-gray-500">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-[#ff7043]">
          Your Cart
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cartItems.map((book) => (
            <div
              key={book._id}
              className="bg-gray-900 shadow-lg rounded-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 transform group"
            >
              {/* Book cover image container */}
              <div className="relative w-full h-72 overflow-hidden">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover object-top transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-10 transition-all duration-300"></div>
              </div>

              {/* Book details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4">by {book.author}</p>

                {/* Price */}
                <p className="text-lg font-semibold text-yellow-400 mb-4">
                  ${book.price}
                </p>

                {/* Description */}
                <p className="text-sm text-gray-300 mb-6 line-clamp-3">
                  {book.description}
                </p>

                {/* Buttons */}
                <div className="flex flex-col space-y-4">
                  <Link
                    to={`/view_detail/${book._id}`}
                    className="inline-block w-full px-6 py-3 bg-yellow-500 text-white text-sm font-semibold rounded-lg hover:bg-yellow-600 hover:shadow-lg transition-all duration-300 text-center"
                  >
                    View Details
                  </Link>

                  {/* Remove from Cart button */}
                  <button
                    onClick={() => removeFromCart(book._id)}
                    className="w-full px-6 py-3 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 hover:shadow-lg transition-all duration-300"
                  >
                    Remove from Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carts;
