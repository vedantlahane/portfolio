import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PracticeList from '../components/PracticeList';

const PracticePage = () => {
  const [authorized, setAuthorized] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passKey, setPassKey] = useState('');
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Show auth modal when visiting page; allow session persisting
    const savedAuth = localStorage.getItem('practice-authorized');
    if (savedAuth === 'true') {
      setAuthorized(true);
      setShowAuthModal(false);
    } else {
      setShowAuthModal(true);
    }
  }, []);

  // Optional: If you'd like to add a "remember" checkbox, we could persist authorization in localStorage.

  const handleSubmitPass = (e) => {
    e.preventDefault();
    if (String(passKey).trim() === '9420') {
      setAuthorized(true);
      setAuthError(null);
      setShowAuthModal(false);
      localStorage.setItem('practice-authorized', 'true');
    } else {
      setAuthError('Incorrect passkey — try again');
      setAuthorized(false);
    }
  };

  const handleRequestAuth = () => {
    setShowAuthModal(true);
  };

  return (
  <div className="bg-white dark:bg-[#090d16] font-sans text-gray-900 dark:text-neutral-100 min-h-screen transition-colors duration-300">
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
      <header className=''>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800"
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
                  <div className="absolute inset-0 bg-gray-900 dark:bg-white transform rotate-45 rounded-sm" />
                  <div className="absolute inset-1 bg-white dark:bg-neutral-900 transform rotate-45 rounded-sm" />
                  <div className="absolute inset-2 bg-gray-900 dark:bg-white transform rotate-45 rounded-sm" />
                </motion.div>

                {/* Name and Label */}
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-400 dark:text-neutral-500 font-light mb-0.5 font-mono hidden sm:block">
                    <span className="text-accent font-medium">10</span> &nbsp;&nbsp;PRACTICE
                  </p>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white">
                    Vedant
                  </h1>
                </div>
              </motion.div>

              {/* Back to Portfolio Link */}
              <Link
                to="/"
                className="group relative px-3 lg:px-5 xl:px-6 py-2 text-sm lg:text-base font-sans font-light transition-all duration-300 text-gray-500 dark:text-neutral-400 hover:text-accent dark:hover:text-accent"
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden>←</span>
                  Back to portfolio
                </span>
                <motion.div
                  className="absolute bottom-0 left-3 right-3 lg:left-5 lg:right-5 h-px bg-accent"
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
        <PracticeList authorized={authorized} onRequestAuth={handleRequestAuth} />
      </main>

      <footer className="border-t border-gray-200 dark:border-neutral-800">
        <div className="py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-neutral-400 font-mono">
            <p>Practice tracking powered by local storage</p>
            <p className="flex items-center gap-2">
              {authorized ? (
                <span className="text-emerald-500">🔓 Unlocked</span>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="text-xs text-rose-500 hover:underline"
                >
                  🔒 Locked — enter passkey
                </button>
              )}
            </p>
            <p>© 2024 Vedant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    {/* Auth Modal */}
    {showAuthModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-xl max-w-md w-full p-6 text-gray-900 dark:text-white"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Enter passkey</h3>
          <p className="text-xs text-gray-500 dark:text-neutral-400 mb-4">This practice page requires a passkey to access. (Hint: 4 digits)</p>
          <form onSubmit={handleSubmitPass} className="flex gap-2">
            <input
              type="password"
              value={passKey}
              onChange={(e) => setPassKey(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-gray-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 dark:bg-accent text-white dark:text-neutral-950 rounded text-sm hover:bg-neutral-800 dark:hover:bg-accent/90 transition-colors font-medium"
            >
              Unlock
            </button>
          </form>
          {authError && <p className="text-xs text-red-500 mt-2">{authError}</p>}
        </motion.div>
      </div>
    )}

  </div>
  );
};

export default PracticePage;
