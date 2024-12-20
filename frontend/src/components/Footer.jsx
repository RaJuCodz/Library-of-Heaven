import React from "react";

const Footer = () => {
  return (
    <div className="bg-black text-white py-6 mt-8">
      <div className="container mx-auto text-center">
        <p className="text-lg italic mb-4">
          "A room without books is like a body without a soul." – Marcus Tullius
          Cicero
        </p>

        <div className="text-sm">
          <p>&copy; 2024 Library of Heaven. All rights reserved.</p>
          <p>
            Made by{" "}
            <a
              href="https://github.com/RajuCodz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff7043] hover:text-[#ff5722] transition-all duration-300 ease-in-out"
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
