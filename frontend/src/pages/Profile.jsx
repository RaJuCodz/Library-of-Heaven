import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaBookmark,
  FaHistory,
  FaCog,
  FaUser,
  FaSignOutAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBook,
} from "react-icons/fa";
import Button from "../components/ui/Button";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import AuthorProfile from "./AuthorProfile";

const NAV_ITEMS = [
  { to: "/profile/library", icon: FaBookmark, label: "Library", desc: "Your saved novels" },
  { to: "/profile/orderhistory", icon: FaHistory, label: "Order History", desc: "Past token purchases" },
  { to: "/profile/settings", icon: FaCog, label: "Settings", desc: "Manage account" },
];

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  useEffect(() => {
    if (!token || !userId) {
      dispatch(authActions.logout());
      navigate("/login");
      return;
    }
    axios
      .get(`${import.meta.env.VITE_API_URL}/get_user_info`, {
        headers: { id: userId, authorization: `Bearer ${token}` },
      })
      .then((res) => { setUser(res.data); })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load profile");
        if (err.response?.status === 401) {
          dispatch(authActions.logout());
          localStorage.removeItem("token");
          localStorage.removeItem("id");
          localStorage.removeItem("role");
          navigate("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [token, userId, dispatch, navigate]);

  const handleLogout = () => {
    dispatch(authActions.logout());
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment-200 dark:bg-navy-900 pt-24 flex justify-center items-center transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-wine-600 border-t-transparent rounded-full animate-spin" />
          <p className="font-sans text-sm text-toffee-600 dark:text-toffee-400">Loading your profile…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-parchment-200 dark:bg-navy-900 pt-24 flex justify-center items-center transition-colors duration-300">
        <div className="text-center">
          <p className="font-sans text-wine-600 dark:text-wine-400 mb-4">{error}</p>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (user.role === "admin") return <AuthorProfile />;

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div className="min-h-screen bg-parchment-200 dark:bg-navy-900 pt-24 pb-16 transition-colors duration-300">

      {/* ── Profile banner ─────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-wine dark:bg-gradient-navy mb-0">
        {/* Decorative background pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'url("/images/spidy.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-wine-900/60 via-transparent to-transparent" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            className="flex flex-col md:flex-row items-center md:items-end gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-parchment-50/15 backdrop-blur-sm border-2 border-parchment-100/30 flex items-center justify-center shadow-glass">
                <FaUser className="w-12 h-12 text-parchment-100/80" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 border-2 border-white dark:border-navy-700" />
            </div>

            {/* User info */}
            <div className="flex-1 text-center md:text-left">
              <p className="font-sans text-xs text-wine-200 uppercase tracking-widest mb-1" style={{ letterSpacing: "0.14em" }}>
                Reader Account
              </p>
              <h1 className="font-serif text-3xl font-bold text-parchment-50 mb-2">{user.username}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-1.5">
                <span className="flex items-center gap-1.5 font-sans text-xs text-wine-200">
                  <FaEnvelope className="w-3 h-3" /> {user.email}
                </span>
                {user.address && (
                  <span className="flex items-center gap-1.5 font-sans text-xs text-wine-200">
                    <FaMapMarkerAlt className="w-3 h-3" /> {user.address}
                  </span>
                )}
                {user.createdAt && (
                  <span className="flex items-center gap-1.5 font-sans text-xs text-wine-200">
                    <FaCalendarAlt className="w-3 h-3" />
                    Member since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                )}
              </div>
            </div>

            {/* Sign out */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-parchment-50/15 backdrop-blur-sm border border-parchment-100/20 text-parchment-100 hover:bg-parchment-50/25 font-sans text-sm font-medium transition-all duration-200 shrink-0"
            >
              <FaSignOutAlt className="w-4 h-4" />
              Sign Out
            </button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Quick nav cards ───────────────────── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {NAV_ITEMS.map(({ to, icon: Icon, label, desc }) => (
            <Link
              key={to}
              to={to}
              className={[
                "group flex items-center gap-4 p-5 rounded-2xl border shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:shadow-card-hover",
                isActive(to)
                  ? "bg-wine-600 border-wine-700 shadow-glow-wine"
                  : "bg-parchment-50 dark:bg-navy-800 border-parchment-300 dark:border-navy-600 hover:border-wine-400 dark:hover:border-wine-700",
              ].join(" ")}
            >
              <div className={[
                "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-250",
                isActive(to)
                  ? "bg-wine-700/50"
                  : "bg-wine-600/10 dark:bg-wine-500/15 group-hover:bg-wine-600/20",
              ].join(" ")}>
                <Icon className={[
                  "w-5 h-5",
                  isActive(to) ? "text-parchment-100" : "text-wine-600 dark:text-wine-400",
                ].join(" ")} />
              </div>
              <div>
                <h3 className={[
                  "font-sans font-semibold text-sm",
                  isActive(to) ? "text-parchment-50" : "text-parchment-900 dark:text-parchment-100",
                ].join(" ")}>
                  {label}
                </h3>
                <p className={[
                  "font-sans text-xs mt-0.5",
                  isActive(to) ? "text-wine-200" : "text-toffee-600 dark:text-toffee-400",
                ].join(" ")}>
                  {desc}
                </p>
              </div>
            </Link>
          ))}
        </motion.div>

        {/* ── Content outlet ────────────────────── */}
        <motion.div
          className="bg-parchment-50 dark:bg-navy-800 rounded-2xl border border-parchment-300 dark:border-navy-600 shadow-card dark:shadow-card-dark p-6 md:p-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <Outlet />
        </motion.div>

      </div>
    </div>
  );
};

export default Profile;
