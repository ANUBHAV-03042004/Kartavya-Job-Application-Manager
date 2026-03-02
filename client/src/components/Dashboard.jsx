import React, { useState, useEffect } from 'react';
import JobApplicationForm from './JobApplicationForm';
import JobApplicationList from './JobApplicationList';
import Analytics          from './Analytics';
import Settings           from './Settings';

const API = import.meta.env.VITE_API_BASE_URL || 'https://kartavya-job-application-manager.onrender.com';

export default function Dashboard({ user, token, onLogout, onUserUpdate }) {
  const [view,        setView]        = useState('apps');
  const [apps,        setApps]        = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [editing,     setEditing]     = useState(null);   // app being edited
  const [showForm,    setShowForm]    = useState(false);  // new-app form visible
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const fetchApps = async () => {
    try {
      setLoading(true);
      const res  = await fetch(`${API}/api/job-applications`, { headers });
      if (res.status === 401) { onLogout(); return; }
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setApps(data);
    } catch (e) { setError('Failed to load applications'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchApps(); }, []);

  // ── Called when user clicks Edit on a card ──────────────────
  // Sets the editing app and shows form; form renders ABOVE the list
  const handleEdit = (app) => {
    setEditing(app);
    setShowForm(false); // close new-app form if open
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormClose = () => {
    setEditing(null);
    setShowForm(false);
  };

  const handleSaved = () => {
    handleFormClose();
    fetchApps();
  };

  // Sort apps so most recently updated/created appears first
  const sortedApps = [...apps].sort((a, b) => {
    const da = new Date(a.updatedAt || a.createdAt || a.applicationDate || 0);
    const db = new Date(b.updatedAt || b.createdAt || b.applicationDate || 0);
    return db - da;
  });

  const stats = {
    total:     apps.length,
    applied:   apps.filter(a => a.status === 'Applied').length,
    interview: apps.filter(a => a.status === 'Interview').length,
    offer:     apps.filter(a => a.status === 'Offer').length,
    rejected:  apps.filter(a => a.status === 'Rejected').length,
  };

  const navItems = [
    { id: 'apps',      label: 'Applications', icon: <AppIcon /> },
    { id: 'analytics', label: 'Analytics',    icon: <ChartIcon /> },
    { id: 'settings',  label: 'Settings',     icon: <SettingsIcon /> },
  ];

  return (
    <div className="dash">
      {sidebarOpen && <div className="sb-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── Sidebar ───────────────────────────────────────── */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sb-brand">
          <img src="/kartavya_logo.png" alt="Kartavya" className="sb-logo" />
          <div>
            <div className="sb-brand-name">KARTAVYA</div>
            <div className="sb-brand-sub">Job Application Manager</div>
          </div>
        </div>

        <div className="sb-user">
          <div className="sb-avatar">{user?.name?.[0]?.toUpperCase() ?? '?'}</div>
          <div>
            <div className="sb-uname">{user?.name ?? ''}</div>
            <div className="sb-uemail">{user?.email ?? ''}</div>
          </div>
        </div>

        <nav className="sb-nav">
          {navItems.map(({ id, label, icon }) => (
            <button
              key={id}
              className={`sb-item ${view === id ? 'active' : ''}`}
              onClick={() => { setView(id); setSidebarOpen(false); }}
            >
              {icon}{label}
            </button>
          ))}
        </nav>

        <div className="sb-stats">
          <div className="sb-stats-ttl">Pipeline</div>
          {[
            { l: 'Applied',   v: stats.applied,   c: 'sky'    },
            { l: 'Interview', v: stats.interview, c: 'banana' },
            { l: 'Offer',     v: stats.offer,     c: 'green'  },
            { l: 'Rejected',  v: stats.rejected,  c: 'terra'  },
          ].map(s => (
            <div key={s.l} className="sb-stat">
              <span className={`sdot ${s.c}`} />{s.l}
              <span className="sval">{s.v}</span>
            </div>
          ))}
        </div>

        <button className="sb-logout" onClick={onLogout}>
          <LogoutIcon /> Sign Out
        </button>
      </aside>

      {/* ── Main ──────────────────────────────────────────── */}
      <div className="dash-main">
        {/* Mobile topbar */}
        <div className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}><MenuIcon /></button>
          <div className="topbar-brand">
            <img src="/kartavya_logo.png" alt="" className="topbar-logo" />
            <span>KARTAVYA</span>
          </div>
          <div className="topbar-av">{user?.name?.[0]?.toUpperCase() ?? '?'}</div>
        </div>

        {error && (
          <div className="err-banner">
            {error}
            <button onClick={() => setError('')}>✕</button>
          </div>
        )}

        <div className="view-wrap">

          {/* ── Applications view ───────────────────────── */}
          {view === 'apps' && (
            <>
              {/* Header row */}
              <div className="view-header">
                <div>
                  <h1 className="view-title">My Applications</h1>
                  <p className="view-sub">
                    {stats.total} total · {stats.interview} in interview · {stats.offer} offer{stats.offer !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setEditing(null);          // clear any edit
                    setShowForm(s => !s);
                  }}
                >
                  {showForm ? '✕ Close' : '+ New Application'}
                </button>
              </div>

              {/* ── NEW APPLICATION form — always above list ── */}
              {showForm && !editing && (
                <div style={{ marginBottom: 24 }}>
                  <JobApplicationForm
                    token={token}
                    selectedApplication={null}
                    onCancel={handleFormClose}
                    onSaved={handleSaved}
                  />
                </div>
              )}

              {/* ── EDIT form — always above list ── */}
              {editing && (
                <div style={{ marginBottom: 24 }}>
                  {/* Banner so user knows which card they're editing */}
                  <div className="edit-banner">
                    ✏️ Editing <strong>{editing.companyName} — {editing.jobTitle}</strong>
                    <button onClick={handleFormClose}>✕ Cancel</button>
                  </div>
                  <JobApplicationForm
                    token={token}
                    selectedApplication={editing}
                    onCancel={handleFormClose}
                    onSaved={handleSaved}
                  />
                </div>
              )}

              {/* ── Application list — editing card is dimmed ── */}
              <JobApplicationList
                apps={sortedApps}
                loading={loading}
                token={token}
                editingId={editing?.id ?? null}
                onEdit={handleEdit}
                onRefresh={fetchApps}
                onError={setError}
              />
            </>
          )}

          {view === 'analytics' && <Analytics apps={sortedApps} />}
          {view === 'settings'  && (
            <Settings
              user={user} token={token}
              onLogout={onLogout} onUserUpdate={onUserUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Icons ─────────────────────────────────────────────────────── */
const AppIcon = () => (
  <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const ChartIcon = () => (
  <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);
const SettingsIcon = () => (
  <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);
const LogoutIcon = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);