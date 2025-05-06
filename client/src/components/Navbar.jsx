'use client'//this is a client component, which means it will be rendered on the client side
import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
    { name: 'Projects', href: '/projects' }, // Updated to link to the project section
    { name: 'Resume', href: 'https://drive.google.com/file/d/1LEgXcAexz4AHdr95BgODzXS8SyuHJunF/view?usp=sharing' }
  ];

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/vedantlahane' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/vedant-lahane' },
    { name: 'LeetCode', href: 'https://leetcode.com/u/vedantlahane' },
    
  ];

  return (
    <nav className="fixed top-0 w-full backdrop-blur-sm z-50">
      {/* Partial border with gradient */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative h-16 flex items-center justify-between">
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-50" />
          
          {/* Logo */}
          <Link to="/" className="z-10">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-500 
              bg-clip-text text-transparent">
              v
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-base font-medium text-blue-300 hover:text-purple-400 
                  transition-colors"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Dropdown Menu */}
            <div className="relative ml-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-base font-medium text-blue-300 hover:text-purple-400 
                  transition-colors flex items-center"
              >
                Links
                <ChevronDownIcon className="h-4 w-4 ml-1" />
              </button>

              {isOpen && (
                <div className="absolute top-full right-0 mt-2 py-2 w-48 bg-slate-900/90 
                  backdrop-blur-sm rounded-lg shadow-xl border border-blue-900/20">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-blue-300 hover:text-purple-400 
                        hover:bg-blue-900/10 transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-blue-300 hover:text-purple-400 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open menu</span>
            <Bars3Icon className="h-7 w-7" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4 border-b border-blue-900/20">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-purple-500 
              bg-clip-text text-transparent">
              v
            </span>
            <button
              type="button"
              className="p-2 text-blue-300 hover:text-purple-400 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-7 w-7" aria-hidden="true" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block py-2 text-lg text-blue-300 hover:text-purple-400 
                  transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4">
              <div className="border-t border-blue-900/20 pt-4">
                <h3 className="text-blue-400 text-sm font-semibold mb-2">Connect</h3>
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-2 text-blue-300 hover:text-purple-400 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;