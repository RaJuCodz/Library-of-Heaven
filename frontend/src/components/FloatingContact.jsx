import React, { useState } from "react";
import { Link } from "react-router-dom";

const FloatingContact = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to="/contact"
      className={`fixed top-3/4 -translate-y-1/2 right-8 z-50 transition-all duration-300 ${
        isHovered ? "scale-90" : "scale-100"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative group">
        <img
          src="/images/nezo.png"
          alt="Contact Us"
          className="w-20 h-20 object-contain"
        />
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Contact Us
        </div>
      </div>
    </Link>
  );
};

export default FloatingContact;
