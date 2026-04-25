import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaCoins, FaLock, FaUnlock } from "react-icons/fa";
import { toast } from "react-toastify";

const API = import.meta.env.VITE_API_URL;

const ViewBook = () => {
    const { book_id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [relatedBooks, setRelatedBooks] = useState([]);
    const [unlockedChapters, setUnlockedChapters] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [walletBalance, setWalletBalance] = useState(0);
    const [pendingUnlock, setPendingUnlock] = useState(null);
    const [unlocking, setUnlocking] = useState(false);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");

    useEffect(() => { fetchNovelDetails(); }, [book_id]);

    const fetchNovelDetails = async () => {
        try {
            setLoading(true);
            const [novelRes, chapRes] = await Promise.all([
                axios.get(`${API}/get_novel_by_id/${book_id}`),
                axios.get(`${API}/get_chapters/${book_id}`),
            ]);
            setBook(novelRes.data.data);
            setChapters(chapRes.data.data || []);

            try {
                const allRes = await axios.get(`${API}/get_all_novels`);
                const all = allRes.data.data || [];
                setRelatedBooks(all.filter(b => b._id !== book_id).slice(0, 3));
            } catch { /* ignore */ }

            if (token && userId) {
                try {
                    const [libRes, unlockRes, walletRes] = await Promise.all([
                        axios.get(`${API}/get_library`, { headers: { id: userId, Authorization: `Bearer ${token}` } }),
                        axios.get(`${API}/get_unlocked_chapters/${book_id}`, { headers: { id: userId, Authorization: `Bearer ${token}` } }),
                        axios.get(`${API}/get_wallet`, { headers: { id: userId, Authorization: `Bearer ${token}` } }),
                    ]);
                    setIsFavorite(libRes.data.data.some(b => b._id === book_id));
                    setUnlockedChapters(unlockRes.data.data || []);
                    setWalletBalance(walletRes.data.data?.balance ?? 0);
                } catch { /* ignore */ }
            }
        } catch {
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
                await axios.delete(`${API}/remove_from_library`, { headers });
                setIsFavorite(false); toast.success("Removed from Library");
            } else {
                await axios.post(`${API}/add_to_library`, {}, { headers });
                setIsFavorite(true); toast.success("Added to Library");
            }
        } catch { toast.error("Failed to update library"); }
    };

    const handleChapterClick = (chap, isUnlocked) => {
        if (isUnlocked) {
            navigate(`/read/${book_id}/${chap._id}`);
        } else {
            if (!token) { toast.info("Please login to unlock chapters"); navigate("/login"); return; }
            setPendingUnlock({ chapter: chap, price: chap.price ?? book.chapterPrice ?? 5 });
        }
    };

    const confirmUnlock = async () => {
        if (!pendingUnlock) return;
        setUnlocking(true);
        try {
            await axios.post(
                `${API}/unlock_chapter/${pendingUnlock.chapter._id}`,
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
            toast.error(err.response?.status === 402 ? "Insufficient tokens!" : (err.response?.data?.message || "Failed to unlock"));
            setPendingUnlock(null);
        } finally {
            setUnlocking(false);
        }
    };

    if (loading || !book) {
        return (
            <div className="min-h-screen bg-parchment-200 dark:bg-navy-900 flex items-center justify-center pt-24 transition-colors">
                <span className="w-12 h-12 border-4 border-wine-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const freeChapters = chapters.filter(c => c.isFree).length;

    return (
        <div className="min-h-screen bg-parchment-200 dark:bg-navy-900 transition-colors duration-300">

            {/* ── Unlock modal ── */}
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
                            <div className="w-14 h-14 rounded-2xl bg-toffee-100 dark:bg-toffee-900/30 flex items-center justify-center mx-auto mb-4">
                                <FaLock className="w-6 h-6 text-toffee-600 dark:text-toffee-400" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-center text-parchment-900 dark:text-parchment-100 mb-1">
                                Unlock Chapter
                            </h3>
                            <p className="font-sans text-sm text-toffee-600 dark:text-toffee-400 text-center mb-5">
                                Ch. {pendingUnlock.chapter.chapterNumber}: <span className="font-semibold">{pendingUnlock.chapter.title}</span>
                            </p>
                            <div className="bg-parchment-100 dark:bg-navy-700 rounded-xl p-4 mb-5 space-y-2">
                                <div className="flex justify-between font-sans text-sm">
                                    <span className="text-toffee-600 dark:text-toffee-400">Unlock cost</span>
                                    <span className="font-bold text-toffee-600 dark:text-toffee-400 flex items-center gap-1.5">
                                        <FaCoins className="w-3.5 h-3.5" />{pendingUnlock.price} tokens
                                    </span>
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
                                    <button onClick={() => setPendingUnlock(null)}
                                        className="flex-1 py-2.5 rounded-xl border border-parchment-400 dark:border-navy-500 font-sans text-sm font-semibold text-toffee-700 dark:text-parchment-300">
                                        Cancel
                                    </button>
                                    <button onClick={confirmUnlock} disabled={unlocking}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-wine-600 hover:bg-wine-700 disabled:bg-wine-400 text-parchment-50 font-sans font-semibold text-sm">
                                        {unlocking
                                            ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            : <><FaCoins className="w-3.5 h-3.5" /> Spend &amp; Read</>}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <button onClick={() => setPendingUnlock(null)}
                                        className="flex-1 py-2.5 rounded-xl border border-parchment-400 dark:border-navy-500 font-sans text-sm font-semibold text-toffee-700 dark:text-parchment-300">
                                        Cancel
                                    </button>
                                    <Link to="/wallet"
                                        className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-wine-600 hover:bg-wine-700 text-parchment-50 font-sans font-semibold text-sm">
                                        Buy Tokens
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Banner ── */}
            <div className="relative pt-16">
                {/* Dark background layers */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #1a0a04, #3D1A0A, #801818)', filter: 'brightness(0.6)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 55%, transparent 100%)' }} />

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex items-end gap-7">
                    {/* Cover */}
                    <div className="shrink-0 hidden sm:block">
                        <div className="w-28 aspect-[2/3] rounded-lg overflow-hidden"
                            style={{ border: '3px solid rgba(192,147,101,0.5)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
                        >
                            {book.cover_image ? (
                                <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center"
                                    style={{ background: 'linear-gradient(160deg, #3D1A0A 0%, #1a0a04 60%, #801818 100%)' }}
                                >
                                    <span className="font-serif text-3xl opacity-30" style={{ color: '#C09365' }}>✦</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="pb-1 flex-1 min-w-0">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {(book.genres || []).slice(0, 3).map(g => (
                                <span key={g} className="font-sans text-xs font-medium px-2 py-0.5 rounded"
                                    style={{ color: '#C09365', background: 'rgba(253,242,242,0.9)', border: '1px solid rgba(250,224,224,0.9)' }}
                                >{g}</span>
                            ))}
                            {book.status && (
                                <span className="font-sans text-xs font-semibold px-2 py-0.5 rounded"
                                    style={{
                                        color: book.status === 'Completed' ? '#22c55e' : '#f59e0b',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                    }}
                                >{book.status}</span>
                            )}
                        </div>

                        <h1 className="font-serif font-bold text-parchment-100 leading-tight mb-2 truncate"
                            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-0.02em' }}
                        >{book.title}</h1>

                        <p className="font-sans text-sm mb-6" style={{ color: 'rgba(192,147,101,0.85)' }}>
                            by <span className="font-semibold">{book.author}</span>
                            &nbsp;·&nbsp; {chapters.length} chapters
                            {book.status === 'Ongoing' && <>&nbsp;·&nbsp; Updated regularly</>}
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => {
                                    const first = chapters[0];
                                    if (first) navigate(`/read/${book_id}/${first._id}`);
                                    else toast.info("No chapters available yet.");
                                }}
                                className="font-sans text-sm font-semibold text-parchment-100 px-5 py-2.5 rounded-lg transition-opacity hover:opacity-90 active:opacity-80"
                                style={{ background: '#801818' }}
                            >
                                Read Now
                            </button>
                            <button
                                onClick={toggleFavorite}
                                className="font-sans text-sm font-medium px-4 py-2.5 rounded-lg transition-all"
                                style={{
                                    color: isFavorite ? '#F9F6F2' : 'rgba(192,147,101,0.9)',
                                    border: '1.5px solid rgba(192,147,101,0.4)',
                                    background: isFavorite ? '#801818' : 'transparent',
                                }}
                            >
                                {isFavorite ? '♥ In Library' : '♡ Favourite'}
                            </button>
                            <button
                                onClick={() => {
                                    if (navigator.share) navigator.share({ title: book.title, url: window.location.href });
                                    else { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }
                                }}
                                className="font-sans text-sm font-medium px-4 py-2.5 rounded-lg transition-all"
                                style={{ color: 'rgba(192,147,101,0.9)', border: '1.5px solid rgba(192,147,101,0.4)', background: 'transparent' }}
                            >
                                ⤴ Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Stats bar ── */}
            <div className="bg-parchment-50 dark:bg-navy-800 border-b border-parchment-300 dark:border-navy-600">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex divide-x divide-parchment-300 dark:divide-navy-600">
                        {[
                            { v: book.rating ? `★ ${book.rating}` : '★ New', l: 'Rating', warm: true },
                            { v: `${chapters.length}`,          l: 'Chapters' },
                            { v: `${freeChapters}`,             l: 'Free Ch.' },
                            { v: book.chapterPrice ?? '—',      l: 'Tokens/Ch' },
                        ].map(({ v, l, warm }) => (
                            <div key={l} className="flex-1 text-center py-4">
                                <div className={`font-serif text-xl font-bold leading-none mb-1 ${warm ? 'text-toffee-400' : 'text-wine-600 dark:text-wine-400'}`}
                                    style={{ letterSpacing: '-0.01em' }}
                                >{v}</div>
                                <div className="font-sans font-medium uppercase text-parchment-600 dark:text-parchment-500"
                                    style={{ fontSize: '10px', letterSpacing: '0.08em' }}
                                >{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8 items-start">

                    {/* Main column */}
                    <div className="flex-1 min-w-0">
                        {/* Synopsis */}
                        <p className="font-sans text-xs font-semibold uppercase text-toffee-500 dark:text-toffee-400 mb-3"
                            style={{ letterSpacing: '0.14em' }}
                        >Synopsis</p>
                        <p className="font-sans text-sm leading-relaxed text-parchment-800 dark:text-parchment-300 mb-8">
                            {book.synopsis || book.description || 'No synopsis available.'}
                        </p>

                        <div className="h-px mb-6"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(128,24,24,0.35), transparent)' }}
                        />

                        {/* Chapter list */}
                        <p className="font-sans text-xs font-semibold uppercase text-toffee-500 dark:text-toffee-400 mb-4"
                            style={{ letterSpacing: '0.14em' }}
                        >Chapters</p>

                        {chapters.length === 0 ? (
                            <p className="text-center py-10 font-sans text-sm text-toffee-500">No chapters published yet.</p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {chapters.map((chap, idx) => {
                                    const isFree = chap.isFree;
                                    const isUnlocked = isFree || unlockedChapters.includes(chap._id) || (book.authorId === userId);
                                    const price = chap.price ?? book.chapterPrice ?? 5;
                                    return (
                                        <motion.div
                                            key={chap._id}
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.22, delay: Math.min(idx * 0.018, 0.4) }}
                                            className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all hover:shadow-sm group"
                                            style={{
                                                background: isFree
                                                    ? 'rgba(34,197,94,0.05)'
                                                    : 'var(--chapter-bg, rgba(249,246,242,1))',
                                                border: `1px solid ${isFree ? 'rgba(34,197,94,0.15)' : 'rgba(237,232,225,1)'}`,
                                            }}
                                            onClick={() => handleChapterClick(chap, isUnlocked)}
                                        >
                                            <span className="font-serif text-sm font-bold text-wine-600 dark:text-wine-400 shrink-0 w-7">
                                                {String(chap.chapterNumber).padStart(2, '0')}
                                            </span>
                                            <span className="font-sans text-sm font-medium text-parchment-900 dark:text-parchment-100 flex-1 truncate group-hover:text-wine-600 dark:group-hover:text-wine-400 transition-colors">
                                                {chap.title}
                                            </span>
                                            {isFree ? (
                                                <span className="font-sans text-xs font-bold shrink-0" style={{ color: '#22c55e' }}>Free</span>
                                            ) : isUnlocked ? (
                                                <span className="font-sans text-xs font-semibold shrink-0 flex items-center gap-1 px-2 py-0.5 rounded text-toffee-500"
                                                    style={{ background: 'rgba(192,147,101,0.12)', border: '1px solid rgba(192,147,101,0.3)' }}
                                                >
                                                    <FaUnlock className="w-2.5 h-2.5" />Unlocked
                                                </span>
                                            ) : (
                                                <span className="font-sans text-xs font-semibold shrink-0 px-2 py-0.5 rounded text-toffee-500"
                                                    style={{ background: 'rgba(192,147,101,0.12)', border: '1px solid rgba(192,147,101,0.3)' }}
                                                >
                                                    🔒 {price} tokens
                                                </span>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="w-52 shrink-0 hidden lg:block">
                        {/* Author */}
                        <p className="font-sans text-xs font-semibold uppercase text-toffee-500 dark:text-toffee-400 mb-4"
                            style={{ letterSpacing: '0.14em' }}
                        >Author</p>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #801818, #3D0C02)' }}
                            >
                                <span className="font-serif italic text-parchment-300 text-lg">
                                    {book.author?.[0]?.toUpperCase() || '?'}
                                </span>
                            </div>
                            <div>
                                <div className="font-sans text-sm font-semibold text-parchment-900 dark:text-parchment-100 leading-tight">{book.author}</div>
                                <div className="font-sans text-xs text-toffee-500 mt-0.5">{chapters.length} chapter{chapters.length !== 1 ? 's' : ''}</div>
                            </div>
                        </div>

                        <div className="h-px mb-5"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(128,24,24,0.35), transparent)' }}
                        />

                        {/* Related */}
                        {relatedBooks.length > 0 && (
                            <>
                                <p className="font-sans text-xs font-semibold uppercase text-toffee-500 dark:text-toffee-400 mb-4"
                                    style={{ letterSpacing: '0.14em' }}
                                >You May Also Like</p>
                                <div className="flex flex-col gap-4">
                                    {relatedBooks.map(rb => (
                                        <Link key={rb._id} to={`/view_detail/${rb._id}`}
                                            className="flex items-start gap-3 group"
                                        >
                                            <div className="w-10 shrink-0 aspect-[2/3] rounded overflow-hidden"
                                                style={{ background: 'linear-gradient(160deg, #3D1A0A 0%, #1a0a04 60%, #801818 100%)' }}
                                            >
                                                {rb.cover_image && (
                                                    <img src={rb.cover_image} alt={rb.title} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-sans text-xs font-semibold text-parchment-900 dark:text-parchment-100 group-hover:text-wine-600 dark:group-hover:text-wine-400 transition-colors line-clamp-2 leading-tight">{rb.title}</div>
                                                <div className="font-sans text-xs text-toffee-500 mt-0.5 truncate">{rb.author}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default ViewBook;
