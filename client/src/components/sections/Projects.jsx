import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Projects = () => {
  const [showAll, setShowAll] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);

  // Projects (trimmed descriptions & tech). Use `live` truthiness to mark Live vs In-Development.
  const projects = [
    {
      id: 'shoemarknet',
      title: 'ShoeMarkNet',
      year: '2025',
      description: 'Full-stack e-commerce platform for footwear with admin dashboard and AI features.',
      tech: 'React • Node • MongoDB • Tailwind',
      type: 'Full Stack',
      featured: true,
      github: 'https://github.com/vedantlahane/ShoeMarkNet',
      live: 'https://shoemarknet.com'
    },
    {
      id: 'fundforge',
      title: 'FundForge',
      year: '2025',
      description: 'Decentralized crowdfunding platform with milestone-based fund releases (Ethereum).',
      tech: 'React • TypeScript • Solidity • Truffle',
      type: 'Web3',
      featured: true,
      github: 'https://github.com/vedantlahane/fundforge',
      live: null
    },
    {
      id: 'myblog',
      title: 'myblog',
      year: '2025',
      description: 'MEAN-style blogging platform with editor and publishing features.',
      tech: 'Angular • Express • TypeScript',
      type: 'Full Stack',
      featured: true,
      github: 'https://github.com/vedantlahane/myblog',
      live: 'https://myblog.vercel.app'
    },
    {
      id: 'QnA',
      title: 'QnA',
      year: '2025',
      description: 'Q&A project (RAG + CSV/SQL connectors) — backend + React frontend.',
      tech: 'FastAPI • React • LangChain',
      type: 'Full Stack',
      github: 'https://github.com/vedantlahane/QnA',
      live: null
    },
    {
      id: 'portfolio',
      title: 'portfolio',
      year: '2025',
      description: 'Personal portfolio / landing site skeleton.',
      tech: 'React • Tailwind • Vercel',
      type: 'Frontend',
      github: 'https://github.com/vedantlahane/portfolio',
      live: null
    },
    {
      id: 'shoemarknetdocker',
      title: 'shoemarknetdocker',
      year: '2025',
      description: 'Docker / deployment helper for ShoeMarkNet (deployment & scripts).',
      tech: 'Docker • Compose • Shell',
      type: 'DevOps',
      github: 'https://github.com/vedantlahane/shoemarknetdocker',
      live: null
    }
  ];

  const visibleProjects = showAll ? projects : projects.slice(0, 3);

  const handleLinkClick = (e, url) => {
    e.stopPropagation();
    if (url) window.open(url, '_blank', 'noopener noreferrer');
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-gray-50 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 h-full relative flex flex-col"
    >
      {/* Header - responsive to prevent overlap */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 lg:mb-12 gap-2 pr-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs sm:text-sm text-gray-400 font-mono font-light">04 &nbsp;&nbsp;PROJECTS</p>
        <p className="text-xs sm:text-sm text-gray-400 font-mono font-light flex-shrink-0 whitespace-nowrap">
          {projects.length} TOTAL
        </p>
      </motion.div>

      {/* Projects list (row style, no box) */}
      <div className="flex-1 overflow-hidden">
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
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ delay: 0.04 * index, duration: 0.28 }}
                  className={`group ${index !== visibleProjects.length - 1 ? 'border-b border-gray-200' : ''}`}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  {/* Row layout (keeps original look) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6">
                    {/* Left: Year & Type */}
                    <div className="flex flex-col items-start sm:items-center gap-2 min-w-[80px] sm:min-w-[140px]">
                      <span className="text-xs lg:text-sm text-gray-400 font-mono font-light tabular-nums">
                        {project.year}
                      </span>
                      <span className="text-[10px] lg:text-xs text-gray-500 font-sans uppercase tracking-wider">
                        {project.type}
                      </span>
                    </div>

                    {/* Center: Title & description */}
                    <div className="flex-1">
                      <div className="flex items-start sm:items-center gap-3">
                        <h4 className={`
                          text-lg lg:text-xl font-display font-light text-gray-900
                          transition-transform duration-200
                          ${hoveredProject === project.id ? 'translate-x-1' : ''}
                        `}>
                          {project.title}
                          {project.featured && (
                            <span className="text-xs text-yellow-500 font-sans font-light ml-2" title="Featured">★</span>
                          )}
                        </h4>

                        {/* Links area: github & live icons (live icon shown when project.live exists) */}
                        <div className="ml-auto sm:ml-0 flex items-center gap-3">
                          {project.github && (
                            <button
                              onClick={(e) => handleLinkClick(e, project.github)}
                              className="text-gray-500 hover:text-gray-900 transition-colors"
                              aria-label="View GitHub repository"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                              </svg>
                            </button>
                          )}

                          {project.live && (
                            <button
                              onClick={(e) => handleLinkClick(e, project.live)}
                              className="text-gray-500 hover:text-gray-900 transition-colors"
                              aria-label="Open live demo"
                              title="Live demo"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-sm lg:text-sm text-gray-600 font-sans mt-2">
                        {project.description}
                      </p>
                    </div>

                    {/* Right: Tech stack + status dot (green = live, gray = in development) */}
                    <div className="text-right sm:text-right mt-4 sm:mt-0 min-w-[120px] sm:min-w-[180px]">
                      <div className="flex items-center justify-end gap-2">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${project.live ? 'bg-green-500' : 'bg-gray-400'}`}
                          title={project.live ? 'Live' : 'In development'}
                          aria-hidden
                        />
                        <span className="text-[10px] lg:text-xs text-gray-500 font-mono block">
                          {project.tech}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Show More / Show Less */}
          <motion.div className="mt-6 sm:mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-gray-900 font-sans font-light hover:underline transition-all flex items-center gap-2"
            >
              {showAll ? (
                <>
                  <span>Show Less</span>
                  <motion.span animate={{ y: [-2, 0, -2] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    ↑
                  </motion.span>
                </>
              ) : (
                <>
                  <span>Show All {projects.length} Projects</span>
                  <motion.span animate={{ y: [0, 2, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    ↓
                  </motion.span>
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* Legend — Featured / Live / In Development */}
        <motion.div
          className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-500 flex flex-wrap items-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs text-yellow-500">★</span>
            <span className="text-gray-500">Featured</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-gray-500">Live</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-gray-400 rounded-full" />
            <span className="text-gray-500">In Development</span>
          </div>
        </motion.div>
      </div>

      {/* Page indicator - hidden on extra-small screens to avoid overlap */}
      <motion.div
        className="hidden sm:block absolute top-6 sm:top-8 lg:top-12 xl:top-16 right-6 sm:right-8 lg:right-12 xl:right-16 text-xs sm:text-sm text-gray-400 font-mono font-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        /04
      </motion.div>
    </motion.section>
  );
};

export default Projects;
