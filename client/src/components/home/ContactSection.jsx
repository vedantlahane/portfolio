import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GradientSeparator from "./GradientSeparator";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

const contactLinks = [
  {
    name: "Email",
    href: "mailto:vedantanillahane@gmail.com",
    icon: <EnvelopeIcon className="w-8 h-8 text-blue-400" />,
    display: "vedantanillahane@gmail.com",
    color: "from-blue-400 via-blue-700 to-blue-900",
  },
  {
    name: "GitHub",
    href: "https://github.com/vedantlahane",
    icon: (
      <img
        src="https://img.icons8.com/ios-filled/50/github.png"
        alt="GitHub"
        className="w-8 h-8"
      />
    ),
    display: "github.com/vedantlahane",
    color: "from-gray-700 via-gray-600 to-gray-900",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/vedant-lahane",
    icon: (
      <img
        src="https://img.icons8.com/color/48/linkedin.png"
        alt="LinkedIn"
        className="w-8 h-8"
      />
    ),
    display: "linkedin.com/in/vedant-lahane",
    color: "from-blue-200 to-blue-700",
  },
  {
    name: "LeetCode",
    href: "https://leetcode.com/u/vedantlahane",
    icon: (
      <img
        src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/48/external-level-up-your-coding-skills-and-quickly-land-a-job-logo-color-tal-revivo.png"
        alt="LeetCode"
        className="w-8 h-8"
      />
    ),
    display: "leetcode.com/u/vedantlahane",
    color: "from-orange-400 via-orange-300 to-orange-600",
  },
];

// Animation variants defined outside component for reusability
const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
  tap: {
    scale: 0.98,
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
};

// Reusable ContactCard component with memoization
const ContactCard = React.memo(({ link, index, hoveredCard, setHoveredCard, handleMouseMove, handleMouseLeave }) => (
  <motion.a
    href={link.href}
    target="_blank"
    rel="noopener noreferrer"
    role="link"
    aria-label={`Contact me via ${link.name} at ${link.display}`}
    className="relative overflow-hidden rounded-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700/60"
    variants={cardVariants}
    whileHover="hover"
    whileTap="tap"
    onMouseEnter={() => setHoveredCard(index)}
    onMouseMove={(e) => handleMouseMove(e, index)}
    onMouseLeave={handleMouseLeave}
    onFocus={() => setHoveredCard(index)}
    onBlur={handleMouseLeave}
    tabIndex={0}
    style={{ transformStyle: "preserve-3d", transition: "transform 0.1s ease" }}
  >
    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative z-10 p-6 flex items-center gap-5">
      <motion.div
        className={`flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${link.color} p-3 shadow-lg`}
        whileHover={{ rotate: [0, -5, 5, -5, 0], transition: { duration: 0.5 } }}
      >
        {link.icon}
      </motion.div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">{link.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{link.display}</p>
      </div>
      <motion.div
        className="text-gray-400"
        initial={{ x: -5, opacity: 0 }}
        whileHover={{ x: 0, opacity: 1 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </motion.div>
    </div>
    <AnimatePresence>
      {hoveredCard === index && (
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-10`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </AnimatePresence>
  </motion.a>
));

const ContactSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  // Memoized event handlers for performance
  const handleMouseMove = useCallback((e, index) => {
    if (hoveredCard === index) {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    }
  }, [hoveredCard]);

  const handleMouseLeave = useCallback((e) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    setHoveredCard(null);
  }, [setHoveredCard]);

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      {/* Animated background elements
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute top-10 left-10 w-64 h-64 rounded-full bg-blue-400/10 blur-3xl"
          animate={floatingAnimation}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-purple-400/10 blur-3xl"
          animate={{
            ...floatingAnimation,
            transition: { ...floatingAnimation.transition, delay: 1 },
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-green-400/10 blur-3xl"
          animate={{
            ...floatingAnimation,
            transition: { ...floatingAnimation.transition, delay: 2 },
          }}
        />
      </div> */}

      <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-left mb-16"
        >
          <motion.h2
            className="text-2xl sm:text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent inline-block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Let's Connect
          </motion.h2>
          <motion.div
            className="h-1 w-24 bg-gradient-to-r from-blue-400 to-purple-500 mb-8 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: "6rem" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Feel free to reach out via any platform below. I'm always open to networking,
            collaboration, or just a friendly chat!
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8  mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {contactLinks.length > 0 ? (
            contactLinks.map((link, i) => (
              <ContactCard
                key={link.name}
                link={link}
                index={i}
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
                handleMouseMove={handleMouseMove}
                handleMouseLeave={handleMouseLeave}
              />
            ))
          ) : (
            <p className="text-left text-gray-600 dark:text-gray-300">No contact information available.</p>
          )}
        </motion.div>

        {/* Call to action */}
        <motion.div
          className="mt-16 text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          
        </motion.div>
      </div>
      <GradientSeparator className="mt-24" />
    </section>
  );
};

export default ContactSection;
