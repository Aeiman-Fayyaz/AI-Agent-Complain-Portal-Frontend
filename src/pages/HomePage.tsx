import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Bot, BrainCircuit, CheckCircle2, CircleDashed, Gauge, Layers3, ShieldCheck, Sparkles, Star, TrendingUp, Wand2 } from 'lucide-react';

const featureCards = [
  {
    icon: BrainCircuit,
    title: 'AI Complaint Analysis',
    text: 'Transform raw complaints into actionable insights with AI categorization, sentiment detection, and resolution summaries.'
  },
  {
    icon: Layers3,
    title: 'Smart Duplicate Detection',
    text: 'Reduce duplicate noise by identifying similar complaints before they become redundant support work.'
  },
  {
    icon: TrendingUp,
    title: 'Advanced Analytics',
    text: 'Monitor complaint volume, priorities, categories, and trends through real-time operational insights.'
  },
  {
    icon: Gauge,
    title: 'Smart Search & Filters',
    text: 'Locate complaints instantly with granular search, status filters, priority checks, and date-based views.'
  },
  {
    icon: ShieldCheck,
    title: 'Role-Based Access',
    text: 'Keep each role secure with structured customer, agent, and admin experiences built on the existing auth model.'
  },
  {
    icon: CheckCircle2,
    title: 'Notification Center',
    text: 'Keep customers informed with clear updates on assignment, review progress, and resolution milestones.'
  }
];

const trustPoints = [
  'Faster response times for urgent cases',
  'Smarter prioritization using AI signals',
  'Clearer customer communication and updates',
  'Unified support operations in one platform'
];

