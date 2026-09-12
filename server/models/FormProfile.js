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

const customFieldSchema = new mongoose.Schema({
  key: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: String, default: '' },
  category: { type: String, default: 'General' }
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
