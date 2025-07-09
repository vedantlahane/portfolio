import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const navLinks = [
    { label: 'ABOUT', href: '#about' },
    { label: 'PROJECTS', href: '#projects' },
    { label: 'SKILLS', href: '#skills' },
    { label: 'CONTACT', href: '#contact' }
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.9 }}
      className="bg-gray-50 border-t border-gray-200"
    >
      {/* Top Section */}
      <div className="px-12 lg:px-16 xl:px-20 py-8">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-400 font-light">
            08 &nbsp;&nbsp;FOOTER
          </div>
          <div className="text-xs text-gray-400 font-light">
            © VEDANT {currentYear}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="px-12 lg:px-16 xl:px-20 pb-8">
        <div className="flex items-center justify-between">
          <nav className="flex gap-8 lg:gap-12">
            {navLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="text-sm font-light text-gray-900 hover:underline transition-all"
                whileHover={{ y: -2 }}
              >
                {link.label}
              </motion.a>
            ))}
          </nav>
          
          {/* Decorative Elements */}
          <div className="flex gap-4">
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-900">
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

      {/* Large Name Display */}
      <div className="px-12 lg:px-16 xl:px-20 py-16 overflow-hidden">
        <motion.h1
          className="text-[8rem] lg:text-[12rem] xl:text-[16rem] font-black leading-none text-gray-900 italic"
          style={{ letterSpacing: '-0.05em' }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          VEDANT
        </motion.h1>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200">
        <div className="px-12 lg:px-16 xl:px-20 py-6">
          <div className="flex items-center justify-between">
            {/* Social Link */}
            <motion.a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white text-xs font-bold">in</span>
            </motion.a>

            {/* Location */}
            <div className="text-xs text-gray-500 font-light text-right">
              Mumbai, Maharashtra, India<br />
              Available for Remote Work Worldwide
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;