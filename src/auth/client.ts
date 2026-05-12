import { loadConfig, getBaseUrl, type Config } from '../config.js';
import { getApiKeyHeaders } from './api-key.js';
import { BambooError } from '../utils/errors.js';

let refreshInFlight: Promise<string> | null = null;

function sharedRefresh(config: Config): Promise<string> {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    try {
      const { refreshAccessToken } = await import('./oauth.js');
      return await refreshAccessToken(config);
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

export interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  query?: Record<string, string>;
  rawResponse?: boolean;
}

function getAuthHeaders(config: Config): Record<string, string> {
  const auth = config.auth;
  if (!auth) throw new Error('Not logged in. Run: bamboo login');

  if (auth.method === 'oauth') {
    if (!auth.accessToken) throw new Error('OAuth token not found. Run: bamboo login --oauth');
    return {
      Authorization: `Bearer ${auth.accessToken}`,
      Accept: 'application/json',
    };
  }

  if (!auth.apiKey) throw new Error('API key not found. Run: bamboo login');
  return getApiKeyHeaders(auth.apiKey);
}

export async function request(path: string, opts: RequestOptions = {}): Promise<unknown> {
  const config = loadConfig();
  const baseUrl = getBaseUrl(config);
  const headers = getAuthHeaders(config);

  let url = `${baseUrl}${path}`;
  if (opts.query) {
    const params = new URLSearchParams(opts.query);
    url += `?${params.toString()}`;
  }

  const fetchOpts: RequestInit = {
    method: opts.method || 'GET',
    headers: {
      ...headers,
      ...opts.headers,
    },
  };

  if (opts.body !== undefined) {
    if (typeof opts.body === 'string') {
      fetchOpts.body = opts.body;
    } else {
      fetchOpts.body = JSON.stringify(opts.body);
      (fetchOpts.headers as Record<string, string>)['Content-Type'] = 'application/json';
    }
  }

  let res = await fetch(url, fetchOpts);

  if (res.status === 401 && config.auth?.method === 'oauth') {
    const newToken = await sharedRefresh(config);
    (fetchOpts.headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
    res = await fetch(url, fetchOpts);
  }

  if (!res.ok) {
    const body = await res.text();
    throw new BambooError(`API request failed: ${res.status} ${res.statusText}`, res.status, body);
  }

  if (opts.rawResponse) {
    return res;
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  const text = await res.text();
  // Try parsing as JSON anyway
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const api = {
  get: (path: string, query?: Record<string, string>) => request(path, { query }),
  post: (path: string, body?: unknown) => request(path, { method: 'POST', body }),
  put: (path: string, body?: unknown) => request(path, { method: 'PUT', body }),
  patch: (path: string, body?: unknown) => request(path, { method: 'PATCH', body }),
  del: (path: string) => request(path, { method: 'DELETE' }),
};
