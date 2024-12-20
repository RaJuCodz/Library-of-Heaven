import React from "react";

const Navbar = () => {
  const links = [
    { title: "Home", link: "/" },
    { title: "Books", link: "/books" },
    { title: "Cart", link: "/cart" },
    { title: "Profile", link: "/profile" },
  ];

  return (
    <div className="bg-black text-white shadow-lg">
      <div className="container mx-auto flex items-center justify-between py-6 px-8">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-extrabold text-[#ff7043] tracking-wide">
            Library of Heaven
          </span>
        </div>

        <div className="navlinks flex space-x-6 text-lg">
          {links.map((link) => (
            <a
              key={link.title}
              href={link.link}
              className="text-white hover:text-[#ff7043] transition-all duration-300 ease-in-out transform hover:scale-110"
            >
              {link.title}
            </a>
          ))}
        </div>

        <div className="flex space-x-4">
          <a
            href="/signup"
            className="bg-[#ff7043] text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-[#ff5722] transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Sign Up
          </a>
          <a
            href="/signin"
            className="bg-transparent border-2 border-[#ff7043] text-[#ff7043] py-2 px-6 rounded-full text-lg font-semibold hover:bg-[#ff7043] hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
