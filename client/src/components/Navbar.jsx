// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-4/5 mx-auto flex p-4 m-4 rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-500"></div>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl">
          <span className='hover:text-blue-400 transition-colors duration-300'>
            Vedant Lahane
          </span>
        </Link>
        <div>
          <Link to='/' className='relative group mx-4'>
            <span className='text-gray-300 group-hover:text-white transition-colors duration-300' >Home</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to='/blog' className='relative group mx-4'>
            <span className='text-gray-300 group-hover:text-white transition-colors duration-300' >Blog</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to='/contact' className='relative group mx-4'>
            <span className='text-gray-300 group-hover:text-white transition-colors duration-300' >Contact</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;