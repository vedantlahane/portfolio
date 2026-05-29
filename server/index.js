// Import required dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
// Try loading from root folder or local folder
require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("dotenv").config();

// Import route handlers
const testRoutes = require("./routes/testRoutes");
const contactRoutes = require('./routes/contactRoutes');
const blogRoutes = require('./routes/blogRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const projectRoutes = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes');

// Initialize express application
const app = express();

// Environment Variables
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGO_DB || process.env.MONGODB_URI;

/**
 * CORS Configuration
 * Configures Cross-Origin Resource Sharing for the API
 * Specifies which domains can access the API
 */
const corsOptions = {
  origin: [
    "http://localhost:5173",    // Local development
    "http://127.0.0.1:5173",    // Alternative localhost
    "https://vedantlahane.vercel.app"  // Production domain
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply middleware
app.use(cors(corsOptions));
app.use(express.json());  // Parse JSON bodies

/**
 * Seeding Helper
 * Seeds default data into MongoDB if collections are empty
 */
const seedDatabase = async () => {
  try {
    const Admin = require('./models/Admin');
    const Profile = require('./models/Profile');
    const Project = require('./models/Project');
    const SkillCategory = require('./models/SkillCategory');
    const bcrypt = require('bcryptjs');

    // 1. Seed Admin
    const email = process.env.ADMIN_EMAIL || 'vedantanillahane@gmail.com';
    const password = process.env.ADMIN_PASSWORD || 'Val%9420';
    
    const adminExists = await Admin.findOne({ email });
    if (!adminExists) {
      // Clear other admin accounts for safety
      await Admin.deleteMany({});
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({
        email,
        password: hashedPassword,
        username: 'admin'
      });
      await newAdmin.save();
      console.log('✅ Admin seeded successfully:', email);
    }

    // 2. Seed Profile
    const profileCount = await Profile.countDocuments();
    if (profileCount === 0) {
      const defaultProfile = new Profile();
      await defaultProfile.save();
      console.log('✅ Default Profile seeded successfully');
    }

    // 3. Seed Projects
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      const staticProjects = [
        {
          title: 'SafarSathi — Tourist Safety Platform',
          year: '2025',
          description: 'Offline-first safety PWA with interactive Leaflet maps, geo-fenced risk zones with live alerts, admin console, and intelligent SOS with automatic location sharing.',
          tech: 'React • PWA • Leaflet • Spring Boot • MySQL',
          type: 'PWA / Safety Platform',
          featured: true,
          github: 'https://github.com/vedantlahane/SafarSathi',
          live: null,
          order: 0
        },
        {
          title: 'Axon — AI-Powered Document Intelligence',
          year: '2025',
          description: 'Conversational agent for PDFs/CSVs/SQL using LangChain/LangGraph with hybrid retrieval (FAISS + web search), streaming responses, and persistent memory.',
          tech: 'Django • React • TypeScript • LangChain • LangGraph • FAISS • OpenAI API',
          type: 'AI / LLM',
          featured: true,
          github: 'https://github.com/vedantlahane/Axon',
          live: null,
          order: 1
        },
        {
          title: 'ShoeMarkNet — Full-Stack E‑Commerce',
          year: '2024–2025',
          description: 'JWT auth with RBAC, AI-powered lead scoring, and Redux Toolkit architecture with optimistic updates and centralized error handling.',
          tech: 'React • Redux Toolkit • Node.js • Express • MongoDB • JWT • Tailwind CSS',
          type: 'E‑Commerce',
          featured: true,
          github: 'https://github.com/vedantlahane/ShoeMarkNet',
          live: 'https://shoe-mark-net.vercel.app',
          order: 2
        },
        {
          title: 'FundForge — Decentralized Crowdfunding',
          year: '2025',
          description: 'Milestone-based fund releases for campaigns on Ethereum with a modern TypeScript React frontend.',
          tech: 'React • TypeScript • Solidity',
          type: 'Web3',
          featured: false,
          github: 'https://github.com/vedantlahane/fundforge',
          live: 'https://fundforge-two.vercel.app',
          order: 3
        },
        {
          title: 'myblog — MEAN Blogging Platform',
          year: '2024–2025',
          description: 'Full-stack blog with authoring and publishing, built with Angular and Express.',
          tech: 'Angular • Express • TypeScript • MongoDB',
          type: 'Full Stack',
          featured: false,
          github: 'https://github.com/vedantlahane/myblog',
          live: null,
          order: 4
        },
        {
          title: 'Portfolio',
          year: '2025',
          description: 'Personal portfolio and interactive landing site.',
          tech: 'React • Tailwind • Vercel',
          type: 'Frontend',
          featured: false,
          github: 'https://github.com/vedantlahane/portfolio',
          live: 'https://vedantlahane.vercel.app',
          order: 5
        },
        {
          title: 'ShoeMarkNet Docker & Deploy',
          year: '2025',
          description: 'Docker/Compose setup and deployment tooling for ShoeMarkNet.',
          tech: 'Docker • Compose • Shell',
          type: 'DevOps',
          featured: false,
          github: 'https://github.com/vedantlahane/shoemarknetdocker',
          live: null,
          order: 6
        }
      ];
      await Project.insertMany(staticProjects);
      console.log('✅ Default Projects seeded successfully');
    }

    // 4. Seed Skills
    const skillCount = await SkillCategory.countDocuments();
    if (skillCount === 0) {
      const defaultCategories = [
        {
          key: 'languages',
          title: 'Languages',
          skills: ["Java", "JavaScript", "TypeScript", "C++", "C", "PHP", "SQL", "HTML", "CSS"],
          order: 0
        },
        {
          key: 'frameworks',
          title: 'Frameworks & Libraries',
          skills: ["React.js", "Node.js", "Express.js", "Angular", "Redux", "Laravel", "Shadcn", "Tailwind CSS"],
          order: 1
        },
        {
          key: 'tools',
          title: 'Development Tools',
          skills: ["Vite", "Git", "GitHub", "Postman", "Docker", "Docker Compose", "Jenkins"],
          order: 2
        },
        {
          key: 'cloud',
          title: 'AI & Cloud Services',
          skills: ["OpenAI API", "Gemini API", "v0.dev", "Vercel", "AWS", "Render", "Lighthouse"],
          order: 3
        },
        {
          key: 'databases',
          title: 'Databases & Systems',
          skills: ["MongoDB", "MySQL", "Linux"],
          order: 4
        },
        {
          key: 'soft',
          title: 'Soft Skills',
          skills: ["Problem-solving", "Teamwork", "Adaptability", "Creativity"],
          order: 5
        }
      ];
      await SkillCategory.insertMany(defaultCategories);
      console.log('✅ Default Skill Categories seeded successfully');
    }
  } catch (error) {
    console.error('❌ Database Seeding Error:', error.message);
  }
};

/**
 * Database Connection
 * Establishes connection to MongoDB using mongoose
 * Exits process if connection fails
 */
const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGO_DB or MONGODB_URI environment variable is missing.');
    }
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
    await seedDatabase();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Initialize database connection
connectDB();

/**
 * Route Definitions
 * Define all API endpoints and their corresponding route handlers
 */

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the Portfolio API",
    timestamp: new Date()
  });
});

// API Routes
app.use("/api/test", testRoutes);          // Test endpoints
app.use('/api/blogs', blogRoutes);    // Blog-related endpoints
app.use('/api/contact', contactRoutes); // Contact form endpoints
app.use('/api/auth', authRoutes);      // Admin authentication
app.use('/api/profile', profileRoutes);  // Profile details
app.use('/api/projects', projectRoutes); // Projects
app.use('/api/skills', skillRoutes);    // Skills

/**
 * Error Handling Middleware
 * Catches any errors that weren't handled in the routes
 */
app.use((err, req, res, next) => {
  console.error('🔴 Error:', err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Handle 404 - Route not found
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found"
  });
});

/**
 * Server Initialization
 * Starts the server on specified port
 */
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

module.exports = app;