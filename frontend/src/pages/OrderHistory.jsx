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
        "https://library-of-heaven.onrender.com/api/v1/get_order_history",
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
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400">Loading order history...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No order history available.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400">Order History</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{order.book.title}</h3>
              <p className="text-sm text-gray-400">
                Order Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <p className="text-sm text-gray-400 mb-2">by {order.book.author}</p>
            <p className="text-lg font-semibold text-yellow-400 mb-4">
              ${order.book.price}
            </p>
            <p className="text-sm text-gray-400">
              Status:{" "}
              <span
                className={`font-semibold ${
                  order.status === "completed"
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
