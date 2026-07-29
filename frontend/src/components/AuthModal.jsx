import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Shield, User, Lock, Mail, Sparkles, Key } from 'lucide-react';

export default function AuthModal() {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authMode, 
    setAuthMode, 
    login, 
    signUp 
  } = useApp();

  const [role, setRole] = useState('user'); // 'user' | 'manager' | 'admin'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    if (authMode === 'login') {
      login(email, password, role);
    } else {
      signUp(name || 'New User', email, role);
    }
  };

  const fillDemo = (targetRole) => {
    setRole(targetRole);
    if (targetRole === 'admin') {
      setEmail('admin@parksmart.com');
      setPassword('admin123');
      setName('System Admin');
    } else if (targetRole === 'manager') {
      setEmail('MGR-1001');
      setPassword('mgr123');
      setName('David Miller');
    } else {
      setEmail('alex@user.com');
      setPassword('user123');
      setName('Alex Johnson');
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthModalOpen(false)}>
      <div 
        className="modal-content glass-panel" 
        onClick={e => e.stopPropagation()}
        style={{ border: '1px solid var(--border-glow)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
              {authMode === 'login' ? 'Welcome Back to ParkSmart' : 'Create Account'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Smart Parking Management & Paytm QR System
            </p>
          </div>
          <button 
            onClick={() => setIsAuthModalOpen(false)}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Role Toggle Switch */}
        <div className="form-group">
          <label className="form-label">Select Account Role</label>
          <div className="tab-group">
            <button
              type="button"
              className={`tab-btn ${role === 'user' ? 'active' : ''}`}
              onClick={() => setRole('user')}
              style={{ fontSize: '0.8rem', padding: '0.5rem' }}
            >
              <User size={14} /> User
            </button>
            <button
              type="button"
              className={`tab-btn ${role === 'manager' ? 'active' : ''}`}
              onClick={() => setRole('manager')}
              style={{ fontSize: '0.8rem', padding: '0.5rem' }}
            >
              <Key size={14} /> Manager ID
            </button>
            <button
              type="button"
              className={`tab-btn ${role === 'admin' ? 'active' : ''}`}
              onClick={() => setRole('admin')}
              style={{ fontSize: '0.8rem', padding: '0.5rem' }}
            >
              <Shield size={14} /> Admin
            </button>
          </div>
        </div>

        {/* Quick Demo Pre-fill Bar */}
        <div style={{ 
          background: 'var(--primary-light)', 
          border: '1px solid var(--border-glow)', 
          padding: '0.65rem 0.85rem', 
          borderRadius: 'var(--radius-sm)', 
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem'
        }}>
          <span style={{ color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={14} /> Quick Demo Fill:
          </span>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button 
              type="button"
              className="btn btn-sm btn-secondary" 
              onClick={() => fillDemo('user')}
              style={{ fontSize: '0.725rem', padding: '0.2rem 0.45rem' }}
            >
              User
            </button>
            <button 
              type="button"
              className="btn btn-sm btn-secondary" 
              onClick={() => fillDemo('manager')}
              style={{ fontSize: '0.725rem', padding: '0.2rem 0.45rem', borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)' }}
            >
              Manager ID
            </button>
            <button 
              type="button"
              className="btn btn-sm btn-primary" 
              onClick={() => fillDemo('admin')}
              style={{ fontSize: '0.725rem', padding: '0.2rem 0.45rem' }}
            >
              Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {authMode === 'signup' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text"
                className="form-input"
                placeholder="e.g. Alex Johnson"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              {role === 'manager' ? 'Unique Manager ID or Email' : 'Email Address'}
            </label>
            <input 
              type="text"
              className="form-input"
              placeholder={role === 'manager' ? 'e.g. MGR-1001 or manager1@parksmart.com' : 'name@example.com'}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontWeight: 700 }}>
            {authMode === 'login' ? `Sign In as ${role.toUpperCase()}` : `Create ${role.toUpperCase()} Account`}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {authMode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <span 
                onClick={() => setAuthMode('signup')}
                style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}
              >
                Sign Up
              </span>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <span 
                onClick={() => setAuthMode('login')}
                style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}
              >
                Sign In
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
