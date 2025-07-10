import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MouseFollowerAdvanced = ({ 
  size = 16, 
  color = 'bg-gray-900', 
  mixBlend = 'mix-blend-difference',
  showOnMobile = false 
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const isMobile = window.innerWidth < 768;
    if (isMobile && !showOnMobile) return;

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [showOnMobile]);

  if (!isVisible) return null;

  return (
    <motion.div
      className={`fixed rounded-full pointer-events-none z-50 ${color} ${mixBlend}`}
      style={{
        width: size,
        height: size,
      }}
      animate={{
        x: mousePosition.x - size / 2,
        y: mousePosition.y - size / 2,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
      }}
    />
  );
};

export default MouseFollowerAdvanced;