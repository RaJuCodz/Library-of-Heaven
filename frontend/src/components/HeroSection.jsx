import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaBook, FaStar, FaUsers, FaFeatherAlt } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroThreeCanvas from './HeroThreeCanvas';

gsap.registerPlugin(ScrollTrigger);

const HERO_IMAGE = 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg';

const STATS = [
  { display: '10,000+', label: 'Novels Available',  sub: 'Across all genres',     icon: FaBook  },
  { display: '4.9 ★',  label: 'Average Rating',     sub: 'Community score',        icon: FaStar  },
  { display: '50,000+', label: 'Active Readers',    sub: 'Growing every day',      icon: FaUsers },
];

const HeroSection = () => {
  const sectionRef = useRef(null);
  const badgeRef   = useRef(null);
  const headRef    = useRef(null);
  const ruleRef    = useRef(null);
  const paraRef    = useRef(null);
  const ctaRef     = useRef(null);
  const panelRef   = useRef(null);
  const statsRef   = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.12 });

      tl.fromTo(badgeRef.current, { opacity: 0, x: -32 }, { opacity: 1, x: 0, duration: 0.7 })
        .fromTo(headRef.current,  { opacity: 0, y: 64  }, { opacity: 1, y: 0, duration: 1.0 }, '-=0.4')
        .fromTo(ruleRef.current,  { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.6, transformOrigin: 'left center' }, '-=0.5')
        .fromTo(paraRef.current,  { opacity: 0, y: 28  }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.35')
        .fromTo(ctaRef.current ? Array.from(ctaRef.current.children) : [],
          { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.14 }, '-=0.35')
        .fromTo(panelRef.current ? Array.from(panelRef.current.children) : [],
          { opacity: 0, x: 48 }, { opacity: 1, x: 0, duration: 0.65, stagger: 0.13 }, '-=0.9')
        .fromTo(statsRef.current ? Array.from(statsRef.current.children) : [],
          { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, '-=0.15');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen overflow-hidden">

      {/* ── Background ────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Warm library corridor"
          className="w-full h-full object-cover object-center scale-110"
          style={{ filter: 'brightness(0.88) saturate(0.75)' }}
        />
        {/* Left-to-right gradient */}
        <div className="absolute inset-0 bg-gradient-to-r
          from-parchment-200/97 via-parchment-200/80 to-parchment-200/20
          dark:from-navy-950/97 dark:via-navy-950/82 dark:to-navy-950/18
          transition-colors duration-300"
        />
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t
          from-parchment-200/75 via-transparent to-parchment-200/15
          dark:from-navy-950/75 dark:to-navy-950/10
          transition-colors duration-300"
        />
        {/* Star-chart dot grid */}
        <div className="absolute inset-0 opacity-[0.035] dark:opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #C9A84C 1px, transparent 1px)',
            backgroundSize: '55px 55px',
          }}
        />
      </div>

      {/* ── Three.js particle canvas ───────────────────── */}
      <HeroThreeCanvas />

      {/* ── Decorative vertical rule (desktop) ────────── */}
      <div className="hidden lg:block absolute left-[54%] top-1/2 -translate-y-1/2
        w-px h-80 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.20), transparent)' }}
      />

      {/* ── Hero content ──────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
        flex items-center min-h-screen pt-20 pb-24"
      >
        <div className="w-full flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-0">

          {/* Left: Copy */}
          <div className="flex-1 max-w-2xl">

            {/* Badge */}
            <div ref={badgeRef} style={{ opacity: 0 }}
              className="inline-flex items-center gap-2.5 mb-9"
            >
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-gilt-500/30 dark:border-gilt-500/35 bg-gilt-500/8 dark:bg-gilt-500/10">
                <span className="w-1.5 h-1.5 rounded-full bg-gilt-500 animate-gilt-pulse" />
                <span className="badge-cinzel text-gilt-700 dark:text-gilt-400">
                  Premium Novel Library
                </span>
              </div>
            </div>

            {/* Headline */}
            <h1 ref={headRef} style={{ opacity: 0 }}
              className="font-serif leading-[0.94] mb-6 text-parchment-900 dark:text-parchment-50"
            >
              <span className="block font-light text-6xl md:text-7xl lg:text-[5.5rem] tracking-tight">
                Lose Yourself
              </span>
              <span className="block font-bold italic text-6xl md:text-7xl lg:text-[5.5rem] tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #C9A84C 0%, #F0DE9A 45%, #C9A84C 75%, #9A7A1F 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                In a Story
              </span>
            </h1>

            {/* Decorative rule */}
            <div ref={ruleRef} style={{ opacity: 0 }} className="flex items-center gap-4 mb-7">
              <div className="h-px w-14 bg-gilt-500/55" />
              <span className="font-serif text-sm italic text-gilt-600 dark:text-gilt-400 whitespace-nowrap">
                Library of Heaven
              </span>
              <div className="h-px w-14 bg-gilt-500/55" />
            </div>

            {/* Description */}
            <p ref={paraRef} style={{ opacity: 0 }}
              className="font-sans text-lg md:text-xl text-toffee-800 dark:text-parchment-300
                leading-relaxed mb-11 max-w-xl"
            >
              Discover thousands of novels across every genre — from timeless classics to
              gripping new releases. Read anywhere, track your progress, and share your own stories.
            </p>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
              <Link to="/books"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl
                  font-sans font-semibold text-sm tracking-wide text-navy-950
                  shadow-lg hover:shadow-glow-gilt transition-all duration-300 hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #F0DE9A 0%, #C9A84C 45%, #B8922A 100%)' }}
              >
                Explore Library <FaArrowRight className="w-4 h-4" />
              </Link>

              <Link to="/become-author"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl
                  border border-gilt-500/45 dark:border-gilt-500/55
                  text-gilt-700 dark:text-gilt-400
                  hover:border-gilt-500 dark:hover:border-gilt-400
                  hover:bg-gilt-500/8 dark:hover:bg-gilt-500/10
                  font-sans font-semibold text-sm tracking-wide
                  transition-all duration-300 hover:scale-[1.02]"
              >
                <FaFeatherAlt className="w-4 h-4" />
                Start Writing
              </Link>
            </div>

            {/* Mobile stats row */}
            <div ref={statsRef}
              className="lg:hidden flex flex-wrap items-center gap-6 mt-14 pt-7
                border-t border-parchment-400/40 dark:border-navy-600/50"
            >
              {STATS.map(({ display, label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(201,168,76,0.12)' }}
                  >
                    <Icon className="w-4 h-4 text-gilt-600 dark:text-gilt-400" />
                  </div>
                  <div>
                    <p className="font-serif font-bold text-lg text-parchment-900 dark:text-parchment-100 leading-none">
                      {display}
                    </p>
                    <p className="font-sans text-xs text-toffee-600 dark:text-toffee-400 mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Floating stat cards (desktop) */}
          <div ref={panelRef}
            className="hidden lg:flex flex-col gap-4 w-72 ml-auto shrink-0"
          >
            {STATS.map(({ display, label, sub, icon: Icon }) => (
              <div key={label}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl
                  border border-parchment-400/50 dark:border-navy-600/70
                  bg-parchment-50/75 dark:bg-navy-800/75 backdrop-blur-md shadow-glass
                  hover:border-gilt-500/40 dark:hover:border-gilt-500/40
                  transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.18), rgba(201,168,76,0.05))' }}
                >
                  <Icon className="w-5 h-5 text-gilt-600 dark:text-gilt-400 group-hover:scale-110 transition-transform duration-200" />
                </div>
                <div>
                  <p className="font-serif font-bold text-3xl leading-none text-parchment-900 dark:text-parchment-50">
                    {display}
                  </p>
                  <p className="font-sans font-semibold text-xs text-toffee-700 dark:text-toffee-200 mt-1">{label}</p>
                  <p className="font-sans text-xs text-toffee-500 dark:text-toffee-500 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}

            {/* Decorative quote card */}
            <div className="px-5 py-4 rounded-2xl border border-gilt-500/20 dark:border-gilt-500/15
              bg-gilt-500/6 dark:bg-gilt-500/8 backdrop-blur-md"
            >
              <p className="font-serif text-base italic text-toffee-800 dark:text-parchment-300 leading-snug mb-2">
                &ldquo;A reader lives a thousand lives before he dies.&rdquo;
              </p>
              <p className="font-sans text-xs text-toffee-500 dark:text-toffee-500">— George R.R. Martin</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
