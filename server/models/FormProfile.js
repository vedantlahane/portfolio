const mongoose = require('mongoose');

// Structured Education Entries
const educationEntrySchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  major: { type: String, required: true },
  gpa: { type: String, default: '' },
  startYear: { type: String, required: true },
  graduationYear: { type: String, required: true },
  location: { type: String, default: '' }
});

// Structured Work Experience Entries
const workExperienceEntrySchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, default: 'Present' },
  location: { type: String, default: '' },
  isRemote: { type: Boolean, default: false },
  highlights: { type: [String], default: [] }
});

// Extensible Key-Value facts
const customFieldSchema = new mongoose.Schema({
  key: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: String, required: true },
  category: { type: String, default: 'General' },
  isSensitive: { type: Boolean, default: false }
});

// The core flexible knowledge base
const knowledgeVaultEntrySchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, default: 'General' },
  tags: { type: [String], default: [] },
  content: { type: String, required: true },
  pinned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const formProfileSchema = new mongoose.Schema({
  // Factual Structured Data (Private/Legal Overrides)
  personal: {
    legalFirstName: { type: String, default: 'Vedant' },
    legalLastName: { type: String, default: 'Lahane' },
    preferredName: { type: String, default: 'Vedant' },
    gender: { type: String, default: 'Male' },
    pronouns: { type: String, default: 'he/him' },
    addressLine1: { type: String, default: '' },
    addressLine2: { type: String, default: '' },
    city: { type: String, default: 'Amravati' },
    state: { type: String, default: 'Maharashtra' },
    postalCode: { type: String, default: '444604' },
    country: { type: String, default: 'India' },
    nationality: { type: String, default: 'Indian' },
    citizenship: { type: String, default: 'India' },
    passportNumber: { type: String, default: '' },
    alternatePhone: { type: String, default: '' },
    linkedinUrl: { type: String, default: 'https://linkedin.com/in/vedant-lahane' },
    githubUrl: { type: String, default: 'https://github.com/vedantlahane' },
    portfolioUrl: { type: String, default: 'https://vedantlahane.vercel.app' },
    twitterUrl: { type: String, default: '' }
  },

  // Education Details
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

  // Work History
  workExperience: {
    type: [workExperienceEntrySchema],
    default: []
  },

  // Custom / Arbitrary Key-Value Pairs
  customFields: {
    type: [customFieldSchema],
    default: []
  },

  // Extensible Personal Knowledge Vault (Unconstrained stories, narratives, context)
  knowledgeVault: {
    type: [knowledgeVaultEntrySchema],
    default: [
      {
        id: 'kv_safarsathi',
        title: 'SafarSathi PWA: Offline-First Architecture',
        category: 'Experience',
        tags: ['PWA', 'Offline-First', 'React'],
        content: 'Architected SafarSathi, an offline-first tourist safety Progressive Web App...',
        pinned: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'kv_career',
        title: 'Career Goals & Preferences',
        category: 'Preferences',
        tags: ['Career', 'Compensation', 'Location'],
        content: 'I am looking for a full-stack engineering role. I am open to remote, hybrid, or onsite work. I am legally authorized to work in India and require no sponsorship. My expected compensation is competitive for entry-level SDE roles. I have a 0-day notice period and can start immediately.',
        pinned: true,
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
