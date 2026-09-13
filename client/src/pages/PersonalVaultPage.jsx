import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin, API_URL } from '../context/AdminContext';
import ThemeToggle from '../components/UI/ThemeToggle';

// ============================================================================
// Uniform Vector Icons (1.5px stroke, zero emojis)
// ============================================================================
const SaveIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

const CheckIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
  </svg>
);

const CopyIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const PlusIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
  </svg>
);

const TrashIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const SearchIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const SparklesIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.286L13 21l-2.286-6.857L5 12l5.714-2.286L13 3z" />
  </svg>
);

const RefreshIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const ChevronDownIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
  </svg>
);

const LockIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

// ============================================================================
// Constants
// ============================================================================
const SECTIONS = [
  { id: 'facts', num: '01', title: 'Facts & Identity', sub: 'Legal name, addresses & links' },
  { id: 'career', num: '02', title: 'Career & Visas', sub: 'Work authorization, CTC & education' },
  { id: 'knowledge', num: '03', title: 'Knowledge Vault', sub: 'Stories, deep dives & STAR narratives' },
  { id: 'custom', num: '04', title: 'Custom Attributes', sub: 'Extensible company-specific facts' },
  { id: 'ai', num: '05', title: 'AI Engine', sub: 'Groq LPUs, Gemini models & live diagnostics' },
  { id: 'pairing', num: '06', title: 'Extension Pairing', sub: 'Browser autofill secret key' }
];

const KNOWLEDGE_CATEGORIES = [
  'All',
  'Experience & Stories',
  'Technical Depth',
  'Career Goals',
  'Work Style & Values',
  'Project Context',
  'DSA & Problem Solving',
  'Custom Attributes',
  'General'
];

const GROQ_MODELS = [
  { id: 'qwen/qwen3.8-27b', name: 'Qwen 3.8 27B (Recommended - Fast & Grounded)' },
  { id: 'openai/gpt-oss-120b', name: 'GPT OSS 120B (Deep Reasoning)' },
  { id: 'openai/gpt-oss-20b', name: 'GPT OSS 20B (Ultra-Lightweight)' },
  { id: 'groq/compound', name: 'Groq Compound (Multi-agent router)' }
];

