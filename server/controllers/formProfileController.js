const FormProfile = require('../models/FormProfile');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const SkillCategory = require('../models/SkillCategory');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Helper to authenticate via JWT header or Extension API Key
const resolveAuth = async (req) => {
  // 1. Check Bearer JWT Token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_123456');
      const admin = await Admin.findById(decoded.id).select('-password');
      if (admin) return { admin, mode: 'jwt' };
    } catch (e) {
      // ignore, try extension key
    }
  }

  // 2. Check Extension API Key Header
  const apiKey = req.headers['x-extension-key'] || req.query.apiKey;
  if (apiKey) {
    const formProfile = await FormProfile.findOne({ extensionApiKey: apiKey });
    if (formProfile) {
      const admin = await Admin.findById(formProfile.adminId).select('-password');
      if (admin) return { admin, formProfile, mode: 'apiKey' };
    }
  }

  return null;
};

// Middleware wrapper for routes
exports.protectFormProfile = async (req, res, next) => {
  const auth = await resolveAuth(req);
  if (!auth) {
    return res.status(401).json({ message: 'Not authorized. Valid Admin JWT or X-Extension-Key required.' });
  }
  req.admin = auth.admin;
  req.formProfile = auth.formProfile;
  next();
};

// Builds a flat lookup dictionary for fast matching in extension
const buildLookupDictionary = (publicProfile, formProfile, projects, skills) => {
  const p = publicProfile || {};
  const fp = formProfile || {};
  const personal = fp.personal || {};
  const edu = (fp.education && fp.education[0]) || {};
  const comp = fp.compensation || {};
  const auth = fp.workAuthorization || {};
  const statements = fp.statements || {};

  const nameParts = (personal.preferredName || p.name || 'Vedant Lahane').trim().split(' ');
  const firstName = personal.legalFirstName || nameParts[0] || 'Vedant';
  const lastName = personal.legalLastName || nameParts.slice(1).join(' ') || 'Lahane';
  const fullName = personal.preferredName || p.name || `${firstName} ${lastName}`;

  // Flat dictionary with high-value keys
  const dict = {
    // Identity & Contact
    fullName,
    firstName,
    lastName,
    preferredName: personal.preferredName || firstName,
    email: p.email || 'vedantanillahane@gmail.com',
    phone: p.phone || '+91 7447335096',
    alternatePhone: personal.alternatePhone || '',
    gender: personal.gender || '',
    pronouns: personal.pronouns || 'he/him',

    // Address
    addressLine1: personal.addressLine1 || '',
    addressLine2: personal.addressLine2 || '',
    city: personal.city || 'Amravati',
    state: personal.state || 'Maharashtra',
    country: personal.country || 'India',
    postalCode: personal.postalCode || '',
    nationality: personal.nationality || 'Indian',
    citizenship: personal.citizenship || 'India',
    passportNumber: personal.passportNumber || '',

    // Social Links
    linkedin: 'https://linkedin.com/in/vedant-lahane',
    linkedinUrl: 'https://linkedin.com/in/vedant-lahane',
    linkedinProfile: 'https://linkedin.com/in/vedant-lahane',
    github: 'https://github.com/vedantlahane',
    githubUrl: 'https://github.com/vedantlahane',
    githubProfile: 'https://github.com/vedantlahane',
    twitter: 'https://twitter.com/vedantlahane',
    twitterUrl: 'https://twitter.com/vedantlahane',
    leetcode: 'https://leetcode.com/u/vedantlahane',
    leetcodeUrl: 'https://leetcode.com/u/vedantlahane',
    portfolio: 'https://vedantlahane.vercel.app',
    portfolioUrl: 'https://vedantlahane.vercel.app',
    website: 'https://vedantlahane.vercel.app',
    websiteUrl: 'https://vedantlahane.vercel.app',
    cvLink: p.cvLink || '',

    // Education
    institution: edu.institution || 'Government College of Engineering, Amravati',
    university: edu.institution || 'Government College of Engineering, Amravati',
    college: edu.institution || 'Government College of Engineering, Amravati',
    degree: edu.degree || 'Bachelor of Technology',
    major: edu.major || 'Computer Science & Engineering',
    fieldOfStudy: edu.major || 'Computer Science & Engineering',
    gpa: edu.gpa || '',
    graduationYear: edu.graduationYear || '2026',
    startYear: edu.startYear || '2022',
    educationLocation: edu.location || 'Amravati, Maharashtra, India',

    // Compensation & Availability
    currentSalary: comp.currentSalary || '',
    expectedSalary: comp.expectedSalary || '',
    salaryCurrency: comp.currency || 'INR',
    noticePeriod: comp.noticePeriodDays || '0 (Immediate)',
    earliestStartDate: comp.earliestStartDate || 'Immediately',

    // Work Authorization
    authorizedInCountry: auth.authorizedInCountryOfRole !== false ? 'Yes' : 'No',
    requiresSponsorshipNow: auth.requiresSponsorshipNow ? 'Yes' : 'No',
    requiresSponsorshipFuture: auth.requiresSponsorshipFuture ? 'Yes' : 'No',
    willingToRelocate: auth.willingToRelocate !== false ? 'Yes' : 'No',
    workModePreference: auth.workModePreference || 'Flexible',

    // Skills & Highlights
    skillsSummary: skills.flatMap(s => s.skills).join(', '),
    featuredSkills: (p.featuredSkills || []).map(s => s.name).join(', '),
    roles: (p.roles || []).join(', '),

    // Narrative Vault
    professionalSummary: statements.professionalSummary || p.heroDescription || '',
    whyOurCompany: statements.whyOurCompanyTemplate || '',
    proudestProject: statements.proudestProjectDescription || '',
    technicalAchievement: statements.greatestTechnicalAchievement || ''
  };

  // Merge custom fields
  if (Array.isArray(fp.customFields)) {
    fp.customFields.forEach(cf => {
      if (cf.key && cf.value) {
        dict[cf.key] = cf.value;
      }
    });
  }

  return dict;
};

