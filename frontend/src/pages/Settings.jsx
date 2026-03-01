import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaCheckCircle, FaShieldAlt, FaBell } from "react-icons/fa";

const Settings = () => {
  const [address, setAddress]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);

  const headers = {
    id:            localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/get_user_info`, { headers })
      .then((res) => setAddress(res.data.address || ""))
      .catch(() => toast.error("Failed to fetch user info"))
      .finally(() => setFetching(false));
  }, []);

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    if (!address.trim()) { toast.error("Address cannot be empty"); return; }
    setLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/update_address`,
        { address },
        { headers }
      );
      toast.success(res.data.message || "Address updated successfully!");
    } catch {
      toast.error("Failed to update address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-parchment-900 dark:text-parchment-100">Settings</h2>
          <p className="font-sans text-xs text-toffee-600 dark:text-toffee-400 mt-0.5">Manage your account preferences</p>
        </div>
      </div>

      <div className="space-y-5 max-w-xl">

        {/* Delivery address */}
        <motion.div
          className="bg-parchment-100 dark:bg-navy-700 rounded-xl border border-parchment-300 dark:border-navy-500 p-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-wine-600/10 dark:bg-wine-500/15 flex items-center justify-center">
              <FaMapMarkerAlt className="w-4 h-4 text-wine-600 dark:text-wine-400" />
            </div>
            <div>
              <h3 className="font-sans font-semibold text-sm text-parchment-900 dark:text-parchment-100">Delivery Address</h3>
              <p className="font-sans text-xs text-toffee-500 dark:text-toffee-500">Used for order deliveries</p>
            </div>
          </div>

          <form onSubmit={handleUpdateAddress} className="space-y-4" noValidate>
            <div>
              <label className="field-label" htmlFor="address">Address</label>
              {fetching ? (
                <div className="input-field animate-pulse bg-parchment-200 dark:bg-navy-600 text-transparent">Loading…</div>
              ) : (
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, City, Country"
                  className="input-field"
                  required
                />
              )}
            </div>
            <motion.button
              type="submit"
              disabled={loading || fetching}
              className={[
                "flex items-center gap-2 px-5 py-2.5 rounded-lg font-sans font-semibold text-sm text-parchment-50 transition-all duration-250",
                loading || fetching
                  ? "bg-wine-400 cursor-not-allowed"
                  : "bg-wine-600 hover:bg-wine-700 shadow-sm hover:shadow-glow-wine",
              ].join(" ")}
              whileHover={!loading ? { scale: 1.01 } : {}}
              whileTap={!loading ? { scale: 0.99 } : {}}
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                : <FaCheckCircle className="w-4 h-4" />
              }
              {loading ? "Saving…" : "Save Address"}
            </motion.button>
          </form>
        </motion.div>

        {/* Privacy card (decorative, non-functional) */}
        <motion.div
          className="bg-parchment-100 dark:bg-navy-700 rounded-xl border border-parchment-300 dark:border-navy-500 p-6 opacity-60 cursor-not-allowed select-none"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-navy-400/10 dark:bg-navy-500/30 flex items-center justify-center">
                <FaShieldAlt className="w-4 h-4 text-navy-400 dark:text-navy-300" />
              </div>
              <div>
                <h3 className="font-sans font-semibold text-sm text-parchment-900 dark:text-parchment-100">Privacy & Security</h3>
                <p className="font-sans text-xs text-toffee-500 dark:text-toffee-500">Password, 2FA, sessions</p>
              </div>
            </div>
            <span className="font-sans text-xs px-2.5 py-1 rounded-full bg-parchment-200 dark:bg-navy-600 text-toffee-500 dark:text-toffee-400 border border-parchment-300 dark:border-navy-500">
              Coming soon
            </span>
          </div>
        </motion.div>

        {/* Notifications card (decorative) */}
        <motion.div
          className="bg-parchment-100 dark:bg-navy-700 rounded-xl border border-parchment-300 dark:border-navy-500 p-6 opacity-60 cursor-not-allowed select-none"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-toffee-100 dark:bg-toffee-900/20 flex items-center justify-center">
                <FaBell className="w-4 h-4 text-toffee-600 dark:text-toffee-400" />
              </div>
              <div>
                <h3 className="font-sans font-semibold text-sm text-parchment-900 dark:text-parchment-100">Notifications</h3>
                <p className="font-sans text-xs text-toffee-500 dark:text-toffee-500">Email & push preferences</p>
              </div>
            </div>
            <span className="font-sans text-xs px-2.5 py-1 rounded-full bg-parchment-200 dark:bg-navy-600 text-toffee-500 dark:text-toffee-400 border border-parchment-300 dark:border-navy-500">
              Coming soon
            </span>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Settings;
