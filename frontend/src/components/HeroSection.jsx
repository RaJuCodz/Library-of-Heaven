import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaBook, FaStar, FaUsers, FaPenFancy } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroThreeCanvas from './HeroThreeCanvas';

gsap.registerPlugin(ScrollTrigger);

// Moody warm-lit library corridor — Janko Ferlic on Pexels
const HERO_IMAGE =
  'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg';

const STATS = [
  { display: '10,000+', label: 'Novels Available', icon: FaBook },
  { display: '4.9 ★',   label: 'Average Rating',   icon: FaStar  },
  { display: '50,000+', label: 'Active Readers',    icon: FaUsers },
];

const HeroSection = () => {
  const sectionRef   = useRef(null);
  const badgeRef     = useRef(null);
  const line1Ref     = useRef(null);
  const line2Ref     = useRef(null);
  const ruleRef      = useRef(null);
  const paraRef      = useRef(null);
  const ctaRef       = useRef(null);
  const statsRef     = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.15,
      });

      // Badge slides in from left
      tl.fromTo(
        badgeRef.current,
        { opacity: 0, x: -36 },
        { opacity: 1, x: 0, duration: 0.75 }
      )
      // Headline line 1 rises
      .fromTo(
        line1Ref.current,
        { opacity: 0, y: 52 },
        { opacity: 1, y: 0, duration: 0.9 },
        '-=0.35'
      )
      // Headline line 2 rises with slight delay for stagger feel
      .fromTo(
        line2Ref.current,
        { opacity: 0, y: 52 },
        { opacity: 1, y: 0, duration: 0.9 },
        '-=0.65'
      )
      // Decorative rule expands from origin
      .fromTo(
        ruleRef.current,
        { opacity: 0, scaleX: 0 },
        { opacity: 1, scaleX: 1, duration: 0.65, transformOrigin: 'left center' },
        '-=0.45'
      )
      // Paragraph fades up
      .fromTo(
        paraRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.75 },
        '-=0.25'
      )
      // CTA buttons stagger in
      .fromTo(
        ctaRef.current ? Array.from(ctaRef.current.children) : [],
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.14 },
        '-=0.25'
      )
      // Stats stagger in
      .fromTo(
        statsRef.current ? Array.from(statsRef.current.children) : [],
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
        '-=0.15'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden"
    >
      {/* ── Background photo ─────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Warm library corridor lined with bookshelves — Janko Ferlic on Pexels"
          className="w-full h-full object-cover object-center scale-110"
          style={{ filter: 'brightness(0.92) saturate(0.9)' }}
        />

        {/* Left-to-right gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r
          from-parchment-200/98 via-parchment-200/82 to-parchment-200/25
          dark:from-navy-900/98 dark:via-navy-900/84 dark:to-navy-900/30
          transition-colors duration-300"
        />
        {/* Bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t
          from-parchment-200/70 via-transparent to-transparent
          dark:from-navy-900/70
          transition-colors duration-300"
        />
        {/* Top vignette */}
        <div className="absolute inset-0 bg-gradient-to-b
          from-parchment-200/30 via-transparent to-transparent
          dark:from-navy-900/30
          transition-colors duration-300"
        />
      </div>

      {/* ── Three.js particle canvas ──────────────────────────────── */}
      <HeroThreeCanvas />

      {/* ── Decorative vertical divider (desktop) ─────────────────── */}
      <div className="hidden lg:block absolute left-[52%] top-1/2 -translate-y-1/2
        w-px h-72
        bg-gradient-to-b from-transparent via-wine-600/25 to-transparent
        z-10"
      />

      {/* ── Hero content ─────────────────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
        flex items-center min-h-screen pt-20 pb-16"
      >
        <div className="max-w-2xl">

          {/* Badge */}
          <div
            ref={badgeRef}
            style={{ opacity: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
              bg-wine-600/10 dark:bg-wine-500/15
              border border-wine-600/20 dark:border-wine-500/20
              mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-wine-600 dark:bg-wine-400 animate-pulse" />
            <span
              className="font-sans text-xs font-semibold
                text-wine-700 dark:text-wine-400 tracking-widest uppercase"
              style={{ letterSpacing: '0.13em' }}
            >
              Premium Novel Library
            </span>
          </div>

          {/* Heading — two animated lines */}
          <h1 className="font-serif font-bold leading-[1.06]
            text-parchment-900 dark:text-parchment-100 mb-6"
          >
            <span
              ref={line1Ref}
              style={{ opacity: 0 }}
              className="block text-5xl md:text-6xl lg:text-7xl"
            >
              Lose Yourself In
            </span>
            <span
              ref={line2Ref}
              style={{ opacity: 0 }}
              className="block text-5xl md:text-6xl lg:text-7xl
                italic text-wine-600 dark:text-wine-400"
            >
              A Great Story
            </span>
          </h1>

          {/* Decorative rule */}
          <div
            ref={ruleRef}
            style={{ opacity: 0 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="h-px w-16 bg-wine-600/50 dark:bg-wine-500/50" />
            <span className="font-serif text-base italic text-toffee-600 dark:text-toffee-300">
              Library of Heaven
            </span>
            <div className="h-px w-16 bg-wine-600/50 dark:bg-wine-500/50" />
          </div>

          {/* Description */}
          <p
            ref={paraRef}
            style={{ opacity: 0 }}
            className="font-sans text-lg md:text-xl
              text-toffee-800 dark:text-parchment-300
              leading-relaxed mb-10 max-w-xl"
          >
            Discover thousands of novels across every genre — from timeless
            classics to gripping new releases. Read anywhere, track your
            progress, and even share your own stories with the world.
          </p>

          {/* CTA buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/books"
              className="inline-flex items-center justify-center gap-2.5
                px-8 py-4
                bg-wine-600 hover:bg-wine-700 active:bg-wine-800
                text-parchment-50 font-sans font-semibold text-sm
                rounded-xl shadow-md
                transition-all duration-300 hover:scale-[1.02] tracking-wide"
            >
              Explore Library
              <FaArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/become-author"
              className="inline-flex items-center justify-center gap-2.5
                px-8 py-4
                border-2 border-wine-600/60 dark:border-wine-500/60
                text-wine-700 dark:text-wine-400
                hover:border-wine-600 dark:hover:border-wine-400
                hover:bg-wine-600/8 dark:hover:bg-wine-500/10
                font-sans font-semibold text-sm rounded-xl
                transition-all duration-300 hover:scale-[1.02] tracking-wide"
            >
              <FaPenFancy className="w-4 h-4" />
              Start Writing
            </Link>
          </div>

          {/* Stats row */}
          <div
            ref={statsRef}
            className="flex flex-wrap items-center gap-6 mt-14 pt-8
              border-t border-parchment-400/50 dark:border-navy-600/60"
          >
            {STATS.map(({ display, label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg
                  bg-wine-600/10 dark:bg-wine-500/15
                  flex items-center justify-center">
                  <Icon className="w-4 h-4 text-wine-600 dark:text-wine-400" />
                </div>
                <div>
                  <p className="font-serif font-bold text-lg
                    text-parchment-900 dark:text-parchment-100 leading-none">
                    {display}
                  </p>
                  <p className="font-sans text-xs
                    text-toffee-600 dark:text-toffee-400 mt-0.5">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
