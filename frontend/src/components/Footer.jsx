import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaGithub, FaLinkedin, FaHeart, FaBook,
  FaHome, FaUser, FaEnvelope, FaPenFancy,
} from "react-icons/fa";

const LINKS = [
  { to: "/",              icon: FaHome,     label: "Home"         },
  { to: "/books",         icon: FaBook,     label: "Browse Books" },
  { to: "/profile",       icon: FaUser,     label: "My Profile"   },
  { to: "/become-author", icon: FaPenFancy, label: "Become Author"},
  { to: "/contact",       icon: FaEnvelope, label: "Contact Us"   },
];

const SOCIALS = [
  { href: "https://github.com/RajuCodz",                       icon: FaGithub,   label: "GitHub"  },
  { href: "https://www.linkedin.com/in/raju-gupta-871925280/", icon: FaLinkedin, label: "LinkedIn"},
  { href: "mailto:itsraajjjuuuu@gmail.com",                    icon: FaEnvelope, label: "Email"   },
];

const QUOTES = [
  { text: "A room without books is like a body without a soul.", author: "Marcus Tullius Cicero" },
  { text: "There is no friend as loyal as a book.",             author: "Ernest Hemingway"       },
];

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0  },
  viewport:    { once: true },
  transition:  { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

const Footer = () => (
  <footer className="bg-parchment-300 dark:bg-navy-800 border-t border-parchment-400 dark:border-navy-600 transition-colors duration-300">

    {/* Gilt top accent */}
    <div className="h-[2px]"
      style={{ background: 'linear-gradient(90deg, transparent 0%, #C9A84C 30%, #F0DE9A 50%, #C9A84C 70%, transparent 100%)' }}
    />

    {/* Newsletter strip */}
    <div className="relative overflow-hidden py-10"
      style={{ background: 'linear-gradient(135deg, #3D0C02 0%, #801818 40%, #5A4610 100%)' }}
    >
      {/* Star grid */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #F0DE9A 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-6"
          {...fadeUp(0)}
        >
          <div className="text-center md:text-left">
            <h3 className="font-serif text-2xl font-bold text-parchment-50 mb-1">
              Never Miss a New Arrival
            </h3>
            <p className="font-sans text-sm text-parchment-300">
              Get notified when new books land in our collection.
            </p>
          </div>
          <div className="flex w-full md:w-auto gap-2 max-w-sm">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-2.5 rounded-xl bg-parchment-50/12 backdrop-blur-sm
                border border-parchment-100/20 text-parchment-50 placeholder-parchment-400/60
                font-sans text-sm focus:outline-none focus:ring-2 focus:ring-gilt-400/40 transition-all"
            />
            <button
              className="px-5 py-2.5 rounded-xl font-sans font-semibold text-sm text-navy-950 shrink-0
                hover:shadow-glow-gilt transition-all duration-250"
              style={{ background: 'linear-gradient(135deg, #F0DE9A, #C9A84C)' }}
            >
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>
    </div>

    {/* Main body */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

        {/* Brand */}
        <motion.div {...fadeUp(0.05)}>
          <Link to="/" className="inline-flex items-center gap-3 mb-5 group">
            <img src="/images/LOGO.png" alt="Library of Heaven" className="h-10 w-auto" />
            <span className="leading-none">
              <span className="font-cinzel font-bold text-lg text-gilt-700 dark:text-gilt-400 block leading-tight group-hover:text-gilt-600 transition-colors">
                Library
              </span>
              <span className="font-sans text-[10px] font-medium text-toffee-600 dark:text-toffee-300 tracking-[0.22em] uppercase block">
                of Heaven
              </span>
            </span>
          </Link>
          <p className="font-sans text-sm leading-relaxed text-toffee-700 dark:text-parchment-400 mb-6 max-w-xs">
            Discover timeless classics and modern masterpieces. Every page is a world waiting to be explored.
          </p>
          <div className="flex items-center gap-3">
            {SOCIALS.map(({ href, icon: Icon, label }) => (
              <motion.a
                key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="w-9 h-9 rounded-xl bg-parchment-200 dark:bg-navy-700 text-toffee-600 dark:text-parchment-300
                  flex items-center justify-center shadow-sm hover:shadow-glow-gilt transition-all duration-250"
                style={{}}
                whileHover={{ scale: 1.1, background: 'linear-gradient(135deg, #F0DE9A, #C9A84C)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Quick links */}
        <motion.div {...fadeUp(0.1)}>
          <p className="section-subheading mb-5">Quick Links</p>
          <ul className="space-y-3">
            {LINKS.map(({ to, icon: Icon, label }) => (
              <li key={label}>
                <Link to={to}
                  className="flex items-center gap-3 text-sm text-toffee-700 dark:text-parchment-400
                    hover:text-gilt-600 dark:hover:text-gilt-400 transition-colors duration-200 group"
                >
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center
                    bg-parchment-200 dark:bg-navy-700 text-toffee-600 dark:text-toffee-400
                    group-hover:text-navy-950 transition-all duration-200"
                    style={{ '--tw-bg-opacity': 1 }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #F0DE9A, #C9A84C)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = ''}
                  >
                    <Icon className="w-3 h-3" />
                  </span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Quotes */}
        <motion.div {...fadeUp(0.15)}>
          <p className="section-subheading mb-5">Words of Wisdom</p>
          <div className="space-y-5">
            {QUOTES.map(({ text, author }) => (
              <blockquote key={author} className="relative pl-4"
                style={{ borderLeft: '2px solid rgba(201,168,76,0.5)' }}
              >
                <p className="font-serif text-base italic text-toffee-800 dark:text-parchment-300 leading-relaxed mb-1.5">
                  &quot;{text}&quot;
                </p>
                <cite className="font-sans text-xs text-toffee-500 dark:text-toffee-500 not-italic tracking-wide">
                  — {author}
                </cite>
              </blockquote>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Gilt divider */}
      <div className="divider-gilt mb-8" />

      {/* Copyright */}
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-between gap-3"
        {...fadeUp(0.2)}
      >
        <p className="font-sans text-xs text-toffee-600 dark:text-parchment-500">
          © {new Date().getFullYear()} Library of Heaven. All rights reserved.
        </p>
        <p className="font-sans text-xs text-toffee-600 dark:text-parchment-500 flex items-center gap-1.5">
          Made with
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          >
            <FaHeart className="text-gilt-500 w-3 h-3" />
          </motion.span>
          by{" "}
          <a href="https://github.com/RajuCodz" target="_blank" rel="noopener noreferrer"
            className="text-gilt-600 dark:text-gilt-400 font-semibold hover:underline"
          >
            RajuCodz
          </a>
        </p>
      </motion.div>
    </div>
  </footer>
);

export default Footer;
