import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader({ onComplete }) {
    const [stage, setStage] = useState('loading'); // 'loading' | 'sliding' | 'done'

    useEffect(() => {
        // 0.0s to 1.5s: Show loading
        const timer1 = setTimeout(() => {
            setStage('sliding');
        }, 1500);

        // 1.5s to 2.0s: Slide up (500ms)
        // 2.0s: Landing content starts appearing (handled by landing components delay)
        // 2.3s: Preloader fully unmounted
        const timer2 = setTimeout(() => {
            setStage('done');
            if (onComplete) onComplete();
        }, 2300);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [onComplete]);

    if (stage === 'done') return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white pointer-events-none"
                initial={{ originY: 0 }}
                animate={stage === 'sliding' ? { scaleY: 0 } : { scaleY: 1 }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            // using origin-top (originY: 0) means it collapses upwards
            >
                <div
                    className="flex flex-col items-center justify-center"
                    style={{ opacity: stage === 'sliding' ? 0 : 1, transition: 'opacity 0.2s' }}
                >
                    {/* Rotating Diamond Logo */}
                    <motion.div
                        className="w-12 h-12 border-2 border-gray-900 mb-8"
                        animate={{ rotate: [45, 135, 225, 315] }}
                        transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                    />

                    {/* Pulsing Text */}
                    <motion.div
                        className="font-mono text-[10px] tracking-[0.3em] text-gray-400 font-medium ml-1"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
                    >
                        L O A D I N G
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
