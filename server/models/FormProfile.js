const mongoose = require('mongoose');

const educationEntrySchema = new mongoose.Schema({
  institution: { type: String, default: '' },
  degree: { type: String, default: 'Bachelor of Technology' },
  major: { type: String, default: 'Computer Science & Engineering' },
  gpa: { type: String, default: '' },
  startYear: { type: String, default: '' },
  graduationYear: { type: String, default: '2026' },
  location: { type: String, default: 'India' }
});

const workExperienceEntrySchema = new mongoose.Schema({
  company: { type: String, default: '' },
  title: { type: String, default: '' },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: 'Present' },
  isCurrent: { type: Boolean, default: true },
  description: { type: String, default: '' }
});

const knowledgeVaultEntrySchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: [
      'Experience & Stories',
      'Technical Depth',
      'Career Goals',
      'Work Style & Values',
      'Project Context',
      'DSA & Problem Solving',
      'Custom Attributes',
      'General'
    ],
    default: 'Experience & Stories'
  },
  tags: { type: [String], default: [] },
  content: { type: String, required: true },
  pinned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const customFieldSchema = new mongoose.Schema({
  key: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: String, default: '' },
  category: { type: String, default: 'General' },
  description: { type: String, default: '' }
});

const formProfileSchema = new mongoose.Schema({
  adminId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin', 
    required: true, 
    unique: true 
  },

  // Contact & Personal Details (Private)
  personal: {
    legalFirstName: { type: String, default: 'Vedant' },
    legalLastName: { type: String, default: 'Lahane' },
    preferredName: { type: String, default: 'Vedant' },
    gender: { type: String, default: '' },
    pronouns: { type: String, default: 'he/him' },
    addressLine1: { type: String, default: '' },
    addressLine2: { type: String, default: '' },
    city: { type: String, default: 'Amravati' },
    state: { type: String, default: 'Maharashtra' },
    country: { type: String, default: 'India' },
    postalCode: { type: String, default: '' },
    nationality: { type: String, default: 'Indian' },
    citizenship: { type: String, default: 'India' },
    passportNumber: { type: String, default: '' },
    alternatePhone: { type: String, default: '' }
  },

  // Education Details (Structured for recruitment forms)
  education: {
    type: [educationEntrySchema],
    default: [
      {
        institution: 'Government College of Engineering, Amravati',
        degree: 'Bachelor of Technology',
        major: 'Computer Science & Engineering',
        gpa: '',
        startYear: '2022',
        graduationYear: '2026',
        location: 'Amravati, Maharashtra, India'
      }
    ]
  },

  // Work History (Structured for job applications)
  workExperience: {
    type: [workExperienceEntrySchema],
    default: []
  },

  // Compensation & Availability
  compensation: {
    currentSalary: { type: String, default: '' },
    expectedSalary: { type: String, default: '' },
    currency: { type: String, default: 'INR' },
    noticePeriodDays: { type: String, default: '0 (Immediate)' },
    earliestStartDate: { type: String, default: 'Immediately' }
  },

  // Work Authorization & Relocation Preferences
  workAuthorization: {
    authorizedInCountryOfRole: { type: Boolean, default: true },
    requiresSponsorshipNow: { type: Boolean, default: false },
    requiresSponsorshipFuture: { type: Boolean, default: false },
    willingToRelocate: { type: Boolean, default: true },
    workModePreference: { type: String, default: 'Flexible (Remote/Hybrid/Onsite)' }
  },

  // Behavioral & Narrative Answer Vault
  statements: {
    professionalSummary: { 
      type: String, 
      default: 'Passionate Computer Science student and software developer with expertise in React, TypeScript, Node.js, and Java. Proven record of building scalable web apps (SafarSathi, Axon RAG system, ShoeMarkNet) and solving 350+ DSA algorithmic problems. Enthusiastic about creating high-impact software.' 
    },
    whyOurCompanyTemplate: { 
      type: String, 
      default: 'I am drawn to your team because of your commitment to engineering excellence and high-impact innovation. My strong foundation in full-stack architecture, performance optimization, and problem-solving allows me to contribute meaningfully from day one while rapidly mastering your domain.' 
    },
    proudestProjectDescription: { 
      type: String, 
      default: 'Built Axon, a RAG document intelligence platform utilizing LangChain, vector embeddings, and LLMs to query unstructured technical documents with sub-second retrieval accuracy and strict source citations.' 
    },
    greatestTechnicalAchievement: { 
      type: String, 
      default: 'Architected SafarSathi, an offline-first safety PWA with client-side geographic caching and emergency dispatch triggers that function reliably even under unstable network conditions.' 
    }
  },

  // Custom / Arbitrary Key-Value Pairs
  customFields: {
    type: [customFieldSchema],
    default: [
      { key: 'veteran_status', label: 'Veteran Status', value: 'No', category: 'Legal' },
      { key: 'disability_status', label: 'Disability Status', value: 'No', category: 'Legal' },
      { key: 'referral_source', label: 'How did you hear about us?', value: 'Company Website / LinkedIn', category: 'Application' }
    ]
  },

  // Extensible Personal Knowledge Vault (Unconstrained stories, narratives, context)
  knowledgeVault: {
    type: [knowledgeVaultEntrySchema],
    default: [
      {
        id: 'kv_safarsathi',
        title: 'SafarSathi PWA: Offline-First Architecture & Emergency Dispatch',
        category: 'Project Context',
        tags: ['PWA', 'Offline-First', 'IndexedDB', 'Geolocation', 'React'],
        content: 'Architected SafarSathi, an offline-first tourist safety Progressive Web App designed to protect travelers in low-connectivity areas. Implemented client-side geographic caching using IndexedDB and Service Workers, allowing instant panic alerts and localized resource lookups even without active cellular coverage. Integrated background synchronization to queue and auto-dispatch location telemetry once network connectivity restores.',
        pinned: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'kv_axon',
        title: 'Axon: RAG Document Intelligence with LangChain & Vector Embeddings',
        category: 'Technical Depth',
        tags: ['AI/ML', 'RAG', 'Vector DB', 'LangChain', 'Python', 'FastAPI'],
        content: 'Engineered Axon, an enterprise Retrieval-Augmented Generation platform enabling natural language queries over proprietary PDF and doc repositories. Implemented chunking strategies with recursive character text splitters, semantic vector indexing with cosine similarity search, and prompt grounding to eliminate hallucination. Achieved sub-second response times with verifiable source citations.',
        pinned: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'kv_dsa',
        title: 'Algorithmic Discipline: 350+ DSA Problems Solved & Optimization',
        category: 'DSA & Problem Solving',
        tags: ['DSA', 'LeetCode', 'Algorithms', 'Data Structures', 'Java', 'C++'],
        content: 'Consistently solved over 350 algorithmic problems on LeetCode and competitive programming platforms, focusing on Graph theory, Dynamic Programming, Tree traversals, and Two-Pointer sliding windows. This foundation enables me to write high-performance, memory-conscious code, optimize database queries, and quickly diagnose asymptotic bottlenecks in production systems.',
        pinned: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'kv_career',
        title: 'Career Goals: Scalable Systems & High-Impact Product Engineering',
        category: 'Career Goals',
        tags: ['Career', 'Full Stack', 'Cloud Architecture', 'Mentorship'],
        content: 'My objective is to join a forward-thinking engineering team where I can design high-throughput web architectures, build resilient distributed services, and integrate modern AI capabilities. I thrive in environments with rigorous code reviews, continuous deployment, and high ownership from concept to production.',
        pinned: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'kv_collaboration',
        title: 'Working Style: Bias for Action, Clear Communication & Empathy',
        category: 'Work Style & Values',
        tags: ['Collaboration', 'Agile', 'Ownership', 'Product Mindset'],
        content: 'I approach software engineering with a strong bias for action and empathetic communication. When facing ambiguous technical requirements, I build minimal working prototypes, benchmark edge cases, and align with teammates early. I take end-to-end responsibility for features, ensuring thorough testing, clear documentation, and seamless UI/UX.',
        pinned: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },

  // LLM Configuration & Custom Instructions
  aiSettings: {
    defaultProvider: { 
      type: String, 
      enum: ['groq', 'gemini'], 
      default: 'groq' 
    },
    groqModel: { 
      type: String, 
      default: 'qwen/qwen3.8-27b' 
    },
    geminiModel: { 
      type: String, 
      default: 'gemini-3.6-flash' 
    },
    systemPrompt: { 
      type: String, 
      default: 'You are an intelligent recruitment assistant representing Vedant Lahane. Draft honest, concise, persuasive, and technically grounded answers using Vedant\'s real projects, achievements, and knowledge base.' 
    }
  },

  // Dedicated Persistent API Key for Extension Pairing
  extensionApiKey: { 
    type: String, 
    default: () => 'pf_ext_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  },

  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('FormProfile', formProfileSchema);
