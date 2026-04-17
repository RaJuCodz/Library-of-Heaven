import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLock, FaTimes, FaExclamationCircle, FaTrash } from "react-icons/fa";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

/**
 * PasswordConfirmModal
 *
 * Props:
 *  - isOpen      {boolean}   – controls visibility
 *  - onClose     {function}  – called when the user cancels / closes
 *  - onConfirmed {function}  – called after the password is successfully verified
 *  - title       {string}    – optional modal heading  (default: "Confirm Identity")
 *  - description {string}    – optional sub-heading    (default: generic message)
 *  - actionLabel {string}    – label for the confirm button  (default: "Confirm")
 *  - danger      {boolean}   – when true the confirm button is styled in wine/red
 */
const PasswordConfirmModal = ({
  isOpen,
  onClose,
  onConfirmed,
  title = "Confirm Identity",
  description = "Enter your password to continue with this action.",
  actionLabel = "Confirm",
  danger = true,
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset state whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(
        `${API}/verify_password`,
        { password },
        {
          headers: {
            id: localStorage.getItem("id"),
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Password verified — hand control back to the caller
      onConfirmed();
    } catch (err) {
      setError(err.response?.data?.message || "Incorrect password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return; // prevent closing mid-request
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleConfirm();
    if (e.key === "Escape") handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        /* ── Backdrop ── */
        <motion.div
          key="pw-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
        >
          {/* Semi-transparent blur layer */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* ── Panel ── */}
          <motion.div
            key="pw-modal-panel"
            className="relative z-10 w-full max-w-md bg-parchment-50 dark:bg-navy-800 border border-parchment-300 dark:border-navy-600 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-wine-700 via-wine-500 to-wine-700" />

            <div className="p-6">
              {/* ── Header ── */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-wine-100 dark:bg-wine-900/30 flex items-center justify-center shrink-0">
                    <FaLock className="w-4.5 h-4.5 text-wine-600 dark:text-wine-400" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-parchment-900 dark:text-parchment-100 leading-tight">
                      {title}
                    </h3>
                    <p className="font-sans text-xs text-toffee-500 dark:text-toffee-400 mt-0.5 leading-snug">
                      {description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="p-1.5 rounded-lg text-toffee-400 hover:text-wine-600 dark:hover:text-wine-400 hover:bg-parchment-200 dark:hover:bg-navy-700 transition-colors disabled:opacity-40"
                  aria-label="Close"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>

              {/* ── Warning banner (danger mode) ── */}
              {danger && (
                <div className="flex items-start gap-2.5 mb-4 p-3 rounded-xl bg-wine-50 dark:bg-wine-900/20 border border-wine-200 dark:border-wine-800">
                  <FaTrash className="w-3.5 h-3.5 text-wine-600 dark:text-wine-400 shrink-0 mt-0.5" />
                  <p className="font-sans text-xs text-wine-700 dark:text-wine-300 leading-snug">
                    This action is <span className="font-bold">permanent and irreversible</span>. Please confirm you are authorised to proceed.
                  </p>
                </div>
              )}

              {/* ── Password input ── */}
              <div className="mb-4">
                <label className="block font-sans text-sm font-semibold text-parchment-700 dark:text-parchment-300 mb-1.5">
                  Your Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-toffee-400 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your password…"
                    autoFocus
                    autoComplete="current-password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-parchment-100 dark:bg-navy-700 border border-parchment-300 dark:border-navy-500 font-sans text-sm text-parchment-900 dark:text-parchment-100 placeholder-toffee-400 focus:outline-none focus:ring-2 focus:ring-wine-500 dark:focus:ring-wine-400 transition"
                  />
                </div>
              </div>

              {/* ── Error message ── */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    key="pw-error"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-xl bg-wine-50 dark:bg-wine-900/20 border border-wine-200 dark:border-wine-700 text-wine-700 dark:text-wine-300 font-sans text-sm"
                  >
                    <FaExclamationCircle className="shrink-0 w-3.5 h-3.5" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Actions ── */}
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl border border-parchment-400 dark:border-navy-500 text-toffee-700 dark:text-parchment-300 font-sans font-semibold text-sm hover:border-wine-500 hover:text-wine-600 dark:hover:text-wine-400 transition-all disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={loading || !password.trim()}
                  className={`flex-1 py-2.5 rounded-xl font-sans font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    danger
                      ? "bg-wine-600 hover:bg-wine-700 text-parchment-50"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    <>
                      {danger && <FaTrash className="w-3.5 h-3.5" />}
                      {actionLabel}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PasswordConfirmModal;
