import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin, API_URL } from '../../context/AdminContext';
import { 
  Key, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles, 
  Save, 
  Plus, 
  Trash2, 
  Pin, 
  Search, 
  Cpu, 
  Layers, 
  User, 
  Briefcase, 
  BookOpen, 
  Sliders,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const TABS = [
  { id: 'facts', num: '01', label: 'Facts & Identity', icon: User },
  { id: 'career', num: '02', label: 'Career & Visas', icon: Briefcase },
  { id: 'knowledge', num: '03', label: 'Knowledge Vault', icon: BookOpen },
  { id: 'custom', num: '04', label: 'Custom Attributes', icon: Layers },
  { id: 'ai', num: '05', label: 'AI Engine', icon: Cpu },
  { id: 'pairing', num: '06', label: 'Extension Pairing', icon: Key }
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
      alternatePhone: ''
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

  // Knowledge Vault Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedKnowledgeId, setExpandedKnowledgeId] = useState(null);
  const [isAddingKnowledge, setIsAddingKnowledge] = useState(false);
  const [newKnowledge, setNewKnowledge] = useState({
    title: '',
    category: 'Experience & Stories',
    tags: '',
    content: '',
    pinned: false
  });
  const [isCategorizingAi, setIsCategorizingAi] = useState(false);

  // AI Sandbox & Diagnostics State
  const [aiTestPrompt, setAiTestPrompt] = useState('Why should our engineering team hire you for a full stack role?');
  const [aiTestResult, setAiTestResult] = useState(null);
  const [aiTesting, setAiTesting] = useState(false);
  const [pingResult, setPingResult] = useState(null);
  const [pinging, setPinging] = useState(false);

  // Copy state
  const [copiedKey, setCopiedKey] = useState(false);

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
    if (isOpen && token) {
      fetchFormProfile();
      setMessage({ text: '', type: '' });
      setPingResult(null);
      setAiTestResult(null);
    }
  }, [isOpen, token]);

  // Save all profile changes
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
        setMessage({ text: 'Form Profile & Knowledge saved successfully.', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 4000);
      } else {
        setMessage({ text: data.message || 'Failed to save profile', type: 'error' });
      }
    } catch (err) {
      console.error('Save error:', err);
      setMessage({ text: 'Network error while saving profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Generate / Regenerate Extension API Key
  const handleGenerateApiKey = async () => {
    try {
      setSaving(true);
      const res = await fetch(`${API_URL}/api/form-profile/generate-key`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, extensionApiKey: data.apiKey }));
        setMessage({ text: 'New Extension API Key generated.', type: 'success' });
      }
    } catch (err) {
      setMessage({ text: 'Failed to generate key.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Add a new knowledge vault item
  const handleAddKnowledge = async (e) => {
    e.preventDefault();
    if (!newKnowledge.title.trim() || !newKnowledge.content.trim()) {
      setMessage({ text: 'Title and content are required for knowledge notes.', type: 'error' });
      return;
    }

    try {
      setSaving(true);
      const tagsArray = newKnowledge.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const res = await fetch(`${API_URL}/api/form-profile/knowledge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newKnowledge.title,
          category: newKnowledge.category,
          tags: tagsArray,
          content: newKnowledge.content,
          pinned: newKnowledge.pinned
        })
      });
      const data = await res.json();

      if (data.success) {
        setFormData(prev => ({ ...prev, knowledgeVault: data.knowledgeVault }));
        setNewKnowledge({ title: '', category: 'Experience & Stories', tags: '', content: '', pinned: false });
        setIsAddingKnowledge(false);
        setMessage({ text: `Knowledge "${data.item.title}" saved.`, type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      }
    } catch (err) {
      setMessage({ text: 'Failed to add knowledge note.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Delete knowledge item
  const handleDeleteKnowledge = async (id, title) => {
    if (!window.confirm(`Delete knowledge entry: "${title}"?`)) return;

    try {
      const res = await fetch(`${API_URL}/api/form-profile/knowledge/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
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

  // Toggle pin
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
    // Sort pinned items first, then recent
    return [...items].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [formData.knowledgeVault, selectedCategory, searchQuery]);

  // Handle custom fields
  const handleAddCustomField = () => {
    setFormData(prev => ({
      ...prev,
      customFields: [
        ...prev.customFields,
        {
          key: `custom_${Date.now().toString(36)}`,
          label: 'New Field Label',
          value: '',
          category: 'General',
          description: ''
        }
      ]
    }));
  };

  const handleUpdateCustomField = (index, fieldKey, val) => {
    setFormData(prev => {
      const updated = [...prev.customFields];
      updated[index] = { ...updated[index], [fieldKey]: val };
      return { ...prev, customFields: updated };
    });
  };

  const handleDeleteCustomField = (index) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index)
    }));
  };

  const copyApiKey = () => {
    if (!formData.extensionApiKey) return;
    navigator.clipboard.writeText(formData.extensionApiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
        {/* Obsidian Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-5xl h-[92vh] max-h-[900px] bg-neutral-950 border border-neutral-800 shadow-2xl flex flex-col font-sans text-neutral-200 overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 border-b border-neutral-800 bg-black/90 backdrop-blur-md gap-2">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xs sm:text-sm font-mono tracking-widest uppercase font-bold text-white flex items-center gap-2">
                    <span>//</span> PERSONAL FORM PROFILE & KNOWLEDGE VAULT
                  </h2>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 border border-neutral-800 text-neutral-400 bg-neutral-900">
                    PRIVATE • SOURCE OF TRUTH
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 font-mono hidden sm:block">
                  Unified factual data, extensible narratives & dual LLM engine for cross-browser autofill
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveProfile}
                disabled={saving || loading}
                className="px-3.5 py-1.5 border border-neutral-700 bg-neutral-900 text-neutral-200 hover:border-accent hover:text-accent font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>SAVING...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>SAVE PROFILE</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="p-1.5 text-neutral-400 hover:text-white font-mono text-sm leading-none border border-transparent hover:border-neutral-800 transition-colors cursor-pointer"
                title="Close modal (Esc)"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Feedback Banner */}
          {message.text && (
            <div className={`px-4 py-2 text-xs font-mono border-b flex items-center justify-between ${
              message.type === 'error' 
                ? 'bg-rose-950/40 border-rose-800 text-rose-300' 
                : 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
            }`}>
              <span>{message.type === 'error' ? '✕' : '✓'} {message.text}</span>
              <button onClick={() => setMessage({ text: '', type: '' })} className="cursor-pointer">✕</button>
            </div>
          )}

          {/* Monospace High-Density Tab Bar */}
          <div className="flex overflow-x-auto border-b border-neutral-800/80 bg-neutral-950 px-2 sm:px-6 py-1.5 gap-1 scrollbar-none">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap border ${
                    isActive
                      ? 'bg-neutral-900 border-neutral-700 text-accent font-semibold shadow-sm'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:border-neutral-800'
                  }`}
                >
                  <span className="text-[10px] opacity-60">{tab.num}</span>
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.id === 'knowledge' && (
                    <span className="text-[10px] px-1 bg-neutral-800 rounded text-neutral-400 ml-1">
                      {formData.knowledgeVault?.length || 0}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Body Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-black relative">
            {loading ? (
              <div className="h-full flex items-center justify-center font-mono text-xs text-neutral-400 gap-3">
                <RefreshCw className="w-4 h-4 animate-spin text-accent" />
                LOADING PROFILE DATA FROM DATABASE...
              </div>
            ) : (
              <>
                {/* TAB 01: FACTS & IDENTITY */}
                {activeTab === 'facts' && (
                  <div className="space-y-6 max-w-4xl">
                    <div>
                      <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-1 flex items-center gap-2">
                        <span>// 01.1</span> PERSONAL IDENTIFIERS
                      </h3>
                      <p className="text-[11px] text-neutral-400 font-mono mb-4">
                        Primary legal and preferred identity information used across official recruitment forms.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                            Legal First Name
                          </label>
                          <input
                            type="text"
                            value={formData.personal.legalFirstName || ''}
                            onChange={e => setFormData({ ...formData, personal: { ...formData.personal, legalFirstName: e.target.value } })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent focus:outline-none text-xs font-mono text-white px-3 py-2"
                            placeholder="Vedant"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                            Legal Last Name
                          </label>
                          <input
                            type="text"
                            value={formData.personal.legalLastName || ''}
                            onChange={e => setFormData({ ...formData, personal: { ...formData.personal, legalLastName: e.target.value } })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent focus:outline-none text-xs font-mono text-white px-3 py-2"
                            placeholder="Lahane"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                            Preferred Name
                          </label>
                          <input
                            type="text"
                            value={formData.personal.preferredName || ''}
                            onChange={e => setFormData({ ...formData, personal: { ...formData.personal, preferredName: e.target.value } })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent focus:outline-none text-xs font-mono text-white px-3 py-2"
                            placeholder="Vedant"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                            Pronouns
                          </label>
                          <input
                            type="text"
                            value={formData.personal.pronouns || ''}
                            onChange={e => setFormData({ ...formData, personal: { ...formData.personal, pronouns: e.target.value } })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent focus:outline-none text-xs font-mono text-white px-3 py-2"
                            placeholder="he/him"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                            Gender
                          </label>
                          <input
                            type="text"
                            value={formData.personal.gender || ''}
                            onChange={e => setFormData({ ...formData, personal: { ...formData.personal, gender: e.target.value } })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent focus:outline-none text-xs font-mono text-white px-3 py-2"
                            placeholder="Male / Decline to state"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                            Alternate Phone
                          </label>
                          <input
                            type="text"
                            value={formData.personal.alternatePhone || ''}
                            onChange={e => setFormData({ ...formData, personal: { ...formData.personal, alternatePhone: e.target.value } })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent focus:outline-none text-xs font-mono text-white px-3 py-2"
                            placeholder="+91 ..."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-800/80">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-1 flex items-center gap-2">
                        <span>// 01.2</span> RESIDENTIAL ADDRESS & PASSPORT
                      </h3>
                      <p className="text-[11px] text-neutral-400 font-mono mb-4">
                        Stored strictly in your private database. Never rendered publicly on your portfolio website.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                            Street Address Line 1
                          </label>
                          <input
                            type="text"
                            value={formData.personal.addressLine1 || ''}
                            onChange={e => setFormData({ ...formData, personal: { ...formData.personal, addressLine1: e.target.value } })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent focus:outline-none text-xs font-mono text-white px-3 py-2"
                            placeholder="Apartment, suite, building, street"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                            Street Address Line 2 (Optional)
                          </label>
                          <input
                            type="text"
                            value={formData.personal.addressLine2 || ''}
                            onChange={e => setFormData({ ...formData, personal: { ...formData.personal, addressLine2: e.target.value } })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent focus:outline-none text-xs font-mono text-white px-3 py-2"
                            placeholder="Landmark, floor, area"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            value={formData.personal.city || ''}
                            onChange={e => setFormData({ ...formData, personal: { ...formData.personal, city: e.target.value } })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent focus:outline-none text-xs font-mono text-white px-3 py-2"
                            placeholder="Amravati"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                            State / Province
                          </label>
                          <input
                            type="text"
                            value={formData.personal.state || ''}
                            onChange={e => setFormData({ ...formData, personal: { ...formData.personal, state: e.target.value } })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent focus:outline-none text-xs font-mono text-white px-3 py-2"
                            placeholder="Maharashtra"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                            Postal / PIN Code
                          </label>
                          <input
                            type="text"
                            value={formData.personal.postalCode || ''}
                            onChange={e => setFormData({ ...formData, personal: { ...formData.personal, postalCode: e.target.value } })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent focus:outline-none text-xs font-mono text-white px-3 py-2"
                            placeholder="444601"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                            Country
                          </label>
                          <input
                            type="text"
                            value={formData.personal.country || ''}
                            onChange={e => setFormData({ ...formData, personal: { ...formData.personal, country: e.target.value } })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent focus:outline-none text-xs font-mono text-white px-3 py-2"
                            placeholder="India"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                            Nationality
                          </label>
                          <input
                            type="text"
                            value={formData.personal.nationality || ''}
                            onChange={e => setFormData({ ...formData, personal: { ...formData.personal, nationality: e.target.value } })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent focus:outline-none text-xs font-mono text-white px-3 py-2"
                            placeholder="Indian"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                            Country of Citizenship
                          </label>
                          <input
                            type="text"
                            value={formData.personal.citizenship || ''}
                            onChange={e => setFormData({ ...formData, personal: { ...formData.personal, citizenship: e.target.value } })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent focus:outline-none text-xs font-mono text-white px-3 py-2"
                            placeholder="India"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                            Passport / National ID (Private)
                          </label>
                          <input
                            type="text"
                            value={formData.personal.passportNumber || ''}
                            onChange={e => setFormData({ ...formData, personal: { ...formData.personal, passportNumber: e.target.value } })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent focus:outline-none text-xs font-mono text-white px-3 py-2"
                            placeholder="Optional passport or national ID"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 02: CAREER & RECRUITMENT */}
                {activeTab === 'career' && (
                  <div className="space-y-6 max-w-4xl">
                    <div>
                      <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-1 flex items-center gap-2">
                        <span>// 02.1</span> COMPENSATION & NOTICE PERIOD
                      </h3>
                      <p className="text-[11px] text-neutral-400 font-mono mb-4">
                        Standard factual questions frequently asked on Workday, Lever, and Greenhouse portals.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                            Current CTC / Salary
                          </label>
                          <input
                            type="text"
                            value={formData.compensation.currentSalary || ''}
                            onChange={e => setFormData({ ...formData, compensation: { ...formData.compensation, currentSalary: e.target.value } })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent focus:outline-none text-xs font-mono text-white px-3 py-2"
                            placeholder="e.g. 8 LPA or NA"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                            Expected CTC / Desired Salary
                          </label>
                          <input
                            type="text"
                            value={formData.compensation.expectedSalary || ''}
                            onChange={e => setFormData({ ...formData, compensation: { ...formData.compensation, expectedSalary: e.target.value } })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent focus:outline-none text-xs font-mono text-white px-3 py-2"
                            placeholder="e.g. 14 LPA / Open to discussion"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                            Currency
                          </label>
                          <select
                            value={formData.compensation.currency || 'INR'}
                            onChange={e => setFormData({ ...formData, compensation: { ...formData.compensation, currency: e.target.value } })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent focus:outline-none text-xs font-mono text-white px-3 py-2"
                          >
                            <option value="INR">INR (₹)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                            Notice Period
                          </label>
                          <input
                            type="text"
                            value={formData.compensation.noticePeriodDays || ''}
                            onChange={e => setFormData({ ...formData, compensation: { ...formData.compensation, noticePeriodDays: e.target.value } })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent focus:outline-none text-xs font-mono text-white px-3 py-2"
                            placeholder="0 (Immediate) or 15 days"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                            Earliest Start Date
                          </label>
                          <input
                            type="text"
                            value={formData.compensation.earliestStartDate || ''}
                            onChange={e => setFormData({ ...formData, compensation: { ...formData.compensation, earliestStartDate: e.target.value } })}
                            className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent focus:outline-none text-xs font-mono text-white px-3 py-2"
                            placeholder="Immediately / Within 2 weeks"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-800/80">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-1 flex items-center gap-2">
                        <span>// 02.2</span> WORK AUTHORIZATION & VISAS
                      </h3>
                      <p className="text-[11px] text-neutral-400 font-mono mb-4">
                        Pre-populated answers for employment eligibility and sponsorship questions.
                      </p>

                      <div className="space-y-3">
                        <label className="flex items-center gap-3 p-3 bg-neutral-950 border border-neutral-800 cursor-pointer hover:border-neutral-700 transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.workAuthorization.authorizedInCountryOfRole}
                            onChange={e => setFormData({ ...formData, workAuthorization: { ...formData.workAuthorization, authorizedInCountryOfRole: e.target.checked } })}
                            className="accent-accent w-4 h-4"
                          />
                          <div>
                            <span className="text-xs font-mono text-white font-medium block">
                              Legally authorized to work in the country of the role
                            </span>
                            <span className="text-[11px] font-mono text-neutral-400">
                              e.g. Authorized to work in India without restriction
                            </span>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-3 bg-neutral-950 border border-neutral-800 cursor-pointer hover:border-neutral-700 transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.workAuthorization.requiresSponsorshipNow}
                            onChange={e => setFormData({ ...formData, workAuthorization: { ...formData.workAuthorization, requiresSponsorshipNow: e.target.checked } })}
                            className="accent-accent w-4 h-4"
                          />
                          <div>
                            <span className="text-xs font-mono text-white font-medium block">
                              Will you NOW require sponsorship for an employment visa?
                            </span>
                            <span className="text-[11px] font-mono text-neutral-400">
                              (Usually "No" for domestic roles in India)
                            </span>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-3 bg-neutral-950 border border-neutral-800 cursor-pointer hover:border-neutral-700 transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.workAuthorization.requiresSponsorshipFuture}
                            onChange={e => setFormData({ ...formData, workAuthorization: { ...formData.workAuthorization, requiresSponsorshipFuture: e.target.checked } })}
                            className="accent-accent w-4 h-4"
                          />
                          <div>
                            <span className="text-xs font-mono text-white font-medium block">
                              Will you in the FUTURE require sponsorship for an employment visa?
                            </span>
                            <span className="text-[11px] font-mono text-neutral-400">
                              (Check if applying for roles requiring international relocation)
                            </span>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-3 bg-neutral-950 border border-neutral-800 cursor-pointer hover:border-neutral-700 transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.workAuthorization.willingToRelocate}
                            onChange={e => setFormData({ ...formData, workAuthorization: { ...formData.workAuthorization, willingToRelocate: e.target.checked } })}
                            className="accent-accent w-4 h-4"
                          />
                          <div>
                            <span className="text-xs font-mono text-white font-medium block">
                              Willing to relocate for the role
                            </span>
                          </div>
                        </label>
                      </div>

                      <div className="mt-4">
                        <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
                          Work Mode Preference
                        </label>
                        <input
                          type="text"
                          value={formData.workAuthorization.workModePreference || ''}
                          onChange={e => setFormData({ ...formData, workAuthorization: { ...formData.workAuthorization, workModePreference: e.target.value } })}
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent focus:outline-none text-xs font-mono text-white px-3 py-2"
                          placeholder="Flexible (Remote / Hybrid / Onsite)"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 03: KNOWLEDGE VAULT (Extensible Personal Wiki & Stories) */}
                {activeTab === 'knowledge' && (
                  <div className="space-y-6 max-w-5xl">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-1 flex items-center gap-2">
                          <span>// 03.1</span> PERSONAL KNOWLEDGE VAULT & STORY BANK
                        </h3>
                        <p className="text-[11px] text-neutral-400 font-mono">
                          Store arbitrary long-form stories, architecture deep dives, STAR narratives, and technical explanations.
                          The LLM grounds all essay drafts directly on these entries.
                        </p>
                      </div>

                      <button
                        onClick={() => setIsAddingKnowledge(!isAddingKnowledge)}
                        className="px-3.5 py-1.5 border border-accent/40 bg-accent/10 text-accent hover:bg-accent hover:text-black font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isAddingKnowledge ? 'CANCEL ENTRY' : 'NEW KNOWLEDGE ENTRY'}</span>
                      </button>
                    </div>

                    {/* New Knowledge Form Drawer */}
                    {isAddingKnowledge && (
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleAddKnowledge}
                        className="bg-neutral-950 border border-neutral-800 p-4 sm:p-5 space-y-4 font-mono text-xs"
                      >
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                          <span className="font-bold text-white uppercase text-xs flex items-center gap-2">
                            <span>+</span> NEW KNOWLEDGE ENTRY
                          </span>
                          <button
                            type="button"
                            onClick={handleAiSuggestCategory}
                            disabled={isCategorizingAi}
                            className="text-[11px] px-2.5 py-1 border border-neutral-700 bg-neutral-900 text-accent hover:border-accent transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            title="Auto-detect best category & tags based on your text"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>{isCategorizingAi ? 'ANALYZING...' : 'AI SUGGEST CATEGORY & TAGS'}</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[11px] text-neutral-400 uppercase tracking-wider block mb-1">
                              Entry Title *
                            </label>
                            <input
                              type="text"
                              value={newKnowledge.title}
                              onChange={e => setNewKnowledge({ ...newKnowledge, title: e.target.value })}
                              placeholder="e.g. Axon: RAG System Architecture & Vector Indexing"
                              className="w-full bg-black border border-neutral-800 focus:border-accent text-white px-3 py-2 text-xs"
                              required
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-neutral-400 uppercase tracking-wider block mb-1">
                              Category
                            </label>
                            <select
                              value={newKnowledge.category}
                              onChange={e => setNewKnowledge({ ...newKnowledge, category: e.target.value })}
                              className="w-full bg-black border border-neutral-800 focus:border-accent text-white px-3 py-2 text-xs"
                            >
                              {KNOWLEDGE_CATEGORIES.filter(c => c !== 'All').map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] text-neutral-400 uppercase tracking-wider block mb-1">
                            Tags (comma separated)
                          </label>
                          <input
                            type="text"
                            value={newKnowledge.tags}
                            onChange={e => setNewKnowledge({ ...newKnowledge, tags: e.target.value })}
                            placeholder="e.g. AI/ML, Vector DB, LangChain, Architecture"
                            className="w-full bg-black border border-neutral-800 focus:border-accent text-white px-3 py-2 text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-neutral-400 uppercase tracking-wider block mb-1">
                            Detailed Narrative / Context / Code Decisions *
                          </label>
                          <textarea
                            rows={5}
                            value={newKnowledge.content}
                            onChange={e => setNewKnowledge({ ...newKnowledge, content: e.target.value })}
                            placeholder="Write long-form writing, technical challenges faced, metrics achieved, STAR explanations, trade-offs, and design rationale..."
                            className="w-full bg-black border border-neutral-800 focus:border-accent text-white px-3 py-2 text-xs font-mono leading-relaxed"
                            required
                          />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <label className="flex items-center gap-2 text-neutral-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newKnowledge.pinned}
                              onChange={e => setNewKnowledge({ ...newKnowledge, pinned: e.target.checked })}
                              className="accent-accent"
                            />
                            <span>Pin to top (prioritized for AI retrieval)</span>
                          </label>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setIsAddingKnowledge(false)}
                              className="px-3 py-1.5 border border-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
                            >
                              CANCEL
                            </button>
                            <button
                              type="submit"
                              disabled={saving}
                              className="px-4 py-1.5 border border-neutral-700 bg-neutral-900 text-accent hover:border-accent cursor-pointer font-bold flex items-center gap-1.5"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>SAVE ENTRY</span>
                            </button>
                          </div>
                        </div>
                      </motion.form>
                    )}

                    {/* Search & Category Filter Bar */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          placeholder="Search knowledge by keyword, technology, or tag..."
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent text-xs font-mono text-white pl-8 pr-3 py-2"
                        />
                      </div>

                      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
                        {['All', 'Project Context', 'Technical Depth', 'DSA & Problem Solving'].map(cat => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-2.5 py-1 text-[11px] font-mono border whitespace-nowrap cursor-pointer transition-colors ${
                              selectedCategory === cat
                                ? 'bg-neutral-800 border-accent/60 text-accent font-medium'
                                : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Knowledge Cards List */}
                    <div className="space-y-3">
                      {filteredKnowledge.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-neutral-800 text-neutral-500 font-mono text-xs">
                          NO KNOWLEDGE ENTRIES FOUND. CLICK "NEW KNOWLEDGE ENTRY" TO STORE PERSONAL CONTEXT.
                        </div>
                      ) : (
                        filteredKnowledge.map((item) => {
                          const isExpanded = expandedKnowledgeId === item.id;
                          return (
                            <div
                              key={item.id}
                              className={`border transition-colors ${
                                item.pinned 
                                  ? 'border-neutral-700 bg-neutral-950/80' 
                                  : 'border-neutral-800/80 bg-neutral-950/40 hover:border-neutral-750'
                              }`}
                            >
                              <div className="p-3 sm:p-4 flex items-start justify-between gap-3">
                                <div className="space-y-1.5 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[10px] font-mono px-1.5 py-0.5 border border-neutral-800 text-accent bg-black uppercase">
                                      {item.category}
                                    </span>
                                    {item.pinned && (
                                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-950/40 border border-amber-800 text-amber-300 flex items-center gap-1">
                                        <Pin className="w-2.5 h-2.5" /> PINNED
                                      </span>
                                    )}
                                    <h4 className="text-xs sm:text-sm font-mono font-bold text-white">
                                      {item.title}
                                    </h4>
                                  </div>

                                  {/* Tags */}
                                  {Array.isArray(item.tags) && item.tags.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-1">
                                      {item.tags.map((tag, i) => (
                                        <span key={i} className="text-[10px] font-mono text-neutral-400 bg-neutral-900 px-1.5 py-0.5">
                                          #{tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  {/* Content Preview */}
                                  <p className={`text-xs font-mono text-neutral-300 leading-relaxed ${
                                    isExpanded ? 'whitespace-pre-wrap' : 'line-clamp-2'
                                  }`}>
                                    {item.content}
                                  </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 text-neutral-400 self-start">
                                  <button
                                    onClick={() => handleTogglePin(item)}
                                    className={`p-1.5 hover:text-white transition-colors cursor-pointer ${item.pinned ? 'text-amber-400' : ''}`}
                                    title={item.pinned ? 'Unpin item' : 'Pin item to prioritize'}
                                  >
                                    <Pin className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => setExpandedKnowledgeId(isExpanded ? null : item.id)}
                                    className="p-1.5 hover:text-white transition-colors cursor-pointer"
                                    title={isExpanded ? 'Collapse' : 'Expand full writing'}
                                  >
                                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                  </button>

                                  <button
                                    onClick={() => handleDeleteKnowledge(item.id, item.title)}
                                    className="p-1.5 hover:text-rose-400 transition-colors cursor-pointer"
                                    title="Delete entry"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 04: CUSTOM ATTRIBUTES */}
                {activeTab === 'custom' && (
                  <div className="space-y-6 max-w-4xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-1 flex items-center gap-2">
                          <span>// 04.1</span> DYNAMIC ATTRIBUTES & NICHE FIELDS
                        </h3>
                        <p className="text-[11px] text-neutral-400 font-mono">
                          Store company-specific or arbitrary question answers (e.g. veteran status, referral source, security clearance).
                        </p>
                      </div>

                      <button
                        onClick={handleAddCustomField}
                        className="px-3 py-1.5 border border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-accent hover:text-accent font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>ADD CUSTOM FIELD</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.customFields.length === 0 ? (
                        <div className="text-center py-8 border border-dashed border-neutral-800 text-neutral-500 font-mono text-xs">
                          NO CUSTOM ATTRIBUTES ADDED YET.
                        </div>
                      ) : (
                        formData.customFields.map((cf, idx) => (
                          <div key={idx} className="p-3 bg-neutral-950 border border-neutral-800/80 space-y-2 font-mono">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-[10px] text-accent tracking-widest uppercase">
                                FIELD {idx + 1}
                              </span>
                              <button
                                onClick={() => handleDeleteCustomField(idx)}
                                className="text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                              <div>
                                <label className="text-[10px] text-neutral-400 uppercase block mb-1">
                                  System Key (Lookup)
                                </label>
                                <input
                                  type="text"
                                  value={cf.key}
                                  onChange={e => handleUpdateCustomField(idx, 'key', e.target.value)}
                                  className="w-full bg-black border border-neutral-800 px-2 py-1.5 text-white"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] text-neutral-400 uppercase block mb-1">
                                  Display Label
                                </label>
                                <input
                                  type="text"
                                  value={cf.label}
                                  onChange={e => handleUpdateCustomField(idx, 'label', e.target.value)}
                                  className="w-full bg-black border border-neutral-800 px-2 py-1.5 text-white"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] text-neutral-400 uppercase block mb-1">
                                  Value
                                </label>
                                <input
                                  type="text"
                                  value={cf.value}
                                  onChange={e => handleUpdateCustomField(idx, 'value', e.target.value)}
                                  className="w-full bg-black border border-neutral-800 px-2 py-1.5 text-white"
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 05: AI ENGINE & SANDBOX */}
                {activeTab === 'ai' && (
                  <div className="space-y-6 max-w-4xl font-mono">
                    <div>
                      <h3 className="text-xs uppercase tracking-widest text-accent mb-1 flex items-center gap-2">
                        <span>// 05.1</span> DUAL AI PROVIDER CONFIGURATION
                      </h3>
                      <p className="text-[11px] text-neutral-400 mb-4">
                        Seamlessly toggle between Groq (ultra-fast inference) and Gemini (deep context). Keys are kept strictly on the server.
                      </p>

                      {/* Provider Switcher Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Groq Card */}
                        <div
                          onClick={() => setFormData({
                            ...formData,
                            aiSettings: { ...formData.aiSettings, defaultProvider: 'groq' }
                          })}
                          className={`p-4 border cursor-pointer transition-all ${
                            formData.aiSettings.defaultProvider === 'groq'
                              ? 'border-accent bg-neutral-950 shadow-md ring-1 ring-accent/30'
                              : 'border-neutral-800 bg-black hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-white flex items-center gap-2">
                              <span>⚡</span> GROQ (ACTIVE)
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 border ${
                              formData.aiSettings.defaultProvider === 'groq'
                                ? 'bg-accent/10 border-accent text-accent'
                                : 'border-neutral-800 text-neutral-500'
                            }`}>
                              {formData.aiSettings.defaultProvider === 'groq' ? 'SELECTED' : 'SELECT'}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mb-3">
                            Ultra-low latency inference powered by LPUs. Recommended for instant form drafts.
                          </p>

                          <div>
                            <label className="text-[10px] text-neutral-400 uppercase block mb-1">
                              Groq Model
                            </label>
                            <select
                              value={formData.aiSettings.groqModel || 'qwen/qwen3.8-27b'}
                              onChange={e => setFormData({
                                ...formData,
                                aiSettings: { ...formData.aiSettings, groqModel: e.target.value }
                              })}
                              className="w-full bg-neutral-900 border border-neutral-800 text-white px-2.5 py-1.5 text-xs"
                            >
                              {GROQ_MODELS.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Gemini Card */}
                        <div
                          onClick={() => setFormData({
                            ...formData,
                            aiSettings: { ...formData.aiSettings, defaultProvider: 'gemini' }
                          })}
                          className={`p-4 border cursor-pointer transition-all ${
                            formData.aiSettings.defaultProvider === 'gemini'
                              ? 'border-accent bg-neutral-950 shadow-md ring-1 ring-accent/30'
                              : 'border-neutral-800 bg-black hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-white flex items-center gap-2">
                              <span>✨</span> GOOGLE GEMINI
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 border ${
                              formData.aiSettings.defaultProvider === 'gemini'
                                ? 'bg-accent/10 border-accent text-accent'
                                : 'border-neutral-800 text-neutral-500'
                            }`}>
                              {formData.aiSettings.defaultProvider === 'gemini' ? 'SELECTED' : 'SELECT'}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mb-3">
                            Multimodal and large-window reasoning. Requires active billing/generative API access on Google project.
                          </p>

                          <div>
                            <label className="text-[10px] text-neutral-400 uppercase block mb-1">
                              Gemini Model
                            </label>
                            <select
                              value={formData.aiSettings.geminiModel || 'gemini-3.6-flash'}
                              onChange={e => setFormData({
                                ...formData,
                                aiSettings: { ...formData.aiSettings, geminiModel: e.target.value }
                              })}
                              className="w-full bg-neutral-900 border border-neutral-800 text-white px-2.5 py-1.5 text-xs"
                            >
                              {GEMINI_MODELS.map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Connection Diagnostic Button */}
                      <div className="mt-4 flex flex-wrap items-center justify-between p-3 bg-neutral-950 border border-neutral-800/80 gap-2">
                        <div className="text-xs">
                          <span className="text-neutral-400">Current active provider: </span>
                          <span className="text-accent font-bold uppercase">{formData.aiSettings.defaultProvider}</span>
                        </div>

                        <button
                          type="button"
                          onClick={handlePingTest}
                          disabled={pinging}
                          className="px-3 py-1.5 border border-neutral-700 bg-neutral-900 text-neutral-200 hover:border-accent hover:text-accent text-xs uppercase transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${pinging ? 'animate-spin text-accent' : ''}`} />
                          <span>{pinging ? 'TESTING CONNECTIVITY...' : 'TEST PROVIDER CONNECTION'}</span>
                        </button>
                      </div>

                      {/* Ping Diagnostic Result */}
                      {pingResult && (
                        <div className={`mt-2 p-3 text-xs border ${
                          pingResult.success 
                            ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300' 
                            : 'bg-rose-950/30 border-rose-800 text-rose-300'
                        }`}>
                          <div className="flex items-center justify-between mb-1 font-bold">
                            <span>{pingResult.success ? '✓ CONNECTION VERIFIED' : '✕ CONNECTION FAILED'}</span>
                            <span>{pingResult.latencyMs}ms</span>
                          </div>
                          <p className="text-[11px] opacity-80">
                            {pingResult.success ? `Model: ${pingResult.model} • Reply: ${pingResult.response}` : pingResult.error}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Custom Instructions */}
                    <div className="pt-4 border-t border-neutral-800/80">
                      <h3 className="text-xs uppercase tracking-widest text-accent mb-1 flex items-center gap-2">
                        <span>// 05.2</span> CUSTOM AI PERSONA & INSTRUCTIONS
                      </h3>
                      <p className="text-[11px] text-neutral-400 mb-3">
                        Guide how the AI formats and frames your answers across job applications.
                      </p>

                      <textarea
                        rows={3}
                        value={formData.aiSettings.systemPrompt || ''}
                        onChange={e => setFormData({
                          ...formData,
                          aiSettings: { ...formData.aiSettings, systemPrompt: e.target.value }
                        })}
                        placeholder="e.g. Always emphasize my systems engineering background, offline-first architectures in SafarSathi, and problem-solving discipline from 350+ DSA algorithmic problems."
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent text-xs text-white px-3 py-2 leading-relaxed"
                      />
                    </div>

                    {/* Interactive Prompt Sandbox Playground */}
                    <div className="pt-4 border-t border-neutral-800/80">
                      <h3 className="text-xs uppercase tracking-widest text-accent mb-1 flex items-center gap-2">
                        <span>// 05.3</span> INTERACTIVE DRAFT SANDBOX
                      </h3>
                      <p className="text-[11px] text-neutral-400 mb-3">
                        Test how the AI synthesizes your Knowledge Vault and projects for arbitrary application questions.
                      </p>

                      <div className="space-y-3">
                        <input
                          type="text"
                          value={aiTestPrompt}
                          onChange={e => setAiTestPrompt(e.target.value)}
                          placeholder="Type an application question..."
                          className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent text-xs text-white px-3 py-2"
                        />

                        <button
                          type="button"
                          onClick={handleTestAiSandbox}
                          disabled={aiTesting}
                          className="px-4 py-2 border border-neutral-700 bg-neutral-900 text-accent hover:border-accent text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
                        >
                          <Sparkles className={`w-3.5 h-3.5 ${aiTesting ? 'animate-spin' : ''}`} />
                          <span>{aiTesting ? 'GENERATING GROUNDED DRAFT...' : 'GENERATE GROUNDED DRAFT'}</span>
                        </button>

                        {/* Sandbox Output */}
                        {aiTestResult && (
                          <div className="mt-3 p-4 bg-neutral-950 border border-neutral-800 text-xs space-y-3">
                            <div className="flex items-center justify-between border-b border-neutral-800 pb-2 text-[11px] text-neutral-400">
                              <span>Generated via {aiTestResult.provider} ({aiTestResult.model})</span>
                              {aiTestResult.usedKnowledge?.length > 0 && (
                                <span className="text-accent">
                                  Grounding: {aiTestResult.usedKnowledge.join(', ')}
                                </span>
                              )}
                            </div>
                            <p className="text-neutral-200 leading-relaxed whitespace-pre-wrap">
                              {aiTestResult.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 06: EXTENSION PAIRING */}
                {activeTab === 'pairing' && (
                  <div className="space-y-6 max-w-4xl font-mono text-xs">
                    <div>
                      <h3 className="uppercase tracking-widest text-accent mb-1 flex items-center gap-2">
                        <span>// 06.1</span> EXTENSION PAIRING & SECURITY
                      </h3>
                      <p className="text-[11px] text-neutral-400 mb-4">
                        Your browser extension communicates directly with your portfolio backend using this private key.
                      </p>

                      <div className="p-4 bg-neutral-950 border border-neutral-800 space-y-4">
                        <div>
                          <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5">
                            Private Extension Pairing Key
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="password"
                              readOnly
                              value={formData.extensionApiKey || 'pf_ext_not_generated'}
                              className="flex-1 bg-black border border-neutral-800 px-3 py-2 text-white font-mono text-xs tracking-wider"
                            />
                            <button
                              type="button"
                              onClick={copyApiKey}
                              className="px-3 py-2 border border-neutral-700 bg-neutral-900 text-neutral-200 hover:border-accent hover:text-accent transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                              {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedKey ? 'COPIED' : 'COPY'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleGenerateApiKey}
                              disabled={saving}
                              className="px-3 py-2 border border-neutral-700 bg-neutral-900 text-neutral-200 hover:border-accent hover:text-accent transition-colors cursor-pointer flex items-center gap-1.5"
                              title="Generate new key (will require re-pairing in extension)"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>REGENERATE</span>
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5">
                            Backend API Endpoint
                          </label>
                          <input
                            type="text"
                            readOnly
                            value={API_URL || 'http://localhost:5000'}
                            className="w-full bg-black border border-neutral-800 px-3 py-2 text-neutral-400 font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-800/80">
                      <h3 className="uppercase tracking-widest text-accent mb-1 flex items-center gap-2">
                        <span>// 06.2</span> LOADING INTO YOUR BROWSER
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                        <div className="p-3.5 bg-neutral-950 border border-neutral-800 space-y-2">
                          <span className="font-bold text-white block">Firefox on Ubuntu / Windows</span>
                          <ol className="list-decimal list-inside text-neutral-400 space-y-1 text-[11px] leading-relaxed">
                            <li>Open <code className="text-accent">about:debugging#/runtime/this-firefox</code></li>
                            <li>Click <strong>"Load Temporary Add-on..."</strong></li>
                            <li>Select <code className="text-white">extension/.output/firefox-mv2/manifest.json</code></li>
                          </ol>
                        </div>

                        <div className="p-3.5 bg-neutral-950 border border-neutral-800 space-y-2">
                          <span className="font-bold text-white block">Chrome / Brave / Edge</span>
                          <ol className="list-decimal list-inside text-neutral-400 space-y-1 text-[11px] leading-relaxed">
                            <li>Open <code className="text-accent">chrome://extensions</code></li>
                            <li>Enable <strong>"Developer mode"</strong> (top-right)</li>
                            <li>Click <strong>"Load unpacked"</strong></li>
                            <li>Select folder <code className="text-white">extension/.output/chrome-mv3</code></li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Status Bar */}
          <div className="px-4 sm:px-6 py-2.5 border-t border-neutral-800/80 bg-neutral-950 flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              PORTFOLIO DATA SYNCED
            </span>
            <span>
              {formData.knowledgeVault?.length || 0} Knowledge Notes • {formData.customFields?.length || 0} Custom Fields
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
