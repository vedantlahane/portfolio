import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin, API_URL } from '../../context/AdminContext';

// Helper to strip single-line and multi-line comments before JSON.parse
export const stripComments = (str) => {
  return str
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^\\:])\/\/.*$/gm, '$1')
    .trim();
};

// Generates a fully annotated JSON template with comments explaining every field
export const formatDataWithComments = (data) => {
  const profile = data.profile || {};
  const projects = data.projects || [];
  const skills = data.skills || [];

  const template = `// ==========================================================
// PORTFOLIO CONFIGURATION (JSON with Comments)
// You can edit any value below. Comments (//) are preserved.
// Click "SAVE CHANGES" when you are done.
// ==========================================================
{
  // --------------------------------------------------------
  // SECTION 1: PROFILE & HERO DETAILS
  // --------------------------------------------------------
  "profile": {
    // Top greeting text on Hero (e.g. "Hello")
    "greeting": ${JSON.stringify(profile.greeting || 'Hello')},

    // Your full display name
    "name": ${JSON.stringify(profile.name || 'Vedant Lahane')},

    // Dynamic cycling roles displayed in hero
    "roles": ${JSON.stringify(profile.roles || ['learner', 'creator', 'developer', 'student'], null, 4).replace(/\n/g, '\n    ')},

    // Hero introductory bio text
    "heroDescription": ${JSON.stringify(profile.heroDescription || '', null, 4).replace(/\n/g, '\n    ')},

    // Direct URL for your resume / CV (Google Drive, Dropbox, or hosted file)
    "cvLink": ${JSON.stringify(profile.cvLink || '')},

    // Status badges shown below resume button (e.g. "Open to internships")
    "statusIndicators": ${JSON.stringify(profile.statusIndicators || ['Open to internships', 'Learning daily'], null, 4).replace(/\n/g, '\n    ')},

    // Numeric metric counters on Hero part 2
    "experiences": ${JSON.stringify(profile.experiences || [
      { "label": "Flagship Projects", "value": "3+" },
      { "label": "DSA Problems", "value": "350+" },
      { "label": "Certifications", "value": "10+" },
      { "label": "Known Technologies", "value": "15+" }
    ], null, 4).replace(/\n/g, '\n    ')},

    // Featured skills shown in interactive slider on Hero part 2 (level: 0 to 100)
    "featuredSkills": ${JSON.stringify(profile.featuredSkills || [
      { "name": "React + TypeScript", "level": 85 },
      { "name": "Node.js + Express", "level": 82 }
    ], null, 4).replace(/\n/g, '\n    ')},

    // Status pills shown under featured skills
    "me2StatusLabels": ${JSON.stringify(profile.me2StatusLabels || ['Building', 'RAG, RBAC', 'Open to SDE/AI Intern'], null, 4).replace(/\n/g, '\n    ')},

    // Tagline heading for the About section
    "aboutSubhead": ${JSON.stringify(profile.aboutSubhead || 'Driven by curiosity. Defined by execution.')},

    // Full narrative story in the About section
    "aboutText": ${JSON.stringify(profile.aboutText || '', null, 4).replace(/\n/g, '\n    ')},

    // Words from aboutText to highlight in bright white bold
    "highlightKeywords": ${JSON.stringify(profile.highlightKeywords || ['scalable', 'AI-powered', 'React'], null, 4).replace(/\n/g, '\n    ')},

    // Primary contact email address
    "email": ${JSON.stringify(profile.email || 'vedantanillahane@gmail.com')},

    // Primary contact phone number
    "phone": ${JSON.stringify(profile.phone || '+91 7447335096')}
  },

  // --------------------------------------------------------
  // SECTION 2: PROJECTS
  // Each project must have: title, year, description, tech, type
  // Optional: featured (boolean), github (URL), live (URL or null), order (number)
  // --------------------------------------------------------
  "projects": ${JSON.stringify(projects.map(p => ({
    title: p.title,
    year: p.year,
    description: p.description,
    tech: p.tech,
    type: p.type,
    featured: p.featured,
    github: p.github || '',
    live: p.live || null,
    order: p.order || 0
  })), null, 4).replace(/\n/g, '\n  ')},

  // --------------------------------------------------------
  // SECTION 3: SKILLS
  // Grouped skill categories with their lists of skills
  // --------------------------------------------------------
  "skills": ${JSON.stringify(skills.map(s => ({
    key: s.key,
    title: s.title,
    skills: s.skills,
    order: s.order || 0
  })), null, 4).replace(/\n/g, '\n  ')}
}`;

  return template;
};

