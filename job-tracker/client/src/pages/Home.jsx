import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Briefcase, Building2, Users, CalendarDays, Search,
  ArrowRight, CheckCircle, LayoutDashboard, Chrome, Bell
} from 'lucide-react';


export function Home() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const features = [
    {
      icon: Building2,
      color: '#2563eb',
      bg: '#eff6ff',
      title: 'Company Tracking',
      desc: 'Organise every company you are targeting in one place. Add notes, websites and track all your applications per company.',
    },
    {
      icon: Users,
      color: '#7c3aed',
      bg: '#f5f3ff',
      title: 'People & Networking',
      desc: 'Log recruiters and employees you connect with. Track every conversation with a built-in note feed per contact.',
    },
    {
      icon: CalendarDays,
      color: '#0891b2',
      bg: '#ecfeff',
      title: 'Follow-up Calendar',
      desc: 'Never miss a follow-up. Schedule reminders per contact and see upcoming, overdue and completed tasks on a visual calendar.',
    },
    {
      icon: Search,
      color: '#059669',
      bg: '#f0fdf4',
      title: 'Global Search',
      desc: 'Find any company, job or person instantly. One search bar across your entire job search data.',
    },
    {
      icon: Chrome,
      color: '#d97706',
      bg: '#fffbeb',
      title: 'Browser Extension',
      desc: 'Add jobs and people without leaving the page. The sidebar extension auto-fills the current URL and detects existing contacts.',
    },
    {
      icon: Bell,
      color: '#dc2626',
      bg: '#fef2f2',
      title: 'Activity Timeline',
      desc: 'See a live feed of everything you have done — applications sent, people added, follow-ups completed.',
    },
  ];

  const steps = [
    { n: '01', title: 'Add a Company', desc: 'Create a folder for each company you are targeting.' },
    { n: '02', title: 'Track Applications', desc: 'Log job roles with status, link and applied date.' },
    { n: '03', title: 'Log Your Network', desc: 'Add people you meet — recruiters, referrals, employees.' },
    { n: '04', title: 'Stay on Top', desc: 'Schedule follow-ups and watch your calendar fill with progress.' },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: '#f8fafc', minHeight: '100vh' }}>

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #f1f5f9',
        padding: '0 clamp(16px, 5vw, 80px)',
        height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '17px', color: '#0f172a' }}>
          <div style={{ width: 32, height: 32, background: '#2563eb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={16} color="white" />
          </div>
          Reachlist
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isLoggedIn ? (
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 18px', background: '#2563eb', color: 'white',
                border: 'none', borderRadius: '8px', fontWeight: 700,
                fontSize: '13px', cursor: 'pointer',
              }}
            >
              <LayoutDashboard size={14} /> Dashboard
            </button>
          ) : (
            <>
              <Link to="/login" style={{
                padding: '8px 16px', color: '#475569', fontWeight: 600,
                fontSize: '13px', textDecoration: 'none', borderRadius: '8px',
              }}>
                Sign In
              </Link>
              <Link to="/register" style={{
                padding: '8px 18px', background: '#2563eb', color: 'white',
                fontWeight: 700, fontSize: '13px', textDecoration: 'none',
                borderRadius: '8px',
              }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section style={{
        padding: 'clamp(60px, 10vw, 120px) clamp(16px, 5vw, 80px) clamp(40px, 6vw, 80px)',
        maxWidth: '900px', margin: '0 auto', textAlign: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe',
          borderRadius: '20px', padding: '5px 14px', fontSize: '12px', fontWeight: 700,
          marginBottom: '28px', letterSpacing: '0.03em',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2563eb', display: 'inline-block' }} />
          JOB SEARCH TRACKER
        </div>

        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 68px)',
          fontWeight: 900, lineHeight: 1.1,
          color: '#0f172a', margin: '0 0 24px',
          letterSpacing: '-0.03em',
        }}>
          Your entire job search,<br />
          <span style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            organised in one place.
          </span>
        </h1>

        <p style={{
          fontSize: 'clamp(15px, 2vw, 18px)', color: '#64748b',
          lineHeight: 1.7, maxWidth: '580px', margin: '0 auto 40px',
        }}>
          Track companies, applications, contacts and follow-ups without juggling spreadsheets.
          Built for serious job seekers who want clarity over chaos.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {isLoggedIn ? (
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 32px', background: '#2563eb', color: 'white',
                border: 'none', borderRadius: '10px', fontWeight: 700,
                fontSize: '15px', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(37,99,235,0.35)',
              }}
            >
              Go to Dashboard <ArrowRight size={16} />
            </button>
          ) : (
            <>
              <Link to="/register" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 32px', background: '#2563eb', color: 'white',
                borderRadius: '10px', fontWeight: 700, fontSize: '15px',
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(37,99,235,0.35)',
              }}>
                Start for Free <ArrowRight size={16} />
              </Link>
              <Link to="/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 28px', background: 'white', color: '#334155',
                border: '1.5px solid #e2e8f0', borderRadius: '10px',
                fontWeight: 600, fontSize: '15px', textDecoration: 'none',
              }}>
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Social proof */}
        <div style={{
          marginTop: '48px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '8px', color: '#94a3b8', fontSize: '13px',
        }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{
              width: 28, height: 28, borderRadius: '50%',
              background: ['#dbeafe', '#ede9fe', '#dcfce7'][i],
              border: '2px solid white',
              marginLeft: i > 0 ? '-8px' : 0,
            }} />
          ))}
          <span style={{ marginLeft: '4px' }}>Join job seekers staying organised</span>
        </div>
      </section>

      {/* ── Features grid ──────────────────────────────────────── */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) clamp(16px, 5vw, 80px)', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
            EVERYTHING YOU NEED
          </p>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            Built for the whole job search journey
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {features.map((f, i) => (
            <div
              key={f.title}
              style={{
                background: 'white', borderRadius: '16px',
                border: '1px solid #f1f5f9', padding: '28px',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.5s ease ${0.1 + i * 0.08}s, transform 0.5s ease ${0.1 + i * 0.08}s`,
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: '12px',
                background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <f.icon size={20} color={f.color} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a', margin: '0 0 8px' }}>{f.title}</h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────── */}
      <section style={{
        padding: 'clamp(60px, 8vw, 100px) clamp(16px, 5vw, 80px)',
        background: 'white',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
              HOW IT WORKS
            </p>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
              Simple from day one
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '8px', position: 'relative',
          }}>
            {steps.map((s, i) => (
              <div key={s.n} style={{ padding: '24px 20px', position: 'relative' }}>
                <div style={{
                  fontFamily: 'monospace', fontSize: '11px', fontWeight: 700,
                  color: '#2563eb', letterSpacing: '0.05em', marginBottom: '12px',
                }}>
                  STEP {s.n}
                </div>
                <h3 style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a', margin: '0 0 8px' }}>{s.title}</h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
                {i < steps.length - 1 && (
                  <div style={{
                    position: 'absolute', right: '-4px', top: '28px',
                    color: '#cbd5e1', display: 'none',
                  }}>
                    <ArrowRight size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Extension callout ───────────────────────────────────── */}
      <section style={{ padding: 'clamp(40px, 6vw, 80px) clamp(16px, 5vw, 80px)' }}>
        <div style={{
          maxWidth: '860px', margin: '0 auto',
          background: 'linear-gradient(135deg, #1e40af 0%, #4f46e5 100%)',
          borderRadius: '24px', padding: 'clamp(32px, 5vw, 56px)',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          gap: '32px', justifyContent: 'space-between',
        }}>
          <div style={{ flex: '1', minWidth: '240px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.15)', color: 'white',
              borderRadius: '20px', padding: '4px 12px',
              fontSize: '11px', fontWeight: 700, marginBottom: '16px',
              letterSpacing: '0.05em',
            }}>
              <Chrome size={12} /> CHROME EXTENSION
            </div>
            <h2 style={{ fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 900, color: 'white', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
              Add jobs without leaving the page
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, margin: 0 }}>
              Open the sidebar extension on any job board or LinkedIn profile.
              The current URL is auto-filled. It even detects if that person is already in your system.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
            {[
              '✓ Auto-fills current page URL',
              '✓ Detects existing contacts',
              '✓ Add notes on any profile',
              '✓ Works on any job site',
            ].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: 500 }}>
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────── */}
      <section style={{
        padding: 'clamp(60px, 8vw, 100px) clamp(16px, 5vw, 80px)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', margin: '0 0 16px' }}>
            Ready to get organised?
          </h2>
          <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '36px', lineHeight: 1.65 }}>
            Stop losing track of applications in scattered notes and spreadsheets.
            Start your job search dashboard today — it's free.
          </p>
          {isLoggedIn ? (
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '15px 36px', background: '#2563eb', color: 'white',
                border: 'none', borderRadius: '10px', fontWeight: 700,
                fontSize: '15px', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(37,99,235,0.3)',
              }}
            >
              Open Dashboard <ArrowRight size={16} />
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '15px 36px', background: '#2563eb', color: 'white',
                borderRadius: '10px', fontWeight: 700, fontSize: '15px',
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(37,99,235,0.3)',
              }}>
                Create Free Account <ArrowRight size={16} />
              </Link>
              <Link to="/login" style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '15px 28px', background: 'white', color: '#334155',
                border: '1.5px solid #e2e8f0', borderRadius: '10px',
                fontWeight: 600, fontSize: '15px', textDecoration: 'none',
              }}>
                Sign In
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid #f1f5f9',
        padding: '24px clamp(16px, 5vw, 80px)',
        display: 'flex', flexWrap: 'wrap',
        alignItems: 'center', justifyContent: 'space-between',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '14px', color: '#475569' }}>
          <div style={{ width: 24, height: 24, background: '#2563eb', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={12} color="white" />
          </div>
          Reachlist
        </div>
        <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
          Built to make your job search less chaotic.
        </p>
      </footer>
    </div>
  );
}