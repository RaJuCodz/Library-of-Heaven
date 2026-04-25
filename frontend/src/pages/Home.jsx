import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import RecentlyAdded from "./RecentlyAdded";
import HeroSection from "../components/HeroSection";
import AuthorBanner from "../components/AuthorBanner";
import DailyRewardModal from "../components/DailyRewardModal";

const Home = () => {
  const isLoggedIn = useSelector((s) => s.auth.isLoggedIn);
  const [showReward, setShowReward] = useState(false);

  // Check if user is eligible for daily reward on mount (only when logged in)
  useEffect(() => {
    if (!isLoggedIn) return;

    const token  = localStorage.getItem("token");
    const userId = localStorage.getItem("id");
    if (!token || !userId) return;

    // Don't re-show if dismissed this session
    if (sessionStorage.getItem("dailyRewardDismissed")) return;

    // Small delay so the page renders first, then the modal feels intentional
    const timer = setTimeout(() => {
      axios
        .get(`${import.meta.env.VITE_API_URL}/check_daily_reward`, {
          headers: { id: userId, authorization: `Bearer ${token}` },
        })
        .then((res) => { if (res.data.eligible) setShowReward(true); })
        .catch(() => { /* silently ignore — non-critical */ });
    }, 1200);

    return () => clearTimeout(timer);
  }, [isLoggedIn]);

  return (
    <div className="bg-parchment-200 dark:bg-navy-900 min-h-screen transition-colors duration-300">

      {/* Daily reward popup */}
      {showReward && (
        <DailyRewardModal
          onClose={() => setShowReward(false)}
          onClaimed={() => setShowReward(false)}
        />
      )}

      {/* Hero */}
      <HeroSection />

      {/* Recently Added */}
      <section className="bg-parchment-100 dark:bg-navy-800 py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RecentlyAdded />
        </div>
      </section>

      {/* Become an Author Banner */}
      <AuthorBanner />

    </div>
  );
};

export default Home;
