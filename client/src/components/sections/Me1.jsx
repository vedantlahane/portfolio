import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

const Me1 = () => {
  const [downloadStatus, setDownloadStatus] = useState('idle');
  const [currentWord, setCurrentWord] = useState(0);

  const words = ['learner', 'creator', 'developer', 'student'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleDownloadCV = useCallback(() => {
    try {
      setDownloadStatus('downloading');
      
      // Open Google Drive link in new tab
      window.open('https://drive.google.com/file/d/1FF5VZ9P8ddZVfaUemFyWcIDwSeRO21WO/view?usp=sharing', '_blank', 'noopener,noreferrer');
      
      setDownloadStatus('success');
      setTimeout(() => setDownloadStatus('idle'), 3000);
      
    } catch (error) {
      console.error('Failed to open CV:', error);
      setDownloadStatus('error');
      setTimeout(() => setDownloadStatus('idle'), 3000);
    }
  }, []);

  const getButtonContent = () => {
    switch (downloadStatus) {
      case 'downloading':
        return (
          <span className="flex items-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              ⟳
            </motion.span>
            OPENING...
          </span>
        );
      case 'success':
        return (
          <span className="flex items-center gap-2">
            ✓ OPENED
          </span>
        );
      case 'error':
        return 'ERROR - RETRY';
      default:
        return 'VIEW RESUME';
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white p-8 md:p-12 lg:p-16 min-h-[65vh] h-full relative flex flex-col overflow-hidden"
    >
      {/* Floating background elements */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-32 border border-gray-100 rounded-full"
          style={{
            left: `${20 + i * 30}%`,
            top: `${10 + i * 20}%`,
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Section Label */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-xs text-gray-400 font-light">01 &nbsp;&nbsp;ME</p>
      </motion.div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center w-full">
        <motion.h1 
          className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Hello<motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            .
          </motion.span>
        </motion.h1>
        
        <motion.h2 
          className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          I'm Vedant Lahane
        </motion.h2>

        {/* Animated role */}
        <motion.div
          className="text-xl md:text-2xl font-light text-gray-500 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.8 }}
        >
          a passionate{' '}
          <motion.span
            key={currentWord}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-gray-900 font-normal"
          >
            {words[currentWord]}
          </motion.span>
        </motion.div>

        {/* Right-aligned description */}
        <motion.div 
          className="w-full flex justify-end mb-12"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <p className="text-lg md:text-xl font-light text-gray-600 leading-relaxed max-w-xl text-right">
            Computer Science student exploring the endless possibilities of technology.
            Currently diving deep into web development, algorithms, and system design.
            Building projects that challenge me to grow.
          </p>
        </motion.div>
        
        {/* Download Button - also right aligned */}
        <motion.div
          className="w-full flex"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <button 
            onClick={handleDownloadCV}
            disabled={downloadStatus === 'downloading'}
            className={`
              px-8 py-3 border border-gray-900 
              font-light text-sm tracking-wider uppercase
              transition-all duration-300 relative overflow-hidden group
              ${downloadStatus === 'downloading' 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-900 hover:text-white cursor-pointer'
              }
            `}
          >
            <span className="relative z-10">{getButtonContent()}</span>
            <motion.div
              className="absolute inset-0 bg-gray-900"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>
        </motion.div>

        {/* Status indicators - student appropriate */}
        <motion.div
          className="flex gap-2 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {['Open to internships', 'Learning daily', 'Project enthusiast'].map((status, i) => (
            <span
              key={status}
              className="text-xs text-gray-400 flex items-center gap-1"
            >
              <motion.span
                className="w-2 h-2 bg-gray-700 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              />
              {status}
              {i < 2 && <span className="ml-2">•</span>}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Decorative elements */}
      <motion.div 
        className="absolute bottom-16 right-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 0.8 }}
      >
        <motion.div 
          className="w-16 h-16 border border-gray-300 transform rotate-45"
          animate={{ rotate: [45, 90, 45] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </motion.div>

      {/* Code snippet decoration */}
      <motion.div
        className="absolute bottom-8 left-8 text-xs text-gray-300 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1 }}
      >
        <pre>
{`while(true) {
  learn();
  code();
  repeat();
}`}
        </pre>
      </motion.div>

      {/* Page indicator with animation */}
      <motion.div
        className="absolute top-16 right-16 text-xs text-gray-400 font-light flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.span
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          →
        </motion.span>
        /01
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 right-8 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-xs text-gray-400">scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ↓
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Me1;