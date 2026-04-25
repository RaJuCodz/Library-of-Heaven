import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaHeart } from "react-icons/fa";

const COLS = [
  {
    heading: "Quick Links",
    items: [
      { label: "Home",          to: "/"              },
      { label: "Library",       to: "/books"         },
      { label: "Authors",       to: "/author-profile"},
      { label: "Favourites",    to: "/profile/library"},
      { label: "Wallet",        to: "/wallet"        },
    ],
  },
  {
    heading: "For Writers",
    items: [
      { label: "Become Author", to: "/become-author" },
      { label: "Dashboard",     to: "/author-profile"},
      { label: "Upload Book",   to: "/author-profile"},
    ],
  },
  {
    heading: "Support",
    items: [
      { label: "Contact Us",    to: "/contact"       },
      { label: "Privacy Policy",to: "/"              },
      { label: "Terms of Use",  to: "/"              },
    ],
  },
];

const SOCIALS = [
  { href: "https://github.com/RajuCodz",                       Icon: FaGithub,   label: "GitHub"  },
  { href: "https://www.linkedin.com/in/raju-gupta-871925280/", Icon: FaLinkedin, label: "LinkedIn"},
  { href: "mailto:itsraajjjuuuu@gmail.com",                    Icon: FaEnvelope, label: "Email"   },
];

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0  },
  viewport:    { once: true },
  transition:  { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer style={{ background: '#080503', borderTop: '1px solid rgba(107,79,47,0.2)' }}>

      {/* Gilt top accent */}
      <div className="h-[2px]"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #C9A84C 30%, #F0DE9A 50%, #C9A84C 70%, transparent 100%)' }}
      />

      {/* Newsletter strip */}
      <div className="relative overflow-hidden py-5"
        style={{ background: 'linear-gradient(135deg, #801818 0%, #3D0C02 100%)' }}
      >
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #F0DE9A 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="flex flex-col sm:flex-row items-center justify-between gap-5" {...fadeUp(0)}>
            <div className="text-center sm:text-left">
              <h3 className="font-serif text-lg font-bold leading-tight" style={{ color: '#FDFCFB' }}>Never Miss A Chapter</h3>
              <p className="font-sans text-xs mt-1" style={{ color: 'rgba(253,252,251,0.6)' }}>
                Weekly picks · new releases · author spotlights
              </p>
            </div>
            <div className="flex w-full sm:w-auto gap-2 max-w-sm">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-2 rounded-lg font-sans text-xs focus:outline-none"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: '#FDFCFB',
                }}
              />
              <button
                className="px-5 py-2 rounded-lg font-sans font-semibold text-xs shrink-0 transition-opacity hover:opacity-90"
                style={{ background: '#FDFCFB', color: '#801818' }}
              >
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 4-column body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <motion.div {...fadeUp(0.05)}>
            <Link to="/" className="inline-block mb-4">
              <span className="font-serif text-xl font-bold leading-none" style={{ color: '#F9F6F2' }}>
                Library <em style={{ fontStyle: 'italic', color: '#C94040' }}>of Heaven</em>
              </span>
            </Link>
            <p className="font-sans text-xs leading-relaxed mb-5"
              style={{ color: 'rgba(192,147,101,0.55)', maxWidth: 220 }}
            >
              Discover thousands of novels across every genre — from timeless classics to gripping new releases.
            </p>
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ href, Icon, label }) => (
                <motion.a
                  key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                  style={{ background: 'rgba(192,147,101,0.08)', border: '1px solid rgba(192,147,101,0.18)' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: '#C09365' }} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {COLS.map((col, i) => (
            <motion.div key={col.heading} {...fadeUp(0.05 + (i + 1) * 0.05)}>
              <p className="font-sans text-xs font-semibold uppercase mb-4"
                style={{ color: '#AB7543', letterSpacing: '0.12em' }}
              >{col.heading}</p>
              <ul className="space-y-2.5">
                {col.items.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to}
                      className="font-sans text-sm transition-colors"
                      style={{ color: 'rgba(192,147,101,0.55)' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'rgba(192,147,101,0.9)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(192,147,101,0.55)'}
                    >{label}</Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6" style={{ borderTop: '1px solid rgba(107,79,47,0.2)' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-sans text-xs" style={{ color: 'rgba(107,79,47,0.5)' }}>
              © {new Date().getFullYear()} Library of Heaven. All rights reserved.
            </p>
            <p className="font-sans text-xs flex items-center gap-1.5" style={{ color: 'rgba(107,79,47,0.5)' }}>
              Made with
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              >
                <FaHeart className="w-3 h-3" style={{ color: '#C94040' }} />
              </motion.span>
              by{" "}
              <a href="https://github.com/RajuCodz" target="_blank" rel="noopener noreferrer"
                className="font-semibold hover:underline" style={{ color: '#AB7543' }}
              >RajuCodz</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
