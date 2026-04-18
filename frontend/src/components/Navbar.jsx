import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaMoon, FaSun, FaWallet, FaUser, FaBars, FaTimes,
  FaHome, FaBook, FaEnvelope, FaPenFancy, FaSignOutAlt,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isLoggedIn = useSelector((s) => s.auth.isLoggedIn);
  const userRole   = useSelector((s) => s.auth.role);
  const dispatch   = useDispatch();
  const location   = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    dispatch(authActions.logout());
    ["token","id","role"].forEach((k) => localStorage.removeItem(k));
    window.location.href = "/";
  };

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const menuItems = [
    { title: "Home",    link: "/",       icon: FaHome    },
    { title: "Books",   link: "/books",  icon: FaBook    },
    { title: "Contact", link: "/contact",icon: FaEnvelope},
  ];

  const navLinkCls = (path) =>
    [
      "relative flex items-center gap-2 px-3 py-2 text-sm font-medium font-sans rounded-lg transition-all duration-200",
      isActive(path)
        ? "text-gilt-600 dark:text-gilt-400"
        : "text-toffee-800 dark:text-parchment-300 hover:text-gilt-600 dark:hover:text-gilt-400",
    ].join(" ");

  const activeDot = (path) =>
    isActive(path) ? (
      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gilt-500 dark:bg-gilt-400" />
    ) : null;

  return (
    <nav className={[
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled
        ? "bg-parchment-50/95 dark:bg-navy-800/95 backdrop-blur-md border-b border-parchment-400/40 dark:border-navy-600/60 shadow-sm"
        : "bg-parchment-50/80 dark:bg-navy-900/80 backdrop-blur-sm border-b border-transparent",
    ].join(" ")}>

      {/* Gilt accent top line */}
      <div className="h-[2px]"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #C9A84C 30%, #F0DE9A 50%, #C9A84C 70%, transparent 100%)' }}
      />

      <div className="max-w-7xl mx-auto flex items-center justify-between h-15 px-4 sm:px-6 lg:px-8"
        style={{ height: '60px' }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src="/images/LOGO.png" alt="Library of Heaven" className="h-9 w-auto" />
          <span className="hidden sm:block leading-none">
            <span className="font-cinzel font-bold text-base text-gilt-700 dark:text-gilt-400 block leading-tight">
              Library
            </span>
            <span className="font-sans text-[10px] font-medium text-toffee-600 dark:text-toffee-300 tracking-[0.22em] uppercase block">
              of Heaven
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {menuItems.map((item) => (
            <Link key={item.title} to={item.link} className={navLinkCls(item.link)}>
              <item.icon className="w-3.5 h-3.5" />
              {item.title}
              {activeDot(item.link)}
            </Link>
          ))}

          <Link to="/wallet" className={navLinkCls("/wallet")}>
            <FaWallet className="w-3.5 h-3.5" /> Wallet {activeDot("/wallet")}
          </Link>

          {isLoggedIn ? (
            <>
              {userRole === "reader" && (
                <Link to="/become-author" className={navLinkCls("/become-author")}>
                  <FaPenFancy className="w-3.5 h-3.5" /> Become Author {activeDot("/become-author")}
                </Link>
              )}
              {(userRole === "author" || userRole === "admin") && (
                <Link to="/author-profile" className={navLinkCls("/author-profile")}>
                  <FaPenFancy className="w-3.5 h-3.5" /> Author Dashboard {activeDot("/author-profile")}
                </Link>
              )}
              <Link to="/profile" className={navLinkCls("/profile")}>
                <FaUser className="w-3.5 h-3.5" /> Profile {activeDot("/profile")}
              </Link>
              <button onClick={handleLogout}
                className="ml-1 flex items-center gap-1.5 px-3 py-2 text-sm font-medium
                  text-toffee-700 dark:text-parchment-400 hover:text-wine-600 dark:hover:text-wine-400
                  rounded-lg transition-colors duration-200"
              >
                <FaSignOutAlt className="w-3.5 h-3.5" /> Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Link to="/login"
                className="px-4 py-2 rounded-lg font-sans font-medium text-sm
                  text-toffee-700 dark:text-parchment-300 hover:text-gilt-600 dark:hover:text-gilt-400
                  transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link to="/signup"
                className="px-4 py-2 rounded-lg font-sans font-semibold text-sm text-navy-950
                  shadow-sm hover:shadow-glow-gilt transition-all duration-250"
                style={{ background: 'linear-gradient(135deg, #F0DE9A, #C9A84C, #B8922A)' }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1">
          <button onClick={toggleTheme}
            className="p-2 rounded-lg text-toffee-600 dark:text-parchment-300
              hover:bg-parchment-300 dark:hover:bg-navy-700 transition-all duration-200"
            aria-label="Toggle theme"
          >
            {theme === "dark"
              ? <FaSun className="w-4 h-4 text-gilt-400" />
              : <FaMoon className="w-4 h-4" />}
          </button>

          <button
            className="md:hidden p-2 rounded-lg text-toffee-700 dark:text-parchment-300
              hover:bg-parchment-300 dark:hover:bg-navy-700 transition-all duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-parchment-100/98 dark:bg-navy-800/98 backdrop-blur-md
          border-t border-parchment-300 dark:border-navy-600 animate-fade-in"
        >
          <div className="flex flex-col gap-1 py-4 px-4">
            {menuItems.map((item) => (
              <Link key={item.title} to={item.link}
                onClick={() => setIsMenuOpen(false)}
                className={[
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive(item.link)
                    ? "bg-gilt-500/10 text-gilt-700 dark:text-gilt-400"
                    : "text-toffee-800 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-navy-700",
                ].join(" ")}
              >
                <item.icon className="w-4 h-4" /> {item.title}
              </Link>
            ))}

            <Link to="/wallet" onClick={() => setIsMenuOpen(false)}
              className={[
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive("/wallet")
                  ? "bg-gilt-500/10 text-gilt-700 dark:text-gilt-400"
                  : "text-toffee-800 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-navy-700",
              ].join(" ")}
            >
              <FaWallet className="w-4 h-4" /> Wallet
            </Link>

            {isLoggedIn ? (
              <>
                {userRole === "reader" && (
                  <Link to="/become-author" onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-toffee-800 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-navy-700 transition-all duration-200"
                  >
                    <FaPenFancy className="w-4 h-4" /> Become Author
                  </Link>
                )}
                {(userRole === "author" || userRole === "admin") && (
                  <Link to="/author-profile" onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-toffee-800 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-navy-700 transition-all duration-200"
                  >
                    <FaPenFancy className="w-4 h-4" /> Author Dashboard
                  </Link>
                )}
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-toffee-800 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-navy-700 transition-all duration-200"
                >
                  <FaUser className="w-4 h-4" /> Profile
                </Link>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-wine-600 dark:text-wine-400 hover:bg-wine-50 dark:hover:bg-wine-900/20 transition-all duration-200"
                >
                  <FaSignOutAlt className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-parchment-300 dark:border-navy-600">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}
                  className="text-center px-4 py-3 rounded-xl border border-parchment-300 dark:border-navy-500 text-sm font-medium text-toffee-700 dark:text-parchment-300 hover:border-gilt-500/50 transition-all"
                >
                  Sign In
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}
                  className="text-center px-4 py-3 rounded-xl font-sans font-semibold text-sm text-navy-950"
                  style={{ background: 'linear-gradient(135deg, #F0DE9A, #C9A84C, #B8922A)' }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
