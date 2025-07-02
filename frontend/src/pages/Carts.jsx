import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { FaTrash, FaShoppingCart, FaArrowRight, FaTruck } from "react-icons/fa";
import Button from "../components/ui/Button";
import { apiUrl } from "../api";

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
      const response = await axios.get(apiUrl("/show_cart"), { headers });
      setCartItems(response.data.data || []);

      // Calculate total price with proper type checking
      const total = (response.data.data || []).reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        return sum + price;
      }, 0);

      setTotalPrice(total);
      setTotalItems((response.data.data || []).length);
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
      const response = await axios.delete(apiUrl("/remove_from_cart"), {
        headers: { ...headers, book_id: bookId },
      });
      toast.success(response.data.message);
      fetchCartItems(); // Refresh the cart after removal
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      await axios.post(apiUrl("/place_order"), {}, { headers });
      toast.success("Order placed for all cart items!");
      // Optionally clear cart or redirect
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Checkout failed. Please try again."
      );
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Format price with proper type checking
  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
            <FaShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any books to your cart yet.
            </p>
            <Link
              to="/books"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
            >
              Browse Books
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Shopping Cart ({totalItems} items)
            </h2>
            <div className="space-y-4">
              {cartItems.map((book) => (
                <div
                  key={book._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Book Image */}
                    <div className="md:w-1/4 relative">
                      <img
                        src={book.cover_image}
                        alt={book.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>

                    {/* Book Details */}
                    <div className="p-6 md:w-3/4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {book.title}
                          </h3>
                          <p className="text-gray-600 mb-2">by {book.author}</p>
                          <p className="text-lg font-semibold text-red-600">
                            ${formatPrice(book.price)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(book._id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-300"
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="mt-4">
                        <Link
                          to={`/view_detail/${book._id}`}
                          className="text-red-600 hover:text-red-700 font-medium inline-flex items-center"
                        >
                          View Details
                          <FaArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 flex items-center">
                    <FaTruck className="mr-1" /> Free
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>${formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              {cartItems.length > 0 &&
                localStorage.getItem("role") !== "admin" && (
                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={handleCheckout}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold opacity-50 cursor-not-allowed"
                      disabled
                      title="This feature is temporarily disabled"
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                )}

              {/* Ichigo Image */}
              <div className="mt-8">
                <img
                  src="/images/ichigo.png"
                  alt="Ichigo"
                  className="w-full h-auto transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carts;
