import React from "react";
import RecentlyAdded from "./RecentlyAdded";

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
        {/* Overlay for text content */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto text-center text-white py-16 px-8">
          <h1 className="text-5xl font-extrabold mb-8">
            Welcome to the Library of Heaven
          </h1>
          <p className="text-xl font-light mb-12 italic">
            Discover your next adventure with our diverse collection of books.
          </p>
        </div>
      </div>

      {/* Recently Added Section */}
      <div className="bg-black">
        <RecentlyAdded />
      </div>
    </div>
  );
};

export default Home;
