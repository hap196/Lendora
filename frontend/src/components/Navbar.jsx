import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-transparent p-4 backdrop-blur-sm">
      <div className="max-w-6xl container mx-auto flex justify-between items-center">
        <div className="flex-1">
          <Link
            to="/"
            className="text-white hover:text-gray-300 transition-colors font-bold text-xl"
          >
            lendora
          </Link>
        </div>
        <div className="flex space-x-8">
          <Link
            to="/marketplace"
            className="text-white hover:text-gray-300 transition-colors font-bold text-lg"
          >
            marketplace
          </Link>
          <Link
            to="/profile"
            className="text-white hover:text-gray-300 transition-colors font-bold text-lg"
          >
            profile
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
