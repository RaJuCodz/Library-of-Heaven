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
          "https://library-of-heaven.onrender.com/api/v1/get_user_info",
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
        "https://library-of-heaven.onrender.com/api/v1/update_address",
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
    <div className="bg-gray-900 text-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400">Settings</h2>

      {/* Address Update Form */}
      <form onSubmit={handleUpdateAddress} className="max-w-md">
        <div className="mb-6">
          <label htmlFor="address" className="block text-sm font-medium mb-2">
            Address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Enter your address"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Update Address"}
        </button>
      </form>
    </div>
  );
};

export default Settings;
