import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // import motion from framer-motion

const Hero1 = () => {
  return (
    <div className="min-h-screen m-4 w-4/5 mx-auto">
      <motion.div
  initial={{ opacity: 0, y: 60 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1.0, ease: "easeOut" }}
  className="relative overflow-hidden"
>
  {/* Background Elements */}
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]" />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/80" />
  </div>

  <section className="text-white py-20 min-h-screen flex items-center pt-36">
    <div className="container mx-auto px-4">
      {/* Waving Hand and Greeting */}
      <div className="flex items-center space-x-2 mb-3">
        <motion.img
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="size-14"
          src="https://img.icons8.com/emoji/100/waving-hand-light-skin-tone.png"
          alt="waving hand"
          loading="eager"
        />
        <h1 className="text-4xl font-semibold">Hey, there</h1>
      </div>

      {/* Name and Role */}
      <div className="flex space-x-5 items-baseline mb-2">
        <h1 className="text-7xl font-extrabold bg-gradient-to-r from-slate-300 to-gray-500 bg-clip-text text-transparent">
          I'm
        </h1>
        <motion.h1
          initial={{ backgroundPosition: '0% 50%' }}
          animate={{ backgroundPosition: '100% 50%' }}
          transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
          className="text-6xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent bg-[length:200%_auto]"
        >
          Vedant Lahane
        </motion.h1>
      </div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-6xl font-bold mb-8"
      >
        A Software Engineer
      </motion.p>

      {/* Description */}
      <p className="max-w-2xl text-2xl font-medium mb-8 text-gray-300">
        on a journey to learn and build <span className="text-blue-400">innovative</span> software solutions,
        with a focus on crafting <span className="text-purple-400">dynamic</span> and <span className="text-purple-400">user-friendly</span> experiences.
      </p>

      {/* Call-to-Action Buttons */}
      <div className="flex gap-4 mt-8">
        <a href="#projects" className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-3 rounded-lg font-medium hover:scale-105 transition-transform">
          View My Work
        </a>
        <a href="#contact" className="border border-blue-500 px-8 py-3 rounded-lg font-medium hover:bg-blue-500/10 transition-colors">
          Let's Connect
        </a>
      </div>
    </div>

    {/* Animated Gradient Line */}
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ duration: 1.5, delay: 0.8 }}
      className="h-1 mt-36 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md absolute bottom-20 left-0 right-0"
    />
  </section>
</motion.div>
    </div>
  );
};

export default Hero1; // export the Hero1 component
