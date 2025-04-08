import React, { useCallback, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function SmokeEffect({ color = "#ffffff", particlesPerEmit = 2 }) {
  const [particles, setParticles] = useState([]);

  const createParticle = useCallback((x, y, id) => ({
    id,
    x,
    y,
    angle: (Math.random() * Math.PI) / 3 - Math.PI / 6 - Math.PI / 2,
    speed: Math.random() * 1 + 1,
    size: Math.random() * 12 + 8,
    opacity: Math.random() * 0.3 + 0.1,
  }), []);

  const emitParticles = useCallback(
    (x, y) => {
      const newParticles = Array.from({ length: particlesPerEmit }, (_, i) =>
        createParticle(x, y, Date.now() + i)
      );
      setParticles((prev) => [...prev, ...newParticles]);

      setTimeout(() => {
        setParticles((prev) =>
          prev.filter((p) => !newParticles.find((np) => np.id === p.id))
        );
      }, 1000);
    },
    [createParticle, particlesPerEmit]
  );

  // Instead of using onMouseMove on the container, attach a global event listener.
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Log to verify this function is firing.
      console.log("Global mouse move", e.clientX, e.clientY);
      emitParticles(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [emitParticles]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-transparent">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full blur-md"
            initial={{
              x: particle.x,
              y: particle.y,
              scale: 1,
              opacity: particle.opacity,
            }}
            animate={{
              x: particle.x + Math.cos(particle.angle) * 200 * particle.speed,
              y: particle.y + Math.sin(particle.angle) * 200 * particle.speed,
              scale: 2,
              opacity: 0,
            }}
            exit={{ opacity: 0, scale: 3 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: color,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function MouseSmokeEffect() {
  return (
    // By keeping the container at the top layer (z-index 0 or similar) we ensure it captures events,
    // and then you can use CSS in your main app to layer it behind your interactive elements.
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
      {/* The SmokeEffect itself will now respond to global events */}
      <div className="pointer-events-auto w-full h-full">
        <SmokeEffect />
      </div>
      {/* For debugging, you can temporarily show this text */}
      <div className="absolute top-0 left-0 text-white">Smoke Active</div>
    </div>
  );
}