const GEMINI_MODELS = [
  { id: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash (Fast & Large Context)' },
  { id: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash' },
  { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash' },
  { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash' }
];

export default function PersonalVaultPage() {
  const { isAdmin, token, login } = useAdmin();

  // Authentication state for unauthenticated visitors
  const [passkeyInput, setPasskeyInput] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [unlocking, setUnlocking] = useState(false);

  // Active section view
  const [activeSection, setActiveSection] = useState('facts');

  // Core Data State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    personal: {
      legalFirstName: 'Vedant',
      legalLastName: 'Lahane',
      preferredName: 'Vedant',
      gender: '',
      pronouns: 'he/him',
      addressLine1: '',
      addressLine2: '',
      city: 'Amravati',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '',
      nationality: 'Indian',
      citizenship: 'India',
      passportNumber: '',
      alternatePhone: '',
      linkedinUrl: 'https://linkedin.com/in/vedant-lahane',
      githubUrl: 'https://github.com/vedantlahane',
      portfolioUrl: 'https://vedantlahane.vercel.app',
      twitterUrl: ''
    },
    education: [
      {
        institution: 'Government College of Engineering, Amravati',
        degree: 'Bachelor of Technology',
        major: 'Computer Science & Engineering',
        gpa: '',
        startYear: '2022',
        graduationYear: '2026',
        location: 'Amravati, Maharashtra, India'
      }
    ],
    workExperience: [],
    compensation: {
      currentSalary: '',
      expectedSalary: '',
      currency: 'INR',
      noticePeriodDays: '0 (Immediate)',
      earliestStartDate: 'Immediately'
    },
    workAuthorization: {
      authorizedInCountryOfRole: true,
      requiresSponsorshipNow: false,
      requiresSponsorshipFuture: false,
      willingToRelocate: true,
      workModePreference: 'Flexible (Remote/Hybrid/Onsite)'
    },
    statements: {
      professionalSummary: '',
      whyOurCompanyTemplate: '',
      proudestProjectDescription: '',
      greatestTechnicalAchievement: ''
    },
    customFields: [],
    knowledgeVault: [],
    aiSettings: {
      defaultProvider: 'groq',
      groqModel: 'qwen/qwen3.8-27b',
      geminiModel: 'gemini-3.6-flash',
      systemPrompt: ''
    },
    extensionApiKey: ''
  });

  // Knowledge Vault States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedKnowledgeId, setExpandedKnowledgeId] = useState(null);
  const [editingKnowledgeId, setEditingKnowledgeId] = useState(null);
  const [isAddingKnowledge, setIsAddingKnowledge] = useState(false);
  const [newKnowledge, setNewKnowledge] = useState({
    title: '',
    category: 'Experience & Stories',
    tags: '',
    content: '',
    pinned: false
  });
  const [isCategorizingAi, setIsCategorizingAi] = useState(false);

  // Custom Fields States
  const [newField, setNewField] = useState({
    key: '',
    label: '',
    value: '',
    category: 'General',
    isSensitive: false
  });
  const [isAddingField, setIsAddingField] = useState(false);

  // AI Sandbox & Diagnostics States
  const [aiTestPrompt, setAiTestPrompt] = useState('Why should our engineering team hire you for a full stack role?');
  const [aiTestResult, setAiTestResult] = useState(null);
  const [aiTesting, setAiTesting] = useState(false);
  const [pingResult, setPingResult] = useState(null);
  const [pinging, setPinging] = useState(false);

  // Pairing States
  const [copiedKey, setCopiedKey] = useState(false);
  const [generatingKey, setGeneratingKey] = useState(false);

  // Fetch Form Profile from Backend
  const fetchFormProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/form-profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success && data.data?.formProfile) {
        setFormData(prev => ({
          ...prev,
          ...data.data.formProfile,
          personal: { ...prev.personal, ...data.data.formProfile.personal },
          compensation: { ...prev.compensation, ...data.data.formProfile.compensation },
          workAuthorization: { ...prev.workAuthorization, ...data.data.formProfile.workAuthorization },
          statements: { ...prev.statements, ...data.data.formProfile.statements },
          aiSettings: { ...prev.aiSettings, ...(data.data.formProfile.aiSettings || {}) },
          knowledgeVault: data.data.formProfile.knowledgeVault || prev.knowledgeVault,
          customFields: data.data.formProfile.customFields || []
        }));
      }
    } catch (err) {
      console.error('Failed to load form profile:', err);
      setMessage({ text: 'Failed to load profile from database.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && token) {
      fetchFormProfile();
    } else {
      setLoading(false);
    }
  }, [isAdmin, token]);

  // Handle Passkey Unlock
  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!passkeyInput.trim()) return;
    setUnlocking(true);
    setUnlockError('');
    const res = await login(passkeyInput.trim());
    setUnlocking(false);
    if (!res.success) {
      setUnlockError(res.message || 'Incorrect passkey. Please try again.');
    } else {
      setPasskeyInput('');
    }
  };

  // Save Entire Form Profile
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setMessage({ text: '', type: '' });
      const res = await fetch(`${API_URL}/api/form-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: 'Personal Vault changes successfully saved.', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 4000);
      } else {
        setMessage({ text: data.message || 'Failed to save changes.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Network error occurred while saving.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Generate / Regenerate Key
  const handleGenerateKey = async () => {
    if (!window.confirm('Generating a new extension key will disconnect previously paired browsers. Proceed?')) {
      return;
    }
    try {
      setGeneratingKey(true);
      const res = await fetch(`${API_URL}/api/form-profile/generate-key`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, extensionApiKey: data.data.apiKey }));
        setMessage({ text: 'New extension pairing key generated.', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 4000);
      }
    } catch (err) {
      setMessage({ text: 'Failed to generate key.', type: 'error' });
    } finally {
      setGeneratingKey(false);
    }
  };

  // Copy Key
  const handleCopyKey = () => {
    if (!formData.extensionApiKey) return;
    navigator.clipboard.writeText(formData.extensionApiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Add Knowledge Story
  const handleAddKnowledge = async (e) => {
    e.preventDefault();
    if (!newKnowledge.title.trim() || !newKnowledge.content.trim()) {
      setMessage({ text: 'Story title and narrative content are required.', type: 'error' });
      return;
    }
    try {
      const payload = {
        title: newKnowledge.title.trim(),
        category: newKnowledge.category,
        tags: typeof newKnowledge.tags === 'string'
          ? newKnowledge.tags.split(',').map(t => t.trim()).filter(Boolean)
          : newKnowledge.tags,
        content: newKnowledge.content.trim(),
        pinned: Boolean(newKnowledge.pinned)
      };

      const res = await fetch(`${API_URL}/api/form-profile/knowledge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, knowledgeVault: data.knowledgeVault }));
        setNewKnowledge({
          title: '',
          category: 'Experience & Stories',
          tags: '',
          content: '',
          pinned: false
        });
        setIsAddingKnowledge(false);
        setMessage({ text: 'Story successfully added to your Personal Vault.', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      }
    } catch (err) {
      setMessage({ text: 'Failed to add story.', type: 'error' });
    }
  };

  // Update Knowledge Story
  const handleUpdateKnowledge = async (item) => {
    try {
      const res = await fetch(`${API_URL}/api/form-profile/knowledge/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: item.title,
          category: item.category,
          tags: Array.isArray(item.tags) ? item.tags : String(item.tags).split(',').map(t => t.trim()).filter(Boolean),
          content: item.content,
          pinned: item.pinned
        })
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, knowledgeVault: data.knowledgeVault }));
        setEditingKnowledgeId(null);
        setMessage({ text: 'Story updated in vault.', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      }
    } catch (err) {
      setMessage({ text: 'Failed to update story.', type: 'error' });
    }
  };

  // Delete Knowledge Story
  const handleDeleteKnowledge = async (id) => {
    if (!window.confirm('Delete this story entry from your Personal Vault?')) return;
    try {
      const res = await fetch(`${API_URL}/api/form-profile/knowledge/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, knowledgeVault: data.knowledgeVault }));
        setMessage({ text: 'Story deleted from vault.', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      }
    } catch (err) {
      setMessage({ text: 'Failed to delete story.', type: 'error' });
    }
  };

  // Toggle Pin
  const handleTogglePin = async (item) => {
    try {
      const res = await fetch(`${API_URL}/api/form-profile/knowledge/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pinned: !item.pinned })
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, knowledgeVault: data.knowledgeVault }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // AI Auto-Categorize Suggestion
  const handleAiSuggestCategory = async () => {
    if (!newKnowledge.title && !newKnowledge.content) {
      setMessage({ text: 'Enter a draft title or content so AI can infer the context.', type: 'error' });
      return;
    }
    try {
      setIsCategorizingAi(true);
      const res = await fetch(`${API_URL}/api/form-profile/ai-categorize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newKnowledge.title,
          content: newKnowledge.content,
          provider: formData.aiSettings.defaultProvider
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewKnowledge(prev => ({
          ...prev,
          category: data.category || prev.category,
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : prev.tags
        }));
        setMessage({ text: `AI suggested category: ${data.category}`, type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCategorizingAi(false);
    }
  };

  // Live Ping Test for AI Provider
  const handlePingTest = async () => {
    try {
      setPinging(true);
      setPingResult(null);
      const provider = formData.aiSettings.defaultProvider;
      const model = provider === 'groq' ? formData.aiSettings.groqModel : formData.aiSettings.geminiModel;

      const res = await fetch(`${API_URL}/api/form-profile/ai-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ provider, model })
      });
      const data = await res.json();
      setPingResult(data);
    } catch (err) {
      setPingResult({ success: false, error: err.message });
    } finally {
      setPinging(false);
    }
  };

  // Interactive Question Sandbox
  const handleTestAiSandbox = async () => {
    if (!aiTestPrompt.trim()) return;
    try {
      setAiTesting(true);
      setAiTestResult(null);
      const provider = formData.aiSettings.defaultProvider;
      const model = provider === 'groq' ? formData.aiSettings.groqModel : formData.aiSettings.geminiModel;

      const res = await fetch(`${API_URL}/api/form-profile/ai-generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          question: aiTestPrompt,
          provider,
          model
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiTestResult(data);
      } else {
        setMessage({ text: data.message || 'Generation failed.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Error contacting AI engine.', type: 'error' });
    } finally {
      setAiTesting(false);
    }
  };

  // Filtered Knowledge Items
  const filteredKnowledge = useMemo(() => {
    let items = formData.knowledgeVault || [];
    if (selectedCategory !== 'All') {
      items = items.filter(k => k.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(k =>
        (k.title && k.title.toLowerCase().includes(q)) ||
        (k.content && k.content.toLowerCase().includes(q)) ||
        (Array.isArray(k.tags) && k.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    return [...items].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [formData.knowledgeVault, selectedCategory, searchQuery]);

  // Add Custom Field
  const handleAddCustomField = () => {
    if (!newField.key.trim() || !newField.value.trim()) {
      setMessage({ text: 'Attribute key and value are required.', type: 'error' });
      return;
    }
    const cleanKey = newField.key.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const existing = formData.customFields.find(f => f.key === cleanKey);
    if (existing) {
      setMessage({ text: `Attribute with key "${cleanKey}" already exists.`, type: 'error' });
      return;
    }

    setFormData(prev => ({
      ...prev,
      customFields: [
        ...prev.customFields,
        {
          key: cleanKey,
          label: newField.label.trim() || newField.key.trim(),
          value: newField.value.trim(),
          category: newField.category || 'General',
          isSensitive: Boolean(newField.isSensitive)
        }
      ]
    }));

    setNewField({
      key: '',
      label: '',
      value: '',
      category: 'General',
      isSensitive: false
    });
    setIsAddingField(false);
    setMessage({ text: `Attribute "${cleanKey}" added. Click "SAVE PROFILE" to persist.`, type: 'success' });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  // Remove Custom Field
  const handleRemoveCustomField = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // ==========================================================================
  // UNLOCKED AUTHENTICATION SCREEN
  // ==========================================================================
  if (!isAdmin) {
    return (
      <div className="bg-white dark:bg-black font-sans text-gray-900 dark:text-neutral-100 min-h-screen transition-colors duration-300">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-6">
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-neutral-800">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                <div className="absolute inset-0 bg-gray-900 dark:bg-white transform rotate-45 rounded-sm" />
                <div className="absolute inset-1 bg-white dark:bg-neutral-900 transform rotate-45 rounded-sm" />
                <div className="absolute inset-2 bg-gray-900 dark:bg-accent transform rotate-45 rounded-sm" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-400 dark:text-neutral-500 font-mono font-light">
                  <span className="text-accent font-medium">08</span> &nbsp;&nbsp;PERSONAL VAULT
                </p>
                <h1 className="text-xl sm:text-2xl font-display font-light text-gray-900 dark:text-white">
                  Vedant Lahane
                </h1>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link
                to="/"
                className="text-xs sm:text-sm font-mono text-gray-500 dark:text-neutral-400 hover:text-accent dark:hover:text-accent transition-colors"
              >
                ← Back to portfolio
              </Link>
            </div>
          </div>

          {/* Lock Screen Body */}
          <div className="max-w-md mx-auto py-24 text-center">
            <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300">
              <LockIcon className="w-5 h-5" />
            </div>

            <p className="text-xs font-mono tracking-widest text-accent uppercase mb-2">
              RESTRICTED VAULT ACCESS
            </p>
            <h2 className="text-3xl font-display font-light text-gray-900 dark:text-white tracking-tight mb-3">
              Personal Vault is Locked
            </h2>
            <p className="text-sm font-sans font-light text-gray-500 dark:text-neutral-400 mb-8 leading-relaxed">
              This repository contains verified recruitment facts, confidential career data, and AI grounding stories. Please authenticate to view or modify.
            </p>

            <form onSubmit={handleUnlock} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] text-gray-400 dark:text-neutral-500 font-mono uppercase tracking-wider mb-1.5 text-center">
                  Owner Passkey
                </label>
                <input
                  type="password"
                  value={passkeyInput}
                  onChange={(e) => setPasskeyInput(e.target.value)}
                  placeholder="••••"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-center font-mono text-lg tracking-widest text-gray-900 dark:text-white focus:border-accent focus:outline-none rounded-none transition-colors"
                />
              </div>

              {unlockError && (
                <p className="text-xs font-mono text-red-500 text-center">
                  {unlockError}
                </p>
              )}

              <button
                type="submit"
                disabled={unlocking}
                className="w-full py-3 bg-gray-900 dark:bg-accent text-white dark:text-black font-mono text-xs tracking-wider uppercase font-medium hover:bg-neutral-800 dark:hover:bg-accent/90 transition-colors cursor-pointer rounded-none flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {unlocking ? (
                  <>
                    <RefreshIcon className="w-4 h-4 animate-spin" />
                    <span>UNLOCKING...</span>
                  </>
                ) : (
                  <span>AUTHENTICATE & UNLOCK</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // AUTHENTICATED PERSONAL VAULT PAGE
  // ==========================================================================
  return (
    <div className="bg-white dark:bg-black font-sans text-gray-900 dark:text-neutral-100 min-h-screen transition-colors duration-300">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        {/* Architectural Sticky Header */}
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 transition-colors duration-300">
          <div className="py-4 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Logo & Section Title */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link to="/" className="flex items-center gap-3 sm:gap-4 group">
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 transition-transform duration-500 group-hover:rotate-90">
                  <div className="absolute inset-0 bg-gray-900 dark:bg-white transform rotate-45 rounded-sm" />
                  <div className="absolute inset-1 bg-white dark:bg-neutral-900 transform rotate-45 rounded-sm" />
                  <div className="absolute inset-2 bg-gray-900 dark:bg-accent transform rotate-45 rounded-sm" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-400 dark:text-neutral-500 font-mono font-light mb-0.5">
                    <span className="text-accent font-medium">08</span> &nbsp;&nbsp;PERSONAL VAULT
                  </p>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-light text-gray-900 dark:text-white tracking-tight">
                    Personal Vault
                  </h1>
                </div>
              </Link>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={handleSaveProfile}
                disabled={saving || loading}
                className="text-xs font-mono font-medium text-white bg-gray-900 dark:bg-accent dark:text-black border border-gray-900 dark:border-accent px-4 py-2 hover:bg-neutral-800 dark:hover:bg-accent/90 transition-colors cursor-pointer rounded-none flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <RefreshIcon className="w-3.5 h-3.5 animate-spin" />
                    <span>SAVING...</span>
                  </>
                ) : (
                  <>
                    <SaveIcon className="w-3.5 h-3.5" />
                    <span>SAVE PROFILE</span>
                  </>
                )}
              </button>

              <div className="h-5 w-px bg-gray-200 dark:border-neutral-800" />
              <ThemeToggle />

              <div className="h-5 w-px bg-gray-200 dark:border-neutral-800" />
              <Link
                to="/"
                className="group relative text-xs sm:text-sm font-sans font-light text-gray-500 dark:text-neutral-400 hover:text-accent dark:hover:text-accent transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <span>←</span>
                <span>Back to portfolio</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Global Feedback Banner */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`my-4 px-4 py-3 text-xs font-mono border flex items-center justify-between ${
                message.type === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {message.type === 'error' ? (
                  <span className="font-bold">✕</span>
                ) : (
                  <CheckIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                )}
                <span>{message.text}</span>
              </div>
              <button onClick={() => setMessage({ text: '', type: '' })} className="cursor-pointer font-mono font-bold">
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Architectural Split Grid */}
        <main className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* ============================================================== */}
            {/* LEFT COLUMN: STICKY INDEX & SYSTEM TELEMETRY (4 COLS)          */}
            {/* ============================================================== */}
            <div className="col-span-1 lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              {/* Navigation Index */}
              <div className="border border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/30 p-2 sm:p-3">
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 dark:text-neutral-500 px-3 py-2 border-b border-gray-200 dark:border-neutral-800/80 mb-1">
                  VAULT INDEX
                </p>

                <div className="space-y-1">
                  {SECTIONS.map((sec) => {
                    const isActive = activeSection === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => setActiveSection(sec.id)}
                        className={`w-full text-left px-3 py-3 transition-all cursor-pointer flex items-center justify-between border-l-2 ${
                          isActive
                            ? 'border-accent bg-white dark:bg-neutral-900 text-gray-900 dark:text-white shadow-sm'
                            : 'border-transparent text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-neutral-900/40'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-accent font-medium">
                              {sec.num}
                            </span>
                            <span className="text-sm font-sans font-medium">
                              {sec.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 dark:text-neutral-500 font-sans mt-0.5">
                            {sec.sub}
                          </p>
                        </div>

                        {sec.id === 'knowledge' && (
                          <span className="text-xs font-mono px-2 py-0.5 border border-gray-200 dark:border-neutral-800 text-gray-500 dark:text-neutral-400">
                            {formData.knowledgeVault?.length || 0}
                          </span>
                        )}
                        {sec.id === 'custom' && (
                          <span className="text-xs font-mono px-2 py-0.5 border border-gray-200 dark:border-neutral-800 text-gray-500 dark:text-neutral-400">
                            {formData.customFields?.length || 0}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* System Telemetry & Health Box */}
              <div className="border border-gray-200 dark:border-neutral-800 p-4 space-y-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 dark:text-neutral-500">
                  SYSTEM TELEMETRY
                </p>

                <div className="space-y-3 text-xs font-mono">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-neutral-800/80">
                    <span className="text-gray-500 dark:text-neutral-400">AI Provider</span>
                    <span className="text-accent uppercase font-medium">
                      {formData.aiSettings.defaultProvider === 'groq' ? 'Groq LPUs' : 'Google Gemini'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-neutral-800/80">
                    <span className="text-gray-500 dark:text-neutral-400">Knowledge Stories</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {formData.knowledgeVault?.length || 0} Grounded
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-neutral-800/80">
                    <span className="text-gray-500 dark:text-neutral-400">Custom Attributes</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {formData.customFields?.length || 0} Facts
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-neutral-400">Extension Token</span>
                    <span className={formData.extensionApiKey ? 'text-emerald-500' : 'text-amber-500'}>
                      {formData.extensionApiKey ? 'Active' : 'Unpaired'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* RIGHT COLUMN: DETAILED REPOSITORY EDITORIAL PANELS (8 COLS)    */}
            {/* ============================================================== */}
            <div className="col-span-1 lg:col-span-8 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-neutral-800/80 lg:pl-10 pt-8 lg:pt-0">
              {loading ? (
                <div className="py-24 text-center text-xs font-mono text-gray-400 dark:text-neutral-500 flex items-center justify-center gap-2">
                  <RefreshIcon className="w-4 h-4 animate-spin text-accent" />
                  LOADING VAULT REPOSITORY FROM DATABASE...
                </div>
              ) : (
                <div>
                  {/* ========================================================== */}
                  {/* SECTION 01: FACTS & IDENTITY                               */}
                  {/* ========================================================== */}
                  {activeSection === 'facts' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                      <div>
                        <p className="text-xs font-mono font-light text-gray-400 dark:text-neutral-500 mb-1">
                          <span className="text-accent font-medium">01</span> &nbsp;&nbsp;FACTS & IDENTITY
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-display font-light text-gray-900 dark:text-white tracking-tight">
                          Personal Identifiers & Contact
                        </h2>
                        <p className="text-sm font-sans font-light text-gray-500 dark:text-neutral-400 mt-1 leading-relaxed">
                          Primary legal and preferred identity information used across job applications and company recruitment portals.
                        </p>
                      </div>

                      {/* 01.1 Legal Identifiers */}
                      <div className="space-y-4">
                        <div className="pb-2 border-b border-gray-200 dark:border-neutral-800">
                          <h3 className="text-sm font-mono text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                            01.1 Legal Identity
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                              Legal First Name
                            </label>
                            <input
                              type="text"
                              value={formData.personal.legalFirstName || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  personal: { ...formData.personal, legalFirstName: e.target.value }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              placeholder="Vedant"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                              Legal Last Name
                            </label>
                            <input
                              type="text"
                              value={formData.personal.legalLastName || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  personal: { ...formData.personal, legalLastName: e.target.value }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              placeholder="Lahane"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                              Preferred Name
                            </label>
                            <input
                              type="text"
                              value={formData.personal.preferredName || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  personal: { ...formData.personal, preferredName: e.target.value }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              placeholder="Vedant"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                              Pronouns
                            </label>
                            <input
                              type="text"
                              value={formData.personal.pronouns || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  personal: { ...formData.personal, pronouns: e.target.value }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              placeholder="he/him"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                              Gender
                            </label>
                            <select
                              value={formData.personal.gender || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  personal: { ...formData.personal, gender: e.target.value }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                            >
                              <option value="">Decline to self-identify</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Non-binary">Non-binary</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* 01.2 Address & Location */}
                      <div className="space-y-4">
                        <div className="pb-2 border-b border-gray-200 dark:border-neutral-800">
                          <h3 className="text-sm font-mono text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                            01.2 Location & Address
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                              Street Address Line 1
                            </label>
                            <input
                              type="text"
                              value={formData.personal.addressLine1 || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  personal: { ...formData.personal, addressLine1: e.target.value }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              placeholder="Apartment, building, street"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                              City
                            </label>
                            <input
                              type="text"
                              value={formData.personal.city || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  personal: { ...formData.personal, city: e.target.value }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              placeholder="Amravati"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                              State / Province
                            </label>
                            <input
                              type="text"
                              value={formData.personal.state || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  personal: { ...formData.personal, state: e.target.value }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              placeholder="Maharashtra"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                              Country
                            </label>
                            <input
                              type="text"
                              value={formData.personal.country || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  personal: { ...formData.personal, country: e.target.value }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              placeholder="India"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                              Postal Code
                            </label>
                            <input
                              type="text"
                              value={formData.personal.postalCode || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  personal: { ...formData.personal, postalCode: e.target.value }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              placeholder="444604"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                              Alternate Phone Number
                            </label>
                            <input
                              type="text"
                              value={formData.personal.alternatePhone || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  personal: { ...formData.personal, alternatePhone: e.target.value }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              placeholder="+91 7447335096"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 01.3 Nationality & Citizenship */}
                      <div className="space-y-4">
                        <div className="pb-2 border-b border-gray-200 dark:border-neutral-800">
                          <h3 className="text-sm font-mono text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                            01.3 Nationality & Citizenship
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                              Nationality
                            </label>
                            <input
                              type="text"
                              value={formData.personal.nationality || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  personal: { ...formData.personal, nationality: e.target.value }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              placeholder="Indian"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                              Citizenship
                            </label>
                            <input
                              type="text"
                              value={formData.personal.citizenship || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  personal: { ...formData.personal, citizenship: e.target.value }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              placeholder="India"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                              Passport Number (Optional)
                            </label>
                            <input
                              type="text"
                              value={formData.personal.passportNumber || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  personal: { ...formData.personal, passportNumber: e.target.value }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              placeholder="T1234567"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 01.4 Profile & Social Links */}
                      <div className="space-y-4">
                        <div className="pb-2 border-b border-gray-200 dark:border-neutral-800">
                          <h3 className="text-sm font-mono text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                            01.4 Profile & Platform Links
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                              LinkedIn Profile URL
                            </label>
                            <input
                              type="url"
                              value={formData.personal.linkedinUrl || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  personal: { ...formData.personal, linkedinUrl: e.target.value }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              placeholder="https://linkedin.com/in/vedant-lahane"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                              GitHub Profile URL
                            </label>
                            <input
                              type="url"
                              value={formData.personal.githubUrl || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  personal: { ...formData.personal, githubUrl: e.target.value }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              placeholder="https://github.com/vedantlahane"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                              Portfolio Website URL
                            </label>
                            <input
                              type="url"
                              value={formData.personal.portfolioUrl || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  personal: { ...formData.personal, portfolioUrl: e.target.value }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              placeholder="https://vedantlahane.vercel.app"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                              Twitter / X Profile URL
                            </label>
                            <input
                              type="url"
                              value={formData.personal.twitterUrl || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  personal: { ...formData.personal, twitterUrl: e.target.value }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              placeholder="https://twitter.com/..."
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ========================================================== */}
                  {/* SECTION 02: CAREER & VISAS                                 */}
                  {/* ========================================================== */}
                  {activeSection === 'career' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                      <div>
                        <p className="text-xs font-mono font-light text-gray-400 dark:text-neutral-500 mb-1">
                          <span className="text-accent font-medium">02</span> &nbsp;&nbsp;CAREER & VISAS
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-display font-light text-gray-900 dark:text-white tracking-tight">
                          Work Authorization, Compensation & Academics
                        </h2>
                        <p className="text-sm font-sans font-light text-gray-500 dark:text-neutral-400 mt-1 leading-relaxed">
                          Immigration parameters, CTC expectations, and default text templates for job questionnaires.
                        </p>
                      </div>

                      {/* 02.1 Work Authorization */}
                      <div className="space-y-4">
                        <div className="pb-2 border-b border-gray-200 dark:border-neutral-800">
                          <h3 className="text-sm font-mono text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                            02.1 Work Authorization & Relocation
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-4 border border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/30">
                            <input
                              type="checkbox"
                              id="authCountryRole"
                              checked={formData.workAuthorization.authorizedInCountryOfRole}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  workAuthorization: {
                                    ...formData.workAuthorization,
                                    authorizedInCountryOfRole: e.target.checked
                                  }
                                })
                              }
                              className="w-4 h-4 accent-neutral-900 dark:accent-accent rounded-none cursor-pointer"
                            />
                            <label htmlFor="authCountryRole" className="text-xs font-sans text-gray-700 dark:text-neutral-300 cursor-pointer">
                              Legally authorized to work in India / Application country
                            </label>
                          </div>

                          <div className="flex items-center gap-3 p-4 border border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/30">
                            <input
                              type="checkbox"
                              id="visaNow"
                              checked={formData.workAuthorization.requiresSponsorshipNow}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  workAuthorization: {
                                    ...formData.workAuthorization,
                                    requiresSponsorshipNow: e.target.checked
                                  }
                                })
                              }
                              className="w-4 h-4 accent-neutral-900 dark:accent-accent rounded-none cursor-pointer"
                            />
                            <label htmlFor="visaNow" className="text-xs font-sans text-gray-700 dark:text-neutral-300 cursor-pointer">
                              Requires visa sponsorship now
                            </label>
                          </div>

                          <div className="flex items-center gap-3 p-4 border border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/30">
                            <input
                              type="checkbox"
                              id="visaFuture"
                              checked={formData.workAuthorization.requiresSponsorshipFuture}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  workAuthorization: {
                                    ...formData.workAuthorization,
                                    requiresSponsorshipFuture: e.target.checked
                                  }
                                })
                              }
                              className="w-4 h-4 accent-neutral-900 dark:accent-accent rounded-none cursor-pointer"
                            />
                            <label htmlFor="visaFuture" className="text-xs font-sans text-gray-700 dark:text-neutral-300 cursor-pointer">
                              Requires visa sponsorship in the future
                            </label>
                          </div>

                          <div className="flex items-center gap-3 p-4 border border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/30">
                            <input
                              type="checkbox"
                              id="relocateWilling"
                              checked={formData.workAuthorization.willingToRelocate}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  workAuthorization: {
                                    ...formData.workAuthorization,
                                    willingToRelocate: e.target.checked
                                  }
                                })
                              }
                              className="w-4 h-4 accent-neutral-900 dark:accent-accent rounded-none cursor-pointer"
                            />
                            <label htmlFor="relocateWilling" className="text-xs font-sans text-gray-700 dark:text-neutral-300 cursor-pointer">
                              Willing to relocate for the position
                            </label>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                              Work Mode Preference
                            </label>
                            <input
                              type="text"
                              value={formData.workAuthorization.workModePreference || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  workAuthorization: {
                                    ...formData.workAuthorization,
                                    workModePreference: e.target.value
                                  }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              placeholder="Flexible (Remote / Hybrid / Onsite)"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 02.2 Compensation & Availability */}
                      <div className="space-y-4">
                        <div className="pb-2 border-b border-gray-200 dark:border-neutral-800">
                          <h3 className="text-sm font-mono text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                            02.2 Compensation & Availability
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                              Notice Period
                            </label>
                            <input
                              type="text"
                              value={formData.compensation.noticePeriodDays || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  compensation: { ...formData.compensation, noticePeriodDays: e.target.value }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              placeholder="0 (Immediate)"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                              Earliest Start Date
                            </label>
                            <input
                              type="text"
                              value={formData.compensation.earliestStartDate || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  compensation: { ...formData.compensation, earliestStartDate: e.target.value }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              placeholder="Immediately"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                              Currency
                            </label>
                            <input
                              type="text"
                              value={formData.compensation.currency || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  compensation: { ...formData.compensation, currency: e.target.value }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              placeholder="INR"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                              Current Salary (LPA / Annual)
                            </label>
                            <input
                              type="text"
                              value={formData.compensation.currentSalary || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  compensation: { ...formData.compensation, currentSalary: e.target.value }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              placeholder="Student / Fresher"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                              Expected Salary
                            </label>
                            <input
                              type="text"
                              value={formData.compensation.expectedSalary || ''}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  compensation: { ...formData.compensation, expectedSalary: e.target.value }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              placeholder="Competitive / Open"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 02.3 Education */}
                      <div className="space-y-4">
                        <div className="pb-2 border-b border-gray-200 dark:border-neutral-800">
                          <h3 className="text-sm font-mono text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                            02.3 Academic Details
                          </h3>
                        </div>

                        {formData.education.map((edu, idx) => (
                          <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                                College / University Name
                              </label>
                              <input
                                type="text"
                                value={edu.institution || ''}
                                onChange={(e) => {
                                  const updated = [...formData.education];
                                  updated[idx].institution = e.target.value;
                                  setFormData({ ...formData, education: updated });
                                }}
                                className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                                Degree
                              </label>
                              <input
                                type="text"
                                value={edu.degree || ''}
                                onChange={(e) => {
                                  const updated = [...formData.education];
                                  updated[idx].degree = e.target.value;
                                  setFormData({ ...formData, education: updated });
                                }}
                                className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                                Major / Branch
                              </label>
                              <input
                                type="text"
                                value={edu.major || ''}
                                onChange={(e) => {
                                  const updated = [...formData.education];
                                  updated[idx].major = e.target.value;
                                  setFormData({ ...formData, education: updated });
                                }}
                                className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                                Graduation Year
                              </label>
                              <input
                                type="text"
                                value={edu.graduationYear || ''}
                                onChange={(e) => {
                                  const updated = [...formData.education];
                                  updated[idx].graduationYear = e.target.value;
                                  setFormData({ ...formData, education: updated });
                                }}
                                className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                                GPA / Cumulative Score
                              </label>
                              <input
                                type="text"
                                value={edu.gpa || ''}
                                onChange={(e) => {
                                  const updated = [...formData.education];
                                  updated[idx].gpa = e.target.value;
                                  setFormData({ ...formData, education: updated });
                                }}
                                className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors"
                                placeholder="8.5 / 10"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 02.4 Written Form Templates */}
                      <div className="space-y-4">
                        <div className="pb-2 border-b border-gray-200 dark:border-neutral-800">
                          <h3 className="text-sm font-mono text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                            02.4 Default Written Statements
                          </h3>
                        </div>

                        <div>
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                            Professional Summary (Short Bio for applications)
                          </label>
                          <textarea
                            rows={3}
                            value={formData.statements.professionalSummary || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                statements: { ...formData.statements, professionalSummary: e.target.value }
                              })
                            }
                            className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans leading-relaxed"
                            placeholder="Full stack engineer & CS student passionate about scalable web architecture and applied AI systems..."
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                            Why Work Here / Cover Letter Base Template
                          </label>
                          <textarea
                            rows={3}
                            value={formData.statements.whyOurCompanyTemplate || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                statements: { ...formData.statements, whyOurCompanyTemplate: e.target.value }
                              })
                            }
                            className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans leading-relaxed"
                            placeholder="I admire the engineering craft and high agency environment..."
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ========================================================== */}
                  {/* SECTION 03: KNOWLEDGE VAULT                                */}
                  {/* ========================================================== */}
                  {activeSection === 'knowledge' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-gray-200 dark:border-neutral-800">
                        <div>
                          <p className="text-xs font-mono font-light text-gray-400 dark:text-neutral-500 mb-1">
                            <span className="text-accent font-medium">03</span> &nbsp;&nbsp;KNOWLEDGE VAULT
                          </p>
                          <h2 className="text-2xl sm:text-3xl font-display font-light text-gray-900 dark:text-white tracking-tight">
                            Personal Knowledge Vault & Narratives
                          </h2>
                          <p className="text-sm font-sans font-light text-gray-500 dark:text-neutral-400 mt-1 leading-relaxed max-w-2xl">
                            Extensible repository of long-form stories, architectural decisions, technical trade-offs, and STAR answers used to generate personalized responses.
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setIsAddingKnowledge(!isAddingKnowledge);
                            setEditingKnowledgeId(null);
                          }}
                          className="text-xs font-mono font-medium text-gray-900 dark:text-white border border-gray-900 dark:border-neutral-600 px-3 py-1.5 hover:border-accent hover:bg-accent hover:text-white transition-colors cursor-pointer rounded-none flex items-center gap-1.5 shrink-0"
                        >
                          <PlusIcon className="w-3.5 h-3.5" />
                          <span>{isAddingKnowledge ? 'CANCEL' : 'ADD STORY / TOPIC'}</span>
                        </button>
                      </div>

                      {/* Filter & Search Bar */}
                      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                          {KNOWLEDGE_CATEGORIES.map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setSelectedCategory(cat)}
                              className={`px-3 py-1 text-xs font-mono transition-colors cursor-pointer rounded-none whitespace-nowrap border ${
                                selectedCategory === cat
                                  ? 'border-accent text-accent bg-accent/5 dark:bg-accent/10 font-medium'
                                  : 'border-gray-200 dark:border-neutral-800 text-gray-500 dark:text-neutral-400 hover:border-gray-400 dark:hover:border-neutral-700'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>

                        <div className="w-full md:w-64 relative">
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Filter stories & tags..."
                            className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 pl-8 pr-3 py-1.5 text-xs font-mono text-gray-900 dark:text-white focus:border-accent focus:outline-none rounded-none"
                          />
                          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500 pointer-events-none">
                            <SearchIcon className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>

                      {/* Add Story Form Drawer */}
                      {isAddingKnowledge && (
                        <motion.form
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          onSubmit={handleAddKnowledge}
                          className="p-6 border border-accent/40 bg-accent/5 dark:bg-accent/5 space-y-4 font-sans text-left"
                        >
                          <div className="flex items-center justify-between border-b border-gray-200 dark:border-neutral-800 pb-2">
                            <h3 className="text-base font-display font-light text-gray-900 dark:text-white">
                              Add Engineering Narrative / STAR Story
                            </h3>
                            <button
                              type="button"
                              onClick={handleAiSuggestCategory}
                              disabled={isCategorizingAi}
                              className="text-xs font-mono text-accent hover:underline cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <SparklesIcon className="w-3.5 h-3.5" />
                              <span>{isCategorizingAi ? 'Analyzing...' : 'AI Suggest Tags & Category'}</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                                Story Title / Topic Identifier
                              </label>
                              <input
                                type="text"
                                value={newKnowledge.title}
                                onChange={(e) => setNewKnowledge({ ...newKnowledge, title: e.target.value })}
                                required
                                placeholder="e.g. Scaling SafarSathi PWA offline caching"
                                className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                                Category
                              </label>
                              <select
                                value={newKnowledge.category}
                                onChange={(e) => setNewKnowledge({ ...newKnowledge, category: e.target.value })}
                                className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white"
                              >
                                {KNOWLEDGE_CATEGORIES.filter(c => c !== 'All').map(c => (
                                  <option key={c} value={c}>{c}</option>
                                ))}
                              </select>
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                                Keywords / Retrieval Tags (comma separated)
                              </label>
                              <input
                                type="text"
                                value={newKnowledge.tags}
                                onChange={(e) => setNewKnowledge({ ...newKnowledge, tags: e.target.value })}
                                placeholder="e.g. PWA, Service Worker, IndexedDB, Offline-First, React"
                                className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                              Narrative Content (Full context, metrics, architecture decisions, trade-offs)
                            </label>
                            <textarea
                              rows={6}
                              value={newKnowledge.content}
                              onChange={(e) => setNewKnowledge({ ...newKnowledge, content: e.target.value })}
                              required
                              placeholder="Describe the challenge faced, specific technical steps taken, design patterns chosen, and tangible measurable results achieved..."
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans leading-relaxed"
                            />
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center gap-2 text-xs font-mono text-gray-600 dark:text-neutral-400 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={newKnowledge.pinned}
                                onChange={(e) => setNewKnowledge({ ...newKnowledge, pinned: e.target.checked })}
                                className="w-3.5 h-3.5 accent-neutral-900 dark:accent-accent rounded-none cursor-pointer"
                              />
                              <span>Prioritize in AI retrieval context (Pin story)</span>
                            </label>

                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setIsAddingKnowledge(false)}
                                className="px-3 py-1.5 border border-gray-200 dark:border-neutral-700 text-xs font-mono uppercase text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer rounded-none"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-1.5 bg-gray-900 dark:bg-accent text-white dark:text-black border border-gray-900 dark:border-accent text-xs font-mono uppercase hover:bg-neutral-800 cursor-pointer rounded-none flex items-center gap-1.5"
                              >
                                <PlusIcon className="w-3.5 h-3.5" />
                                <span>Add Story</span>
                              </button>
                            </div>
                          </div>
                        </motion.form>
                      )}

                      {/* Knowledge Items List - Matching Projects.jsx Row Layout */}
                      <div className="border-t border-gray-200 dark:border-neutral-800/80">
                        {filteredKnowledge.length === 0 ? (
                          <div className="py-16 text-center text-xs font-mono text-gray-400 dark:text-neutral-500">
                            No knowledge entries found matching the filter.
                          </div>
                        ) : (
                          filteredKnowledge.map((item, index) => {
                            const isExpanded = expandedKnowledgeId === item.id;
                            const isEditing = editingKnowledgeId === item.id;

                            return (
                              <div
                                key={item.id || index}
                                className="border-b border-gray-200 dark:border-neutral-800/80 py-5 group transition-colors hover:bg-gray-50/40 dark:hover:bg-neutral-900/30 px-2 sm:px-4"
                              >
                                {/* Row Summary */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  {/* Left Category & Index */}
                                  <div className="flex items-center gap-2 min-w-[150px]">
                                    <span className="text-xs font-mono text-gray-400 dark:text-neutral-500 tabular-nums">
                                      {String(index + 1).padStart(2, '0')}
                                    </span>
                                    {item.pinned && (
                                      <span className="text-xs font-mono text-accent font-medium" title="Pinned Context">
                                        [PINNED]
                                      </span>
                                    )}
                                    <span className="text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider">
                                      {item.category}
                                    </span>
                                  </div>

                                  {/* Center: Title & Excerpt */}
                                  <div className="flex-1">
                                    <h4
                                      onClick={() => setExpandedKnowledgeId(isExpanded ? null : item.id)}
                                      className="text-lg font-display font-light text-gray-900 dark:text-white group-hover:text-accent transition-all duration-200 group-hover:translate-x-1 cursor-pointer flex items-center gap-2"
                                    >
                                      <span>{item.title}</span>
                                      <ChevronDownIcon
                                        className={`w-3.5 h-3.5 text-gray-400 dark:text-neutral-500 transition-transform duration-200 ${
                                          isExpanded ? 'rotate-180' : ''
                                        }`}
                                      />
                                    </h4>

                                    {!isExpanded && (
                                      <p className="text-xs text-gray-600 dark:text-neutral-400 font-sans mt-1 line-clamp-1 leading-relaxed">
                                        {item.content}
                                      </p>
                                    )}

                                    {/* Tags */}
                                    {Array.isArray(item.tags) && item.tags.length > 0 && (
                                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                        {item.tags.map((tag, tIdx) => (
                                          <span
                                            key={tIdx}
                                            className="text-[10px] font-mono text-gray-500 dark:text-neutral-400 border border-gray-100 dark:border-neutral-800 px-1.5 py-0.5"
                                          >
                                            #{tag}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  {/* Right: Inline Controls */}
                                  <div className="flex items-center gap-3 sm:gap-4 pl-0 sm:pl-4 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-neutral-800 pt-3 sm:pt-0">
                                    <button
                                      onClick={() => handleTogglePin(item)}
                                      className={`text-xs font-mono cursor-pointer transition-colors ${
                                        item.pinned ? 'text-accent font-semibold' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                      }`}
                                    >
                                      {item.pinned ? 'UNPIN' : 'PIN'}
                                    </button>

                                    <button
                                      onClick={() => {
                                        setEditingKnowledgeId(isEditing ? null : item.id);
                                        if (!isExpanded) setExpandedKnowledgeId(item.id);
                                      }}
                                      className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                                    >
                                      {isEditing ? 'DONE' : 'EDIT'}
                                    </button>

                                    <button
                                      onClick={() => handleDeleteKnowledge(item.id)}
                                      className="text-xs font-mono text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                                    >
                                      DELETE
                                    </button>
                                  </div>
                                </div>

                                {/* Expanded Narrative / Editor */}
                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800/60"
                                    >
                                      {isEditing ? (
                                        <div className="space-y-4">
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                              <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">
                                                Title
                                              </label>
                                              <input
                                                type="text"
                                                value={item.title}
                                                onChange={(e) => {
                                                  const updated = formData.knowledgeVault.map(k =>
                                                    k.id === item.id ? { ...k, title: e.target.value } : k
                                                  );
                                                  setFormData({ ...formData, knowledgeVault: updated });
                                                }}
                                                className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1.5 text-sm font-sans text-gray-900 dark:text-white"
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">
                                                Category
                                              </label>
                                              <select
                                                value={item.category}
                                                onChange={(e) => {
                                                  const updated = formData.knowledgeVault.map(k =>
                                                    k.id === item.id ? { ...k, category: e.target.value } : k
                                                  );
                                                  setFormData({ ...formData, knowledgeVault: updated });
                                                }}
                                                className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1.5 text-sm font-sans text-gray-900 dark:text-white"
                                              >
                                                {KNOWLEDGE_CATEGORIES.filter(c => c !== 'All').map(c => (
                                                  <option key={c} value={c}>{c}</option>
                                                ))}
                                              </select>
                                            </div>
                                          </div>

                                          <div>
                                            <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">
                                              Narrative Content
                                            </label>
                                            <textarea
                                              rows={6}
                                              value={item.content}
                                              onChange={(e) => {
                                                const updated = formData.knowledgeVault.map(k =>
                                                  k.id === item.id ? { ...k, content: e.target.value } : k
                                                );
                                                setFormData({ ...formData, knowledgeVault: updated });
                                              }}
                                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm font-sans text-gray-900 dark:text-white leading-relaxed"
                                            />
                                          </div>

                                          <div className="flex justify-end gap-2">
                                            <button
                                              onClick={() => handleUpdateKnowledge(item)}
                                              className="px-4 py-1.5 bg-gray-900 dark:bg-accent text-white dark:text-black font-mono text-xs uppercase"
                                            >
                                              Save Narrative Changes
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="bg-gray-50/50 dark:bg-neutral-900/40 p-5 border border-gray-200 dark:border-neutral-800/80">
                                          <p className="text-sm text-gray-700 dark:text-neutral-300 font-sans leading-relaxed whitespace-pre-wrap">
                                            {item.content}
                                          </p>
                                          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-neutral-800 text-[10px] font-mono text-gray-400 dark:text-neutral-500 flex items-center justify-between">
                                            <span>Updated: {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'Original'}</span>
                                            <span>Vault Entry ID: {item.id}</span>
                                          </div>
                                        </div>
                                      )}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* ========================================================== */}
                  {/* SECTION 04: CUSTOM ATTRIBUTES                              */}
                  {/* ========================================================== */}
                  {activeSection === 'custom' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-gray-200 dark:border-neutral-800">
                        <div>
                          <p className="text-xs font-mono font-light text-gray-400 dark:text-neutral-500 mb-1">
                            <span className="text-accent font-medium">04</span> &nbsp;&nbsp;CUSTOM ATTRIBUTES
                          </p>
                          <h2 className="text-2xl sm:text-3xl font-display font-light text-gray-900 dark:text-white tracking-tight">
                            Extensible Key-Value Facts
                          </h2>
                          <p className="text-sm font-sans font-light text-gray-500 dark:text-neutral-400 mt-1 leading-relaxed max-w-2xl">
                            Arbitrary structured facts that the browser extension uses when encountering unique employer questions (e.g. t-shirt size, coding editor, commute tolerance).
                          </p>
                        </div>

                        <button
                          onClick={() => setIsAddingField(!isAddingField)}
                          className="text-xs font-mono font-medium text-gray-900 dark:text-white border border-gray-900 dark:border-neutral-600 px-3 py-1.5 hover:border-accent hover:bg-accent hover:text-white transition-colors cursor-pointer rounded-none flex items-center gap-1.5 shrink-0"
                        >
                          <PlusIcon className="w-3.5 h-3.5" />
                          <span>{isAddingField ? 'CANCEL' : 'ADD ATTRIBUTE'}</span>
                        </button>
                      </div>

                      {/* Add Attribute In-place Form */}
                      {isAddingField && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-6 border border-accent/40 bg-accent/5 dark:bg-accent/5 space-y-4 font-sans text-left"
                        >
                          <h3 className="text-base font-display font-light text-gray-900 dark:text-white border-b border-gray-200 dark:border-neutral-800 pb-2">
                            Add New Fact Attribute
                          </h3>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                                Attribute Key (Slug)
                              </label>
                              <input
                                type="text"
                                value={newField.key}
                                onChange={(e) => setNewField({ ...newField, key: e.target.value })}
                                placeholder="e.g. t_shirt_size, preferred_ide"
                                className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm font-mono focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                                Display Label
                              </label>
                              <input
                                type="text"
                                value={newField.label}
                                onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                                placeholder="e.g. T-Shirt Size"
                                className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                                Attribute Value
                              </label>
                              <input
                                type="text"
                                value={newField.value}
                                onChange={(e) => setNewField({ ...newField, value: e.target.value })}
                                placeholder="e.g. L (Large) / VS Code"
                                className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                                Category
                              </label>
                              <select
                                value={newField.category}
                                onChange={(e) => setNewField({ ...newField, category: e.target.value })}
                                className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white"
                              >
                                <option value="General">General</option>
                                <option value="Personal">Personal</option>
                                <option value="Technical">Technical</option>
                                <option value="Logistics">Logistics</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center gap-2 text-xs font-mono text-gray-600 dark:text-neutral-400 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={newField.isSensitive}
                                onChange={(e) => setNewField({ ...newField, isSensitive: e.target.checked })}
                                className="w-3.5 h-3.5 accent-neutral-900 dark:accent-accent rounded-none cursor-pointer"
                              />
                              <span>Mark attribute as confidential / sensitive</span>
                            </label>

                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setIsAddingField(false)}
                                className="px-3 py-1.5 border border-gray-200 dark:border-neutral-700 text-xs font-mono uppercase text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer rounded-none"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={handleAddCustomField}
                                className="px-4 py-1.5 bg-gray-900 dark:bg-accent text-white dark:text-black border border-gray-900 dark:border-accent text-xs font-mono uppercase hover:bg-neutral-800 cursor-pointer rounded-none flex items-center gap-1.5"
                              >
                                <PlusIcon className="w-3.5 h-3.5" />
                                <span>Save Attribute</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Custom Attributes Rows */}
                      <div className="border-t border-gray-200 dark:border-neutral-800/80">
                        {formData.customFields.length === 0 ? (
                          <div className="py-16 text-center text-xs font-mono text-gray-400 dark:text-neutral-500">
                            No custom attributes configured yet. Click "ADD ATTRIBUTE" to create one.
                          </div>
                        ) : (
                          formData.customFields.map((field, idx) => (
                            <div
                              key={idx}
                              className="border-b border-gray-200 dark:border-neutral-800/80 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2 sm:px-4 hover:bg-gray-50/40 dark:hover:bg-neutral-900/30 transition-colors"
                            >
                              <div className="flex items-start sm:items-center gap-4 min-w-[220px]">
                                <span className="text-xs font-mono text-gray-400 dark:text-neutral-500 tabular-nums">
                                  {String(idx + 1).padStart(2, '0')}
                                </span>
                                <div>
                                  <span className="text-sm font-sans font-medium text-gray-900 dark:text-white block">
                                    {field.label}
                                  </span>
                                  <span className="text-[10px] font-mono text-gray-400 dark:text-neutral-500 block">
                                    key: {field.key}
                                  </span>
                                </div>
                              </div>

                              <div className="flex-1">
                                <span className="text-sm font-sans text-gray-700 dark:text-neutral-300">
                                  {field.value}
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono border border-gray-200 dark:border-neutral-800 px-2 py-0.5 text-gray-500 dark:text-neutral-400">
                                  {field.category || 'General'}
                                </span>
                                {field.isSensitive && (
                                  <span className="text-[10px] font-mono text-rose-500 font-semibold">
                                    [CONFIDENTIAL]
                                  </span>
                                )}
                                <button
                                  onClick={() => handleRemoveCustomField(idx)}
                                  className="text-xs font-mono text-red-600 dark:text-red-400 hover:underline cursor-pointer ml-2"
                                >
                                  DELETE
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* ========================================================== */}
                  {/* SECTION 05: AI ENGINE                                      */}
                  {/* ========================================================== */}
                  {activeSection === 'ai' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-gray-200 dark:border-neutral-800">
                        <div>
                          <p className="text-xs font-mono font-light text-gray-400 dark:text-neutral-500 mb-1">
                            <span className="text-accent font-medium">05</span> &nbsp;&nbsp;AI ENGINE
                          </p>
                          <h2 className="text-2xl sm:text-3xl font-display font-light text-gray-900 dark:text-white tracking-tight">
                            Dual-Provider LLM & Inference Engine
                          </h2>
                          <p className="text-sm font-sans font-light text-gray-500 dark:text-neutral-400 mt-1 leading-relaxed max-w-2xl">
                            Configure Groq LPUs or Google Gemini to autonomously answer behavioral recruitment prompts grounded in your Knowledge Vault.
                          </p>
                        </div>

                        <button
                          onClick={handlePingTest}
                          disabled={pinging}
                          className="text-xs font-mono border border-gray-900 dark:border-neutral-600 text-gray-900 dark:text-white px-3 py-1.5 hover:border-accent hover:bg-accent hover:text-white transition-colors cursor-pointer rounded-none disabled:opacity-50 shrink-0 flex items-center gap-1.5"
                        >
                          {pinging ? <RefreshIcon className="w-3.5 h-3.5 animate-spin" /> : null}
                          <span>{pinging ? 'TESTING...' : 'TEST AI CONNECTION'}</span>
                        </button>
                      </div>

                      {/* Ping diagnostic result badge */}
                      {pingResult && (
                        <div
                          className={`p-3.5 border text-xs font-mono flex items-center justify-between ${
                            pingResult.success
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                              : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {pingResult.success ? (
                              <CheckIcon className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <span>✕</span>
                            )}
                            <span>
                              {pingResult.success
                                ? `Connected to ${pingResult.provider.toUpperCase()} (${pingResult.model}) with ${pingResult.latencyMs}ms roundtrip latency`
                                : `Connection error: ${pingResult.error || 'Failed'}`}
                            </span>
                          </div>
                          <button onClick={() => setPingResult(null)} className="cursor-pointer font-bold">✕</button>
                        </div>
                      )}

                      {/* Provider Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Groq Card */}
                        <div
                          onClick={() =>
                            setFormData({
                              ...formData,
                              aiSettings: { ...formData.aiSettings, defaultProvider: 'groq' }
                            })
                          }
                          className={`p-5 border transition-all cursor-pointer ${
                            formData.aiSettings.defaultProvider === 'groq'
                              ? 'border-accent bg-accent/5 dark:bg-accent/10 shadow-sm'
                              : 'border-gray-200 dark:border-neutral-800 hover:border-gray-400 dark:hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-display font-light text-gray-900 dark:text-white">
                              Groq LPUs
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 bg-accent text-white dark:text-black font-medium">
                              RECOMMENDED
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-neutral-400 font-sans leading-relaxed">
                            Ultra-low inference latency (500+ tokens/second). Delivers rapid, precise answers to form prompts directly in your browser.
                          </p>
                        </div>

                        {/* Gemini Card */}
                        <div
                          onClick={() =>
                            setFormData({
                              ...formData,
                              aiSettings: { ...formData.aiSettings, defaultProvider: 'gemini' }
                            })
                          }
                          className={`p-5 border transition-all cursor-pointer ${
                            formData.aiSettings.defaultProvider === 'gemini'
                              ? 'border-accent bg-accent/5 dark:bg-accent/10 shadow-sm'
                              : 'border-gray-200 dark:border-neutral-800 hover:border-gray-400 dark:hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-display font-light text-gray-900 dark:text-white">
                              Google Gemini
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 border border-gray-200 dark:border-neutral-800 text-gray-500">
                              LARGE CONTEXT
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-neutral-400 font-sans leading-relaxed">
                            Large context window for processing comprehensive document context and long technical essays.
                          </p>
                        </div>
                      </div>

                      {/* Model & System Tone Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                            Active Model Selection
                          </label>
                          {formData.aiSettings.defaultProvider === 'groq' ? (
                            <select
                              value={formData.aiSettings.groqModel || 'qwen/qwen3.8-27b'}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  aiSettings: { ...formData.aiSettings, groqModel: e.target.value }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-xs font-mono text-gray-900 dark:text-white focus:border-accent focus:outline-none rounded-none"
                            >
                              {GROQ_MODELS.map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <select
                              value={formData.aiSettings.geminiModel || 'gemini-3.6-flash'}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  aiSettings: { ...formData.aiSettings, geminiModel: e.target.value }
                                })
                              }
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-xs font-mono text-gray-900 dark:text-white focus:border-accent focus:outline-none rounded-none"
                            >
                              {GEMINI_MODELS.map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        <div>
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1.5">
                            Custom Persona Tone (Optional override)
                          </label>
                          <input
                            type="text"
                            value={formData.aiSettings.systemPrompt || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                aiSettings: { ...formData.aiSettings, systemPrompt: e.target.value }
                              })
                            }
                            placeholder="e.g. Grounded engineer writing in first-person (I/me) with technical metrics"
                            className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-accent focus:outline-none rounded-none"
                          />
                        </div>
                      </div>

                      {/* Interactive Question Sandbox */}
                      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-neutral-800">
                        <div>
                          <h3 className="text-sm font-mono text-gray-700 dark:text-neutral-300 uppercase tracking-wider mb-1">
                            Interactive Generation Sandbox
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-neutral-400 font-sans mb-3">
                            Test how the AI retrieves your Knowledge Vault stories and synthesizes tailored responses to recruitment prompts.
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <input
                            type="text"
                            value={aiTestPrompt}
                            onChange={(e) => setAiTestPrompt(e.target.value)}
                            placeholder="e.g. Describe a challenging bug you fixed or why you want to work here."
                            className="flex-1 border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:border-accent focus:outline-none rounded-none"
                          />
                          <button
                            type="button"
                            onClick={handleTestAiSandbox}
                            disabled={aiTesting || !aiTestPrompt.trim()}
                            className="px-5 py-2.5 bg-gray-900 dark:bg-accent text-white dark:text-black border border-gray-900 dark:border-accent font-mono text-xs uppercase hover:bg-neutral-800 cursor-pointer rounded-none disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
                          >
                            {aiTesting ? (
                              <>
                                <RefreshIcon className="w-3.5 h-3.5 animate-spin" />
                                <span>GENERATING...</span>
                              </>
                            ) : (
                              <span>RUN TEST GENERATION</span>
                            )}
                          </button>
                        </div>

                        {/* Test Result Display */}
                        {aiTestResult && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-5 border border-accent bg-gray-50/50 dark:bg-neutral-900/50 space-y-4 font-sans text-left"
                          >
                            <div className="flex items-center justify-between border-b border-gray-200 dark:border-neutral-800 pb-2 text-[10px] font-mono text-gray-500 dark:text-neutral-400">
                              <span>MODEL: {aiTestResult.model}</span>
                              <span>LATENCY: {aiTestResult.latencyMs}ms</span>
                            </div>

                            <p className="text-sm text-gray-900 dark:text-neutral-100 leading-relaxed whitespace-pre-wrap font-sans">
                              {aiTestResult.answer}
                            </p>

                            {Array.isArray(aiTestResult.retrievedKnowledge) && aiTestResult.retrievedKnowledge.length > 0 && (
                              <div className="pt-3 border-t border-gray-200 dark:border-neutral-800">
                                <p className="text-[10px] font-mono text-accent uppercase tracking-wider mb-1.5">
                                  Grounding Citations Retrieved from Vault:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {aiTestResult.retrievedKnowledge.map((k, kIdx) => (
                                    <span
                                      key={kIdx}
                                      className="text-[10px] font-mono px-2 py-0.5 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-neutral-300"
                                    >
                                      {k.title}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* ========================================================== */}
                  {/* SECTION 06: EXTENSION PAIRING                              */}
                  {/* ========================================================== */}
                  {activeSection === 'pairing' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                      <div>
                        <p className="text-xs font-mono font-light text-gray-400 dark:text-neutral-500 mb-1">
                          <span className="text-accent font-medium">06</span> &nbsp;&nbsp;EXTENSION PAIRING
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-display font-light text-gray-900 dark:text-white tracking-tight">
                          Browser Extension Authentication Key
                        </h2>
                        <p className="text-sm font-sans font-light text-gray-500 dark:text-neutral-400 mt-1 leading-relaxed max-w-2xl">
                          Pair your Chrome, Brave, Edge, or Firefox browser extension to your portfolio database using this private pairing token.
                        </p>
                      </div>

                      {/* Secret Key Container */}
                      <div className="p-6 border border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/30 space-y-4">
                        <p className="text-xs text-gray-600 dark:text-neutral-400 font-sans leading-relaxed">
                          Your browser extension uses this secret token to authenticate and securely fetch your personal facts, stories, and AI generations without exposing your login credentials.
                        </p>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                          <div className="flex-1 p-3.5 bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 font-mono text-xs sm:text-sm text-gray-900 dark:text-white tracking-widest break-all select-all">
                            {formData.extensionApiKey || 'No active pairing key generated yet.'}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleCopyKey}
                              disabled={!formData.extensionApiKey}
                              className="px-4 py-3 bg-gray-900 dark:bg-accent text-white dark:text-black border border-gray-900 dark:border-accent font-mono text-xs uppercase hover:bg-neutral-800 cursor-pointer rounded-none disabled:opacity-50 whitespace-nowrap flex items-center gap-1.5"
                            >
                              {copiedKey ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                              <span>{copiedKey ? 'COPIED' : 'COPY KEY'}</span>
                            </button>

                            <button
                              onClick={handleGenerateKey}
                              disabled={generatingKey}
                              className="px-4 py-3 border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 font-mono text-xs uppercase hover:border-gray-900 dark:hover:border-neutral-400 cursor-pointer rounded-none disabled:opacity-50 whitespace-nowrap flex items-center gap-1.5"
                            >
                              {generatingKey ? <RefreshIcon className="w-4 h-4 animate-spin" /> : null}
                              <span>{generatingKey ? 'GENERATING...' : 'REGENERATE'}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Setup Instructions */}
                      <div className="space-y-4">
                        <div className="pb-2 border-b border-gray-200 dark:border-neutral-800">
                          <h3 className="text-sm font-mono text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                            Pairing Setup Guide
                          </h3>
                        </div>

                        <div className="space-y-3">
                          {[
                            {
                              step: '01',
                              title: 'Open Extension Settings',
                              desc: 'Click the Form Filler icon in your browser toolbar and click the Settings icon.'
                            },
                            {
                              step: '02',
                              title: 'Configure Portfolio URL & Key',
                              desc: `Set the Portfolio URL to "${window.location.origin}" and paste the Secret Key from above.`
                            },
                            {
                              step: '03',
                              title: 'Test & Activate Autofill',
                              desc: 'Click "Test Connection". The extension will now automatically detect recruitment form fields and offer 1-click filling.'
                            }
                          ].map((s) => (
                            <div
                              key={s.step}
                              className="flex items-start gap-4 p-4 border border-gray-200 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/20"
                            >
                              <span className="text-sm font-mono text-accent font-medium">{s.step}</span>
                              <div>
                                <h4 className="text-sm font-display font-light text-gray-900 dark:text-white">
                                  {s.title}
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-neutral-400 font-sans mt-0.5 leading-relaxed">
                                  {s.desc}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
