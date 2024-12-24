import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGripLines, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { title: "Home", link: "/" },
    { title: "Books", link: "/books" },
    { title: "Cart", link: "/cart" },
    { title: "Profile", link: "/profile" },
  ];

  return (
    <div className="bg-black text-white shadow-lg">
      <div className="container mx-auto flex items-center justify-between py-6 px-8">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-extrabold text-[#ff7043] tracking-wide">
            Library of Heaven
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="navlinks hidden space-x-6 text-lg md:flex">
          {links.map((link) => (
            <Link
              to={link.link}
              key={link.title}
              className="text-white hover:text-[#ff7043] transition-all duration-300 ease-in-out transform hover:scale-110"
            >
              {link.title}
            </Link>
          ))}
        </div>

        {/* Sign Up / Sign In Buttons for Desktop */}
        <div className="hidden space-x-4 md:flex">
          <Link
            to="/signup"
            className="bg-[#ff7043] text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-[#ff5722] transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="bg-transparent border-2 border-[#ff7043] text-[#ff7043] py-2 px-6 rounded-full text-lg font-semibold hover:bg-[#ff7043] hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Sign In
          </Link>
        </div>

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
        <div className="bg-black text-white md:hidden">
          <div className="flex flex-col items-center space-y-4 py-6">
            {links.map((link) => (
              <Link
                to={link.link}
                key={link.title}
                className="text-white hover:text-[#ff7043] transition-all duration-300 ease-in-out transform hover:scale-110 text-lg"
                onClick={() => setIsMenuOpen(false)} // Close menu on link click
              >
                {link.title}
              </Link>
            ))}

            {/* Sign Up / Sign In Buttons for Mobile */}
            <Link
              to="/signup"
              className="bg-[#ff7043] text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-[#ff5722] transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-[#ff7043] text-[#ff7043] py-2 px-6 rounded-full text-lg font-semibold hover:bg-[#ff7043] hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
