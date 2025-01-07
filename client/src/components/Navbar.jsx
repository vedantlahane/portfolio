// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-white font-bold text-xl">Vedant Lahane</Link>
        <div>
          <Link to="/" className="text-gray-300 hover:text-white mx-2">Home</Link>
          <Link to="/blogs" className="text-gray-300 hover:text-white mx-2">Blog</Link>
          <Link to="/contact" className="text-gray-300 hover:text-white mx-2">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;