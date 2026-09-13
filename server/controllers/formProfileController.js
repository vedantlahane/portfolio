const FormProfile = require('../models/FormProfile');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const SkillCategory = require('../models/SkillCategory');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const aiService = require('../services/aiService');

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
    linkedin: personal.linkedinUrl || 'https://linkedin.com/in/vedant-lahane',
    linkedinUrl: personal.linkedinUrl || 'https://linkedin.com/in/vedant-lahane',
    linkedinProfile: personal.linkedinUrl || 'https://linkedin.com/in/vedant-lahane',
    github: personal.githubUrl || 'https://github.com/vedantlahane',
    githubUrl: personal.githubUrl || 'https://github.com/vedantlahane',
    githubProfile: personal.githubUrl || 'https://github.com/vedantlahane',
    twitter: personal.twitterUrl || 'https://twitter.com/vedantlahane',
    twitterUrl: personal.twitterUrl || 'https://twitter.com/vedantlahane',
    leetcode: 'https://leetcode.com/u/vedantlahane',
    leetcodeUrl: 'https://leetcode.com/u/vedantlahane',
    portfolio: personal.portfolioUrl || 'https://vedantlahane.vercel.app',
    portfolioUrl: personal.portfolioUrl || 'https://vedantlahane.vercel.app',
    website: personal.portfolioUrl || 'https://vedantlahane.vercel.app',
    websiteUrl: personal.portfolioUrl || 'https://vedantlahane.vercel.app',
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

    // Skills & Highlights
    skillsSummary: (skills || []).flatMap(s => s.skills).join(', '),
    featuredSkills: (p.featuredSkills || []).map(s => s.name).join(', '),
    roles: (p.roles || []).join(', '),
    
    // Default Professional Summary (from Profile)
    professionalSummary: p.heroDescription || ''
  };

  // Merge custom fields
  if (Array.isArray(fp.customFields)) {
    fp.customFields.forEach(cf => {
      if (cf.key && cf.value) {
        dict[cf.key] = cf.value;
      }
    });
  }

  // Index Knowledge Vault entries
  if (Array.isArray(fp.knowledgeVault)) {
    fp.knowledgeVault.forEach(item => {
      if (item.title && item.content) {
        const slug = item.title.toLowerCase().replace(/[^a-z0-9_]/g, '_').substring(0, 30);
        dict[`knowledge_${slug}`] = item.content;
        dict[item.id] = item.content;
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
    if (updates.knowledgeVault) formProfile.knowledgeVault = updates.knowledgeVault;
    if (updates.aiSettings) formProfile.aiSettings = { ...formProfile.aiSettings, ...updates.aiSettings };

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

// @desc    Add a new Knowledge Vault item
// @route   POST /api/form-profile/knowledge
// @access  Private (JWT or Extension API Key)
exports.addKnowledgeItem = async (req, res) => {
  try {
    const admin = req.admin;
    const { title, category, tags, content, pinned } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    let formProfile = await FormProfile.findOne({ adminId: admin._id });
    if (!formProfile) {
      formProfile = new FormProfile({ adminId: admin._id });
    }

    const newItem = {
      id: 'kv_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      title: title.trim(),
      category: category || 'Experience & Stories',
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : []),
      content: content.trim(),
      pinned: !!pinned,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    formProfile.knowledgeVault.unshift(newItem);
    formProfile.updatedAt = Date.now();
    await formProfile.save();

    res.json({
      success: true,
      message: `Knowledge entry "${newItem.title}" added`,
      item: newItem,
      knowledgeVault: formProfile.knowledgeVault
    });
  } catch (error) {
    console.error('Add Knowledge Item Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an existing Knowledge Vault item
// @route   PUT /api/form-profile/knowledge/:id
// @access  Private (JWT or Extension API Key)
exports.updateKnowledgeItem = async (req, res) => {
  try {
    const admin = req.admin;
    const { id } = req.params;
    const { title, category, tags, content, pinned } = req.body;

    let formProfile = await FormProfile.findOne({ adminId: admin._id });
    if (!formProfile) {
      return res.status(404).json({ success: false, message: 'Form profile not found' });
    }

    const itemIndex = formProfile.knowledgeVault.findIndex(k => k.id === id);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Knowledge item not found' });
    }

    if (title !== undefined) formProfile.knowledgeVault[itemIndex].title = title.trim();
    if (category !== undefined) formProfile.knowledgeVault[itemIndex].category = category;
    if (tags !== undefined) {
      formProfile.knowledgeVault[itemIndex].tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    if (content !== undefined) formProfile.knowledgeVault[itemIndex].content = content.trim();
    if (pinned !== undefined) formProfile.knowledgeVault[itemIndex].pinned = !!pinned;
    formProfile.knowledgeVault[itemIndex].updatedAt = new Date();

    formProfile.updatedAt = Date.now();
    await formProfile.save();

    res.json({
      success: true,
      message: 'Knowledge entry updated',
      item: formProfile.knowledgeVault[itemIndex],
      knowledgeVault: formProfile.knowledgeVault
    });
  } catch (error) {
    console.error('Update Knowledge Item Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a Knowledge Vault item
// @route   DELETE /api/form-profile/knowledge/:id
// @access  Private (JWT or Extension API Key)
exports.deleteKnowledgeItem = async (req, res) => {
  try {
    const admin = req.admin;
    const { id } = req.params;

    let formProfile = await FormProfile.findOne({ adminId: admin._id });
    if (!formProfile) {
      return res.status(404).json({ success: false, message: 'Form profile not found' });
    }

    formProfile.knowledgeVault = formProfile.knowledgeVault.filter(k => k.id !== id);
    formProfile.updatedAt = Date.now();
    await formProfile.save();

    res.json({
      success: true,
      message: 'Knowledge entry deleted',
      knowledgeVault: formProfile.knowledgeVault
    });
  } catch (error) {
    console.error('Delete Knowledge Item Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Synthesize grounded AI answer for open-ended application questions
// @route   POST /api/form-profile/ai-generate
// @access  Private (JWT or Extension API Key)
exports.aiGenerateAnswer = async (req, res) => {
  try {
    const admin = req.admin;
    const { question, context = '', provider, model } = req.body;

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
    const aiSettings = fp.aiSettings || {};
    const activeProvider = provider || aiSettings.defaultProvider || 'groq';
    const activeModel = model || (activeProvider === 'groq' ? aiSettings.groqModel : aiSettings.geminiModel);

    // Call dual AI service with knowledge retrieval
    try {
      const aiResult = await aiService.generateAnswer({
        question,
        context,
        knowledgeVault: fp.knowledgeVault || [],
        projects,
        skills,
        profileFacts: {
          fullName: publicProfile?.name || 'Vedant Lahane',
          educationInstitution: fp.education?.[0]?.institution,
          degree: fp.education?.[0]?.degree
        },
        provider: activeProvider,
        model: activeModel,
        customInstructions: aiSettings.systemPrompt
      });

      return res.json({
        success: true,
        answer: aiResult.answer,
        provider: aiResult.provider,
        model: aiResult.model,
        usedKnowledge: aiResult.usedKnowledge,
        groundedIn: {
          candidateName: publicProfile?.name || 'Vedant Lahane',
          primaryTech: ['React', 'TypeScript', 'Node.js', 'Java', 'MongoDB'],
          flagshipProjects: ['SafarSathi (Safety PWA)', 'Axon (RAG Intelligence)', 'ShoeMarkNet (E-commerce RBAC)']
        }
      });
    } catch (llmError) {
      console.warn('LLM call failed, falling back to heuristic narrative synthesis:', llmError.message);

      // Graceful heuristic fallback
      const statements = fp.statements || {};
      const p = publicProfile || {};
      const qLower = question.toLowerCase();
      let draftedAnswer = '';

      if (qLower.includes('tell us about yourself') || qLower.includes('tell me about yourself') || qLower.includes('bio') || qLower.includes('introduction')) {
        draftedAnswer = statements.professionalSummary || 
          `I am ${p.name || 'Vedant Lahane'}, a Computer Science student and software developer passionate about building scalable, AI-powered web applications. With core expertise in React, TypeScript, Node.js, and Java, I have developed projects like SafarSathi (an offline-first safety PWA) and Axon (a RAG document intelligence platform), while solving 350+ DSA algorithmic challenges.`;
      } else if (qLower.includes('why') && (qLower.includes('join') || qLower.includes('company') || qLower.includes('us') || qLower.includes('interested') || qLower.includes('work here'))) {
        draftedAnswer = statements.whyOurCompanyTemplate ||
          `I am excited by the opportunity to contribute to your team because of your focus on engineering craftsmanship and impactful software. My experience architecting end-to-end full stack applications, optimizing system performance, and solving complex algorithmic problems equips me to ramp up swiftly and make meaningful contributions.`;
      } else if (qLower.includes('proud') || qLower.includes('project') || qLower.includes('achievement') || qLower.includes('challenge')) {
        draftedAnswer = statements.proudestProjectDescription || statements.greatestTechnicalAchievement ||
          `One project I am proud of is Axon, a RAG document intelligence platform I engineered using Node.js, LangChain, vector embeddings, and LLMs. It solves the challenge of extracting accurate insights from dense unstructured technical documents with sub-second retrieval times and strict source citations.`;
      } else {
        draftedAnswer = `As a software engineer proficient in ${skills.flatMap(s => s.skills).slice(0, 8).join(', ')}, I bring a strong analytical mindset honed through 350+ algorithmic problem solutions and practical production deployments (including SafarSathi and Axon). I am dedicated to delivering maintainable, high-performance code.`;
      }

      return res.json({
        success: true,
        answer: draftedAnswer,
        provider: 'heuristic_fallback',
        warning: `Live LLM call unavailable (${llmError.message}). Synthesized from profile statements.`,
        groundedIn: {
          candidateName: p.name || 'Vedant Lahane',
          primaryTech: ['React', 'TypeScript', 'Node.js', 'Java', 'MongoDB'],
          flagshipProjects: ['SafarSathi (Safety PWA)', 'Axon (RAG Intelligence)']
        }
      });
    }
  } catch (error) {
    console.error('AI Generate Answer Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Live LLM connectivity test
// @route   POST /api/form-profile/ai-test
// @access  Private (JWT or Extension API Key)
exports.testAiConnection = async (req, res) => {
  try {
    const { provider = 'groq', model } = req.body;
    const result = await aiService.testConnection(provider, model);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Suggest category and tags for newly discovered knowledge
// @route   POST /api/form-profile/ai-categorize
// @access  Private (JWT or Extension API Key)
exports.suggestKnowledgeCategorization = async (req, res) => {
  try {
    const { title, content, provider, model } = req.body;
    const result = await aiService.suggestKnowledgeClassification({ title, content, provider, model });
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Semantic field resolution for difficult form questions
// @route   POST /api/form-profile/ai-resolve-field
// @access  Private (JWT or Extension API Key)
exports.aiResolveField = async (req, res) => {
  try {
    const admin = req.admin;
    const { fieldLabel, placeholder, inputType, options, provider, model } = req.body;

    const [publicProfile, formProfile, projects, skills] = await Promise.all([
      Profile.findOne(),
      FormProfile.findOne({ adminId: admin._id }),
      Project.find(),
      SkillCategory.find()
    ]);

    const fp = formProfile || {};
    const dictionary = buildLookupDictionary(publicProfile, fp, projects, skills);

    const result = await aiService.matchFieldSemantically({
      fieldLabel,
      placeholder,
      inputType,
      options,
      dictionary,
      knowledgeVault: fp.knowledgeVault || [],
      provider,
      model
    });

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
