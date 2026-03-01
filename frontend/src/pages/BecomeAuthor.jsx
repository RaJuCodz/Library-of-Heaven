import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import { motion } from "framer-motion";
import { FaPenFancy, FaCheckCircle, FaBook, FaStar, FaUsers } from "react-icons/fa";

const PERKS = [
  { icon: FaBook,   text: "Publish your books to thousands of readers" },
  { icon: FaStar,   text: "Earn recognition and grow your audience"     },
  { icon: FaUsers,  text: "Join a community of passionate authors"      },
];

const BecomeAuthor = () => {
  const [authorName, setAuthorName] = useState("");
  const [bio, setBio]               = useState("");
  const [success, setSuccess]       = useState("");
  const [error, setError]           = useState("");
  const [isLoading, setIsLoading]   = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const id    = localStorage.getItem("id");
      const res   = await axios.post(
        `${import.meta.env.VITE_API_URL}/become-author`,
        { authorName, bio },
        { headers: { Authorization: `Bearer ${token}`, id } }
      );
      setSuccess(res.data.message);
      localStorage.setItem("role", "admin");
      dispatch(authActions.setRole("admin"));
      setTimeout(() => navigate("/author-profile"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to become author. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-parchment-200 dark:bg-navy-900 flex items-stretch transition-colors duration-300">

      {/* ── Left panel ──────────────────────────── */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-gradient-wine items-center justify-center p-12">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/images/library.jpg"
            alt="Library"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-wine-900/80 via-wine-800/70 to-wine-900/90" />
        </div>

        {/* Floating decorative circles */}
        <div className="absolute top-16 left-16 w-40 h-40 rounded-full border border-parchment-100/10" />
        <div className="absolute bottom-24 right-12 w-28 h-28 rounded-full border border-parchment-100/10" />

        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl bg-parchment-50/15 backdrop-blur-sm border border-parchment-100/20 flex items-center justify-center mx-auto mb-8">
            <FaPenFancy className="w-9 h-9 text-parchment-100" />
          </div>

          <h2 className="font-serif text-4xl font-bold text-parchment-50 mb-4 leading-tight">
            Share Your<br />
            <span className="italic text-toffee-300">Story</span> with the World
          </h2>
          <p className="font-sans text-sm text-wine-200 leading-relaxed mb-10 max-w-xs mx-auto">
            Become an author on Library of Heaven and reach thousands of passionate readers.
          </p>

          <div className="space-y-4 text-left">
            {PERKS.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.15, duration: 0.5 }}
              >
                <div className="w-8 h-8 rounded-lg bg-parchment-50/15 backdrop-blur-sm flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-toffee-300" />
                </div>
                <p className="font-sans text-sm text-parchment-200">{text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Right panel (form) ───────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-20 lg:py-0">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Mobile header */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-wine-600/10 dark:bg-wine-500/20 flex items-center justify-center">
              <FaPenFancy className="w-5 h-5 text-wine-600 dark:text-wine-400" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-parchment-900 dark:text-parchment-100">Become an Author</h1>
              <p className="font-sans text-xs text-toffee-600 dark:text-toffee-400">Share your story with the world</p>
            </div>
          </div>

          <div className="hidden lg:block mb-8">
            <p className="section-subheading mb-2">Author Program</p>
            <h1 className="font-serif text-4xl font-bold text-parchment-900 dark:text-parchment-100">
              Become an Author
            </h1>
            <p className="font-sans text-sm text-toffee-600 dark:text-toffee-400 mt-2">
              Complete the form to join our author community
            </p>
          </div>

          <div className="bg-parchment-50 dark:bg-navy-800 rounded-2xl border border-parchment-300 dark:border-navy-600 shadow-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label className="field-label" htmlFor="authorName">Author Name</label>
                <input
                  id="authorName"
                  name="authorName"
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Your pen name or real name"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="field-label" htmlFor="bio">
                  Your Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell readers about yourself, your writing style, and what inspires you…"
                  className="input-field resize-none"
                  rows={5}
                  required
                />
                <p className="font-sans text-xs text-toffee-500 dark:text-toffee-500 mt-1.5">
                  A great bio helps readers connect with you.
                </p>
              </div>

              {/* Success */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                >
                  <FaCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                  <p className="font-sans text-sm text-green-700 dark:text-green-300">{success}</p>
                </motion.div>
              )}

              {/* Error */}
              {error && (
                <div className="p-3 rounded-xl bg-wine-50 dark:bg-wine-900/20 border border-wine-200 dark:border-wine-800">
                  <p className="font-sans text-sm text-wine-700 dark:text-wine-400">{error}</p>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading}
                className={[
                  "w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-sans font-semibold text-sm text-parchment-50 tracking-wide shadow-md transition-all duration-300",
                  isLoading
                    ? "bg-wine-400 cursor-not-allowed"
                    : "bg-wine-600 hover:bg-wine-700 hover:shadow-glow-wine",
                ].join(" ")}
                whileHover={!isLoading ? { scale: 1.01 } : {}}
                whileTap={!isLoading ? { scale: 0.99 } : {}}
              >
                {isLoading && (
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                )}
                <FaPenFancy className={isLoading ? "hidden" : "w-4 h-4"} />
                {isLoading ? "Submitting…" : "Submit Application"}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default BecomeAuthor;
