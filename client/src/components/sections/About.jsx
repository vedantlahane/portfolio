
import { motion } from 'framer-motion';

const About = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-black text-white p-8 md:p-12 lg:p-16 h-full relative overflow-hidden"
    >
      {/* Section Label */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs text-gray-500 font-light">03 &nbsp;&nbsp;ABOUT</p>
      </motion.div>

      {/* Flowing Text */}
      <motion.div
        className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="inline-block"
        >
          Started with a "Hello World" 
        </motion.span>{' '}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="inline-block text-gray-500"
        >
          three years ago.
        </motion.span>{' '}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="inline-block"
        >
          Now building
        </motion.span>{' '}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="inline-block text-white font-normal"
        >
          full-stack applications
        </motion.span>{' '}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="inline-block text-gray-500"
        >
          with AI integrations.
        </motion.span>{' '}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="inline-block"
        >
          Solved
        </motion.span>{' '}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="inline-block text-white font-normal"
        >
          400+ problems
        </motion.span>{' '}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="inline-block text-gray-500"
        >
          along the way.
        </motion.span>{' '}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="inline-block"
        >
          Currently exploring
        </motion.span>{' '}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="inline-block text-white font-normal"
        >
          Web3
        </motion.span>{' '}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          className="inline-block text-gray-500"
        >
          and cloud architecture.
        </motion.span>
      </motion.div>

      {/* Floating elements */}
      <motion.div
        className="absolute bottom-16 left-16 text-6xl md:text-8xl font-light text-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.8 }}
      >
        CSE
      </motion.div>

      {/* Page indicator */}
      <motion.div
        className="absolute top-16 right-16 text-xs text-gray-500 font-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        /03
      </motion.div>
    </motion.section>
  );
};

export default About;