import React from 'react';
import { Link } from 'react-router-dom';
import iconGithub from '../assets/icons8-github-100.png';
import iconLinkedIn from '../assets/icons8-linkedin-100.png';
import iconLeetCode from '../assets/icons8-level-up-your-coding-skills-and-quickly-land-a-job-100.png';
import vl from '../assets/VedantLogo.png';

const Navbar = () => {
  return (
    <header>
     <nav className="fixed top-0 left-1/2 transform -translate-x-1/2 w-11/12 md:w-4/5 h-14 flex p-2 md:p-4 my-4 rounded-lg bg-linear-to-br opacity-95 from-blue-500 to-purple-500 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white font-extrabold text-2xl md:text-3xl pl-2 md:pl-10">
            {/* <img className='w-64 object-contain' src={vl} alt="Vedant Lahane" /> */}
            <h1>vedant</h1>
          </Link>
          <div className='hidden md:block font-semibold text-base md:text-lg'>
            <Link to='/' className='relative group mx-2 md:mx-4' aria-label="Home">
              <span className='text-slate-800 group-hover:text-white transition-colors duration-300'>Home</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to='/blog' className='relative group mx-2 md:mx-4' aria-label="Blog">
              <span className='text-slate-800 group-hover:text-white transition-colors duration-300'>Blog</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to='/contact' className='relative group mx-2 md:mx-4' aria-label="Contact">
              <span className='text-slate-800 font-semibold group-hover:text-white transition-colors duration-300'>Contact</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
          <div className='flex items-center justify-center space-x-2 md:space-x-4 pr-2 md:pr-10'>
            <a href="https://www.linkedin.com/in/vedant-lahane" target="_blank" rel="noopener noreferrer">
              <img className='size-7 md:size-9 hover:scale-110 transition-transform duration-300' src={iconLinkedIn} alt="LinkedIn Icon" />
            </a>
            <a href="https://github.com/vedantlahane" target="_blank" rel="noopener noreferrer">
              <img className='size-6 md:size-7 hover:scale-110 transition-transform duration-300' src={iconGithub} alt="GitHub Icon" />
            </a>
            <a href="https://leetcode.com/u/vedantlahane" target="_blank" rel="noopener noreferrer">
              <img className='size-7 md:size-8 hover:scale-110 transition-transform duration-300' src={iconLeetCode} alt="LeetCode Icon" />
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;