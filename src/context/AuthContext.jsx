import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, getAuthToken, setAuthToken } from '../api/client';

export const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getAuthToken()));

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!getAuthToken()) return undefined;
    let active = true;
    api.get('/api/auth/me')
      .then((result) => {
        if (active) setUser(result.user);
      })
      .catch(() => {
        if (active) logout();
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [logout]);

  useEffect(() => {
    window.addEventListener('reroot:unauthorized', logout);
    return () => window.removeEventListener('reroot:unauthorized', logout);
  }, [logout]);

  const authenticate = useCallback(async (endpoint, credentials) => {
    const result = await api.post(endpoint, credentials);
    setAuthToken(result.token);
    setUser(result.user);
    return result.user;
  }, []);

  const login = useCallback(
    (credentials) => authenticate('/api/auth/login', credentials),
    [authenticate],
  );

  const register = useCallback(
    (credentials) => authenticate('/api/auth/register', credentials),
    [authenticate],
  );

  const updateProfile = useCallback(async (changes) => {
    const result = await api.put('/api/profile', changes);
    if (result.token) setAuthToken(result.token);
    setUser(result.user);
    return result.user;
  }, []);

  const value = useMemo(() => ({
    user, loading, login, register, logout, updateProfile,
  }), [user, loading, login, register, logout, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
