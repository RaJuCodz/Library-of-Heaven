import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Fetch order history
  const fetchOrderHistory = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/get_order_history`,
        {
          headers,
        }
      );
      setOrders(response.data.data); // Assuming the API returns data in a `data` field
      setLoading(false);
    } catch (error) {
      console.error("Error fetching order history:", error);
      toast.error("Failed to fetch order history");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 transition-colors duration-300 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Loading order history...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 transition-colors duration-300 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">No order history available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-xl shadow-sm dark:shadow-gray-900/50 transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white transition-colors duration-300">Order History</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg p-6 hover:shadow-md dark:shadow-lg dark:hover:shadow-xl transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{order.book.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                Order Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">by {order.book.author}</p>
            <p className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4 transition-colors duration-300">
              ${order.book.price}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Status:{" "}
              <span
                className={`font - semibold ${order.status === "completed"
                    ? "text-green-500"
                    : order.status === "pending"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
              >
                {order.status || "Pending"}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
