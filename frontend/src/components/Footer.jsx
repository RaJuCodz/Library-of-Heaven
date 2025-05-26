import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaHeart,
  FaBook,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-800 py-16 mt-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* About Section */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-6 text-primary-600">
              Library of Heaven
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              Discover your next adventure with our diverse collection of books.
              Dive into stories that inspire, educate, and entertain.
            </p>
            <div className="flex justify-center md:justify-start space-x-6">
              <a
                href="https://github.com/RajuCodz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 transition-all duration-300"
              >
                <FaGithub className="w-7 h-7" />
              </a>
              <a
                href="https://www.linkedin.com/in/raju-gupta-871925280/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary-600 transition-all duration-300"
              >
                <FaLinkedin className="w-7 h-7" />
              </a>
              <a
                href="mailto:itsraajjjuuuu@gmail.com"
                className="text-gray-600 hover:text-primary-600 transition-all duration-300"
              >
                <FaEnvelope className="w-7 h-7" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6 text-primary-600">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="/"
                  className="text-gray-600 hover:text-primary-600 transition-all duration-300 flex items-center justify-center text-lg"
                >
                  <FaBook className="mr-3 w-5 h-5" /> Home
                </a>
              </li>
              <li>
                <a
                  href="/books"
                  className="text-gray-600 hover:text-primary-600 transition-all duration-300 flex items-center justify-center text-lg"
                >
                  <FaBook className="mr-3 w-5 h-5" /> Books
                </a>
              </li>
              <li>
                <a
                  href="/profile"
                  className="text-gray-600 hover:text-primary-600 transition-all duration-300 flex items-center justify-center text-lg"
                >
                  <FaBook className="mr-3 w-5 h-5" /> Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Quote Section */}
          <div className="text-center md:text-right">
            <h3 className="text-2xl font-bold mb-6 text-primary-600">
              Inspiration
            </h3>
            <p className="text-xl italic text-gray-600 mb-4">
              "A room without books is like a body without a soul."
            </p>
            <p className="text-lg text-gray-500">– Marcus Tullius Cicero</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-10"></div>

        {/* Copyright Section */}
        <div className="text-center text-base text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} Library of Heaven. All rights
            reserved.
          </p>
          <p className="mt-3">
            Made with{" "}
            <FaHeart className="inline-block text-red-500 mx-2 w-5 h-5" /> by{" "}
            <a
              href="https://github.com/RajuCodz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 transition-all duration-300 font-semibold"
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
