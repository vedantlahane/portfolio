import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdmin, API_URL } from "../../context/AdminContext";
import EditableText from "../UI/EditableText";

const COLLAPSE_DELAY_MS = 1200;

const Skills = () => {
  const { isAdmin, token } = useAdmin();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleSkillIndex, setVisibleSkillIndex] = useState(0);

  const animationStartRef = useRef(performance.now());
  const pausedAtRef = useRef(null);
  const rafRef = useRef(null);
  const marqueeRef = useRef(null);
  const expandedPanelRef = useRef(null);
  const [expandedPanelHeight, setExpandedPanelHeight] = useState(0);

  const fetchSkills = async () => {
    try {
      const res = await fetch(`${API_URL}/api/skills`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Fetch skills failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleRenameCategory = async (id, newTitle) => {
    try {
      const res = await fetch(`${API_URL}/api/skills/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTitle })
      });
      if (res.ok) fetchSkills();
    } catch (err) {
      console.error('Rename category failed:', err);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this skill category?')) return;
    try {
      const res = await fetch(`${API_URL}/api/skills/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) fetchSkills();
    } catch (err) {
      console.error('Delete category failed:', err);
    }
  };

  const handleAddSkill = async (catId, skillName) => {
    if (!skillName.trim()) return;
    const category = categories.find(c => c._id === catId);
    if (!category) return;
    
    const updatedSkills = [...category.skills, skillName.trim()];
    try {
      const res = await fetch(`${API_URL}/api/skills/${catId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ skills: updatedSkills })
      });
      if (res.ok) fetchSkills();
    } catch (err) {
      console.error('Add skill failed:', err);
    }
  };

  const handleDeleteSkill = async (catId, skillIndex) => {
    const category = categories.find(c => c._id === catId);
    if (!category) return;
    
    const updatedSkills = [...category.skills];
    updatedSkills.splice(skillIndex, 1);
    
    try {
      const res = await fetch(`${API_URL}/api/skills/${catId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ skills: updatedSkills })
      });
      if (res.ok) fetchSkills();
    } catch (err) {
      console.error('Delete skill failed:', err);
    }
  };

  const handleCreateCategory = async (title) => {
    if (!title.trim()) return;
    const key = title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    try {
      const res = await fetch(`${API_URL}/api/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ key, title: title.trim(), skills: [], order: categories.length })
      });
      if (res.ok) fetchSkills();
    } catch (err) {
      console.error('Create category failed:', err);
    }
  };

  const skillCategories = useMemo(() => {
    const obj = {};
    categories.forEach(cat => {
      obj[cat.key] = { title: cat.title, skills: cat.skills, _id: cat._id };
    });
    return obj;
  }, [categories]);

  const categoryEntries = useMemo(() => {
    return categories.map(cat => [cat.key, cat]);
  }, [categories]);

  const allSkills = useMemo(() => {
    return categories.flatMap((cat) => cat.skills);
  }, [categories]);

  const firstCategoryKey = categoryEntries[0]?.[0] ?? null;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile || allSkills.length === 0) {
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

    const CYCLE_DURATION_MS = 150000;

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
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };
  }, [allSkills.length, isMobile]);

  useEffect(() => {
    if (!expandedPanelRef.current) {
      return;
    }

    const updateHeight = () => {
      if (expandedPanelRef.current) {
        setExpandedPanelHeight(expandedPanelRef.current.scrollHeight);
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(expandedPanelRef.current);

    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [activeSection, isExpanded, isMobile, categories]);

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

  const closeTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (!isExpanded) pauseMarquee();
  };

  const handleMouseLeave = () => {
    if (isAdmin) return;
    closeTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
      setActiveSection(null);
      resumeMarquee();
    }, COLLAPSE_DELAY_MS);
  };

  const AccordionView = () => {
    return (
      <div className="space-y-0 text-left">
        {categoryEntries.map(([key, category], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <div className="flex w-full items-center justify-between py-4">
              <div
                className="flex flex-1 items-center gap-4 text-left transition-colors text-gray-900"
              >
                <span className="font-mono text-xs text-gray-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {isAdmin ? (
                  <EditableText
                    value={category.title}
                    onSave={(val) => handleRenameCategory(category._id, val)}
                    isAdmin={true}
                    textClassName="text-base font-medium text-gray-900 cursor-pointer hover:underline"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleSection(key)}
                    className="text-base font-medium text-gray-900 cursor-pointer hover:text-gray-600 focus:outline-none"
                  >
                    {category.title}
                  </button>
                )}
                <span className="text-xs text-gray-500">
                  ({category.skills.length})
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
                    className="text-xs font-mono text-red-600 hover:underline cursor-pointer"
                  >
                    Delete Category
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => toggleSection(key)}
                  className="text-gray-400 focus:outline-none cursor-pointer p-1"
                >
                  {activeSection === key ? "↓" : "→"}
                </button>
              </div>
            </div>

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
                        className="flex items-center justify-between py-2 border-b border-gray-100 pr-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-400 h-1.5 w-1.5 flex-shrink-0 rounded-full" />
                          <span className="text-sm text-gray-700">{skill}</span>
                        </div>
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteSkill(category._id, skillIndex)}
                            className="text-xs text-red-500 hover:text-red-700 font-bold font-mono cursor-pointer"
                            title="Delete Skill"
                          >
                            ✕
                          </button>
                        )}
                      </motion.div>
                    ))}
                    
                    {isAdmin && (
                      <div className="flex items-center py-2 col-span-2 sm:col-span-3">
                        <span className="text-xs text-gray-400 font-mono mr-2">+ Add Skill:</span>
                        <EditableText
                          value=""
                          onSave={(val) => handleAddSkill(category._id, val)}
                          isAdmin={true}
                          placeholder="Type name & hit Enter"
                          textClassName="text-xs text-blue-600 hover:underline border-b border-dashed border-blue-400 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {index < categoryEntries.length - 1 && (
              <div className="h-px w-full bg-gray-200" />
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  const DesktopView = () => {
    const progress = allSkills.length > 0 ? ((visibleSkillIndex + 1) / allSkills.length) * 100 : 0;

    return (
      <div className="relative">
        <div 
          className="absolute inset-x-0 top-0 z-10 h-px bg-gray-200"
          style={{ 
            opacity: isExpanded ? 0 : 1,
            transition: isExpanded ? 'opacity 0.3s ease-out' : 'opacity 0.8s ease-out 0.3s'
          }}
        >
          <motion.div
            className="bg-gray-900 h-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.7 }}
          />
        </div>

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
              ? "Collapse skill details"
              : "Expand skill details"
          }
        >
          <motion.div
            initial={false}
            animate={{
              height: isExpanded ? expandedPanelHeight : 0,
              opacity: isExpanded ? 1 : 0,
              marginBottom: isExpanded ? 16 : 0,
            }}
            transition={{
              height: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.45 },
              marginBottom: { duration: 0.6 }
            }}
            className="overflow-hidden"
          >
            <div ref={expandedPanelRef}>
              <AccordionView />
            </div>
          </motion.div>

          <motion.div
            initial={false}
            className="skills-marquee-wrapper"
            animate={{
              height: isExpanded ? 0 : 96,
              opacity: isExpanded ? 0 : 1,
              marginTop: isExpanded ? 0 : 8,
            }}
            transition={{
              height: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.35 },
              marginTop: { duration: 0.45 }
            }}
            style={{ pointerEvents: isExpanded ? "none" : "auto" }}
          >
            {allSkills.length > 0 && (
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
                              isActive ? "text-gray-900" : "text-gray-400"
                            }`}
                            whileHover={{
                              color: "rgb(95, 143, 136)",
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
            )}
          </motion.div>
        </div>

        <div className="mt-2 text-center font-mono text-xs text-gray-400 select-none">
          {isExpanded
            ? (isAdmin ? "Click on details to edit" : "Move out or Click to contract")
            : "Click to expand"}
        </div>

        <div 
          className="mt-1 text-center font-mono text-xs text-gray-400 select-none"
          style={{ 
            opacity: isExpanded ? 0 : 1,
            transition: isExpanded ? 'opacity 0.3s ease-out' : 'opacity 0.8s ease-out 0.3s'
          }}
        >
          {String(visibleSkillIndex + 1).padStart(2, "0")} /{" "}
          {String(allSkills.length).padStart(2, "0")}
        </div>
      </div>
    );
  };

  return (
    <motion.section
      id="skills"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="relative overflow-hidden border-y border-gray-200 bg-gradient-to-b from-gray-50 to-transparent px-6 py-10  sm:px-10 sm:py-14"
    >
      <div className="relative flex flex-col gap-8 sm:gap-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="font-mono text-xs uppercase tracking-[0.4em] text-gray-500 flex items-center gap-4"
          >
            <span>05 &nbsp;&nbsp;SKILLS</span>
            {isAdmin && (
              <EditableText
                value=""
                onSave={handleCreateCategory}
                isAdmin={true}
                placeholder="+ ADD CATEGORY"
                textClassName="text-[10px] text-gray-900 border border-gray-900 px-2 py-0.5 hover:bg-gray-900 hover:text-white transition-colors cursor-pointer"
              />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex items-center gap-2 font-mono text-xs text-gray-400 select-none"
          >
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
          {isMobile ? <AccordionView /> : <DesktopView />}
        </div>
      </div>
    </motion.section>
  );
};

export default Skills;