const JsonEditorModal = ({ isOpen, onClose }) => {
  const { token } = useAdmin();
  const [jsonText, setJsonText] = useState('');
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'profile' | 'projects' | 'skills'
  const textareaRef = useRef(null);

  // Fetch all portfolio data on open
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setLoading(true);
      setError('');
      setSuccessMsg('');
      try {
        const res = await fetch(`${API_URL}/api/admin/data`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch portfolio data');
        }

        const data = await res.json();
        setOriginalData(data);
        setJsonText(formatDataWithComments(data));
      } catch (err) {
        console.error('Fetch admin data error:', err);
        setError(err.message || 'Error loading data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, token]);

  // Switch tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (!originalData) return;

    if (tab === 'all') {
      setJsonText(formatDataWithComments(originalData));
    } else if (tab === 'profile') {
      setJsonText(`// Profile Section\n` + JSON.stringify(originalData.profile, null, 2));
    } else if (tab === 'projects') {
      setJsonText(`// Projects List\n` + JSON.stringify(originalData.projects, null, 2));
    } else if (tab === 'skills') {
      setJsonText(`// Skills Categories\n` + JSON.stringify(originalData.skills, null, 2));
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  // Format / Prettify
  const handleFormat = () => {
    try {
      const cleaned = stripComments(jsonText);
      const parsed = JSON.parse(cleaned);
      if (activeTab === 'all') {
        setJsonText(formatDataWithComments(parsed));
      } else {
        setJsonText(JSON.stringify(parsed, null, 2));
      }
      setError('');
    } catch (err) {
      setError(`JSON Parse Error: ${err.message}`);
    }
  };

  // Reset to original data
  const handleReset = () => {
    if (!originalData) return;
    if (window.confirm('Reset all changes back to currently saved data?')) {
      handleTabChange(activeTab);
      setError('');
    }
  };

  // Save changes
  const handleSave = async () => {
    setError('');
    setSuccessMsg('');

    try {
      const cleaned = stripComments(jsonText);
      const parsed = JSON.parse(cleaned);

      setSaving(true);

      let payload = {};
      if (activeTab === 'all') {
        payload = parsed;
      } else if (activeTab === 'profile') {
        payload = { profile: parsed };
      } else if (activeTab === 'projects') {
        payload = { projects: parsed };
      } else if (activeTab === 'skills') {
        payload = { skills: parsed };
      }

      const res = await fetch(`${API_URL}/api/admin/data`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to save changes');
      }

      setOriginalData(result.data);
      setSuccessMsg('Portfolio data saved successfully!');

      // Notify page components to refresh
      window.dispatchEvent(new CustomEvent('portfolio-data-updated', { detail: result.data }));

      setTimeout(() => {
        setSuccessMsg('');
      }, 3000);
    } catch (err) {
      console.error('Save error:', err);
      setError(`Save Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-neutral-950 border border-neutral-800 text-neutral-100 w-full max-w-5xl h-[92vh] max-h-[900px] flex flex-col shadow-2xl overflow-hidden font-sans"
        >
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3.5 border-b border-neutral-800 bg-neutral-900/50 gap-2">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h3 className="text-sm sm:text-base font-mono font-medium tracking-wider uppercase text-neutral-100 flex items-center gap-2">
                  <span>{'{ }'}</span> PORTFOLIO JSON EDITOR
                </h3>
                <p className="text-[11px] text-neutral-400 font-sans">
                  Directly edit all data with full comment support (<code>//</code>).
                </p>
              </div>
            </div>

            {/* Tab selector */}
            <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 text-xs font-mono">
              {[
                { id: 'all', label: 'All Data' },
                { id: 'profile', label: 'Profile' },
                { id: 'projects', label: 'Projects' },
                { id: 'skills', label: 'Skills' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleTabChange(t.id)}
                  className={`px-2.5 py-1 transition-colors cursor-pointer ${
                    activeTab === t.id
                      ? 'bg-neutral-800 text-accent font-semibold'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition-colors p-1 text-lg font-mono leading-none self-end sm:self-auto cursor-pointer"
              title="Close modal (Esc)"
            >
              ✕
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-2 border-b border-neutral-800/60 bg-neutral-900/30 text-xs font-mono gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleFormat}
                className="px-2.5 py-1 border border-neutral-700 hover:bg-neutral-800 text-neutral-300 transition-colors cursor-pointer flex items-center gap-1.5"
                title="Validate syntax and format JSON"
              >
                <span>⚡</span> Format JSON
              </button>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 border border-neutral-700 hover:bg-neutral-800 text-neutral-300 transition-colors cursor-pointer flex items-center gap-1.5"
                title="Copy entire JSON to clipboard"
              >
                <span>{copied ? '✓' : '📋'}</span> {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleReset}
                className="px-2.5 py-1 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
                title="Revert back to current database values"
              >
                Reset
              </button>
            </div>

            {/* Feedback messages */}
            <div className="text-xs">
              {error && (
                <span className="text-rose-400 flex items-center gap-1.5 font-mono">
                  <span>✕</span> {error}
                </span>
              )}
              {successMsg && (
                <span className="text-emerald-400 flex items-center gap-1.5 font-mono">
                  <span>✓</span> {successMsg}
                </span>
              )}
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 relative bg-black p-0 overflow-hidden">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center text-neutral-400 font-mono text-sm gap-3">
                <span className="animate-spin text-lg">⟳</span>
                LOADING PORTFOLIO DATA...
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={jsonText}
                onChange={(e) => {
                  setJsonText(e.target.value);
                  if (error) setError('');
                }}
                spellCheck="false"
                className="w-full h-full bg-black text-neutral-200 font-mono text-xs sm:text-sm p-4 sm:p-6 resize-none focus:outline-none leading-relaxed border-none selection:bg-neutral-700"
                placeholder="// Enter portfolio JSON with comments..."
              />
            )}
          </div>

          {/* Footer Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3 border-t border-neutral-800 bg-neutral-900/60 gap-3">
            <div className="text-[11px] text-neutral-400 font-mono">
              💡 Tip: Single-line <code className="text-neutral-300">// comments</code> are supported and will not cause errors.
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-neutral-700 text-xs font-mono uppercase tracking-wider text-neutral-300 hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving || loading}
                className={`px-5 py-2 bg-accent text-neutral-950 hover:bg-accent/90 border border-accent text-xs font-mono font-medium uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  saving ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                {saving ? (
                  <>
                    <span className="animate-spin text-xs">⟳</span>
                    SAVING...
                  </>
                ) : (
                  'SAVE CHANGES'
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default JsonEditorModal;
