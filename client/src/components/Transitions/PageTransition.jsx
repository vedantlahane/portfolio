import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function PageTransition({ children }) {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div key={location.pathname} className="relative w-full h-full">
                {/* The Page Content */}
                {children}

                {/* The Dark Curtain (Exit Animation) */}
                <motion.div
                    className="fixed inset-0 bg-gray-900 z-[80] pointer-events-none"
                    initial={{ scaleY: 1, originY: 0 }} // Start fully covering, then shrink up
                    animate={{ scaleY: 0, originY: 0 }} // Drop away on mount
                    exit={{ scaleY: 1, originY: 1 }}    // Grow up on exit
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
            </motion.div>
        </AnimatePresence>
    );
}
