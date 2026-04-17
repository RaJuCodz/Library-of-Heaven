import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaHeart,
  FaBook,
  FaHome,
  FaUser,
  FaEnvelope,
  FaPenFancy,
} from "react-icons/fa";

const LINKS = [
  { to: "/",             icon: FaHome,     label: "Home"        },
  { to: "/books",        icon: FaBook,     label: "Browse Books" },
  { to: "/profile",      icon: FaUser,     label: "My Profile"  },
  { to: "/become-author",icon: FaPenFancy, label: "Become Author"},
  { to: "/contact",      icon: FaEnvelope, label: "Contact Us"  },
];

const SOCIALS = [
  { href: "https://github.com/RajuCodz",                      icon: FaGithub,   label: "GitHub"   },
  { href: "https://www.linkedin.com/in/raju-gupta-871925280/",icon: FaLinkedin, label: "LinkedIn" },
  { href: "mailto:itsraajjjuuuu@gmail.com",                   icon: FaEnvelope, label: "Email"    },
];

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 16 },
  whileInView:{ opacity: 1, y: 0  },
  viewport:   { once: true },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

const Footer = () => {
  return (
    <footer className="bg-parchment-300 dark:bg-navy-800 border-t border-parchment-400 dark:border-navy-600 transition-colors duration-300">
      {/* Decorative top accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-wine-600/60 to-transparent dark:via-wine-500/40" />

      {/* Newsletter strip */}
      <div className="bg-gradient-wine dark:bg-navy-700 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col md:flex-row items-center justify-between gap-6"
            {...fadeUp(0)}
          >
            <div className="text-center md:text-left">
              <h3 className="font-serif text-2xl font-bold text-parchment-50 mb-1">
                Never Miss a New Arrival
              </h3>
              <p className="font-sans text-sm text-wine-200 dark:text-parchment-400">
                Get notified when new books land in our collection.
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2 max-w-sm">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 rounded-lg bg-parchment-50/15 backdrop-blur-sm border border-parchment-100/20 text-parchment-50 placeholder-wine-200 dark:placeholder-parchment-500 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-parchment-100/40 transition-all"
              />
              <button className="px-4 py-2.5 rounded-lg bg-parchment-50 text-wine-700 font-sans font-semibold text-sm hover:bg-parchment-100 transition-colors duration-200 shrink-0">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main footer body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <motion.div {...fadeUp(0.05)}>
            <Link to="/" className="inline-flex items-center gap-3 mb-5 group">
              <img src="/images/LOGO.png" alt="Library of Heaven" className="h-10 w-auto" />
              <span className="font-serif font-bold text-xl text-wine-700 dark:text-wine-400 leading-none group-hover:text-wine-600 transition-colors">
                Library
                <br />
                <span className="font-sans text-xs font-medium text-toffee-600 dark:text-toffee-300 tracking-widest uppercase" style={{ letterSpacing: "0.16em" }}>
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
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-parchment-200 dark:bg-navy-700 text-toffee-600 dark:text-parchment-300 flex items-center justify-center shadow-sm hover:bg-wine-600 hover:text-white dark:hover:bg-wine-600 transition-all duration-250"
                  whileHover={{ scale: 1.1, rotate: 4 }}
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
                  <Link
                    to={to}
                    className="flex items-center gap-3 text-sm text-toffee-700 dark:text-parchment-400 hover:text-wine-600 dark:hover:text-wine-400 transition-colors duration-200 group"
                  >
                    <motion.span
                      className="w-7 h-7 rounded-lg flex items-center justify-center bg-parchment-200 dark:bg-navy-700 text-wine-600 dark:text-wine-400 group-hover:bg-wine-600 group-hover:text-white dark:group-hover:bg-wine-600 transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Icon className="w-3 h-3" />
                    </motion.span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Inspiration */}
          <motion.div {...fadeUp(0.15)}>
            <p className="section-subheading mb-5">Words of Wisdom</p>
            <blockquote className="relative pl-4 border-l-2 border-wine-600 dark:border-wine-500 mb-6">
              <p className="font-serif text-lg italic text-toffee-800 dark:text-parchment-300 leading-relaxed mb-2">
                &quot;A room without books is like a body without a soul.&quot;
              </p>
              <cite className="font-sans text-xs text-toffee-500 dark:text-toffee-400 not-italic tracking-wide">
                — Marcus Tullius Cicero
              </cite>
            </blockquote>
            <blockquote className="relative pl-4 border-l-2 border-toffee-500 dark:border-toffee-600">
              <p className="font-serif text-base italic text-toffee-700 dark:text-parchment-400 leading-relaxed mb-2">
                &quot;There is no friend as loyal as a book.&quot;
              </p>
              <cite className="font-sans text-xs text-toffee-500 dark:text-toffee-400 not-italic">
                — Ernest Hemingway
              </cite>
            </blockquote>
          </motion.div>

        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-parchment-400 dark:via-navy-600 to-transparent mb-8" />

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
            <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}>
              <FaHeart className="text-wine-500 w-3 h-3" />
            </motion.span>
            by{" "}
            <a
              href="https://github.com/RajuCodz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-wine-600 dark:text-wine-400 font-semibold hover:underline"
            >
              RajuCodz
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
