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
        <div className="sticky top-0 z-40 backdrop-blur-md border-b"
            style={{ background: 'rgba(0,6,15,0.95)', borderColor: 'rgba(192,147,101,0.10)' }}
        >
            <div className="max-w-3xl mx-auto px-5 h-[52px] flex items-center justify-between gap-4">
                {/* Left: breadcrumb */}
                <div className="flex items-center gap-3 shrink-0 min-w-0">
                    <Link
                        to={`/view_detail/${novel_id}`}
                        className="font-sans text-xs font-medium transition-colors whitespace-nowrap"
                        style={{ color: 'rgba(192,147,101,0.7)' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'rgba(192,147,101,1)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(192,147,101,0.7)'}
                    >
                        ← Library
                    </Link>
                    <div className="w-px h-4 hidden sm:block" style={{ background: 'rgba(192,147,101,0.2)' }} />
                    <span className="font-serif text-sm hidden sm:block truncate max-w-[180px]"
                        style={{ color: 'rgba(237,232,225,0.7)' }}
                    >{novel?.title}</span>
                </div>

                {/* Center: chapter label */}
                <span className="font-serif italic text-sm shrink-0 hidden md:block"
                    style={{ color: '#B52A2A' }}
                >
                    Chapter {chapter?.chapterNumber ?? lockedChapter?.chapterNumber}
                    {chapter?.title ? ` — ${chapter.title}` : ''}
                </span>

                {/* Right: controls */}
                <div className="flex items-center gap-3 shrink-0">
                    <span className="font-sans text-xs cursor-pointer transition-colors"
                        style={{ color: 'rgba(192,147,101,0.6)' }}
                        title="Previous"
                        onClick={() => navigateTo(prevChapter)}
                    >←</span>
                    <span className="font-sans text-xs cursor-pointer"
                        style={{ color: 'rgba(192,147,101,0.6)' }}
                        title="Font size"
                    >Aa</span>
                    <span className="font-sans text-xs cursor-pointer"
                        style={{ color: 'rgba(192,147,101,0.6)' }}
                        title="Next"
                        onClick={() => navigateTo(nextChapter)}
                    >→</span>
                </div>
            </div>
        </div>
    );

    /* ── Bottom navigation bar ── */
    const BottomNav = () => {
        const progress = allChapters.length > 0 && chapter
            ? Math.round(((currentIndex + 1) / allChapters.length) * 100)
            : 0;
        return (
            <div className="mt-20 pt-8 border-t" style={{ borderColor: 'rgba(192,147,101,0.12)' }}>
                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={() => navigateTo(prevChapter)}
                        disabled={!prevChapter}
                        className="font-sans text-xs font-medium px-5 py-2.5 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{ color: 'rgba(192,147,101,0.7)', border: '1px solid rgba(192,147,101,0.2)' }}
                    >
                        ← {prevChapter ? `Ch. ${prevChapter.chapterNumber}` : "Start"}
                    </button>

                    {/* Progress */}
                    <div className="text-center flex-1">
                        <div className="font-sans text-xs mb-2" style={{ color: 'rgba(192,147,101,0.5)' }}>
                            {currentIndex + 1} / {allChapters.length} · Reading progress
                        </div>
                        <div className="h-0.5 rounded-full mx-auto" style={{ maxWidth: 160, background: 'rgba(192,147,101,0.12)' }}>
                            <div className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #801818, #B52A2A)' }}
                            />
                        </div>
                        <div className="font-sans text-xs mt-1.5" style={{ color: 'rgba(192,147,101,0.35)', fontSize: '10px' }}>
                            {progress}% complete
                        </div>
                    </div>

                    <button
                        onClick={() => navigateTo(nextChapter)}
                        disabled={!nextChapter}
                        className="font-sans text-xs font-semibold px-5 py-2.5 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{ color: '#F9F6F2', background: '#801818' }}
                    >
                        {nextChapter ? `Ch. ${nextChapter.chapterNumber}` : "End"} →
                    </button>
                </div>
            </div>
        );
    };

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24" style={{ background: '#000A18' }}>
                <span className="w-12 h-12 border-4 border-wine-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    /* ── Locked Chapter — show modal immediately ── */
    if (lockedChapter) {
        return (
            <div className="min-h-screen transition-colors" style={{ background: '#000A18' }}>
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
                <div className="max-w-3xl mx-auto px-6 py-12 select-none pointer-events-none opacity-10 blur-sm">
                    <div className="h-8 bg-navy-700 rounded w-3/4 mb-6" />
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-4 bg-navy-700 rounded mb-3" style={{ width: `${70 + Math.random() * 30}%` }} />
                    ))}
                </div>
            </div>
        );
    }

    /* ── Error ── */
    if (error) {
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4" style={{ background: '#000A18' }}>
                <p className="text-xl text-wine-400 font-bold">{error}</p>
                <Link to={`/view_detail/${novel_id}`}
                    className="px-6 py-2 rounded-lg font-sans text-sm"
                    style={{ background: 'rgba(192,147,101,0.1)', color: 'rgba(192,147,101,0.8)', border: '1px solid rgba(192,147,101,0.2)' }}
                >
                    Go Back
                </Link>
            </div>
        );
    }

    const paragraphs = chapter?.content?.split("\n").filter(p => p.trim()) || [];

    /* ── Full Reader ── */
    return (
        <div className="min-h-screen transition-colors duration-300 font-serif" style={{ background: '#000A18' }}>
            <motion.div className="fixed top-0 left-0 right-0 h-0.5 bg-wine-600 transform origin-left z-50" style={{ scaleX }} />

            <NavBar />

            <div className="max-w-2xl mx-auto px-6 py-12 md:py-16">
                {/* Chapter heading */}
                <div className="text-center mb-8">
                    <p className="font-sans font-semibold uppercase mb-3"
                        style={{ fontSize: '10px', letterSpacing: '0.16em', color: '#926644' }}
                    >
                        Chapter {chapter?.chapterNumber}
                    </p>
                    <h1 className="font-serif italic font-bold text-3xl md:text-4xl leading-tight"
                        style={{ color: 'rgba(237,232,225,0.95)' }}
                    >
                        {chapter?.title}
                    </h1>
                </div>

                {/* Decorative divider */}
                <div className="h-px mb-10"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(192,147,101,0.35), transparent)' }}
                />

                {/* Chapter content */}
                <div>
                    {paragraphs.map((paragraph, idx) => (
                        <motion.p
                            key={idx}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: Math.min(idx * 0.025, 0.8) }}
                            className="font-serif mb-6 tracking-wide"
                            style={{
                                fontSize: '15px',
                                lineHeight: 1.85,
                                color: idx === 0 ? 'rgba(237,232,225,0.82)' : 'rgba(237,232,225,0.78)',
                                textAlign: 'justify',
                            }}
                        >
                            {/* Drop cap on first paragraph */}
                            {idx === 0 && paragraph.length > 0 ? (
                                <>
                                    <span className="float-left font-serif font-bold leading-none mr-1 mt-1"
                                        style={{ fontSize: '4rem', color: '#B52A2A', lineHeight: 0.82 }}
                                    >
                                        {paragraph[0]}
                                    </span>
                                    {paragraph.slice(1)}
                                </>
                            ) : paragraph}
                        </motion.p>
                    ))}
                </div>

                {/* End of chapter */}
                <div className="mt-16 flex flex-col items-center">
                    <div className="h-px w-24 mb-6"
                        style={{ background: 'linear-gradient(90deg, transparent, rgba(192,147,101,0.35), transparent)' }}
                    />
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
                        style={{ background: 'rgba(192,147,101,0.08)', border: '1px solid rgba(192,147,101,0.2)' }}
                    >
                        <FaCheck style={{ color: 'rgba(192,147,101,0.6)', width: 14, height: 14 }} />
                    </div>
                    <p className="font-sans text-xs uppercase tracking-widest"
                        style={{ color: 'rgba(192,147,101,0.5)', letterSpacing: '0.14em' }}
                    >
                        End of Chapter {chapter?.chapterNumber}
                    </p>
                </div>

                <BottomNav />
            </div>
        </div>
    );
};

export default Reader;
