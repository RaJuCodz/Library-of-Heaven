import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaArrowRight, FaCheck, FaLock, FaCoins, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";

const API = import.meta.env.VITE_API_URL;

/* ─── Unlock Confirmation Modal ─── */
const UnlockModal = ({ chapter, price, walletBalance, onConfirm, onCancel, loading }) => {
    const hasEnough = walletBalance >= price;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onCancel}
            >
                <motion.div
                    className="bg-parchment-50 dark:bg-navy-800 rounded-2xl border border-parchment-300 dark:border-navy-600 shadow-glass max-w-sm w-full p-6"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-5">
                        <FaLock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>

                    <h3 className="font-serif text-xl font-bold text-parchment-900 dark:text-parchment-100 text-center mb-1">
                        Unlock Chapter
                    </h3>
                    <p className="font-sans text-sm text-toffee-600 dark:text-toffee-400 text-center mb-5">
                        Chapter {chapter?.chapterNumber}: <span className="font-semibold">{chapter?.title}</span>
                    </p>

                    {/* Cost / Balance */}
                    <div className="bg-parchment-100 dark:bg-navy-700 rounded-xl p-4 mb-5 space-y-2">
                        <div className="flex items-center justify-between font-sans text-sm">
                            <span className="text-toffee-600 dark:text-toffee-400">Unlock cost</span>
                            <span className="flex items-center gap-1.5 font-bold text-orange-600 dark:text-orange-400">
                                <FaCoins className="w-3.5 h-3.5" /> {price} tokens
                            </span>
                        </div>
                        <div className="flex items-center justify-between font-sans text-sm">
                            <span className="text-toffee-600 dark:text-toffee-400">Your balance</span>
                            <span className={`flex items-center gap-1.5 font-bold ${hasEnough ? "text-green-600 dark:text-green-400" : "text-wine-600 dark:text-wine-400"}`}>
                                <FaCoins className="w-3.5 h-3.5" /> {walletBalance} tokens
                            </span>
                        </div>
                        {!hasEnough && (
                            <div className="pt-2 border-t border-parchment-300 dark:border-navy-500">
                                <p className="font-sans text-xs text-wine-600 dark:text-wine-400 text-center font-semibold">
                                    You need {price - walletBalance} more tokens
                                </p>
                            </div>
                        )}
                    </div>

                    {hasEnough ? (
                        <div className="flex gap-3">
                            <button
                                onClick={onCancel}
                                className="flex-1 py-2.5 rounded-xl border border-parchment-400 dark:border-navy-500 font-sans text-sm font-semibold text-toffee-700 dark:text-parchment-300 hover:border-wine-400 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-wine-600 hover:bg-wine-700 disabled:bg-wine-400 text-parchment-50 font-sans font-semibold text-sm shadow-md transition-all"
                            >
                                {loading
                                    ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    : <><FaCoins className="w-3.5 h-3.5" /> Spend &amp; Read</>
                                }
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={onCancel}
                                className="flex-1 py-2.5 rounded-xl border border-parchment-400 dark:border-navy-500 font-sans text-sm font-semibold text-toffee-700 dark:text-parchment-300 transition-all"
                            >
                                Cancel
                            </button>
                            <Link
                                to="/wallet"
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-wine-600 hover:bg-wine-700 text-parchment-50 font-sans font-semibold text-sm shadow-md transition-all text-center"
                            >
                                Buy Tokens
                            </Link>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

/* ─── Main Reader ─── */
const Reader = () => {
    const { novel_id, chapter_id } = useParams();
    const navigate = useNavigate();

    const [chapter, setChapter] = useState(null);
    const [novel, setNovel] = useState(null);
    const [allChapters, setAllChapters] = useState([]); // full published chapter list for nav
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lockedChapter, setLockedChapter] = useState(null); // chapter needing unlock
    const [lockedPrice, setLockedPrice] = useState(0);
    const [walletBalance, setWalletBalance] = useState(0);
    const [unlocking, setUnlocking] = useState(false);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");
    const authH = () => ({ id: userId, Authorization: `Bearer ${token}` });

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

    /* Derived navigation indices */
    const currentIndex = allChapters.findIndex(c => c._id === chapter_id);
    const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
    const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

    useEffect(() => {
        loadAll();
        window.scrollTo(0, 0);
    }, [novel_id, chapter_id]);

    const loadAll = async () => {
        setLoading(true);
        setError(null);
        setLockedChapter(null);
        try {
            const [nRes, chapListRes] = await Promise.all([
                axios.get(`${API}/get_novel_by_id/${novel_id}`),
                axios.get(`${API}/get_chapters/${novel_id}`),
            ]);
            setNovel(nRes.data.data);
            setAllChapters(chapListRes.data.data || []);

            // Try to read the chapter
            const headers = token ? authH() : {};
            const cRes = await axios.get(`${API}/read_chapter/${chapter_id}`, { headers });
            setChapter(cRes.data.data);

            // Fetch wallet balance for modal
            if (token) {
                try {
                    const wRes = await axios.get(`${API}/get_wallet`, { headers: authH() });
                    setWalletBalance(wRes.data.data?.balance ?? 0);
                } catch { /* silent */ }
            }

            restoreProgress();
        } catch (err) {
            if (err.response?.status === 402) {
                // Locked chapter — find its metadata from chapter list
                const chapListRes = await axios.get(`${API}/get_chapters/${novel_id}`).catch(() => null);
                const meta = chapListRes?.data.data.find(c => c._id === chapter_id);
                setLockedChapter(meta || { _id: chapter_id, title: "This chapter" });
                setLockedPrice(err.response.data?.price ?? 5);
                setError(null);
                // Also need wallet balance
                if (token) {
                    try {
                        const wRes = await axios.get(`${API}/get_wallet`, { headers: authH() });
                        setWalletBalance(wRes.data.data?.balance ?? 0);
                    } catch { /* silent */ }
                }
            } else {
                setError(err.response?.data?.message || "Failed to load chapter.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUnlockConfirm = async () => {
        if (!token) { navigate("/login"); return; }
        setUnlocking(true);
        try {
            await axios.post(`${API}/unlock_chapter/${lockedChapter._id}`, {}, { headers: authH() });
            setLockedChapter(null);
            setWalletBalance(b => b - lockedPrice);
            // Now fetch the chapter content
            const cRes = await axios.get(`${API}/read_chapter/${chapter_id}`, { headers: authH() });
            setChapter(cRes.data.data);
        } catch (err) {
            alert(err.response?.data?.message || "Unlock failed.");
        } finally {
            setUnlocking(false);
        }
    };

    const navigateTo = (chap) => {
        if (!chap) return;
        navigate(`/read/${novel_id}/${chap._id}`);
    };

    /* Progress persistence */
    const saveProgress = useCallback(async () => {
        if (!token || !chapter) return;
        try {
            await axios.post(`${API}/update_progress`, {
                novelId: novel_id, chapterId: chapter_id,
                chapterNumber: chapter.chapterNumber,
                scrollPosition: document.documentElement.scrollTop,
            }, { headers: authH() });
        } catch { /* ignore */ }
    }, [chapter, token]);

    const restoreProgress = async () => {
        if (!token) return;
        try {
            const res = await axios.get(`${API}/get_progress/${novel_id}`, { headers: authH() });
            const p = res.data.data;
            if (p?.lastChapterId === chapter_id && p?.scrollPosition > 0) {
                window.scrollTo({ top: p.scrollPosition, behavior: "smooth" });
            }
        } catch { /* ignore */ }
    };

    useEffect(() => {
        let t;
        const onScroll = () => { clearTimeout(t); t = setTimeout(saveProgress, 2000); };
        window.addEventListener("scroll", onScroll);
        return () => { window.removeEventListener("scroll", onScroll); clearTimeout(t); saveProgress(); };
    }, [saveProgress]);

    /* ── Nav bar (reusable) ── */
    const NavBar = () => (
        <div className="sticky top-0 z-40 bg-[#fdfbf7]/90 dark:bg-[#1a1b26]/90 backdrop-blur-md border-b border-parchment-300 dark:border-navy-700 transition-colors">
            <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                <Link
                    to={`/view_detail/${novel_id}`}
                    className="flex items-center gap-2 text-toffee-600 dark:text-toffee-400 hover:text-wine-600 transition-colors font-sans text-sm font-semibold shrink-0"
                >
                    <FaArrowLeft className="w-3.5 h-3.5" /> Back
                </Link>

                <div className="text-center flex-1 truncate">
                    <h2 className="text-sm font-bold text-parchment-900 dark:text-parchment-100 truncate font-serif">{novel?.title}</h2>
                    <p className="text-xs text-toffee-500 font-sans">
                        Chapter {chapter?.chapterNumber ?? lockedChapter?.chapterNumber}
                        {allChapters.length > 0 && ` / ${allChapters.length}`}
                    </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={() => navigateTo(prevChapter)}
                        disabled={!prevChapter}
                        title="Previous Chapter"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed text-toffee-600 dark:text-toffee-400 hover:bg-parchment-200 dark:hover:bg-navy-700"
                    >
                        <FaArrowLeft className="w-3 h-3" /> Prev
                    </button>
                    <button
                        onClick={() => navigateTo(nextChapter)}
                        disabled={!nextChapter}
                        title="Next Chapter"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed text-toffee-600 dark:text-toffee-400 hover:bg-parchment-200 dark:hover:bg-navy-700"
                    >
                        Next <FaArrowRight className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>
    );

    /* ── Bottom navigation bar ── */
    const BottomNav = () => (
        <div className="flex items-center justify-between gap-4 mt-20 pt-8 border-t border-parchment-300 dark:border-navy-700">
            <button
                onClick={() => navigateTo(prevChapter)}
                disabled={!prevChapter}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-parchment-200 dark:bg-navy-800 text-parchment-800 dark:text-parchment-200 font-sans font-bold text-sm hover:bg-parchment-300 dark:hover:bg-navy-700 transition-colors border border-parchment-300 dark:border-navy-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <FaArrowLeft className="w-3.5 h-3.5" />
                {prevChapter ? `Ch. ${prevChapter.chapterNumber}` : "No Previous"}
            </button>

            <Link
                to={`/view_detail/${novel_id}`}
                className="px-4 py-2 rounded-full text-xs font-sans font-semibold text-toffee-600 dark:text-toffee-400 hover:text-wine-600 transition-colors"
            >
                Chapter List
            </Link>

            <button
                onClick={() => navigateTo(nextChapter)}
                disabled={!nextChapter}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-wine-600 hover:bg-wine-700 text-parchment-50 font-sans font-bold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
            >
                {nextChapter ? `Ch. ${nextChapter.chapterNumber}` : "No Next"}
                <FaArrowRight className="w-3.5 h-3.5" />
            </button>
        </div>
    );

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="min-h-screen bg-[#fdfbf7] dark:bg-[#1a1b26] pt-24 flex items-center justify-center">
                <span className="w-12 h-12 border-4 border-wine-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    /* ── Locked Chapter — show modal immediately ── */
    if (lockedChapter) {
        return (
            <div className="min-h-screen bg-[#fdfbf7] dark:bg-[#1a1b26] transition-colors">
                <motion.div className="fixed top-0 left-0 right-0 h-0.5 bg-wine-600 z-50" style={{ scaleX }} />
                <NavBar />
                <UnlockModal
                    chapter={lockedChapter}
                    price={lockedPrice}
                    walletBalance={walletBalance}
                    onConfirm={handleUnlockConfirm}
                    onCancel={() => navigate(`/view_detail/${novel_id}`)}
                    loading={unlocking}
                />
                {/* blurred background preview */}
                <div className="max-w-3xl mx-auto px-6 py-12 select-none pointer-events-none opacity-20 blur-sm">
                    <div className="h-8 bg-parchment-600 dark:bg-navy-400 rounded w-3/4 mb-6" />
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-4 bg-parchment-400 dark:bg-navy-500 rounded mb-3" style={{ width: `${70 + Math.random() * 30}%` }} />
                    ))}
                </div>
            </div>
        );
    }

    /* ── Error ── */
    if (error) {
        return (
            <div className="min-h-screen bg-[#fdfbf7] dark:bg-[#1a1b26] pt-24 flex flex-col items-center justify-center gap-4">
                <p className="text-xl text-wine-600 font-bold">{error}</p>
                <Link to={`/view_detail/${novel_id}`} className="px-6 py-2 bg-parchment-200 dark:bg-navy-800 rounded-lg font-sans text-sm">
                    Go Back
                </Link>
            </div>
        );
    }

    /* ── Full Reader ── */
    return (
        <div className="min-h-screen bg-[#fdfbf7] dark:bg-[#1a1b26] transition-colors duration-300 font-serif">
            <motion.div className="fixed top-0 left-0 right-0 h-1 bg-wine-600 transform origin-left z-50" style={{ scaleX }} />

            <NavBar />

            <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
                <h1 className="text-3xl md:text-5xl font-bold text-parchment-900 dark:text-parchment-50 mb-12 leading-tight">
                    Chapter {chapter?.chapterNumber}:<br className="hidden md:block" />
                    <span className="text-2xl md:text-4xl font-normal text-toffee-800 dark:text-parchment-200 mt-2 block">
                        {chapter?.title}
                    </span>
                </h1>

                <div className="prose prose-lg md:prose-xl dark:prose-invert prose-p:leading-loose prose-p:text-[#333] dark:prose-p:text-[#d1d5db] font-serif max-w-none">
                    {chapter?.content?.split("\n").map((paragraph, idx) =>
                        paragraph.trim() ? (
                            <motion.p
                                key={idx}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: Math.min(idx * 0.03, 1) }}
                                className="mb-6 indent-8 tracking-wide"
                            >
                                {paragraph}
                            </motion.p>
                        ) : null
                    )}
                </div>

                {/* End of chapter badge */}
                <div className="mt-16 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-parchment-200 dark:bg-navy-800 flex items-center justify-center text-toffee-500 mb-3">
                        <FaCheck />
                    </div>
                    <p className="text-sm font-sans text-toffee-600 dark:text-toffee-400 uppercase tracking-widest">
                        End of Chapter {chapter?.chapterNumber}
                    </p>
                </div>

                <BottomNav />
            </div>
        </div>
    );
};

export default Reader;
