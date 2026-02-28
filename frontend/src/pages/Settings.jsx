import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Settings = () => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Fetch user info to pre-fill the address field
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/get_user_info`,
          { headers }
        );
        setAddress(response.data.address || "");
      } catch (error) {
        console.error("Error fetching user info:", error);
        toast.error("Failed to fetch user info");
      }
    };

    fetchUserInfo();
  }, []);

  // Handle address update
  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    if (!address) {
      toast.error("Address cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/update_address`,
        { address },
        { headers }
      );
      toast.success(response.data.message); // Success toast
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Failed to update address"); // Error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-xl shadow-sm dark:shadow-gray-900/50 transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-yellow-400 transition-colors duration-300">Settings</h2>

      {/* Address Update Form */}
      <form onSubmit={handleUpdateAddress} className="max-w-md">
        <div className="mb-6">
          <label htmlFor="address" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 transition-colors duration-300">
            Address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-yellow-500 transition-colors duration-300 placeholder-gray-400 dark:placeholder-gray-400"
            placeholder="Enter your address"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition duration-300 disabled:bg-gray-400 dark:disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Update Address"}
        </button>
      </form>
    </div>
  );
};

export default Settings;
