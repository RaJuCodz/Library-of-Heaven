import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaArrowLeft,
    FaStar,
    FaShare,
    FaHeart,
    FaCoins,
    FaListUl,
    FaLock,
    FaUnlock
} from "react-icons/fa";
import Button from "./ui/Button";
import { toast } from "react-toastify";

const ViewBook = () => {
    const { book_id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [unlockedChapters, setUnlockedChapters] = useState([]);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [walletBalance, setWalletBalance] = useState(0);
    const [pendingUnlock, setPendingUnlock] = useState(null); // { chapter, price }
    const [unlocking, setUnlocking] = useState(false);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");

    useEffect(() => {
        fetchNovelDetails();
    }, [book_id]);

    const fetchNovelDetails = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/get_novel_by_id/${book_id}`);
            setBook(res.data.data);

            const chapRes = await axios.get(`${import.meta.env.VITE_API_URL}/get_chapters/${book_id}`);
            setChapters(chapRes.data.data);

            if (token && userId) {
                try {
                    const [libRes, unlockRes, walletRes] = await Promise.all([
                        axios.get(`${import.meta.env.VITE_API_URL}/get_library`, { headers: { id: userId, Authorization: `Bearer ${token}` } }),
                        axios.get(`${import.meta.env.VITE_API_URL}/get_unlocked_chapters/${book_id}`, { headers: { id: userId, Authorization: `Bearer ${token}` } }),
                        axios.get(`${import.meta.env.VITE_API_URL}/get_wallet`, { headers: { id: userId, Authorization: `Bearer ${token}` } }),
                    ]);
                    setIsFavorite(libRes.data.data.some(b => b._id === book_id));
                    setUnlockedChapters(unlockRes.data.data || []);
                    setWalletBalance(walletRes.data.data?.balance ?? 0);
                } catch (e) { console.error(e); }
            }
        } catch (error) {
            console.error("Error fetching novel details:", error);
            toast.error("Failed to fetch novel details");
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async () => {
        if (!token) { toast.info("Please login to add to library"); return; }
        try {
            const headers = { id: userId, Authorization: `Bearer ${token}`, book_id };
            if (isFavorite) {
                await axios.delete(`${import.meta.env.VITE_API_URL}/remove_from_library`, { headers });
                setIsFavorite(false); toast.success("Removed from Library");
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/add_to_library`, {}, { headers });
                setIsFavorite(true); toast.success("Added to Library");
            }
        } catch { toast.error("Failed to update library"); }
    };

    /* Show confirm modal before unlocking */
    const handleChapterClick = (chap, isUnlocked) => {
        if (isUnlocked) {
            navigate(`/read/${book_id}/${chap._id}`);
        } else {
            if (!token) { toast.info("Please login to unlock chapters"); navigate("/login"); return; }
            const price = chap.price ?? book.chapterPrice ?? 5;
            setPendingUnlock({ chapter: chap, price });
        }
    };

    const confirmUnlock = async () => {
        if (!pendingUnlock) return;
        setUnlocking(true);
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/unlock_chapter/${pendingUnlock.chapter._id}`,
                {},
                { headers: { id: userId, Authorization: `Bearer ${token}` } }
            );
            toast.success("Chapter unlocked!");
            setUnlockedChapters(prev => [...prev, pendingUnlock.chapter._id]);
            setWalletBalance(b => b - pendingUnlock.price);
            const chapterId = pendingUnlock.chapter._id;
            setPendingUnlock(null);
            navigate(`/read/${book_id}/${chapterId}`);
        } catch (err) {
            if (err.response?.status === 402) {
                toast.error("Insufficient tokens!");
            } else {
                toast.error(err.response?.data?.message || "Failed to unlock");
            }
            setPendingUnlock(null);
        } finally {
            setUnlocking(false);
        }
    };

    if (loading || !book) {
        return (
            <div className="min-h-screen bg-parchment-200 dark:bg-navy-900 flex items-center justify-center pt-24 transition-colors duration-300">
                <div className="w-16 h-16 border-4 border-wine-600 dark:border-wine-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-parchment-200 dark:bg-navy-900 pt-24 pb-16 transition-colors duration-300">

            {/* Unlock confirmation modal */}
            <AnimatePresence>
                {pendingUnlock && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/70 backdrop-blur-sm"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setPendingUnlock(null)}
                    >
                        <motion.div
                            className="bg-parchment-50 dark:bg-navy-800 rounded-2xl border border-parchment-300 dark:border-navy-600 shadow-glass max-w-sm w-full p-6"
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-4">
                                <FaLock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-center text-parchment-900 dark:text-parchment-100 mb-1">Unlock Chapter</h3>
                            <p className="font-sans text-sm text-toffee-600 dark:text-toffee-400 text-center mb-5">
                                Ch. {pendingUnlock.chapter.chapterNumber}: <span className="font-semibold">{pendingUnlock.chapter.title}</span>
                            </p>
                            <div className="bg-parchment-100 dark:bg-navy-700 rounded-xl p-4 mb-5 space-y-2">
                                <div className="flex justify-between font-sans text-sm">
                                    <span className="text-toffee-600 dark:text-toffee-400">Cost</span>
                                    <span className="font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1.5"><FaCoins className="w-3.5 h-3.5" />{pendingUnlock.price} tokens</span>
                                </div>
                                <div className="flex justify-between font-sans text-sm">
                                    <span className="text-toffee-600 dark:text-toffee-400">Your balance</span>
                                    <span className={`font-bold flex items-center gap-1.5 ${walletBalance >= pendingUnlock.price ? 'text-green-600 dark:text-green-400' : 'text-wine-600 dark:text-wine-400'}`}>
                                        <FaCoins className="w-3.5 h-3.5" />{walletBalance} tokens
                                    </span>
                                </div>
                                {walletBalance < pendingUnlock.price && (
                                    <p className="text-xs font-sans text-wine-600 dark:text-wine-400 text-center pt-2 border-t border-parchment-300 dark:border-navy-500 font-semibold">
                                        You need {pendingUnlock.price - walletBalance} more tokens
                                    </p>
                                )}
                            </div>
                            {walletBalance >= pendingUnlock.price ? (
                                <div className="flex gap-3">
                                    <button onClick={() => setPendingUnlock(null)} className="flex-1 py-2.5 rounded-xl border border-parchment-400 dark:border-navy-500 font-sans text-sm font-semibold text-toffee-700 dark:text-parchment-300">Cancel</button>
                                    <button onClick={confirmUnlock} disabled={unlocking} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-wine-600 hover:bg-wine-700 disabled:bg-wine-400 text-parchment-50 font-sans font-semibold text-sm">
                                        {unlocking ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><FaCoins className="w-3.5 h-3.5" /> Spend &amp; Read</>}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <button onClick={() => setPendingUnlock(null)} className="flex-1 py-2.5 rounded-xl border border-parchment-400 dark:border-navy-500 font-sans text-sm font-semibold text-toffee-700 dark:text-parchment-300">Cancel</button>
                                    <Link to="/wallet" className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-wine-600 hover:bg-wine-700 text-parchment-50 font-sans font-semibold text-sm">Buy Tokens</Link>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Back Button */}
                <Link to="/books" className="inline-flex items-center mb-8 text-toffee-700 dark:text-toffee-300 hover:text-wine-600 dark:hover:text-wine-400 transition-all font-sans">
                    <FaArrowLeft className="mr-2" /> Back to Library
                </Link>

                {/* Hero Section */}
                <div className="bg-parchment-50 dark:bg-navy-800 rounded-3xl shadow-card dark:shadow-card-dark border border-parchment-300 dark:border-navy-600 overflow-hidden mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-10">

                        {/* Cover Image */}
                        <div className="md:col-span-4 lg:col-span-3">
                            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-lg border border-transparent dark:border-navy-700">
                                <img
                                    src={book.cover_image}
                                    alt={book.title}
                                    className={`w-full h-full object-cover transition-opacity duration-700 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
                                    onLoad={() => setIsImageLoaded(true)}
                                />
                            </div>
                        </div>

                        {/* Novel Info */}
                        <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-between">
                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className={`px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full ${book.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                        {book.status || 'Ongoing'}
                                    </span>
                                    {(book.genres || []).slice(0, 3).map(g => (
                                        <span key={g} className="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full bg-wine-50 text-wine-700 dark:bg-wine-900/30 dark:text-wine-400">
                                            {g}
                                        </span>
                                    ))}
                                </div>

                                <h1 className="text-4xl md:text-5xl font-serif font-bold text-parchment-900 dark:text-parchment-50 mb-2 leading-tight">
                                    {book.title}
                                </h1>

                                <p className="text-lg text-toffee-700 dark:text-toffee-300 font-sans mb-4">
                                    Author: <span className="font-semibold text-wine-600 dark:text-wine-400">{book.author}</span>
                                </p>

                                {/* Stats row */}
                                <div className="flex flex-wrap items-center gap-6 mb-8 text-parchment-800 dark:text-parchment-200">
                                    <div className="flex items-center gap-1.5">
                                        <FaListUl className="text-toffee-500" />
                                        <span className="font-semibold">{book.totalChapters || chapters.length}</span>
                                        <span className="text-sm text-toffee-600 dark:text-toffee-400">Chapters</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <FaStar className="text-yellow-500" />
                                        <span className="font-semibold">{book.rating || "New"}</span>
                                        <span className="text-sm text-toffee-600 dark:text-toffee-400">Rating</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <FaCoins className="text-orange-500" />
                                        <span className="font-semibold">{book.chapterPrice}</span>
                                        <span className="text-sm text-toffee-600 dark:text-toffee-400">Tokens / Chapter</span>
                                    </div>
                                </div>

                                <div className="prose prose-sm dark:prose-invert prose-p:text-toffee-800 dark:prose-p:text-parchment-300 max-w-none mb-8 line-clamp-4">
                                    <p>{book.synopsis || book.description}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4 mt-auto">
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        const firstChapter = chapters[0];
                                        if (firstChapter) {
                                            navigate(`/read/${book_id}/${firstChapter._id}`);
                                        } else {
                                            toast.info("No chapters available yet.");
                                        }
                                    }}
                                    className="px-8"
                                >
                                    Start Reading
                                </Button>

                                <button
                                    onClick={toggleFavorite}
                                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-300 ${isFavorite
                                        ? 'border-wine-500 bg-wine-50 text-wine-700 dark:bg-wine-900/20 dark:text-wine-400'
                                        : 'border-parchment-300 dark:border-navy-600 text-toffee-700 dark:text-toffee-300 hover:border-wine-400'
                                        }`}
                                >
                                    <FaHeart className={isFavorite ? "text-wine-600 dark:text-wine-500" : ""} />
                                    {isFavorite ? 'In Library' : 'Add to Library'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chapters List */}
                <div className="bg-parchment-50 dark:bg-navy-800 rounded-3xl shadow-card dark:shadow-card-dark border border-parchment-300 dark:border-navy-600 p-6 md:p-10 mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-serif font-bold text-parchment-900 dark:text-parchment-50">Chapters</h2>
                        <span className="text-toffee-600 dark:text-toffee-400 font-sans">{chapters.length} total</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {chapters.length === 0 ? (
                            <p className="col-span-full text-center py-8 text-toffee-600">No chapters published yet.</p>
                        ) : (
                            chapters.map((chap) => {
                                const isFree = chap.isFree;
                                const isUnlocked = isFree || unlockedChapters.includes(chap._id) || (book.authorId === userId);

                                return (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: chapters.indexOf(chap) * 0.03 }}
                                        key={chap._id}
                                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isUnlocked
                                            ? 'bg-parchment-100 dark:bg-navy-700 border-parchment-300 dark:border-navy-600 cursor-pointer hover:border-wine-400 hover:shadow-sm'
                                            : 'bg-parchment-200/50 dark:bg-navy-900/50 border-transparent cursor-pointer hover:border-wine-300'
                                            }`}
                                        onClick={() => handleChapterClick(chap, isUnlocked)}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <span className="font-serif font-bold text-wine-700 dark:text-wine-400 shrink-0">
                                                {chap.chapterNumber}
                                            </span>
                                            <p className="font-sans font-medium text-parchment-900 dark:text-parchment-100 truncate">
                                                {chap.title}
                                            </p>
                                        </div>

                                        <div className="shrink-0 flex items-center ml-2">
                                            {isFree ? (
                                                <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2.5 py-1 rounded-md">FREE</span>
                                            ) : isUnlocked ? (
                                                <div className="flex items-center gap-1.5 text-wine-600 dark:text-wine-400 bg-wine-50 dark:bg-wine-900/20 px-2.5 py-1 rounded-md">
                                                    <FaUnlock className="w-3 h-3" />
                                                    <span className="text-xs font-bold tracking-wide">OPEN</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2.5 py-1 rounded-md">
                                                    <FaLock className="w-3 h-3" />
                                                    <span className="text-xs font-bold">{book.chapterPrice}</span>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ViewBook;
