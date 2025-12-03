import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PracticeList from '../components/PracticeList';

const PracticePage = () => (
  <div className="bg-white font-sans text-gray-900">
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
      <header className=''>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white border-b border-gray-200"
        >
          <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-4 sm:py-5 md:py-6">
            <div className="flex items-center justify-between">
              {/* Logo/Name Section */}
              <motion.div
                className="flex items-center gap-3 sm:gap-4 cursor-pointer"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                {/* Geometric Logo */}
                <motion.div
                  className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0"
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="absolute inset-0 bg-gray-900 transform rotate-45 rounded-sm" />
                  <div className="absolute inset-1 bg-white transform rotate-45 rounded-sm" />
                  <div className="absolute inset-2 bg-gray-900 transform rotate-45 rounded-sm" />
                </motion.div>

                {/* Name and Label */}
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-400 font-light mb-0.5 font-mono hidden sm:block">
                    10 &nbsp;&nbsp;PRACTICE
                  </p>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900">
                    Vedant
                  </h1>
                </div>
              </motion.div>

              {/* Back to Portfolio Link */}
              <Link
                to="/"
                className="group relative px-3 lg:px-5 xl:px-6 py-2 text-sm lg:text-base font-sans font-light transition-all duration-300 text-gray-500 hover:text-gray-900"
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden>←</span>
                  Back to portfolio
                </span>
                <motion.div
                  className="absolute bottom-0 left-3 right-3 lg:left-5 lg:right-5 h-px bg-gray-900"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </div>
          </div>
        </motion.div>
      </header>

      <main>
        <PracticeList />
      </main>

      <footer className="border-t border-gray-200">
        <div className="py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-mono">
            <p>Practice tracking powered by local storage</p>
            <p>© 2024 Vedant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  </div>
);

export default PracticePage;
