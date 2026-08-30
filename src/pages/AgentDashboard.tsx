import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Ticket, DashboardStats, AnalyticsData, TicketStatus, TicketPriority, TicketCategory } from '../types';
import { useSocket } from '../context/SocketContext';
import {
  ShieldCheck,
  Search,
  Filter,
  Layers,
  Clock,
  AlertTriangle,
  CheckCircle,
  Inbox,
  UserCheck,
  Sparkles,
  ChevronRight,
  RefreshCw,
  BarChart3
} from 'lucide-react';

export const AgentDashboard: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'day' | 'week' | 'month'>('month');

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [assignedToMeOnly, setAssignedToMeOnly] = useState<boolean>(false);

  const { socket, joinAgentDashboard } = useSocket();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ticketsRes, statsRes, analyticsRes] = await Promise.all([
        axios.get('/api/tickets'),
        axios.get('/api/dashboard/stats'),
        axios.get('/api/dashboard/analytics', { params: { period: analyticsPeriod } })
      ]);

      if (ticketsRes.data.success) {
        setTickets(ticketsRes.data.data);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load agent dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    joinAgentDashboard();
  }, [analyticsPeriod]);

  // Socket event listeners for real-time ticket creation & status updates
  useEffect(() => {
    if (!socket) return;

    const handleNewTicket = () => {
      fetchData();
    };

    const handleTicketUpdated = () => {
      fetchData();
    };

    socket.on('new_ticket_created', handleNewTicket);
    socket.on('ticket_updated', handleTicketUpdated);

    return () => {
      socket.off('new_ticket_created', handleNewTicket);
      socket.off('ticket_updated', handleTicketUpdated);
    };
  }, [socket]);

  const matchesDateRange = (ticketDate: string) => {
    if (dateFilter === 'all') return true;

    const now = new Date();
    const createdAt = new Date(ticketDate);
    const diffDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

    switch (dateFilter) {
      case 'today':
        return createdAt.toDateString() === now.toDateString();
      case '7days':
        return diffDays <= 7 && diffDays >= 0;
      case '30days':
        return diffDays <= 30 && diffDays >= 0;
      default:
        return true;
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setCategoryFilter('All');
    setDateFilter('all');
    setUserFilter('all');
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesDate = matchesDateRange(t.createdAt);
    const matchesUser = userFilter === 'all' || t.customer?._id === userFilter || t.customer?.email === userFilter;

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      t.ticketNumber.toLowerCase().includes(query) ||
      t.subject.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query) ||
      t.priority.toLowerCase().includes(query) ||
      t.aiSummary?.toLowerCase().includes(query) ||
      (t.customer?.name && t.customer.name.toLowerCase().includes(query)) ||
      (t.customer?.email && t.customer.email.toLowerCase().includes(query));

    return matchesStatus && matchesPriority && matchesCategory && matchesDate && matchesUser && matchesSearch;
  });

  const customerOptions = Array.from(
    new Map(
      tickets
        .filter((ticket) => ticket.customer)
        .map((ticket) => [ticket.customer._id || ticket.customer.email, { id: ticket.customer._id || ticket.customer.email, label: `${ticket.customer.name} (${ticket.customer.email})` }])
    ).values()
  );

  const formatResolutionTime = (hours: number) => {
    if (!hours || hours <= 0) return '0h 00m';
    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${String(m).padStart(2, '0')}m`;
  };

  const categoryEntries = analytics?.complaintsByCategory ? Object.entries(analytics.complaintsByCategory) : [];
  const maxCategoryCount = categoryEntries.length ? Math.max(...categoryEntries.map(([, count]) => count)) : 1;
  const trendEntries = analytics?.complaintsOverTime || [];
  const maxTrendCount = trendEntries.length ? Math.max(...trendEntries.map((item) => item.value)) : 1;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      
      {/* Top Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>
            <ShieldCheck size={18} /> Support Agent Command Center
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            AI Ticket Triage & Resolution Dashboard
          </h1>
        </div>

        <button
          onClick={fetchData}
          className="btn btn-secondary"
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <RefreshCw size={16} /> Sync Live Data
        </button>
      </div>

      {/* KPI Stats Cards Row */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          
          {/* Total Tickets */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
              <Layers size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats.totalTickets}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Tickets</div>
            </div>
          </div>

          {/* New Tickets */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
              <Inbox size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{stats.newTickets}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>New & Unassigned</div>
            </div>
          </div>

          {/* In Progress */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24' }}>{stats.inProgressTickets}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>In Progress</div>
            </div>
          </div>

          {/* Resolved */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <CheckCircle size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399' }}>{stats.resolvedTickets}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Resolved Tickets</div>
            </div>
          </div>

          {/* High Priority */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f87171' }}>{stats.highPriorityTickets}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>High Priority</div>
            </div>
          </div>

        </div>
      )}

      {analytics && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '16px' }}>
            <BarChart3 size={18} /> Advanced Analytics Dashboard
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Complaints</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>{analytics.totalComplaints}</div>
            </div>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Resolved</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '8px' }}>{analytics.resolvedComplaints}</div>
            </div>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pending</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', marginTop: '8px' }}>{analytics.pendingComplaints}</div>
            </div>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Critical</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f87171', marginTop: '8px' }}>{analytics.criticalComplaints}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Complaints by Category</div>
              </div>

              {categoryEntries.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {categoryEntries.map(([category, count]) => (
                    <div key={category}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <span>{category}</span>
                        <span>{count}</span>
                      </div>
                      <div style={{ width: '100%', height: '10px', borderRadius: '999px', background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                        <div style={{ width: `${(count / maxCategoryCount) * 100}%`, height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #818cf8, #22d3ee)' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No category data available.</div>
              )}
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Complaint Trends</div>
                <div style={{ display: 'flex', gap: '6px', background: '#0f172a', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  {(['day', 'week', 'month'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setAnalyticsPeriod(period)}
                      className="btn btn-secondary"
                      style={{
                        padding: '5px 10px',
                        fontSize: '0.72rem',
                        background: analyticsPeriod === period ? 'var(--accent-primary)' : 'transparent',
                        color: analyticsPeriod === period ? '#fff' : 'var(--text-primary)',
                        border: 'none'
                      }}
                    >
                      {period === 'day' ? 'Daily' : period === 'week' ? 'Weekly' : 'Monthly'}
                    </button>
                  ))}
                </div>
              </div>

              {trendEntries.length > 0 ? (
                <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                  {trendEntries.map((entry) => (
                    <div key={entry.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', minWidth: '32px' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{entry.value}</div>
                      <div style={{ width: '100%', maxWidth: '40px', height: `${Math.max((entry.value / maxTrendCount) * 100, 8)}%`, borderRadius: '8px 8px 0 0', background: 'linear-gradient(180deg, #818cf8, #22d3ee)' }} />
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '8px', writingMode: 'vertical-rl', transform: 'rotate(180deg)', height: '52px', textAlign: 'center' }}>{entry.label}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No complaint activity available.</div>
              )}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>Average Resolution Time</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399' }}>{formatResolutionTime(analytics.averageResolutionTime)}</div>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', minWidth: '280px', background: '#0f172a', padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search by ticket #, subject, customer, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)', fontSize: '0.9rem' }}
            />
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="btn btn-secondary"
            style={{ padding: '8px 12px', fontSize: '0.8rem' }}
          >
            Clear Filters
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
            <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Priority:</span>
            <select className="form-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Category:</span>
            <select className="form-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
              <option value="All">All Categories</option>
              <option value="Billing">Billing</option>
              <option value="Technical">Technical</option>
              <option value="Account">Account</option>
              <option value="Feature Request">Feature Request</option>
              <option value="General">General</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Date:</span>
            <select className="form-select" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>

          {customerOptions.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>User:</span>
              <select className="form-select" value={userFilter} onChange={(e) => setUserFilter(e.target.value)} style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
                <option value="all">All Users</option>
                {customerOptions.map((customer) => (
                  <option key={customer.id} value={customer.id}>{customer.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Showing {filteredTickets.length} of {tickets.length} complaints
        </div>
      </div>

      {/* Tickets List / Table */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        
        {loading && (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Clock size={32} className="animate-spin" style={{ marginBottom: '12px', color: 'var(--accent-primary)' }} />
            <div>Loading agent tickets...</div>
          </div>
        )}

        {!loading && filteredTickets.length === 0 && (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Inbox size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>No Tickets Match Criteria</h3>
            <p style={{ fontSize: '0.88rem' }}>Try adjusting your filters or search terms.</p>
          </div>
        )}

        {!loading && filteredTickets.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid var(--border-color)', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '16px 20px' }}>Ticket #</th>
                  <th style={{ padding: '16px 20px' }}>Subject</th>
                  <th style={{ padding: '16px 20px' }}>Customer</th>
                  <th style={{ padding: '16px 20px' }}>Category</th>
                  <th style={{ padding: '16px 20px' }}>AI Priority</th>
                  <th style={{ padding: '16px 20px' }}>Status</th>
                  <th style={{ padding: '16px 20px' }}>Assigned Agent</th>
                  <th style={{ padding: '16px 20px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket._id}
                    style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Ticket # */}
                    <td style={{ padding: '16px 20px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>
                      {ticket.ticketNumber}
                    </td>

                    {/* Subject & AI Summary */}
                    <td style={{ padding: '16px 20px', maxWidth: '320px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '4px' }}>
                        {ticket.subject}
                      </div>
                      {ticket.aiSummary && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={12} color="#818cf8" /> {ticket.aiSummary}
                        </div>
                      )}
                    </td>

                    {/* Customer */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{ticket.customer?.name || 'Customer'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ticket.customer?.email}</div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '16px 20px' }}>
                      <span className="badge badge-category">{ticket.category}</span>
                    </td>

                    {/* AI Priority */}
                    <td style={{ padding: '16px 20px' }}>
                      <span className={`badge badge-${ticket.priority.toLowerCase()}`}>{ticket.priority}</span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '16px 20px' }}>
                      <span className={`badge badge-${ticket.status.toLowerCase().replace(' ', '-')}`}>
                        {ticket.status}
                      </span>
                    </td>

                    {/* Assigned Agent */}
                    <td style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {ticket.assignedAgent ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc' }}>
                          <UserCheck size={14} /> {ticket.assignedAgent.name.split(' ')[0]}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Unassigned</span>
                      )}
                    </td>

                    {/* Action */}
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <Link
                        to={`/tickets/${ticket._id}`}
                        className="btn btn-primary"
                        style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                      >
                        <span>Review & Handle</span>
                        <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
