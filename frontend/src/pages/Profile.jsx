import React, { useEffect, useState } from "react";
import { Link, Routes, Route, Outlet } from "react-router-dom";
import axios from "axios";
import { FaBars, FaTimes } from "react-icons/fa"; // Icons for mobile menu toggle

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/get_user_info",
          { headers }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      {/* Mobile Menu Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg text-white focus:outline-none"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <FaTimes className="w-6 h-6" />
        ) : (
          <FaBars className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-8">
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-28 h-28 rounded-full border-4 border-gray-700 mb-6"
          />
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-sm text-gray-400 mt-2">{user.email}</p>
          <p className="text-sm text-gray-500 mt-2">
            Member since: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="mt-8">
          <Link
            to="/profile/favourites"
            className="block px-8 py-4 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300"
            onClick={() => setIsSidebarOpen(false)} // Close sidebar on link click
          >
            Favourites
          </Link>
          <Link
            to="/profile/orderhistory"
            className="block px-8 py-4 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300"
            onClick={() => setIsSidebarOpen(false)} // Close sidebar on link click
          >
            Order History
          </Link>
          <Link
            to="/profile/settings"
            className="block px-8 py-4 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300"
            onClick={() => setIsSidebarOpen(false)} // Close sidebar on link click
          >
            Settings
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="md:ml-80 p-4 md:p-8">
        {/* Render nested routes */}
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;
