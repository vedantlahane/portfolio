import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Me2 = () => {
  const [activeSkill, setActiveSkill] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);

  // Technical skills for student portfolio
  const skills = [
    { name: "React Development", level: 85 },
    { name: "JavaScript/TypeScript", level: 90 },
    { name: "UI/UX Design", level: 80 },
    { name: "Problem Solving", level: 95 },
    { name: "Data Structures", level: 88 },
    { name: "Web Development", level: 92 }
  ];

  // Student-appropriate stats
  const experiences = [
    // { label: "Projects Built", value: "15+" },
    // { label: "Technologies", value: "12+" },
    // { label: "GitHub Repos", value: "20+" },
    // { label: "Cups of Coffee", value: "∞" }
  ];

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reduce layers for mobile performance
  const layerCount = isMobile ? 8 : 15;
  const layers = Array.from({ length: layerCount }, (_, i) => ({
    scale: 1 - (i * 0.05),
    rotate: i % 2 === 0 ? i * 3 : -i * 3,
    opacity: 1 - (i * 0.06),
    duration: 25 + (i * 5),
    blur: i * 0.2
  }));

  // Mouse parallax effect (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e) => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      sectionRef.current.style.setProperty('--mouse-x', x);
      sectionRef.current.style.setProperty('--mouse-y', y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  // Cycle through skills
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
      className="bg-black p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 h-full relative overflow-hidden"
      style={{ 
        perspective: isMobile ? '1000px' : '2000px',
        '--mouse-x': 0,
        '--mouse-y': 0,
      }}
    >
      {/* High contrast gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900" />

      {/* Section Label */}
      <motion.div
        className="absolute top-4 sm:top-6 md:top-8 lg:top-12 xl:top-16 left-4 sm:left-6 md:left-8 lg:left-12 xl:left-16 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-xs text-gray-400 font-light tracking-wider">02 &nbsp;&nbsp;ME2</p>
      </motion.div>

      {/* Page indicator */}
      <motion.div
        className="absolute top-4 sm:top-6 md:top-8 lg:top-12 xl:top-16 right-4 sm:right-6 md:right-8 lg:right-12 xl:right-16 text-xs text-gray-400 font-light z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        /02
      </motion.div>

      {/* Main content - Skills Display */}
      <div className="absolute inset-0 flex items-center justify-center z-40 px-4">
        <motion.div
          className="text-center w-full max-w-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          {/* Current Skill Display */}
          <motion.div
            key={activeSkill}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mb-6 md:mb-8"
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-white mb-3 md:mb-4">
              {skills[activeSkill].name}
            </h3>
            <div className="w-32 sm:w-40 md:w-48 h-1 bg-gray-800 mx-auto rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-gray-600 to-white"
                initial={{ width: 0 }}
                animate={{ width: `${skills[activeSkill].level}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Experience Stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-8 md:mt-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-white mb-1">
                  {exp.value}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
                  {exp.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Complex layered animation system - responsive */}
      <div className="absolute inset-0 flex items-center justify-center">
        {layers.map((layer, index) => (
          <motion.div
            key={`layer-${index}`}
            className="absolute inset-0"
            style={{
              transformStyle: 'preserve-3d',
              transform: isMobile ? 'none' : `
                translateX(calc(var(--mouse-x) * ${index * 5}px))
                translateY(calc(var(--mouse-y) * ${index * 5}px))
              `,
              filter: `blur(${isMobile ? layer.blur * 0.5 : layer.blur}px)`,
            }}
            animate={{
              rotateZ: layer.rotate + (isMobile ? 180 : 360),
              scale: [layer.scale, layer.scale * 1.05, layer.scale],
            }}
            transition={{
              rotateZ: {
                duration: layer.duration * (isMobile ? 2 : 1),
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.3
              }
            }}
          >
            {/* High contrast grid pattern */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,${layer.opacity * 0.15}) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,${layer.opacity * 0.15}) 1px, transparent 1px)
                `,
                backgroundSize: isMobile ? '30px 30px' : `${40 + index * 2}px ${40 + index * 2}px`,
                opacity: layer.opacity,
              }}
            />

            {/* Geometric frame */}
            {(!isMobile || index < 5) && (
              <motion.div
                className="absolute inset-0 border border-white"
                style={{
                  margin: `${index * 5}%`,
                  opacity: layer.opacity * 0.3,
                  borderWidth: index < 3 ? '2px' : '1px',
                }}
                animate={{
                  rotateX: [0, 45, 0, -45, 0],
                  rotateY: [0, -45, 0, 45, 0],
                }}
                transition={{
                  duration: 20 + index * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.2
                }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Corridor effect - reduced for mobile */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
          {[...Array(isMobile ? 8 : 15)].map((_, i) => (
            <motion.div
              key={`tunnel-${i}`}
              className="absolute inset-0 border border-white"
              style={{
                transform: `translateZ(${i * -100}px) scale(${1 - i * 0.06})`,
                opacity: 0.8 - i * 0.05,
                borderWidth: i < 3 ? '2px' : '1px',
              }}
              animate={{
                rotateZ: i % 2 === 0 ? 360 : -360,
              }}
              transition={{
                duration: (40 + i * 3) * (isMobile ? 2 : 1),
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating shapes - fewer on mobile */}
      <div className="absolute inset-0">
        {[...Array(isMobile ? 4 : 8)].map((_, i) => (
          <motion.div
            key={`shape-${i}`}
            className="absolute"
            style={{
              left: `${10 + i * 10}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          >
            <div className={`
              w-6 h-6 md:w-8 md:h-8 border-2 border-white/40
              ${i % 3 === 0 ? 'rounded-full' : i % 3 === 1 ? 'rounded-none' : 'rounded-lg rotate-45'}
            `} />
          </motion.div>
        ))}
      </div>

      {/* Particles - reduced on mobile */}
      {[...Array(isMobile ? 10 : 20)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 md:w-2 md:h-2 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

            {/* Center focus element */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40"
          animate={{
            rotate: -360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: {
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            },
            scale: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/60 to-gray-400/40 rounded-full blur-xl md:blur-2xl"
            animate={{
              scale: [1, 2, 1],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="absolute inset-0 border-2 border-white/50 rounded-full" />
          <div className="absolute inset-4 border border-white/30 rounded-full" />
          <div className="absolute inset-8 border border-white/20 rounded-full" />
        </motion.div>
      </div>

      {/* Rotating rings - responsive */}
      {!isMobile && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[
            { size: '100%', duration: 60, direction: 1, opacity: 0.2 },
            { size: '90%', duration: 55, direction: -1, opacity: 0.25 },
            { size: '80%', duration: 50, direction: 1, opacity: 0.3 },
            { size: '70%', duration: 45, direction: -1, opacity: 0.35 },
            { size: '60%', duration: 40, direction: 1, opacity: 0.4 },
            { size: '50%', duration: 35, direction: -1, opacity: 0.45 },
            { size: '40%', duration: 30, direction: 1, opacity: 0.5 },
          ].map((ring, index) => (
            <motion.div
              key={`ring-${index}`}
              className="absolute rounded-full hidden md:block"
              style={{
                width: ring.size,
                height: ring.size,
                border: `${index < 3 ? 2 : 1}px solid rgba(255, 255, 255, ${ring.opacity})`,
                borderStyle: index % 2 === 0 ? 'solid' : 'dashed',
              }}
              animate={{
                rotate: ring.direction * 360,
                scale: [1, 1.02, 1],
              }}
              transition={{
                rotate: {
                  duration: ring.duration,
                  repeat: Infinity,
                  ease: "linear"
                },
                scale: {
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.4
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Skill progress indicators */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 lg:left-12 xl:left-16 z-50">
        <div className="flex gap-1 md:gap-2">
          {skills.map((_, index) => (
            <motion.div
              key={index}
              className={`h-3 md:h-4 rounded-full transition-all duration-300 ${
                index === activeSkill 
                  ? 'bg-white w-6 md:w-8' 
                  : 'bg-white/30 w-1'
              }`}
              animate={{
                opacity: index === activeSkill ? 1 : 0.3,
              }}
            />
          ))}
        </div>
      </div>

      {/* Learning status - student appropriate */}
      <motion.div
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 lg:right-12 xl:right-16 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        whileHover={{ opacity: 1 }}
      >
        <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <motion.div 
              className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
            Learning
          </span>
          <span className="text-gray-600">•</span>
          <span className="flex items-center gap-1">
            <motion.div 
              className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            Building
          </span>
          <span className="text-gray-600">•</span>
          <span className="flex items-center gap-1">
            <motion.div 
              className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
            Growing
          </span>
        </div>
      </motion.div>

      {/* Enhanced gradient overlays for depth and contrast */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/50 opacity-40" />
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 30% 40%, transparent 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%),
              radial-gradient(circle at 70% 60%, transparent 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)
            `
          }}
        />
      </div>

      {/* Vignette effect for better focus */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.7) 100%)'
        }}
      />
    </motion.section>
  );
};

export default Me2;