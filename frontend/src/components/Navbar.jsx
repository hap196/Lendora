import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-6">
          <Link
            to="/"
            className="text-white hover:text-gray-300 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/marketplace"
            className="text-white hover:text-gray-300 transition-colors"
          >
            Marketplace
          </Link>
          <Link
            to="/mint"
            className="text-white hover:text-gray-300 transition-colors"
          >
            Mint
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
