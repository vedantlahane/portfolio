import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * AuroraBackground renders a set of animated gradient blobs behind the page content.
 * The subtle motion adds depth without distracting from the foreground sections.
 */
const AuroraBackground = () => {
  const baseX = useMotionValue(0.2);
  const baseY = useMotionValue(0.3);

  const springX = useSpring(baseX, { stiffness: 25, damping: 16, mass: 2 });
  const springY = useSpring(baseY, { stiffness: 30, damping: 18, mass: 2 });

  useEffect(() => {
    const interval = setInterval(() => {
      baseX.set(0.15 + Math.random() * 0.15);
      baseY.set(0.2 + Math.random() * 0.2);
    }, 6000);

    return () => clearInterval(interval);
  }, [baseX, baseY]);

  const gradientShiftX = useTransform(springX, (value) => (value - 0.25) * 240);
  const gradientShiftY = useTransform(springY, (value) => (value - 0.25) * 240);

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-200" />

      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-30 mix-blend-soft-light pointer-events-none" style={{
        backgroundImage:
          "url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 200 200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'1.2\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.5\'/%3E%3C/svg%3E')"
      }} />

      {/* Aurora blobs */}
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="absolute rounded-full blur-3xl mix-blend-multiply"
          style={{
            width: index === 0 ? "52vw" : index === 1 ? "46vw" : "42vw",
            height: index === 0 ? "52vw" : index === 1 ? "46vw" : "42vw",
            background:
              index === 0
                ? "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.35), transparent 60%)"
                : index === 1
                ? "radial-gradient(circle at 80% 40%, rgba(56,189,248,0.32), transparent 55%)"
                : "radial-gradient(circle at 50% 80%, rgba(16,185,129,0.28), transparent 55%)",
            top: index === 0 ? "-20%" : index === 1 ? "35%" : "-10%",
            left: index === 0 ? "-10%" : index === 1 ? "30%" : "55%",
            x: gradientShiftX,
            y: gradientShiftY,
          }}
          animate={{
            rotate: index % 2 === 0 ? [0, 20, 0] : [0, -15, 0],
          }}
          transition={{
            duration: 18 + index * 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Soft vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background:
          "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.35), transparent 55%), radial-gradient(circle at 0% 75%, rgba(255,255,255,0.25), transparent 55%), radial-gradient(circle at 100% 75%, rgba(255,255,255,0.2), transparent 55%)"
      }} />
    </div>
  );
};

export default AuroraBackground;
