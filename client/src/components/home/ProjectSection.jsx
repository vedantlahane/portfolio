import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import GradientSeparator from "./GradientSeparator";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

// --- Project Data ---
const projects = [
  {
    name: "Blogging Platform",
    link: "https://github.com/vedantlahane/myblog",
  },
  {
    name: "Health Platform",
    link: "https://github.com/vedantlahane/health-platform",
  },
  {
    name: "FundForge (Crowdfunding)",
    link: "https://github.com/vedantlahane/fundforge",
  },
  {
    name: "Forked-Up (Restaurant)",
    link: "https://github.com/vedantlahane/forked-up",
  },
  {
    name: "Quest Search Dashboard",
    link: "https://github.com/vedantlahane/quest-search-dashboard",
  },
  {
    name: "AI Safety Dashboard",
    link: "https://github.com/vedantlahane/ai-safety-dashboard",
  },
  {
    name: "ShoeMarkNet",
    link: "https://shoe-mark-net.vercel.app",
  },
  {
    name: "This is a trap!",
    link: "Don't Click Here",
  },
  {
    name: "Click any project to view its details.",
    link: "Don't Click Here",
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
    "Features: patient, doctor, appointment, billing, inventory, and role management.",
    "Admin, doctor, nurse, and receptionist dashboards.",
  ],
  [
    "Decentralized crowdfunding platform using MERN stack and blockchain.",
    "Secure smart contract-based funding and transparent transactions.",
    "Empowers users to create and support projects globally.",
  ],
  [
    "Full-featured restaurant management and ordering site built with Laravel.",
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
    "Don't Click Here",
    "This is a trap!",
    "You have been warned!",
    "Clicking here will lead to a surprise!",
  ],
  [
    "Click any project to view its details.",
    "All projects are built with passion and modern tech.",
    "Explore my work and connect with me.",
  ],
];

const defaultConsoleLines = [
  "Welcome to my project showcase!",
  "Click any project to view its details.",
  "All projects are built with passion and modern tech.",
];

