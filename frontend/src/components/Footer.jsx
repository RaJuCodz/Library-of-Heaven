import React from "react";
import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaHeart,
  FaBook,
  FaHome,
  FaUser,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-parchment-300 dark:bg-navy-800 border-t border-parchment-400 dark:border-navy-600 transition-colors duration-300">
      {/* Decorative top line */}
      <div className="h-px bg-gradient-to-r from-transparent via-wine-600/50 to-transparent dark:via-wine-500/40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand column */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3 mb-5">
              <img src="/images/LOGO.png" alt="Library of Heaven" className="h-10 w-auto" />
              <span className="font-serif font-bold text-xl text-wine-700 dark:text-wine-400 leading-none">
                Library<br />
                <span className="font-sans text-xs font-medium text-toffee-600 dark:text-toffee-300 tracking-widest uppercase">
                  of Heaven
                </span>
              </span>
            </Link>

            <p className="font-sans text-sm leading-relaxed text-toffee-700 dark:text-parchment-400 mb-6 max-w-xs">
              Discover your next adventure with our curated collection of books —
              stories that inspire, educate, and endure through time.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/RajuCodz"
                target="_blank" rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-parchment-200 dark:bg-navy-700 text-toffee-600 dark:text-parchment-300 hover:bg-wine-600 hover:text-white dark:hover:bg-wine-600 dark:hover:text-white transition-all duration-250 shadow-sm"
                aria-label="GitHub"
              >
                <FaGithub className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/raju-gupta-871925280/"
                target="_blank" rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-parchment-200 dark:bg-navy-700 text-toffee-600 dark:text-parchment-300 hover:bg-wine-600 hover:text-white dark:hover:bg-wine-600 dark:hover:text-white transition-all duration-250 shadow-sm"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:itsraajjjuuuu@gmail.com"
                className="p-2.5 rounded-lg bg-parchment-200 dark:bg-navy-700 text-toffee-600 dark:text-parchment-300 hover:bg-wine-600 hover:text-white dark:hover:bg-wine-600 dark:hover:text-white transition-all duration-250 shadow-sm"
                aria-label="Email"
              >
                <FaEnvelope className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="section-subheading mb-5">Quick Links</p>
            <ul className="space-y-3">
              {[
                { to: "/",       icon: FaHome, label: "Home"    },
                { to: "/books",  icon: FaBook, label: "Browse Books" },
                { to: "/profile",icon: FaUser, label: "My Profile" },
                { to: "/contact",icon: FaEnvelope, label: "Contact Us" },
              ].map(({ to, icon: Icon, label }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="flex items-center gap-3 text-sm text-toffee-700 dark:text-parchment-400 hover:text-wine-600 dark:hover:text-wine-400 transition-colors duration-200 group"
                  >
                    <span className="w-6 h-6 rounded-md flex items-center justify-center bg-parchment-200 dark:bg-navy-700 text-wine-600 dark:text-wine-400 group-hover:bg-wine-600 group-hover:text-white dark:group-hover:bg-wine-600 transition-all duration-200">
                      <Icon className="w-3 h-3" />
                    </span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Inspiration */}
          <div>
            <p className="section-subheading mb-5">A Word of Wisdom</p>
            <blockquote className="relative pl-4 border-l-2 border-wine-600 dark:border-wine-500">
              <p className="font-serif text-lg italic text-toffee-800 dark:text-parchment-300 leading-relaxed mb-3">
                "A room without books is like a body without a soul."
              </p>
              <cite className="font-sans text-xs text-toffee-500 dark:text-toffee-400 tracking-wide not-italic">
                — Marcus Tullius Cicero
              </cite>
            </blockquote>
          </div>
        </div>

        {/* Divider */}
        <div className="divider-wine mb-8" />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-toffee-600 dark:text-parchment-500 font-sans">
          <p>© {new Date().getFullYear()} Library of Heaven. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with
            <FaHeart className="text-wine-500 w-3 h-3" />
            by{" "}
            <a
              href="https://github.com/RajuCodz"
              target="_blank" rel="noopener noreferrer"
              className="text-wine-600 dark:text-wine-400 font-semibold hover:underline"
            >
              RajuCodz
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
