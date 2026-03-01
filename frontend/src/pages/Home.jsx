import React from "react";
import RecentlyAdded from "./RecentlyAdded";
import { Link } from "react-router-dom";
import { FaArrowRight, FaBook, FaStar, FaUsers } from "react-icons/fa";

const STATS = [
  { value: "10,000+", label: "Books Available", icon: FaBook   },
  { value: "4.9 ★",   label: "Average Rating",  icon: FaStar   },
  { value: "50,000+", label: "Happy Readers",   icon: FaUsers  },
];

const Home = () => {
  return (
    <div className="bg-parchment-200 dark:bg-navy-900 min-h-screen transition-colors duration-300">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative w-full min-h-screen overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/HERO_IMAGE.png"
            alt="Library of Heaven"
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-parchment-200/97 via-parchment-200/80 to-parchment-200/30 dark:from-navy-900/97 dark:via-navy-900/80 dark:to-navy-900/30 transition-colors duration-300" />
          <div className="absolute inset-0 bg-gradient-to-t from-parchment-200/60 via-transparent to-transparent dark:from-navy-900/60 transition-colors duration-300" />
        </div>

        {/* Decorative vertical line */}
        <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-y-1/2 w-px h-64 bg-gradient-to-b from-transparent via-wine-600/30 to-transparent z-10" />

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center min-h-screen pt-20 pb-16">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-wine-600/10 dark:bg-wine-500/15 border border-wine-600/20 dark:border-wine-500/20 mb-8 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-wine-600 dark:bg-wine-400 animate-pulse" />
              <span className="font-sans text-xs font-semibold text-wine-700 dark:text-wine-400 tracking-widest uppercase" style={{ letterSpacing: "0.12em" }}>
                Curated Literary Collection
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] text-parchment-900 dark:text-parchment-100 mb-6 animate-fade-in-up">
              Your Next Great<br />
              <span className="italic text-wine-600 dark:text-wine-400">Story</span>{" "}
              Awaits
            </h1>

            {/* Decorative rule */}
            <div className="flex items-center gap-4 mb-6 animate-fade-in-up">
              <div className="h-px w-16 bg-wine-600/50 dark:bg-wine-500/50" />
              <span className="font-serif text-base italic text-toffee-600 dark:text-toffee-300">
                Library of Heaven
              </span>
              <div className="h-px w-16 bg-wine-600/50 dark:bg-wine-500/50" />
            </div>

            <p className="font-sans text-lg md:text-xl text-toffee-800 dark:text-parchment-300 leading-relaxed mb-10 max-w-xl animate-fade-in-up-delay">
              Discover timeless classics and contemporary masterpieces.
              Every page is a new world waiting to be explored.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up-delay">
              <Link
                to="/books"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-wine-600 hover:bg-wine-700 active:bg-wine-800 text-parchment-50 font-sans font-semibold text-sm rounded-xl shadow-md hover:shadow-glow-wine transition-all duration-300 hover:scale-[1.02] tracking-wide"
              >
                Explore Collection
                <FaArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 border-2 border-wine-600/60 dark:border-wine-500/60 text-wine-700 dark:text-wine-400 hover:border-wine-600 dark:hover:border-wine-400 hover:bg-wine-600/8 dark:hover:bg-wine-500/10 font-sans font-semibold text-sm rounded-xl transition-all duration-300 hover:scale-[1.02] tracking-wide"
              >
                Learn More
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-6 mt-14 pt-8 border-t border-parchment-400/50 dark:border-navy-600/60 animate-fade-in-up-delay">
              {STATS.map(({ value, label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-wine-600/10 dark:bg-wine-500/15 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-wine-600 dark:text-wine-400" />
                  </div>
                  <div>
                    <p className="font-serif font-bold text-lg text-parchment-900 dark:text-parchment-100 leading-none">
                      {value}
                    </p>
                    <p className="font-sans text-xs text-toffee-600 dark:text-toffee-400 mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Recently Added ──────────────────────────────────── */}
      <section className="bg-parchment-100 dark:bg-navy-800 py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RecentlyAdded />
        </div>
      </section>

      {/* ── Full-bleed Decorative Banner ─────────────────────── */}
      <section className="relative w-full h-80 overflow-hidden">
        <img
          src="/images/anime.jpg"
          alt="Anime Collection"
          className="w-full h-full object-cover object-center scale-105"
          style={{ filter: "brightness(0.65) saturate(0.8)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-parchment-200 via-parchment-200/50 dark:from-navy-900 dark:via-navy-900/50 to-transparent transition-colors duration-300" />
        <div className="absolute inset-0 bg-gradient-to-r from-parchment-200/70 via-transparent to-transparent dark:from-navy-900/70 transition-colors duration-300" />

        {/* Overlay text */}
        <div className="absolute inset-0 flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <p className="section-subheading mb-3 text-wine-400 dark:text-wine-400">Featured Genre</p>
            <h2 className="font-serif text-4xl font-bold text-parchment-50 drop-shadow-lg">
              Manga & Anime Collection
            </h2>
            <Link
              to="/books"
              className="mt-5 inline-flex items-center gap-2 font-sans text-sm font-semibold text-parchment-100 hover:text-wine-300 transition-colors duration-200"
            >
              Browse Collection <FaArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
