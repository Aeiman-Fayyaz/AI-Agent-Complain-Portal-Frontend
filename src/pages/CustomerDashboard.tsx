import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Ticket, TicketStatus } from '../types';
import { useSocket } from '../context/SocketContext';
import { PlusCircle, Search, Ticket as TicketIcon, Clock, Sparkles, MessageSquare, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterDate, setFilterDate] = useState<string>('all');

  const { socket } = useSocket();

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/tickets');
      if (res.data.success) {
        setTickets(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Socket listener for real-time ticket status updates
  useEffect(() => {
    if (!socket) return;

    const handleTicketUpdate = (updatedTicket: Ticket) => {
      setTickets((prev) =>
        prev.map((t) => (t._id === updatedTicket._id ? updatedTicket : t))
      );
    };

    socket.on('ticket_updated', handleTicketUpdate);

    return () => {
      socket.off('ticket_updated', handleTicketUpdate);
    };
  }, [socket]);

  const matchesDateRange = (ticketDate: string) => {
    if (filterDate === 'all') return true;

    const now = new Date();
    const createdAt = new Date(ticketDate);
    const diffDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

    switch (filterDate) {
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
    setFilterStatus('All');
    setFilterPriority('All');
    setFilterCategory('All');
    setFilterDate('all');
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = filterStatus === 'All' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || ticket.priority === filterPriority;
    const matchesCategory = filterCategory === 'All' || ticket.category === filterCategory;
    const matchesDate = matchesDateRange(ticket.createdAt);
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      ticket.ticketNumber.toLowerCase().includes(query) ||
      ticket.subject.toLowerCase().includes(query) ||
      ticket.description.toLowerCase().includes(query) ||
      ticket.category.toLowerCase().includes(query) ||
      ticket.priority.toLowerCase().includes(query) ||
      ticket.aiSummary?.toLowerCase().includes(query);

    return matchesStatus && matchesPriority && matchesCategory && matchesDate && matchesSearch;
  });

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'New':
        return <span className="badge badge-new">New</span>;
      case 'Assigned':
        return <span className="badge badge-assigned">Assigned</span>;
      case 'In Progress':
        return <span className="badge badge-in-progress">In Progress</span>;
      case 'Resolved':
        return <span className="badge badge-resolved">Resolved</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Customer Support Center
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Submit tickets, track live status, and communicate directly with support agents.
          </p>
        </div>

        <Link to="/customer/create" className="btn btn-primary" style={{ padding: '12px 20px', fontSize: '0.95rem' }}>
          <PlusCircle size={20} /> Create New Ticket
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '260px' }}>
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              className="form-input"
              placeholder="Search by ticket #, subject, description, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', padding: '6px 0', fontSize: '0.9rem' }}
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
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Category:</span>
            <select className="form-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}>
              <option value="All">All Categories</option>
              <option value="Billing">Billing</option>
              <option value="Technical">Technical</option>
              <option value="Account">Account</option>
              <option value="Feature Request">Feature Request</option>
              <option value="General">General</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Priority:</span>
            <select className="form-select" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}>
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status:</span>
            <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}>
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Date:</span>
            <select className="form-select" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}>
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Showing {filteredTickets.length} of {tickets.length} complaints
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
          <Clock size={32} className="animate-spin" style={{ marginBottom: '12px', color: 'var(--accent-primary)' }} />
          <div>Loading your tickets...</div>
        </div>
      )}

      {/* Error Alert */}
      {error && !loading && (
        <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTickets.length === 0 && (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <TicketIcon size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>No Support Tickets Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
            {searchQuery || filterStatus !== 'All'
              ? 'No tickets match your filter criteria. Try clearing search filters.'
              : 'You have not created any support tickets yet. Click below to get help from our AI triage team.'}
          </p>
          <Link to="/customer/create" className="btn btn-primary">
            <PlusCircle size={18} /> Create First Ticket
          </Link>
        </div>
      )}

      {/* Ticket Grid List */}
      {!loading && filteredTickets.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredTickets.map((ticket) => (
            <Link
              key={ticket._id}
              to={`/tickets/${ticket._id}`}
              className="glass-panel animate-fade-in"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                textDecoration: 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--glass-border)';
              }}
            >
              <div>
                {/* Card Top Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    {ticket.ticketNumber}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className={`badge badge-${ticket.priority.toLowerCase()}`}>{ticket.priority}</span>
                    {getStatusBadge(ticket.status)}
                  </div>
                </div>

                {/* Subject */}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.4 }}>
                  {ticket.subject}
                </h3>

                {/* Description snippet */}
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: '16px' }}>
                  {ticket.description}
                </p>

                {/* AI Summary Callout */}
                {ticket.aiSummary && (
                  <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#818cf8', fontWeight: 700, fontSize: '0.75rem', marginBottom: '4px' }}>
                      <Sparkles size={14} /> AI Triage Summary
                    </div>
                    <span>{ticket.aiSummary}</span>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span className="badge badge-category">{ticket.category}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-primary)', fontWeight: 600 }}>
                  <span>View Details</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
};
