import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { UserRole } from '../types';
import { Bot, LogOut, UserCheck, PlusCircle, LayoutDashboard, Shield, Wifi, WifiOff } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, loginAsDemoUser, loading } = useAuth();
  const { isConnected } = useSocket();
  const navigate = useNavigate();

  const handleDemoSwitch = async (role: UserRole) => {
    await loginAsDemoUser(role);
    if (role === 'customer') navigate('/customer');
    else navigate('/agent');
  };

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
          }}>
            <Bot size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, background: 'linear-gradient(90deg, #ffffff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              OmniPulse <span style={{ color: '#06b6d4' }}>AI</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.05em' }}>
              Triage & Support MVP
            </div>
          </div>
        </Link>

        {/* Realtime Socket Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: isConnected ? '#34d399' : '#f87171', background: 'rgba(255,255,255,0.04)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
          {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span>{isConnected ? 'Real-Time Sync Active' : 'Disconnected'}</span>
        </div>

        {/* Navigation & Demo Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <>
              {user.role === 'customer' ? (
                <>
                  <Link to="/customer" className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                    <LayoutDashboard size={16} /> My Tickets
                  </Link>
                  <Link to="/customer/create" className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                    <PlusCircle size={16} /> New Ticket
                  </Link>
                </>
              ) : (
                <Link to="/agent" className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                  <Shield size={16} /> Agent Command Center
                </Link>
              )}

              {/* Demo Switcher Quick Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0f172a', padding: '4px 10px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Switch Role:</span>
                <button
                  onClick={() => handleDemoSwitch('customer')}
                  disabled={loading}
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    borderRadius: '6px',
                    background: user.role === 'customer' ? 'var(--accent-primary)' : 'transparent',
                    color: user.role === 'customer' ? '#fff' : 'var(--text-secondary)',
                    fontWeight: 600
                  }}
                >
                  Customer
                </button>
                <button
                  onClick={() => handleDemoSwitch('agent')}
                  disabled={loading}
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    borderRadius: '6px',
                    background: user.role === 'agent' ? 'var(--accent-purple)' : 'transparent',
                    color: user.role === 'agent' ? '#fff' : 'var(--text-secondary)',
                    fontWeight: 600
                  }}
                >
                  Agent
                </button>
                <button
                  onClick={() => handleDemoSwitch('admin')}
                  disabled={loading}
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    borderRadius: '6px',
                    background: user.role === 'admin' ? 'var(--accent-cyan)' : 'transparent',
                    color: user.role === 'admin' ? '#fff' : 'var(--text-secondary)',
                    fontWeight: 600
                  }}
                >
                  Admin
                </button>
              </div>

              {/* User Profile Pill & Logout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid var(--border-color)', paddingLeft: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</span>
                  <span className={`badge ${user.role === 'customer' ? 'badge-new' : user.role === 'agent' ? 'badge-assigned' : 'badge-resolved'}`} style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Log Out"
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-secondary)',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = '#f87171')}
                  onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
