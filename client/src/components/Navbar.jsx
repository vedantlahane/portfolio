// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed  top-0 left-1/2 transform -translate-x-1/2 w-4/5 h-16 mx-auto flex p-4 m-8 rounded-xl bg-gradient-to-br opacity-95 from-blue-500 to-purple-500">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className=" text-white font-extrabold text-3xl pl-10">
          <span className='hover:text-gray-600 transition-colors duration-300'>
            {'<vedant/>'}
          </span>
        </Link>
        <div className='font-semibold text-lg'>
          <Link to='/' className='relative group mx-4'>
            <span className='text-slate-800 group-hover:text-white transition-colors duration-300' >Home</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to='/blog' className='relative group mx-4'>
            <span className='text-slate-800 group-hover:text-white transition-colors duration-300' >Blog</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to='/contact' className='relative group mx-4'>
            <span className='text-slate-800 font-semibold group-hover:text-white transition-colors duration-300' >Contact</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>
        <div className='flex items-center justify-center space-x-4 pr-10'>
          <img className='block mx-auto size-8 relative group' src="src/assets/icons8-linkedin-100.png" alt="LinkedIn Icon" />
          <img className='block relative size-7 group mx-4' src="src/assets/icons8-github-100.png" alt="GitHub Icon" />
          <img className='block relative group size-8 mx-4' src="src/assets/icons8-level-up-your-coding-skills-and-quickly-land-a-job-100.png" alt="LeetCode Icon" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;