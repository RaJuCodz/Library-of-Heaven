import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import BookCard from "../components/BookCard";
import Button from "../components/ui/Button";
import {
  FaBook,
  FaPlus,
  FaTimes,
  FaTrash,
  FaSignOutAlt,
  FaUpload,
  FaEnvelope,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaCheckCircle,
  FaShippingFast,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

/* ── Status helpers ─────────────────────────── */
const STATUS_MAP = {
  "Order Placed":    { icon: FaClock,        color: "text-toffee-600 dark:text-toffee-400", bg: "bg-toffee-100 dark:bg-toffee-900/20",   border: "border-toffee-300 dark:border-toffee-700" },
  "Order Shipped":   { icon: FaShippingFast, color: "text-blue-600 dark:text-blue-400",     bg: "bg-blue-50 dark:bg-blue-900/20",         border: "border-blue-200 dark:border-blue-800"     },
  "Order Delivered": { icon: FaCheckCircle,  color: "text-green-600 dark:text-green-400",   bg: "bg-green-50 dark:bg-green-900/20",       border: "border-green-200 dark:border-green-800"   },
  "cancelled":       { icon: FaTimesCircle,  color: "text-wine-600 dark:text-wine-400",     bg: "bg-wine-50 dark:bg-wine-900/20",         border: "border-wine-200 dark:border-wine-800"     },
};
const getStatus = (s) => STATUS_MAP[s] || STATUS_MAP["Order Placed"];

/* ── Empty book form ────────────────────────── */
const EMPTY_BOOK = { title: "", author: "", cover_image: "", price: "", description: "" };

/* ─────────────────────────────────────────── */

const AuthorProfile = () => {
  const [profile, setProfile]       = useState(null);
  const [books, setBooks]           = useState([]);
  const [orders, setOrders]         = useState([]);
  const [error, setError]           = useState("");
  const [showForm, setShowForm]     = useState(false);
  const [newBook, setNewBook]       = useState(EMPTY_BOOK);
  const [imgUploading, setImgUploading] = useState(false);
  const [addError, setAddError]     = useState("");
  const [addSuccess, setAddSuccess] = useState("");
  const [ordersLoading, setOrdersLoading] = useState(true);
  const navigate = useNavigate();

  function apiUrl(p) { return `${import.meta.env.VITE_API_URL}${p}`; }

  useEffect(() => {
    if (localStorage.getItem("role") !== "admin") { navigate("/profile"); return; }

    const token = localStorage.getItem("token");
    const id    = localStorage.getItem("id");
    const h     = { Authorization: `Bearer ${token}`, id };

    Promise.all([
      axios.get(apiUrl("/author/profile"),  { headers: h }),
      axios.get(apiUrl("/author/my-books"), { headers: h }),
      axios.get(apiUrl("/author/orders"),   { headers: h }),
    ])
      .then(([pRes, bRes, oRes]) => {
        setProfile(pRes.data);
        setBooks(bRes.data.data  || []);
        setOrders(oRes.data.data || []);
      })
      .catch(() => setError("Failed to load author data"))
      .finally(() => setOrdersLoading(false));
  }, [navigate]);

  const handleAddBook = async (e) => {
    e.preventDefault();
    setAddError(""); setAddSuccess("");
    try {
      const token = localStorage.getItem("token");
      const id    = localStorage.getItem("id");
      const res   = await axios.post(
        apiUrl("/author/add-book"),
        { ...newBook, author: profile.authorName },
        { headers: { Authorization: `Bearer ${token}`, id } }
      );
      setAddSuccess("Book published successfully!");
      setShowForm(false);
      setNewBook(EMPTY_BOOK);
      setBooks((prev) => [res.data.book, ...prev]);
    } catch (err) {
      setAddError(err.response?.data?.message || "Failed to add book");
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm("Delete this book?")) return;
    try {
      const token = localStorage.getItem("token");
      const id    = localStorage.getItem("id");
      await axios.delete(apiUrl("/author/delete-book"), {
        headers: { Authorization: `Bearer ${token}`, id, book_id: bookId },
      });
      setBooks((prev) => prev.filter((b) => b._id !== bookId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete book");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgUploading(true); setAddError("");
    try {
      const fd    = new FormData();
      fd.append("image", file);
      const token = localStorage.getItem("token");
      const id    = localStorage.getItem("id");
      const res   = await axios.post(apiUrl("/author/upload-image"), fd, {
        headers: { Authorization: `Bearer ${token}`, id, "Content-Type": "multipart/form-data" },
      });
      setNewBook((p) => ({ ...p, cover_image: res.data.imageUrl }));
    } catch {
      setAddError("Image upload failed");
    } finally {
      setImgUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (error)   return <div className="min-h-screen flex items-center justify-center text-wine-600 dark:text-wine-400 font-sans">{error}</div>;
  if (!profile)return (
    <div className="min-h-screen flex items-center justify-center gap-4">
      <div className="w-8 h-8 border-2 border-wine-600 border-t-transparent rounded-full animate-spin" />
      <p className="font-sans text-sm text-toffee-600 dark:text-toffee-400">Loading author profile…</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-parchment-200 dark:bg-navy-900 transition-colors duration-300">

      {/* ── Author banner ───────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-wine">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{ backgroundImage: 'url("/images/spidy.png")', backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-wine-900/70 via-wine-800/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-parchment-200/20 dark:from-navy-900/20 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10">
          <motion.div
            className="flex flex-col md:flex-row items-center md:items-end gap-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-parchment-50/20 backdrop-blur-sm border-2 border-parchment-100/30 overflow-hidden shadow-glass shrink-0">
              {profile.avatar
                ? <img src={profile.avatar} alt={profile.authorName} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center"><FaBook className="w-10 h-10 text-parchment-100/70" /></div>
              }
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <p className="font-sans text-xs text-wine-200 uppercase tracking-widest mb-1" style={{ letterSpacing: "0.14em" }}>Author Dashboard</p>
              <h1 className="font-serif text-3xl font-bold text-parchment-50 mb-2">{profile.authorName}</h1>
              <p className="font-sans text-sm text-wine-200 mb-3 max-w-md">{profile.bio}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-1">
                {profile.email   && <span className="flex items-center gap-1.5 font-sans text-xs text-wine-200"><FaEnvelope className="w-3 h-3" />{profile.email}</span>}
                {profile.address && <span className="flex items-center gap-1.5 font-sans text-xs text-wine-200"><FaMapMarkerAlt className="w-3 h-3" />{profile.address}</span>}
                {profile.createdAt && <span className="flex items-center gap-1.5 font-sans text-xs text-wine-200"><FaCalendarAlt className="w-3 h-3" />Since {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>}
              </div>
            </div>

            {/* Sign out */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-parchment-50/15 backdrop-blur-sm border border-parchment-100/20 text-parchment-100 hover:bg-parchment-50/25 font-sans text-sm font-medium transition-all shrink-0"
            >
              <FaSignOutAlt className="w-4 h-4" /> Sign Out
            </button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="flex flex-wrap gap-6 mt-8 pt-6 border-t border-parchment-100/15"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              { label: "Books Published", value: books.length,  icon: FaBook        },
              { label: "Orders Received", value: orders.length, icon: FaShoppingBag },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-parchment-50/15 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-parchment-100" />
                </div>
                <div>
                  <p className="font-serif font-bold text-2xl text-parchment-50 leading-none">{value}</p>
                  <p className="font-sans text-xs text-wine-200 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* My Books section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="section-subheading mb-1">Catalogue</p>
              <h2 className="font-serif text-3xl font-bold text-parchment-900 dark:text-parchment-100">My Books</h2>
            </div>
            <Button variant="primary" size="sm" onClick={() => { setShowForm((v) => !v); setAddError(""); setAddSuccess(""); }}>
              {showForm ? <><FaTimes className="w-3.5 h-3.5" /> Cancel</> : <><FaPlus className="w-3.5 h-3.5" /> Add Book</>}
            </Button>
          </div>

          {/* Add book form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden"
              >
                <form
                  onSubmit={handleAddBook}
                  className="bg-parchment-50 dark:bg-navy-800 rounded-2xl border border-parchment-300 dark:border-navy-600 shadow-card p-6 grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                  <div>
                    <label className="field-label" htmlFor="b-title">Book Title</label>
                    <input id="b-title" type="text" value={newBook.title} onChange={(e) => setNewBook({ ...newBook, title: e.target.value })} placeholder="Title of the book" className="input-field" required />
                  </div>

                  <div>
                    <label className="field-label" htmlFor="b-price">Price ($)</label>
                    <input id="b-price" type="number" min="0" step="0.01" value={newBook.price} onChange={(e) => setNewBook({ ...newBook, price: e.target.value })} placeholder="9.99" className="input-field" required />
                  </div>

                  <div className="md:col-span-2">
                    <label className="field-label" htmlFor="b-desc">Description</label>
                    <textarea id="b-desc" value={newBook.description} onChange={(e) => setNewBook({ ...newBook, description: e.target.value })} placeholder="A brief description of the book…" className="input-field resize-none" rows={3} required />
                  </div>

                  {/* Cover upload */}
                  <div className="md:col-span-2">
                    <label className="field-label" htmlFor="b-img">Cover Image</label>
                    <label
                      htmlFor="b-img"
                      className={[
                        "flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200",
                        imgUploading
                          ? "border-wine-300 dark:border-wine-700 bg-wine-50 dark:bg-wine-900/10"
                          : "border-parchment-400 dark:border-navy-500 hover:border-wine-500 dark:hover:border-wine-600 bg-parchment-100 dark:bg-navy-700",
                      ].join(" ")}
                    >
                      {imgUploading ? (
                        <span className="w-5 h-5 border-2 border-wine-600 border-t-transparent rounded-full animate-spin shrink-0" />
                      ) : (
                        <FaUpload className="w-4 h-4 text-toffee-500 dark:text-toffee-400 shrink-0" />
                      )}
                      <span className="font-sans text-sm text-toffee-600 dark:text-toffee-400">
                        {imgUploading ? "Uploading…" : newBook.cover_image ? "Image uploaded ✓" : "Click to upload cover image"}
                      </span>
                      {newBook.cover_image && !imgUploading && (
                        <img src={newBook.cover_image} alt="Preview" className="ml-auto w-12 h-16 object-cover rounded-lg shadow" />
                      )}
                    </label>
                    <input id="b-img" type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" required />
                  </div>

                  {addError   && <p className="md:col-span-2 font-sans text-sm text-wine-600 dark:text-wine-400">{addError}</p>}
                  {addSuccess && <p className="md:col-span-2 font-sans text-sm text-green-600 dark:text-green-400">{addSuccess}</p>}

                  <div className="md:col-span-2 flex justify-end">
                    <Button type="submit" variant="primary" disabled={imgUploading || !newBook.cover_image}>
                      Publish Book
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Books grid */}
          {books.length === 0 ? (
            <div className="bg-parchment-50 dark:bg-navy-800 rounded-2xl border border-parchment-300 dark:border-navy-600 p-12 text-center">
              <FaBook className="w-10 h-10 text-parchment-400 dark:text-navy-500 mx-auto mb-3" />
              <p className="font-serif text-lg text-parchment-700 dark:text-parchment-300">No books published yet</p>
              <p className="font-sans text-sm text-toffee-500 dark:text-toffee-500 mt-1">Click "Add Book" to publish your first one.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {books.map((book, i) => (
                <motion.div
                  key={book._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="relative group"
                >
                  <BookCard book={book} small />
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="absolute top-2 left-2 z-20 p-1.5 bg-parchment-50/90 dark:bg-navy-800/90 backdrop-blur-sm rounded-lg text-toffee-400 hover:bg-wine-600 hover:text-white dark:hover:bg-wine-600 shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
                    title="Delete Book"
                  >
                    <FaTrash className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Orders section */}
        <section>
          <div className="mb-6">
            <p className="section-subheading mb-1">Sales</p>
            <h2 className="font-serif text-3xl font-bold text-parchment-900 dark:text-parchment-100">Orders for Your Books</h2>
          </div>

          {ordersLoading ? (
            <div className="flex items-center gap-3 p-8">
              <div className="w-6 h-6 border-2 border-wine-600 border-t-transparent rounded-full animate-spin" />
              <p className="font-sans text-sm text-toffee-600 dark:text-toffee-400">Loading orders…</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-parchment-50 dark:bg-navy-800 rounded-2xl border border-parchment-300 dark:border-navy-600 p-12 text-center">
              <FaShoppingBag className="w-10 h-10 text-parchment-400 dark:text-navy-500 mx-auto mb-3" />
              <p className="font-serif text-lg text-parchment-700 dark:text-parchment-300">No orders yet</p>
            </div>
          ) : (
            <div className="bg-parchment-50 dark:bg-navy-800 rounded-2xl border border-parchment-300 dark:border-navy-600 shadow-card overflow-hidden">
              {/* Table header */}
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-3 bg-parchment-200 dark:bg-navy-700 border-b border-parchment-300 dark:border-navy-600">
                {["Book", "Ordered By", "Date", "Status"].map((h) => (
                  <p key={h} className="font-sans text-xs font-semibold text-toffee-600 dark:text-toffee-400 uppercase tracking-widest" style={{ letterSpacing: "0.1em" }}>{h}</p>
                ))}
              </div>
              <div className="divide-y divide-parchment-200 dark:divide-navy-600">
                {orders.map((order, i) => {
                  const { icon: StatusIcon, color, bg, border } = getStatus(order.status);
                  return (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-3 md:gap-4 px-6 py-4 hover:bg-parchment-100 dark:hover:bg-navy-700/50 transition-colors duration-200"
                    >
                      <div className="font-serif font-semibold text-sm text-parchment-900 dark:text-parchment-100">
                        {order.book?.title}
                      </div>
                      <div>
                        <p className="font-sans text-sm text-parchment-800 dark:text-parchment-200">{order.user?.username}</p>
                        <p className="font-sans text-xs text-toffee-500 dark:text-toffee-500">{order.user?.email}</p>
                      </div>
                      <p className="font-sans text-xs text-toffee-600 dark:text-toffee-400 self-center">
                        {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                      <span className={`self-center inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-sans font-semibold ${bg} ${color} ${border} border w-fit`}>
                        <StatusIcon className="w-3 h-3" />
                        {order.status}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default AuthorProfile;
