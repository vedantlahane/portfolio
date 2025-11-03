import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Skills = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleSkillIndex, setVisibleSkillIndex] = useState(0);

  const animationStartRef = useRef(performance.now());
  const pausedAtRef = useRef(null);
  const rafRef = useRef(null);
  const marqueeRef = useRef(null);

  const skillCategories = useMemo(
    () => ({
      languages: {
        title: "Languages",
        skills: [
          "Java",
          "JavaScript",
          "TypeScript",
          "C++",
          "C",
          "PHP",
          "SQL",
          "HTML",
          "CSS",
        ],
      },
      frameworks: {
        title: "Frameworks & Libraries",
        skills: [
          "React.js",
          "Node.js",
          "Express.js",
          "Angular",
          "Redux",
          "Laravel",
          "Shadcn",
          "Tailwind CSS",
        ],
      },
      tools: {
        title: "Development Tools",
        skills: [
          "Vite",
          "Git",
          "GitHub",
          "Postman",
          "Docker",
          "Docker Compose",
          "Jenkins",
        ],
      },
      cloud: {
        title: "AI & Cloud Services",
        skills: [
          "OpenAI API",
          "Gemini API",
          "v0.dev",
          "Vercel",
          "AWS",
          "Render",
          "Lighthouse",
        ],
      },
      databases: {
        title: "Databases & Systems",
        skills: ["MongoDB", "MySQL", "Linux"],
      },
      soft: {
        title: "Soft Skills",
        skills: ["Problem-solving", "Teamwork", "Adaptability", "Creativity"],
      },
    }),
    []
  );

  const categoryEntries = useMemo(
    () => Object.entries(skillCategories),
    [skillCategories]
  );
  const allSkills = useMemo(
    () => categoryEntries.flatMap(([, cat]) => cat.skills),
    [categoryEntries]
  );
  const firstCategoryKey = categoryEntries[0]?.[0] ?? null;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setVisibleSkillIndex(0);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setIsExpanded(false);
      setActiveSection(null);
      return;
    }

    animationStartRef.current = performance.now();
    pausedAtRef.current = null;

    // Faster cycle for marquee/count sync (20 seconds)
    const CYCLE_DURATION_MS = 100000;

    const tick = (now) => {
      const anchorTime = pausedAtRef.current ?? now;
      const elapsed =
        (anchorTime - animationStartRef.current + CYCLE_DURATION_MS) %
        CYCLE_DURATION_MS;
      const progress = elapsed / CYCLE_DURATION_MS;
      const nextIndex =
        Math.floor(progress * allSkills.length) % allSkills.length;

      setVisibleSkillIndex((prev) => (prev === nextIndex ? prev : nextIndex));

      if (marqueeRef.current) {
        const translateX = -progress * 100;
        marqueeRef.current.style.transform = `translateX(${translateX}%)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [allSkills.length, isMobile]);

  const toggleSection = (sectionKey) => {
    setActiveSection((prev) => (prev === sectionKey ? null : sectionKey));
  };

  const pauseMarquee = () => {
    if (!isPaused) {
      pausedAtRef.current = performance.now();
      setIsPaused(true);
    }
  };

  const resumeMarquee = () => {
    if (pausedAtRef.current != null) {
      const resumeTime = performance.now();
      const pausedDuration = resumeTime - pausedAtRef.current;
      animationStartRef.current += pausedDuration;
      pausedAtRef.current = null;
    }
    setIsPaused(false);
  };

  const handleMouseEnter = () => {
    if (!isExpanded) pauseMarquee();
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
    setActiveSection(null);
    resumeMarquee();
  };

  const AccordionView = ({  }) => {
    return (
      <div className="space-y-0">
        {categoryEntries.map(([key, category], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <motion.button
              type="button"
              onClick={() => toggleSection(key)}
              className="flex w-full items-center justify-between px-0 py-6 text-left transition-colors hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-gray-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base font-medium text-gray-900">
                  {category.title}
                </h3>
                <span className="text-xs text-gray-500">
                  ({category.skills.length})
                </span>
              </div>

              <motion.span
                animate={{ rotate: activeSection === key ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-gray-400"
              >
                →
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {activeSection === key && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 pb-6 pl-8 sm:grid-cols-3">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.03 * skillIndex }}
                        className="flex items-center gap-3 py-2"
                      >
                        <div className="h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
                        <span className="text-sm text-gray-700">{skill}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {index < categoryEntries.length - 1 && (
              <div className="h-px w-full bg-gray-200" />
            )}
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="pt-8 text-center"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gray-300" />
            <span className="font-mono text-xs text-gray-400">
              {allSkills.length} TOTAL SKILLS
            </span>
            <div className="h-px w-12 bg-gray-300" />
          </div>
        </motion.div>
      </div>
    );
  };

  const DesktopView = () => {
    const progress = ((visibleSkillIndex + 1) / allSkills.length) * 100;

    return (
      <div className="relative">
        {!isExpanded && (
          <div className="absolute inset-x-0 top-0 z-10 h-px bg-gray-200">
            <motion.div
              className="h-full bg-gray-400"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.7 }}
            />
          </div>
        )}

        {/* Entire section clickable */}
        <div
          className={`relative overflow-hidden py-12 ${
            isExpanded ? "" : "cursor-pointer"
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            if (!isExpanded) {
              pauseMarquee();
              setActiveSection((prev) => prev ?? firstCategoryKey);
              setIsExpanded(true);
            }
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !isExpanded) {
              pauseMarquee();
              setActiveSection((prev) => prev ?? firstCategoryKey);
              setIsExpanded(true);
            }
            if ((e.key === "Escape" || e.key === " ") && isExpanded) {
              setIsExpanded(false);
              setActiveSection(null);
              resumeMarquee();
            }
          }}
          aria-expanded={isExpanded}
          aria-label={
            isExpanded
              ? "Move out to contract"
              : "Click to expand "
          }
        >
          <AnimatePresence initial={false} mode="wait">
            {isExpanded ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.8,
                  exit: { duration: 1.5, ease: "easeInOut" }
                }}
                layout
              >
                <AccordionView variant="desktop" />
              </motion.div>
            ) : (
              <motion.div
                key="marquee"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                layout
                className="skills-marquee-wrapper"
              >
                <div
                  ref={marqueeRef}
                  className="skills-marquee flex whitespace-nowrap select-none"
                >
                  {[0, 1].map((iteration) => (
                    <div
                      key={iteration}
                      className="skills-marquee__group inline-flex"
                      aria-hidden={iteration === 1}
                    >
                      {allSkills.map((skill, index) => {
                        const isActive = index === visibleSkillIndex;
                        return (
                          <React.Fragment key={`${iteration}-${skill}`}>
                            <motion.span
                              className={`mx-8 select-none text-2xl font-light transition-colors duration-300 md:mx-10 md:text-3xl lg:mx-12 lg:text-4xl xl:mx-16 xl:text-5xl 2xl:mx-20 2xl:text-6xl ${
                                isActive ? "text-gray-900" : "text-gray-500"
                              }`}
                              whileHover={{
                                color: "#6b7280",
                                scale: 1.05,
                                y: -2,
                              }}
                            >
                              {skill}
                            </motion.span>
                            {index < allSkills.length - 1 && (
                              <span className="mx-4 select-none text-xl text-gray-300">
                                •
                              </span>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Instructions Text */}
        <div className="mt-2 text-center font-mono text-xs text-gray-400 select-none">
          {isExpanded
            ? "Move out to contract"
            : "Click to expand"}
        </div>

        {/* Count below marquee */}
        {!isExpanded && (
          <motion.div
            className="mt-1 text-center font-mono text-xs text-gray-400 select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {String(visibleSkillIndex + 1).padStart(2, "0")} /{" "}
            {String(allSkills.length).padStart(2, "0")}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <motion.section
      id="skills"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="relative overflow-hidden border-y border-gray-200 bg-gray-50 px-6 py-10 shadow-xl shadow-gray-200/50 sm:px-10 sm:py-14"
    >
      <div className="relative flex flex-col gap-8 sm:gap-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="font-mono text-xs uppercase tracking-[0.4em] text-gray-500"
          >
            05 &nbsp;&nbsp;SKILLS
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex items-center gap-2 font-mono text-xs text-gray-400 select-none"
          >
            {/* Show active section title on mobile */}
            {isMobile && activeSection && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="capitalize"
              >
                {skillCategories[activeSection]?.title}
              </motion.span>
            )}
          </motion.div>
        </div>

        <div className="relative z-10">
          {isMobile ? <AccordionView variant="mobile" /> : <DesktopView />}
        </div>
      </div>
    </motion.section>
  );
};

export default Skills;
