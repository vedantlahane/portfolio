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
      transition={{ duration: 0.6, delay: 0.8 }}
      className="bg-gray-950 text-white p-12 lg:p-16 xl:p-20 h-full relative flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-xs text-gray-500 font-light"
        >
          07 &nbsp;&nbsp;CONNECT
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-xs text-gray-500 font-light"
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
          <h3 className="text-4xl lg:text-5xl xl:text-6xl font-light mb-8">
            Open for<br />opportunities
          </h3>
          
          <p className="text-lg lg:text-xl font-light text-gray-400 mb-16 max-w-lg">
            Currently pursuing B.Tech CSE. Available for internships 
            and full-time roles starting July 2026.
          </p>

          {/* Simple status */}
          <motion.div
            className="flex items-center gap-3 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm text-gray-400 font-light">
              Actively seeking opportunities
            </span>
          </motion.div>

          {/* CTA Button */}
          <motion.a
            href="https://drive.google.com/file/d/1FF5VZ9P8ddZVfaUemFyWcIDwSeRO21WO/view?usp=sharing"
            target="_blank"
            className="inline-block px-8 py-3 border border-gray-600 text-white font-light text-sm tracking-wider
                     hover:bg-white hover:text-gray-900 hover:border-white transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            VIEW RESUME
          </motion.a>
        </motion.div>
      </div>

      {/* Social Links - Bottom */}
      <motion.div
        className="flex gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        {socialLinks.map((link, index) => (
          <motion.a
            key={link.id}
            href={link.url}
            className="text-sm font-light text-gray-400 hover:text-white transition-colors relative"
            onMouseEnter={() => setHoveredLink(link.id)}
            onMouseLeave={() => setHoveredLink(null)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 + index * 0.1 }}
          >
            {link.name}
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-px bg-white"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: hoveredLink === link.id ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            />
          </motion.a>
        ))}
      </motion.div>

      {/* Subtle corner decoration */}
      <motion.div
        className="absolute top-16 right-16 w-16 h-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-full h-full border-t border-r border-gray-600"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.section>
  );
};

export default Contact2;