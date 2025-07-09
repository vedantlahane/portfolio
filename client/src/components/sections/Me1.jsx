import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const Me1 = () => {
  const [downloadStatus, setDownloadStatus] = useState('idle');

  const handleDownloadCV = useCallback(async () => {
    try {
      setDownloadStatus('downloading');
      
      const cvPath = '/assets/Vedant_Lahane_CV.pdf';
      
      const response = await fetch(cvPath, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error('CV file not found');
      }
      
      const link = document.createElement('a');
      link.href = cvPath;
      link.download = 'Vedant_Lahane_CV.pdf';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadStatus('success');
      setTimeout(() => setDownloadStatus('idle'), 3000);
      
    } catch (error) {
      console.error('CV download failed:', error);
      setDownloadStatus('error');
      setTimeout(() => setDownloadStatus('idle'), 3000);
    }
  }, []);

  const getButtonContent = () => {
    switch (downloadStatus) {
      case 'downloading':
        return 'DOWNLOADING...';
      case 'success':
        return 'DOWNLOADED';
      case 'error':
        return 'ERROR - RETRY';
      default:
        return 'DOWNLOAD CV';
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white p-8 md:p-12 lg:p-16 min-h-[65vh] h-full relative flex flex-col"
    >
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
      <div className="flex-1 flex flex-col justify-center max-w-2xl">
        <motion.h1 
          className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Hello.
        </motion.h1>
        
        <motion.h2 
          className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          I'm Vedant Lahane
        </motion.h2>
        
        <motion.p 
          className="text-lg md:text-xl font-light text-gray-600 leading-relaxed mb-12 max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Crafting digital experiences that bridge innovation with functionality,
          focused on building scalable solutions for modern challenges.
        </motion.p>
        
        {/* Download Button */}
        <motion.button 
          onClick={handleDownloadCV}
          disabled={downloadStatus === 'downloading'}
          className={`
            self-start px-8 py-3 border border-gray-900 
            font-light text-sm tracking-wider uppercase
            transition-all duration-300
            ${downloadStatus === 'downloading' 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-gray-900 hover:text-white cursor-pointer'
            }
          `}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: downloadStatus === 'downloading' ? 1 : 1.02 }}
          whileTap={{ scale: downloadStatus === 'downloading' ? 1 : 0.98 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          {getButtonContent()}
        </motion.button>
      </div>

      {/* Minimal decorative element */}
      <motion.div 
        className="absolute bottom-16 right-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="w-16 h-16 border border-gray-300 transform rotate-45" />
      </motion.div>

      {/* Page indicator */}
      <motion.div
        className="absolute top-16 right-16 text-xs text-gray-400 font-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        /01
      </motion.div>
    </motion.section>
  );
};

export default Me1;