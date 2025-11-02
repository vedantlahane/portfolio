import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Skills = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleSkillIndex, setVisibleSkillIndex] = useState(0);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Categorized skills for mobile accordion
  const skillCategories = {
    languages: {
      title: 'Languages',
      skills: ['Java', 'JavaScript', 'TypeScript', 'C++', 'C', 'PHP', 'SQL', 'HTML', 'CSS']
    },
    frameworks: {
      title: 'Frameworks & Libraries',
      skills: ['React.js', 'Node.js', 'Express.js', 'Angular', 'Redux', 'Laravel', 'Shadcn', 'Tailwind CSS']
    },
    tools: {
      title: 'Development Tools',
      skills: ['Vite', 'Git', 'GitHub', 'Postman', 'Docker', 'Docker Compose', 'Jenkins']
    },
    cloud: {
      title: 'AI & Cloud Services',
      skills: ['OpenAI API', 'Gemini API', 'v0.dev', 'Vercel', 'AWS', 'Render', 'Lighthouse']
    },
    databases: {
      title: 'Databases & Systems',
      skills: ['MongoDB', 'MySQL', 'Linux']
    },
    soft: {
      title: 'Soft Skills',
      skills: ['Problem-solving', 'Teamwork', 'Adaptability', 'Creativity']
    }
  };

  // All skills flattened for desktop
  const allSkills = Object.values(skillCategories).flatMap(category => category.skills);

  // Handle section toggle for mobile
  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  useEffect(() => {
    if (isMobile || isPaused) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setVisibleSkillIndex((prev) => (prev + 1) % allSkills.length);
    }, 2000);

    return () => window.clearInterval(intervalId);
  }, [isMobile, isPaused, allSkills.length]);

  useEffect(() => {
    if (isMobile) {
      setVisibleSkillIndex(0);
    }
  }, [isMobile]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Enhanced Mobile View with multi-column layout
  const MobileView = () => (
    <div className="space-y-0">
      {Object.entries(skillCategories).map(([key, category], index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
        >
          {/* Section Header */}
          <motion.button
            onClick={() => toggleSection(key)}
            className="w-full px-0 py-6 flex items-center justify-between text-left 
                     hover:bg-gray-50 transition-colors focus:outline-none 
                     focus:ring-2 focus:ring-gray-900 focus:ring-offset-1 rounded"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-gray-400">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="text-base font-sans font-medium text-gray-900">
                {category.title}
              </h3>
              <span className="text-xs text-gray-500">
                ({category.skills.length})
              </span>
            </div>
            
            <motion.div
              animate={{ rotate: activeSection === key ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-gray-400"
            >
              →
            </motion.div>
          </motion.button>

          {/* Expandable Content with Multi-Column */}
          <AnimatePresence>
            {activeSection === key && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="pl-8 pb-6">
                  {/* Multi-column grid based on screen size */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.03 * skillIndex }}
                        className="flex items-center gap-3 py-2"
                      >
                        <div className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
                        <span className="text-sm text-gray-700">{skill}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Line separator (except for last item) */}
          {index < Object.entries(skillCategories).length - 1 && (
            <div className="w-full h-px bg-gray-200" />
          )}
        </motion.div>
      ))}

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="pt-8 text-center"
      >
        <div className="flex items-center justify-center gap-4">
          <div className="w-12 h-px bg-gray-300" />
          <span className="text-xs font-mono text-gray-400">
            {allSkills.length} TOTAL SKILLS
          </span>
          <div className="w-12 h-px bg-gray-300" />
        </div>
      </motion.div>
    </div>
  );

  // Enhanced Desktop View with minimalistic improvements
  const DesktopView = () => {
    const progress = ((visibleSkillIndex + 1) / allSkills.length) * 100;

    return (
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gray-100 z-10">
          <motion.div
            className="h-full bg-gray-300"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div
          className="relative overflow-hidden py-12"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className={`skills-marquee ${isPaused ? 'skills-marquee--paused' : ''}`}>
            {[0, 1].map((iteration) => (
              <div
                key={iteration}
                className="skills-marquee__track"
                aria-hidden={iteration === 1}
              >
                {allSkills.map((skill, index) => {
                  const isActive = index === visibleSkillIndex;
                  return (
                    <React.Fragment key={`${iteration}-${skill}`}>
                      <motion.span
                        className={`text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-display font-light mx-8 md:mx-10 lg:mx-12 xl:mx-16 2xl:mx-20 select-none transition-colors duration-300 ${isActive ? 'text-gray-900' : 'text-gray-500'}`}
                        whileHover={{ color: '#6b7280', scale: 1.05, y: -2 }}
                      >
                        {skill}
                      </motion.span>
                      {index < allSkills.length - 1 && (
                        <span className="mx-4 text-xl text-gray-300 select-none">•</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/90 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white via-white/90 to-transparent z-10" />
        </div>

        <div className="absolute top-6 left-6 z-20 text-xs font-mono text-gray-400">
          <motion.span
            key={visibleSkillIndex}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block"
          >
            {String(visibleSkillIndex + 1).padStart(2, '0')} / {String(allSkills.length).padStart(2, '0')}
          </motion.span>
        </div>

        <AnimatePresence>
          {isPaused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute top-6 right-6 z-20"
            >
              <div className="flex items-center gap-2 rounded-full bg-gray-900 px-3 py-1.5 text-xs font-mono text-white">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="h-1.5 w-1.5 rounded-full bg-white"
                />
                PAUSED
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 2 }}
        >
          <div className="mb-1 text-xs font-mono text-gray-400">hover to pause</div>
          <AnimatePresence mode="wait">
            {isPaused && (
              <motion.div
                key={visibleSkillIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-sm font-sans text-gray-600"
              >
                {allSkills[visibleSkillIndex]}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full bg-gray-300"
              style={{ top: `${20 + i * 30}%`, left: `${10 + i * 40}%` }}
              animate={{
                opacity: isPaused ? [0.2, 0.5, 0.2] : 0.2,
                scale: isPaused ? [1, 1.5, 1] : 1,
                y: isPaused ? [0, -10, 0] : 0,
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="relative overflow-hidden py-8 sm:py-10 md:py-12 lg:py-16 w-full bg-white/85 backdrop-blur-xl border border-white/70 rounded-3xl shadow-xl shadow-gray-200/40"
      id="skills"
    >
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -inset-24 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.08),_transparent_60%)]" />
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-emerald-100/30 via-transparent to-transparent" />
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-sky-100/30 via-transparent to-transparent" />
      </div>
      {/* Header */}
  <div className="relative z-10 flex justify-between items-start mb-8 sm:mb-12 lg:mb-16 
        px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-xs sm:text-sm text-gray-500 font-mono uppercase tracking-wider"
        >
          05 &nbsp;&nbsp;SKILLS
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-xs sm:text-sm text-gray-500 font-mono flex items-center gap-2"
        >
          {isMobile && activeSection && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-400 capitalize"
            >
              {skillCategories[activeSection]?.title}
            </motion.span>
          )}
          <span>/05</span>
        </motion.div>
      </div>

      {/* Skills Display */}
  <div className={`${isMobile ? "px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-20" : ""} relative z-10`}>
        {isMobile ? <MobileView /> : <DesktopView />}
      </div>

      {/* Enhanced background decoration - desktop only */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-80">
          <motion.div
            className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2"
            animate={{ 
              rotate: isPaused ? [null, 15] : [0, 360],
              scale: isPaused ? [1, 1.02, 1] : 1
            }}
            transition={{ 
              duration: isPaused ? 3 : 120, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            <div className="w-full h-full border border-gray-200 rounded-full" />
          </motion.div>
          
          <motion.div
            className="absolute top-1/3 right-1/3 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2"
            animate={{ 
              rotate: isPaused ? [null, -10] : [360, 0],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ 
              duration: isPaused ? 2 : 80, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            <div className="w-full h-full border border-gray-200 rounded-full" />
          </motion.div>
        </div>
      )}
    </motion.section>
  );
};

export default Skills;
