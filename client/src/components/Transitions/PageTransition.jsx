import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function PageTransition({ children }) {
    const location = useLocation();

    // Since children is a <Routes> component from react-router v6,
    // we need to clone it and pass the location prop so that the exiting 
    // page retains the old location while animating out.
    const childrenWithLocation = React.isValidElement(children) 
        ? React.cloneElement(children, { location: location, key: location.pathname })
        : children;

    return (
        <AnimatePresence mode="wait">
            <motion.div key={location.pathname} className="relative w-full h-full">
                {childrenWithLocation}
                
                <motion.div
                    className="fixed inset-0 bg-gray-900 z-[80] pointer-events-none"
                    initial={{ scaleY: 1, originY: 0 }}
                    animate={{ scaleY: 0, originY: 0 }}
                    exit={{ scaleY: 1, originY: 1 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
            </motion.div>
        </AnimatePresence>
    );
}
