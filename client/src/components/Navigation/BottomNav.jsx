import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const navItems = [
    { id: 'about', label: 'about', href: '#about' },
    { id: 'projects', label: 'projects', href: '#projects' },
    { id: 'skills', label: 'skills', href: '#skills' },
    { id: 'contact', label: 'contact', href: '#contact' },
];

export default function BottomNav() {
    const [activeSection, setActiveSection] = useState('about');
    const [isVisible, setIsVisible] = useState(true);
    const location = useLocation();

    // Handle scroll detection for visibility and active state
    useEffect(() => {
        // Only show on landing page
        if (location.pathname !== '/') {
            setIsVisible(false);
            return;
        }

        let lastScrollY = window.scrollY;
        let timeoutId = null;

        const handleScroll = () => {
            if (timeoutId) return;

            timeoutId = setTimeout(() => {
                const scrollY = window.scrollY;
                const windowHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;

                // Hide if at very bottom
                if (scrollY + windowHeight >= documentHeight - 50) {
                    setIsVisible(false);
                } else {
                    setIsVisible(true);
                }

                // Check active section
                let currentSection = navItems[0].id;
                navItems.forEach(item => {
                    const element = document.getElementById(item.id);
                    if (element) {
                        const rect = element.getBoundingClientRect();
                        // If section is in the top half of viewport
                        if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
                            currentSection = item.id;
                        }
                    }
                });
                setActiveSection(prev => prev !== currentSection ? currentSection : prev);
                lastScrollY = scrollY;
                timeoutId = null;
            }, 50);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Handle keyboard open on mobile (approximated by resize)
        const handleResize = () => {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                setIsVisible(false);
            }
        };
        window.addEventListener('resize', handleResize);

        handleScroll(); // Initial check

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [location.pathname]);

    const handleNavClick = (e, href, id) => {
        e.preventDefault();
        setActiveSection(id);
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.nav
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 h-12 bg-white border-t border-gray-200 z-50 flex sm:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
                >
                    <div className="flex w-full justify-around items-center px-2 relative">
                        {navItems.map((item) => {
                            const isActive = activeSection === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={(e) => handleNavClick(e, item.href, item.id)}
                                    className={`relative flex flex-col items-center justify-center w-full h-full text-[11px] font-sans transition-colors duration-200 ${isActive ? 'text-gray-900 font-medium' : 'text-gray-500'
                                        }`}
                                >
                                    <span className="mb-0.5">{item.label}</span>

                                    {/* The dot indicator */}
                                    <div className="h-1.5 w-1.5 mt-0.5 flex items-center justify-center">
                                        {isActive ? (
                                            <motion.div
                                                layoutId="bottomNavDot"
                                                className="w-1.5 h-1.5 bg-gray-900 rounded-full"
                                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                            />
                                        ) : (
                                            <div className="w-1 h-1 border border-gray-400 rounded-full opacity-50" />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </motion.nav>
            )
            }
        </AnimatePresence >
    );
}
