import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTimes, FaCoins, FaStar } from "react-icons/fa";

const COINS = Array.from({ length: 8 }, (_, i) => i);

const DailyRewardModal = ({ onClose, onClaimed }) => {
  const [claiming, setClaiming]   = useState(false);
  const [claimed,  setClaimed]    = useState(false);
  const [balance,  setBalance]    = useState(null);

  const handleClaim = async () => {
    if (claiming || claimed) return;
    setClaiming(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/claim_daily_reward`,
        {},
        { headers: {
          id:            localStorage.getItem("id"),
          authorization: `Bearer ${localStorage.getItem("token")}`,
        }}
      );
      setClaimed(true);
      setBalance(res.data.balance);
      sessionStorage.removeItem("dailyRewardDismissed");
      toast.success("🎉 10 tokens added to your wallet!");
      onClaimed && onClaimed(res.data.balance);
      setTimeout(onClose, 2200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to claim reward");
      onClose();
    } finally {
      setClaiming(false);
    }
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[999] flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Blurred dark overlay */}
        <div className="absolute inset-0 bg-navy-950/75 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          className="relative z-10 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.8, opacity: 0, y: 40 }}
          animate={{ scale: 1,   opacity: 1, y: 0  }}
          exit={{    scale: 0.9, opacity: 0, y: 20  }}
          transition={{ type: "spring", damping: 20, stiffness: 260 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative pt-12 pb-8 px-8 text-center overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #3D0C02 0%, #801818 45%, #5A4610 100%)' }}
          >
            {/* Star-chart dots */}
            <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #F0DE9A 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />

            {/* Coin burst on claim */}
            {claimed && COINS.map((i) => (
              <motion.div key={i}
                className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
                style={{ background: 'linear-gradient(135deg, #F0DE9A, #C9A84C)' }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos((i / COINS.length) * Math.PI * 2) * 80,
                  y: Math.sin((i / COINS.length) * Math.PI * 2) * 80,
                  opacity: 0,
                  scale: 0.3,
                }}
                transition={{ duration: 0.7, delay: i * 0.04 }}
              />
            ))}

            {/* Icon */}
            <motion.div
              className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 mx-auto"
              style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.08))' }}
              animate={claimed ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : { scale: [1, 1.06, 1] }}
              transition={claimed
                ? { duration: 0.5 }
                : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
              }
            >
              <FaCoins className="w-10 h-10 text-gilt-400" />
              {!claimed && (
                <motion.div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #F0DE9A, #C9A84C)' }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  <FaStar className="w-2.5 h-2.5 text-navy-950" />
                </motion.div>
              )}
            </motion.div>

            <p className="badge-cinzel text-gilt-300 mb-2 block">Daily Reward</p>
            <h2 className="font-serif text-3xl font-bold text-parchment-50 leading-tight">
              {claimed ? "Tokens Collected!" : "Welcome Back!"}
            </h2>
          </div>

          {/* Body */}
          <div className="bg-parchment-50 dark:bg-navy-800 px-8 py-6 text-center">
            {!claimed ? (
              <>
                <p className="font-sans text-sm text-toffee-700 dark:text-parchment-300 mb-2">
                  Your daily login reward is ready.
                </p>

                {/* Token amount badge */}
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl mb-6"
                  style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.04))', border: '1px solid rgba(201,168,76,0.3)' }}
                >
                  <FaCoins className="w-5 h-5 text-gilt-500" />
                  <span className="font-serif font-bold text-2xl text-gilt-600 dark:text-gilt-400">
                    +10 Tokens
                  </span>
                </div>

                <p className="font-sans text-xs text-toffee-500 dark:text-toffee-400 mb-6">
                  Come back every 24 hours to collect your free tokens.
                </p>

                {/* Collect button */}
                <motion.button
                  onClick={handleClaim}
                  disabled={claiming}
                  className="w-full py-3.5 rounded-xl font-sans font-bold text-sm text-navy-950
                    shadow-md hover:shadow-glow-gilt transition-all duration-250
                    disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #F0DE9A 0%, #C9A84C 50%, #B8922A 100%)' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {claiming
                    ? <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Collecting…
                      </span>
                    : "Collect Daily Reward"
                  }
                </motion.button>

                <button
                  onClick={() => {
                    sessionStorage.setItem("dailyRewardDismissed", "1");
                    onClose();
                  }}
                  className="mt-3 w-full py-2.5 rounded-xl font-sans text-sm font-medium
                    text-toffee-600 dark:text-toffee-400 hover:bg-parchment-200 dark:hover:bg-navy-700
                    transition-colors duration-200"
                >
                  Remind me later
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <FaCoins className="w-6 h-6 text-gilt-500" />
                  <span className="font-serif font-bold text-3xl text-gilt-600 dark:text-gilt-400">
                    +10 Tokens
                  </span>
                </div>
                <p className="font-sans text-sm text-toffee-600 dark:text-toffee-400 mb-1">
                  Added to your wallet!
                </p>
                {balance !== null && (
                  <p className="font-sans text-xs text-toffee-500 dark:text-toffee-500">
                    New balance: <span className="font-semibold text-gilt-600 dark:text-gilt-400">{balance} tokens</span>
                  </p>
                )}
              </>
            )}
          </div>

          {/* Close button */}
          {!claimed && (
            <button onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center
                bg-parchment-50/15 text-parchment-200 hover:bg-parchment-50/25 transition-colors duration-200"
              aria-label="Close"
            >
              <FaTimes className="w-3.5 h-3.5" />
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DailyRewardModal;
