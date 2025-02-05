import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, ease: "easeOut" }}
      className="relative overflow-hidden"
    >
      <section className="text-white px-52 p-24 flex items-center pt-12">
        
        <div className="container mx-auto px-4">
          {/* Subtitle */}
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl md:text-3xl font-semibold">Hey, there</h1>
            {/* <img
              className="size-14 md:size-10 animate-wiggle"
              src="https://img.icons8.com/emoji/100/waving-hand-light-skin-tone.png"
              alt="Waving hand"
              role="img"
              aria-label="Waving hand"
              loading="eager"
              decoding="async"
            /> */}
            <motion.img
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="size-14"
              src="https://img.icons8.com/emoji/100/waving-hand-light-skin-tone.png"
              alt="waving hand"
              loading="eager"
            />
          </div>

          {/* Main Title */}
          <div className="flex space-x-5 items-baseline mb-2">
            <h1 className="text-7xl md:text-8xl font-extrabold bg-linear-to-r from-slate-500 to-gray-700 bg-clip-text text-transparent">
              I'm
            </h1>
            <h1 className="text-6xl md:text-7xl font-extrabold bg-linear-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Vedant Lahane
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-2xl md:text-4xl font-semibold mb-6 text-gray-300">
            Building <span className="text-blue-400">digital experiences</span>{" "}
            {/* that matter */}
          </p>

          {/* Description */}
          <p className="max-w-2xl text-lg md:text-xl text-gray-400 mb-8">
            Full-stack developer specializing in modern web technologies.
            Passionate about creating efficient, scalable solutions with React,
            Node.js, and cloud technologies.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 mt-8">
            <a
              href="#projects"
              className="bg-linear-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-lg font-medium hover:scale-105 transition-transform"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="border border-blue-500 px-8 py-3 rounded-lg font-medium hover:bg-blue-500/10 transition-colors"
            >
              Let's Connect
            </a>
          </div>
        </div>

        {/* Animated Gradient Line */}
        <div className="absolute bottom-20 left-0 right-0">
          <div className="relative h-1">
            <div className="h-1 bg-gray-800 rounded-full absolute inset-0"></div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-1 bg-linear-to-r from-blue-500 to-purple-500 rounded-full absolute inset-0"
            />
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Hero;
