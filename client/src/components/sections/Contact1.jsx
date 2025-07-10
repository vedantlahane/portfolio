import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const Contact1 = () => {
  const [copiedItem, setCopiedItem] = useState(null);

  const handleCopy = useCallback(async (text, itemId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(itemId);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className="bg-gray-50 p-12 lg:p-16 xl:p-20 h-full relative"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs text-gray-400 font-light"
        >
          06 &nbsp;&nbsp;CONTACT
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs text-gray-400 font-light"
        >
          /06
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl">
        <motion.h2
          className="text-4xl lg:text-5xl xl:text-6xl font-light leading-tight mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          LET'S START<br />
          A CONVERSATION.
        </motion.h2>

        {/* Contact Info */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div 
            className="cursor-pointer group"
            onClick={() => handleCopy('vedant@example.com', 'email')}
          >
            <p className="text-2xl lg:text-3xl font-light text-gray-900 group-hover:translate-x-2 transition-transform">
              vedant@example.com
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {copiedItem === 'email' ? 'COPIED' : 'CLICK TO COPY'}
            </p>
          </div>

          <div 
            className="cursor-pointer group"
            onClick={() => handleCopy('+919876543210', 'phone')}
          >
            <p className="text-2xl lg:text-3xl font-light text-gray-900 group-hover:translate-x-2 transition-transform">
              +91 98765 43210
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {copiedItem === 'phone' ? 'COPIED' : 'CLICK TO COPY'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Subtle animated line */}
      <motion.div
        className="absolute bottom-16 left-0 right-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"
          animate={{
            x: [-200, 200],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </motion.section>
  );
};

export default Contact1;