import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaBookmark, FaHistory, FaCog, FaUser,
  FaSignOutAlt, FaEnvelope, FaCalendarAlt,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import AuthorProfile from "./AuthorProfile";

const NAV_ITEMS = [
  { to: "/profile/library",      icon: FaBookmark, label: "My Library",     desc: "Saved novels"       },
  { to: "/profile/orderhistory", icon: FaHistory,  label: "Order History",  desc: "Token purchases"    },
  { to: "/profile/settings",     icon: FaCog,      label: "Settings",       desc: "Account preferences"},
];

const Profile = () => {
  const [user, setUser]       = useState(null);
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate  = useNavigate();
  const location  = useLocation();
  const dispatch  = useDispatch();

  const token  = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  useEffect(() => {
    if (!token || !userId) { dispatch(authActions.logout()); navigate("/login"); return; }
    axios
      .get(`${import.meta.env.VITE_API_URL}/get_user_info`, {
        headers: { id: userId, authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load profile");
        if (err.response?.status === 401) {
          dispatch(authActions.logout());
          ["token","id","role"].forEach((k) => localStorage.removeItem(k));
          navigate("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [token, userId, dispatch, navigate]);

  const handleLogout = () => {
    dispatch(authActions.logout());
    ["token","id","role"].forEach((k) => localStorage.removeItem(k));
    navigate("/login");
  };

  /* ── Loading ──────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-parchment-200 dark:bg-navy-900 pt-24 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-gilt-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-sans text-sm text-toffee-600 dark:text-toffee-400">Loading your profile…</p>
        </div>
      </div>
    );
  }

  /* ── Error ────────────────────────────────────────── */
  if (error) {
    return (
      <div className="min-h-screen bg-parchment-200 dark:bg-navy-900 pt-24 flex justify-center items-center">
        <div className="text-center">
          <p className="font-sans text-wine-600 dark:text-wine-400 mb-4">{error}</p>
          <button onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-lg bg-gilt-500 text-navy-950 font-sans font-semibold text-sm">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;
  if (user.role === "admin") return <AuthorProfile />;

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  /* ── Initials avatar ──────────────────────────────── */
  const initials = user.username
    ? user.username.slice(0, 2).toUpperCase()
    : "??";

  return (
    <div className="min-h-screen bg-parchment-200 dark:bg-navy-900 pt-20 pb-16 transition-colors duration-300">

      {/* ── Top banner ──────────────────────────────── */}
      <div className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #3D0C02 0%, #801818 40%, #5A4610 100%)' }}
      >
        {/* Star grid overlay */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #F0DE9A 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            className="flex flex-col sm:flex-row items-center sm:items-end gap-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center
                border-2 border-gilt-400/50 shadow-glow-gilt"
                style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.06))' }}
              >
                <span className="font-cinzel font-bold text-2xl text-gilt-300">{initials}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-green-400 border-2 border-white dark:border-navy-900" />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <p className="badge-cinzel text-gilt-300 mb-1 block">Reader Account</p>
              <h1 className="font-serif text-3xl font-bold text-parchment-50 mb-2">{user.username}</h1>
              <div className="flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-1.5">
                <span className="flex items-center gap-1.5 font-sans text-xs text-parchment-300">
                  <FaEnvelope className="w-3 h-3 text-gilt-400" /> {user.email}
                </span>
                {memberSince && (
                  <span className="flex items-center gap-1.5 font-sans text-xs text-parchment-300">
                    <FaCalendarAlt className="w-3 h-3 text-gilt-400" /> Member since {memberSince}
                  </span>
                )}
              </div>
            </div>

            {/* Sign out */}
            <button onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl
                border border-parchment-100/20 bg-parchment-50/10 backdrop-blur-sm
                text-parchment-200 hover:bg-parchment-50/20
                font-sans text-sm font-medium transition-all duration-200 shrink-0"
            >
              <FaSignOutAlt className="w-3.5 h-3.5" /> Sign Out
            </button>
          </motion.div>
        </div>
      </div>

      {/* ── Main layout: sidebar + content ──────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-7">

          {/* ── Sidebar ─────────────────────────────── */}
          <motion.aside
            className="lg:w-64 shrink-0"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-parchment-50 dark:bg-navy-800 rounded-2xl border border-parchment-300 dark:border-navy-600 shadow-card dark:shadow-card-dark p-4 sticky top-24">

              {/* User summary */}
              <div className="flex items-center gap-3 p-3 mb-4 rounded-xl bg-parchment-100 dark:bg-navy-700/60">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.06))' }}
                >
                  <span className="font-cinzel font-bold text-sm text-gilt-600 dark:text-gilt-400">
                    {initials}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-sans font-semibold text-sm text-parchment-900 dark:text-parchment-100 truncate">
                    {user.username}
                  </p>
                  <p className="font-sans text-xs text-toffee-600 dark:text-toffee-400 truncate">{user.email}</p>
                </div>
              </div>

              {/* Gilt divider */}
              <div className="divider-gilt mb-4" />

              {/* Navigation */}
              <nav className="space-y-1.5">
                {NAV_ITEMS.map(({ to, icon: Icon, label, desc }) => {
                  const active = isActive(to);
                  return (
                    <Link key={to} to={to}
                      className={`sidebar-nav-item ${active ? 'active' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200
                        ${active ? 'bg-navy-950/20' : 'bg-parchment-200 dark:bg-navy-700'}`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${active ? 'text-navy-950' : 'text-gilt-600 dark:text-gilt-400'}`} />
                      </div>
                      <div>
                        <p className={`font-sans font-semibold text-sm ${active ? 'text-navy-950' : 'text-parchment-900 dark:text-parchment-100'}`}>
                          {label}
                        </p>
                        <p className={`font-sans text-xs mt-0.5 ${active ? 'text-navy-900/70' : 'text-toffee-600 dark:text-toffee-400'}`}>
                          {desc}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              {/* Logout */}
              <div className="divider-gilt my-4" />
              <button onClick={handleLogout}
                className="sidebar-nav-item w-full text-wine-600 dark:text-wine-400
                  hover:bg-wine-50 dark:hover:bg-wine-900/20"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-wine-50 dark:bg-wine-900/20">
                  <FaSignOutAlt className="w-3.5 h-3.5 text-wine-600 dark:text-wine-400" />
                </div>
                <span>Sign Out</span>
              </button>
            </div>
          </motion.aside>

          {/* ── Content area ────────────────────────── */}
          <motion.main
            className="flex-1 min-w-0"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-parchment-50 dark:bg-navy-800 rounded-2xl border border-parchment-300 dark:border-navy-600 shadow-card dark:shadow-card-dark p-6 md:p-8">
              <Outlet />
            </div>
          </motion.main>

        </div>
      </div>
    </div>
  );
};

export default Profile;
