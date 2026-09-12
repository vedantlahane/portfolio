import React, { useState, useEffect } from 'react';
import { getConfig, saveConfig, getCachedProfile } from '../../src/lib/storage';
import { fetchPortfolioData, quickAddProfileField, requestAiAnswer } from '../../src/lib/api';
import { DetectedField, ScanResult, ConnectionConfig, FormProfilePayload } from '../../src/lib/types';

export default function App() {
  const [config, setConfig] = useState<ConnectionConfig>({
    apiUrl: 'http://localhost:5000',
    apiKey: '',
    status: 'disconnected'
  });
  const [profileData, setProfileData] = useState<FormProfilePayload | null>(null);
  const [activeTab, setActiveTab] = useState<'review' | 'ai' | 'missing' | 'settings'>('review');
  const [scanning, setScanning] = useState(false);
  const [filling, setFilling] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [statusNotification, setStatusNotification] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Settings form state
  const [inputUrl, setInputUrl] = useState('');
  const [inputKey, setInputKey] = useState('');

  // AI draft preview state
  const [activeAiField, setActiveAiField] = useState<DetectedField | null>(null);
  const [aiDraftText, setAiDraftText] = useState('');
  const [generatingAi, setGeneratingAi] = useState(false);

  // Load initial config & cached profile
  useEffect(() => {
    const init = async () => {
      const cfg = await getConfig();
      setConfig(cfg);
      setInputUrl(cfg.apiUrl);
      setInputKey(cfg.apiKey);

      const cached = await getCachedProfile();
      if (cached) {
        setProfileData(cached);
      }

      // Automatically scan active tab if profile is ready
      if (cached?.dictionary && cfg.apiKey) {
        triggerScan(cached.dictionary);
      } else {
        // Try initial background sync
        syncWithBackend(cfg.apiUrl, cfg.apiKey);
      }
    };
    init();
  }, []);

  const showNotification = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setStatusNotification({ text, type });
    setTimeout(() => setStatusNotification(null), 3500);
  };

  // Sync profile with portfolio backend
  const syncWithBackend = async (url = inputUrl, key = inputKey) => {
    setSyncing(true);
    try {
      const res = await fetchPortfolioData(url, key);
      if (res.success && res.data) {
        setProfileData(res.data);
        const updatedCfg = await getConfig();
        setConfig(updatedCfg);
        showNotification('Profile synced with portfolio!', 'success');
        triggerScan(res.data.dictionary);
      } else {
        showNotification(res.message || 'Connection failed. Check URL & Key.', 'error');
      }
    } catch (err: any) {
      showNotification(err.message || 'Sync error', 'error');
    } finally {
      setSyncing(false);
    }
  };

  // Trigger content script DOM scan on active tab
  const triggerScan = async (dict?: Record<string, string>) => {
    const dictionary = dict || profileData?.dictionary || {};
    setScanning(true);

    try {
      // Query active tab cross-browser
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      const activeTab = tabs[0];

      if (!activeTab?.id) {
        throw new Error('No active browser tab detected');
      }

      // Send SCAN_PAGE message to content script
      const response = await browser.tabs.sendMessage(activeTab.id, {
        type: 'SCAN_PAGE',
        dictionary
      });

      if (response && response.success && response.result) {
        setScanResult(response.result);
      } else {
        throw new Error(response?.error || 'Content script did not respond. Refresh the page.');
      }
    } catch (err: any) {
      console.warn('Page scan warning:', err.message);
      // Fallback: If content script hasn't injected yet, try injecting
      try {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]?.id) {
          await browser.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['content.js']
          });
          // Retry once
          const retry = await browser.tabs.sendMessage(tabs[0].id, {
            type: 'SCAN_PAGE',
            dictionary
          });
          if (retry?.success) {
            setScanResult(retry.result);
          }
        }
      } catch (injectionErr) {
        showNotification('Could not scan page. Refresh target page and retry.', 'error');
      }
    } finally {
      setScanning(false);
    }
  };

  // Fill all approved fields on page
  const handleFillAll = async () => {
    if (!scanResult?.fields) return;
    setFilling(true);

    try {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      if (!tabs[0]?.id) throw new Error('No active tab');

      const response = await browser.tabs.sendMessage(tabs[0].id, {
        type: 'FILL_ALL_FIELDS',
        fields: scanResult.fields
      });

      if (response?.success) {
        showNotification(`✓ Successfully filled ${response.filledCount} form fields!`, 'success');
      } else {
        showNotification(response?.error || 'Failed to fill fields', 'error');
      }
    } catch (err: any) {
      showNotification(err.message || 'Fill error', 'error');
    } finally {
      setFilling(false);
    }
  };

  // Fill a single field
  const handleFillSingle = async (field: DetectedField) => {
    try {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      if (!tabs[0]?.id) return;

      const response = await browser.tabs.sendMessage(tabs[0].id, {
        type: 'FILL_SINGLE_FIELD',
        selector: field.selector,
        value: field.matchedValue
      });

      if (response?.success) {
        showNotification(`Filled: ${field.label}`, 'success');
      }
    } catch (e) {
      showNotification('Could not fill field', 'error');
    }
  };

  // Update a single field approval/value in local scan state
  const handleFieldChange = (id: string, updates: Partial<DetectedField>) => {
    if (!scanResult) return;
    setScanResult(prev => {
      if (!prev) return null;
      return {
        ...prev,
        fields: prev.fields.map(f => f.id === id ? { ...f, ...updates } : f)
      };
    });
  };

  // Save missing field directly to private portfolio profile
  const handleSaveMissingToProfile = async (field: DetectedField) => {
    if (!field.matchedValue.trim()) {
      showNotification('Enter a value first', 'error');
      return;
    }

    const key = (field.matchedKey || field.label).toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const success = await quickAddProfileField(key, field.label, field.matchedValue);

    if (success) {
      showNotification(`Saved "${field.label}" to your private portfolio!`, 'success');
      handleFieldChange(field.id, { isMissing: false, category: 'factual', confidence: 0.95 });
    } else {
      showNotification('Failed to save to portfolio', 'error');
    }
  };

  // Open AI Question Drafter Modal
  const handleOpenAiDraft = async (field: DetectedField) => {
    setActiveAiField(field);
    setAiDraftText(field.aiDraft || field.matchedValue || '');

    // If draft is empty, generate now
    if (!field.aiDraft && !field.matchedValue) {
      setGeneratingAi(true);
      const res = await requestAiAnswer(field.aiPrompt || field.label);
      if (res.success) {
        setAiDraftText(res.answer);
      }
      setGeneratingAi(false);
    }
  };

  const handleApplyAiDraft = () => {
    if (!activeAiField) return;
    handleFieldChange(activeAiField.id, {
      matchedValue: aiDraftText,
      aiDraft: aiDraftText,
      approved: true
    });
    handleFillSingle({ ...activeAiField, matchedValue: aiDraftText });
    setActiveAiField(null);
  };

  // Counts
  const approvedCount = scanResult?.fields.filter(f => f.approved && f.matchedValue).length || 0;
  const subjectiveCount = scanResult?.fields.filter(f => f.isSubjective).length || 0;
  const missingCount = scanResult?.fields.filter(f => f.isMissing).length || 0;

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-neutral-100 font-sans text-xs">
      {/* Top Header */}
      <header className="px-4 py-3 border-b border-neutral-800 bg-neutral-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-accent/20 border border-accent/40 rounded flex items-center justify-center text-accent text-[10px] font-bold">
            PF
          </div>
          <div>
            <h1 className="font-mono font-medium text-xs text-neutral-100 flex items-center gap-1.5 leading-none">
              PORTFOLIO FORM FILLER
            </h1>
            <div className="flex items-center gap-1.5 mt-1 text-[10px] text-neutral-400">
              <span className={`w-1.5 h-1.5 rounded-full ${
                config.status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`} />
              <span className="truncate max-w-[190px]">
                {config.status === 'connected' ? config.apiUrl.replace(/^https?:\/\//, '') : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => syncWithBackend()}
            disabled={syncing}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors cursor-pointer"
            title="Sync latest profile from portfolio"
          >
            <span className={syncing ? 'animate-spin inline-block' : ''}>⟳</span>
          </button>
          <button
            onClick={() => triggerScan()}
            disabled={scanning}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors cursor-pointer"
            title="Rescan current tab"
          >
            <span>⚡</span>
          </button>
          <button
            onClick={() => setActiveTab(activeTab === 'settings' ? 'review' : 'settings')}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              activeTab === 'settings' ? 'bg-neutral-800 text-accent' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
            title="Extension Settings & API Key"
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* Status Notification Banner */}
      {statusNotification && (
        <div className={`px-4 py-1.5 text-[11px] font-mono border-b transition-all flex items-center justify-between ${
          statusNotification.type === 'success'
            ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
            : statusNotification.type === 'error'
            ? 'bg-rose-950/60 border-rose-800/80 text-rose-300'
            : 'bg-neutral-900 border-neutral-800 text-neutral-300'
        }`}>
          <span>{statusNotification.text}</span>
          <button onClick={() => setStatusNotification(null)} className="opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Main Tab Navigation */}
      {activeTab !== 'settings' && (
        <div className="flex border-b border-neutral-800/80 bg-neutral-900/30 text-[11px] font-mono">
          <button
            onClick={() => setActiveTab('review')}
            className={`flex-1 py-2 text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'review'
                ? 'border-accent text-accent font-semibold bg-neutral-800/40'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Fields ({scanResult?.fields.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-2 text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'ai'
                ? 'border-accent text-accent font-semibold bg-neutral-800/40'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>✨ AI Drafts</span>
            {subjectiveCount > 0 && (
              <span className="px-1.5 py-0.2 bg-purple-900/60 text-purple-300 rounded text-[9px]">
                {subjectiveCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('missing')}
            className={`flex-1 py-2 text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'missing'
                ? 'border-accent text-accent font-semibold bg-neutral-800/40'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>Missing</span>
            {missingCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-900/60 text-amber-300 rounded text-[9px]">
                {missingCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
        {/* VIEW: Settings Tab */}
        {activeTab === 'settings' ? (
          <div className="space-y-4 p-1">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <h2 className="font-mono text-xs uppercase text-accent tracking-wider font-semibold">Portfolio Connection</h2>
              <button
                onClick={() => setActiveTab('review')}
                className="text-xs text-neutral-400 hover:text-white"
              >
                ← Back
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Portfolio API Base URL</label>
                <input
                  type="text"
                  value={inputUrl}
                  onChange={e => setInputUrl(e.target.value)}
                  placeholder="https://vedantlahane.vercel.app"
                  className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-xs text-neutral-100 rounded-none focus:border-accent focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] text-neutral-400 font-mono uppercase mb-1">Extension API Key</label>
                <input
                  type="password"
                  value={inputKey}
                  onChange={e => setInputKey(e.target.value)}
                  placeholder="pf_ext_..."
                  className="w-full bg-neutral-900 border border-neutral-800 px-3 py-2 text-xs text-accent font-mono rounded-none focus:border-accent focus:outline-none tracking-wider"
                />
                <p className="text-[10px] text-neutral-500 font-sans mt-1">
                  Find or generate your key in your Portfolio Admin: <em>Owner Login → FORM PROFILE → Extension Pairing</em>.
                </p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    await saveConfig({ apiUrl: inputUrl, apiKey: inputKey });
                    await syncWithBackend(inputUrl, inputKey);
                  }}
                  disabled={syncing}
                  className="flex-1 py-2 bg-accent text-neutral-950 font-mono text-xs font-semibold rounded-none hover:bg-accent/90 transition-colors cursor-pointer"
                >
                  {syncing ? 'CONNECTING...' : 'SAVE & CONNECT'}
                </button>
              </div>
            </div>

            <div className="p-3 bg-neutral-900/40 border border-neutral-800 text-[11px] text-neutral-400 space-y-1.5">
              <div className="font-mono text-neutral-300 font-medium">💡 Quick Tips:</div>
              <ul className="list-disc list-inside space-y-1 text-[10px]">
                <li>Works on Greenhouse, Lever, Workday, Ashby, and arbitrary recruitment forms.</li>
                <li>Private fields (salary, notice period, passport) never display on your public site.</li>
                <li>Press <strong>⚡ Rescan</strong> if you navigate within a Single Page Application form.</li>
              </ul>
            </div>
          </div>
        ) : scanning ? (
          <div className="flex flex-col items-center justify-center h-52 text-neutral-400 font-mono text-xs gap-2">
            <span className="animate-spin text-xl">⚡</span>
            <span>ANALYZING PAGE FORMS...</span>
          </div>
        ) : !scanResult || scanResult.fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-52 text-center p-4 space-y-3">
            <div className="w-10 h-10 border border-neutral-800 rounded-full flex items-center justify-center text-neutral-500 text-lg">
              ?
            </div>
            <div>
              <p className="font-mono text-xs text-neutral-200">No form fields detected on this page.</p>
              <p className="text-[10px] text-neutral-500 mt-1">
                Open a job application or registration form, then click Rescan below.
              </p>
            </div>
            <button
              onClick={() => triggerScan()}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono text-[10px] rounded-none cursor-pointer"
            >
              ⚡ Rescan Current Page
            </button>
          </div>
        ) : (
          <div>
            {/* Summary Overview Banner */}
            <div className="mb-2.5 p-2.5 bg-neutral-900/40 border border-neutral-800 rounded-none flex items-center justify-between text-[11px] font-mono">
              <span className="text-neutral-300">
                <strong>{scanResult.fields.length}</strong> fields found
              </span>
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 rounded-xs text-[9px]" title="Direct factual auto-fill">
                  {scanResult.factualCount} auto
                </span>
                {scanResult.confirmationCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-amber-950/80 border border-amber-800/60 text-amber-300 rounded-xs text-[9px]" title="Review suggested value">
                    {scanResult.confirmationCount} check
                  </span>
                )}
                {scanResult.subjectiveCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-purple-950/80 border border-purple-800/60 text-purple-300 rounded-xs text-[9px]" title="AI question draft">
                    {scanResult.subjectiveCount} AI
                  </span>
                )}
                {scanResult.missingCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-neutral-800 text-neutral-400 rounded-xs text-[9px]" title="Missing from profile">
                    {scanResult.missingCount} empty
                  </span>
                )}
              </div>
            </div>

            {/* TAB: Review Fields */}
            {activeTab === 'review' && (
              <div className="space-y-2">
                {scanResult.fields.map(field => (
                  <div
                    key={field.id}
                    className={`p-2.5 border transition-colors rounded-none ${
                      field.approved && field.matchedValue
                        ? 'bg-neutral-900/60 border-neutral-800'
                        : 'bg-neutral-950 border-neutral-900 opacity-80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="checkbox"
                          checked={field.approved}
                          onChange={e => handleFieldChange(field.id, { approved: e.target.checked })}
                          className="w-3.5 h-3.5 accent-accent cursor-pointer"
                        />
                        <span className="font-mono font-medium text-[11px] text-neutral-200 truncate max-w-[220px]" title={field.label}>
                          {field.label}
                        </span>
                      </div>

                      {/* Confidence Pill */}
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-xs shrink-0 ${
                        field.isSubjective
                          ? 'bg-purple-950 border border-purple-800 text-purple-300'
                          : field.category === 'factual'
                          ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                          : field.category === 'confirmation'
                          ? 'bg-amber-950 border border-amber-800 text-amber-300'
                          : 'bg-neutral-900 border border-neutral-800 text-neutral-400'
                      }`}>
                        {field.isSubjective ? '✨ AI Draft' : field.category === 'factual' ? 'High match' : field.category === 'confirmation' ? 'Confirm' : 'Missing'}
                      </span>
                    </div>

                    {/* Matched / Editable Value */}
                    <div className="flex items-center gap-1.5 pl-5">
                      <input
                        type="text"
                        value={field.matchedValue}
                        onChange={e => handleFieldChange(field.id, { matchedValue: e.target.value, approved: true })}
                        placeholder={field.isMissing ? 'No data in profile. Type here...' : ''}
                        className="flex-1 bg-black border border-neutral-800 px-2 py-1 text-[11px] text-neutral-100 focus:border-accent focus:outline-none rounded-none font-sans"
                      />

                      {field.isSubjective ? (
                        <button
                          type="button"
                          onClick={() => handleOpenAiDraft(field)}
                          className="px-2 py-1 bg-purple-950 hover:bg-purple-900 border border-purple-800 text-purple-300 text-[10px] font-mono rounded-none cursor-pointer"
                        >
                          Review AI
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleFillSingle(field)}
                          className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-mono rounded-none cursor-pointer"
                          title="Fill this field only"
                        >
                          Fill
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: AI Drafts */}
            {activeTab === 'ai' && (
              <div className="space-y-3">
                {scanResult.fields.filter(f => f.isSubjective).length === 0 ? (
                  <p className="text-center text-neutral-500 font-mono py-8">
                    No subjective essay questions detected on this page.
                  </p>
                ) : (
                  scanResult.fields.filter(f => f.isSubjective).map(field => (
                    <div key={field.id} className="p-3 bg-neutral-900/50 border border-neutral-800 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono font-medium text-purple-300 text-xs">{field.label}</span>
                        <span className="px-1.5 py-0.5 bg-purple-950 border border-purple-800 text-purple-300 text-[9px] rounded-xs font-mono">
                          Subjective
                        </span>
                      </div>
                      <p className="text-neutral-300 text-[11px] line-clamp-3 bg-black/60 p-2 border border-neutral-900 leading-relaxed font-sans">
                        {field.matchedValue || field.aiDraft || '(No draft yet. Click Review & Generate)'}
                      </p>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleOpenAiDraft(field)}
                          className="px-3 py-1 bg-purple-900/60 hover:bg-purple-800 border border-purple-700 text-purple-200 text-xs font-mono rounded-none cursor-pointer"
                        >
                          ✨ Edit / Generate Draft
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFillSingle(field)}
                          disabled={!field.matchedValue}
                          className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono rounded-none cursor-pointer disabled:opacity-40"
                        >
                          Insert
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: Missing Data */}
            {activeTab === 'missing' && (
              <div className="space-y-3">
                <p className="text-[11px] text-neutral-400 font-mono">
                  These fields were found on the form but don't exist in your profile. Provide a value and click <strong>"Save to Profile"</strong> to remember it for all future forms!
                </p>

                {scanResult.fields.filter(f => f.isMissing).length === 0 ? (
                  <p className="text-center text-emerald-400 font-mono py-8">
                    ✓ All detected fields are present in your profile!
                  </p>
                ) : (
                  scanResult.fields.filter(f => f.isMissing).map(field => (
                    <div key={field.id} className="p-3 bg-neutral-900/40 border border-neutral-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-medium text-neutral-200 text-[11px]">{field.label}</span>
                        <span className="text-[9px] text-neutral-500 font-mono">{field.inputType}</span>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={field.matchedValue}
                          onChange={e => handleFieldChange(field.id, { matchedValue: e.target.value, approved: true })}
                          placeholder="Type value here..."
                          className="flex-1 bg-black border border-neutral-800 px-2.5 py-1.5 text-xs text-neutral-100 rounded-none focus:border-accent focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveMissingToProfile(field)}
                          className="px-3 py-1.5 bg-accent text-neutral-950 hover:bg-accent/90 text-[10px] font-mono font-semibold rounded-none cursor-pointer whitespace-nowrap"
                        >
                          💾 Save to Profile
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI Draft Review Modal */}
      {activeAiField && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3">
          <div className="bg-neutral-950 border border-neutral-800 w-full max-w-sm p-4 flex flex-col space-y-3 shadow-2xl">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">AI Question Drafter</span>
                <h3 className="text-xs font-semibold text-neutral-100 mt-0.5">{activeAiField.label}</h3>
              </div>
              <button
                onClick={() => setActiveAiField(null)}
                className="text-neutral-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-[10px] text-neutral-400 font-mono">
              Grounded in your portfolio projects, DSA milestones, and personal background. Review or edit before inserting:
            </p>

            <div className="relative">
              <textarea
                rows={6}
                value={aiDraftText}
                onChange={e => setAiDraftText(e.target.value)}
                placeholder="Drafting answer..."
                className="w-full bg-black border border-neutral-800 p-2.5 text-xs text-neutral-200 rounded-none focus:border-accent focus:outline-none font-sans leading-relaxed resize-none"
              />
              {generatingAi && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-purple-300 text-xs font-mono gap-2">
                  <span className="animate-spin text-sm">⟳</span> Synthesizing from portfolio...
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={async () => {
                  setGeneratingAi(true);
                  const res = await requestAiAnswer(activeAiField.aiPrompt || activeAiField.label);
                  if (res.success) setAiDraftText(res.answer);
                  setGeneratingAi(false);
                }}
                disabled={generatingAi}
                className="px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 text-[10px] font-mono rounded-none cursor-pointer"
              >
                ↺ Regenerate
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveAiField(null)}
                  className="px-3 py-1.5 border border-neutral-800 text-neutral-400 hover:text-white text-[10px] font-mono rounded-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyAiDraft}
                  className="px-3 py-1.5 bg-purple-900 hover:bg-purple-800 text-purple-100 text-[10px] font-mono font-medium rounded-none cursor-pointer"
                >
                  Apply & Insert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Main Action Bar */}
      {activeTab !== 'settings' && (
        <footer className="p-3 border-t border-neutral-800 bg-neutral-900/70 flex items-center justify-between gap-2">
          <div className="text-[10px] font-mono text-neutral-400 truncate">
            {approvedCount} of {scanResult?.fields.length || 0} fields approved
          </div>

          <button
            type="button"
            onClick={handleFillAll}
            disabled={filling || approvedCount === 0}
            className={`px-4 py-2 bg-accent text-neutral-950 font-mono text-xs font-bold uppercase tracking-wider rounded-none hover:bg-accent/90 transition-all cursor-pointer flex items-center gap-1.5 ${
              filling || approvedCount === 0 ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            {filling ? (
              <>
                <span className="animate-spin inline-block">⟳</span> FILLING...
              </>
            ) : (
              `✨ FILL FORM (${approvedCount})`
            )}
          </button>
        </footer>
      )}
    </div>
  );
}
