import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaHome,
  FaBook,
  FaHeart,
  FaEnvelope,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import Button from "./ui/Button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle logout
  const handleLogout = () => {
    dispatch(authActions.logout());
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const menuItems = [
    { title: "Home", link: "/", icon: FaHome },
    { title: "Books", link: "/books", icon: FaBook },
    { title: "Contact", link: "/contact", icon: FaEnvelope },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-2 px-6 md:px-8">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center">
            <img
              src="/images/LOGO.png"
              alt="Library of Heaven"
              className="h-16 w-auto transform scale-150"
            />
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.link}
              className={`flex items-center px-3 py-2 rounded-lg text-gray-600 hover:text-red-500 hover:bg-red-50 text-lg transition-all duration-300 ${
                location.pathname === item.link ? "text-red-500" : ""
              }`}
            >
              <item.icon className="mr-2 w-6 h-6" />
              {item.title}
            </Link>
          ))}

          <Link
            to="/cart"
            className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:text-red-500 hover:bg-red-50 text-lg transition-all duration-300"
          >
            <FaShoppingCart className="mr-2 w-6 h-6" />
            Cart
          </Link>

          {isLoggedIn ? (
            <Link
              to="/profile"
              className="flex items-center px-3 py-2 rounded-lg text-gray-600 hover:text-red-500 hover:bg-red-50 text-lg transition-all duration-300"
            >
              <FaUser className="mr-2 w-6 h-6" />
              Profile
            </Link>
          ) : (
            <div className="flex space-x-3">
              <Button
                to="/login"
                variant="outline"
                size="sm"
                className="text-lg"
              >
                Sign In
              </Button>
              <Button
                to="/signup"
                variant="primary"
                size="sm"
                className="text-lg"
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden p-1.5 rounded-lg text-gray-600 hover:text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="bg-white md:hidden border-t border-gray-100 animate-fade-in">
          <div className="flex flex-col space-y-2 py-6 px-6">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                to={item.link}
                className={`flex items-center px-4 py-3 rounded-lg text-gray-600 hover:text-red-500 hover:bg-red-50 text-lg transition-all duration-300 ${
                  location.pathname === item.link ? "text-red-500" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="mr-3 w-6 h-6" />
                {item.title}
              </Link>
            ))}

            <Link
              to="/cart"
              className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:text-red-500 hover:bg-red-50 text-lg transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaShoppingCart className="mr-3 w-6 h-6" />
              Cart
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:text-red-500 hover:bg-red-50 text-lg transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUser className="mr-3 w-6 h-6" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:text-red-500 hover:bg-red-50 text-lg transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-3 mt-4 pt-4 border-t border-gray-100">
                <Button
                  to="/login"
                  variant="outline"
                  fullWidth
                  className="text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Button>
                <Button
                  to="/signup"
                  variant="primary"
                  fullWidth
                  className="text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
