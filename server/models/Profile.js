const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }
});

const featuredSkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, required: true }
});

const profileSchema = new mongoose.Schema({
  // Me1 (Hero part 1)
  greeting: { type: String, default: 'Hello' },
  name: { type: String, default: 'Vedant Lahane' },
  roles: { type: [String], default: ['learner', 'creator', 'developer', 'student'] },
  heroDescription: { type: String, default: 'Computer Science student exploring the endless possibilities of technology. Currently diving deep into web development, algorithms, and system design. Building projects that challenge me to grow.' },
  cvLink: { type: String, default: 'https://drive.google.com/file/d/1FF5VZ9P8ddZVfaUemFyWcIDwSeRO21WO/view?usp=sharing' },
  statusIndicators: { type: [String], default: ['Open to internships', 'Learning daily', 'Project enthusiast'] },
  
  // Me2 (Hero part 2)
  experiences: { 
    type: [experienceSchema], 
    default: [
      { label: "Flagship Projects", value: "3+" },
      { label: "DSA Problems", value: "350+" },
      { label: "Certifications", value: "10+" },
      { label: "Known Technologies", value: "15+" }
    ]
  },
  featuredSkills: { 
    type: [featuredSkillSchema], 
    default: [
      { name: "React + TypeScript", level: 85 },
      { name: "Node.js + Express", level: 82 },
      { name: "Java (Backend/DSA)", level: 82 },
      { name: "AI/LLM (RAG, LangChain)", level: 78 },
      { name: "Cloud & DevOps (AWS, Docker, CI/CD)", level: 75 },
      { name: "Databases (MongoDB, MySQL)", level: 72 }
    ]
  },
  me2StatusLabels: { 
    type: [String], 
    default: ['Building', 'RAG, RBAC', 'Open to SDE/AI Intern'] 
  },

  // About
  aboutSubhead: { type: String, default: 'Driven by curiosity. Defined by execution.' },
  aboutText: { type: String, default: 'Started with a "Hello World" three years ago. Now building AI‑powered, scalable web apps with real‑world constraints. Currently building SafarSathi (offline‑first safety PWA) and Axon (RAG document intelligence). Shipped ShoeMarkNet (RBAC e‑commerce) end‑to‑end. Solved over 350+ DSA problems and keep refining system design basics. Core stack: React + TypeScript, Node.js, Java with MongoDB/MySQL. Learning Cloud & DevOps (AWS, Docker, CI/CD) and deepening LLM/RAG systems.' },
  highlightKeywords: { 
    type: [String], 
    default: ["scalable", "AI‑powered,", "SafarSathi", "Axon", "ShoeMarkNet", "350+", "DSA", "React", "TypeScript,", "Node.js,", "Java", "Cloud", "&", "DevOps", "(AWS,", "Docker,", "CI/CD)", "LLM/RAG"] 
  },
  
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profile', profileSchema);
