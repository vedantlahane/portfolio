import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function getRandomColorClass(velocity) {
  // More colors at higher velocity
  const baseColors = ["bg-blue-200", "bg-blue-300", "bg-blue-400", "bg-purple-300"];
  const fastColors = ["bg-blue-500", "bg-purple-400", "bg-pink-400"];
  
  const colors = velocity > 0.5 ? [...baseColors, ...fastColors] : baseColors;
  return colors[Math.floor(Math.random() * colors.length)];
}

function SmokeEffect({ particlesPerEmit = 3 }) {
  const [particles, setParticles] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const [lastMouse, setLastMouse] = useState({
    x: 0,
    y: 0,
    time: performance.now(),
  });

  const createParticle = useCallback(
    (x, y, id, baseAngle = -Math.PI / 2, velocity = 0.2) => {
      const clampedVelocity = Math.min(velocity, 1);
      const isSparkle = Math.random() > 0.7 && velocity > 0.3;
      
      return {
        id,
        x,
        y,
        angle: baseAngle + (Math.random() - 0.5) * (Math.PI / 4),
        speed: Math.random() * 1.5 + 0.5,
        size: isSparkle ? 4 : clampedVelocity * 25 + 10,
        opacity: isSparkle ? 0.9 : clampedVelocity * 0.5 + 0.2,
        fadeSpeed: isSparkle ? 0.5 : Math.random() * 1 + 1.5,
        colorClass: getRandomColorClass(clampedVelocity),
        isSparkle,
        rotation: Math.random() * 360,
        glowIntensity: clampedVelocity,
      };
    },
    []
  );

  const createTrail = useCallback(
    (x, y, id, angle, velocity) => ({
      id,
      x,
      y,
      angle,
      length: velocity * 100,
      opacity: velocity * 0.3,
      colorClass: "bg-gradient-to-r from-blue-400/50 to-purple-400/50",
    }),
    []
  );

  const emitParticles = useCallback(
    (x, y, baseAngle, velocity) => {
      const particleCount = Math.min(particlesPerEmit + Math.floor(velocity * 3), 8);
      const newParticles = Array.from({ length: particleCount }, (_, i) =>
        createParticle(x, y, Date.now() + i, baseAngle, velocity)
      );
      
      // Add trail effect for fast movement
      if (velocity > 0.5) {
        const trail = createTrail(x, y, Date.now() + 1000, baseAngle, velocity);
        setParticles((prev) => [...prev, ...newParticles, trail]);
      } else {
        setParticles((prev) => [...prev, ...newParticles]);
      }

      // Add sparkles for very fast movement
      if (velocity > 0.7) {
        const newSparkles = Array.from({ length: 2 }, (_, i) => ({
          id: Date.now() + 2000 + i,
          x,
          y,
          delay: i * 0.1,
        }));
        setSparkles((prev) => [...prev, ...newSparkles]);
        
        setTimeout(() => {
          setSparkles((prev) => prev.filter((s) => !newSparkles.find((ns) => ns.id === s.id)));
        }, 1000);
      }

      setTimeout(() => {
        setParticles((prev) =>
          prev.filter((p) => !newParticles.find((np) => np.id === p.id))
        );
      }, 3000);
    },
    [createParticle, createTrail, particlesPerEmit]
  );

  useEffect(() => {
    const handleMouseMove = (e) => {
      const now = performance.now();
      const dx = e.clientX - lastMouse.x;
      const dy = e.clientY - lastMouse.y;
      const dt = now - lastMouse.time || 16;

      const distance = Math.sqrt(dx * dx + dy * dy);
      const velocity = distance / dt;

      if (distance > 2) { // Only emit if mouse actually moved
        const angle = Math.atan2(dy, dx);
        emitParticles(e.clientX, e.clientY, angle, velocity);
      }

      setLastMouse({ x: e.clientX, y: e.clientY, time: now });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [emitParticles, lastMouse]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-transparent">
      <AnimatePresence>
        {/* Regular particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute rounded-full ${particle.colorClass}`}
            initial={{
              x: particle.x,
              y: particle.y,
              scale: 1,
              opacity: particle.opacity,
              rotate: particle.rotation,
            }}
            animate={{
              x: particle.x + Math.cos(particle.angle) * 200 * particle.speed,
              y: particle.y + Math.sin(particle.angle) * 200 * particle.speed,
              scale: particle.isSparkle ? [1, 1.5, 0] : [1, 2.5],
              opacity: 0,
              rotate: particle.rotation + 180,
            }}
            exit={{ opacity: 0, scale: 3 }}
            transition={{
              duration: particle.fadeSpeed,
              ease: particle.isSparkle ? "easeIn" : "easeOut",
            }}
            style={{
              width: particle.size,
              height: particle.size,
              filter: particle.isSparkle 
                ? `blur(0px) drop-shadow(0 0 ${4 * particle.glowIntensity}px rgba(147, 197, 253, 0.8))`
                : `blur(${particle.size / 10}px) drop-shadow(0 0 ${10 * particle.glowIntensity}px rgba(147, 197, 253, 0.5))`,
              mixBlendMode: particle.isSparkle ? "screen" : "normal",
            }}
          />
        ))}
        
        {/* Sparkle effects */}
        {sparkles.map((sparkle) => (
          <motion.svg
            key={sparkle.id}
            className="absolute w-8 h-8"
            initial={{
              x: sparkle.x - 16,
              y: sparkle.y - 16,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [1, 1, 0],
              rotate: [0, 180],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6,
              delay: sparkle.delay,
              ease: "easeOut",
            }}
          >
            <path
              d="M16 0 L18 14 L32 16 L18 18 L16 32 L14 18 L0 16 L14 14 Z"
              fill="url(#sparkleGradient)"
              className="drop-shadow-glow"
            />
            <defs>
              <linearGradient id="sparkleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
          </motion.svg>
        ))}
      </AnimatePresence>
      
      <style jsx>{`
        .drop-shadow-glow {
          filter: drop-shadow(0 0 6px rgba(147, 197, 253, 0.9));
        }
      `}</style>
    </div>
  );
}

export default function MouseSmokeEffect() {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 's' && e.ctrlKey) {
        e.preventDefault();
        setIsActive((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isActive) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
      <div className="pointer-events-auto w-full h-full">
        <SmokeEffect />
      </div>
    </div>
  );
}