import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBook,
  FaPlus,
  FaTimes,
  FaTrash,
  FaPenFancy,
  FaUpload,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowLeft,
  FaBookOpen,
  FaLayerGroup,
  FaEye,
  FaEyeSlash,
  FaEdit,
  FaList,
} from "react-icons/fa";
import PasswordConfirmModal from "../components/PasswordConfirmModal";

const API = import.meta.env.VITE_API_URL;

const authHeaders = () => ({
  id: localStorage.getItem("id"),
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

/* ─── helpers ─── */
const Input = ({ label, ...props }) => (
  <div>
    <label className="field-label">{label}</label>
    <input className="input-field" {...props} />
  </div>
);

const Alert = ({ type, msg }) =>
  msg ? (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-2 p-3 rounded-xl text-sm font-sans ${
        type === "error"
          ? "bg-wine-50 dark:bg-wine-900/20 border border-wine-200 dark:border-wine-700 text-wine-700 dark:text-wine-300"
          : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300"
      }`}
    >
      {type === "error" ? (
        <FaExclamationCircle className="shrink-0" />
      ) : (
        <FaCheckCircle className="shrink-0" />
      )}
      {msg}
    </motion.div>
  ) : null;

const BackBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 mb-6 font-sans text-sm text-toffee-600 dark:text-toffee-400 hover:text-wine-600 dark:hover:text-wine-400 transition-colors"
  >
    <FaArrowLeft className="w-3.5 h-3.5" /> Back to My Novels
  </button>
);

/* ═══════════════ VIEW 1 — Novel Grid ═══════════════ */
const NovelGrid = ({
  novels,
  loading,
  onAdd,
  onAddChapter,
  onManage,
  onDelete,
}) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <div>
        <p className="section-subheading mb-1">Your Catalogue</p>
        <h2 className="font-serif text-3xl font-bold text-parchment-900 dark:text-parchment-100">
          My Novels
        </h2>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-wine-600 hover:bg-wine-700 text-parchment-50 font-sans font-semibold text-sm shadow-md transition-all hover:scale-[1.02]"
      >
        <FaPlus className="w-3.5 h-3.5" /> Publish Novel
      </button>
    </div>

    {loading ? (
      <div className="flex justify-center py-20">
        <span className="w-10 h-10 border-2 border-wine-600 border-t-transparent rounded-full animate-spin" />
      </div>
    ) : novels.length === 0 ? (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-parchment-50 dark:bg-navy-800 border border-parchment-300 dark:border-navy-600 rounded-2xl p-16 text-center"
      >
        <FaBook className="w-12 h-12 text-parchment-400 mx-auto mb-4" />
        <h3 className="font-serif text-xl text-parchment-800 dark:text-parchment-200 mb-2">
          No novels yet
        </h3>
        <p className="font-sans text-sm text-toffee-500 dark:text-toffee-400 mb-6">
          Start your first story and share it with the world.
        </p>
        <button
          onClick={onAdd}
          className="px-5 py-2.5 rounded-xl bg-wine-600 hover:bg-wine-700 text-parchment-50 font-sans font-semibold text-sm shadow-md"
        >
          Publish Your First Novel
        </button>
      </motion.div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {novels.map((novel, i) => (
          <motion.div
            key={novel._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-parchment-50 dark:bg-navy-800 rounded-2xl border border-parchment-300 dark:border-navy-600 shadow-card overflow-hidden group hover:shadow-lg transition-shadow"
          >
            {/* Cover */}
            <div className="relative h-44 overflow-hidden bg-parchment-200 dark:bg-navy-700">
              {novel.cover_image ? (
                <img
                  src={novel.cover_image}
                  alt={novel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaBook className="w-10 h-10 text-parchment-400" />
                </div>
              )}
              {/* Delete overlay */}
              <button
                onClick={() => onDelete(novel._id)}
                title="Delete"
                className="absolute top-2 right-2 p-2 rounded-lg bg-parchment-50/90 dark:bg-navy-800/90 text-toffee-400 hover:bg-wine-600 hover:text-white shadow-sm transition-all opacity-0 group-hover:opacity-100"
              >
                <FaTrash className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4">
              <h3 className="font-serif font-bold text-parchment-900 dark:text-parchment-100 text-sm leading-snug line-clamp-2 mb-1">
                {novel.title}
              </h3>
              <p className="font-sans text-xs text-toffee-500 dark:text-toffee-400 mb-3 line-clamp-2">
                {novel.synopsis}
              </p>
              <div className="flex items-center gap-3 text-xs font-sans text-toffee-600 dark:text-toffee-400 mb-3">
                <span className="flex items-center gap-1">
                  <FaLayerGroup className="w-3 h-3" />
                  {novel.totalChapters} published
                </span>
                <span className="ml-auto px-2 py-0.5 rounded-full bg-wine-100 dark:bg-wine-900/30 text-wine-700 dark:text-wine-400 font-semibold">
                  {novel.chapterPrice} 🪙
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="px-4 pb-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => onAddChapter(novel)}
                className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-wine-600 hover:bg-wine-700 text-parchment-50 text-xs font-semibold transition-all"
              >
                <FaPlus className="w-3 h-3" /> Add Chapter
              </button>
              <button
                onClick={() => onManage(novel)}
                className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-parchment-400 dark:border-navy-500 text-toffee-700 dark:text-parchment-300 hover:border-wine-500 hover:text-wine-600 text-xs font-semibold transition-all"
              >
                <FaList className="w-3 h-3" /> Manage
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);

/* ═══════════════ VIEW 2 — Create Novel ═══════════════ */
const EMPTY_BOOK = {
  title: "",
  synopsis: "",
  genres: "",
  tags: "",
  chapterPrice: 5,
  cover_image: "",
};

const CreateNovel = ({ authorName, onBack, onCreated }) => {
  const [form, setForm] = useState(EMPTY_BOOK);
  const [imgUploading, setImgUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await axios.post(`${API}/upload_image`, fd, {
        headers: { ...authHeaders(), "Content-Type": "multipart/form-data" },
      });
      set("cover_image", res.data.imageUrl);
    } catch {
      setError("Image upload failed.");
    } finally {
      setImgUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.cover_image) {
      setError("Please upload a cover image.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        ...form,
        author: authorName,
        genres: form.genres
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean),
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };
      const res = await axios.post(`${API}/add_novel`, payload, {
        headers: authHeaders(),
      });
      setSuccess("Novel published! Redirecting…");
      setTimeout(() => onCreated(res.data.novel), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BackBtn onClick={onBack} />
      <div className="mb-8">
        <p className="section-subheading mb-1">Step 1 of 2</p>
        <h2 className="font-serif text-3xl font-bold text-parchment-900 dark:text-parchment-100">
          Publish a New Novel
        </h2>
        <p className="font-sans text-sm text-toffee-500 mt-1">
          Fill in details. You'll add chapters after creating it.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-parchment-50 dark:bg-navy-800 rounded-2xl border border-parchment-300 dark:border-navy-600 shadow-card p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl"
      >
        <Input
          label="Novel Title *"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="The Legend of…"
          required
        />
        <Input
          label="Tokens per Paid Chapter *"
          type="number"
          min="1"
          value={form.chapterPrice}
          onChange={(e) => set("chapterPrice", e.target.value)}
          required
        />
        <Input
          label="Genres (comma separated)"
          value={form.genres}
          onChange={(e) => set("genres", e.target.value)}
          placeholder="Fantasy, Action"
        />
        <Input
          label="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => set("tags", e.target.value)}
          placeholder="OP MC, System"
        />
        <div className="md:col-span-2">
          <label className="field-label">Synopsis *</label>
          <textarea
            className="input-field resize-none"
            value={form.synopsis}
            onChange={(e) => set("synopsis", e.target.value)}
            rows={4}
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="field-label">Cover Image *</label>
          <label
            htmlFor="cover-img"
            className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed cursor-pointer border-parchment-400 hover:border-wine-500 dark:border-navy-500 bg-parchment-100 dark:bg-navy-700"
          >
            {imgUploading ? (
              <span className="w-5 h-5 border-2 border-wine-600 border-t-transparent rounded-full animate-spin shrink-0" />
            ) : (
              <FaUpload className="w-5 h-5 text-toffee-500 shrink-0" />
            )}
            <span className="font-sans text-sm text-toffee-600">
              {imgUploading
                ? "Uploading…"
                : form.cover_image
                  ? "Cover uploaded ✓"
                  : "Click to upload"}
            </span>
            {form.cover_image && !imgUploading && (
              <img
                src={form.cover_image}
                alt=""
                className="ml-auto w-12 h-16 object-cover rounded-lg"
              />
            )}
          </label>
          <input
            id="cover-img"
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="sr-only"
          />
        </div>
        <div className="md:col-span-2 space-y-3">
          <Alert type="error" msg={error} />
          <Alert type="success" msg={success} />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || imgUploading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-wine-600 hover:bg-wine-700 disabled:bg-wine-400 text-parchment-50 font-sans font-semibold text-sm"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <FaBookOpen className="w-4 h-4" />{" "}
              {loading ? "Publishing…" : "Publish Novel"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

/* ═══════════════ VIEW 3 — Upload Chapter ═══════════════ */
const EMPTY_CH = {
  chapterNumber: "",
  title: "",
  content: "",
  isFree: false,
  price: "",
  isPublished: false,
};

const UploadChapter = ({ novel, onBack, onAdded }) => {
  const [form, setForm] = useState(EMPTY_CH);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleTxt = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    new FileReader().onload = (ev) => set("content", ev.target.result);
    const fr = new FileReader();
    fr.onload = (ev) => set("content", ev.target.result);
    fr.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const payload = { ...form };
      if (payload.price === "") delete payload.price;
      await axios.post(`${API}/add_chapter/${novel._id}`, payload, {
        headers: authHeaders(),
      });
      setSuccess(
        `Chapter ${form.chapterNumber} ${form.isPublished ? "published" : "saved as draft"}!`,
      );
      setForm(EMPTY_CH);
      onAdded?.();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add chapter.");
    } finally {
      setLoading(false);
    }
  };

  const Toggle = ({ label, checked, onChange, color = "wine" }) => (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        onClick={onChange}
        className={`w-10 h-6 rounded-full relative transition-colors ${checked ? (color === "green" ? "bg-green-600" : "bg-wine-600") : "bg-parchment-400 dark:bg-navy-500"}`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-1"}`}
        />
      </div>
      <span className="font-sans text-sm font-medium text-parchment-800 dark:text-parchment-200">
        {label}
      </span>
    </label>
  );

  return (
    <div>
      <BackBtn onClick={onBack} />
      <div className="mb-8">
        <p className="section-subheading mb-1">Add Chapter</p>
        <h2 className="font-serif text-3xl font-bold text-parchment-900 dark:text-parchment-100">
          {novel.title}
        </h2>
        <p className="font-sans text-sm text-toffee-500 mt-1">
          Default price:{" "}
          <span className="font-semibold text-wine-600">
            {novel.chapterPrice} 🪙
          </span>{" "}
          · First {novel.freeChapters} chapters free
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-parchment-50 dark:bg-navy-800 rounded-2xl border border-parchment-300 dark:border-navy-600 shadow-card p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl"
      >
        <Input
          label="Chapter Number *"
          type="number"
          min="1"
          value={form.chapterNumber}
          onChange={(e) => set("chapterNumber", e.target.value)}
          required
        />
        <Input
          label="Chapter Title *"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="The Beginning…"
          required
        />
        <div className="md:col-span-2 p-5 rounded-xl bg-parchment-100 dark:bg-navy-700 border border-parchment-300 dark:border-navy-600 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="field-label">Custom Price Override</label>
            <input
              type="number"
              min="1"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              disabled={form.isFree}
              placeholder={
                form.isFree ? "Free chapter" : `Default: ${novel.chapterPrice}`
              }
              className="input-field"
            />
            <p className="font-sans text-xs text-toffee-500 mt-1">
              Leave empty for default
            </p>
          </div>
          <div className="flex flex-col justify-center gap-4">
            <Toggle
              label="Mark as Free Chapter"
              checked={form.isFree}
              onChange={() => set("isFree", !form.isFree)}
            />
            <Toggle
              label="Publish Immediately"
              checked={form.isPublished}
              onChange={() => set("isPublished", !form.isPublished)}
              color="green"
            />
          </div>
        </div>
        {!form.isPublished && (
          <div className="md:col-span-2 flex items-start gap-3 p-3 rounded-xl bg-toffee-50 dark:bg-navy-700 border border-toffee-200 dark:border-navy-500">
            <FaEyeSlash className="w-4 h-4 text-toffee-500 shrink-0 mt-0.5" />
            <p className="font-sans text-xs text-toffee-600 dark:text-toffee-400">
              <span className="font-semibold">Saving as draft.</span> Not
              visible to readers until published via Manage Chapters.
            </p>
          </div>
        )}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="field-label mb-0">Chapter Content *</label>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-wine-600 cursor-pointer hover:underline">
              <FaUpload className="w-3 h-3" /> Upload .txt
              <input
                type="file"
                accept=".txt"
                onChange={handleTxt}
                className="hidden"
              />
            </label>
          </div>
          <textarea
            className="input-field resize-none font-serif text-sm leading-relaxed"
            rows={12}
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            placeholder="Write or paste chapter content…"
            required
          />
        </div>
        <div className="md:col-span-2 space-y-3">
          <Alert type="error" msg={error} />
          <Alert type="success" msg={success} />
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2.5 rounded-xl border border-parchment-400 dark:border-navy-500 font-sans text-sm text-toffee-700 dark:text-parchment-300"
            >
              Done
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-wine-600 hover:bg-wine-700 disabled:bg-wine-400 text-parchment-50 font-sans font-semibold text-sm"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <FaPenFancy className="w-4 h-4" />{" "}
              {loading
                ? "Saving…"
                : form.isPublished
                  ? "Publish Chapter"
                  : "Save as Draft"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

/* ═══════════════ VIEW 4 — Manage Chapters ═══════════════ */
const ManageChapters = ({ novel, onBack, onAddNew }) => {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toggling, setToggling] = useState(null);
  const [chPwModal, setChPwModal] = useState({ open: false, pendingId: null });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API}/get_author_chapters/${novel._id}`, {
        headers: authHeaders(),
      });
      setChapters(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load chapters.");
    } finally {
      setLoading(false);
    }
  }, [novel._id]);

  useEffect(() => {
    load();
  }, [load]);

  const openDeleteChapter = (chapterId) => {
    setChPwModal({ open: true, pendingId: chapterId });
  };

  const confirmDeleteChapter = async () => {
    const chapterId = chPwModal.pendingId;
    setChPwModal({ open: false, pendingId: null });
    try {
      await axios.delete(`${API}/delete_chapter/${chapterId}`, {
        headers: authHeaders(),
      });
      setChapters((prev) => prev.filter((c) => c._id !== chapterId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete chapter.");
    }
  };

  const togglePublish = async (ch) => {
    setToggling(ch._id);
    try {
      await axios.put(
        `${API}/update_chapter/${ch._id}`,
        { isPublished: !ch.isPublished },
        { headers: authHeaders() },
      );
      setChapters((prev) =>
        prev.map((c) =>
          c._id === ch._id ? { ...c, isPublished: !c.isPublished } : c,
        ),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Update failed.");
    } finally {
      setToggling(null);
    }
  };

  const publishedCount = chapters.filter((c) => c.isPublished).length;
  const draftCount = chapters.length - publishedCount;

  return (
    <>
      <div>
        <BackBtn onClick={onBack} />
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <p className="section-subheading mb-1">Chapter Management</p>
            <h2 className="font-serif text-3xl font-bold text-parchment-900 dark:text-parchment-100">
              {novel.title}
            </h2>
            <div className="flex gap-4 mt-2 font-sans text-sm">
              <span className="flex items-center gap-1.5 text-green-700 dark:text-green-400">
                <FaEye className="w-3.5 h-3.5" /> {publishedCount} published
              </span>
              <span className="flex items-center gap-1.5 text-toffee-500">
                <FaEyeSlash className="w-3.5 h-3.5" /> {draftCount} draft
                {draftCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <button
            onClick={onAddNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-wine-600 hover:bg-wine-700 text-parchment-50 font-sans font-semibold text-sm shadow-md"
          >
            <FaPlus className="w-3.5 h-3.5" /> Add New Chapter
          </button>
        </div>
        <Alert type="error" msg={error} />
        {loading ? (
          <div className="flex justify-center py-16">
            <span className="w-8 h-8 border-2 border-wine-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : chapters.length === 0 ? (
          <div className="bg-parchment-50 dark:bg-navy-800 border border-parchment-300 dark:border-navy-600 rounded-2xl p-12 text-center">
            <FaBook className="w-10 h-10 text-parchment-400 mx-auto mb-3" />
            <p className="font-serif text-lg mb-4">No chapters yet</p>
            <button
              onClick={onAddNew}
              className="px-5 py-2.5 rounded-xl bg-wine-600 text-parchment-50 font-sans font-semibold text-sm"
            >
              Add First Chapter
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {chapters.map((ch, i) => (
              <motion.div
                key={ch._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  ch.isPublished
                    ? "bg-parchment-50 dark:bg-navy-800 border-parchment-300 dark:border-navy-600"
                    : "bg-parchment-100 dark:bg-navy-700 border-dashed border-parchment-400 dark:border-navy-500"
                }`}
              >
                {/* Number badge */}
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-bold font-sans text-sm ${ch.isPublished ? "bg-wine-100 dark:bg-wine-900/30 text-wine-700 dark:text-wine-400" : "bg-parchment-300 dark:bg-navy-600 text-toffee-500"}`}
                >
                  {ch.chapterNumber}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-semibold text-sm text-parchment-900 dark:text-parchment-100 truncate">
                    {ch.title}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs font-sans">
                    <span
                      className={
                        ch.isPublished
                          ? "text-green-600 dark:text-green-400 flex items-center gap-1"
                          : "text-toffee-500 flex items-center gap-1"
                      }
                    >
                      {ch.isPublished ? (
                        <FaEye className="w-3 h-3" />
                      ) : (
                        <FaEyeSlash className="w-3 h-3" />
                      )}
                      {ch.isPublished ? "Published" : "Draft"}
                    </span>
                    {ch.isFree ? (
                      <span className="text-green-600 dark:text-green-400">
                        Free
                      </span>
                    ) : (
                      <span className="text-toffee-500">
                        {ch.price ?? novel.chapterPrice} 🪙
                      </span>
                    )}
                    {ch.isPublished && ch.viewCount > 0 && (
                      <span className="text-toffee-400">
                        {ch.viewCount} views
                      </span>
                    )}
                  </div>
                </div>
                {/* Toggle publish button */}
                <button
                  onClick={() => togglePublish(ch)}
                  disabled={toggling === ch._id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold font-sans transition-all shrink-0 ${
                    ch.isPublished
                      ? "bg-parchment-200 dark:bg-navy-600 text-toffee-700 dark:text-parchment-300 hover:bg-wine-100 hover:text-wine-700"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {toggling === ch._id ? (
                    <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : ch.isPublished ? (
                    <>
                      <FaEyeSlash className="w-3.5 h-3.5" /> Unpublish
                    </>
                  ) : (
                    <>
                      <FaEye className="w-3.5 h-3.5" /> Publish
                    </>
                  )}
                </button>
                {/* Delete chapter button */}
                <button
                  onClick={() => openDeleteChapter(ch._id)}
                  title="Delete chapter"
                  className="p-2 rounded-lg text-toffee-400 hover:bg-wine-100 dark:hover:bg-wine-900/30 hover:text-wine-600 dark:hover:text-wine-400 transition-colors shrink-0"
                >
                  <FaTrash className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Password confirmation modal for chapter deletion */}
      <PasswordConfirmModal
        isOpen={chPwModal.open}
        onClose={() => setChPwModal({ open: false, pendingId: null })}
        onConfirmed={confirmDeleteChapter}
        title="Delete Chapter"
        description="Enter your password to permanently delete this chapter."
        actionLabel="Delete Chapter"
        danger
      />
    </>
  );
};

/* ═══════════════ ROOT — Author Dashboard ═══════════════ */
const AuthorProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [novels, setNovels] = useState([]);
  const [novelsLoading, setNovelsLoading] = useState(true);
  const [view, setView] = useState("list"); // "list" | "create" | "chapter" | "manage"
  const [selectedNovel, setSelectedNovel] = useState(null);
  const [initError, setInitError] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "author" && role !== "admin") {
      navigate("/profile");
      return;
    }
    loadProfile();
    loadNovels();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await axios.get(`${API}/get_user_info`, {
        headers: authHeaders(),
      });
      setProfile(res.data);
    } catch {
      setInitError("Could not load your profile.");
    }
  };

  const loadNovels = useCallback(async () => {
    setNovelsLoading(true);
    try {
      const res = await axios.get(`${API}/get_author_novels`, {
        headers: authHeaders(),
      });
      setNovels(res.data.data || []);
    } catch (err) {
      setInitError(err.response?.data?.message || "Failed to load novels.");
    } finally {
      setNovelsLoading(false);
    }
  }, []);

  const [novelPwModal, setNovelPwModal] = useState({
    open: false,
    pendingId: null,
  });

  const handleDelete = (novelId) => {
    setNovelPwModal({ open: true, pendingId: novelId });
  };

  const confirmDeleteNovel = async () => {
    const novelId = novelPwModal.pendingId;
    setNovelPwModal({ open: false, pendingId: null });
    try {
      await axios.delete(`${API}/delete_novel`, {
        headers: { ...authHeaders(), novel_id: novelId },
      });
      setNovels((p) => p.filter((n) => n._id !== novelId));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  const goBack = () => {
    setSelectedNovel(null);
    setView("list");
    loadNovels();
  };

  if (initError)
    return (
      <div className="min-h-screen flex items-center justify-center text-wine-600 font-sans">
        {initError}
      </div>
    );
  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center gap-4">
        <span className="w-8 h-8 border-2 border-wine-600 border-t-transparent rounded-full animate-spin" />
        <p className="font-sans text-sm text-toffee-600">Loading…</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-parchment-200 dark:bg-navy-900 transition-colors duration-300">
      {/* Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-wine-900 via-wine-800 to-navy-900">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url('/images/library.jpg')",
            backgroundSize: "cover",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-10">
          <motion.div
            className="flex flex-col md:flex-row items-center md:items-end gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 rounded-2xl bg-parchment-50/20 backdrop-blur-sm border-2 border-parchment-100/30 flex items-center justify-center shadow-glass shrink-0">
              <FaPenFancy className="w-9 h-9 text-parchment-100" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="font-sans text-xs text-wine-200 uppercase tracking-widest mb-1">
                Author Dashboard
              </p>
              <h1 className="font-serif text-3xl font-bold text-parchment-50 mb-1">
                {profile.authorName || profile.username}
              </h1>
              <p className="font-sans text-sm text-wine-200">
                {novels.length} novel{novels.length !== 1 ? "s" : ""} published
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <AnimatePresence mode="wait">
          {view === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <NovelGrid
                novels={novels}
                loading={novelsLoading}
                onAdd={() => setView("create")}
                onAddChapter={(novel) => {
                  setSelectedNovel(novel);
                  setView("chapter");
                }}
                onManage={(novel) => {
                  setSelectedNovel(novel);
                  setView("manage");
                }}
                onDelete={handleDelete}
              />
            </motion.div>
          )}
          {view === "create" && (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
            >
              <CreateNovel
                authorName={profile.authorName || profile.username}
                onBack={goBack}
                onCreated={(newNovel) => {
                  setNovels((p) => [newNovel, ...p]);
                  setSelectedNovel(newNovel);
                  setView("chapter");
                }}
              />
            </motion.div>
          )}
          {view === "chapter" && selectedNovel && (
            <motion.div
              key="chapter"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
            >
              <UploadChapter
                novel={selectedNovel}
                onBack={goBack}
                onAdded={loadNovels}
              />
            </motion.div>
          )}
          {view === "manage" && selectedNovel && (
            <motion.div
              key="manage"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
            >
              <ManageChapters
                novel={selectedNovel}
                onBack={goBack}
                onAddNew={() => setView("chapter")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Password confirmation modal for novel deletion */}
      <PasswordConfirmModal
        isOpen={novelPwModal.open}
        onClose={() => setNovelPwModal({ open: false, pendingId: null })}
        onConfirmed={confirmDeleteNovel}
        title="Delete Novel"
        description="Enter your password to permanently delete this novel and all its chapters."
        actionLabel="Delete Novel"
        danger
      />
    </div>
  );
};

export default AuthorProfile;
