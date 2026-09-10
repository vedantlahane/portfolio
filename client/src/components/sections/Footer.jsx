import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { openLoginModal } = useAdmin();
  
  const navLinks = [
    { label: 'ABOUT', href: '#about' },
    { label: 'PROJECTS', href: '#projects' },
    { label: 'SKILLS', href: '#skills' },
    { label: 'BLOG', href: '/blogs' },
    { label: 'PRACTICE', href: '/practice' },
    { label: 'CONTACT', href: '#contact' }
  ];

  const socialLinks = [
    { name: 'LinkedIn', url: 'https://linkedin.com/in/vedant-lahane', short: 'in' },
    { name: 'GitHub', url: 'https://github.com/vedantlahane', short: 'gh' },
    { name: 'Twitter', url: '#', short: 'tw' }
  ];

  const handleNavClick = (e, href) => {
    if (!href.startsWith('#')) {
      return;
    }

    e.preventDefault();
    const element = document.querySelector(href);
    if (!element) {
      return;
    }

    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.9 }}
      className="bg-gradient-to-b from-gray-50 to-transparent dark:from-neutral-950 dark:to-neutral-950 border-t border-gray-200 dark:border-neutral-800 transition-colors duration-300"
    >
      {/* Top Section */}
      <div className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-20 py-4 sm:py-6">
        <div className="flex justify-between items-center">
          <div className="text-xs sm:text-sm text-gray-400 dark:text-neutral-500 font-mono font-light">
            <span className="text-accent font-medium">08</span> &nbsp;&nbsp;FOOTER
          </div>
          <div className="text-xs sm:text-sm text-gray-400 dark:text-neutral-500 font-mono font-light flex items-center gap-3 sm:gap-4">
            <span>© VEDANT {currentYear}</span>
            <span className="text-gray-300 dark:text-neutral-700">|</span>
            <button
              onClick={openLoginModal}
              className="text-[10px] text-gray-400 dark:text-neutral-500 hover:text-accent dark:hover:text-accent transition-colors uppercase tracking-wider font-medium cursor-pointer"
            >
              Owner
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-20 pb-4 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Mobile Navigation Grid */}
          <nav className="grid grid-cols-2 sm:flex gap-4 sm:gap-6 lg:gap-8 xl:gap-12">
            {navLinks.map((link) => (
              link.href.startsWith('#') ? (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm font-sans font-light text-gray-900 dark:text-neutral-300 hover:text-accent dark:hover:text-accent 
                           transition-all py-1 sm:py-0"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.label}
                </motion.a>
              ) : (
                <motion.span
                  key={link.label}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={link.href}
                    className="text-sm font-sans font-light text-gray-900 dark:text-neutral-300 hover:text-accent dark:hover:text-accent transition-all py-1 sm:py-0"
                  >
                    {link.label}
                  </Link>
                </motion.span>
              )
            ))}
          </nav>
          
          {/* Decorative Elements - Hidden on mobile */}
          <div className="hidden md:flex gap-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  rotate: [0, 180, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 10,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "linear"
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-900 dark:text-accent/60">
                  <path 
                    d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" 
                    fill="currentColor"
                  />
                </svg>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Large Name Display - Responsive */}
      <div className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-20 py-6 sm:py-8 lg:py-10 overflow-hidden">
        <motion.h1
          className="text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] xl:text-[10rem] 2xl:text-[12rem] 
                     font-display font-black leading-tight text-gray-900 dark:text-neutral-800/50 italic
                     break-all sm:break-normal select-none transition-colors"
          style={{ letterSpacing: '-0.05em' }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          VEDANT
        </motion.h1>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 dark:border-neutral-800">
        <div className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-20 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-8 sm:h-8 bg-gray-900 dark:bg-neutral-800 hover:bg-accent dark:hover:bg-accent text-white hover:text-neutral-950 dark:hover:text-neutral-950 rounded flex items-center justify-center transition-colors group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title={social.name}
                >
                  <span className="text-xs font-sans font-bold group-hover:scale-110 transition-transform">
                    {social.short}
                  </span>
                </motion.a>
              ))}
            </div>

            {/* Location & Status */}
            <div className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400 font-sans font-light text-left sm:text-right">
              <p className="mb-1">Amravati, Maharashtra, India</p>
              <p className="flex items-center gap-2 sm:justify-end">
                <motion.span 
                  className="w-2 h-2 bg-accent rounded-full inline-block"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                />
                Available for Work
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Call-to-Action */}
      <motion.div 
        className="sm:hidden border-t border-gray-200 dark:border-neutral-800 px-6 py-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <a 
          href="#contact" 
          onClick={(e) => handleNavClick(e, '#contact')}
          className="text-sm font-sans text-gray-900 dark:text-white underline hover:text-accent dark:hover:text-accent transition-colors"
        >
          Get in touch →
        </a>
      </motion.div>

      {/* Back to top - Mobile only */}
      <motion.button
        className="sm:hidden w-full py-4 bg-gray-100 dark:bg-neutral-900 text-gray-600 dark:text-neutral-400 hover:text-accent dark:hover:text-accent text-sm font-sans transition-colors"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        whileTap={{ scale: 0.98 }}
      >
        ↑ Back to top
      </motion.button>
    </motion.footer>
  );
};

export default Footer;
