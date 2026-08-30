import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, LogIn, Sparkles, User, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginAsDemoUser, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };

  const handleDemoClick = async (role: UserRole) => {
    setError('');
    try {
      await loginAsDemoUser(role);
      if (role === 'customer') navigate('/customer');
      else navigate('/agent');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login with demo account');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '460px', padding: '36px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)',
            marginBottom: '16px'
          }}>
            <Bot size={32} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Sign in to access your AI Support Portal dashboard
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: '1rem', marginBottom: '24px' }}
          >
            {loading ? 'Authenticating...' : <><LogIn size={18} /> Sign In</>}
          </button>
        </form>

        {/* Demo Fast Login Section */}
        <div style={{ position: 'relative', textAlign: 'center', margin: '24px 0 20px' }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--border-color)', zIndex: 1 }} />
          <span style={{ position: 'relative', zIndex: 2, background: 'var(--bg-card)', padding: '0 12px', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick Demo Login
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          <button
            onClick={() => handleDemoClick('customer')}
            disabled={loading}
            className="btn btn-secondary"
            style={{ flexDirection: 'column', padding: '12px 8px', fontSize: '0.75rem', gap: '4px' }}
          >
            <User size={18} color="#22d3ee" />
            <span>Customer</span>
          </button>

          <button
            onClick={() => handleDemoClick('agent')}
            disabled={loading}
            className="btn btn-secondary"
            style={{ flexDirection: 'column', padding: '12px 8px', fontSize: '0.75rem', gap: '4px' }}
          >
            <UserCheck size={18} color="#c084fc" />
            <span>Agent</span>
          </button>

          <button
            onClick={() => handleDemoClick('admin')}
            disabled={loading}
            className="btn btn-secondary"
            style={{ flexDirection: 'column', padding: '12px 8px', fontSize: '0.75rem', gap: '4px' }}
          >
            <ShieldCheck size={18} color="#34d399" />
            <span>Admin</span>
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
            Register Now
          </Link>
        </div>

      </div>
    </div>
  );
};
