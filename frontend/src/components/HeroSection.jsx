import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaFeatherAlt, FaStar } from 'react-icons/fa';
import axios from 'axios';
import gsap from 'gsap';
import heroImg from '../assets/hero.png';

const STATS = [
  { value: '12,400+', label: 'Novels'  },
  { value: '3,200+',  label: 'Authors' },
  { value: '980K+',   label: 'Readers' },
];

const HeroSection = () => {
  const bgRef      = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef   = useRef(null);
  const descRef    = useRef(null);
  const ctaRef     = useRef(null);
  const statsRef   = useRef(null);
  const badgeRef   = useRef(null);

  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/get_recent_novels`)
      .then(res => { if (res.data.data?.length) setFeatured(res.data.data[0]); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.1 });

    // Slow zoom on background
    gsap.to(bgRef.current, {
      scale: 1.12,
      duration: 18,
      ease: 'none',
      repeat: -1,
      yoyo: true,
    });

    tl.fromTo(eyebrowRef.current, { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.7 })
      .fromTo(titleRef.current,   { opacity: 0, y: 40  }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.4')
      .fromTo(descRef.current,    { opacity: 0, y: 24  }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
      .fromTo(
        ctaRef.current ? Array.from(ctaRef.current.children) : [],
        { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.12 }, '-=0.4'
      )
      .fromTo(
        statsRef.current ? Array.from(statsRef.current.children) : [],
        { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, '-=0.3'
      )
      .fromTo(badgeRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.6');

    return () => { tl.kill(); };
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-hidden flex items-center"
      style={{ background: '#000A18' }}
    >
      {/* ── Background image ── */}
      <div ref={bgRef} className="absolute inset-0 z-0"
        style={{
          backgroundImage:    `url(${heroImg})`,
          backgroundSize:     'cover',
          backgroundPosition: 'center 20%',
          filter:             'brightness(0.75) saturate(0.85)',
          transform:          'scale(1.04)',
          willChange:         'transform',
        }}
      />

      {/* Left-to-right overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'linear-gradient(100deg, rgba(0,6,15,0.92) 0%, rgba(0,10,24,0.82) 30%, rgba(0,10,24,0.55) 55%, rgba(0,10,24,0.10) 75%, transparent 100%)',
        }}
      />
      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 z-[2] pointer-events-none"
        style={{ height: 160, background: 'linear-gradient(to bottom, rgba(0,6,15,0.55), transparent)' }}
      />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 z-[2] pointer-events-none"
        style={{ height: 180, background: 'linear-gradient(to top, rgba(0,6,15,0.9), transparent)' }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full pt-[68px]">
        <div className="max-w-[560px] py-28">

          {/* Eyebrow */}
          <div ref={eyebrowRef} className="flex items-center gap-3 mb-6" style={{ opacity: 0 }}>
            <div className="h-px w-7 opacity-70" style={{ background: '#C09365' }} />
            <span className="font-sans font-semibold uppercase"
              style={{ fontSize: '0.72rem', letterSpacing: '0.14em', color: '#C09365' }}
            >
              Your Reading Journey Awaits
            </span>
          </div>

          {/* Title */}
          <h1 ref={titleRef} className="font-serif font-extrabold leading-[1.07] mb-6"
            style={{ fontSize: 'clamp(2.6rem, 5vw, 4.2rem)', letterSpacing: '-0.02em', color: '#F9F6F2', opacity: 0 }}
          >
            Lose Yourself<br />
            In{' '}
            <em style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #E06060 0%, #C94040 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              A Great Story
            </em>
          </h1>

          {/* Description */}
          <p ref={descRef} className="font-sans leading-relaxed mb-10"
            style={{ fontSize: '1.0625rem', color: 'rgba(237,232,225,0.72)', maxWidth: 440, opacity: 0 }}
          >
            Discover thousands of novels across every genre — from timeless classics to gripping
            new releases. Read anywhere, track your progress, and share your own stories with the world.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-4 mb-14">
            <Link to="/books"
              className="inline-flex items-center gap-2 font-sans font-semibold rounded-[10px] transition-all duration-300"
              style={{
                fontSize: '0.9375rem',
                color: '#F9F6F2',
                background: '#801818',
                padding: '0.8rem 1.9rem',
                letterSpacing: '0.01em',
                opacity: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#6B1414'; e.currentTarget.style.boxShadow = '0 0 28px rgba(128,24,24,0.45)'; e.currentTarget.style.transform = 'scale(1.03) translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#801818'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
            >
              Explore The Library
              <FaArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link to="/become-author"
              className="inline-flex items-center gap-2 font-sans font-medium rounded-[10px] transition-all duration-300"
              style={{
                fontSize: '0.9375rem',
                color: 'rgba(237,232,225,0.85)',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(192,147,101,0.35)',
                padding: '0.8rem 1.6rem',
                letterSpacing: '0.01em',
                opacity: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.11)'; e.currentTarget.style.borderColor = 'rgba(192,147,101,0.65)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(192,147,101,0.35)'; }}
            >
              <FaFeatherAlt className="w-3.5 h-3.5" />
              Become an Author
            </Link>
          </div>

          {/* Stats row */}
          <div ref={statsRef}
            className="flex items-center gap-8 pt-7"
            style={{ borderTop: '1px solid rgba(192,147,101,0.18)' }}
          >
            {STATS.map(({ value, label }, i) => (
              <div key={label} className="flex items-center gap-8" style={{ opacity: 0 }}>
                <div className="flex flex-col gap-1">
                  <span className="font-serif font-bold"
                    style={{ fontSize: '1.65rem', color: '#F9F6F2', letterSpacing: '-0.02em', lineHeight: 1 }}
                  >{value}</span>
                  <span className="font-sans font-medium uppercase"
                    style={{ fontSize: '0.72rem', letterSpacing: '0.1em', color: '#C09365', opacity: 0.8 }}
                  >{label}</span>
                </div>
                {i < STATS.length - 1 && (
                  <div style={{ width: 1, height: 36, background: 'rgba(192,147,101,0.2)', flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Featured badge (bottom-right) ── */}
      <div ref={badgeRef}
        className="absolute bottom-10 right-6 sm:right-10 z-20 flex items-center gap-3 rounded-2xl"
        style={{
          background:    'rgba(0,10,24,0.75)',
          backdropFilter:'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border:        '1px solid rgba(192,147,101,0.25)',
          padding:       '1rem 1.4rem',
          maxWidth:      280,
          opacity:       0,
        }}
      >
        {/* Mini cover */}
        <div className="rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden"
          style={{ width: 48, height: 64, background: 'linear-gradient(135deg, #801818 0%, #3D0C02 100%)' }}
        >
          {featured?.cover_image
            ? <img src={featured.cover_image} alt={featured.title} className="w-full h-full object-cover" />
            : <span className="font-serif italic text-xl" style={{ color: 'rgba(237,232,225,0.5)' }}>✦</span>
          }
        </div>

        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="font-sans font-semibold uppercase"
            style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: '#C09365' }}
          >Featured Read</span>
          <span className="font-serif font-semibold leading-tight truncate"
            style={{ fontSize: '0.95rem', color: '#F9F6F2' }}
          >
            {featured?.title || 'The Saga of Iron & Ink'}
          </span>
          <span className="font-sans truncate"
            style={{ fontSize: '0.72rem', color: 'rgba(237,232,225,0.5)', marginTop: 1 }}
          >
            {featured ? `by ${featured.author}` : 'by Eirik Valdsson · Fantasy'}
          </span>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="w-2.5 h-2.5" style={{ color: '#C09365' }} />
            ))}
            <span className="font-sans ml-1" style={{ fontSize: '0.68rem', color: 'rgba(192,147,101,0.5)' }}>4.9</span>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