const processSteps = [
  { number: '01', title: 'Submit', text: 'Customers describe the issue with context and details.' },
  { number: '02', title: 'Analyze', text: 'ResolveAI interprets complaint intent, sentiment, and priority.' },
  { number: '03', title: 'Prioritize', text: 'The system flags category, urgency, risk, and duplicate likelihood.' },
  { number: '04', title: 'Resolve', text: 'Agents and admins act quickly while customers stay informed.' }
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{ background: 'linear-gradient(180deg, #0b0f19 0%, #0f172a 50%, #111827 100%)', color: '#f8fafc' }}>
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 25px rgba(99, 102, 241, 0.25); }
          50% { box-shadow: 0 0 35px rgba(6, 182, 212, 0.35); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .resolve-ai-hero { animation: fadeUp 0.8s ease; }
        .resolve-ai-float { animation: floatSlow 6s ease-in-out infinite; }
        .resolve-ai-glow { animation: pulseGlow 4s ease-in-out infinite; }
        .resolve-ai-card { transition: transform 0.2s ease, border-color 0.2s ease; }
        .resolve-ai-card:hover { transform: translateY(-4px); border-color: rgba(99, 102, 241, 0.4); }
        @media (max-width: 1024px) {
          .resolve-ai-hero {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            padding: 18px 0 26px !important;
          }
          .resolve-ai-process-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .resolve-ai-split {
            grid-template-columns: 1fr !important;
          }
          .resolve-ai-trust-grid {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .resolve-ai-grid {
            grid-template-columns: 1fr !important;
          }
          .resolve-ai-process-grid {
            grid-template-columns: 1fr !important;
          }
          .resolve-ai-hero-badges {
            justify-content: center !important;
          }
          .resolve-ai-hero-badges span {
            width: 100% !important;
            justify-content: center !important;
          }
          .resolve-ai-actions,
          .resolve-ai-cta-row {
            flex-direction: column !important;
          }
          .resolve-ai-actions button,
          .resolve-ai-cta-row button {
            width: 100% !important;
          }
        }

        @media (max-width: 560px) {
          .resolve-ai-hero {
            padding-top: 8px !important;
          }
          .resolve-ai-hero h1 {
            font-size: clamp(2.3rem, 13vw, 3.5rem) !important;
          }
          .resolve-ai-hero .resolve-ai-subtitle {
            font-size: clamp(1.1rem, 5vw, 1.6rem) !important;
          }
          .resolve-ai-hero .resolve-ai-description {
            font-size: 0.98rem !important;
          }
          .resolve-ai-footer-row {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }
          .resolve-ai-footer-links {
            width: 100% !important;
            justify-content: center !important;
          }
          .resolve-ai-hero-panel {
            padding: 12px !important;
          }
          .resolve-ai-hero-panel .resolve-ai-chip-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '56px 20px 80px' }}>
        <section className="resolve-ai-hero" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', alignItems: 'center', gap: '32px', padding: '32px 0 48px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '999px', background: 'rgba(99,102,241,0.12)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.25)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              <Sparkles size={14} /> AI support intelligence
            </div>

            <h1 style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', lineHeight: 1, margin: '22px 0 18px', fontWeight: 900, letterSpacing: '-0.06em' }}>
              ResolveAI
            </h1>

            <div className="resolve-ai-subtitle" style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2.2rem)', fontWeight: 700, color: '#e2e8f0', marginBottom: '18px' }}>
              Listen. Analyze. Resolve.
            </div>

            <p className="resolve-ai-description" style={{ maxWidth: '620px', color: '#cbd5e1', fontSize: '1.06rem', lineHeight: 1.8, marginBottom: '28px' }}>
              ResolveAI brings customer complaints, AI triage, smart prioritization, actionable insights, and team workflows together in one premium resolution platform.
            </p>

            <div className="resolve-ai-actions" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '26px' }}>
              <button onClick={() => navigate('/register')} className="btn btn-primary" style={{ padding: '14px 22px', fontSize: '0.98rem' }}>
                Get Started <ArrowRight size={18} />
              </button>
              <button onClick={() => scrollToSection('features')} className="btn btn-secondary" style={{ padding: '14px 22px', fontSize: '0.98rem' }}>
                Explore ResolveAI
              </button>
              <button onClick={() => navigate('/login')} className="btn btn-secondary" style={{ padding: '14px 22px', fontSize: '0.98rem' }}>
                Login
              </button>
            </div>

            <div className="resolve-ai-hero-badges" style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', color: '#94a3b8', fontSize: '0.85rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><Star size={14} color="#fbbf24" /> AI-powered triage</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><CircleDashed size={14} color="#67e8f9" /> Smart prioritization</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><Wand2 size={14} color="#a78bfa" /> Customer-first workflow</span>
            </div>
          </div>

          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '440px' }}>
            <div className="resolve-ai-glow" style={{ position: 'absolute', inset: '12% 16%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(6,182,212,0.18) 35%, transparent 70%)', filter: 'blur(14px)' }} />

            <div className="resolve-ai-float resolve-ai-hero-panel" style={{ position: 'relative', width: '100%', maxWidth: '440px', padding: '18px', borderRadius: '24px', background: 'rgba(15, 23, 42, 0.68)', border: '1px solid rgba(148, 163, 184, 0.18)', backdropFilter: 'blur(18px)', boxShadow: '0 24px 80px rgba(15, 23, 42, 0.5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bot size={20} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#93c5fd', fontWeight: 700 }}>AI Engine</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Complaint triage active</div>
                  </div>
                </div>
                <span style={{ padding: '6px 10px', borderRadius: '999px', background: 'rgba(34,197,94,0.12)', color: '#86efac', border: '1px solid rgba(34,197,94,0.3)', fontSize: '0.7rem', fontWeight: 700 }}>Live</span>
              </div>

              <div style={{ background: 'rgba(11, 15, 25, 0.9)', border: '1px solid rgba(148, 163, 184, 0.12)', borderRadius: '18px', padding: '18px', marginBottom: '18px' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Customer Complaint</div>
                <div style={{ color: '#f8fafc', fontWeight: 600, marginBottom: '14px' }}>I was charged twice for my order and still have not received the product.</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="badge badge-category">Billing</span>
                  <span className="badge badge-high">High priority</span>
                </div>
              </div>

              <div className="resolve-ai-chip-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
                <div style={{ padding: '12px', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                  <div style={{ color: '#c7d2fe', fontSize: '0.72rem', marginBottom: '6px' }}>Category</div>
                  <div style={{ fontWeight: 700 }}>Billing</div>
                </div>
                <div style={{ padding: '12px', borderRadius: '14px', background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6,182,212,0.25)' }}>
                  <div style={{ color: '#a5f3fc', fontSize: '0.72rem', marginBottom: '6px' }}>Priority</div>
                  <div style={{ fontWeight: 700 }}>High</div>
                </div>
                <div style={{ padding: '12px', borderRadius: '14px', background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168,85,247,0.25)' }}>
                  <div style={{ color: '#e9d5ff', fontSize: '0.72rem', marginBottom: '6px' }}>Sentiment</div>
                  <div style={{ fontWeight: 700 }}>Frustrated</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '30px 0 18px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.8rem', fontWeight: 700, marginBottom: '10px' }}>What is ResolveAI?</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '16px' }}>Customer support, reimagined with AI.</h2>
            <p style={{ maxWidth: '720px', margin: '0 auto', color: '#cbd5e1', lineHeight: 1.8, fontSize: '1rem' }}>
              ResolveAI helps customers submit issues, gives support teams intelligent triage, and turns complaint management into a faster, clearer, more confident resolution process.
            </p>
          </div>

          <div className="resolve-ai-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '18px', marginTop: '28px' }}>
            <div className="glass-panel resolve-ai-card" style={{ padding: '28px', borderRadius: '22px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#7dd3fc' }}>
                <Sparkles size={18} />
                <strong style={{ fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>AI intelligence</strong>
              </div>
              <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
                Every complaint is analyzed for category, urgency, sentiment, and resolution context, enabling teams to act with clarity instead of guesswork.
              </p>
            </div>

            <div className="glass-panel resolve-ai-card" style={{ padding: '28px', borderRadius: '22px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#c4b5fd' }}>
                <ShieldCheck size={18} />
                <strong style={{ fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Secure by design</strong>
              </div>
              <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
                Role-based access keeps customer, agent, and admin experiences organized and protected while the workflow remains easy to follow.
              </p>
            </div>
          </div>
        </section>

        <section id="features" style={{ padding: '70px 0 30px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.8rem', fontWeight: 700, marginBottom: '10px' }}>Features</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '12px' }}>Everything you need to resolve smarter.</h2>
          </div>

          <div className="resolve-ai-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '18px' }}>
            {featureCards.map(({ icon: Icon, title, text }) => (
              <div key={title} className="glass-panel resolve-ai-card" style={{ padding: '26px 22px', borderRadius: '22px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.18))', color: '#c4b5fd', marginBottom: '18px', border: '1px solid rgba(99,102,241,0.25)' }}>
                  <Icon size={24} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '10px' }}>{title}</h3>
                <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: '80px 0 30px' }}>
          <div style={{ textAlign: 'center', marginBottom: '34px' }}>
            <div style={{ color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.8rem', fontWeight: 700, marginBottom: '10px' }}>How it works</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800 }}>A clear path from complaint to resolution.</h2>
          </div>

          <div className="resolve-ai-process-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px' }}>
            {processSteps.map((step) => (
              <div key={step.number} style={{ position: 'relative', padding: '26px 18px', borderRadius: '20px', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(148, 163, 184, 0.12)' }}>
                <div style={{ fontSize: '0.8rem', color: '#67e8f9', fontWeight: 800, letterSpacing: '0.08em', marginBottom: '10px' }}>{step.number}</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{step.title}</h3>
                <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: '80px 0 30px' }}>
          <div className="resolve-ai-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: '22px', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.8rem', fontWeight: 700, marginBottom: '10px' }}>AI intelligence showcase</div>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '16px' }}>A smarter engine behind every complaint.</h2>
              <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '18px' }}>
                ResolveAI understands the intent behind each complaint so teams can spot duplicates, route urgent issues quickly, and respond with better context.
              </p>
              <div style={{ display: 'grid', gap: '12px' }}>
                {['Category detection', 'Priority analysis', 'Sentiment interpretation', 'Resolution-ready summary'].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0', fontWeight: 600 }}>
                    <CheckCircle2 size={18} color="#34d399" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: '14% 18%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.3), rgba(6,182,212,0.12), transparent 70%)', filter: 'blur(12px)' }} />
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', color: '#cbd5e1', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  <Bot size={16} />
                  AI inference overview
                </div>

                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ padding: '14px 16px', borderRadius: '14px', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.12)' }}>
                    <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginBottom: '6px' }}>Complaint input</div>
                    <div style={{ fontWeight: 600 }}>Customer was charged twice after checkout.</div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', color: '#7dd3fc', fontWeight: 700 }}>↓</div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                    <div style={{ padding: '14px', borderRadius: '14px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}>
                      <div style={{ color: '#c7d2fe', fontSize: '0.7rem', marginBottom: '6px' }}>Category</div>
                      <div style={{ fontWeight: 700 }}>Billing</div>
                    </div>
                    <div style={{ padding: '14px', borderRadius: '14px', background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)' }}>
                      <div style={{ color: '#a5f3fc', fontSize: '0.7rem', marginBottom: '6px' }}>Priority</div>
                      <div style={{ fontWeight: 700 }}>High</div>
                    </div>
                    <div style={{ padding: '14px', borderRadius: '14px', background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)' }}>
                      <div style={{ color: '#e9d5ff', fontSize: '0.7rem', marginBottom: '6px' }}>Sentiment</div>
                      <div style={{ fontWeight: 700 }}>Frustrated</div>
                    </div>
                    <div style={{ padding: '14px', borderRadius: '14px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
                      <div style={{ color: '#bbf7d0', fontSize: '0.7rem', marginBottom: '6px' }}>Summary</div>
                      <div style={{ fontWeight: 700 }}>Duplicate payment issue</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '80px 0 30px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.8rem', fontWeight: 700, marginBottom: '10px' }}>Why ResolveAI</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800 }}>Built for faster, smarter resolution.</h2>
          </div>

          <div className="resolve-ai-trust-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '18px' }}>
            {trustPoints.map((point) => (
              <div key={point} className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 22px', borderRadius: '18px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(16,185,129,0.12)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.25)' }}>
                  <CheckCircle2 size={18} />
                </div>
                <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{point}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: '80px 0 20px' }}>
          <div className="glass-panel" style={{ padding: '34px 26px', borderRadius: '26px', textAlign: 'center' }}>
            <div style={{ color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px' }}>Ready to resolve smarter?</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '12px' }}>Turn each complaint into a smarter next step.</h2>
            <p style={{ maxWidth: '660px', margin: '0 auto 22px', color: '#cbd5e1', lineHeight: 1.8 }}>
              ResolveAI gives your support team the context, visibility, and AI guidance needed to move from reactive support to confident, proactive resolution.
            </p>
            <div className="resolve-ai-cta-row" style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/register')} className="btn btn-primary" style={{ padding: '14px 22px', fontSize: '0.96rem' }}>
                Get Started
              </button>
              <button onClick={() => navigate('/login')} className="btn btn-secondary" style={{ padding: '14px 22px', fontSize: '0.96rem' }}>
                Login
              </button>
            </div>
          </div>
        </section>
      </div>

      <footer style={{ borderTop: '1px solid rgba(148, 163, 184, 0.12)', background: 'rgba(15, 23, 42, 0.7)', padding: '26px 0 40px' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>ResolveAI</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Every Complaint. Smarter Resolution</div>
            </div>
          </div>

          <div className="resolve-ai-footer-links" style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', color: '#cbd5e1', fontSize: '0.9rem', justifyContent: 'center' }}>
            <button onClick={() => navigate('/')} style={{ color: '#cbd5e1' }}>Home</button>
            <button onClick={() => navigate('/login')} style={{ color: '#cbd5e1' }}>Login</button>
            <button onClick={() => navigate('/register')} style={{ color: '#cbd5e1' }}>Sign Up</button>
          </div>
        </div>

        <div className="container" style={{ maxWidth: '1200px', margin: '26px auto 0', padding: '20px 20px 0', borderTop: '1px solid rgba(148, 163, 184, 0.1)', textAlign: 'center' }}>
          <div className="resolve-ai-footer-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', color: '#64748b', fontSize: '0.85rem' }}>
            <div>Developed by <span style={{ fontWeight: 700, color: '#cbd5e1' }}>AEIMAN FAYYAZ</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
};
