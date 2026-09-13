import React, { useState, useEffect, useMemo } from 'react';
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

const TrashIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const RefreshIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const LockIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const PlusIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
  </svg>
);

const PinIcon = ({ className = 'w-4 h-4', filled = false }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const SparklesIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.286L13 21l-2.286-6.857L5 12l5.714-2.286L13 3z" />
  </svg>
);

// ============================================================================
// Constants
// ============================================================================
const SECTIONS = [
  { id: 'facts', num: '01', title: 'Identity', sub: 'Legal, address & links' },
  { id: 'career', num: '02', title: 'Career', sub: 'Visas, CTC & academics' },
  { id: 'knowledge', num: '03', title: 'Knowledge', sub: 'Stories & deep dives' },
  { id: 'custom', num: '04', title: 'Custom', sub: 'Extensible attributes' },
  { id: 'ai', num: '05', title: 'AI Engine', sub: 'Models & diagnostics' },
  { id: 'pairing', num: '06', title: 'Pairing', sub: 'Extension secret key' }
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

export default function PersonalVaultPage() {
  const { isAdmin, token, login } = useAdmin();

  const [passkeyInput, setPasskeyInput] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [unlocking, setUnlocking] = useState(false);

  const [activeSection, setActiveSection] = useState('facts');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
    personal: {
      legalFirstName: '', legalLastName: '', preferredName: '', gender: '', pronouns: '',
      addressLine1: '', addressLine2: '', city: '', state: '', country: '', postalCode: '',
      nationality: '', citizenship: '', passportNumber: '', alternatePhone: '',
      linkedinUrl: '', githubUrl: '', portfolioUrl: '', twitterUrl: ''
    },
    workExperience: [],
    compensation: { currentSalary: '', expectedSalary: '', currency: '', noticePeriodDays: '', earliestStartDate: '' },
    workAuthorization: { authorizedInCountryOfRole: true, requiresSponsorshipNow: false, requiresSponsorshipFuture: false, willingToRelocate: true, workModePreference: '' },
    statements: { professionalSummary: '', whyOurCompanyTemplate: '', proudestProjectDescription: '', greatestTechnicalAchievement: '' },
    customFields: [],
    knowledgeVault: [],
    aiSettings: { defaultProvider: 'groq', groqModel: 'qwen/qwen3.8-27b', geminiModel: 'gemini-3.6-flash', systemPrompt: '' },
    extensionApiKey: ''
  });

  // Knowledge States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newKnowledge, setNewKnowledge] = useState({ title: '', category: 'Experience & Stories', tags: '', content: '', pinned: false });
  const [isAddingKnowledge, setIsAddingKnowledge] = useState(false);
  const [isCategorizingAi, setIsCategorizingAi] = useState(false);
  const [editingKnowledgeId, setEditingKnowledgeId] = useState(null);

  // Custom Fields
  const [newField, setNewField] = useState({ key: '', label: '', value: '', category: 'General', isSensitive: false });
  const [isAddingField, setIsAddingField] = useState(false);

  // AI Sandbox
  const [aiTestPrompt, setAiTestPrompt] = useState('Why should our engineering team hire you for a full stack role?');
  const [aiTestResult, setAiTestResult] = useState(null);
  const [aiTesting, setAiTesting] = useState(false);
  const [pingResult, setPingResult] = useState(null);
  const [pinging, setPinging] = useState(false);

  // Pairing States
  const [copiedKey, setCopiedKey] = useState(false);
  const [generatingKey, setGeneratingKey] = useState(false);

  useEffect(() => {
    const fetchFormProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/form-profile`, { headers: { 'Authorization': `Bearer ${token}` } });
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
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    if (isAdmin && token) fetchFormProfile();
    else setLoading(false);
  }, [isAdmin, token]);

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!passkeyInput.trim()) return;
    setUnlocking(true); setUnlockError('');
    const res = await login(passkeyInput.trim());
    setUnlocking(false);
    if (!res.success) setUnlockError(res.message || 'Incorrect passkey.');
    else setPasskeyInput('');
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const res = await fetch(`${API_URL}/api/form-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: 'Vault updated successfully.', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 4000);
      } else {
        setMessage({ text: data.message || 'Failed to save.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Network error.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateKey = async () => {
    if (!window.confirm('Generating a new key resets old sessions. Proceed?')) return;
    try {
      setGeneratingKey(true);
      const res = await fetch(`${API_URL}/api/form-profile/generate-key`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
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

  const handleCopyKey = () => {
    if (!formData.extensionApiKey) return;
    navigator.clipboard.writeText(formData.extensionApiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const filteredKnowledge = useMemo(() => {
    let items = formData.knowledgeVault || [];
    if (selectedCategory !== 'All') items = items.filter(k => k.category === selectedCategory);
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

  // Reusable Transparent Input Field Component
  const VaultInput = ({ label, value, onChange, placeholder, type = "text" }) => (
    <div className="w-full relative group">
      <label className="block text-[10px] text-gray-400 dark:text-neutral-500 font-mono uppercase tracking-widest mb-1 transition-colors group-focus-within:text-accent">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-transparent border-b border-gray-300 dark:border-neutral-700 px-0 py-2 text-base sm:text-lg lg:text-xl font-sans font-light text-gray-900 dark:text-white focus:border-accent dark:focus:border-accent focus:outline-none placeholder-gray-300 dark:placeholder-neutral-800 transition-colors resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-transparent border-b border-gray-300 dark:border-neutral-700 px-0 py-2 text-base sm:text-lg lg:text-xl font-sans font-light text-gray-900 dark:text-white focus:border-accent dark:focus:border-accent focus:outline-none placeholder-gray-300 dark:placeholder-neutral-800 transition-colors"
        />
      )}
    </div>
  );

  if (!isAdmin) {
    return (
      <div className="bg-white dark:bg-black font-sans text-gray-900 dark:text-neutral-100 min-h-screen transition-colors duration-300">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-6">
          <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-neutral-800">
            <Link to="/" className="flex items-center gap-3">
              <div className="relative w-8 h-8 flex-shrink-0">
                <div className="absolute inset-0 bg-gray-900 dark:bg-white transform rotate-45 rounded-sm" />
                <div className="absolute inset-1 bg-white dark:bg-neutral-900 transform rotate-45 rounded-sm" />
                <div className="absolute inset-2 bg-gray-900 dark:bg-accent transform rotate-45 rounded-sm" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 dark:text-neutral-500 font-mono font-light"><span className="text-accent font-medium">08</span> &nbsp;&nbsp;PERSONAL VAULT</p>
                <h1 className="text-xl font-display font-light text-gray-900 dark:text-white">Vedant</h1>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link to="/" className="text-xs font-mono text-gray-500 hover:text-accent transition-colors">← Back</Link>
            </div>
          </div>
          <div className="max-w-md mx-auto py-24 text-center">
            <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center bg-transparent text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-800">
              <LockIcon className="w-5 h-5" />
            </div>
            <p className="text-xs font-mono tracking-widest text-accent uppercase mb-2">Restricted Access</p>
            <h2 className="text-3xl font-display font-light text-gray-900 dark:text-white tracking-tight mb-8">Vault is Locked</h2>
            <form onSubmit={handleUnlock} className="space-y-4">
              <input type="password" value={passkeyInput} onChange={(e) => setPasskeyInput(e.target.value)} placeholder="••••" className="w-full px-4 py-3 border border-gray-200 dark:border-neutral-800 bg-transparent text-center font-mono text-lg tracking-widest text-gray-900 dark:text-white focus:border-accent focus:outline-none rounded-none transition-colors" />
              {unlockError && <p className="text-xs font-mono text-red-500">{unlockError}</p>}
              <button type="submit" disabled={unlocking} className="w-full py-3 bg-gray-900 dark:bg-accent text-white dark:text-black font-mono text-xs tracking-wider uppercase hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 rounded-none">
                {unlocking ? <RefreshIcon className="w-4 h-4 animate-spin" /> : <span>Unlock</span>}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black font-sans text-gray-900 dark:text-neutral-100 min-h-screen transition-colors duration-300">
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        
        {/* Header Block matching PracticePage structure */}
        <header className="">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white dark:bg-black border-b border-gray-200 dark:border-neutral-800/80">
            <div className="py-4 sm:py-5 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <Link to="/" className="flex items-center gap-3 sm:gap-4 group">
                <motion.div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0" whileHover={{ rotate: 90 }} transition={{ duration: 0.6 }}>
                  <div className="absolute inset-0 bg-gray-900 dark:bg-white transform rotate-45 rounded-sm" />
                  <div className="absolute inset-1 bg-white dark:bg-neutral-900 transform rotate-45 rounded-sm" />
                  <div className="absolute inset-2 bg-gray-900 dark:bg-accent transform rotate-45 rounded-sm" />
                </motion.div>
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-400 dark:text-neutral-500 font-mono font-light mb-0.5 hidden sm:block">
                    <span className="text-accent font-medium">08</span> &nbsp;&nbsp;PERSONAL VAULT
                  </p>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-light text-gray-900 dark:text-white tracking-tight">
                    Vault
                  </h1>
                </div>
              </Link>
              
              <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-6">
                <button onClick={handleSaveProfile} disabled={saving || loading} className="text-xs font-mono font-medium text-gray-900 dark:text-accent border-b border-transparent hover:border-gray-900 dark:hover:border-accent transition-colors flex items-center gap-2 pb-0.5 cursor-pointer">
                  {saving ? <><RefreshIcon className="w-3.5 h-3.5 animate-spin" /><span>SAVING...</span></> : <span>SAVE CHANGES</span>}
                </button>
                <div className="h-4 w-px bg-gray-200 dark:bg-neutral-800" />
                <ThemeToggle />
                <div className="h-4 w-px bg-gray-200 dark:bg-neutral-800" />
                <Link to="/" className="text-sm font-sans font-light text-gray-500 dark:text-neutral-400 hover:text-accent transition-colors flex items-center gap-2">
                  <span>←</span><span className="hidden sm:inline">Back</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Global Banner */}
        <AnimatePresence>
          {message.text && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="py-2 border-b border-gray-200 dark:border-neutral-800/80">
                <div className="flex items-center gap-2 text-xs font-mono">
                   {message.type === 'error' ? <span className="text-rose-500">ERROR:</span> : <span className="text-emerald-500">SUCCESS:</span>}
                   <span className="text-gray-600 dark:text-neutral-400">{message.text}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main 8-col Architecture Split Grid identical to portfolio core pages */}
        <main className="grid grid-cols-1 lg:grid-cols-8 border-t border-gray-200 dark:border-neutral-800/80 min-h-[calc(100vh-100px)]">
          
          {/* Left Sidebar Index (3 Cols) */}
          <div className="col-span-1 lg:col-span-3 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-neutral-800/80 bg-white dark:bg-black lg:h-screen lg:sticky lg:top-0 lg:overflow-y-auto z-10">
            <div className="p-6 sm:p-8 md:p-10 lg:p-12">
              <div className="mb-12">
                <p className="text-xs text-gray-400 font-mono font-light mb-6">VAULT DIRECTORY</p>
                <div className="space-y-4">
                  {SECTIONS.map((sec, idx) => {
                    const isActive = activeSection === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => setActiveSection(sec.id)}
                        className="w-full text-left group flex items-start justify-between cursor-pointer"
                      >
                        <div className="flex items-start gap-4">
                          <span className={`text-xs font-mono mt-1 transition-colors ${isActive ? 'text-accent' : 'text-gray-400 dark:text-neutral-600 group-hover:text-gray-600 dark:group-hover:text-neutral-400'}`}>
                            {sec.num}
                          </span>
                          <div>
                            <span className={`block text-lg font-display font-light transition-colors ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-neutral-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                              {sec.title}
                            </span>
                            {isActive && (
                              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="block text-xs font-sans text-gray-500 dark:text-neutral-400 mt-1">
                                {sec.sub}
                              </motion.span>
                            )}
                          </div>
                        </div>
                        {isActive && <span className="text-sm font-mono text-gray-900 dark:text-white mt-1">←</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Minimal Stats */}
              <div className="pt-8 border-t border-gray-200 dark:border-neutral-800/80">
                <p className="text-xs text-gray-400 font-mono font-light mb-4">TELEMETRY</p>
                <ul className="space-y-2 text-xs font-sans text-gray-500 dark:text-neutral-400">
                   <li className="flex justify-between"><span>Provider</span> <span className="font-medium text-accent">{formData.aiSettings.defaultProvider.toUpperCase()}</span></li>
                   <li className="flex justify-between"><span>Stories</span> <span>{formData.knowledgeVault?.length || 0}</span></li>
                   <li className="flex justify-between"><span>Attributes</span> <span>{formData.customFields?.length || 0}</span></li>
                   <li className="flex justify-between"><span>Pairing</span> <span className={formData.extensionApiKey ? 'text-emerald-500' : 'text-gray-500'}>{formData.extensionApiKey ? 'Linked' : 'None'}</span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Content Area (5 Cols) */}
          <div className="col-span-1 lg:col-span-5 bg-white dark:bg-black lg:h-screen lg:overflow-y-auto relative">
            <div className="p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20">
              
              {loading ? (
                <div className="flex items-center justify-center h-full text-xs font-mono text-gray-400 py-32">
                  <RefreshIcon className="w-4 h-4 animate-spin mr-2" /> SYNCING REPOSITORY...
                </div>
              ) : (
                <div className="pb-32">
                  {/* ========================================================== */}
                  {/* SECTION 01: IDENTITY                                       */}
                  {/* ========================================================== */}
                  {activeSection === 'facts' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-4xl">
                      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-light leading-tight mb-16 text-gray-900 dark:text-white">
                        <span className="block text-gray-400 dark:text-neutral-600 mb-2">01.</span>
                        Identity & Facts.
                      </h2>
                      
                      <div className="space-y-16">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                          <VaultInput label="Legal First Name" value={formData.personal.legalFirstName} onChange={e => setFormData({...formData, personal: {...formData.personal, legalFirstName: e.target.value}})} placeholder="Vedant" />
                          <VaultInput label="Legal Last Name" value={formData.personal.legalLastName} onChange={e => setFormData({...formData, personal: {...formData.personal, legalLastName: e.target.value}})} placeholder="Lahane" />
                          <VaultInput label="Preferred Name" value={formData.personal.preferredName} onChange={e => setFormData({...formData, personal: {...formData.personal, preferredName: e.target.value}})} />
                          <VaultInput label="Pronouns" value={formData.personal.pronouns} onChange={e => setFormData({...formData, personal: {...formData.personal, pronouns: e.target.value}})} placeholder="he/him" />
                        </div>

                        <div className="pt-12 border-t border-gray-200 dark:border-neutral-800/80 grid grid-cols-1 gap-x-12 gap-y-10">
                          <VaultInput label="Street Address Line 1" value={formData.personal.addressLine1} onChange={e => setFormData({...formData, personal: {...formData.personal, addressLine1: e.target.value}})} />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                            <VaultInput label="City" value={formData.personal.city} onChange={e => setFormData({...formData, personal: {...formData.personal, city: e.target.value}})} />
                            <VaultInput label="State / Province" value={formData.personal.state} onChange={e => setFormData({...formData, personal: {...formData.personal, state: e.target.value}})} />
                            <VaultInput label="Postal Code" value={formData.personal.postalCode} onChange={e => setFormData({...formData, personal: {...formData.personal, postalCode: e.target.value}})} />
                            <VaultInput label="Country" value={formData.personal.country} onChange={e => setFormData({...formData, personal: {...formData.personal, country: e.target.value}})} />
                          </div>
                        </div>

                        <div className="pt-12 border-t border-gray-200 dark:border-neutral-800/80 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                          <VaultInput label="LinkedIn URL" value={formData.personal.linkedinUrl} onChange={e => setFormData({...formData, personal: {...formData.personal, linkedinUrl: e.target.value}})} type="url" />
                          <VaultInput label="GitHub URL" value={formData.personal.githubUrl} onChange={e => setFormData({...formData, personal: {...formData.personal, githubUrl: e.target.value}})} type="url" />
                          <VaultInput label="Portfolio URL" value={formData.personal.portfolioUrl} onChange={e => setFormData({...formData, personal: {...formData.personal, portfolioUrl: e.target.value}})} type="url" />
                          <VaultInput label="Phone Number" value={formData.personal.alternatePhone} onChange={e => setFormData({...formData, personal: {...formData.personal, alternatePhone: e.target.value}})} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ========================================================== */}
                  {/* SECTION 02: CAREER & VISAS                                 */}
                  {/* ========================================================== */}
                  {activeSection === 'career' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-4xl">
                      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-light leading-tight mb-16 text-gray-900 dark:text-white">
                        <span className="block text-gray-400 dark:text-neutral-600 mb-2">02.</span>
                        Career Specs.
                      </h2>

                      <div className="space-y-16">
                        {/* Minimalist Visa Checkboxes */}
                        <div className="space-y-6">
                           <p className="text-[10px] text-gray-400 dark:text-neutral-500 font-mono uppercase tracking-widest mb-4">Work Authorization</p>
                           {[
                             { id: 'authCountryRole', label: 'Legally authorized to work in application country', val: formData.workAuthorization.authorizedInCountryOfRole },
                             { id: 'visaNow', label: 'Requires visa sponsorship now', val: formData.workAuthorization.requiresSponsorshipNow },
                             { id: 'visaFuture', label: 'Requires visa sponsorship in the future', val: formData.workAuthorization.requiresSponsorshipFuture },
                             { id: 'relocateWilling', label: 'Willing to relocate for the position', val: formData.workAuthorization.willingToRelocate }
                           ].map(item => (
                             <label key={item.id} className="flex items-center gap-6 cursor-pointer group">
                               <div className={`w-5 h-5 flex-shrink-0 border transition-all flex items-center justify-center rounded-none ${item.val ? 'bg-gray-900 border-gray-900 dark:bg-white dark:border-white' : 'border-gray-300 dark:border-neutral-700 bg-transparent group-hover:border-gray-500 dark:group-hover:border-neutral-500'}`}>
                                  {item.val && <CheckIcon className="w-3 h-3 text-white dark:text-black" />}
                               </div>
                               <input type="checkbox" className="hidden" checked={item.val} onChange={e => setFormData({...formData, workAuthorization: {...formData.workAuthorization, [item.id]: e.target.checked}})} />
                               <span className="text-lg sm:text-xl font-sans font-light text-gray-600 dark:text-neutral-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{item.label}</span>
                             </label>
                           ))}
                        </div>

                        <div className="pt-12 border-t border-gray-200 dark:border-neutral-800/80 grid grid-cols-1 gap-x-12 gap-y-10">
                           <VaultInput label="Work Mode Preference" value={formData.workAuthorization.workModePreference} onChange={e => setFormData({...formData, workAuthorization: {...formData.workAuthorization, workModePreference: e.target.value}})} placeholder="Flexible (Remote / Hybrid / Onsite)" />
                        </div>

                        <div className="pt-12 border-t border-gray-200 dark:border-neutral-800/80 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                           <VaultInput label="Notice Period" value={formData.compensation.noticePeriodDays} onChange={e => setFormData({...formData, compensation: {...formData.compensation, noticePeriodDays: e.target.value}})} placeholder="0 (Immediate)" />
                           <VaultInput label="Current Salary (LPA / Annual)" value={formData.compensation.currentSalary} onChange={e => setFormData({...formData, compensation: {...formData.compensation, currentSalary: e.target.value}})} />
                           <VaultInput label="Expected Salary" value={formData.compensation.expectedSalary} onChange={e => setFormData({...formData, compensation: {...formData.compensation, expectedSalary: e.target.value}})} />
                           <VaultInput label="Currency" value={formData.compensation.currency} onChange={e => setFormData({...formData, compensation: {...formData.compensation, currency: e.target.value}})} placeholder="INR" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ========================================================== */}
                  {/* SECTION 03: KNOWLEDGE VAULT                                */}
                  {/* ========================================================== */}
                  {activeSection === 'knowledge' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-4xl">
                      <div className="flex justify-between items-end mb-16">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-light leading-tight text-gray-900 dark:text-white">
                          <span className="block text-gray-400 dark:text-neutral-600 mb-2">03.</span>
                          Knowledge.
                        </h2>
                        <button onClick={() => setIsAddingKnowledge(true)} className="text-xs font-mono font-medium text-gray-900 dark:text-accent border-b border-transparent hover:border-gray-900 dark:hover:border-accent transition-colors flex items-center gap-2 pb-0.5 cursor-pointer">
                          <PlusIcon className="w-3.5 h-3.5" /> ADD STORY
                        </button>
                      </div>

                      {isAddingKnowledge && (
                        <div className="mb-16 p-8 border border-gray-200 dark:border-neutral-800">
                          <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-display font-light">New Narrative</h3>
                            <button onClick={() => setIsAddingKnowledge(false)} className="text-xs font-mono text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">CANCEL</button>
                          </div>
                          
                          <form onSubmit={handleAddKnowledge} className="space-y-8">
                            <VaultInput label="Story Title" value={newKnowledge.title} onChange={e => setNewKnowledge({...newKnowledge, title: e.target.value})} placeholder="e.g., Scaling a database under load" />
                            <VaultInput type="textarea" label="Narrative / STAR Context" value={newKnowledge.content} onChange={e => setNewKnowledge({...newKnowledge, content: e.target.value})} placeholder="Describe the situation, task, action, and result..." />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                               <div>
                                 <label className="block text-[10px] text-gray-400 dark:text-neutral-500 font-mono uppercase tracking-widest mb-1">Category</label>
                                 <select
                                    value={newKnowledge.category}
                                    onChange={e => setNewKnowledge({...newKnowledge, category: e.target.value})}
                                    className="w-full bg-transparent border-b border-gray-300 dark:border-neutral-700 px-0 py-2 text-base sm:text-lg font-sans font-light text-gray-900 dark:text-white focus:outline-none transition-colors"
                                 >
                                    {KNOWLEDGE_CATEGORIES.filter(c => c !== 'All').map(c => (
                                      <option key={c} value={c} className="bg-white dark:bg-neutral-900 text-sm">{c}</option>
                                    ))}
                                 </select>
                               </div>
                               <VaultInput label="Tags (Comma separated)" value={newKnowledge.tags} onChange={e => setNewKnowledge({...newKnowledge, tags: e.target.value})} placeholder="React, Performance, Leadership" />
                            </div>
                            <button type="submit" className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-mono text-xs tracking-widest uppercase hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
                               SAVE NARRATIVE
                            </button>
                          </form>
                        </div>
                      )}

                      <div className="space-y-0">
                        {filteredKnowledge.length === 0 ? (
                          <div className="py-12 border-t border-gray-200 dark:border-neutral-800 text-sm font-sans text-gray-500 dark:text-neutral-400">
                            No knowledge stories recorded yet.
                          </div>
                        ) : (
                          filteredKnowledge.map((item) => (
                            <div key={item.id} className="group border-t border-gray-200 dark:border-neutral-800/80 py-8 flex flex-col items-start gap-4 transition-colors hover:bg-gray-50/50 dark:hover:bg-neutral-900/10">
                              <div className="flex w-full justify-between items-start gap-4">
                                <h3 className="text-2xl sm:text-3xl font-display font-light text-gray-900 dark:text-white">
                                  {item.title}
                                </h3>
                                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => handleDeleteKnowledge(item.id)} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer" title="Delete">
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-lg font-sans font-light text-gray-600 dark:text-neutral-400 leading-relaxed max-w-3xl">
                                {item.content}
                              </p>
                              <div className="flex flex-wrap gap-4 mt-2 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                                <span className="text-accent">{item.category}</span>
                                {item.tags && Array.isArray(item.tags) && item.tags.map(t => (
                                  <span key={t}>#{t}</span>
                                ))}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* ========================================================== */}
                  {/* SECTION 04: CUSTOM ATTRIBUTES                              */}
                  {/* ========================================================== */}
                  {activeSection === 'custom' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-4xl">
                      <div className="flex justify-between items-end mb-16">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-light leading-tight text-gray-900 dark:text-white">
                          <span className="block text-gray-400 dark:text-neutral-600 mb-2">04.</span>
                          Attributes.
                        </h2>
                      </div>
                      
                      <div className="mb-16 p-8 border border-gray-200 dark:border-neutral-800">
                        <h3 className="text-xl font-display font-light mb-8">Add Custom Field</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                           <VaultInput label="Unique Key" value={newField.key} onChange={e => setNewField({...newField, key: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_')})} placeholder="github_username" />
                           <VaultInput label="Value" value={newField.value} onChange={e => setNewField({...newField, value: e.target.value})} placeholder="vedantlahane" />
                        </div>
                        <button type="button" onClick={() => {
                          if (!newField.key || !newField.value) return;
                          setFormData(prev => ({...prev, customFields: [...prev.customFields, {...newField}]}));
                          setNewField({key:'', label:'', value:'', category:'General', isSensitive:false});
                        }} className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-black font-mono text-xs tracking-widest uppercase hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer">
                          Add Field
                        </button>
                      </div>

                      <div className="space-y-0">
                        {formData.customFields.length === 0 ? (
                          <div className="py-12 border-t border-gray-200 dark:border-neutral-800 text-sm font-sans text-gray-500 dark:text-neutral-400">
                            No custom attributes defined.
                          </div>
                        ) : (
                          formData.customFields.map((field, idx) => (
                            <div key={idx} className="group border-t border-gray-200 dark:border-neutral-800/80 py-6 flex items-start justify-between gap-4 transition-colors hover:bg-gray-50/50 dark:hover:bg-neutral-900/10">
                              <div className="flex-1">
                                <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest mb-1">{field.key}</p>
                                <p className="text-xl font-sans font-light text-gray-900 dark:text-white">{field.value}</p>
                              </div>
                              <button onClick={() => setFormData(prev => ({...prev, customFields: prev.customFields.filter((_, i) => i !== idx)}))} className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer opacity-0 group-hover:opacity-100">
                                <TrashIcon className="w-4 h-4" />
                              </button>
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
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-4xl">
                      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-light leading-tight mb-16 text-gray-900 dark:text-white">
                        <span className="block text-gray-400 dark:text-neutral-600 mb-2">05.</span>
                        AI Engine.
                      </h2>

                      <div className="space-y-16">
                        <div className="grid grid-cols-1 gap-12">
                           <div>
                             <label className="block text-[10px] text-gray-400 dark:text-neutral-500 font-mono uppercase tracking-widest mb-4">Default Provider</label>
                             <select
                                value={formData.aiSettings.defaultProvider}
                                onChange={e => setFormData({...formData, aiSettings: {...formData.aiSettings, defaultProvider: e.target.value}})}
                                className="w-full sm:w-1/2 bg-transparent border-b border-gray-300 dark:border-neutral-700 px-0 py-2 text-xl font-sans font-light text-gray-900 dark:text-white focus:outline-none transition-colors"
                             >
                                <option value="groq" className="bg-white dark:bg-neutral-900 text-sm">Groq LPUs</option>
                                <option value="gemini" className="bg-white dark:bg-neutral-900 text-sm">Google Gemini</option>
                             </select>
                           </div>
                           
                           {formData.aiSettings.defaultProvider === 'groq' && (
                             <VaultInput label="Groq Model" value={formData.aiSettings.groqModel} onChange={e => setFormData({...formData, aiSettings: {...formData.aiSettings, groqModel: e.target.value}})} />
                           )}
                           {formData.aiSettings.defaultProvider === 'gemini' && (
                             <VaultInput label="Gemini Model" value={formData.aiSettings.geminiModel} onChange={e => setFormData({...formData, aiSettings: {...formData.aiSettings, geminiModel: e.target.value}})} />
                           )}
                           
                           <VaultInput type="textarea" label="System Prompt / Form-filling persona" value={formData.aiSettings.systemPrompt} onChange={e => setFormData({...formData, aiSettings: {...formData.aiSettings, systemPrompt: e.target.value}})} placeholder="You are an expert ATS recruitment assistant..." />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* ========================================================== */}
                  {/* SECTION 06: PAIRING                                        */}
                  {/* ========================================================== */}
                  {activeSection === 'pairing' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-4xl">
                      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-light leading-tight mb-16 text-gray-900 dark:text-white">
                        <span className="block text-gray-400 dark:text-neutral-600 mb-2">06.</span>
                        Pairing.
                      </h2>

                      <div className="space-y-12">
                        <p className="text-lg font-sans font-light text-gray-600 dark:text-neutral-400 leading-relaxed">
                          Link your Chrome Extension to this portfolio via the secure API key below.
                        </p>

                        <div className="p-8 border border-gray-200 dark:border-neutral-800">
                          <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest mb-4">Secret Key</p>
                          {formData.extensionApiKey ? (
                            <div className="flex items-center justify-between">
                              <code className="text-lg sm:text-2xl font-mono text-gray-900 dark:text-white break-all pr-4">
                                {formData.extensionApiKey.substring(0, 12)}...{formData.extensionApiKey.slice(-4)}
                              </code>
                              <button onClick={handleCopyKey} className="text-gray-400 hover:text-accent transition-colors flex-shrink-0 cursor-pointer">
                                {copiedKey ? <CheckIcon className="w-6 h-6 text-emerald-500" /> : <CopyIcon className="w-6 h-6" />}
                              </button>
                            </div>
                          ) : (
                            <p className="text-sm font-mono text-amber-500">No key generated.</p>
                          )}
                          
                          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-neutral-800/80">
                            <button onClick={handleGenerateKey} disabled={generatingKey} className="text-xs font-mono font-medium text-rose-500 border-b border-transparent hover:border-rose-500 transition-colors flex items-center gap-2 pb-0.5 cursor-pointer">
                              {generatingKey ? <><RefreshIcon className="w-3.5 h-3.5 animate-spin" /><span>GENERATING...</span></> : <span>{formData.extensionApiKey ? 'REVOKE & REGENERATE KEY' : 'GENERATE KEY'}</span>}
                            </button>
                          </div>
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
