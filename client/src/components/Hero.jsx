import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.0 }}
      className="relative overflow-hidden"
    >
      <section className="text-white py-20 md:py-32 px-4 sm:px-6 lg:px-8 flex items-center relative">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 right-10 w-20 h-20 border border-blue-500/20 rounded-lg transform rotate-12"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-20 left-10 w-32 h-32 border border-purple-500/20 rounded-full"
          />
        </div>

        <div className="container mx-auto relative z-10">
          {/* Enhanced Subtitle */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="flex items-center gap-3 backdrop-blur-sm bg-white/5 px-5 py-2 rounded-full border border-white/10 inline-flex">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <h1 className="text-2xl md:text-3xl font-medium">Hey, there</h1>
              <motion.img
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 20, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-8 h-8 md:w-10 md:h-10"
                src="https://img.icons8.com/emoji/100/waving-hand-light-skin-tone.png"
                alt="waving hand"
                loading="eager"
              />
            </div>
          </motion.div>

          {/* Enhanced Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none">
              <span className="block text-gray-400 text-4xl sm:text-5xl md:text-6xl mb-2">I'm</span>
              <span className="block relative">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
                  Vedant Lahane
                </span>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                  className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                />
              </span>
            </h1>
          </motion.div>

          {/* Enhanced Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-gray-300"
          >
            Building{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                digital experiences
              </span>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl"
              />
            </span>
          </motion.p>

          {/* Enhanced Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-3xl mb-12"
          >
            <p className="text-lg sm:text-xl md:text-2xl text-gray-400 leading-relaxed">
              Full-stack developer specializing in modern web technologies.
              Passionate about creating{" "}
              <span className="text-gray-300 font-medium">efficient</span>,{" "}
              <span className="text-gray-300 font-medium">scalable</span> solutions 
              with React, Node.js, and cloud technologies.
            </p>
          </motion.div>

          {/* Enhanced CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 rounded-xl font-semibold text-lg overflow-hidden transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:scale-105"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                View My Work
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </motion.a>

            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 rounded-xl font-semibold text-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 opacity-50"></div>
              <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-border rounded-xl"></div>
              <div className="absolute inset-[2px] bg-gray-900 rounded-xl group-hover:bg-gray-800/50 transition-colors duration-300"></div>
              <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white transition-colors">
                Let's Connect
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </span>
            </motion.a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex gap-4 mt-12"
          >
            {[
              { icon: "github", href: "#" },
              { icon: "linkedin", href: "#" },
              { icon: "twitter", href: "#" },
            ].map((social, index) => (
              <motion.a
                key={social.icon}
                href={social.href}
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                <span className="text-gray-400 hover:text-white transition-colors">
                  {social.icon[0].toUpperCase()}
                </span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Animated Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent origin-center"
        />
      </div>
    </motion.div>
  );
};

export default Hero;