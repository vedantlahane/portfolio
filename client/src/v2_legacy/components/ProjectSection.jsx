import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GradientSeparator from "./GradientSeparator";
import { ArrowTopRightOnSquareIcon, CodeBracketIcon, CommandLineIcon } from "@heroicons/react/24/outline";

// --- Project Data ---
const projects = [
  {
    name: "Blogging Platform",
    link: "https://github.com/vedantlahane/myblog",
    tech: ["MEAN", "Auth", "APIs"],
  },
  {
    name: "Health Platform",
    link: "https://github.com/vedantlahane/health-platform",
    tech: ["Laravel", "MySQL", "Admin"],
  },
  {
    name: "FundForge",
    link: "https://github.com/vedantlahane/fundforge",
    tech: ["MERN", "Blockchain", "Web3"],
  },
  {
    name: "Forked-Up",
    link: "https://github.com/vedantlahane/forked-up",
    tech: ["Laravel", "Restaurant", "CMS"],
  },
  {
    name: "Quest Dashboard",
    link: "https://github.com/vedantlahane/quest-search-dashboard",
    tech: ["MERN", "Analytics", "Search"],
  },
  {
    name: "AI Safety",
    link: "https://github.com/vedantlahane/ai-safety-dashboard",
    tech: ["MERN", "AI", "Monitoring"],
  },
  {
    name: "ShoeMarkNet",
    link: "https://shoe-mark-net.vercel.app",
    tech: ["React", "Node.js", "MongoDB"],
  },
  {
    name: "More Projects",
    link: "#",
    tech: ["Coming", "Soon", "..."],
  },
  {
    name: "Explore All",
    link: "https://github.com/vedantlahane",
    tech: ["View", "GitHub", "Profile"],
  },
];

const projectDescriptions = [
  [
    "Engineered a dynamic blogging platform using the MEAN stack.",
    "Implemented robust user authentication and authorization.",
    "Designed and deployed highly efficient APIs for CRUD operations.",
    "Optimized platform functionality for enhanced user engagement.",
  ],
  [
    "Comprehensive hospital platform built with Laravel.",
    "Features: patient, doctor, appointment, billing, inventory management.",
    "Role-based dashboards for admin, doctor, nurse, and receptionist.",
  ],
  [
    "Decentralized crowdfunding platform using MERN stack and blockchain.",
    "Secure smart contract-based funding and transparent transactions.",
    "Empowers users to create and support projects globally.",
  ],
  [
    "Full-featured restaurant management and ordering site with Laravel.",
    "Admin can manage categories, menus, orders, and contact info.",
    "Customers can browse menu, place orders, and make reservations.",
  ],
  [
    "Interactive dashboard built with MERN stack.",
    "Advanced search, analytics, and user management features.",
    "Designed for scalability and real-time data insights.",
  ],
  [
    "MERN-based dashboard for monitoring AI safety metrics.",
    "Visualizes data, alerts, and compliance status.",
    "Helps teams track AI model risks and operational health.",
  ],
  [
    "Secure platform for reselling shoes.",
    "Real-time inventory, advanced filtering, and role-based access.",
    "Built with React.js, Tailwind CSS, Node.js, and MongoDB.",
  ],
  [
    "More exciting projects are in development.",
    "Stay tuned for updates on new technologies and innovations.",
    "Always exploring and building with cutting-edge tech.",
  ],
  [
    "Visit my GitHub profile to explore all projects.",
    "Open to collaboration and contributions.",
    "Let's build something amazing together!",
  ],
];

const defaultConsoleLines = [
  "Welcome to my project showcase!",
  "Click any project to view its details.",
  "All projects are built with passion and modern tech.",
];

// --- Typing Animation Hook ---
function useTypedText(lines, speed = 20, deps = []) {
  const [displayed, setDisplayed] = useState("");
  const timeoutRef = useRef();

  useEffect(() => {
    setDisplayed("");
    let i = 0, j = 0, output = "";
    function type() {
      if (i < lines.length) {
        if (j < lines[i].length) {
          output += lines[i][j++];
          setDisplayed(output + "|");
          timeoutRef.current = setTimeout(type, speed);
        } else {
          output += "\n";
          setDisplayed(output + "|");
          i++;
          j = 0;
          timeoutRef.current = setTimeout(type, speed * 8);
        }
      } else {
        setDisplayed(output);
      }
    }
    type();
    return () => clearTimeout(timeoutRef.current);
  }, deps);

  return displayed;
}

// --- Blinking Cursor CSS ---
const cursorStyles = `
@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
.terminal-cursor { display: inline-block; width: 1ch; color: #60a5fa; animation: blink 1s step-end infinite; }
`;

export default function ProjectGrid() {
  const [selected, setSelected] = useState(null);
  const displayed = useTypedText(
    selected === null ? defaultConsoleLines : projectDescriptions[selected],
    20,
    [selected]
  );

  const hasCursor = displayed.endsWith("|");
  const displayText = hasCursor ? displayed.slice(0, -1) : displayed;
  const selectedProject = selected !== null ? projects[selected] : null;

  return (
    <section className="w-full mx-auto py-20 px-2">
      <style>{cursorStyles}</style>
      
      {/* Section Header */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-5xl md:text-7xl font-bold mb-4">
          <span className="text-gray-300">Featured </span>
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Projects
          </span>
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Click on any project to explore the details and tech stack
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Terminal */}
          <motion.div 
            className="relative h-[500px] rounded-2xl shadow-2xl border border-gray-800/50 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Terminal header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900/90 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <CommandLineIcon className="w-4 h-4" />
                <span className="font-mono">vedant@portfolio:~$</span>
              </div>
            </div>
            
            {/* Terminal body */}
            <div className="p-6 font-mono text-sm md:text-base overflow-auto h-[calc(100%-48px)]">
              {selectedProject && (
                <motion.div 
                  className="mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <span className="text-gray-500">$</span>
                    <span>project --info "{selectedProject.name}"</span>
                  </div>
                  <div className="pl-4 text-gray-300">
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-2"
                    >
                      <span className="text-gray-500">→</span>
                      {selectedProject.link}
                      <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    </a>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                      <CodeBracketIcon className="w-4 h-4" />
                      {selectedProject.tech.join(" • ")}
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="space-y-2">
                {(displayText || "").split("\n").map((line, idx) =>
                  line ? (
                    <div key={idx} className="flex items-start text-gray-300">
                      <span className="text-blue-400 mr-2 select-none">$</span>
                      <span>{line}</span>
                    </div>
                  ) : (
                    <br key={idx} />
                  )
                )}
                {hasCursor && <span className="terminal-cursor">|</span>}
              </div>
            </div>
          </motion.div>

          {/* Project Grid */}
          <div className="grid grid-cols-3 gap-4 auto-rows-fr">
            {projects.map((project, i) => (
              <motion.div
                key={i}
                onClick={() => setSelected(i)}
                className={`relative p-6 rounded-xl border cursor-pointer transition-all ${
                  selected === i
                    ? "border-purple-500 bg-purple-500/10 scale-105 shadow-lg shadow-purple-500/20"
                    : "border-gray-800 hover:border-blue-500 hover:bg-gray-800/50"
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className={`text-sm font-bold mb-2 ${
                  selected === i ? "text-purple-400" : "text-blue-400"
                }`}>
                  {project.name}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {project.tech.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 rounded-full bg-gray-800/50 text-gray-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <GradientSeparator />
    </section>
  );
}