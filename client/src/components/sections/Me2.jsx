import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAdmin } from '../../context/AdminContext';
import EditableText from '../UI/EditableText';

const Me2 = ({ profile, updateProfile }) => {
  const { isAdmin } = useAdmin();
  const [activeSkill, setActiveSkill] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);

  // Dynamic values with static fallbacks
  const skills = profile?.featuredSkills || [
    { name: "Core Skill", level: 80 }
  ];

  const experiences = profile?.experiences || [
    { label: "Projects", value: "0" }
  ];

  const bottomLabels = profile?.me2StatusLabels || [
    'Building'
  ];

  // Handlers for Admin Mode
  const updateExp = (index, field, newVal) => {
    const nextExps = [...experiences];
    nextExps[index] = { ...nextExps[index], [field]: newVal };
    updateProfile({ experiences: nextExps });
  };

  const updateSkill = (index, field, newVal) => {
    const nextSkills = [...skills];
    if (field === 'level') {
      nextSkills[index] = { ...nextSkills[index], [field]: Math.min(100, Math.max(0, parseInt(newVal, 10) || 0)) };
    } else {
      nextSkills[index] = { ...nextSkills[index], [field]: newVal };
    }
    updateProfile({ featuredSkills: nextSkills });
  };

  const handleUpdateBottomLabels = (val) => {
    const labels = val.split(',').map(s => s.trim()).filter(Boolean);
    updateProfile({ me2StatusLabels: labels });
  };

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
  const layerCount = isMobile ? 5 : 10;
  const layers = Array.from({ length: layerCount }, (_, i) => ({
    scale: 1 - (i * 0.05),
    rotate: i % 2 === 0 ? i * 3 : -i * 3,
    opacity: 1 - (i * 0.08),
    duration: 25 + (i * 5),
    blur: i * 0.15
  }));

  // Mouse parallax effect (desktop only)
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

  // Cycle through skills
  useEffect(() => {
    if (skills.length === 0 || isAdmin) return;
    const interval = setInterval(() => {
      setActiveSkill((prev) => (prev + 1) % skills.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [skills.length, isAdmin]);

  const activeSkillIndex = skills.length > 0 ? activeSkill % skills.length : 0;

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-black p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 h-full relative overflow-hidden"
      style={{
        perspective: isMobile ? '800px' : '1500px',
        '--mouse-x': 0,
        '--mouse-y': 0,
        '--accent-rgb': '95 143 136',
      }}
    >
      {/* High contrast gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-900" />
      <div className="absolute inset-0 opacity-30 accent-grid" />
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(circle at 22% 22%, rgba(95, 143, 136, 0.24) 0%, transparent 28%), radial-gradient(circle at 78% 76%, rgba(95, 143, 136, 0.18) 0%, transparent 24%)",
        }}
      />

      {/* Section Label */}
      <motion.div
        className="absolute top-6 sm:top-8 md:top-10 lg:top-12 xl:top-16 left-6 sm:left-8 md:left-10 lg:left-12 xl:left-16 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-xs sm:text-sm text-gray-400 font-mono font-light tracking-wider">02 &nbsp;&nbsp;ME2</p>
      </motion.div>

      {/* Page indicator */}
      <motion.div
        className="absolute top-6 sm:top-8 md:top-10 lg:top-12 xl:top-16 right-6 sm:right-8 md:right-10 lg:right-12 xl:right-16 text-xs sm:text-sm text-gray-400 font-mono font-light z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        /02
      </motion.div>

      {/* Main content - Skills Display */}
      <div className="absolute inset-0 flex items-center justify-center z-40 px-6 sm:px-8">
        <motion.div
          className="text-center w-full max-w-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          {/* Current Skill Display or Skill Editor */}
          {isAdmin ? (
            <div className="mb-6 sm:mb-8 space-y-4 max-h-[40vh] overflow-y-auto bg-black/60 p-4 border border-gray-800">
              <span className="text-[10px] text-gray-500 font-mono block uppercase tracking-wider mb-2">Featured Skills Editor</span>
              {skills.map((skill, index) => (
                <div key={index} className="flex gap-2 items-center justify-between text-left border-b border-gray-900 pb-2">
                  <EditableText
                    value={skill.name}
                    onSave={(val) => updateSkill(index, 'name', val)}
                    isAdmin={true}
                    textClassName="text-sm text-white font-medium"
                    placeholder="Skill Name..."
                  />
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-500 font-mono">Level (0-100):</span>
                    <EditableText
                      value={String(skill.level)}
                      onSave={(val) => updateSkill(index, 'level', val)}
                      isAdmin={true}
                      textClassName="text-sm font-mono text-white"
                      placeholder="80"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            skills.length > 0 && (
              <motion.div
                key={activeSkillIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mb-6 sm:mb-8"
              >
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-light text-white mb-4">
                  {skills[activeSkillIndex]?.name}
                </h3>
                <div className="w-40 sm:w-48 md:w-56 h-1.5 bg-gray-800 mx-auto rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(95, 143, 136, 0.55) 0%, rgba(191, 220, 215, 0.96) 55%, rgba(255,255,255,1) 100%)",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${skills[activeSkillIndex]?.level}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            )
          )}

          {/* Experience Stats */}
          <div className="mx-8 grid grid-cols-2 gap-4 sm:gap-6 mt-10 sm:mt-10 md:mt-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-xl sm:text-2xl md:text-3xl font-display font-light text-white mb-1">
                  <EditableText
                    value={exp.value}
                    onSave={(val) => updateExp(index, 'value', val)}
                    isAdmin={isAdmin}
                    textClassName="text-white"
                  />
                </div>
                <div className="text-[10px] sm:text-xs text-gray-500 font-sans uppercase tracking-wider">
                  <EditableText
                    value={exp.label}
                    onSave={(val) => updateExp(index, 'label', val)}
                    isAdmin={isAdmin}
                    textClassName="text-gray-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Complex layered animation system - optimized for mobile */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 sm:opacity-40">
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
              filter: isMobile ? 'none' : `blur(${layer.blur}px)`,
            }}
            animate={{
              rotateZ: layer.rotate + 360,
              scale: [layer.scale, layer.scale * 1.05, layer.scale],
            }}
            transition={{
              rotateZ: {
                duration: layer.duration * (isMobile ? 1.5 : 1),
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
                  linear-gradient(rgba(191,220,215,${layer.opacity * 0.16}) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(191,220,215,${layer.opacity * 0.16}) 1px, transparent 1px)
                `,
                backgroundSize: isMobile ? '40px 40px' : `${60 + index * 3}px ${80 + index * 3}px`,
                opacity: layer.opacity * 0.8,
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Corridor effect - simplified for mobile */}
      {!isMobile && (
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`tunnel-${i}`}
                className="absolute inset-0 border border-white/60"
                style={{
                  transform: `translateZ(${i * -100}px) scale(${1 - i * 0.06})`,
                  opacity: 0.6 - i * 0.05,
                }}
                animate={{
                  rotateZ: i % 2 === 0 ? 360 : -360,
                }}
                transition={{
                  duration: 40 + i * 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Floating shapes - fewer and larger on mobile */}
      <div className="absolute inset-0 opacity-40">
        {[...Array(isMobile ? 3 : 6)].map((_, i) => (
          <motion.div
            key={`shape-${i}`}
            className="absolute"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          >
            <div className={`
              w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-2 border-white/30
              ${i % 3 === 0 ? 'rounded-full' : i % 3 === 1 ? 'rounded-none' : 'rounded-lg rotate-45'}
            `} />
          </motion.div>
        ))}
      </div>

      {/* Particles - much fewer on mobile */}
      {[...Array(isMobile ? 6 : 15)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1.5 h-1.5 md:w-2 md:h-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            backgroundColor: i % 4 === 0 ? "rgba(191, 220, 215, 0.9)" : "rgba(255,255,255,0.92)",
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Center focus element - simplified for mobile */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56"
          animate={{
            rotate: -360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: {
              duration: isMobile ? 30 : 20,
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
            className="absolute inset-0 rounded-full blur-2xl md:blur-3xl"
            style={{
              background:
                "linear-gradient(90deg, rgba(191, 220, 215, 0.78) 0%, rgba(95, 143, 136, 0.45) 40%, rgba(255,255,255,0.2) 100%)",
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.4, 0.2, 0.4],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="absolute inset-0 border border-white/30 rounded-full" />
          <div className="absolute inset-4 border border-white/20 rounded-full" />
          <div className="absolute inset-8 border border-white/10 rounded-full" />
        </motion.div>
      </div>

      {/* Rotating rings - desktop only for performance */}
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
              animate={{
                rotate: ring.direction * 360,
              }}
              transition={{
                rotate: {
                  duration: ring.duration,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Skill progress indicators */}
      <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 lg:left-12 xl:left-16 z-50">
        <div className="flex gap-1.5 sm:gap-2">
          {skills.map((_, index) => (
            <motion.div
              key={index}
              className={`h-3 sm:h-4 rounded-full transition-all duration-300 ${index === activeSkillIndex
                  ? 'w-8 sm:w-10'
                  : 'bg-white/30 w-1.5'
                }`}
              style={index === activeSkillIndex ? { backgroundColor: "rgb(95, 143, 136)" } : undefined}
              animate={{
                opacity: index === activeSkillIndex ? 1 : 0.3,
              }}
            />
          ))}
        </div>
      </div>

      {/* Learning status - industry aligned wording */}
      <motion.div
        className="absolute bottom-6 sm:bottom-8 right-6 sm:right-8 lg:right-12 xl:right-16 z-50 flex flex-col items-end gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        whileHover={{ opacity: 1 }}
      >
        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-400 font-sans">
          {bottomLabels.map((label, idx) => (
            <React.Fragment key={idx}>
              <span className="flex items-center gap-1">
                <motion.div
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                  style={{ backgroundColor: "rgb(95, 143, 136)" }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: idx * 0.5
                  }}
                />
                <span>{label}</span>
              </span>
              {idx < bottomLabels.length - 1 && <span className="text-gray-600">•</span>}
            </React.Fragment>
          ))}
        </div>

        {isAdmin && (
          <div className="bg-black/85 p-2 border border-gray-800 text-[10px] text-gray-400 font-mono mt-1 z-[99]">
            Edit labels (comma separated):{' '}
            <EditableText
              value={bottomLabels.join(', ')}
              onSave={handleUpdateBottomLabels}
              isAdmin={true}
              textClassName="text-white"
            />
          </div>
        )}
      </motion.div>

      {/* Enhanced gradient overlays for depth and contrast */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 opacity-50 sm:opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/50 opacity-30 sm:opacity-40" />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 30% 40%, transparent 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.6) 100%),
              radial-gradient(circle at 70% 60%, transparent 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.6) 100%)
            `
          }}
        />
      </div>

      {/* Vignette effect for better focus */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.7) 100%)'
        }}
      />
    </motion.section>
  );
};

export default Me2;
