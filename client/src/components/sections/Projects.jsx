import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Projects = () => {
  const [showAll, setShowAll] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 'fundforge',
      title: 'Fund Forge',
      year: '2025',
      description: 'Web3 crowdfunding platform with milestone-based fund releases',
      tech: 'React • TypeScript • Solidity',
      type: 'Web3',
      featured: true,
      github: 'https://github.com/vedant/fundforge',
      live: null // In development
    },
    {
      id: 'shoemarknet',
      title: 'ShoeMarkNet',
      year: '2024',
      description: 'E-commerce platform with GenAI assistant and CRM integration',
      tech: 'MERN • Tailwind • AI APIs',
      type: 'Full Stack',
      featured: true,
      github: 'https://github.com/vedant/shoemarknet',
      live: 'https://shoemarknet.com'
    },
    {
      id: 'myblog',
      title: 'MyBlog',
      year: '2023',
      description: 'Content platform with AI-powered editor and multimodal assistance',
      tech: 'MEAN • TypeScript • Gemini API',
      type: 'Full Stack',
      featured: true,
      github: 'https://github.com/vedant/myblog',
      live: 'https://myblog.vercel.app'
    },
    {
      id: 'taskflow',
      title: 'TaskFlow',
      year: '2024',
      description: 'Real-time collaborative task management system',
      tech: 'Vue.js • Socket.io • PostgreSQL',
      type: 'SaaS',
      github: 'https://github.com/vedant/taskflow',
      live: 'https://taskflow.app'
    },
    {
      id: 'cryptotrack',
      title: 'CryptoTrack',
      year: '2023',
      description: 'Cryptocurrency portfolio tracker with live market data',
      tech: 'React Native • Firebase • APIs',
      type: 'Mobile',
      github: 'https://github.com/vedant/cryptotrack',
      live: null
    },
    {
      id: 'aiwriter',
      title: 'AI Writer',
      year: '2023',
      description: 'Content generation tool powered by GPT models',
      tech: 'Python • FastAPI • OpenAI',
      type: 'AI/ML',
      github: 'https://github.com/vedant/aiwriter',
      live: 'https://aiwriter.io'
    },
    {
      id: 'codelearn',
      title: 'CodeLearn',
      year: '2022',
      description: 'Interactive coding education platform',
      tech: 'React • Node.js • MongoDB',
      type: 'EdTech',
      github: 'https://github.com/vedant/codelearn',
      live: null
    },
    {
      id: 'healthtrack',
      title: 'HealthTrack',
      year: '2022',
      description: 'Personal health monitoring dashboard',
      tech: 'Angular • Express • Chart.js',
      type: 'Healthcare',
      github: 'https://github.com/vedant/healthtrack',
      live: 'https://healthtrack.vercel.app'
    }
  ];

  const visibleProjects = showAll ? projects : projects.slice(0, 3);

  const handleLinkClick = (e, url) => {
    e.stopPropagation();
    if (url) {
      window.open(url, '_blank', 'noopener noreferrer');
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-gray-50 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 h-full relative flex flex-col"
    >
      {/* Section Label */}
      <motion.div
        className="flex justify-between items-start mb-6 sm:mb-8 lg:mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs sm:text-sm text-gray-400 font-mono font-light">04 &nbsp;&nbsp;PROJECTS</p>
        <p className="text-xs sm:text-sm text-gray-400 font-mono font-light">{projects.length} TOTAL</p>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Projects List/Grid */}
        <div className="relative">
          <motion.div 
            className={`${showAll ? 'max-h-[50vh] sm:max-h-[40vh] overflow-y-auto pr-2 sm:pr-4' : ''}`}
            style={{
              maskImage: showAll ? 'linear-gradient(to bottom, black 85%, transparent 100%)' : 'none',
              WebkitMaskImage: showAll ? 'linear-gradient(to bottom, black 85%, transparent 100%)' : 'none'
            }}
          >
            <AnimatePresence mode="popLayout">
              {visibleProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.05 * index, duration: 0.3 }}
                  className="group"
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                >
                  {/* Mobile Card Layout */}
                  <div className={`
                    block sm:hidden
                    p-4 mb-4 bg-white rounded-lg border border-gray-200
                    transition-all duration-300
                    ${selectedProject === project.id ? 'shadow-lg' : 'shadow-sm'}
                  `}>
                    {/* Header */}
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-lg font-display font-medium text-gray-900">
                            {project.title}
                          </h4>
                          {project.featured && (
                            <span className="text-xs text-yellow-500">★</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="font-mono">{project.year}</span>
                          <span className="uppercase tracking-wider font-sans">{project.type}</span>
                        </div>
                      </div>
                      
                      {/* Links */}
                      <div className="flex items-center gap-3">
                        {project.github && (
                          <button
                            onClick={(e) => handleLinkClick(e, project.github)}
                            className="text-gray-500 hover:text-gray-900 transition-colors"
                            aria-label="View GitHub repository"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                          </button>
                        )}
                        {project.live && (
                          <button
                            onClick={(e) => handleLinkClick(e, project.live)}
                            className="text-gray-500 hover:text-gray-900 transition-colors"
                            aria-label="View live project"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-600 font-sans mb-3">
                      {project.description}
                    </p>
                    
                    {/* Tech Stack */}
                    <p className="text-xs text-gray-500 font-mono">
                      {project.tech}
                    </p>
                  </div>

                  {/* Desktop Row Layout */}
                  <div className={`
                    hidden sm:flex items-center justify-between py-4
                    transition-all duration-300
                    ${hoveredProject === project.id ? 'bg-white px-4 -mx-4 rounded-lg' : ''}
                    ${index !== visibleProjects.length - 1 ? 'border-b border-gray-200' : ''}
                  `}>
                    {/* Left: Year & Type */}
                    <div className="flex items-center gap-4 lg:gap-6 min-w-[100px] lg:min-w-[140px]">
                      <span className="text-xs lg:text-sm text-gray-400 font-mono font-light tabular-nums">
                        {project.year}
                      </span>
                      <span className="text-[10px] lg:text-xs text-gray-500 font-sans font-light uppercase tracking-wider">
                        {project.type}
                      </span>
                    </div>

                    {/* Center: Title & Description */}
                    <div className="flex-1 px-4 lg:px-6">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className={`
                          text-lg lg:text-xl font-display font-light text-gray-900
                          transition-transform duration-300
                          ${hoveredProject === project.id ? 'translate-x-2' : ''}
                        `}>
                          {project.title}
                          {project.featured && (
                            <span className="text-xs text-gray-400 font-sans font-light ml-2">★</span>
                          )}
                        </h4>
                        
                        {/* Links - visible on hover */}
                        <motion.div
                          className="flex items-center gap-3"
                          animate={{
                            opacity: hoveredProject === project.id ? 1 : 0,
                            x: hoveredProject === project.id ? 0 : -10
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          {project.github && (
                            <button
                              onClick={(e) => handleLinkClick(e, project.github)}
                              className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
                              aria-label="View GitHub repository"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                              </svg>
                            </button>
                          )}
                          {project.live && (
                            <button
                              onClick={(e) => handleLinkClick(e, project.live)}
                              className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
                              aria-label="View live project"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </button>
                          )}
                          {!project.live && !project.github && (
                            <span className="text-xs text-gray-400 font-sans font-light">In Development</span>
                          )}
                        </motion.div>
                      </div>
                      
                      <motion.p 
                        className="text-xs lg:text-sm text-gray-600 font-sans font-light"
                        animate={{
                          opacity: hoveredProject === project.id ? 1 : 0.7
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {project.description}
                      </motion.p>
                    </div>

                    {/* Right: Tech Stack */}
                    <div className="text-right min-w-[150px] lg:min-w-[200px]">
                      <span className="text-[10px] lg:text-xs text-gray-500 font-mono font-light">
                        {project.tech}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Show More/Less Button */}
          <motion.div
            className="mt-6 sm:mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-gray-900 font-sans font-light hover:underline transition-all flex items-center gap-2"
            >
              {showAll ? (
                <>
                  <span>Show Less</span>
                  <motion.span
                    animate={{ y: [-2, 0, -2] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ↑
                  </motion.span>
                </>
              ) : (
                <>
                  <span>Show All {projects.length} Projects</span>
                  <motion.span
                    animate={{ y: [0, 2, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ↓
                  </motion.span>
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* Featured Projects Indicator - Desktop Only */}
        <motion.div
          className="hidden lg:block mt-8 pt-8 border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-xs text-yellow-500">★</span>
              <span className="text-xs text-gray-500 font-sans">Featured Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-500 font-sans">Live</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-xs text-gray-500 font-sans">In Development</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Page indicator */}
      <motion.div
        className="absolute top-6 sm:top-8 lg:top-12 xl:top-16 right-6 sm:right-8 lg:right-12 xl:right-16 text-xs sm:text-sm text-gray-400 font-mono font-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        /04
      </motion.div>

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -right-1/2 w-full h-full"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 100,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-full h-full border border-gray-100 rounded-full opacity-20" />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Projects;