const DEFAULT_DEV_BASE_URL = 'http://localhost:5000/api';

const trimTrailingSlash = (value) => value.replace(/\/$/, '');

const normalisePath = (path) => (path.startsWith('/') ? path.slice(1) : path);

export const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    const devBase = import.meta.env.VITE_DEV_API_BASE_URL || DEFAULT_DEV_BASE_URL;
    return trimTrailingSlash(devBase);
  }

  const prodBase = import.meta.env.VITE_API_BASE_URL;
  if (!prodBase) {
    throw new Error('Environment variable `VITE_API_BASE_URL` is not defined.');
  }

  return trimTrailingSlash(prodBase);
};

export const resolveApiUrl = (path) => {
  const base = getApiBaseUrl();
  const nextPath = normalisePath(path);
  return `${base}/${nextPath}`;
};
