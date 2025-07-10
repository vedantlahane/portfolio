import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  // Text segments for better mobile control
  const textSegments = [
    { text: "Started with a", highlight: false, delay: 0.7 },
    { text: '"Hello World"', highlight: true, delay: 0.8 },
    { text: "three years ago.", highlight: false, delay: 0.9 },
    { text: "Now building", highlight: false, delay: 1.0 },
    { text: "full-stack applications", highlight: true, delay: 1.1 },
    { text: "with AI integrations.", highlight: false, delay: 1.2 },
    { text: "Solved", highlight: false, delay: 1.3 },
    { text: "400+ problems", highlight: true, delay: 1.4 },
    { text: "along the way.", highlight: false, delay: 1.5 },
    { text: "Currently exploring", highlight: false, delay: 1.6 },
    { text: "Web3", highlight: true, delay: 1.7 },
    { text: "and cloud architecture.", highlight: false, delay: 1.8 }
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-black text-white p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 h-full relative overflow-hidden flex flex-col"
    >
      {/* Background gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900" />

      {/* Section Label */}
      <motion.div
        className="mb-8 sm:mb-10 lg:mb-12 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs sm:text-sm text-gray-500 font-mono font-light">03 &nbsp;&nbsp;ABOUT</p>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center relative z-10">
        {/* Flowing Text - Responsive */}
        <motion.div
          className="text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-2xl font-sans font-light leading-relaxed sm:leading-relaxed lg:leading-loose max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {textSegments.map((segment, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: segment.delay }}
              className={`inline-block mr-2 ${
                segment.highlight 
                  ? 'text-white font-medium' 
                  : 'text-gray-400'
              }`}
            >
              {segment.text}
            </motion.span>
          ))}
        </motion.div>

        {/* Journey milestones - Mobile friendly
        <motion.div
          className="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          {[
            { label: "Years Coding", value: "3+" },
            { label: "Projects", value: "15+" },
            { label: "Problems Solved", value: "400+" },
            { label: "Technologies", value: "12+" },
            { label: "GitHub Repos", value: "20+" },
            { label: "Lines of Code", value: "50k+" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center sm:text-left"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.2 + index * 0.1 }}
            >
              <div className="text-xl sm:text-2xl md:text-3xl font-display font-light text-white mb-1">
                {stat.value}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-600 font-sans uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div> */}
      </div>

      {/* Decorative Elements */}
      
      {/* Floating CSE text - Responsive */}
      <motion.div
        className="absolute bottom-6 sm:bottom-10 lg:bottom-16 left-6 sm:left-10 lg:left-16 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-light text-gray-800/30 pointer-events-none"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        CSE
      </motion.div>

      {/* Animated code snippet */}
      <motion.div
        className="absolute top-1/3 right-6 sm:right-10 lg:right-16 text-[10px] sm:text-xs text-gray-700 font-mono hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 2.5 }}
      >
        <pre>
{`function grow() {
  while(learning) {
    code++;
    solve++;
  }
}`}
        </pre>
      </motion.div>

      {/* Page indicator */}
      <motion.div
        className="absolute top-6 sm:top-8 lg:top-12 xl:top-16 right-6 sm:right-8 lg:right-12 xl:right-16 text-xs sm:text-sm text-gray-500 font-mono font-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        /03
      </motion.div>

      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Floating dots animation */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-1 h-1 bg-gray-600 rounded-full hidden lg:block"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5
          }}
        />
      ))}

      {/* Corner accent */}
      <motion.div
        className="absolute bottom-0 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-tl from-white/10 to-transparent rounded-tl-full" />
      </motion.div>
    </motion.section>
  );
};

export default About;