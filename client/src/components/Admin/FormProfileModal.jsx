import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin, API_URL } from '../../context/AdminContext';

const TABS = [
  { id: 'facts', num: '01', label: 'Facts & Identity' },
  { id: 'career', num: '02', label: 'Career & Visas' },
  { id: 'knowledge', num: '03', label: 'Knowledge Vault' },
  { id: 'custom', num: '04', label: 'Custom Attributes' },
  { id: 'ai', num: '05', label: 'AI Engine' },
  { id: 'pairing', num: '06', label: 'Extension Pairing' }
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
  { id: 'qwen/qwen3.8-27b', name: 'Qwen 3.8 27B (Recommended - Fast & Accurate)' },
  { id: 'openai/gpt-oss-120b', name: 'GPT OSS 120B (Deep Reasoning)' },
  { id: 'openai/gpt-oss-20b', name: 'GPT OSS 20B (Lightweight)' },
  { id: 'groq/compound', name: 'Groq Compound (Multi-agent router)' }
];

const GEMINI_MODELS = [
  { id: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash (Latest Standard)' },
  { id: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash' },
  { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash' },
  { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash' }
];

export default function FormProfileModal({ isOpen, onClose }) {
  const { token } = useAdmin();

  const [activeTab, setActiveTab] = useState('facts');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Core FormProfile State
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

  // Knowledge Vault State
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

  // Custom Fields State
  const [newField, setNewField] = useState({
    key: '',
    label: '',
    value: '',
    category: 'General',
    isSensitive: false
  });
  const [isAddingField, setIsAddingField] = useState(false);

  // AI Sandbox & Diagnostics State
  const [aiTestPrompt, setAiTestPrompt] = useState('Why should our engineering team hire you for a full stack role?');
  const [aiTestResult, setAiTestResult] = useState(null);
  const [aiTesting, setAiTesting] = useState(false);
  const [pingResult, setPingResult] = useState(null);
  const [pinging, setPinging] = useState(false);

  // Key Copy & Generation State
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
    if (isOpen) {
      fetchFormProfile();
      setMessage({ text: '', type: '' });
      setAiTestResult(null);
      setPingResult(null);
    }
  }, [isOpen]);

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
        setMessage({ text: 'Profile & Knowledge Vault successfully saved.', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 4000);
      } else {
        setMessage({ text: data.message || 'Failed to save profile.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Network error saving profile.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Generate / Regenerate API Key
  const handleGenerateKey = async () => {
    if (!window.confirm('Generating a new extension key will disconnect any previously paired extensions. Continue?')) {
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

  // Copy API key to clipboard
  const handleCopyKey = () => {
    if (!formData.extensionApiKey) return;
    navigator.clipboard.writeText(formData.extensionApiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Add Knowledge Entry
  const handleAddKnowledge = async (e) => {
    e.preventDefault();
    if (!newKnowledge.title.trim() || !newKnowledge.content.trim()) {
      setMessage({ text: 'Title and narrative content are required.', type: 'error' });
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
        setMessage({ text: 'New knowledge item added to vault.', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      }
    } catch (err) {
      setMessage({ text: 'Failed to add knowledge item.', type: 'error' });
    }
  };

  // Update Knowledge Entry
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
        setMessage({ text: 'Knowledge entry updated.', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      }
    } catch (err) {
      setMessage({ text: 'Failed to update knowledge item.', type: 'error' });
    }
  };

  // Delete Knowledge Entry
  const handleDeleteKnowledge = async (id) => {
    if (!window.confirm('Delete this knowledge entry from your vault?')) return;
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
        setMessage({ text: 'Knowledge entry deleted.', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      }
    } catch (err) {
      setMessage({ text: 'Failed to delete knowledge entry.', type: 'error' });
    }
  };

  // Toggle Pin on Knowledge Entry
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
      setMessage({ text: 'Enter a title or draft text first so the AI can analyze it.', type: 'error' });
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

  // Interactive AI Question Sandbox Test
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
        setMessage({ text: data.message || 'AI generation failed', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Error contacting AI engine', type: 'error' });
    } finally {
      setAiTesting(false);
    }
  };

  // Filtered Knowledge Vault Items
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
    // Pinned first, then by title
    return [...items].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [formData.knowledgeVault, selectedCategory, searchQuery]);

  // Add Custom Field
  const handleAddCustomField = () => {
    if (!newField.key.trim() || !newField.value.trim()) {
      setMessage({ text: 'Field identifier and value are required.', type: 'error' });
      return;
    }
    const cleanKey = newField.key.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const existing = formData.customFields.find(f => f.key === cleanKey);
    if (existing) {
      setMessage({ text: `A field with key "${cleanKey}" already exists.`, type: 'error' });
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
    setMessage({ text: `Added custom field "${cleanKey}". Remember to click SAVE PROFILE.`, type: 'success' });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  // Remove Custom Field
  const handleRemoveCustomField = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 dark:bg-black/85 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 14 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-neutral-100 w-full max-w-5xl h-[92vh] max-h-[920px] flex flex-col shadow-2xl overflow-hidden font-sans rounded-none"
        >
          {/* Header Bar - Exactly matches Portfolio Header & JsonEditorModal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-neutral-800 bg-gray-50/70 dark:bg-neutral-900/40 gap-3">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-400 dark:text-neutral-500 font-mono font-light mb-0.5">
                <span className="text-accent font-medium">00</span> &nbsp;&nbsp;AUTOFILL DATA REPOSITORY
              </p>
              <h2 className="text-xl sm:text-2xl font-display font-light text-gray-900 dark:text-white tracking-tight">
                Personal Form Profile & Knowledge Vault
              </h2>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveProfile}
                disabled={saving || loading}
                className="text-xs font-mono font-medium text-white bg-gray-900 dark:bg-accent dark:text-black border border-gray-900 dark:border-accent px-4 py-2 hover:bg-neutral-800 dark:hover:bg-accent/90 transition-colors cursor-pointer rounded-none flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="animate-spin inline-block">⟳</span>
                    <span>SAVING...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>SAVE PROFILE</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-2 text-lg font-mono leading-none cursor-pointer"
                title="Close modal (Esc)"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Feedback Banner */}
          {message.text && (
            <div
              className={`px-4 sm:px-6 py-2.5 text-xs font-mono border-b flex items-center justify-between ${
                message.type === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{message.type === 'error' ? '✕' : '✓'}</span>
                <span>{message.text}</span>
              </span>
              <button onClick={() => setMessage({ text: '', type: '' })} className="cursor-pointer font-mono">
                ✕
              </button>
            </div>
          )}

          {/* Editorial Tab Bar - Mirrors Portfolio Navigation */}
          <div className="flex items-center overflow-x-auto border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 sm:px-6 gap-2 sm:gap-6 scrollbar-none">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              let badgeCount = null;
              if (tab.id === 'knowledge') badgeCount = formData.knowledgeVault?.length || 0;
              if (tab.id === 'custom') badgeCount = formData.customFields?.length || 0;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 text-xs sm:text-sm font-sans font-light transition-all border-b-2 -mb-px flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'border-accent text-gray-900 dark:text-white font-medium'
                      : 'border-transparent text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <span className="text-[10px] font-mono font-light text-gray-400 dark:text-neutral-500">
                    {tab.num}
                  </span>
                  <span>{tab.label}</span>
                  {badgeCount !== null && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 border border-gray-200 dark:border-neutral-800 text-gray-500 dark:text-neutral-400 tabular-nums">
                      {badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Body Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-white dark:bg-neutral-950">
            {loading ? (
              <div className="h-full flex items-center justify-center font-mono text-xs text-gray-400 dark:text-neutral-500 gap-3">
                <span className="animate-spin inline-block text-accent">⟳</span>
                LOADING PROFILE DATA FROM DATABASE...
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-10">
                {/* ============================================================ */}
                {/* TAB 01: FACTS & IDENTITY */}
                {/* ============================================================ */}
                {activeTab === 'facts' && (
                  <div className="space-y-10">
                    {/* Section 01.1: Personal Identity */}
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-neutral-800 mb-5">
                        <p className="text-xs font-mono font-light text-gray-400 dark:text-neutral-500">
                          <span className="text-accent font-medium">01.1</span> &nbsp;&nbsp;LEGAL IDENTITY & NAMES
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
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
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
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
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
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
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
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
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
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

                    {/* Section 01.2: Contact & Location */}
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-neutral-800 mb-5">
                        <p className="text-xs font-mono font-light text-gray-400 dark:text-neutral-500">
                          <span className="text-accent font-medium">01.2</span> &nbsp;&nbsp;LOCATION & CONTACT
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
                            Street Address (Line 1)
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
                            placeholder="Apartment, suite, street"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
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
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
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
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
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
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
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
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
                            Alternate Phone
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

                    {/* Section 01.3: Nationality & Citizenship */}
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-neutral-800 mb-5">
                        <p className="text-xs font-mono font-light text-gray-400 dark:text-neutral-500">
                          <span className="text-accent font-medium">01.3</span> &nbsp;&nbsp;NATIONALITY & CITIZENSHIP
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
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
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
                            Country of Citizenship
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
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
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

                    {/* Section 01.4: Professional Links */}
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-neutral-800 mb-5">
                        <p className="text-xs font-mono font-light text-gray-400 dark:text-neutral-500">
                          <span className="text-accent font-medium">01.4</span> &nbsp;&nbsp;PORTFOLIO & PROFILE LINKS
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
                            LinkedIn URL
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
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
                            GitHub URL
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
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
                            Portfolio Website
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
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
                            Twitter / X URL (Optional)
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
                  </div>
                )}

                {/* ============================================================ */}
                {/* TAB 02: CAREER & VISAS */}
                {/* ============================================================ */}
                {activeTab === 'career' && (
                  <div className="space-y-10">
                    {/* Section 02.1: Work Authorization & Relocation */}
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-neutral-800 mb-5">
                        <p className="text-xs font-mono font-light text-gray-400 dark:text-neutral-500">
                          <span className="text-accent font-medium">02.1</span> &nbsp;&nbsp;WORK AUTHORIZATION & RELOCATION
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/30">
                          <input
                            type="checkbox"
                            id="authRole"
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
                          <label htmlFor="authRole" className="text-xs font-sans text-gray-700 dark:text-neutral-300 cursor-pointer">
                            Legally authorized to work in India / Country of application
                          </label>
                        </div>

                        <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/30">
                          <input
                            type="checkbox"
                            id="sponsorshipNow"
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
                          <label htmlFor="sponsorshipNow" className="text-xs font-sans text-gray-700 dark:text-neutral-300 cursor-pointer">
                            Requires visa sponsorship now
                          </label>
                        </div>

                        <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/30">
                          <input
                            type="checkbox"
                            id="sponsorshipFuture"
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
                          <label htmlFor="sponsorshipFuture" className="text-xs font-sans text-gray-700 dark:text-neutral-300 cursor-pointer">
                            Requires visa sponsorship in the future
                          </label>
                        </div>

                        <div className="flex items-center gap-3 p-3 border border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/30">
                          <input
                            type="checkbox"
                            id="relocate"
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
                          <label htmlFor="relocate" className="text-xs font-sans text-gray-700 dark:text-neutral-300 cursor-pointer">
                            Willing to relocate for the role
                          </label>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
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

                    {/* Section 02.2: Compensation & Availability */}
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-neutral-800 mb-5">
                        <p className="text-xs font-mono font-light text-gray-400 dark:text-neutral-500">
                          <span className="text-accent font-medium">02.2</span> &nbsp;&nbsp;AVAILABILITY & COMPENSATION
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
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
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
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
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
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
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
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
                            placeholder="e.g. Student / Intern"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
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
                            placeholder="Open / Competitive"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 02.3: Education Details */}
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-neutral-800 mb-5">
                        <p className="text-xs font-mono font-light text-gray-400 dark:text-neutral-500">
                          <span className="text-accent font-medium">02.3</span> &nbsp;&nbsp;ACADEMIC INSTITUTION & DEGREE
                        </p>
                      </div>

                      {formData.education.map((edu, idx) => (
                        <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
                              College / University
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
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
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
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
                              Major / Specialization
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
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
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
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
                              GPA / Percentage
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
                              placeholder="e.g. 8.5 / 10"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Section 02.4: Core Written Statements */}
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-neutral-800 mb-5">
                        <p className="text-xs font-mono font-light text-gray-400 dark:text-neutral-500">
                          <span className="text-accent font-medium">02.4</span> &nbsp;&nbsp;DEFAULT FORM STATEMENTS
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
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
                            className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors leading-relaxed"
                            placeholder="Full Stack developer & computer science student passionate about high-performance web systems and AI..."
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider mb-1">
                            Why Work Here / Cover Letter Template
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
                            className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white font-sans transition-colors leading-relaxed"
                            placeholder="I admire the engineering excellence and product culture..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ============================================================ */}
                {/* TAB 03: KNOWLEDGE VAULT */}
                {/* ============================================================ */}
                {activeTab === 'knowledge' && (
                  <div className="space-y-6">
                    {/* Vault Header Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-neutral-800">
                      <div>
                        <p className="text-xs font-mono font-light text-gray-400 dark:text-neutral-500">
                          <span className="text-accent font-medium">03</span> &nbsp;&nbsp;PERSONAL KNOWLEDGE VAULT
                        </p>
                        <p className="text-xs text-gray-600 dark:text-neutral-400 font-sans mt-1">
                          Narrative repository for behavioral questions, project stories, architectural decisions, and career philosophy.
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setIsAddingKnowledge(!isAddingKnowledge);
                            setEditingKnowledgeId(null);
                          }}
                          className="text-xs font-mono font-medium text-gray-900 dark:text-white border border-gray-900 dark:border-neutral-600 px-3 py-1.5 hover:border-accent hover:bg-accent hover:text-white transition-colors cursor-pointer rounded-none"
                        >
                          {isAddingKnowledge ? '✕ CANCEL' : '+ ADD STORY / TOPIC'}
                        </button>
                      </div>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                      {/* Monospace Category Pills */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                        {KNOWLEDGE_CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-2.5 py-1 text-[11px] font-mono transition-colors cursor-pointer rounded-none whitespace-nowrap border ${
                              selectedCategory === cat
                                ? 'border-accent text-accent bg-accent/5 dark:bg-accent/10 font-medium'
                                : 'border-gray-200 dark:border-neutral-800 text-gray-500 dark:text-neutral-400 hover:border-gray-400 dark:hover:border-neutral-700'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      {/* Search Box */}
                      <div className="w-full md:w-64">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search stories, tags..."
                          className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1.5 text-xs font-mono text-gray-900 dark:text-white focus:border-accent focus:outline-none rounded-none"
                        />
                      </div>
                    </div>

                    {/* Add New Knowledge Story Form */}
                    {isAddingKnowledge && (
                      <motion.form
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleAddKnowledge}
                        className="p-5 border border-accent/40 bg-accent/5 dark:bg-accent/5 space-y-4 font-sans text-left"
                      >
                        <div className="flex items-center justify-between border-b border-gray-200 dark:border-neutral-800 pb-2">
                          <h3 className="text-sm font-display font-light text-gray-900 dark:text-white">
                            New Story or Technical Narrative
                          </h3>
                          <button
                            type="button"
                            onClick={handleAiSuggestCategory}
                            disabled={isCategorizingAi}
                            className="text-xs font-mono text-accent hover:underline cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                            title="Let Groq/Gemini analyze your narrative and suggest category & tags"
                          >
                            <span>✨</span> {isCategorizingAi ? 'Analyzing...' : 'AI Suggest Category & Tags'}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase mb-1">
                              Story Title / Topic Name
                            </label>
                            <input
                              type="text"
                              value={newKnowledge.title}
                              onChange={(e) => setNewKnowledge({ ...newKnowledge, title: e.target.value })}
                              required
                              placeholder="e.g. Scaling SafarSathi PWA offline caching"
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1.5 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase mb-1">
                              Category
                            </label>
                            <select
                              value={newKnowledge.category}
                              onChange={(e) => setNewKnowledge({ ...newKnowledge, category: e.target.value })}
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1.5 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white"
                            >
                              {KNOWLEDGE_CATEGORIES.filter(c => c !== 'All').map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase mb-1">
                              Keywords / Tags (comma separated)
                            </label>
                            <input
                              type="text"
                              value={newKnowledge.tags}
                              onChange={(e) => setNewKnowledge({ ...newKnowledge, tags: e.target.value })}
                              placeholder="e.g. PWA, Service Worker, IndexedDB, React, Caching"
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1.5 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase mb-1">
                            Narrative Content (Full details, STAR method, technical challenges & metrics)
                          </label>
                          <textarea
                            rows={6}
                            value={newKnowledge.content}
                            onChange={(e) => setNewKnowledge({ ...newKnowledge, content: e.target.value })}
                            required
                            placeholder="Describe the situation, technical decisions made, hurdles faced, and tangible outcomes achieved..."
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
                            Pin to top of knowledge vault
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
                              className="px-4 py-1.5 bg-gray-900 dark:bg-accent text-white dark:text-black border border-gray-900 dark:border-accent text-xs font-mono uppercase hover:bg-neutral-800 cursor-pointer rounded-none"
                            >
                              Add to Vault
                            </button>
                          </div>
                        </div>
                      </motion.form>
                    )}

                    {/* Knowledge Items List - Architectural Row Layout matching Projects.jsx */}
                    <div className="border-t border-gray-200 dark:border-neutral-800/80">
                      {filteredKnowledge.length === 0 ? (
                        <div className="py-12 text-center text-xs font-mono text-gray-400 dark:text-neutral-500">
                          No knowledge entries found matching your filter.
                        </div>
                      ) : (
                        filteredKnowledge.map((item, index) => {
                          const isExpanded = expandedKnowledgeId === item.id;
                          const isEditing = editingKnowledgeId === item.id;

                          return (
                            <div
                              key={item.id || index}
                              className="border-b border-gray-200 dark:border-neutral-800/80 py-4 group transition-colors hover:bg-gray-50/40 dark:hover:bg-neutral-900/30 px-2 sm:px-3"
                            >
                              {/* Row Summary */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                {/* Left Category & Index */}
                                <div className="flex items-center gap-2 min-w-[150px]">
                                  <span className="text-[11px] font-mono text-gray-400 dark:text-neutral-500 tabular-nums">
                                    {String(index + 1).padStart(2, '0')}
                                  </span>
                                  {item.pinned && (
                                    <span className="text-xs text-amber-500" title="Pinned">★</span>
                                  )}
                                  <span className="text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase tracking-wider">
                                    {item.category}
                                  </span>
                                </div>

                                {/* Center: Title & Excerpt */}
                                <div className="flex-1">
                                  <h4
                                    onClick={() => setExpandedKnowledgeId(isExpanded ? null : item.id)}
                                    className="text-base sm:text-lg font-display font-light text-gray-900 dark:text-white group-hover:text-accent transition-all duration-200 group-hover:translate-x-1 cursor-pointer flex items-center gap-2"
                                  >
                                    <span>{item.title}</span>
                                    <span className="text-xs font-mono text-gray-400 dark:text-neutral-500">
                                      {isExpanded ? '▾' : '▸'}
                                    </span>
                                  </h4>

                                  {!isExpanded && (
                                    <p className="text-xs text-gray-600 dark:text-neutral-400 font-sans mt-1 line-clamp-1 leading-relaxed">
                                      {item.content}
                                    </p>
                                  )}

                                  {/* Tags */}
                                  {Array.isArray(item.tags) && item.tags.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                      {item.tags.map((tag, tIdx) => (
                                        <span
                                          key={tIdx}
                                          className="text-[10px] font-mono text-gray-400 dark:text-neutral-500 border border-gray-100 dark:border-neutral-800 px-1.5 py-0.5"
                                        >
                                          #{tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Right: Inline Action Controls */}
                                <div className="flex items-center gap-3 sm:gap-4 pl-0 sm:pl-4 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-neutral-800 pt-2 sm:pt-0">
                                  <button
                                    onClick={() => handleTogglePin(item)}
                                    className={`text-xs font-mono cursor-pointer transition-colors ${
                                      item.pinned ? 'text-amber-500' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                    title={item.pinned ? 'Unpin' : 'Pin to top'}
                                  >
                                    {item.pinned ? '★ PINNED' : '☆ PIN'}
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

                              {/* Expanded Narrative View / In-line Editor */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800/60"
                                  >
                                    {isEditing ? (
                                      <div className="space-y-3">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2.5 py-1.5 text-xs font-sans text-gray-900 dark:text-white"
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
                                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2.5 py-1.5 text-xs font-sans text-gray-900 dark:text-white"
                                            >
                                              {KNOWLEDGE_CATEGORIES.filter(c => c !== 'All').map(c => (
                                                <option key={c} value={c}>{c}</option>
                                              ))}
                                            </select>
                                          </div>
                                        </div>

                                        <div>
                                          <label className="block text-[10px] text-gray-500 font-mono uppercase mb-1">
                                            Narrative Story Text
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
                                            className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-xs font-sans text-gray-900 dark:text-white leading-relaxed"
                                          />
                                        </div>

                                        <div className="flex justify-end gap-2">
                                          <button
                                            onClick={() => handleUpdateKnowledge(item)}
                                            className="px-3 py-1 bg-gray-900 dark:bg-accent text-white dark:text-black font-mono text-xs uppercase"
                                          >
                                            Save Changes
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="bg-gray-50/50 dark:bg-neutral-900/40 p-4 border border-gray-200 dark:border-neutral-800/80">
                                        <p className="text-xs text-gray-700 dark:text-neutral-300 font-sans leading-relaxed whitespace-pre-wrap">
                                          {item.content}
                                        </p>
                                        <div className="mt-3 pt-2 border-t border-gray-200 dark:border-neutral-800 text-[10px] font-mono text-gray-400 dark:text-neutral-500 flex items-center justify-between">
                                          <span>Updated: {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'Original'}</span>
                                          <span>Vault ID: {item.id}</span>
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
                  </div>
                )}

                {/* ============================================================ */}
                {/* TAB 04: CUSTOM ATTRIBUTES */}
                {/* ============================================================ */}
                {activeTab === 'custom' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-neutral-800">
                      <div>
                        <p className="text-xs font-mono font-light text-gray-400 dark:text-neutral-500">
                          <span className="text-accent font-medium">04</span> &nbsp;&nbsp;CUSTOM ATTRIBUTES & FACTS
                        </p>
                        <p className="text-xs text-gray-600 dark:text-neutral-400 font-sans mt-1">
                          Dynamic key-value facts that the browser extension automatically resolves when encountering specific recruitment inputs.
                        </p>
                      </div>

                      <button
                        onClick={() => setIsAddingField(!isAddingField)}
                        className="text-xs font-mono font-medium text-gray-900 dark:text-white border border-gray-900 dark:border-neutral-600 px-3 py-1.5 hover:border-accent hover:bg-accent hover:text-white transition-colors cursor-pointer rounded-none self-start sm:self-auto"
                      >
                        {isAddingField ? '✕ CANCEL' : '+ ADD ATTRIBUTE'}
                      </button>
                    </div>

                    {/* Add Attribute In-place Form */}
                    {isAddingField && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 border border-accent/40 bg-accent/5 dark:bg-accent/5 space-y-4 font-sans text-left"
                      >
                        <h3 className="text-sm font-display font-light text-gray-900 dark:text-white border-b border-gray-200 dark:border-neutral-800 pb-2">
                          Add Custom Fact
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase mb-1">
                              Field Key (Slug identifier)
                            </label>
                            <input
                              type="text"
                              value={newField.key}
                              onChange={(e) => setNewField({ ...newField, key: e.target.value })}
                              placeholder="e.g. t_shirt_size, favorite_editor"
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1.5 text-sm font-mono focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase mb-1">
                              Display Label
                            </label>
                            <input
                              type="text"
                              value={newField.label}
                              onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                              placeholder="e.g. T-Shirt Size"
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1.5 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase mb-1">
                              Value
                            </label>
                            <input
                              type="text"
                              value={newField.value}
                              onChange={(e) => setNewField({ ...newField, value: e.target.value })}
                              placeholder="e.g. L (Large) / VS Code / Neovim"
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1.5 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase mb-1">
                              Category
                            </label>
                            <select
                              value={newField.category}
                              onChange={(e) => setNewField({ ...newField, category: e.target.value })}
                              className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1.5 text-sm focus:border-gray-900 dark:focus:border-accent focus:outline-none rounded-none text-gray-900 dark:text-white"
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
                            Mark as sensitive fact
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
                              className="px-4 py-1.5 bg-gray-900 dark:bg-accent text-white dark:text-black border border-gray-900 dark:border-accent text-xs font-mono uppercase hover:bg-neutral-800 cursor-pointer rounded-none"
                            >
                              Add Attribute
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Custom Attributes List */}
                    <div className="border-t border-gray-200 dark:border-neutral-800/80">
                      {formData.customFields.length === 0 ? (
                        <div className="py-12 text-center text-xs font-mono text-gray-400 dark:text-neutral-500">
                          No custom attributes defined yet. Add attributes like preferred editor, t-shirt size, or custom identifiers.
                        </div>
                      ) : (
                        formData.customFields.map((field, idx) => (
                          <div
                            key={idx}
                            className="border-b border-gray-200 dark:border-neutral-800/80 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 sm:px-3 hover:bg-gray-50/40 dark:hover:bg-neutral-900/30 transition-colors"
                          >
                            <div className="flex items-start sm:items-center gap-3 min-w-[200px]">
                              <span className="text-[11px] font-mono text-gray-400 dark:text-neutral-500 tabular-nums">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                              <div>
                                <span className="text-xs font-mono text-gray-900 dark:text-white font-medium block">
                                  {field.label}
                                </span>
                                <span className="text-[10px] font-mono text-gray-400 dark:text-neutral-500 block">
                                  key: {field.key}
                                </span>
                              </div>
                            </div>

                            <div className="flex-1">
                              <span className="text-xs font-sans text-gray-700 dark:text-neutral-300">
                                {field.value}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-mono border border-gray-200 dark:border-neutral-800 px-2 py-0.5 text-gray-500 dark:text-neutral-400">
                                {field.category || 'General'}
                              </span>
                              {field.isSensitive && (
                                <span className="text-[10px] font-mono text-rose-500" title="Sensitive">
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
                  </div>
                )}

                {/* ============================================================ */}
                {/* TAB 05: AI ENGINE */}
                {/* ============================================================ */}
                {activeTab === 'ai' && (
                  <div className="space-y-10">
                    {/* Section 05.1: Model & Provider Configuration */}
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-neutral-800 mb-5">
                        <p className="text-xs font-mono font-light text-gray-400 dark:text-neutral-500">
                          <span className="text-accent font-medium">05.1</span> &nbsp;&nbsp;LLM PROVIDER ARCHITECTURE
                        </p>

                        <button
                          onClick={handlePingTest}
                          disabled={pinging}
                          className="text-xs font-mono border border-gray-900 dark:border-neutral-600 text-gray-900 dark:text-white px-3 py-1 hover:border-accent hover:bg-accent hover:text-white transition-colors cursor-pointer rounded-none disabled:opacity-50"
                        >
                          {pinging ? 'TESTING CONNECTION...' : '⚡ TEST AI CONNECTION'}
                        </button>
                      </div>

                      {/* Ping diagnostic result badge */}
                      {pingResult && (
                        <div
                          className={`mb-4 p-3 border text-xs font-mono flex items-center justify-between ${
                            pingResult.success
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                              : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                          }`}
                        >
                          <span>
                            {pingResult.success
                              ? `● Connected to ${pingResult.provider.toUpperCase()} (${pingResult.model}) in ${pingResult.latencyMs}ms`
                              : `✕ Connection error: ${pingResult.error || 'Failed'}`}
                          </span>
                          <button onClick={() => setPingResult(null)} className="cursor-pointer">✕</button>
                        </div>
                      )}

                      {/* Provider Selection Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        {/* Groq Card */}
                        <div
                          onClick={() =>
                            setFormData({
                              ...formData,
                              aiSettings: { ...formData.aiSettings, defaultProvider: 'groq' }
                            })
                          }
                          className={`p-4 border transition-all cursor-pointer ${
                            formData.aiSettings.defaultProvider === 'groq'
                              ? 'border-accent bg-accent/5 dark:bg-accent/10 shadow-sm'
                              : 'border-gray-200 dark:border-neutral-800 hover:border-gray-400 dark:hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono font-medium text-gray-900 dark:text-white">
                              GROQ LPUs
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 bg-accent text-white dark:text-black">
                              RECOMMENDED
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-neutral-400 font-sans leading-relaxed">
                            Ultra-fast inference (500+ tokens/sec). Best for instant question answering and seamless form filling.
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
                          className={`p-4 border transition-all cursor-pointer ${
                            formData.aiSettings.defaultProvider === 'gemini'
                              ? 'border-accent bg-accent/5 dark:bg-accent/10 shadow-sm'
                              : 'border-gray-200 dark:border-neutral-800 hover:border-gray-400 dark:hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono font-medium text-gray-900 dark:text-white">
                              GOOGLE GEMINI
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 border border-gray-200 dark:border-neutral-800 text-gray-500">
                              LARGE CONTEXT
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-neutral-400 font-sans leading-relaxed">
                            Deep multimodal comprehension with massive context windows for full-document analysis.
                          </p>
                        </div>
                      </div>

                      {/* Model Selector based on provider */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase mb-1">
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
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase mb-1">
                            System Persona Tone
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
                            placeholder="e.g. Grounded, humble, precise engineer writing in first-person (I/me)"
                            className="w-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-accent focus:outline-none rounded-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 05.2: Live AI Sandbox */}
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-neutral-800 mb-5">
                        <p className="text-xs font-mono font-light text-gray-400 dark:text-neutral-500">
                          <span className="text-accent font-medium">05.2</span> &nbsp;&nbsp;INTERACTIVE QUESTION SANDBOX
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] text-gray-500 dark:text-neutral-400 font-mono uppercase mb-1">
                            Test Question / Recruitment Prompt
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={aiTestPrompt}
                              onChange={(e) => setAiTestPrompt(e.target.value)}
                              placeholder="e.g. Describe a time you resolved a complex production bug or architecture trade-off."
                              className="flex-1 border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:border-accent focus:outline-none rounded-none"
                            />
                            <button
                              type="button"
                              onClick={handleTestAiSandbox}
                              disabled={aiTesting || !aiTestPrompt.trim()}
                              className="px-4 py-2 bg-gray-900 dark:bg-accent text-white dark:text-black border border-gray-900 dark:border-accent font-mono text-xs uppercase hover:bg-neutral-800 cursor-pointer rounded-none disabled:opacity-50 flex items-center gap-1.5"
                            >
                              {aiTesting ? (
                                <>
                                  <span className="animate-spin inline-block">⟳</span>
                                  <span>GENERATING...</span>
                                </>
                              ) : (
                                <>
                                  <span>⚡</span>
                                  <span>RUN AI</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Sandbox Generation Results */}
                        {aiTestResult && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 border border-accent bg-gray-50/50 dark:bg-neutral-900/50 space-y-3 font-sans text-left"
                          >
                            <div className="flex items-center justify-between border-b border-gray-200 dark:border-neutral-800 pb-2 text-[10px] font-mono text-gray-500 dark:text-neutral-400">
                              <span>MODEL: {aiTestResult.model}</span>
                              <span>LATENCY: {aiTestResult.latencyMs}ms</span>
                            </div>

                            <p className="text-sm text-gray-900 dark:text-neutral-100 leading-relaxed whitespace-pre-wrap font-sans">
                              {aiTestResult.answer}
                            </p>

                            {Array.isArray(aiTestResult.retrievedKnowledge) && aiTestResult.retrievedKnowledge.length > 0 && (
                              <div className="pt-2 border-t border-gray-200 dark:border-neutral-800">
                                <p className="text-[10px] font-mono text-accent uppercase mb-1">
                                  Grounding Citations Retrieved from Vault:
                                </p>
                                <div className="flex flex-wrap gap-1.5">
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
                    </div>
                  </div>
                )}

                {/* ============================================================ */}
                {/* TAB 06: EXTENSION PAIRING */}
                {/* ============================================================ */}
                {activeTab === 'pairing' && (
                  <div className="space-y-10">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-neutral-800 mb-5">
                        <p className="text-xs font-mono font-light text-gray-400 dark:text-neutral-500">
                          <span className="text-accent font-medium">06.1</span> &nbsp;&nbsp;EXTENSION PAIRING SECRET KEY
                        </p>
                      </div>

                      <div className="p-5 border border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/30 space-y-4">
                        <p className="text-xs text-gray-600 dark:text-neutral-400 font-sans leading-relaxed">
                          Your browser extension uses this secret token to authenticate and securely fetch your personal facts, stories, and AI generations without exposing login credentials.
                        </p>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <div className="flex-1 p-3 bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 font-mono text-xs sm:text-sm text-gray-900 dark:text-white tracking-widest break-all select-all">
                            {formData.extensionApiKey || 'No active key generated yet.'}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleCopyKey}
                              disabled={!formData.extensionApiKey}
                              className="px-4 py-3 bg-gray-900 dark:bg-accent text-white dark:text-black border border-gray-900 dark:border-accent font-mono text-xs uppercase hover:bg-neutral-800 cursor-pointer rounded-none disabled:opacity-50 whitespace-nowrap"
                            >
                              {copiedKey ? '✓ COPIED' : 'COPY KEY'}
                            </button>

                            <button
                              onClick={handleGenerateKey}
                              disabled={generatingKey}
                              className="px-3 py-3 border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 font-mono text-xs uppercase hover:border-gray-900 dark:hover:border-neutral-400 cursor-pointer rounded-none disabled:opacity-50 whitespace-nowrap"
                              title="Generate a brand new key and invalidate old ones"
                            >
                              {generatingKey ? 'GENERATING...' : 'REGENERATE'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-neutral-800 mb-5">
                        <p className="text-xs font-mono font-light text-gray-400 dark:text-neutral-500">
                          <span className="text-accent font-medium">06.2</span> &nbsp;&nbsp;PAIRING SETUP INSTRUCTIONS
                        </p>
                      </div>

                      <div className="space-y-4">
                        {[
                          {
                            step: '01',
                            title: 'Open Extension Settings',
                            desc: 'Click the Form Filler extension icon in your browser toolbar (Chrome, Brave, Edge, or Firefox) and click the ⚙ Settings gear icon.'
                          },
                          {
                            step: '02',
                            title: 'Paste Portfolio Host & Key',
                            desc: `Ensure the Portfolio URL is set to "${window.location.origin}" and paste the secret pairing key above into the API Key field.`
                          },
                          {
                            step: '03',
                            title: 'Test & Activate Autofill',
                            desc: 'Click "Test Connection". Once connected, the extension will automatically match fields on career portals and offer 1-click filling.'
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
                              <p className="text-xs text-gray-600 dark:text-neutral-400 font-sans mt-1 leading-relaxed">
                                {s.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
