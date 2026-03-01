import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaBox, FaShippingFast, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

const STATUS_MAP = {
  "Order Placed":    { icon: FaClock,        color: "text-toffee-600 dark:text-toffee-400",  bg: "bg-toffee-100 dark:bg-toffee-900/20",   border: "border-toffee-300 dark:border-toffee-700"   },
  "Order Shipped":   { icon: FaShippingFast, color: "text-blue-600 dark:text-blue-400",      bg: "bg-blue-50 dark:bg-blue-900/20",         border: "border-blue-200 dark:border-blue-800"       },
  "Order Delivered": { icon: FaCheckCircle,  color: "text-green-600 dark:text-green-400",    bg: "bg-green-50 dark:bg-green-900/20",       border: "border-green-200 dark:border-green-800"     },
  "cancelled":       { icon: FaTimesCircle,  color: "text-wine-600 dark:text-wine-400",      bg: "bg-wine-50 dark:bg-wine-900/20",         border: "border-wine-200 dark:border-wine-800"       },
  "pending":         { icon: FaClock,        color: "text-toffee-600 dark:text-toffee-400",  bg: "bg-toffee-100 dark:bg-toffee-900/20",   border: "border-toffee-300 dark:border-toffee-700"   },
  "completed":       { icon: FaCheckCircle,  color: "text-green-600 dark:text-green-400",    bg: "bg-green-50 dark:bg-green-900/20",       border: "border-green-200 dark:border-green-800"     },
};

const getStatus = (status) => STATUS_MAP[status] || STATUS_MAP["pending"];

const OrderHistory = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = {
    id:            localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/get_order_history`, { headers })
      .then((res) => setOrders(res.data.data))
      .catch(() => toast.error("Failed to fetch order history"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-56 gap-4">
        <div className="w-8 h-8 border-2 border-wine-600 border-t-transparent rounded-full animate-spin" />
        <p className="font-sans text-sm text-toffee-600 dark:text-toffee-400">Loading orders…</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-56 gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-parchment-200 dark:bg-navy-700 flex items-center justify-center">
          <FaBox className="w-7 h-7 text-toffee-400 dark:text-toffee-500" />
        </div>
        <div>
          <p className="font-serif text-xl font-bold text-parchment-800 dark:text-parchment-200 mb-1">No orders yet</p>
          <p className="font-sans text-sm text-toffee-600 dark:text-toffee-400">Your purchase history will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-parchment-900 dark:text-parchment-100">Order History</h2>
          <p className="font-sans text-xs text-toffee-600 dark:text-toffee-400 mt-0.5">{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-toffee-100 dark:bg-toffee-900/20 flex items-center justify-center">
          <FaBox className="w-4 h-4 text-toffee-600 dark:text-toffee-400" />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[22px] top-4 bottom-4 w-px bg-gradient-to-b from-wine-600/30 via-parchment-400/30 dark:via-navy-500/30 to-transparent hidden sm:block" />

        <div className="space-y-4">
          {orders.map((order, i) => {
            const { icon: StatusIcon, color, bg, border } = getStatus(order.status);
            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex gap-4"
              >
                {/* Timeline dot */}
                <div className="hidden sm:flex shrink-0 flex-col items-center">
                  <div className={`w-11 h-11 rounded-xl ${bg} ${border} border flex items-center justify-center shadow-sm`}>
                    <StatusIcon className={`w-4 h-4 ${color}`} />
                  </div>
                </div>

                {/* Card */}
                <div className="flex-1 bg-parchment-100 dark:bg-navy-700 rounded-xl border border-parchment-300 dark:border-navy-500 p-5 hover:border-wine-300 dark:hover:border-wine-700 hover:shadow-sm transition-all duration-250">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex items-start gap-4">
                      {/* Book cover thumb */}
                      {order.book?.cover_image && (
                        <img
                          src={order.book.cover_image}
                          alt={order.book.title}
                          className="w-12 h-16 object-cover rounded-lg shrink-0 shadow-sm"
                        />
                      )}
                      <div>
                        <h3 className="font-serif font-bold text-base text-parchment-900 dark:text-parchment-100 mb-0.5">
                          {order.book?.title}
                        </h3>
                        <p className="font-sans text-xs text-toffee-600 dark:text-toffee-400 mb-1.5">
                          by {order.book?.author}
                        </p>
                        <p className="font-sans font-bold text-lg text-wine-600 dark:text-wine-400">
                          ${order.book?.price}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                      {/* Status badge */}
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-semibold ${bg} ${color} ${border} border`}>
                        <StatusIcon className="w-3 h-3" />
                        {order.status || "Pending"}
                      </span>
                      <p className="font-sans text-xs text-toffee-500 dark:text-toffee-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
