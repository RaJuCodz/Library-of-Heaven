import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaWallet, FaCoins, FaHistory } from "react-icons/fa";
import Button from "../components/ui/Button";

const Wallet = () => {
    const [wallet, setWallet] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");

    useEffect(() => {
        fetchWallet();
        fetchHistory();
    }, []);

    const fetchWallet = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/get_wallet`, {
                headers: { id: userId, authorization: `Bearer ${token}` }
            });
            setWallet(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

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

    const buyTokens = async (amount) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/buy_tokens`,
                { amount, paymentMethod: "Stripe_Mock" },
                { headers: { id: userId, authorization: `Bearer ${token}` } }
            );
            // Refresh
            fetchWallet();
            fetchHistory();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-parchment-200 dark:bg-navy-900 transition-colors duration-300">
                <div className="w-10 h-10 border-2 border-wine-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-parchment-200 dark:bg-navy-900 pt-24 pb-16 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Wallet Hero */}
                <motion.div
                    className="relative bg-gradient-wine dark:bg-gradient-navy rounded-2xl p-8 mb-8 overflow-hidden shadow-card dark:shadow-card-dark border border-wine-800/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-wine-900/40 to-transparent" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-parchment-50/15 backdrop-blur-md flex items-center justify-center border border-parchment-100/30 shadow-glass">
                                <FaWallet className="w-8 h-8 text-parchment-50" />
                            </div>
                            <div>
                                <p className="font-sans text-sm text-wine-200 uppercase tracking-widest mb-1">Your Balance</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="font-serif text-5xl font-bold text-parchment-50">
                                        {wallet?.balance || 0}
                                    </span>
                                    <span className="font-sans text-wine-200 font-medium">Tokens</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Buy Tokens Section */}
                <motion.div
                    className="bg-parchment-50 dark:bg-navy-800 rounded-2xl p-6 mb-8 border border-parchment-300 dark:border-navy-600 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <FaCoins className="w-5 h-5 text-wine-600 dark:text-wine-400" />
                        <h2 className="font-serif text-xl font-bold text-parchment-900 dark:text-parchment-50">Buy Tokens</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { amount: 100, price: "$1.00", bonus: "0%" },
                            { amount: 500, price: "$4.50", bonus: "10%" },
                            { amount: 1000, price: "$8.00", bonus: "20%" },
                        ].map((pkg) => (
                            <button
                                key={pkg.amount}
                                onClick={() => buyTokens(pkg.amount)}
                                className="group relative flex flex-col items-center p-6 rounded-xl border-2 border-parchment-200 dark:border-navy-600 hover:border-wine-500 hover:bg-wine-50 dark:hover:bg-wine-900/20 transition-all duration-300"
                            >
                                {pkg.bonus !== "0%" && (
                                    <span className="absolute -top-3 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                                        +{pkg.bonus} Bonus
                                    </span>
                                )}
                                <FaCoins className="w-8 h-8 text-toffee-500 mb-3 group-hover:scale-110 transition-transform duration-300" />
                                <span className="font-serif text-2xl font-bold text-parchment-900 dark:text-parchment-50 mb-1">
                                    {pkg.amount}
                                </span>
                                <span className="font-sans text-sm text-toffee-600 dark:text-toffee-400">
                                    {pkg.price}
                                </span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Transaction History */}
                <motion.div
                    className="bg-parchment-50 dark:bg-navy-800 rounded-2xl p-6 border border-parchment-300 dark:border-navy-600 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <FaHistory className="w-5 h-5 text-wine-600 dark:text-wine-400" />
                        <h2 className="font-serif text-xl font-bold text-parchment-900 dark:text-parchment-50">Transaction History</h2>
                    </div>

                    {history.length === 0 ? (
                        <div className="text-center py-8 text-toffee-600 dark:text-toffee-400 font-sans">
                            No transactions yet.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {history.map((tx) => (
                                <div key={tx._id} className="flex justify-between items-center p-4 rounded-xl border border-parchment-200 dark:border-navy-700 hover:bg-parchment-100 dark:hover:bg-navy-700/50 transition-colors">
                                    <div>
                                        <p className="font-medium text-parchment-900 dark:text-parchment-50">
                                            {tx.description}
                                        </p>
                                        <p className="text-xs text-toffee-600 dark:text-toffee-400 mt-1">
                                            {new Date(tx.createdAt).toLocaleDateString()} at {new Date(tx.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <div className={`font-bold ${tx.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

            </div>
        </div>
    );
};

export default Wallet;
