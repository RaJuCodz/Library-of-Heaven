import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGripLines, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const leftLinks = [
    { title: "Home", link: "/" },
    { title: "Books", link: "/books" },
  ];

  const rightLinks = isLoggedIn
    ? [
        { title: "Cart", link: "/cart" },
        { title: "Profile", link: "/profile" },
      ]
    : [];

  return (
    <div className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto flex items-center justify-between py-4 px-6 md:px-8">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-extrabold text-yellow-400 tracking-wide">
            Library of Heaven
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 text-lg">
          {leftLinks.map((link) => (
            <Link
              to={link.link}
              key={link.title}
              className="text-white hover:text-yellow-400 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              {link.title}
            </Link>
          ))}
          {rightLinks.map((link) => (
            <Link
              to={link.link}
              key={link.title}
              className="text-white hover:text-yellow-400 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              {link.title}
            </Link>
          ))}
        </div>

        {/* Sign Up / Sign In Buttons for Desktop */}
        {!isLoggedIn && (
          <div className="hidden md:flex space-x-4">
            <Link
              to="/signup"
              className="bg-yellow-500 text-black py-2 px-6 rounded-full text-lg font-semibold hover:bg-yellow-600 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-yellow-500 text-yellow-500 py-2 px-6 rounded-full text-lg font-semibold hover:bg-yellow-500 hover:text-black transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Sign In
            </Link>
          </div>
        )}

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes /> : <FaGripLines />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="bg-gray-800 text-white md:hidden">
          <div className="flex flex-col items-center space-y-4 py-6">
            {leftLinks.concat(rightLinks).map((link) => (
              <Link
                to={link.link}
                key={link.title}
                className="text-white hover:text-yellow-400 transition-all duration-300 ease-in-out transform hover:scale-105 text-lg"
                onClick={() => setIsMenuOpen(false)} // Close menu on link click
              >
                {link.title}
              </Link>
            ))}
            {/* Sign Up / Sign In Buttons for Mobile */}
            {!isLoggedIn && (
              <>
                <Link
                  to="/signup"
                  className="bg-yellow-500 text-black py-2 px-6 rounded-full text-lg font-semibold hover:bg-yellow-600 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-transparent border-2 border-yellow-500 text-yellow-500 py-2 px-6 rounded-full text-lg font-semibold hover:bg-yellow-500 hover:text-black transition-all duration-300 ease-in-out transform hover:scale-105"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
