import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaPenFancy, FaFeatherAlt, FaBookOpen } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ParticleCanvas from "./ParticleCanvas";

gsap.registerPlugin(ScrollTrigger);

const AUTHOR_IMAGE =
  "https://images.pexels.com/photos/6037391/pexels-photo-6037391.jpeg";

const PERKS = [
  { icon: FaPenFancy,  label: "Write & Publish"  },
  { icon: FaBookOpen,  label: "Earn from Readers" },
  { icon: FaFeatherAlt,label: "Build Your Audience"},
];

const AuthorBanner = () => {
  const sectionRef = useRef(null);
  const tagRef     = useRef(null);
  const headRef    = useRef(null);
  const subRef     = useRef(null);
  const perksRef   = useRef(null);
  const ctaRef     = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });

      tl.fromTo(tagRef.current,  { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.6 })
        .fromTo(headRef.current, { opacity: 0, y: 40  }, { opacity: 1, y: 0, duration: 0.85 }, "-=0.3")
        .fromTo(subRef.current,  { opacity: 0, y: 22  }, { opacity: 1, y: 0, duration: 0.65 }, "-=0.45")
        .fromTo(perksRef.current ? Array.from(perksRef.current.children) : [],
          { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, "-=0.35")
        .fromTo(ctaRef.current,  { opacity: 0, y: 14  }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.2");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full min-h-[480px] overflow-hidden">
      {/* Background photo */}
      <img
        src={AUTHOR_IMAGE}
        alt="Author writing by candlelight"
        className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        style={{ filter: "brightness(0.42) saturate(0.60)" }}
      />

      {/* Ember particles */}
      <ParticleCanvas preset="embers" style={{ zIndex: 2 }} />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/50 to-transparent" />

      {/* Star dot overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-[1]"
        style={{
          backgroundImage: 'radial-gradient(circle, #F0DE9A 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center min-h-[480px]
        max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="max-w-lg">

          {/* Tag */}
          <div ref={tagRef} style={{ opacity: 0 }}
            className="inline-flex items-center gap-2 mb-5"
          >
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full
              border border-gilt-500/30 bg-gilt-500/10 backdrop-blur-sm"
            >
              <FaFeatherAlt className="w-3 h-3 text-gilt-400" />
              <span className="badge-cinzel text-gilt-400">For Writers</span>
            </div>
          </div>

          {/* Heading */}
          <h2 ref={headRef} style={{ opacity: 0 }}
            className="font-serif text-4xl md:text-5xl font-bold
              text-parchment-50 drop-shadow-lg leading-[1.05] mb-4"
          >
            Share Your Story
            <br />
            <span className="italic font-light"
              style={{
                background: 'linear-gradient(135deg, #F0DE9A 0%, #C9A84C 60%, #9A7A1F 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              With The World
            </span>
          </h2>

          {/* Sub */}
          <p ref={subRef} style={{ opacity: 0 }}
            className="font-sans text-base text-parchment-300 leading-relaxed mb-7 max-w-sm"
          >
            Every great novel starts with a single chapter. Join our growing
            community of authors — write, publish, and earn from your work.
          </p>

          {/* Perks */}
          <div ref={perksRef} className="flex flex-wrap gap-3 mb-8">
            {PERKS.map(({ icon: Icon, label }) => (
              <div key={label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                  border border-gilt-500/25 bg-gilt-500/8 backdrop-blur-sm"
              >
                <Icon className="w-3 h-3 text-gilt-400" />
                <span className="font-sans text-xs font-medium text-parchment-200">{label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link ref={ctaRef} to="/become-author"
            style={{ opacity: 0, display: "inline-flex", background: 'linear-gradient(135deg, #F0DE9A 0%, #C9A84C 50%, #B8922A 100%)' }}
            className="items-center gap-2.5 px-7 py-3.5 rounded-xl
              font-sans font-semibold text-sm text-navy-950
              shadow-lg hover:shadow-glow-gilt transition-all duration-300 hover:scale-[1.02]"
          >
            <FaPenFancy className="w-3.5 h-3.5" />
            Become an Author
            <FaArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AuthorBanner;
