import React from "react";
import RecentlyAdded from "./RecentlyAdded";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative w-full h-screen bg-cover bg-center"
        style={{
          backgroundImage: "url('../src/assets/Reading.jpeg')", // Replace with your actual image URL
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black via-black/80 to-black/50"></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto flex flex-col justify-center items-center h-full text-center text-white px-8">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Welcome to the{" "}
            <span className="text-yellow-400">Library of Heaven</span>
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8 max-w-2xl">
            Discover your next adventure with our diverse collection of books.
            Dive into stories that inspire, educate, and entertain.
          </p>
          <Link
            to="/books"
            className="px-8 py-3 bg-yellow-500 text-black text-lg font-semibold rounded-lg hover:bg-yellow-600 hover:shadow-lg transition-all duration-300"
          >
            Explore Books
          </Link>
        </div>
      </div>

      {/* Recently Added Section */}
      <div className="bg-gradient-to-r from-gray-900 to-black py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <RecentlyAdded />
        </div>
      </div>
    </div>
  );
};

export default Home;
