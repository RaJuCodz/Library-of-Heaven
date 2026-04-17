import React from "react";
import RecentlyAdded from "./RecentlyAdded";
import HeroSection from "../components/HeroSection";
import AuthorBanner from "../components/AuthorBanner";

const Home = () => {
  return (
    <div className="bg-parchment-200 dark:bg-navy-900 min-h-screen transition-colors duration-300">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Recently Added ───────────────────────────────────── */}
      <section className="bg-parchment-100 dark:bg-navy-800 py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RecentlyAdded />
        </div>
      </section>

      {/* ── Become an Author Banner ──────────────────────────── */}
      <AuthorBanner />

    </div>
  );
};

export default Home;
