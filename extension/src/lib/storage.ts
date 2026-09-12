import { ConnectionConfig, FormProfilePayload, ScanResult } from './types';

const STORAGE_KEYS = {
  CONFIG: 'portfolio_config',
  CACHED_PROFILE: 'portfolio_cached_profile',
  LAST_SCAN: 'portfolio_last_scan'
};

const DEFAULT_CONFIG: ConnectionConfig = {
  apiUrl: 'http://localhost:5000',
  apiKey: '',
  status: 'disconnected'
};

// Safe cross-browser storage access
const getStorageArea = () => {
  if (typeof browser !== 'undefined' && browser.storage?.local) {
    return browser.storage.local;
  }
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    return chrome.storage.local;
  }
  // Fallback to in-memory if storage is unavailable
  return {
    get: async () => ({}),
    set: async () => {},
    remove: async () => {}
  };
};

export const getConfig = async (): Promise<ConnectionConfig> => {
  const storage = getStorageArea();
  try {
    const result = await storage.get(STORAGE_KEYS.CONFIG);
    return result[STORAGE_KEYS.CONFIG] || DEFAULT_CONFIG;
  } catch (e) {
    console.error('Error reading config from storage:', e);
    return DEFAULT_CONFIG;
  }
};

export const saveConfig = async (config: Partial<ConnectionConfig>): Promise<ConnectionConfig> => {
  const current = await getConfig();
  const updated: ConnectionConfig = { ...current, ...config };
  const storage = getStorageArea();
  await storage.set({ [STORAGE_KEYS.CONFIG]: updated });
  return updated;
};

export const getCachedProfile = async (): Promise<FormProfilePayload | null> => {
  const storage = getStorageArea();
  try {
    const result = await storage.get(STORAGE_KEYS.CACHED_PROFILE);
    return result[STORAGE_KEYS.CACHED_PROFILE] || null;
  } catch (e) {
    console.error('Error reading cached profile:', e);
    return null;
  }
};

export const saveCachedProfile = async (profile: FormProfilePayload): Promise<void> => {
  const storage = getStorageArea();
  await storage.set({ [STORAGE_KEYS.CACHED_PROFILE]: profile });
};

export const getLastScan = async (): Promise<ScanResult | null> => {
  const storage = getStorageArea();
  try {
    const result = await storage.get(STORAGE_KEYS.LAST_SCAN);
    return result[STORAGE_KEYS.LAST_SCAN] || null;
  } catch (e) {
    return null;
  }
};

export const saveLastScan = async (scan: ScanResult): Promise<void> => {
  const storage = getStorageArea();
  await storage.set({ [STORAGE_KEYS.LAST_SCAN]: scan });
};
