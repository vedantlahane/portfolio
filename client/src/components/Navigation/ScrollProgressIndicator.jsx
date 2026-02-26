import React, { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';

export default function ScrollProgressIndicator() {
    const { scrollYProgress } = useScroll();

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-[2px] bg-gray-900 z-[90] origin-left"
            style={{ scaleX: scrollYProgress }}
        />
    );
}
