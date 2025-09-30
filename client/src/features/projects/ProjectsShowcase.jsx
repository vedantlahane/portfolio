import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectsShowcase = () => {
  const [showAll, setShowAll] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);

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
      className="relative overflow-hidden bg-white/80 backdrop-blur-xl border border-white/70 shadow-xl shadow-gray-200/40 p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 h-full flex flex-col rounded-3xl"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -inset-24 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_55%)]" />
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-sky-100/40 via-transparent to-transparent" />
      </div>

      <motion.div
        className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 lg:mb-12 gap-2 pr-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs sm:text-sm text-gray-400 font-mono font-light">04 &nbsp;&nbsp;PROJECTS</p>
        <p className="text-xs sm:text-sm text-gray-400 font-mono font-light flex-shrink-0 whitespace-nowrap">
          {projects.length} TOTAL
        </p>
      </motion.div>

      <div className="relative z-10 flex-1 overflow-hidden">
        <div className="relative">
          <motion.div
            className={`${showAll ? 'max-h-[50vh] sm:max-h-[40vh] overflow-y-auto pr-2 sm:pr-4' : ''} space-y-4`}
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
                  className="relative group overflow-hidden rounded-2xl border border-gray-200/70 bg-white/70 transition-all duration-300 hover:border-indigo-200/80 hover:shadow-lg hover:shadow-indigo-200/40"
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  whileHover={{ y: -4 }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-indigo-100/70 via-sky-100/60 to-emerald-100/70"
                    initial={false}
                    animate={{ opacity: hoveredProject === project.id ? 1 : 0 }}
                    transition={{ duration: 0.35 }}
                  />

                  <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 px-4 sm:px-6">
                    <div className="flex flex-col items-start sm:items-center gap-2 min-w-[80px] sm:min-w-[140px]">
                      <span className="text-xs lg:text-sm text-gray-400 font-mono font-light tabular-nums">
                        {project.year}
                      </span>
                      <span className="text-[10px] lg:text-xs text-gray-500 font-sans uppercase tracking-wider">
                        {project.type}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start sm:items-center gap-3">
                        <h4
                          className={`
                            text-lg lg:text-xl font-display font-light text-gray-900
                            transition-transform duration-200
                            ${hoveredProject === project.id ? 'translate-x-1' : ''}
                          `}
                        >
                          {project.title}
                          {project.featured && (
                            <motion.span
                              className="inline-flex items-center gap-1 text-xs text-yellow-500 font-sans font-light ml-2"
                              initial={{ opacity: 0, scale: 0.85 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3 }}
                              title="Featured"
                            >
                              ★
                              <span className="hidden sm:inline text-[10px] tracking-widest text-yellow-600">FEATURED</span>
                            </motion.span>
                          )}
                        </h4>

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
                              className="text-gray-500 hover:text-indigo-600 transition-colors"
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

          <motion.div className="relative z-10 mt-6 sm:mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
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

        <motion.div
          className="relative z-10 mt-8 pt-6 border-t border-gray-200/70 text-xs text-gray-500 flex flex-wrap items-center gap-6"
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

      <motion.div
        className="hidden sm:block absolute top-6 sm:top-8 lg:top-12 xl:top-16 right-6 sm:right-8 lg:right-12 xl:right-16 text-xs sm:text-sm text-gray-400 font-mono font-light z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        /04
      </motion.div>
    </motion.section>
  );
};

export default ProjectsShowcase;
