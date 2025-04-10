import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function getRandomBlueClass() {
  const blues = ["bg-blue-200", "bg-blue-300", "bg-blue-100"];
  return blues[Math.floor(Math.random() * blues.length)];
}

function SmokeEffect({ particlesPerEmit = 2 }) {
  const [particles, setParticles] = useState([]);
  const [lastMouse, setLastMouse] = useState({
    x: 0,
    y: 0,
    time: performance.now(),
  });

  const createParticle = useCallback(
    (x, y, id, baseAngle = -Math.PI / 2, velocity = 0.2) => {
      const clampedVelocity = Math.min(velocity, 1); // Limit the effect of crazy fast moves
      return {
        id,
        x,
        y,
        angle: baseAngle + (Math.random() - 0.5) * (Math.PI / 6),
        speed: Math.random() * 1 + 1,
        size: clampedVelocity * 20 + 8, // Bigger particles on faster movement
        opacity: clampedVelocity * 0.4 + 0.1,
        fadeSpeed: Math.random() * 0.5 + 1.5, // Fade time: 1.5s to 5s
        colorClass: getRandomBlueClass(),
      };
    },
    []
  );

  const emitParticles = useCallback(
    (x, y, baseAngle, velocity) => {
      const newParticles = Array.from({ length: particlesPerEmit }, (_, i) =>
        createParticle(x, y, Date.now() + i, baseAngle, velocity)
      );
      setParticles((prev) => [...prev, ...newParticles]);

      setTimeout(() => {
        setParticles((prev) =>
          prev.filter((p) => !newParticles.find((np) => np.id === p.id))
        );
      }, 2000); // Cleanup after longest fade
    },
    [createParticle, particlesPerEmit]
  );

  useEffect(() => {
    const handleMouseMove = (e) => {
      const now = performance.now();
      const dx = e.clientX - lastMouse.x;
      const dy = e.clientY - lastMouse.y;
      const dt = now - lastMouse.time || 16;

      const distance = Math.sqrt(dx * dx + dy * dy);
      const velocity = distance / dt;

      const angle = Math.atan2(dy, dx);
      emitParticles(e.clientX, e.clientY, angle, velocity);

      setLastMouse({ x: e.clientX, y: e.clientY, time: now });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [emitParticles, lastMouse]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-transparent">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute rounded-full blur-md ${particle.colorClass}`}
            initial={{
              x: particle.x,
              y: particle.y,
              scale: 1,
              opacity: particle.opacity,
            }}
            animate={{
              x:
                particle.x +
                Math.cos(particle.angle) * 200 * particle.speed,
              y:
                particle.y +
                Math.sin(particle.angle) * 200 * particle.speed,
              scale: 2,
              opacity: 0,
            }}
            exit={{ opacity: 0, scale: 3 }}
            transition={{
              duration: particle.fadeSpeed,
              ease: "easeOut",
            }}
            style={{
              width: particle.size,
              height: particle.size,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function MouseSmokeEffect() {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
      <div className="pointer-events-auto w-full h-full">
        <SmokeEffect />
      </div>
    </div>
  );
}
