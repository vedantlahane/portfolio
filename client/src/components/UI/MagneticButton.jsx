import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function MagneticButton({ children, href, onClick, className = '' }) {
    const ref = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    // Spring configuration for magnetic pull
    const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };

    const x = useSpring(0, springConfig);
    const y = useSpring(0, springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!ref.current) return;

            const rect = ref.current.getBoundingClientRect();
            const clientX = e.clientX;
            const clientY = e.clientY;

            // Calculate distance from center of button
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Distance threshold for magnetism
            const distance = Math.max(Math.abs(clientX - centerX), Math.abs(clientY - centerY));

            if (distance < 100) { // 100px magnetic radius
                setIsHovered(true);
                // Only pull 30% towards the mouse
                x.set((clientX - centerX) * 0.3);
                y.set((clientY - centerY) * 0.3);
            } else {
                setIsHovered(false);
                x.set(0);
                y.set(0);
            }
        };

        const handleMouseLeave = () => {
            setIsHovered(false);
            x.set(0);
            y.set(0);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [x, y]);

    const baseClasses = "relative overflow-hidden border border-gray-900 bg-transparent text-gray-900 text-xs tracking-wider uppercase px-6 py-3 cursor-pointer group rounded-none inline-flex items-center justify-center";
    const mergedClasses = `${baseClasses} ${className}`;

    const InnerContent = () => (
        <>
            <span className="relative z-10 transition-colors duration-300 group-hover:text-white pointer-events-none">
                {children}
            </span>
            {/* Background slide fill */}
            <div className="absolute inset-0 bg-gray-900 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out z-0" />
        </>
    );

    if (href) {
        // If it's a real link, use <a>
        return (
            <motion.a
                href={href}
                ref={ref}
                style={{ x, y }}
                className={mergedClasses}
                whileTap={{ scale: 0.95 }}
            >
                <InnerContent />
            </motion.a>
        );
    }

    // Otherwise button
    return (
        <motion.button
            ref={ref}
            onClick={onClick}
            style={{ x, y }}
            className={mergedClasses}
            whileTap={{ scale: 0.95 }}
        >
            <InnerContent />
        </motion.button>
    );
}
