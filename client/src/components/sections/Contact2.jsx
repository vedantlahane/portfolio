import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Contact2 = () => {
  const [hoveredLink, setHoveredLink] = useState(null);

  const socialLinks = [
    { id: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com/in/vedant-lahane', icon: '🔗' },
    { id: 'github', name: 'GitHub', url: 'https://github.com/vedantlahane', icon: '⚡' },
    { id: 'twitter', name: 'Twitter', url: '#', icon: '🐦' },
    { id: 'leetcode', name: 'LeetCode', url: 'https://leetcode.com/u/vedantlahane', icon: '💻' }
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="bg-gray-950 text-white p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 2xl:p-20 h-full relative flex flex-col"
    >
      {/* Background gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />

      {/* Content wrapper */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 sm:mb-12 lg:mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-xs sm:text-sm text-gray-500 font-mono font-light"
          >
            07 &nbsp;&nbsp;CONNECT
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-xs sm:text-sm text-gray-500 font-mono font-light"
          >
            /07
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-light mb-6 sm:mb-8">
              <span className="block">Open for</span>
              <span className="block text-gray-300">opportunities</span>
            </h3>
            
            <p className="text-base sm:text-lg lg:text-xl font-sans font-light text-gray-400 mb-8 sm:mb-12 lg:mb-16 max-w-lg">
              Currently pursuing B.Tech CSE. Available for internships 
              and full-time roles starting July 2026.
            </p>

            {/* Status indicator - Enhanced for mobile */}
            <motion.div
              className="flex items-center gap-3 mb-8 sm:mb-12 lg:mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <motion.div 
                className="w-2 h-2 bg-green-500 rounded-full"
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
              <span className="text-xs sm:text-sm text-gray-400 font-sans font-light">
                Actively seeking opportunities
              </span>
            </motion.div>

            {/* CTA Button - Mobile optimized */}
            <motion.a
              href="https://drive.google.com/file/d/1FF5VZ9P8ddZVfaUemFyWcIDwSeRO21WO/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 
                       border border-gray-600 text-white font-sans font-light 
                       text-xs sm:text-sm tracking-wider uppercase
                       hover:bg-white hover:text-gray-900 hover:border-white 
                       transition-all duration-300 group relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              <span className="relative z-10">VIEW RESUME</span>
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ x: "-100%" }}
                whileGroupHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          </motion.div>
        </div>

        {/* Social Links - Mobile optimized */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          {/* Mobile Grid Layout */}
          <div className="sm:hidden grid grid-cols-2 gap-3">
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-3 bg-gray-900 rounded-lg
                         text-gray-300 hover:text-white hover:bg-gray-800
                         transition-all duration-300"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.1 }}
              >
                <span className="text-base">{link.icon}</span>
                <span className="text-sm font-sans">{link.name}</span>
              </motion.a>
            ))}
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex gap-6 lg:gap-8">
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-sans font-light text-gray-400 hover:text-white transition-colors relative group"
                onMouseEnter={() => setHoveredLink(link.id)}
                onMouseLeave={() => setHoveredLink(null)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.1 }}
              >
                {link.name}
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-px bg-white origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hoveredLink === link.id ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      {/* Corner decoration - desktop only */}
      <motion.div
        className="hidden lg:block absolute top-16 right-16 w-16 h-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-full h-full border-t border-r border-gray-600"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Floating particles - desktop only */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gray-600 rounded-full hidden lg:block"
          style={{
            left: `${10 + i * 20}%`,
            bottom: `${20 + (i % 2) * 20}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5
          }}
        />
      ))}

      {/* Grid pattern overlay - subtle */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </motion.section>
  );
};

export default Contact2;