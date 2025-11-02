import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Contact2 = () => {
  const [hoveredLink, setHoveredLink] = useState(null);

  const socialLinks = [
    { id: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com/in/vedant-lahane' },
    { id: 'github', name: 'GitHub', url: 'https://github.com/vedantlahane' },
    { id: 'twitter', name: 'Twitter', url: '#' },
    { id: 'leetcode', name: 'LeetCode', url: 'https://leetcode.com/u/vedantlahane' }
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
  className="h-full bg-neutral-950 text-white px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-12 border-t border-gray-800 flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div className="text-xs sm:text-sm text-gray-500 font-mono">07 &nbsp;&nbsp;CONNECT</div>
        <div className="text-xs sm:text-sm text-gray-500 font-mono">/07</div>
      </div>

      {/* Main content */}
  <div className="flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-6">
            <span className="block">Open for</span>
            <span className="block text-gray-300">opportunities</span>
          </h3>

          <p className="text-base sm:text-lg lg:text-xl text-gray-400 mb-8 max-w-lg">
            Currently pursuing B.Tech CSE. Available for internships and full-time roles starting July 2026.
          </p>

          {/* Status indicator */}
          <div className="flex items-center gap-3 mb-10">
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
            <span className="text-sm text-gray-400">Actively seeking opportunities</span>
          </div>

          {/* Resume CTA */}
          <motion.a
            href="https://drive.google.com/file/d/1FF5VZ9P8ddZVfaUemFyWcIDwSeRO21WO/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 border border-gray-600 text-white text-xs sm:text-sm tracking-wider uppercase hover:bg-white hover:text-gray-900 hover:border-white transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View Resume
          </motion.a>
        </motion.div>
      </div>

      {/* Social links */}
  <div className="mt-12">
        {/* Mobile 2x2 grid - theme matched */}
<div className="sm:hidden grid grid-cols-2 gap-y-3 gap-x-6 justify-items-end">
  {socialLinks.map((link, index) => (
    <a
      key={link.id}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-gray-300 hover:text-white transition-colors relative group"
    >
      {link.name}
      <span className="absolute bottom-0 right-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
    </a>
  ))}
</div>


        {/* Desktop inline */}
        <div className="hidden sm:flex gap-8">
          {socialLinks.map((link) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative text-sm text-gray-400 hover:text-white transition-colors"
              onMouseEnter={() => setHoveredLink(link.id)}
              onMouseLeave={() => setHoveredLink(null)}
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
      </div>
    </motion.section>
  );
};

export default Contact2;
