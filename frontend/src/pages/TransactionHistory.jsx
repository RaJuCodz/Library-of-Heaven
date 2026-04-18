import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaHistory, FaCoins, FaArrowUp, FaArrowDown } from "react-icons/fa";

const TransactionHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const token  = localStorage.getItem("token");
  const userId = localStorage.getItem("id");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/transaction_history`, {
        headers: { id: userId, authorization: `Bearer ${token}` },
      })
      .then((res) => setHistory(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, userId]);

  /* ── Loading ──────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-56 gap-4">
        <div className="w-8 h-8 border-2 border-gilt-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-sans text-sm text-toffee-600 dark:text-toffee-400">Loading transactions…</p>
      </div>
    );
  }

  /* ── Empty ────────────────────────────────────── */
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-5 text-center">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.04))' }}
        >
          <FaHistory className="w-8 h-8 text-gilt-500 dark:text-gilt-400" />
        </div>
        <div>
          <p className="font-serif text-2xl font-bold text-parchment-800 dark:text-parchment-200 mb-1">
            No transactions yet
          </p>
          <p className="font-sans text-sm text-toffee-600 dark:text-toffee-400 max-w-xs">
            Your token purchase and usage history will appear here.
          </p>
        </div>
      </div>
    );
  }

  /* ── Timeline ─────────────────────────────────── */
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h2 className="font-serif text-2xl font-bold text-parchment-900 dark:text-parchment-100">
            Transaction History
          </h2>
          <p className="font-sans text-xs text-toffee-600 dark:text-toffee-400 mt-0.5">
            {history.length} record{history.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))' }}
        >
          <FaHistory className="w-4 h-4 text-gilt-600 dark:text-gilt-400" />
        </div>
      </div>

      {/* Timeline list */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[22px] top-0 bottom-0 w-px"
          style={{ background: 'linear-gradient(to bottom, rgba(201,168,76,0.4), rgba(201,168,76,0.1))' }}
        />

        <div className="space-y-3">
          {history.map((tx, i) => {
            const isCredit  = tx.amount > 0;
            const dateObj   = new Date(tx.createdAt);
            const dateStr   = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            const timeStr   = dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

            return (
              <motion.div
                key={tx._id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                className="relative pl-12 group"
              >
                {/* Timeline dot */}
                <div className={`absolute left-[14px] top-4 w-4 h-4 rounded-full border-2 border-parchment-100 dark:border-navy-800
                  flex items-center justify-center z-10
                  ${isCredit ? 'bg-green-500' : 'bg-wine-500'}`}
                >
                  {isCredit
                    ? <FaArrowUp className="w-1.5 h-1.5 text-white" />
                    : <FaArrowDown className="w-1.5 h-1.5 text-white" />
                  }
                </div>

                {/* Card */}
                <div className="flex items-center justify-between p-4 rounded-xl
                  border border-parchment-200 dark:border-navy-600
                  bg-parchment-50 dark:bg-navy-700/50
                  hover:border-gilt-500/30 dark:hover:border-gilt-500/25
                  hover:bg-parchment-100 dark:hover:bg-navy-700
                  transition-all duration-200"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                      ${isCredit ? 'bg-green-50 dark:bg-green-900/20' : 'bg-wine-50 dark:bg-wine-900/20'}`}
                    >
                      <FaCoins className={`w-3.5 h-3.5 ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-wine-600 dark:text-wine-400'}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-sans font-medium text-sm text-parchment-900 dark:text-parchment-50 leading-snug truncate">
                        {tx.description}
                      </p>
                      <p className="font-sans text-xs text-toffee-500 dark:text-toffee-500 mt-0.5">
                        {dateStr} · {timeStr}
                      </p>
                    </div>
                  </div>

                  <div className={`font-serif font-bold text-xl shrink-0 ml-4
                    ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-wine-600 dark:text-wine-400'}`}
                  >
                    {isCredit ? '+' : ''}{tx.amount}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
