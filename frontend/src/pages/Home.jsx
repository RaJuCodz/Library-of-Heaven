import React from "react";
import RecentlyAdded from "./RecentlyAdded";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full min-h-[90vh] bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
        {/* Hero Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/HERO_IMAGE.png"
            alt="Library of Heaven"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50/80 via-gray-50/60 to-gray-50/40"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto flex flex-col justify-center items-center min-h-[90vh] text-center px-8 pt-24 pb-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-gray-900 leading-tight animate-fade-in">
              Welcome to the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                Library of Heaven
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-light mb-12 max-w-2xl mx-auto text-gray-600 leading-relaxed animate-fade-in-up">
              Discover your next adventure with our diverse collection of books.
              Dive into stories that inspire, educate, and entertain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
              <Link
                to="/books"
                className="px-8 py-4 bg-red-500 text-white text-lg font-semibold rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
              >
                Explore Books
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-transparent text-red-500 text-lg font-semibold rounded-lg border-2 border-red-500 hover:bg-red-50 transition-all duration-300 transform hover:scale-105"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent z-10"></div>
      </div>

      {/* Recently Added Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <RecentlyAdded />
        </div>
      </div>

      {/* Anime Image Section */}
      <div className="relative w-full h-[500px] overflow-hidden mb-8">
        <img
          src="/images/anime.jpg"
          alt="Anime Collection"
          className="w-full h-full object-cover object-center"
          style={{
            transform: "scale(1.1)",
            filter: "brightness(0.8)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/70 to-transparent"></div>
      </div>
    </div>
  );
};

export default Home;
