import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHeart,
  FaHistory,
  FaCog,
  FaUser,
  FaSignOutAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Button from "../components/ui/Button";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import AuthorProfile from "./AuthorProfile";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  useEffect(() => {
    const fetchUser = async () => {
      if (!token || !userId) {
        dispatch(authActions.logout());
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const headers = {
          id: userId,
          authorization: `Bearer ${token}`,
        };
        const response = await axios.get(
          "https://library-of-heaven.onrender.com/api/v1/get_user_info",
          {
            headers,
          }
        );

        if (response.data) {
          setUser(response.data);
          setError(null);
        } else {
          setError("No user data received");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.response?.data?.message || "Failed to load profile");

        if (error.response?.status === 401) {
          dispatch(authActions.logout());
          localStorage.removeItem("token");
          localStorage.removeItem("id");
          localStorage.removeItem("role");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, userId, dispatch, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <p className="text-lg text-gray-600 mb-4">No user data available</p>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  // If user is an author (admin), show AuthorProfile
  if (user.role === "admin") {
    return <AuthorProfile />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'url("/images/spidy.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-red-50">
                  <FaUser className="w-20 h-20 text-red-400" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {user.username}
                </h1>
                <div className="flex flex-col md:flex-row gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-red-500" />
                    <span>{user.email}</span>
                  </div>
                  {user.address && (
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-red-500" />
                      <span>{user.address}</span>
                    </div>
                  )}
                  {user.createdAt && (
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-red-500" />
                      <span>
                        Member since{" "}
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  dispatch(authActions.logout());
                  localStorage.removeItem("token");
                  localStorage.removeItem("id");
                  localStorage.removeItem("role");
                  navigate("/login");
                }}
              >
                <FaSignOutAlt /> Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/profile/favourites"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors duration-300">
                <FaHeart className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Favourites
                </h3>
                <p className="text-gray-600">View your favorite books</p>
              </div>
            </div>
          </Link>

          <Link
            to="/profile/orderhistory"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors duration-300">
                <FaHistory className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Order History
                </h3>
                <p className="text-gray-600">Track your orders</p>
              </div>
            </div>
          </Link>

          <Link
            to="/profile/settings"
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors duration-300">
                <FaCog className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Settings
                </h3>
                <p className="text-gray-600">Manage your account</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Profile;
