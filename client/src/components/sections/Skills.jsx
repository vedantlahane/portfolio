import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Skills = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Categorized skills for better organization
  const skillCategories = {
    languages: ['Java', 'JavaScript', 'TypeScript', 'C++', 'C', 'PHP', 'SQL', 'HTML', 'CSS'],
    frameworks: ['React.js', 'Node.js', 'Express.js', 'Angular', 'Redux', 'Laravel', 'Shadcn', 'Tailwind CSS'],
    tools: ['Vite', 'Git', 'GitHub', 'Postman', 'Docker', 'Docker Compose', 'Jenkins'],
    ai_cloud: ['OpenAI API', 'Gemini API', 'v0.dev', 'Vercel', 'AWS', 'Render', 'Lighthouse'],
    databases: ['MongoDB', 'MySQL', 'Linux'],
    soft: ['Problem-solving', 'Teamwork', 'Adaptability', 'Creativity']
  };

  // Flatten skills for scrolling animation
  const allSkills = Object.values(skillCategories).flat();

  // Mobile grid view
  const MobileView = () => (
    <div className="space-y-6">
      {Object.entries(skillCategories).map(([category, skills]) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * Object.keys(skillCategories).indexOf(category) }}
          className="space-y-3"
        >
          <h3 className="text-xs font-mono text-gray-500 uppercase tracking-wider">
            {category.replace('_', ' & ')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.02 * index }}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-sans"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Desktop scrolling view
  const DesktopView = () => (
    <div 
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main scrolling container */}
      <motion.div
        className="flex items-center whitespace-nowrap"
        animate={{
          x: isPaused ? 0 : [0, '-390%']
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 60,
            ease: "linear",
          },
        }}
      >
        {/* First set of skills */}
        <div className="flex items-center">
          {allSkills.map((skill, index) => (
            <React.Fragment key={`first-${index}`}>
              <span className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-display font-light text-gray-900 mx-6 md:mx-8 lg:mx-10 xl:mx-12 hover:text-gray-600 transition-colors duration-300">
                {skill}
              </span>
              {index < allSkills.length - 1 && (
                <span className="text-gray-300 mx-2">•</span>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Duplicate for seamless loop */}
        <div className="flex items-center">
          {allSkills.map((skill, index) => (
            <React.Fragment key={`second-${index}`}>
              <span className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-display font-light text-gray-900 mx-6 md:mx-8 lg:mx-10 xl:mx-12 hover:text-gray-600 transition-colors duration-300">
                {skill}
              </span>
              {index < allSkills.length - 1 && (
                <span className="text-gray-300 mx-2">•</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      {/* Gradient overlays for fade effect */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
    </div>
  );

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="py-8 sm:py-10 md:py-12 lg:py-16 w-full relative overflow-hidden"
      role="region"
      aria-label="Technical skills"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8 sm:mb-12 lg:mb-16 px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
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
          className="text-xs sm:text-sm text-gray-500 font-mono"
        >
          /05
        </motion.div>
      </div>

      {/* Skills Display */}
      {isMobile ? (
        <div className="px-6">
          <MobileView />
        </div>
      ) : (
        <DesktopView />
      )}

      {/* Skill count indicator */}
      {/* <motion.div
        className="mt-8 sm:mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <p className="text-xs sm:text-sm text-gray-400 font-sans">
          {allSkills.length}+ technologies and growing
        </p>
      </motion.div> */}

      {/* Background decoration - desktop only */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
          <motion.div
            className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 100,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-full h-full border-2 border-gray-300 rounded-full" />
          </motion.div>
        </div>
      )}

      {/* Hover hint - desktop only */}
      {!isMobile && (
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-400 font-sans"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1.5 }}
        >
          Hover to pause
        </motion.div>
      )}
    </motion.section>
  );
};

export default Skills;