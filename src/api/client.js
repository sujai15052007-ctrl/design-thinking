const TOKEN_KEY = 'reroot_auth_token_v1';

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest(path, options = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response;
  try {
    response = await fetch(path, { ...options, headers });
  } catch (error) {
    throw new Error(`Unable to reach ReRoot. Check your connection and try again. (${error.message})`);
  }

  const body = response.status === 204 ? null : await response.json().catch(() => null);
  if (response.status === 401 && !path.startsWith('/api/auth/login') && !path.startsWith('/api/auth/register')) {
    setAuthToken(null);
    window.dispatchEvent(new Event('reroot:unauthorized'));
  }
  if (!response.ok) {
    throw new Error(body?.error || `Request failed (${response.status})`);
  }
  return body;
}

export const api = {
  get: (path) => apiRequest(path),
  post: (path, payload) => apiRequest(path, { method: 'POST', body: JSON.stringify(payload) }),
  put: (path, payload) => apiRequest(path, { method: 'PUT', body: JSON.stringify(payload) }),
  patch: (path, payload) => apiRequest(path, { method: 'PATCH', body: JSON.stringify(payload) }),
  delete: (path) => apiRequest(path, { method: 'DELETE' }),
};