// --- Typing Animation Hook ---
function useTypedText(lines, speed = 18, deps = []) {
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

// --- Pattern & Shade Classes for Tiles ---
const patternClasses = [
  "bg-[linear-gradient(to_right,#73737322_1px,transparent_1px),linear-gradient(to_bottom,#73737322_1px,transparent_1px)] bg-[size:20px_20px]",
  "bg-[radial-gradient(circle,#73737333_1.5px,transparent_1.5px)] bg-[size:14px_14px]",
  "bg-[repeating-linear-gradient(45deg,#73737322_0_2px,transparent_2px_20px)] bg-[size:20px_20px]",
  "bg-[repeating-linear-gradient(to_bottom,#73737322_0_2px,transparent_2px_16px)] bg-[size:100%_18px]",
  "bg-[linear-gradient(to_right,#73737322_1px,transparent_1px),linear-gradient(to_bottom,#73737322_1px,transparent_1px)] bg-[size:30px_30px]",
  "bg-[radial-gradient(circle,#73737344_2px,transparent_2px)] bg-[size:22px_22px]",
  "bg-[repeating-linear-gradient(-45deg,#73737322_0_2px,transparent_2px_18px)] bg-[size:18px_18px]",
  "bg-[repeating-linear-gradient(135deg,#73737322_0_2px,transparent_2px_20px)] bg-[size:20px_20px]",
  "bg-[linear-gradient(to_right,#73737322_1px,transparent_1px),linear-gradient(to_bottom,#73737322_1px,transparent_1px)] bg-[size:20px_20px]",
];
const shadeClasses = [
  "bg-blue-50",
  "bg-blue-100/10",
  "bg-blue-100/10",
  "bg-blue-50",
  "bg-blue-100/10",
  "bg-blue-100/10",
  "bg-blue-100/10",
  "bg-blue-100/20",
  "bg-blue-100/10",
];

// --- Grid Placement ---
const gridClasses = [
  "col-start-1 col-end-2 row-start-1 row-end-2",
  "col-start-2 col-end-3 row-start-1 row-end-3",
  "col-start-1 col-end-2 row-start-2 row-end-4",
  "col-start-3 col-end-4 row-start-5 row-end-6",
  "col-start-4 col-end-5 row-start-6 row-end-7",
  "col-start-4 col-end-6 row-start-1 row-end-2",
  "col-start-5 col-end-6 row-start-5 row-end-7",
  "col-start-1 col-end-2 row-start-6 row-end-7",
  "col-start-2 col-end-4 row-start-6 row-end-7",
];

// --- Blinking Cursor CSS ---
const cursorStyles = `
@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
.terminal-cursor { display: inline-block; width: 1ch; color: #22d3ee; animation: blink 1s step-end infinite; }
`;

export default function ProjectGrid() {
  const [selected, setSelected] = useState(null);
  const displayed = useTypedText(
    selected === null ? defaultConsoleLines : projectDescriptions[selected],
    18,
    [selected]
  );

  const hasCursor = displayed.endsWith("|");
  const displayText = hasCursor ? displayed.slice(0, -1) : displayed;
  const selectedLink = selected !== null ? projects[selected].link : null;

  return (
    <section className="w-full mx-auto py-20 px-2">
      <style>{cursorStyles}</style>
      <div className="h-[720px] grid grid-cols-5 grid-rows-6 gap-4 p-4 rounded-xl">
        <div className="relative col-start-3 col-end-6 row-start-2  row-end-5 opacity-70 rounded-2xl shadow-2xl border border-slate-700/70 overflow-auto bg-gradient-to-br from-[#394249] via-[#191d20] to-[#0e1013] text-[#cbd5e1] min-h-0 font-mono">
          {/* Terminal header */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#23272b] rounded-t-2xl border-b border-slate-700">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="ml-4 text-xs text-slate-400 select-none">vedant@portfolio:~$projects</span>
          </div>
          {/* Terminal body */}
          <div className="p-4 pt-3 text-base leading-relaxed w-full whitespace-pre-wrap">
            {selectedLink && (
              <div className="flex items-start">
                <span className="text-sky-400 mr-2 select-none">$</span>
                <a
                  href={selectedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold hover:underline flex items-center"
                >
                  {selectedLink}
                  <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1 inline" />
                </a>
              </div>
            )}

            {(displayText || "").split("\n").map((line, idx) =>
              line ? (
                <div key={idx} className="flex items-start">
                  <span className="text-sky-400 mr-2 select-none">$</span>
                  <span>{line}</span>
                </div>
              ) : (
                <br key={idx} />
              )
            )}

            {hasCursor && !selectedLink && <span className="terminal-cursor">|</span>}
          </div>
        </div>

        {projects.map((proj, i) => (
          <motion.div
            key={i}
            onClick={() => setSelected(i)}
            aria-selected={selected === i}
            tabIndex={0}
            className={`relative rounded-2xl flex items-center justify-center text-center text-blue-300 font-bold text-lg sm:text-xl shadow-md border border-slate-700/50 hover:border-purple-400/50 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-purple-400 ${
              gridClasses[i]
            } ${patternClasses[i]} ${shadeClasses[i]} ${
              selected === i
                ? "border-purple-400 shadow-lg scale-105 z-20 ring-2 ring-purple-400"
                : ""
            }`}
            whileHover={{ scale: 1.05 }}
            animate={selected === i ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={{
              duration: 1.5,
              repeat: selected === i ? Infinity : 0,
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setSelected(i);
            }}
          >
            <span className="px-2">{proj.name}</span>
          </motion.div>
        ))}

        <div className="rounded-2xl flex items-center justify-center font-semibold sm:text-6xl tracking-wide shadow-2xl border border-slate-700/50 col-start-1 col-end-3 row-start-4 row-end-6  bg-gradient-to-r from-blue-700 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
          <span className="bg-gradient-to-r from-slate-700  to-blue-200 bg-clip-text text-transparent">My </span>
          <span className="ml-2 bg-gradient-to-r from-blue-700 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Projects
          </span>
        </div>
      </div>
      <GradientSeparator />
    </section>
  );
}
