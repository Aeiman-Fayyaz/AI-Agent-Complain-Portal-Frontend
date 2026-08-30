import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bot, Sparkles, Send, ArrowLeft, AlertCircle, TriangleAlert } from 'lucide-react';
import { TicketCategory } from '../types';

interface DuplicateMatch {
  ticketNumber: string;
  status: string;
  category?: string;
  summary?: string;
  score: number;
  reason?: string;
}

export const CreateTicketPage: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState<DuplicateMatch | null>(null);
  const navigate = useNavigate();

  const handleExampleClick = (exampleSubject: string, exampleDesc: string) => {
    setSubject(exampleSubject);
    setDescription(exampleDesc);
  };

  const submitTicket = async () => {
    setSubmitting(true);
    setError('');

    try {
      const res = await axios.post('/api/tickets', {
        subject: subject.trim(),
        description: description.trim(),
        category: category || undefined
      });

      if (res.data.success) {
        navigate(`/tickets/${res.data.data._id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit ticket');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!subject.trim() || !description.trim()) {
      setError('Please provide both subject and detailed description.');
      return;
    }

    try {
      const duplicateRes = await axios.post('/api/tickets/check-duplicate', {
        subject: subject.trim(),
        description: description.trim(),
        category: category || undefined
      });

      if (duplicateRes.data.success && duplicateRes.data.data?.isDuplicate && duplicateRes.data.data.match) {
        setDuplicateWarning(duplicateRes.data.data.match);
        return;
      }

      await submitTicket();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to validate for duplicate complaints.');
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '800px' }}>
      
      {/* Back Link */}
      <button
        onClick={() => navigate('/customer')}
        className="btn btn-secondary"
        style={{ marginBottom: '24px', padding: '6px 12px', fontSize: '0.85rem' }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="glass-panel animate-fade-in" style={{ padding: '36px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} /> AI-Powered Triage Enabled
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Submit Support Request
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Describe your issue. Our AI system will analyze your ticket, assign priority, and route it immediately to the right support agent.
          </p>
        </div>

        {/* Example Prompt Chips */}
        <div style={{ marginBottom: '28px', background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Click to try sample scenarios:
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleExampleClick(
                'I was charged twice for the same order and need one payment refunded.',
                'Checked my bank statement this morning and noticed order #88493 was billed $149.99 twice at 09:15 AM. Please refund the duplicate payment.'
              )}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#f87171',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: 600,
                textAlign: 'left'
              }}
            >
              💳 Duplicate Billing Charge (High Priority)
            </button>

            <button
              type="button"
              onClick={() => handleExampleClick(
                'Cannot log into my admin portal after password change.',
                'I updated my account credentials 15 minutes ago. Now every login attempt returns invalid authentication token.'
              )}
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                color: '#fbbf24',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem',
                fontWeight: 600,
                textAlign: 'left'
              }}
            >
              🔐 Account Lockout (Medium Priority)
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {duplicateWarning && (
          <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', padding: '18px 16px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', fontWeight: 700 }}>
              <TriangleAlert size={18} />
              <span>Similar complaint detected</span>
            </div>
            <div style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>
              We found a complaint that may be related to this issue.
            </div>
            <div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
              <div style={{ fontWeight: 700, marginBottom: '4px' }}>Complaint #{duplicateWarning.ticketNumber}</div>
              {duplicateWarning.category && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Category: {duplicateWarning.category}</div>}
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Status: {duplicateWarning.status}</div>
              {duplicateWarning.summary && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Summary: {duplicateWarning.summary}</div>}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setDuplicateWarning(null)} style={{ padding: '8px 12px' }}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={async () => { setDuplicateWarning(null); await submitTicket(); }} style={{ padding: '8px 12px' }}>
                Continue Anyway
              </button>
            </div>
          </div>
        )}

        {/* Ticket Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Subject / Issue Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. I was charged twice for order #88493"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Optional Category Pre-select</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Let AI Automatically Detect Category</option>
              <option value="Billing">Billing & Payment</option>
              <option value="Technical">Technical Defect / Bug</option>
              <option value="Account">Account Access / Security</option>
              <option value="Feature Request">Feature Request</option>
              <option value="General">General Inquiry</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label className="form-label">Detailed Description *</label>
            <textarea
              className="form-textarea"
              placeholder="Provide all relevant details, order numbers, timestamps, or steps to reproduce..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
          >
            {submitting ? (
              <>
                <Bot size={20} className="animate-spin" /> AI Analyzing & Submitting Ticket...
              </>
            ) : (
              <>
                <Send size={18} /> Submit Ticket & Run AI Triage
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
