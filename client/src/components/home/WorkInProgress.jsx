import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const WorkInProgress = () => {
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(false);
    }, 5000); // Hide after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const isMobile = window.innerWidth <= 768;

  return (
    <>
      {isMobile && (
        <>
          <AnimatePresence>
            {showPopup && (
              <motion.div
                className="fixed top-22 left-64 transform -translate-x-8 px-6 mx-0 py-3 bg-gradient-to-r from-slate-800/80 to-slate-800/20 backdrop-blur-sm rounded-4xl flex items-center shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-purple-300">
                  For the best experience, please open in desktop mode.
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="fixed bottom-4 right-4 px-6 py-3 bg-slate-800/80 backdrop-blur-sm rounded-2xl flex items-center space-x-2 shadow-lg border border-purple-400/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ rotate: [0, 20, -20, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🚧
            </motion.div>
            <span className="text-purple-300">
              Working on it - updates coming soon!
            </span>
          </motion.div>
        </>
      )}
    </>
  );
};

export default WorkInProgress;
