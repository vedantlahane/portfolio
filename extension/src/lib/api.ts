import { getConfig, saveConfig, saveCachedProfile } from './storage';
import { FormProfilePayload } from './types';

export const normalizeApiUrl = (url: string): string => {
  let clean = url.trim();
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = `https://${clean}`;
  }
  return clean.replace(/\/+$/, '');
};

export const fetchPortfolioData = async (
  customUrl?: string, 
  customKey?: string
): Promise<{ success: boolean; data?: FormProfilePayload; message?: string }> => {
  const config = await getConfig();
  const baseUrl = normalizeApiUrl(customUrl || config.apiUrl);
  const apiKey = (customKey !== undefined ? customKey : config.apiKey).trim();

  if (!apiKey) {
    return { success: false, message: 'Extension API Key is missing. Please configure in settings.' };
  }

  try {
    const res = await fetch(`${baseUrl}/api/form-profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Extension-Key': apiKey
      }
    });

    if (res.status === 401) {
      await saveConfig({ status: 'error' });
      return { success: false, message: 'Invalid API Key. Please verify in portfolio admin.' };
    }

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}: ${res.statusText}`);
    }

    const json = await res.json();

    if (!json.success || !json.data) {
      throw new Error(json.message || 'Invalid response from portfolio server');
    }

    const payload: FormProfilePayload = {
      dictionary: json.data.dictionary || {},
      publicProfile: json.data.publicProfile,
      formProfile: json.data.formProfile,
      projects: json.data.projects,
      skills: json.data.skills,
      knowledgeVault: json.data.formProfile?.knowledgeVault || [],
      aiSettings: json.data.formProfile?.aiSettings,
      extensionApiKey: json.data.extensionApiKey
    };

    // Cache locally
    await saveCachedProfile(payload);
    await saveConfig({
      apiUrl: baseUrl,
      apiKey: apiKey,
      status: 'connected',
      lastSyncedAt: Date.now()
    });

    return { success: true, data: payload };

  } catch (error: any) {
    console.error('Fetch portfolio data failed:', error);
    await saveConfig({ status: 'error' });
    return { success: false, message: error.message || 'Failed to connect to portfolio server.' };
  }
};

export const quickAddProfileField = async (
  key: string, 
  label: string, 
  value: string, 
  category = 'Discovered Fields'
): Promise<boolean> => {
  const config = await getConfig();
  const baseUrl = normalizeApiUrl(config.apiUrl);
  const apiKey = config.apiKey;

  if (!apiKey) return false;

  try {
    const res = await fetch(`${baseUrl}/api/form-profile/quick-add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Extension-Key': apiKey
      },
      body: JSON.stringify({ key, label, value, category })
    });

    if (res.ok) {
      // Refresh cache
      await fetchPortfolioData();
      return true;
    }
    return false;
  } catch (e) {
    console.error('Quick add field failed:', e);
    return false;
  }
};

export const quickAddKnowledge = async (
  title: string,
  content: string,
  category = 'Experience & Stories',
  tags: string[] = []
): Promise<boolean> => {
  const config = await getConfig();
  const baseUrl = normalizeApiUrl(config.apiUrl);
  const apiKey = config.apiKey;

  if (!apiKey) return false;

  try {
    const res = await fetch(`${baseUrl}/api/form-profile/knowledge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Extension-Key': apiKey
      },
      body: JSON.stringify({ title, content, category, tags })
    });

    if (res.ok) {
      await fetchPortfolioData();
      return true;
    }
    return false;
  } catch (e) {
    console.error('Quick add knowledge failed:', e);
    return false;
  }
};

export const requestAiAnswer = async (
  question: string, 
  context = '',
  provider?: string,
  model?: string
): Promise<{ success: boolean; answer: string; usedKnowledge?: string[]; provider?: string }> => {
  const config = await getConfig();
  const baseUrl = normalizeApiUrl(config.apiUrl);
  const apiKey = config.apiKey;

  try {
    const res = await fetch(`${baseUrl}/api/form-profile/ai-generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Extension-Key': apiKey
      },
      body: JSON.stringify({ question, context, provider, model })
    });

    const data = await res.json();
    if (res.ok && data.answer) {
      return { 
        success: true, 
        answer: data.answer,
        usedKnowledge: data.usedKnowledge,
        provider: data.provider
      };
    }
    throw new Error(data.message || 'AI generation failed');
  } catch (error: any) {
    console.error('AI answer request error:', error);
    return { success: false, answer: '' };
  }
};
