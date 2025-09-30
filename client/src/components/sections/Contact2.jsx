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
      className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-16 border border-white/10 rounded-3xl shadow-2xl shadow-slate-900/60"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -inset-24 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.22),_transparent_60%)]" />
        <div className="absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-indigo-500/20 via-transparent to-transparent" />
      </div>
      {/* Header */}
  <div className="relative z-10 flex justify-between items-start mb-12">
        <div className="text-xs sm:text-sm text-gray-500 font-mono">07 &nbsp;&nbsp;CONNECT</div>
        <div className="text-xs sm:text-sm text-gray-500 font-mono">/07</div>
      </div>

      {/* Main content */}
  <div className="relative z-10 flex-1 flex flex-col justify-center">
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
              className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.6)]"
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
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white text-xs sm:text-sm tracking-wider uppercase rounded-full bg-white/5 backdrop-blur hover:bg-white hover:text-slate-900 hover:border-white transition-all duration-300"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            View Resume
          </motion.a>
        </motion.div>
      </div>

      {/* Social links */}
  <div className="relative z-10 mt-12">
        {/* Mobile 2x2 grid - theme matched */}
        <div className="sm:hidden grid grid-cols-2 gap-y-3 gap-x-6 justify-items-end">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-300 hover:text-white transition-colors relative group"
            >
              {link.name}
              <span className="absolute bottom-0 right-0 w-0 h-px bg-gradient-to-l from-emerald-400 to-indigo-500 transition-all duration-300 group-hover:w-full" />
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
              className="relative text-sm text-slate-300 hover:text-white transition-colors"
              onMouseEnter={() => setHoveredLink(link.id)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {link.name}
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500 origin-left"
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
