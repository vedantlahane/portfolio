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

  const socialLinks = [
    { name: 'LinkedIn', url: 'https://linkedin.com/in/vedant-lahane', short: 'in' },
    { name: 'GitHub', url: 'https://github.com/vedantlahane', short: 'gh' },
    { name: 'Twitter', url: '#', short: 'tw' }
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.9 }}
      className="bg-gray-50 border-t border-gray-200 rounded-3xl"
    >
      <div className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-20 py-6 sm:py-8">
        <div className="flex justify-between items-center">
          <div className="text-xs sm:text-sm text-gray-400 font-mono font-light">
            08 &nbsp;&nbsp;FOOTER
          </div>
          <div className="text-xs sm:text-sm text-gray-400 font-mono font-light">
            © VEDANT {currentYear}
          </div>
        </div>
      </div>

      <div className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-20 pb-6 sm:pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <nav className="grid grid-cols-2 sm:flex gap-4 sm:gap-6 lg:gap-8 xl:gap-12">
            {navLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-sans font-light text-gray-900 hover:text-gray-600 transition-all py-2 sm:py-0"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.label}
              </motion.a>
            ))}
          </nav>
          
          <div className="hidden md:flex gap-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ rotate: [0, 180, 360], scale: [1, 1.1, 1] }}
                transition={{ duration: 10, repeat: Infinity, delay: i * 0.3, ease: 'linear' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-900">
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

      <div className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-20 py-8 sm:py-12 lg:py-16 overflow-hidden">
        <motion.h1
          className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] 2xl:text-[16rem] font-display font-black leading-none text-gray-900 italic break-all sm:break-normal"
          style={{ letterSpacing: '-0.05em' }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          VEDANT
        </motion.h1>
      </div>

      <div className="border-t border-gray-200">
        <div className="px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-20 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-8 sm:h-8 bg-gray-900 rounded flex items-center justify-center hover:bg-gray-800 transition-colors group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title={social.name}
                >
                  <span className="text-white text-xs font-sans font-bold group-hover:scale-110 transition-transform">
                    {social.short}
                  </span>
                </motion.a>
              ))}
            </div>

            <div className="text-xs sm:text-sm text-gray-500 font-sans font-light text-left sm:text-right">
              <p className="mb-1">Amravati, Maharashtra, India</p>
              <p className="flex items-center gap-2 sm:justify-end">
                <motion.span 
                  className="w-2 h-2 bg-green-500 rounded-full inline-block"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                Available for Work
              </p>
            </div>
          </div>
        </div>
      </div>

      <motion.div 
        className="sm:hidden border-t border-gray-200 px-6 py-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <a 
          href="#contact" 
          onClick={(e) => handleNavClick(e, '#contact')}
          className="text-sm font-sans text-gray-900 underline"
        >
          Get in touch →
        </a>
      </motion.div>

      <motion.button
        className="sm:hidden w-full py-4 bg-gray-100 text-gray-600 text-sm font-sans rounded-b-3xl"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        whileTap={{ scale: 0.98 }}
      >
        ↑ Back to top
      </motion.button>
    </motion.footer>
  );
};

export default Footer;
