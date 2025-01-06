import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        {/* Quote Section */}
        <p className="text-lg italic text-center mb-6 text-gray-400">
          "A room without books is like a body without a soul." – Marcus Tullius
          Cicero
        </p>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-6 mb-6">
          <a
            href="https://github.com/RajuCodz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-yellow-400 transition-all duration-300"
          >
            <FaGithub className="w-6 h-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/raju-gupta-871925280/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-yellow-400 transition-all duration-300"
          >
            <FaLinkedin className="w-6 h-6" />
          </a>
        </div>

        {/* Copyright Section */}
        <div className="text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Library of Heaven. All rights
            reserved.
          </p>
          <p>
            Made with ❤️ by{" "}
            <a
              href="https://github.com/RajuCodz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:text-yellow-500 transition-all duration-300"
            >
              RajuCodz
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
