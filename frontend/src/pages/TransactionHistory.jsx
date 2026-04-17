import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaHistory, FaCoins } from "react-icons/fa";

const TransactionHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/transaction_history`, {
                    headers: { id: userId, authorization: `Bearer ${token}` }
                });
                setHistory(res.data.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchHistory();
    }, [token, userId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-56 gap-4">
                <div className="w-8 h-8 border-2 border-wine-600 border-t-transparent rounded-full animate-spin" />
                <p className="font-sans text-sm text-toffee-600 dark:text-toffee-400">Loading transactions…</p>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-56 gap-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-wine-600/10 dark:bg-wine-500/15 flex items-center justify-center">
                    <FaHistory className="w-7 h-7 text-wine-400 dark:text-wine-500" />
                </div>
                <div>
                    <p className="font-serif text-xl font-bold text-parchment-800 dark:text-parchment-200 mb-1">No transactions yet</p>
                    <p className="font-sans text-sm text-toffee-600 dark:text-toffee-400">Your token purchase and usage history will appear here.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="font-serif text-2xl font-bold text-parchment-900 dark:text-parchment-100">Transaction History</h2>
                    <p className="font-sans text-xs text-toffee-600 dark:text-toffee-400 mt-0.5">{history.length} record{history.length !== 1 ? "s" : ""} found</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-wine-600/10 dark:bg-wine-500/15 flex items-center justify-center">
                    <FaHistory className="w-4 h-4 text-wine-600 dark:text-wine-400" />
                </div>
            </div>

            <div className="space-y-4">
                {history.map((tx, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={tx._id}
                        className="flex justify-between items-center p-4 rounded-xl border border-parchment-200 dark:border-navy-700 bg-parchment-100 dark:bg-navy-700/50 hover:bg-parchment-200 dark:hover:bg-navy-600 transition-colors"
                    >
                        <div className="flex items-start gap-3">
                            <div className="mt-1">
                                <FaCoins className={`w-5 h-5 ${tx.amount > 0 ? "text-green-500" : "text-wine-500"} opacity-80`} />
                            </div>
                            <div>
                                <p className="font-medium text-parchment-900 dark:text-parchment-50">
                                    {tx.description}
                                </p>
                                <p className="text-xs text-toffee-600 dark:text-toffee-400 mt-1">
                                    {new Date(tx.createdAt).toLocaleDateString()} at {new Date(tx.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                        <div className={`font-bold text-lg ${tx.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-wine-600 dark:text-wine-400'}`}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default TransactionHistory;
