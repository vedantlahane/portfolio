import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const WorkInProgress = () => {
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(false);
    }, 5000);

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
                className="fixed top-20 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-gray-900/95 backdrop-blur-xl rounded-2xl flex items-center gap-3 shadow-2xl border border-gray-800 z-50"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-300 text-sm">
                  For the best experience, please view on desktop
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            className="fixed bottom-4 right-4 px-4 py-3 bg-gray-900/95 backdrop-blur-xl rounded-2xl flex items-center gap-3 shadow-2xl border border-purple-500/20 z-50"
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
            <span className="text-purple-300 text-sm">
              Mobile optimization in progress
            </span>
          </motion.div>
        </>
      )}
    </>
  );
};

export default WorkInProgress;