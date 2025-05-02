import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import GradientSeparator from "./GradientSeparator";

// --- Project Data ---
const projects = [
  { name: "Blogging Platform" },
  { name: "Hospital Management System" },
  { name: "FundForge (Crowdfunding)" },
  { name: "Forked-Up (Restaurant)" },
  { name: "Quest Search Dashboard" },
  { name: "AI Safety Dashboard" },
  { name: "ShoeMarkNet" }
];

const projectDescriptions = [
  [
    "Engineered a dynamic blogging platform using the MEAN stack.",
    "Implemented robust user authentication and authorization.",
    "Designed and deployed highly efficient APIs for CRUD operations.",
    "Optimized platform functionality for enhanced user engagement."
  ],
  [
    "Comprehensive hospital platform built with Laravel.",
    "Features: patient, doctor, appointment, billing, inventory, and role management.",
    "Admin, doctor, nurse, and receptionist dashboards."
  ],
  [
    "Decentralized crowdfunding platform using MERN stack and blockchain.",
    "Secure smart contract-based funding and transparent transactions.",
    "Empowers users to create and support projects globally."
  ],
  [
    "Full-featured restaurant management and ordering site built with Laravel.",
    "Admin can manage categories, menus, orders, and contact info.",
    "Customers can browse menu, place orders, and make reservations."
  ],
  [
    "Interactive dashboard built with MERN stack.",
    "Advanced search, analytics, and user management features.",
    "Designed for scalability and real-time data insights."
  ],
  [
    "MERN-based dashboard for monitoring AI safety metrics.",
    "Visualizes data, alerts, and compliance status.",
    "Helps teams track AI model risks and operational health."
  ],
  [
    "Secure platform for reselling shoes.",
    "Real-time inventory, advanced filtering, and role-based access.",
    "Built with React.js, Tailwind CSS, Node.js, and MongoDB."
  ]
];

const defaultConsoleLines = [
  "💡 Welcome to my project showcase!",
  "Click any project to view its details.",
  "All projects are built with passion and modern tech."
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
  "bg-[repeating-linear-gradient(-45deg,#73737322_0_2px,transparent_2px_18px)] bg-[size:18px_18px]"
];
const shadeClasses = [
  "bg-blue-50",
  "bg-blue-00",
  "bg-blue-100/10",
  "bg-blue-200",
  "bg-blue-200/20",
  "bg-gredient-to-r from-blue-800 to-purple-800",
  "bg-blue-150"
];

// --- Grid Placement ---
const gridClasses = [
  "col-start-1 col-end-2 row-start-1 row-end-2",
  "col-start-2 col-end-3 row-start-1 row-end-3",
  "col-start-1 col-end-2 row-start-2 row-end-4",
  "col-start-3 col-end-4 row-start-4 row-end-5",
  "col-start-4 col-end-5 row-start-5 row-end-6",
  "col-start-4 col-end-6 row-start-1 row-end-2",
  "col-start-5 col-end-6 row-start-4 row-end-6"
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

  return (
    <section className="w-full mx-auto py-20 px-2">
      <style>{cursorStyles}</style>
      <div className="h-[600px] grid grid-cols-5 grid-rows-5 gap-4 p-4 rounded-xl ">
        {projects.map((proj, i) => (
          <motion.div
            key={i}
            onClick={() => setSelected(i)}
            className={`relative rounded-2xl flex items-center justify-center text-center text-blue-300 font-bold text-lg sm:text-xl shadow-md border border-slate-700/50 hover:border-purple-400/50 cursor-pointer transition-all ${gridClasses[i]} ${patternClasses[i]} ${shadeClasses[i]} ${selected === i ? 'border-purple-400 shadow-lg scale-105 z-20' : ''}`}
            whileHover={{ scale: 1.05 }}
            animate={selected === i ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={{ duration: 1.5, repeat: selected === i ? Infinity : 0 }}
          >
            <span className="px-2">{proj.name}</span>
          </motion.div>
        ))}

        <div className="  rounded-2xl flex  items-center justify-center text-white font-extrabold text-2xl sm:text-3xl tracking-wide shadow-2xl border border-slate-700/50 col-start-1 col-end-3 row-start-4 row-end-6">
         <span>My </span><span className="bg-gradient-to-r from-blue-700 via-pink-400 to-purple-400 bg-clip-text text-transparent">Projects</span>
        </div>

        <div className=" relative rounded-2xl flex flex-col items-start  font-mono shadow-xl p-6 ml-11 border border-slate-700/50 overflow-auto bg-[#181c1f] text-green-400 min-h-0 whitespace-pre-wrap col-start-3 col-end-6 row-start-2 row-end-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="ml-4 text-xs text-slate-400">vedant@portfolio:~$</span>
          </div>
          <div className="text-base sm:text-lg leading-relaxed w-full pl-2">
            <span>
              {displayText}
              {hasCursor && <span className="terminal-cursor">|</span>}
            </span>
          </div>
        </div>
      </div>
      <GradientSeparator/>
    </section>
  );
}
