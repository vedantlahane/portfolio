// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-4/5 h-20 mx-auto flex p-4 m-4 rounded-xl bg-gradient-to-br bg-opacity-75 from-blue-700">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className=" text-white font-bold text-xl pl-10">
          <span className='hover:text-cyan-500 transition-colors duration-300'>
            Vedant Lahane
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