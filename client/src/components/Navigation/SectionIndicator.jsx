import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const sections = [
    { id: 'hero', label: 'HERO' },
    { id: 'about', label: 'ABOUT' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'contact', label: 'CONTACT' },
    { id: 'footer', label: 'FOOTER' },
];

export default function SectionIndicator() {
    const [activeIdx, setActiveIdx] = useState(0);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname !== '/') return;

        let timeoutId = null;

        const handleScroll = () => {
            if (timeoutId) return;

            timeoutId = setTimeout(() => {
                const scrollY = window.scrollY;
                const windowHeight = window.innerHeight;

                // Calculate active section based on proximity to vertical center
                let closestIdx = 0;
                let minDistance = Infinity;

                sections.forEach((section, index) => {
                    // Special cases for top and bottom of page
                    if (index === 0) {
                        if (scrollY < windowHeight * 0.3) {
                            closestIdx = 0;
                            return;
                        }
                    }
                    if (index === sections.length - 1) {
                        if (scrollY + windowHeight >= document.documentElement.scrollHeight - windowHeight * 0.3) {
                            closestIdx = index;
                            return;
                        }
                    }

                    const el = document.getElementById(section.id);
                    if (el) {
                        const rect = el.getBoundingClientRect();
                        const distanceToCenter = Math.abs(rect.top + rect.height / 2 - windowHeight / 2);
                        if (distanceToCenter < minDistance) {
                            minDistance = distanceToCenter;
                            closestIdx = index;
                        }
                    }
                });

                setActiveIdx(prev => prev !== closestIdx ? closestIdx : prev);
                timeoutId = null;
            }, 50);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    // Only render on desktop for the landing page
    if (location.pathname !== '/') return null;

    const handleDotClick = (id) => {
        // If hero or footer, scroll to top/bottom
        if (id === 'hero') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        if (id === 'footer') {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            return;
        }

        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-4 z-40 pointer-events-none">
            {sections.map((section, idx) => {
                const isActive = activeIdx === idx;
                const isAdjacent = Math.abs(activeIdx - idx) === 1;

                return (
                    <div key={section.id} className="relative flex items-center justify-end group pointer-events-auto">
                        {/* Tooltip Label */}
                        <motion.div
                            initial={false}
                            animate={{ opacity: 0, x: 10 }}
                            whileHover={{ opacity: 1, x: -12 }}
                            className="absolute right-full mr-2 rounded shadow-sm bg-white px-2 py-1 text-xs font-mono text-gray-600 pointer-events-none whitespace-nowrap"
                        >
                            {section.label}
                        </motion.div>

                        {/* Dot Indicator */}
                        <button
                            onClick={() => handleDotClick(section.id)}
                            className="flex items-center justify-center w-6 h-6 focus:outline-none"
                            aria-label={`Scroll to ${section.label}`}
                        >
                            <div
                                className={`rounded-full transition-all duration-300 ease-out ${isActive
                                    ? 'w-2 h-2 bg-gray-900 scale-125'
                                    : isAdjacent
                                        ? 'w-[6px] h-[6px] bg-gray-400'
                                        : 'w-1.5 h-1.5 bg-gray-300'
                                    }`}
                            />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