// @desc    Get synthesized Form Profile (Public + Private merged)
// @route   GET /api/form-profile
// @access  Private (JWT or Extension API Key)
exports.getFormProfile = async (req, res) => {
  try {
    const admin = req.admin;

    // 1. Fetch or create FormProfile
    let formProfile = await FormProfile.findOne({ adminId: admin._id });
    if (!formProfile) {
      formProfile = new FormProfile({ adminId: admin._id });
      await formProfile.save();
    }

    // 2. Fetch Public Profile, Projects, Skills
    const [publicProfile, projects, skills] = await Promise.all([
      Profile.findOne(),
      Project.find().sort({ order: 1, createdAt: -1 }),
      SkillCategory.find().sort({ order: 1 })
    ]);

    // 3. Build Lookup Dictionary
    const dictionary = buildLookupDictionary(publicProfile, formProfile, projects, skills);

    res.json({
      success: true,
      data: {
        formProfile,
        publicProfile,
        projects,
        skills,
        dictionary,
        extensionApiKey: formProfile.extensionApiKey
      }
    });
  } catch (error) {
    console.error('Get Form Profile Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Form Profile details
// @route   PUT /api/form-profile
// @access  Private (JWT or Extension API Key)
exports.updateFormProfile = async (req, res) => {
  try {
    const admin = req.admin;
    const updates = req.body;

    let formProfile = await FormProfile.findOne({ adminId: admin._id });
    if (!formProfile) {
      formProfile = new FormProfile({ adminId: admin._id });
    }

    // Selectively assign allowed sections
    if (updates.personal) formProfile.personal = { ...formProfile.personal, ...updates.personal };
    if (updates.education) formProfile.education = updates.education;
    if (updates.workExperience) formProfile.workExperience = updates.workExperience;
    if (updates.compensation) formProfile.compensation = { ...formProfile.compensation, ...updates.compensation };
    if (updates.workAuthorization) formProfile.workAuthorization = { ...formProfile.workAuthorization, ...updates.workAuthorization };
    if (updates.statements) formProfile.statements = { ...formProfile.statements, ...updates.statements };
    if (updates.customFields) formProfile.customFields = updates.customFields;

    formProfile.updatedAt = Date.now();
    await formProfile.save();

    res.json({
      success: true,
      message: 'Form profile updated successfully',
      data: formProfile
    });
  } catch (error) {
    console.error('Update Form Profile Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Quick-add an unknown field saved from the browser extension
// @route   POST /api/form-profile/quick-add
// @access  Private (JWT or Extension API Key)
exports.quickAddField = async (req, res) => {
  try {
    const admin = req.admin;
    const { key, label, value, category } = req.body;

    if (!key || !value) {
      return res.status(400).json({ success: false, message: 'Key and Value are required' });
    }

    let formProfile = await FormProfile.findOne({ adminId: admin._id });
    if (!formProfile) {
      formProfile = new FormProfile({ adminId: admin._id });
    }

    // Check if key already exists in customFields
    const existingIndex = formProfile.customFields.findIndex(cf => cf.key.toLowerCase() === key.toLowerCase());
    if (existingIndex > -1) {
      formProfile.customFields[existingIndex].value = value;
      if (label) formProfile.customFields[existingIndex].label = label;
      if (category) formProfile.customFields[existingIndex].category = category;
    } else {
      formProfile.customFields.push({
        key: key.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
        label: label || key,
        value,
        category: category || 'Discovered Fields'
      });
    }

    formProfile.updatedAt = Date.now();
    await formProfile.save();

    res.json({
      success: true,
      message: `Field "${label || key}" saved to your private form profile`,
      customFields: formProfile.customFields
    });
  } catch (error) {
    console.error('Quick Add Field Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate / Regenerate Extension API Key
// @route   POST /api/form-profile/generate-key
// @access  Private (JWT)
exports.generateExtensionKey = async (req, res) => {
  try {
    const admin = req.admin;
    const newKey = 'pf_ext_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    let formProfile = await FormProfile.findOne({ adminId: admin._id });
    if (!formProfile) {
      formProfile = new FormProfile({ adminId: admin._id, extensionApiKey: newKey });
    } else {
      formProfile.extensionApiKey = newKey;
    }

    await formProfile.save();

    res.json({
      success: true,
      message: 'New Extension API Key generated',
      apiKey: newKey
    });
  } catch (error) {
    console.error('Generate Key Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Synthesize grounded AI answer for open-ended application questions
// @route   POST /api/form-profile/ai-generate
// @access  Private (JWT or Extension API Key)
exports.aiGenerateAnswer = async (req, res) => {
  try {
    const admin = req.admin;
    const { question, context = '', maxLength = 250 } = req.body;

    if (!question) {
      return res.status(400).json({ success: false, message: 'Question prompt is required' });
    }

    // Fetch rich context from database
    const [publicProfile, formProfile, projects, skills] = await Promise.all([
      Profile.findOne(),
      FormProfile.findOne({ adminId: admin._id }),
      Project.find(),
      SkillCategory.find()
    ]);

    const fp = formProfile || {};
    const statements = fp.statements || {};
    const p = publicProfile || {};

    const qLower = question.toLowerCase();

    // Check if matching baseline statements exist
    let draftedAnswer = '';

    if (qLower.includes('tell us about yourself') || qLower.includes('tell me about yourself') || qLower.includes('bio') || qLower.includes('introduction')) {
      draftedAnswer = statements.professionalSummary || 
        `I am ${p.name || 'Vedant Lahane'}, a Computer Science student and software developer passionate about building scalable, AI-powered web applications. With core expertise in React, TypeScript, Node.js, and Java, I have developed projects like SafarSathi (an offline-first safety PWA) and Axon (a RAG document intelligence platform), while solving 350+ DSA algorithmic challenges. I take pride in combining technical rigor with user-centric product engineering.`;
    } else if (qLower.includes('why') && (qLower.includes('join') || qLower.includes('company') || qLower.includes('us') || qLower.includes('interested') || qLower.includes('work here'))) {
      draftedAnswer = statements.whyOurCompanyTemplate ||
        `I am excited by the opportunity to contribute to your team because of your focus on engineering craftsmanship and impactful software. My experience architecting end-to-end full stack applications, optimizing system performance, and solving complex algorithmic problems equips me to ramp up swiftly and make meaningful contributions to your core engineering objectives.`;
    } else if (qLower.includes('proud') || qLower.includes('project') || qLower.includes('achievement') || qLower.includes('challenge')) {
      draftedAnswer = statements.proudestProjectDescription || statements.greatestTechnicalAchievement ||
        `One project I am proud of is Axon, a RAG document intelligence platform I engineered using Node.js, LangChain, vector embeddings, and LLMs. It solves the challenge of extracting accurate insights from dense unstructured technical documents with sub-second retrieval times and strict source citations. Building it taught me deep lessons in vector search indexing, chunking strategies, and backend resilience.`;
    } else if (qLower.includes('react') || qLower.includes('frontend')) {
      draftedAnswer = `I have extensive hands-on experience developing modular frontend systems in React with TypeScript, Vite, and Tailwind CSS. I prioritize responsive layouts, clean state management, accessible UI components, and fluid animations using Framer Motion and GSAP, ensuring both aesthetic refinement and high runtime performance.`;
    } else if (qLower.includes('backend') || qLower.includes('node') || qLower.includes('api')) {
      draftedAnswer = `My backend experience centers on building scalable RESTful APIs with Node.js, Express, and MongoDB/MySQL. I implement secure JWT authentication, RBAC authorization, transactional data handling, and rate-limited endpoints with thorough error boundaries to guarantee service reliability.`;
    } else {
      // Default contextual synthesis
      draftedAnswer = `As a software engineer proficient in ${skills.flatMap(s => s.skills).slice(0, 8).join(', ')}, I bring a strong analytical mindset honed through 350+ algorithmic problem solutions and practical production deployments (including SafarSathi and Axon). I am dedicated to delivering maintainable, high-performance code and collaborating closely with cross-functional teams to solve challenging technical problems.`;
    }

    res.json({
      success: true,
      answer: draftedAnswer,
      groundedIn: {
        candidateName: p.name || 'Vedant Lahane',
        primaryTech: ['React', 'TypeScript', 'Node.js', 'Java', 'MongoDB'],
        flagshipProjects: ['SafarSathi (Safety PWA)', 'Axon (RAG Intelligence)', 'ShoeMarkNet (E-commerce RBAC)']
      }
    });

  } catch (error) {
    console.error('AI Generate Answer Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
