import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bell, Bot, LogOut, PlusCircle, LayoutDashboard, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { UserRole } from '../types';

interface NotificationItem {
  _id: string;
  user: string;
  ticket: { _id: string; ticketNumber?: string; subject?: string; status?: string } | null;
  type: 'assignment' | 'status' | 'resolved';
  message: string;
  read: boolean;
  createdAt: string;
}

export const Navbar: React.FC = () => {
  const { user, logout, loginAsDemoUser, loading } = useAuth();
  const { isConnected } = useSocket();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    if (!user || user.role !== 'customer') return;

    try {
      const res = await axios.get('/api/notifications');
      if (res.data.success) {
        setNotifications(res.data.data || []);
      }
    } catch (error) {
      console.error('[Navbar Notifications Error]', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);

  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`);
      setNotifications((current) =>
        current.map((notification) => (notification._id === id ? { ...notification, read: true } : notification))
      );
    } catch (error) {
      console.error('[Navbar Mark Read Error]', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch('/api/notifications/read-all');
      setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
    } catch (error) {
      console.error('[Navbar Mark All Read Error]', error);
    }
  };

  const handleDemoSwitch = async (role: UserRole) => {
    await loginAsDemoUser(role);
    if (role === 'customer') navigate('/customer');
    else navigate('/agent');
  };

  const formatTimeAgo = (date: string) => {
    const seconds = Math.max(1, Math.floor((Date.now() - new Date(date).getTime()) / 1000));
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
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
              Resolve <span style={{ color: '#06b6d4' }}>AI</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.05em' }}>
              Every Complaint. Smarter Resolution
            </div>
          </div>
        </Link>


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

              {user.role === 'customer' && (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setIsOpen((current) => !current)}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: '#0f172a',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                    aria-label="Open notifications"
                  >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-4px',
                        minWidth: '18px',
                        height: '18px',
                        borderRadius: '999px',
                        background: '#ef4444',
                        color: '#fff',
                        fontSize: '0.68rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        padding: '0 4px'
                      }}>{unreadCount}</span>
                    )}
                  </button>

                  {isOpen && (
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: '52px',
                      width: '360px',
                      maxWidth: 'calc(100vw - 24px)',
                      maxHeight: '420px',
                      overflowY: 'auto',
                      background: '#0f172a',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
                      zIndex: 100
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderBottom: '1px solid var(--border-color)'
                      }}>
                        <strong style={{ fontSize: '0.95rem' }}>Notifications</strong>
                        {unreadCount > 0 && (
                          <button onClick={markAllAsRead} className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.72rem' }}>
                            Mark all as read
                          </button>
                        )}
                      </div>

                      {notifications.length === 0 ? (
                        <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((item) => (
                          <button
                            key={item._id}
                            onClick={() => {
                              if (!item.read) markAsRead(item._id);
                              setIsOpen(false);
                            }}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                              padding: '12px 14px',
                              borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
                              background: item.read ? 'transparent' : 'rgba(99, 102, 241, 0.08)',
                              color: 'var(--text-primary)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                              <span style={{ color: '#60a5fa', fontSize: '0.9rem' }}>🔔</span>
                              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.message}</span>
                            </div>
                            {item.ticket && (
                              <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '4px' }}>
                                Complaint {item.ticket.ticketNumber || item.ticket._id}
                              </div>
                            )}
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{formatTimeAgo(item.createdAt)}</div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {user.role !== 'customer' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#0f172a', padding: '4px 10px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Switch Role:</span>
                  <button
                    onClick={() => handleDemoSwitch('customer')}
                    disabled={loading}
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      borderRadius: '6px',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
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
              )}

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
