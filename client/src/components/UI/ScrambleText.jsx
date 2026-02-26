import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const CHARS = '!<>-_\\\\/[]{}—=+*^?#________';

export default function ScrambleText({
    text,
    duration = 800,
    delay = 0,
    className = ''
}) {
    const [displayText, setDisplayText] = useState('');
    const [isScrambling, setIsScrambling] = useState(false);
    const frameRef = useRef(null);

    useEffect(() => {
        let start;
        let timeout;

        // Animate logic
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const progressRatio = Math.min(progress / duration, 1);

            let scrambled = '';
            for (let i = 0; i < text.length; i++) {
                // As time progresses, reveal more correct characters
                if (progressRatio * text.length > i) {
                    scrambled += text[i];
                } else {
                    scrambled += CHARS[Math.floor(Math.random() * CHARS.length)];
                }
            }

            setDisplayText(scrambled);

            if (progressRatio < 1) {
                frameRef.current = requestAnimationFrame(animate);
            } else {
                setIsScrambling(false);
                setDisplayText(text);
            }
        };

        // Delay start
        timeout = setTimeout(() => {
            setIsScrambling(true);
            frameRef.current = requestAnimationFrame(animate);
        }, delay);

        return () => {
            clearTimeout(timeout);
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [text, duration, delay]);

    // Handle hover effect
    const handleMouseEnter = () => {
        if (isScrambling) return;

        setIsScrambling(true);
        let start;

        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const progressRatio = Math.min(progress / (duration / 2), 1); // faster on hover

            let scrambled = '';
            for (let i = 0; i < text.length; i++) {
                if (progressRatio * text.length > i) {
                    scrambled += text[i];
                } else {
                    scrambled += CHARS[Math.floor(Math.random() * CHARS.length)];
                }
            }

            setDisplayText(scrambled);

            if (progressRatio < 1) {
                frameRef.current = requestAnimationFrame(animate);
            } else {
                setIsScrambling(false);
                setDisplayText(text); // Ensure final exact string
            }
        };

        if (frameRef.current) cancelAnimationFrame(frameRef.current);
        frameRef.current = requestAnimationFrame(animate);
    };

    return (
        <motion.span
            className={`inline-block whitespace-pre-wrap ${className}`}
            onMouseEnter={handleMouseEnter}
        >
            {displayText || ' '}
        </motion.span>
    );
}
