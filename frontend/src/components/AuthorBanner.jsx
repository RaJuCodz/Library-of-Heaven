import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaPenFancy, FaFeatherAlt } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ParticleCanvas from "./ParticleCanvas";

gsap.registerPlugin(ScrollTrigger);

// Person writing by candlelight — cottonbro studio on Pexels
const AUTHOR_IMAGE =
  "https://images.pexels.com/photos/6037391/pexels-photo-6037391.jpeg";

const AuthorBanner = () => {
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const headRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
        },
      });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.6 },
      )
        .fromTo(
          headRef.current,
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.3",
        )
        .fromTo(
          subRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.65 },
          "-=0.4",
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.55 },
          "-=0.3",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-96 overflow-hidden">
      {/* Background — author writing by candlelight */}
      <img
        src={AUTHOR_IMAGE}
        alt="Author writing by candlelight — cottonbro studio on Pexels"
        className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        style={{ filter: "brightness(0.50) saturate(0.70)" }}
      />

      {/* Three.js ember particle layer */}
      <ParticleCanvas preset="embers" style={{ zIndex: 2 }} />

      {/* Gradient overlays */}
      <div
        className="absolute inset-0 bg-gradient-to-t
        from-parchment-200 via-parchment-200/35 to-transparent
        dark:from-navy-900 dark:via-navy-900/40
        transition-colors duration-300"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r
        from-parchment-200/90 via-parchment-200/50 to-transparent
        dark:from-navy-900/90 dark:via-navy-900/55
        transition-colors duration-300"
      />

      {/* Content */}
      <div
        className="absolute inset-0 flex items-center z-10
        max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-lg">
          {/* Sub-label */}
          <p
            ref={badgeRef}
            style={{ opacity: 0 }}
            className="section-subheading mb-3
              text-wine-600 dark:text-wine-400
              flex items-center gap-2"
          >
            <FaFeatherAlt className="w-3 h-3" />
            For Writers
          </p>

          {/* Heading */}
          <h2
            ref={headRef}
            style={{ opacity: 0 }}
            className="font-serif text-4xl md:text-5xl font-bold
              text-parchment-900 dark:text-parchment-50
              drop-shadow-lg leading-tight mb-3"
          >
            Share Your Story
            <br />
            <span className="italic text-wine-600 dark:text-wine-400">
              With The World
            </span>
          </h2>

          {/* Description */}
          <p
            ref={subRef}
            style={{ opacity: 0 }}
            className="font-sans text-sm md:text-base
              text-toffee-800 dark:text-parchment-300
              leading-relaxed mb-5 max-w-sm"
          >
            Every great novel starts with a single chapter. Join our growing
            community of authors — write, publish, and earn from your work.
          </p>

          {/* CTA */}
          <Link
            ref={ctaRef}
            to="/become-author"
            style={{ opacity: 0, display: "inline-flex" }}
            className="items-center gap-2
              font-sans text-sm font-semibold
              text-wine-700 dark:text-wine-400
              hover:text-wine-500 dark:hover:text-wine-300
              transition-colors duration-200 group"
          >
            <FaPenFancy className="w-3.5 h-3.5" />
            Become an Author
            <FaArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AuthorBanner;
