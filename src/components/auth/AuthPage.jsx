import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export default function AuthPage({ mode = 'login' }) {
  const isRegister = mode === 'register';
  const { login, register } = useAuth();
  const { setCurrentView, showToast } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('home');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isRegister) await register({ name, email, password, role });
      else await login({ email, password });
      setCurrentView('dashboard');
      showToast(isRegister ? 'Your ReRoot account is ready.' : 'Welcome back to ReRoot.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container-wide" style={{ paddingBlock: 'var(--space-12)', maxWidth: 560 }}>
      <div className="card" style={{ background: 'var(--bg-elevated)', padding: 'var(--space-8)' }}>
        <p className="stat-label" style={{ color: 'var(--color-forest)' }}>ReRoot community account</p>
        <h1 className="text-heading-2" style={{ color: 'var(--text-primary)' }}>
          {isRegister ? 'Join the food rescue network' : 'Welcome back'}
        </h1>
        <p className="text-body" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
          {isRegister ? 'Create an account to manage food, share surplus, and track your impact.' : 'Sign in to continue your food-saving work.'}
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--space-4)' }}>
          {isRegister && (
            <div className="input-group">
              <label className="input-label" htmlFor="auth-name">Name</label>
              <input id="auth-name" className="input" autoComplete="name" required minLength={2} maxLength={120} value={name} onChange={(event) => setName(event.target.value)} />
            </div>
          )}
          <div className="input-group">
            <label className="input-label" htmlFor="auth-email">Email</label>
            <input id="auth-email" className="input" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="auth-password">Password</label>
            <input id="auth-password" className="input" type="password" autoComplete={isRegister ? 'new-password' : 'current-password'} minLength={isRegister ? 8 : undefined} required value={password} onChange={(event) => setPassword(event.target.value)} />
            {isRegister && <small>Use at least 8 characters.</small>}
          </div>
          {isRegister && (
            <div className="input-group">
              <label className="input-label" htmlFor="auth-role">Account type</label>
              <select id="auth-role" className="input select" value={role} onChange={(event) => setRole(event.target.value)}>
                <option value="home">Home cook</option>
                <option value="business">Business</option>
                <option value="ngo">NGO food bank</option>
              </select>
            </div>
          )}
          {error && <p role="alert" style={{ color: 'var(--color-danger)' }}>{error}</p>}
          <button className="btn btn-primary btn-lg" type="submit" disabled={submitting}>
            {submitting ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
          </button>
        </form>
        <p style={{ marginTop: 'var(--space-5)', color: 'var(--text-secondary)' }}>
          {isRegister ? 'Already registered?' : 'New to ReRoot?'}{' '}
          <button className="btn btn-ghost btn-sm" type="button" onClick={() => setCurrentView(isRegister ? 'login' : 'register')}>
            {isRegister ? 'Sign in' : 'Create an account'}
          </button>
        </p>
        <button className="btn btn-ghost btn-sm" type="button" onClick={() => setCurrentView('landing')}>
          Back to overview
        </button>
      </div>
    </section>
  );
}
