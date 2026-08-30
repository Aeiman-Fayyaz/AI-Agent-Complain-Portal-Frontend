import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Ticket, Message, TicketCategory, TicketPriority, TicketStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  ArrowLeft,
  Sparkles,
  Edit3,
  Check,
  Send,
  User,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Lock,
  MessageSquare,
  FileText
} from 'lucide-react';

export const TicketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, joinTicketRoom, leaveTicketRoom } = useSocket();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // AI Edit State
  const [isEditingAi, setIsEditingAi] = useState<boolean>(false);
  const [editCategory, setEditCategory] = useState<TicketCategory>('General');
  const [editPriority, setEditPriority] = useState<TicketPriority>('Medium');
  const [editSummary, setEditSummary] = useState<string>('');
  const [savingAi, setSavingAi] = useState<boolean>(false);

  // Message Send State
  const [newMessage, setNewMessage] = useState<string>('');
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  const [isInternalNote, setIsInternalNote] = useState<boolean>(false);

  // Resolution Modal / Note State
  const [showResolveModal, setShowResolveModal] = useState<boolean>(false);
  const [resolutionNote, setResolutionNote] = useState<string>('');
  const [resolvingTicket, setResolvingTicket] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const [ticketRes, messagesRes] = await Promise.all([
        axios.get(`/api/tickets/${id}`),
        axios.get(`/api/tickets/${id}/messages`)
      ]);

      if (ticketRes.data.success) {
        const ticketData: Ticket = ticketRes.data.data;
        setTicket(ticketData);

        // Initialize AI edit form values
        setEditCategory(ticketData.category);
        setEditPriority(ticketData.priority);
        setEditSummary(ticketData.aiSummary || ticketData.subject);
      }

      if (messagesRes.data.success) {
        setMessages(messagesRes.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
    if (id) {
      joinTicketRoom(id);
    }

    return () => {
      if (id) {
        leaveTicketRoom(id);
      }
    };
  }, [id]);

  // Real-time socket events
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    };

    const handleTicketUpdated = (updatedTicket: Ticket) => {
      setTicket(updatedTicket);
    };

    socket.on('new_message', handleNewMessage);
    socket.on('ticket_updated', handleTicketUpdated);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('ticket_updated', handleTicketUpdated);
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // AI Suggestions Edit & Finalize Handler
  const handleSaveAiTriage = async () => {
    if (!ticket) return;
    try {
      setSavingAi(true);
      const res = await axios.patch(`/api/tickets/${ticket._id}`, {
        category: editCategory,
        priority: editPriority,
        aiSummary: editSummary,
        isAiApproved: true
      });

      if (res.data.success) {
        setTicket(res.data.data);
        setIsEditingAi(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update AI triage parameters');
    } finally {
      setSavingAi(false);
    }
  };

  // Status Change Handler
  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (!ticket) return;

    if (newStatus === 'Resolved') {
      setShowResolveModal(true);
      return;
    }

    try {
      const res = await axios.patch(`/api/tickets/${ticket._id}`, {
        status: newStatus
      });

      if (res.data.success) {
        setTicket(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  // Submit Resolution Note & Mark Resolved
  const handleConfirmResolution = async () => {
    if (!ticket) return;
    if (!resolutionNote.trim()) {
      setError('Resolution note is required to resolve a ticket.');
      return;
    }

    try {
      setResolvingTicket(true);
      const res = await axios.patch(`/api/tickets/${ticket._id}`, {
        status: 'Resolved',
        resolutionNote: resolutionNote.trim()
      });

      if (res.data.success) {
        setTicket(res.data.data);
        setShowResolveModal(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resolve ticket');
    } finally {
      setResolvingTicket(false);
    }
  };

  // Send Message Handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || !newMessage.trim()) return;

    try {
      setSendingMessage(true);
      const res = await axios.post(`/api/tickets/${ticket._id}/messages`, {
        content: newMessage.trim(),
        isInternal: isInternalNote
      });

      if (res.data.success) {
        setNewMessage('');
        setIsInternalNote(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <Clock size={36} className="animate-spin" style={{ marginBottom: '12px', color: 'var(--accent-primary)' }} />
        <div>Loading ticket conversation...</div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: '20px' }}>
          <ArrowLeft size={16} /> Go Back
        </button>
        <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '20px', borderRadius: 'var(--radius-md)' }}>
          <AlertCircle size={20} style={{ marginBottom: '8px' }} />
          <div>{error || 'Ticket not found'}</div>
        </div>
      </div>
    );
  }

  const isAgent = user?.role === 'agent' || user?.role === 'admin';

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      
      {/* Back Link */}
      <button
        onClick={() => navigate(isAgent ? '/agent' : '/customer')}
        className="btn btn-secondary"
        style={{ marginBottom: '20px', padding: '6px 14px', fontSize: '0.85rem' }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '24px' }}>
        
        {/* Left Column: Ticket Details & Chat Conversation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Ticket Subject Card */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                {ticket.ticketNumber}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`badge badge-${ticket.priority.toLowerCase()}`}>{ticket.priority} Priority</span>
                <span className={`badge badge-${ticket.status.toLowerCase().replace(' ', '-')}`}>{ticket.status}</span>
              </div>
            </div>

            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
              {ticket.subject}
            </h1>

            <div style={{ background: '#0f172a', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.92rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {ticket.description}
            </div>

            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>Submitted by: <strong style={{ color: 'var(--text-secondary)' }}>{ticket.customer?.name}</strong></span>
              <span>Category: <strong style={{ color: 'var(--text-secondary)' }}>{ticket.category}</strong></span>
              <span>Created: {new Date(ticket.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Resolution Note Alert (If Resolved) */}
          {ticket.status === 'Resolved' && (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '20px', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>
                <CheckCircle size={20} /> Ticket Resolution Note
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {ticket.resolutionNote || 'Ticket marked as resolved by support agent.'}
              </p>
            </div>
          )}

          {/* Conversation History & Real-Time Chat Interface */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '540px' }}>
            
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                <MessageSquare size={18} color="var(--accent-primary)" />
                <span>Conversation History ({messages.length})</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time updates active</span>
            </div>

            {/* Messages Scroll Area */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto', fontSize: '0.9rem' }}>
                  No messages yet. Send a reply below to start the conversation.
                </div>
              ) : (
                messages.map((msg) => {
                  const isMsgFromMe = msg.sender?._id === user?._id;
                  const isAgentSender = msg.sender?.role === 'agent' || msg.sender?.role === 'admin';

                  return (
                    <div
                      key={msg._id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isMsgFromMe ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        alignSelf: isMsgFromMe ? 'flex-end' : 'flex-start'
                      }}
                    >
                      {/* Sender Info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, color: isAgentSender ? '#c084fc' : '#22d3ee' }}>
                          {msg.sender?.name} {isAgentSender ? '(Support Agent)' : ''}
                        </span>
                        {msg.isInternal && (
                          <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '1px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700 }}>
                            Internal Note
                          </span>
                        )}
                        <span>• {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      {/* Bubble */}
                      <div
                        style={{
                          background: msg.isInternal
                            ? 'rgba(245, 158, 11, 0.12)'
                            : isMsgFromMe
                            ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                            : '#162032',
                          color: '#ffffff',
                          padding: '12px 16px',
                          borderRadius: isMsgFromMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                          border: msg.isInternal ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                          fontSize: '0.9rem',
                          lineHeight: 1.5,
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Box */}
            <form onSubmit={handleSendMessage} style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)', background: '#0f172a' }}>
              
              {isAgent && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#fbbf24', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                    />
                    <Lock size={12} /> Post as Internal Agent Note (Visible to Agents Only)
                  </label>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder={ticket.status === 'Resolved' ? 'This ticket is resolved, but you can send a follow-up message...' : 'Type a message...'}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={sendingMessage || !newMessage.trim()}
                  style={{ padding: '10px 18px' }}
                >
                  <Send size={16} /> Send
                </button>
              </div>
            </form>

          </div>

        </div>

        {/* Right Column: AI Triage Review Panel & Workflow Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* MANDATORY AI TRIAGE REVIEW PANEL */}
          <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontWeight: 800, fontSize: '1rem' }}>
                <Sparkles size={20} /> AI Ticket Triage
              </div>
              <span className={`badge ${ticket.isAiApproved ? 'badge-resolved' : 'badge-new'}`} style={{ fontSize: '0.65rem' }}>
                {ticket.isAiApproved ? 'Approved by Agent' : 'AI Suggested'}
              </span>
            </div>

            {!isEditingAi ? (
              <div>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <span className="form-label" style={{ fontSize: '0.75rem' }}>AI Suggested Category</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {ticket.category}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <span className="form-label" style={{ fontSize: '0.75rem' }}>AI Suggested Priority</span>
                  <div>
                    <span className={`badge badge-${ticket.priority.toLowerCase()}`}>{ticket.priority}</span>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <span className="form-label" style={{ fontSize: '0.75rem' }}>AI Ticket Summary</span>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(255, 255, 255, 0.03)', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    {ticket.aiSummary || 'No summary available.'}
                  </div>
                </div>

                {isAgent && (
                  <button
                    onClick={() => setIsEditingAi(true)}
                    className="btn btn-secondary"
                    style={{ width: '100%', fontSize: '0.85rem', padding: '8px' }}
                  >
                    <Edit3 size={14} /> Review & Edit Suggestions
                  </button>
                )}
              </div>
            ) : (
              /* Inline Edit AI Suggestions Form */
              <div className="animate-fade-in">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as TicketCategory)}
                  >
                    <option value="Billing">Billing</option>
                    <option value="Technical">Technical</option>
                    <option value="Account">Account</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as TicketPriority)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Summary Note</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={editSummary}
                    onChange={(e) => setEditSummary(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleSaveAiTriage}
                    disabled={savingAi}
                    className="btn btn-success"
                    style={{ flex: 1, fontSize: '0.85rem', padding: '8px' }}
                  >
                    <Check size={14} /> Accept & Save
                  </button>
                  <button
                    onClick={() => setIsEditingAi(false)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem', padding: '8px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Workflow Status Action Box */}
          {isAgent && (
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
                Ticket Status Workflow
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {ticket.status === 'New' && (
                  <button
                    onClick={() => handleStatusChange('Assigned')}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '10px' }}
                  >
                    Assign to Me
                  </button>
                )}

                {(ticket.status === 'New' || ticket.status === 'Assigned') && (
                  <button
                    onClick={() => handleStatusChange('In Progress')}
                    className="btn btn-secondary"
                    style={{ width: '100%', padding: '10px', borderColor: 'var(--status-inprogress-text)', color: 'var(--status-inprogress-text)' }}
                  >
                    Set Status: In Progress
                  </button>
                )}

                {ticket.status !== 'Resolved' && (
                  <button
                    onClick={() => handleStatusChange('Resolved')}
                    className="btn btn-success"
                    style={{ width: '100%', padding: '10px' }}
                  >
                    <CheckCircle size={16} /> Mark as Resolved
                  </button>
                )}

                {ticket.status === 'Resolved' && (
                  <button
                    onClick={() => handleStatusChange('In Progress')}
                    className="btn btn-secondary"
                    style={{ width: '100%', padding: '10px' }}
                  >
                    Re-open Ticket
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Ticket Information Card */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
              Ticket Metadata
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Assigned Agent:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {ticket.assignedAgent ? ticket.assignedAgent.name : 'Unassigned'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Customer Email:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {ticket.customer?.email}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Created Date:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Last Updated:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {new Date(ticket.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* RESOLUTION NOTE MODAL */}
      {showResolveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '32px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
              Require Resolution Note
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
              Please describe the resolution details before changing this ticket status to <strong>Resolved</strong>.
            </p>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Resolution Summary Note *</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="e.g. Refund of $149.99 processed back to customer bank card via Stripe billing portal."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowResolveModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResolution}
                disabled={resolvingTicket || !resolutionNote.trim()}
                className="btn btn-success"
              >
                {resolvingTicket ? 'Resolving...' : 'Confirm Resolution'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
