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

  const contactInfo = [
    {
      id: 'email',
      label: 'Email',
      value: 'vedantanillahane@gmail.com',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      )
    },
    {
      id: 'phone',
      label: 'Phone',
      value: '+91 7447335096',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      )
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className="relative overflow-hidden bg-white/85 backdrop-blur-xl border border-white/70 shadow-xl shadow-gray-200/40 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 2xl:p-20 h-full flex flex-col rounded-3xl"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -inset-20 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.12),_transparent_60%)]" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-sky-100/40 via-transparent to-transparent" />
      </div>
      {/* Header */}
  <div className="relative z-10 flex justify-between items-start mb-8 sm:mb-12 lg:mb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs sm:text-sm text-gray-400 font-mono font-light"
        >
          06 &nbsp;&nbsp;CONTACT
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs sm:text-sm text-gray-400 font-mono font-light"
        >
          /06
        </motion.div>
      </div>

      {/* Main Content */}
  <div className="relative z-10 flex-1 flex flex-col justify-center max-w-2xl w-full">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-light leading-tight mb-8 sm:mb-12 lg:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <span className="block">LET'S</span>
          <span className="block">CONNECT.</span>
        </motion.h2>

        {/* Unified Contact Info Style */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {contactInfo.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
            >
              <div
                className="cursor-pointer group"
                onClick={() => handleCopy(item.value, item.id)}
              >
                <div className="flex items-center gap-4 group-hover:translate-x-2 transition-all duration-300">
                  <div className="text-gray-600 opacity-70 group-hover:opacity-100 transition-opacity">
                    {item.icon}
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-sans font-light text-gray-900 break-all">
                    {item.value}
                  </p>
                </div>
                <p className="text-xs text-gray-400 font-mono mt-1 ml-9">
                  {copiedItem === item.id ? 'COPIED ✓' : 'CLICK TO COPY'}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gray-300 rounded-full hidden lg:block"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      {/* Animated Line */}
      <motion.div
        className="absolute bottom-8 sm:bottom-12 lg:bottom-16 left-0 right-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent"
          animate={{
            x: [-200, 200],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </motion.div>
    </motion.section>
  );
};

export default Contact1;
