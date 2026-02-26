import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const HeroHighlights = () => {
  const [activeSkill, setActiveSkill] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);

  const skills = [
    { name: 'React & Next.js', level: 88 },
    { name: 'Node.js & Express', level: 85 },
    { name: 'TypeScript', level: 86 },
    { name: 'Java (DSA & Algo)', level: 90 },
    { name: 'Docker & CI/CD', level: 76 },
    { name: 'System Design (basics)', level: 72 }
  ];

  const experiences = [
    { label: 'Projects Built', value: '12+' },
    { label: 'GitHub Repos', value: '25+' },
    { label: 'DSA Problems', value: '400+' },
    { label: 'Open-source PRs', value: '5+' }
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const layerCount = isMobile ? 5 : 10;
  const layers = Array.from({ length: layerCount }, (_, i) => ({
    scale: 1 - i * 0.05,
    rotate: i % 2 === 0 ? i * 3 : -i * 3,
    opacity: 1 - i * 0.08,
    duration: 25 + i * 5,
    blur: i * 0.15
  }));

  useEffect(() => {
    if (isMobile) return;

    let ticking = false;
    let rect = null;

    const updateRect = () => {
      if (sectionRef.current) {
        rect = sectionRef.current.getBoundingClientRect();
      }
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, { passive: true });

    const handleMouseMove = (e) => {
      if (!ticking && rect && sectionRef.current) {
        window.requestAnimationFrame(() => {
          if (!sectionRef.current) return;
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          sectionRef.current.style.setProperty('--mouse-x', x);
          sectionRef.current.style.setProperty('--mouse-y', y);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSkill((prev) => (prev + 1) % skills.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [skills.length]);

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-black p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 h-full relative overflow-hidden"
      style={{ perspective: isMobile ? '800px' : '1500px', '--mouse-x': 0, '--mouse-y': 0 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900" />

      <motion.div
        className="absolute top-6 sm:top-8 md:top-10 lg:top-12 xl:top-16 left-6 sm:left-8 md:left-10 lg:left-12 xl:left-16 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-xs sm:text-sm text-gray-400 font-mono font-light tracking-wider">02 &nbsp;&nbsp;HIGHLIGHTS</p>
      </motion.div>

      <motion.div
        className="absolute top-6 sm:top-8 md:top-10 lg:top-12 xl:top-16 right-6 sm:right-8 md:right-10 lg:right-12 xl:right-16 text-xs sm:text-sm text-gray-400 font-mono font-light z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        /02
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center z-40 px-6 sm:px-8">
        <motion.div
          className="text-center w-full max-w-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <motion.div
            key={activeSkill}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-light text-white mb-4">
              {skills[activeSkill].name}
            </h3>
            <div className="w-40 sm:w-48 md:w-56 h-1.5 bg-gray-800 mx-auto rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-gray-600 to-white"
                initial={{ width: 0 }}
                animate={{ width: `${skills[activeSkill].level}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-10 md:mt-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-xl sm:text-2xl md:text-3xl font-display font-light text-white mb-1">
                  {exp.value}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500 font-sans uppercase tracking-wider">
                  {exp.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center opacity-30 sm:opacity-40">
        {layers.map((layer, index) => (
          <motion.div
            key={`layer-${index}`}
            className="absolute inset-0"
            style={{
              transformStyle: 'preserve-3d',
              transform: isMobile
                ? 'none'
                : `translateX(calc(var(--mouse-x) * ${index * 5}px)) translateY(calc(var(--mouse-y) * ${index * 5}px))`,
              filter: isMobile ? 'none' : `blur(${layer.blur}px)`
            }}
            animate={{
              rotateZ: layer.rotate + 360,
              scale: [layer.scale, layer.scale * 1.05, layer.scale]
            }}
            transition={{
              rotateZ: {
                duration: layer.duration * (isMobile ? 1.5 : 1),
                repeat: Infinity,
                ease: 'linear'
              },
              scale: {
                duration: 10,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.3
              }
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,${layer.opacity * 0.2}) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,${layer.opacity * 0.2}) 1px, transparent 1px)
                `,
                backgroundSize: isMobile ? '40px 40px' : `${60 + index * 3}px ${80 + index * 3}px`,
                opacity: layer.opacity * 0.8,
              }}
            />
          </motion.div>
        ))}
      </div>

      {!isMobile && (
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`tunnel-${i}`}
                className="absolute inset-0 border border-white/30"
                style={{
                  transform: `translateZ(${i * -100}px) scale(${1 - i * 0.06})`,
                  opacity: 0.6 - i * 0.05,
                }}
                animate={{ rotateZ: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 40 + i * 3, repeat: Infinity, ease: 'linear' }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="absolute inset-0 opacity-40">
        {[...Array(isMobile ? 3 : 6)].map((_, i) => (
          <motion.div
            key={`shape-${i}`}
            className="absolute"
            style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [-20, 20, -20], x: [-10, 10, -10], rotate: [0, 180, 360] }}
            transition={{ duration: 20 + i * 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
          >
            <div
              className={`
                w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-2 border-white/40
                ${i % 3 === 0 ? 'rounded-full' : i % 3 === 1 ? 'rounded-none' : 'rounded-lg rotate-45'}
              `}
            />
          </motion.div>
        ))}
      </div>

      {[...Array(isMobile ? 6 : 15)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2], scale: [0.5, 1.5, 0.5] }}
          transition={{ duration: 5 + Math.random() * 3, delay: Math.random() * 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56"
          animate={{ rotate: -360, scale: [1, 1.1, 1] }}
          transition={{
            rotate: { duration: isMobile ? 30 : 20, repeat: Infinity, ease: 'linear' },
            scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' }
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/40 to-gray-400/20 rounded-full blur-2xl md:blur-3xl"
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.2, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 border border-white/30 rounded-full" />
          <div className="absolute inset-4 border border-white/20 rounded-full" />
          <div className="absolute inset-8 border border-white/10 rounded-full" />
        </motion.div>
      </div>

      {!isMobile && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[
            { size: '90%', duration: 60, direction: 1, opacity: 0.15 },
            { size: '75%', duration: 50, direction: -1, opacity: 0.2 },
            { size: '60%', duration: 40, direction: 1, opacity: 0.25 },
            { size: '45%', duration: 30, direction: -1, opacity: 0.3 },
          ].map((ring, index) => (
            <motion.div
              key={`ring-${index}`}
              className="absolute rounded-full"
              style={{
                width: ring.size,
                height: ring.size,
                border: `1px solid rgba(255, 255, 255, ${ring.opacity})`,
                borderStyle: index % 2 === 0 ? 'solid' : 'dashed',
              }}
              animate={{ rotate: ring.direction * 360 }}
              transition={{ rotate: { duration: ring.duration, repeat: Infinity, ease: 'linear' } }}
            />
          ))}
        </div>
      )}

      <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 lg:left-12 xl:left-16 z-50">
        <div className="flex gap-1.5 sm:gap-2">
          {skills.map((_, index) => (
            <motion.div
              key={index}
              className={`h-3 sm:h-4 rounded-full transition-all duration-300 ${index === activeSkill ? 'bg-white w-8 sm:w-10' : 'bg-white/30 w-1.5'
                }`}
              animate={{ opacity: index === activeSkill ? 1 : 0.3 }}
            />
          ))}
        </div>
      </div>

      <motion.div
        className="absolute bottom-6 sm:bottom-8 right-6 sm:right-8 lg:right-12 xl:right-16 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        whileHover={{ opacity: 1 }}
      >
        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-400 font-sans">
          <span className="flex items-center gap-1">
            <motion.div
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            currently leveling up
          </span>
          <span>•</span>
          <span>building better daily</span>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default HeroHighlights;
