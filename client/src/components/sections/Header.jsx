import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../UI/ThemeToggle';

const Header = () => {
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' }
  ];

  // Update active section based on scroll position
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sections = navigationItems.map(item => item.href.substring(1));
          const scrollPosition = window.scrollY + 100;

          let currentSection = '';
          sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) {
              const { offsetTop, offsetHeight } = element;
              if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                currentSection = `#${section}`;
              }
            }
          });

          setActiveSection(prev => prev !== currentSection ? currentSection : prev);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Smooth scroll to section
  const handleNavClick = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/90 dark:bg-[#090d16]/90 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800/80 transition-colors duration-300"
    >
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-4 sm:py-5 md:py-6">
        {/* Main Header Content */}
        <div className="flex items-center justify-between">
          {/* Logo/Name Section */}
          <motion.div
            className="flex items-center gap-3 sm:gap-4 cursor-pointer"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {/* Geometric Logo */}
            <motion.div
              className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0"
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 bg-gray-900 dark:bg-white transform rotate-45 rounded-sm transition-colors duration-300" />
              <div className="absolute inset-1 bg-white dark:bg-neutral-900 transform rotate-45 rounded-sm transition-colors duration-300" />
              <div className="absolute inset-2 bg-gray-900 dark:bg-accent transform rotate-45 rounded-sm transition-colors duration-300" />
            </motion.div>

            {/* Name and Label */}
            <div>
              <p className="text-[10px] sm:text-xs text-gray-400 dark:text-neutral-500 font-light mb-0.5 font-mono hidden sm:block">
                <span className="text-accent font-medium">00</span> &nbsp;&nbsp;HEADER
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white transition-colors">
                Vedant
              </h1>
            </div>
          </motion.div>

          {/* Desktop Navigation + Theme Toggle */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <nav className="flex items-center gap-1 lg:gap-2">
              {navigationItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="relative group"
                >
                  <div className={`px-3 lg:px-5 xl:px-6 py-2 text-sm lg:text-base font-sans font-light transition-all duration-300 ${activeSection === item.href
                    ? 'text-gray-900 dark:text-white font-medium'
                    : 'text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'
                    }`}>
                    <span className="text-[10px] lg:text-xs font-mono font-light text-gray-400 dark:text-neutral-500 group-hover:text-accent mr-1.5 lg:mr-2 transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {item.name}
                  </div>

                  <motion.div
                    className="absolute bottom-0 left-3 right-3 lg:left-5 lg:right-5 h-0.5 bg-accent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: activeSection === item.href ? 1 : 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </nav>

            <div className="h-5 w-px bg-gray-200 dark:bg-neutral-800" />
            <ThemeToggle />
          </div>

          {/* Mobile Right Controls (Theme Toggle + Menu Button) */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <motion.button
              className="relative w-10 h-10 flex items-center justify-center -mr-2 text-gray-900 dark:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle menu"
            >
              <div className="w-5 h-4 relative flex flex-col justify-between">
                <motion.span
                  className="w-full h-0.5 bg-gray-900 dark:bg-white rounded-full transition-colors"
                  animate={{
                    rotate: isMobileMenuOpen ? 45 : 0,
                    y: isMobileMenuOpen ? 8 : 0
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="w-full h-0.5 bg-gray-900 dark:bg-white rounded-full transition-colors"
                  animate={{
                    opacity: isMobileMenuOpen ? 0 : 1,
                    scaleX: isMobileMenuOpen ? 0 : 1
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="w-full h-0.5 bg-gray-900 dark:bg-white rounded-full transition-colors"
                  animate={{
                    rotate: isMobileMenuOpen ? -45 : 0,
                    y: isMobileMenuOpen ? -8 : 0
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-1 border-t border-gray-200 dark:border-neutral-800 mt-4">
                {navigationItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: 0.05 * index }}
                    className={`flex items-center px-3 py-2.5 rounded-sm transition-all duration-300 ${activeSection === item.href
                      ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-neutral-800/80 font-medium'
                      : 'text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-neutral-800/40'
                      }`}
                  >
                    <span className="text-xs font-mono font-light text-gray-400 dark:text-neutral-500 mr-3 w-6 group-hover:text-accent">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-sans text-base">{item.name}</span>
                  </motion.a>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;