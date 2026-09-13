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
            <motion.div 
                key={location.pathname} 
                className="relative w-full h-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                {childrenWithLocation}
            </motion.div>
        </AnimatePresence>
    );
}
