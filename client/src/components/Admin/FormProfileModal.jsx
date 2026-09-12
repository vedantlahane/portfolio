import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin, API_URL } from '../../context/AdminContext';

const FormProfileModal = ({ isOpen, onClose }) => {
  const { token } = useAdmin();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatingKey, setGeneratingKey] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [copiedKey, setCopiedKey] = useState(false);

  // Form Profile State
  const [formProfile, setFormProfile] = useState({
    personal: {
      legalFirstName: '',
      legalLastName: '',
      preferredName: '',
      gender: '',
      pronouns: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: 'India',
      postalCode: '',
      nationality: 'Indian',
      citizenship: 'India',
      passportNumber: '',
      alternatePhone: ''
    },
    education: [
      {
        institution: '',
        degree: 'Bachelor of Technology',
        major: 'Computer Science & Engineering',
        gpa: '',
        startYear: '2022',
        graduationYear: '2026',
        location: ''
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
    extensionApiKey: ''
  });

  // Fetch form profile on open
  useEffect(() => {
    if (!isOpen || !token) return;

    const fetchFormProfile = async () => {
      setLoading(true);
      setStatusMsg({ type: '', text: '' });
      try {
        const res = await fetch(`${API_URL}/api/form-profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Failed to load private form profile');
        const data = await res.json();
        if (data.data?.formProfile) {
          setFormProfile(prev => ({
            ...prev,
            ...data.data.formProfile,
            personal: { ...prev.personal, ...(data.data.formProfile.personal || {}) },
            compensation: { ...prev.compensation, ...(data.data.formProfile.compensation || {}) },
            workAuthorization: { ...prev.workAuthorization, ...(data.data.formProfile.workAuthorization || {}) },
            statements: { ...prev.statements, ...(data.data.formProfile.statements || {}) },
            education: data.data.formProfile.education?.length ? data.data.formProfile.education : prev.education,
            workExperience: data.data.formProfile.workExperience || [],
            customFields: data.data.formProfile.customFields || [],
            extensionApiKey: data.data.extensionApiKey || ''
          }));
        }
      } catch (err) {
        console.error('Fetch Form Profile Error:', err);
        setStatusMsg({ type: 'error', text: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchFormProfile();
  }, [isOpen, token]);

  // Handle Save
  const handleSave = async () => {
    setSaving(true);
    setStatusMsg({ type: '', text: '' });
    try {
      const res = await fetch(`${API_URL}/api/form-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formProfile)
      });

      if (!res.ok) throw new Error('Failed to save changes');
      setStatusMsg({ type: 'success', text: 'Private form profile saved successfully!' });
      setTimeout(() => setStatusMsg({ type: '', text: '' }), 3500);
    } catch (err) {
      console.error('Save Error:', err);
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  // Generate / Regenerate Key
  const handleRegenerateKey = async () => {
    if (!window.confirm('Generate a new Extension API Key? Your existing extension will need the updated key.')) return;
    setGeneratingKey(true);
    try {
      const res = await fetch(`${API_URL}/api/form-profile/generate-key`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.apiKey) {
        setFormProfile(prev => ({ ...prev, extensionApiKey: data.apiKey }));
        setStatusMsg({ type: 'success', text: 'New API Key generated!' });
        setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setGeneratingKey(false);
    }
  };

  // Copy API key to clipboard
  const handleCopyKey = () => {
    if (!formProfile.extensionApiKey) return;
    navigator.clipboard.writeText(formProfile.extensionApiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Custom Field Helpers
  const handleAddCustomField = () => {
    const newField = {
      key: `field_${Date.now()}`,
      label: 'New Question',
      value: '',
      category: 'General'
    };
    setFormProfile(prev => ({
      ...prev,
      customFields: [...prev.customFields, newField]
    }));
  };

  const handleUpdateCustomField = (index, field, value) => {
    setFormProfile(prev => {
      const updated = [...prev.customFields];
      updated[index] = { ...updated[index], [field]: value };
      if (field === 'label' && (!updated[index].key || updated[index].key.startsWith('field_'))) {
        updated[index].key = value.toLowerCase().replace(/[^a-z0-9_]/g, '_');
      }
      return { ...prev, customFields: updated };
    });
  };

  const handleDeleteCustomField = (index) => {
    setFormProfile(prev => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index)
    }));
  };

  // Work Experience Helpers
  const handleAddWorkExp = () => {
    setFormProfile(prev => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        { company: '', title: '', location: '', startDate: '', endDate: 'Present', isCurrent: true, description: '' }
      ]
    }));
  };

  const handleUpdateWorkExp = (index, field, value) => {
    setFormProfile(prev => {
      const updated = [...prev.workExperience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, workExperience: updated };
    });
  };

  const handleDeleteWorkExp = (index) => {
    setFormProfile(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'personal', label: '👤 Contact & Address' },
    { id: 'education', label: '🎓 Education & Work' },
    { id: 'compensation', label: '💼 Compensation & Visas' },
    { id: 'statements', label: '📝 Answer Vault' },
    { id: 'custom', label: `⚙️ Custom Fields (${formProfile.customFields.length})` },
    { id: 'extension', label: '🔌 Extension Pairing' }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-neutral-950 border border-neutral-800 text-neutral-100 w-full max-w-5xl h-[92vh] max-h-[900px] flex flex-col shadow-2xl overflow-hidden font-sans"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-900/60 gap-3">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
              <div>
                <h3 className="text-sm sm:text-base font-mono font-medium tracking-wider uppercase text-neutral-100 flex items-center gap-2">
                  <span>📋</span> PRIVATE FORM-FILLING PROFILE
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Data stored here is strictly private and powers your browser extension autofill. Never shown publicly.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white transition-colors p-1 text-lg font-mono leading-none self-end sm:self-auto cursor-pointer"
              title="Close modal (Esc)"
            >
              ✕
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-neutral-800/80 bg-neutral-900/30 overflow-x-auto no-scrollbar text-xs font-mono">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-2 whitespace-nowrap transition-colors rounded-xs cursor-pointer ${
                  activeTab === t.id
                    ? 'bg-neutral-800 text-accent font-semibold border-b-2 border-accent'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Content Body */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center h-64 text-neutral-400 font-mono text-sm gap-2">
                <span className="animate-spin text-lg">⟳</span> Loading private profile...
              </div>
            ) : (
              <div>
                {/* Status alert */}
                {statusMsg.text && (
                  <div className={`mb-4 px-4 py-2.5 text-xs font-mono rounded-xs border ${
                    statusMsg.type === 'error'
                      ? 'bg-red-950/40 border-red-800 text-red-300'
                      : 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                  }`}>
                    {statusMsg.type === 'error' ? '✕ ' : '✓ '} {statusMsg.text}
                  </div>
                )}

                {/* TAB 1: Personal & Contact */}
                {activeTab === 'personal' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-mono text-accent uppercase tracking-wider mb-3">Legal Names & Demographics</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Legal First Name</label>
                          <input
                            type="text"
                            value={formProfile.personal.legalFirstName}
                            onChange={e => setFormProfile(p => ({ ...p, personal: { ...p.personal, legalFirstName: e.target.value } }))}
                            className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                            placeholder="Vedant"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Legal Last Name</label>
                          <input
                            type="text"
                            value={formProfile.personal.legalLastName}
                            onChange={e => setFormProfile(p => ({ ...p, personal: { ...p.personal, legalLastName: e.target.value } }))}
                            className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                            placeholder="Lahane"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Preferred Name</label>
                          <input
                            type="text"
                            value={formProfile.personal.preferredName}
                            onChange={e => setFormProfile(p => ({ ...p, personal: { ...p.personal, preferredName: e.target.value } }))}
                            className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                            placeholder="Vedant"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Pronouns</label>
                          <input
                            type="text"
                            value={formProfile.personal.pronouns}
                            onChange={e => setFormProfile(p => ({ ...p, personal: { ...p.personal, pronouns: e.target.value } }))}
                            className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                            placeholder="he/him"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Gender (for Equal Opportunity forms)</label>
                          <input
                            type="text"
                            value={formProfile.personal.gender}
                            onChange={e => setFormProfile(p => ({ ...p, personal: { ...p.personal, gender: e.target.value } }))}
                            className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                            placeholder="Male / Decline to self-identify"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Alternate Phone</label>
                          <input
                            type="text"
                            value={formProfile.personal.alternatePhone}
                            onChange={e => setFormProfile(p => ({ ...p, personal: { ...p.personal, alternatePhone: e.target.value } }))}
                            className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                            placeholder="+91 ..."
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-800">
                      <h4 className="text-xs font-mono text-accent uppercase tracking-wider mb-3">Residential Address & Citizenship</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Street Address Line 1</label>
                          <input
                            type="text"
                            value={formProfile.personal.addressLine1}
                            onChange={e => setFormProfile(p => ({ ...p, personal: { ...p.personal, addressLine1: e.target.value } }))}
                            className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                            placeholder="Apartment, Street Address"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Street Address Line 2 (Optional)</label>
                          <input
                            type="text"
                            value={formProfile.personal.addressLine2}
                            onChange={e => setFormProfile(p => ({ ...p, personal: { ...p.personal, addressLine2: e.target.value } }))}
                            className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                            placeholder="Suite, Landmark"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">City</label>
                          <input
                            type="text"
                            value={formProfile.personal.city}
                            onChange={e => setFormProfile(p => ({ ...p, personal: { ...p.personal, city: e.target.value } }))}
                            className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                            placeholder="Amravati"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">State / Province</label>
                          <input
                            type="text"
                            value={formProfile.personal.state}
                            onChange={e => setFormProfile(p => ({ ...p, personal: { ...p.personal, state: e.target.value } }))}
                            className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                            placeholder="Maharashtra"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Country</label>
                          <input
                            type="text"
                            value={formProfile.personal.country}
                            onChange={e => setFormProfile(p => ({ ...p, personal: { ...p.personal, country: e.target.value } }))}
                            className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                            placeholder="India"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Postal / ZIP Code</label>
                          <input
                            type="text"
                            value={formProfile.personal.postalCode}
                            onChange={e => setFormProfile(p => ({ ...p, personal: { ...p.personal, postalCode: e.target.value } }))}
                            className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                            placeholder="444604"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                        <div>
                          <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Nationality</label>
                          <input
                            type="text"
                            value={formProfile.personal.nationality}
                            onChange={e => setFormProfile(p => ({ ...p, personal: { ...p.personal, nationality: e.target.value } }))}
                            className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                            placeholder="Indian"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Citizenship</label>
                          <input
                            type="text"
                            value={formProfile.personal.citizenship}
                            onChange={e => setFormProfile(p => ({ ...p, personal: { ...p.personal, citizenship: e.target.value } }))}
                            className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                            placeholder="India"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Passport / National ID</label>
                          <input
                            type="text"
                            value={formProfile.personal.passportNumber}
                            onChange={e => setFormProfile(p => ({ ...p, personal: { ...p.personal, passportNumber: e.target.value } }))}
                            className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                            placeholder="Optional passport / ID"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: Education & Work */}
                {activeTab === 'education' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-mono text-accent uppercase tracking-wider mb-3">Primary Education (College / University)</h4>
                      {formProfile.education.map((edu, idx) => (
                        <div key={idx} className="p-4 bg-neutral-900/40 border border-neutral-800 mb-4 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">College / University Name</label>
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={e => {
                                  const val = e.target.value;
                                  setFormProfile(p => {
                                    const updated = [...p.education];
                                    updated[idx].institution = val;
                                    return { ...p, education: updated };
                                  });
                                }}
                                className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                                placeholder="Government College of Engineering, Amravati"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Degree</label>
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={e => {
                                  const val = e.target.value;
                                  setFormProfile(p => {
                                    const updated = [...p.education];
                                    updated[idx].degree = val;
                                    return { ...p, education: updated };
                                  });
                                }}
                                className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                                placeholder="Bachelor of Technology"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Major / Field of Study</label>
                              <input
                                type="text"
                                value={edu.major}
                                onChange={e => {
                                  const val = e.target.value;
                                  setFormProfile(p => {
                                    const updated = [...p.education];
                                    updated[idx].major = val;
                                    return { ...p, education: updated };
                                  });
                                }}
                                className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                                placeholder="Computer Science & Engineering"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">CGPA / Percentage</label>
                              <input
                                type="text"
                                value={edu.gpa}
                                onChange={e => {
                                  const val = e.target.value;
                                  setFormProfile(p => {
                                    const updated = [...p.education];
                                    updated[idx].gpa = val;
                                    return { ...p, education: updated };
                                  });
                                }}
                                className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                                placeholder="e.g. 8.5 / 10"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Start Year</label>
                              <input
                                type="text"
                                value={edu.startYear}
                                onChange={e => {
                                  const val = e.target.value;
                                  setFormProfile(p => {
                                    const updated = [...p.education];
                                    updated[idx].startYear = val;
                                    return { ...p, education: updated };
                                  });
                                }}
                                className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                                placeholder="2022"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Graduation Year</label>
                              <input
                                type="text"
                                value={edu.graduationYear}
                                onChange={e => {
                                  const val = e.target.value;
                                  setFormProfile(p => {
                                    const updated = [...p.education];
                                    updated[idx].graduationYear = val;
                                    return { ...p, education: updated };
                                  });
                                }}
                                className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                                placeholder="2026"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-neutral-800">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-mono text-accent uppercase tracking-wider">Work History & Internships</h4>
                        <button
                          type="button"
                          onClick={handleAddWorkExp}
                          className="px-2.5 py-1 text-xs font-mono bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-none cursor-pointer"
                        >
                          + Add Experience
                        </button>
                      </div>

                      {formProfile.workExperience.length === 0 ? (
                        <p className="text-xs text-neutral-500 font-mono italic">No work history entries yet. Click "+ Add Experience" if applicable.</p>
                      ) : (
                        formProfile.workExperience.map((exp, idx) => (
                          <div key={idx} className="p-4 bg-neutral-900/40 border border-neutral-800 mb-3 space-y-3 relative">
                            <button
                              type="button"
                              onClick={() => handleDeleteWorkExp(idx)}
                              className="absolute top-2 right-2 text-neutral-500 hover:text-rose-400 text-xs font-mono cursor-pointer"
                            >
                              ✕ Remove
                            </button>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Company / Organization</label>
                                <input
                                  type="text"
                                  value={exp.company}
                                  onChange={e => handleUpdateWorkExp(idx, 'company', e.target.value)}
                                  className="w-full bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Job Title / Role</label>
                                <input
                                  type="text"
                                  value={exp.title}
                                  onChange={e => handleUpdateWorkExp(idx, 'title', e.target.value)}
                                  className="w-full bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Start Date</label>
                                <input
                                  type="text"
                                  value={exp.startDate}
                                  onChange={e => handleUpdateWorkExp(idx, 'startDate', e.target.value)}
                                  className="w-full bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                                  placeholder="Jan 2024"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">End Date</label>
                                <input
                                  type="text"
                                  value={exp.endDate}
                                  onChange={e => handleUpdateWorkExp(idx, 'endDate', e.target.value)}
                                  className="w-full bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                                  placeholder="Present"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Location</label>
                                <input
                                  type="text"
                                  value={exp.location}
                                  onChange={e => handleUpdateWorkExp(idx, 'location', e.target.value)}
                                  className="w-full bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                                  placeholder="Remote / City"
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: Compensation & Preferences */}
                {activeTab === 'compensation' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-mono text-accent uppercase tracking-wider mb-3">Salary & Availability</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Current Salary</label>
                          <input
                            type="text"
                            value={formProfile.compensation.currentSalary}
                            onChange={e => setFormProfile(p => ({ ...p, compensation: { ...p.compensation, currentSalary: e.target.value } }))}
                            className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                            placeholder="e.g. 0 or 8,00,000"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Expected Salary</label>
                          <input
                            type="text"
                            value={formProfile.compensation.expectedSalary}
                            onChange={e => setFormProfile(p => ({ ...p, compensation: { ...p.compensation, expectedSalary: e.target.value } }))}
                            className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                            placeholder="e.g. Competitive / Negotiable"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Currency</label>
                          <input
                            type="text"
                            value={formProfile.compensation.currency}
                            onChange={e => setFormProfile(p => ({ ...p, compensation: { ...p.compensation, currency: e.target.value } }))}
                            className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                            placeholder="INR / USD"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Notice Period / Availability</label>
                          <input
                            type="text"
                            value={formProfile.compensation.noticePeriodDays}
                            onChange={e => setFormProfile(p => ({ ...p, compensation: { ...p.compensation, noticePeriodDays: e.target.value } }))}
                            className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                            placeholder="0 (Immediate) / 15 days"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Earliest Start Date</label>
                          <input
                            type="text"
                            value={formProfile.compensation.earliestStartDate}
                            onChange={e => setFormProfile(p => ({ ...p, compensation: { ...p.compensation, earliestStartDate: e.target.value } }))}
                            className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                            placeholder="Immediately upon offer"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-800">
                      <h4 className="text-xs font-mono text-accent uppercase tracking-wider mb-3">Work Authorization & Relocation</h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 p-3 bg-neutral-900/50 border border-neutral-800/80 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formProfile.workAuthorization.authorizedInCountryOfRole}
                            onChange={e => setFormProfile(p => ({ ...p, workAuthorization: { ...p.workAuthorization, authorizedInCountryOfRole: e.target.checked } }))}
                            className="w-4 h-4 accent-accent"
                          />
                          <span className="text-xs text-neutral-200 font-sans">
                            Legally authorized to work in the target job's location without restriction
                          </span>
                        </label>

                        <label className="flex items-center gap-3 p-3 bg-neutral-900/50 border border-neutral-800/80 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formProfile.workAuthorization.requiresSponsorshipNow}
                            onChange={e => setFormProfile(p => ({ ...p, workAuthorization: { ...p.workAuthorization, requiresSponsorshipNow: e.target.checked } }))}
                            className="w-4 h-4 accent-accent"
                          />
                          <span className="text-xs text-neutral-200 font-sans">
                            Will require immigration sponsorship (e.g. H-1B, Tier 2) now or in the future
                          </span>
                        </label>

                        <label className="flex items-center gap-3 p-3 bg-neutral-900/50 border border-neutral-800/80 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formProfile.workAuthorization.willingToRelocate}
                            onChange={e => setFormProfile(p => ({ ...p, workAuthorization: { ...p.workAuthorization, willingToRelocate: e.target.checked } }))}
                            className="w-4 h-4 accent-accent"
                          />
                          <span className="text-xs text-neutral-200 font-sans">
                            Willing to relocate for the role
                          </span>
                        </label>
                      </div>

                      <div className="mt-4">
                        <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Work Mode Preference</label>
                        <input
                          type="text"
                          value={formProfile.workAuthorization.workModePreference}
                          onChange={e => setFormProfile(p => ({ ...p, workAuthorization: { ...p.workAuthorization, workModePreference: e.target.value } }))}
                          className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                          placeholder="Flexible (Remote / Hybrid / Onsite)"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: Statements & Stories */}
                {activeTab === 'statements' && (
                  <div className="space-y-5">
                    <p className="text-xs text-neutral-400 font-mono">
                      These baseline narratives are used by the extension to synthesize honest, grounded answers for long-form questions.
                    </p>

                    <div>
                      <label className="block text-[10px] text-accent font-mono uppercase mb-1">
                        Professional Summary / "Tell us about yourself"
                      </label>
                      <textarea
                        rows={3}
                        value={formProfile.statements.professionalSummary}
                        onChange={e => setFormProfile(p => ({ ...p, statements: { ...p.statements, professionalSummary: e.target.value } }))}
                        className="w-full bg-neutral-900 border border-neutral-800 p-3 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none leading-relaxed resize-y font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-accent font-mono uppercase mb-1">
                        Why Our Company / Value Proposition Baseline
                      </label>
                      <textarea
                        rows={3}
                        value={formProfile.statements.whyOurCompanyTemplate}
                        onChange={e => setFormProfile(p => ({ ...p, statements: { ...p.statements, whyOurCompanyTemplate: e.target.value } }))}
                        className="w-full bg-neutral-900 border border-neutral-800 p-3 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none leading-relaxed resize-y font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-accent font-mono uppercase mb-1">
                        Proudest Project Story (e.g. Axon or SafarSathi)
                      </label>
                      <textarea
                        rows={3}
                        value={formProfile.statements.proudestProjectDescription}
                        onChange={e => setFormProfile(p => ({ ...p, statements: { ...p.statements, proudestProjectDescription: e.target.value } }))}
                        className="w-full bg-neutral-900 border border-neutral-800 p-3 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none leading-relaxed resize-y font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-accent font-mono uppercase mb-1">
                        Greatest Technical Achievement / Challenging Bug
                      </label>
                      <textarea
                        rows={3}
                        value={formProfile.statements.greatestTechnicalAchievement}
                        onChange={e => setFormProfile(p => ({ ...p, statements: { ...p.statements, greatestTechnicalAchievement: e.target.value } }))}
                        className="w-full bg-neutral-900 border border-neutral-800 p-3 text-sm text-neutral-100 rounded-none focus:border-accent focus:outline-none leading-relaxed resize-y font-sans"
                      />
                    </div>
                  </div>
                )}

                {/* TAB 5: Custom Fields */}
                {activeTab === 'custom' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-neutral-400 font-mono">
                        Add any custom fields (e.g. T-shirt size, Veteran status, Security clearance). Fields saved while filling forms in the extension will also appear here!
                      </p>
                      <button
                        type="button"
                        onClick={handleAddCustomField}
                        className="px-3 py-1.5 text-xs font-mono bg-accent text-neutral-950 font-medium rounded-none hover:bg-accent/90 cursor-pointer whitespace-nowrap"
                      >
                        + Add Custom Field
                      </button>
                    </div>

                    {formProfile.customFields.length === 0 ? (
                      <div className="p-8 text-center text-neutral-500 font-mono text-xs border border-dashed border-neutral-800">
                        No custom fields saved yet. Click "+ Add Custom Field" or save them on the fly from the extension.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {formProfile.customFields.map((cf, idx) => (
                          <div key={idx} className="p-3 bg-neutral-900/50 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <div className="w-full sm:w-1/3">
                              <label className="block text-[9px] text-neutral-500 font-mono uppercase">Field Label</label>
                              <input
                                type="text"
                                value={cf.label}
                                onChange={e => handleUpdateCustomField(idx, 'label', e.target.value)}
                                className="w-full bg-neutral-900 border border-neutral-800 px-2.5 py-1.5 text-xs text-neutral-100 rounded-none focus:border-accent focus:outline-none font-mono"
                                placeholder="e.g. Veteran Status"
                              />
                            </div>
                            <div className="w-full sm:w-1/2">
                              <label className="block text-[9px] text-neutral-500 font-mono uppercase">Saved Value</label>
                              <input
                                type="text"
                                value={cf.value}
                                onChange={e => handleUpdateCustomField(idx, 'value', e.target.value)}
                                className="w-full bg-neutral-900 border border-neutral-800 px-2.5 py-1.5 text-xs text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                                placeholder="e.g. No / N/A"
                              />
                            </div>
                            <div className="sm:self-end pt-2 sm:pt-0">
                              <button
                                type="button"
                                onClick={() => handleDeleteCustomField(idx)}
                                className="text-neutral-500 hover:text-rose-400 text-xs font-mono p-1 cursor-pointer"
                                title="Delete field"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 6: Extension Pairing */}
                {activeTab === 'extension' && (
                  <div className="space-y-6">
                    <div className="p-5 bg-neutral-900/40 border border-neutral-800 space-y-4">
                      <h4 className="text-xs font-mono text-accent uppercase tracking-wider">Browser Extension Connection Credentials</h4>
                      <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                        Copy these credentials into your browser extension settings to link your portfolio as the primary source of truth.
                      </p>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Portfolio API Base URL</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              readOnly
                              value={API_URL || window.location.origin}
                              className="flex-1 bg-black border border-neutral-800 px-3 py-2 text-xs font-mono text-neutral-300 rounded-none select-all"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(API_URL || window.location.origin);
                                alert('API URL copied to clipboard');
                              }}
                              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-white cursor-pointer"
                            >
                              Copy URL
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Dedicated Extension API Key</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              readOnly
                              value={formProfile.extensionApiKey || 'No key generated yet'}
                              className="flex-1 bg-black border border-neutral-800 px-3 py-2 text-xs font-mono text-accent font-semibold rounded-none select-all tracking-wider"
                            />
                            <button
                              type="button"
                              onClick={handleCopyKey}
                              className="px-4 py-2 bg-accent text-neutral-950 hover:bg-accent/90 text-xs font-mono font-medium cursor-pointer"
                            >
                              {copiedKey ? '✓ Copied' : 'Copy Key'}
                            </button>
                            <button
                              type="button"
                              onClick={handleRegenerateKey}
                              disabled={generatingKey}
                              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-300 cursor-pointer"
                              title="Regenerate API Key"
                            >
                              {generatingKey ? '...' : '↺ New Key'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-neutral-800 text-xs font-mono space-y-3">
                      <h4 className="text-accent uppercase tracking-wider">How to install & use in Firefox & Chrome:</h4>
                      <ol className="list-decimal list-inside space-y-2 text-neutral-300 leading-relaxed font-sans">
                        <li>
                          <strong>Firefox (Ubuntu / Windows)</strong>: Open <code>about:debugging#/runtime/this-firefox</code>, click <em>"Load Temporary Add-on"</em>, and select <code>extension/.output/firefox-mv2/manifest.json</code> (or build output).
                        </li>
                        <li>
                          <strong>Chrome / Chromium</strong>: Open <code>chrome://extensions</code>, enable <em>Developer mode</em>, click <em>"Load unpacked"</em>, and select <code>extension/.output/chrome-mv3</code>.
                        </li>
                        <li>
                          Click the extension icon in your browser toolbar, paste your Portfolio URL and API Key from above, and click <strong>"Connect"</strong>.
                        </li>
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-800 bg-neutral-900/60">
            <div className="text-[11px] font-mono text-neutral-400">
              🔒 Private profile synced with MongoDB Atlas
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-neutral-700 text-xs font-mono uppercase tracking-wider text-neutral-300 hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Close
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

export default FormProfileModal;
