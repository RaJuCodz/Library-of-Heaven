import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaTrash, FaShoppingCart, FaArrowRight, FaTruck, FaBook } from "react-icons/fa";
import Button from "../components/ui/Button";

const Carts = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const headers = {
    id:            localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchCartItems = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/show_cart`, { headers });
      const items = res.data.data || [];
      setCartItems(items);
      setTotalPrice(items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0));
      setTotalItems(items.length);
    } catch {
      toast.error("Failed to fetch cart items");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (bookId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/remove_from_cart`,
        {},
        { headers: { ...headers, book_id: bookId } }
      );
      toast.success(res.data?.message || "Book removed from cart");
      fetchCartItems();
    } catch {
      toast.error("Failed to remove item from cart");
    }
  };

  const handleCheckout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/place_order`, {}, { headers });
      toast.success("Order placed for all cart items!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Checkout failed. Please try again.");
    }
  };

  useEffect(() => { fetchCartItems(); }, []);

  const fmt = (price) => {
    const n = parseFloat(price);
    return isNaN(n) ? "0.00" : n.toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment-200 dark:bg-navy-900 pt-24 flex justify-center items-center transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-wine-600 border-t-transparent rounded-full animate-spin" />
          <p className="font-sans text-sm text-toffee-600 dark:text-toffee-400">Loading your cart…</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-parchment-200 dark:bg-navy-900 pt-24 pb-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-sm mx-auto bg-parchment-50 dark:bg-navy-800 rounded-2xl border border-parchment-300 dark:border-navy-600 shadow-card p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-parchment-200 dark:bg-navy-700 flex items-center justify-center mx-auto mb-6">
              <FaShoppingCart className="w-7 h-7 text-toffee-500 dark:text-toffee-400" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-parchment-900 dark:text-parchment-100 mb-2">
              Your Cart is Empty
            </h2>
            <p className="font-sans text-sm text-toffee-600 dark:text-toffee-400 mb-8 leading-relaxed">
              Looks like you haven't added any books yet. Start exploring our collection!
            </p>
            <Button to="/books" variant="primary" fullWidth>
              Browse Books
              <FaArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment-200 dark:bg-navy-900 pt-24 pb-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-10">
          <p className="section-subheading mb-2">Your Selections</p>
          <h1 className="font-serif text-4xl font-bold text-parchment-900 dark:text-parchment-100">
            Shopping Cart
          </h1>
          <p className="font-sans text-sm text-toffee-600 dark:text-toffee-400 mt-1">
            {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Cart items */}
          <div className="flex-1 space-y-4">
            {cartItems.map((book) => (
              <div
                key={book._id}
                className="bg-parchment-50 dark:bg-navy-800 rounded-2xl border border-parchment-300 dark:border-navy-600 shadow-card dark:shadow-card-dark overflow-hidden hover:border-wine-300 dark:hover:border-wine-700 transition-all duration-250"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Cover */}
                  <div className="sm:w-36 sm:h-auto h-48 flex-shrink-0 bg-parchment-300 dark:bg-navy-700 overflow-hidden">
                    <img
                      src={book.cover_image}
                      alt={book.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-serif font-bold text-lg text-parchment-900 dark:text-parchment-100 mb-1">
                          {book.title}
                        </h3>
                        <p className="font-sans text-xs text-toffee-600 dark:text-toffee-400 mb-3">
                          by {book.author}
                        </p>
                        <p className="font-sans font-bold text-xl text-wine-600 dark:text-wine-400">
                          ${fmt(book.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(book._id)}
                        className="p-2 rounded-lg text-toffee-400 dark:text-toffee-600 hover:bg-wine-50 dark:hover:bg-wine-900/20 hover:text-wine-600 dark:hover:text-wine-400 transition-all duration-200 shrink-0"
                        aria-label="Remove from cart"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>

                    <Link
                      to={`/view_detail/${book._id}`}
                      className="mt-4 self-start font-sans text-xs font-semibold text-wine-600 dark:text-wine-400 hover:text-wine-700 dark:hover:text-wine-300 inline-flex items-center gap-1.5 transition-colors"
                    >
                      View Details
                      <FaArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:w-80 xl:w-96">
            <div className="bg-parchment-50 dark:bg-navy-800 rounded-2xl border border-parchment-300 dark:border-navy-600 shadow-card dark:shadow-card-dark p-6 sticky top-24">
              <h3 className="font-serif text-xl font-bold text-parchment-900 dark:text-parchment-100 mb-6">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between font-sans text-sm text-toffee-700 dark:text-parchment-300">
                  <span>Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})</span>
                  <span>${fmt(totalPrice)}</span>
                </div>
                <div className="flex justify-between font-sans text-sm text-toffee-700 dark:text-parchment-300">
                  <span>Shipping</span>
                  <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-semibold">
                    <FaTruck className="w-3.5 h-3.5" />
                    Free
                  </span>
                </div>

                <div className="h-px bg-parchment-300 dark:bg-navy-600 my-2" />

                <div className="flex justify-between font-sans font-bold text-lg text-parchment-900 dark:text-parchment-100">
                  <span>Total</span>
                  <span className="text-wine-600 dark:text-wine-400">${fmt(totalPrice)}</span>
                </div>
              </div>

              {localStorage.getItem("role") !== "admin" && (
                <Button
                  onClick={handleCheckout}
                  variant="primary"
                  fullWidth
                  disabled
                  title="This feature is temporarily disabled"
                >
                  Proceed to Checkout
                  <FaArrowRight className="w-3.5 h-3.5" />
                </Button>
              )}

              <p className="font-sans text-xs text-center text-toffee-500 dark:text-toffee-500 mt-3">
                Checkout temporarily unavailable
              </p>

              {/* Decorative illustration */}
              <div className="mt-6 pt-6 border-t border-parchment-300 dark:border-navy-600">
                <img
                  src="/images/ichigo.png"
                  alt=""
                  className="w-full h-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
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
