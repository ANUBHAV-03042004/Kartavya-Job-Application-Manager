// import React, { useState, useEffect } from 'react';
// import JobApplicationForm from './JobApplicationForm';
// import JobApplicationList from './JobApplicationList';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://kartavya-job-application-manager.onrender.com';

// const Dashboard = ({ user, token, onLogout }) => {
//   const [applications, setApplications] = useState([]);
//   const [selectedApplication, setSelectedApplication] = useState(null);
//   const [error, setError] = useState('');
//   const [showForm, setShowForm] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const authHeaders = {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${token}`,
//   };

//   const fetchApplications = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${API_BASE_URL}/api/job-applications`, {
//         headers: authHeaders,
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);
//       setApplications(data);
//     } catch (err) {
//       setError('Failed to fetch applications');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchApplications();
//   }, []);

//   const handleSubmit = async (formData) => {
//     if (!formData) {
//       setSelectedApplication(null);
//       setShowForm(false);
//       return;
//     }
//     try {
//       if (selectedApplication) {
//         const res = await fetch(`${API_BASE_URL}/api/job-applications/${formData.id}`, {
//           method: 'PUT',
//           headers: authHeaders,
//           body: JSON.stringify(formData),
//         });
//         if (!res.ok) throw new Error('Failed to update');
//       } else {
//         const res = await fetch(`${API_BASE_URL}/api/job-applications`, {
//           method: 'POST',
//           headers: authHeaders,
//           body: JSON.stringify(formData),
//         });
//         if (!res.ok) throw new Error('Failed to create');
//       }
//       setSelectedApplication(null);
//       setShowForm(false);
//       fetchApplications();
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleEdit = (app) => {
//     setSelectedApplication(app);
//     setShowForm(true);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleDelete = async (id) => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/job-applications/${id}`, {
//         method: 'DELETE',
//         headers: authHeaders,
//       });
//       if (!res.ok) throw new Error('Failed to delete');
//       fetchApplications();
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const stats = {
//     total: applications.length,
//     applied: applications.filter(a => a.status === 'Applied').length,
//     interview: applications.filter(a => a.status === 'Interview').length,
//     offer: applications.filter(a => a.status === 'Offer').length,
//     rejected: applications.filter(a => a.status === 'Rejected').length,
//   };

//   return (
//     <div className="dashboard">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <div className="sidebar-brand">
//           <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
//             <rect width="32" height="32" rx="8" fill="url(#grad2)" />
//             <path d="M8 20l4-8 4 6 3-4 5 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
//             <defs>
//               <linearGradient id="grad2" x1="0" y1="0" x2="32" y2="32">
//                 <stop offset="0%" stopColor="#f59e0b" />
//                 <stop offset="100%" stopColor="#d97706" />
//               </linearGradient>
//             </defs>
//           </svg>
//           <span>JobTrackr</span>
//         </div>

//         <div className="sidebar-user">
//           <div className="sidebar-avatar">
//             {user.name.charAt(0).toUpperCase()}
//           </div>
//           <div>
//             <div className="sidebar-user-name">{user.name}</div>
//             <div className="sidebar-user-email">{user.email}</div>
//           </div>
//         </div>

//         <nav className="sidebar-nav">
//           <div className="sidebar-nav-item active">
//             <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//               <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//             </svg>
//             Dashboard
//           </div>
//         </nav>

//         <div className="sidebar-stats">
//           <div className="stat-chip">
//             <span className="stat-dot applied" />
//             <span>{stats.applied} Applied</span>
//           </div>
//           <div className="stat-chip">
//             <span className="stat-dot interview" />
//             <span>{stats.interview} Interview</span>
//           </div>
//           <div className="stat-chip">
//             <span className="stat-dot offer" />
//             <span>{stats.offer} Offer</span>
//           </div>
//           <div className="stat-chip">
//             <span className="stat-dot rejected" />
//             <span>{stats.rejected} Rejected</span>
//           </div>
//         </div>

//         <button className="sidebar-logout" onClick={onLogout}>
//           <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//             <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//           </svg>
//           Sign Out
//         </button>
//       </aside>

//       {/* Main Content */}
//       <main className="main-content">
//         <header className="main-header">
//           <div>
//             <h1 className="main-title">My Applications</h1>
//             <p className="main-subtitle">
//               {stats.total} total · {stats.interview} in interview · {stats.offer} offer{stats.offer !== 1 ? 's' : ''}
//             </p>
//           </div>
//           <button
//             className="btn-add"
//             onClick={() => { setSelectedApplication(null); setShowForm(!showForm); }}
//           >
//             {showForm ? '✕ Cancel' : '+ New Application'}
//           </button>
//         </header>

//         {error && (
//           <div className="error-banner">
//             {error}
//             <button onClick={() => setError('')}>✕</button>
//           </div>
//         )}

//         {showForm && (
//           <div className="form-section">
//             <JobApplicationForm
//               onSubmit={handleSubmit}
//               selectedApplication={selectedApplication}
//             />
//           </div>
//         )}

//         <JobApplicationList
//           applications={applications}
//           loading={loading}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//         />
//       </main>
//     </div>
//   );
// };

// export default Dashboard;






// import React, { useState, useEffect } from 'react';
// import JobApplicationForm from './JobApplicationForm';
// import JobApplicationList from './JobApplicationList';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://kartavya-job-application-manager.onrender.com';

// const Dashboard = ({ user, token, onLogout }) => {
//   const [applications, setApplications] = useState([]);
//   const [selectedApplication, setSelectedApplication] = useState(null);
//   const [fetchError, setFetchError] = useState('');   // shown inside the list area only
//   const [actionError, setActionError] = useState(''); // shown as dismissible banner (create/edit/delete)
//   const [showForm, setShowForm] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const authHeaders = {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${token}`,
//   };

//   const fetchApplications = async () => {
//     try {
//       setLoading(true);
//       setFetchError('');
//       const res = await fetch(`${API_BASE_URL}/api/job-applications`, {
//         headers: authHeaders,
//       });
//       const data = await res.json();
//       if (!res.ok) {
//         // Server error — show inside list area, NOT as a scary full banner
//         setFetchError(data.message || `Server error (${res.status}) — try refreshing.`);
//         return;
//       }
//       setApplications(data); // could be [] — that's fine, shows empty state
//     } catch {
//       setFetchError('Could not reach the server. Check your connection.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchApplications();
//   }, []);

//   const handleSubmit = async (formData) => {
//     if (!formData) {
//       setSelectedApplication(null);
//       setShowForm(false);
//       return;
//     }
//     setActionError('');
//     try {
//       if (selectedApplication) {
//         const res = await fetch(`${API_BASE_URL}/api/job-applications/${formData.id}`, {
//           method: 'PUT',
//           headers: authHeaders,
//           body: JSON.stringify(formData),
//         });
//         if (!res.ok) {
//           const body = await res.json();
//           throw new Error(body.message || 'Failed to update application');
//         }
//       } else {
//         const res = await fetch(`${API_BASE_URL}/api/job-applications`, {
//           method: 'POST',
//           headers: authHeaders,
//           body: JSON.stringify(formData),
//         });
//         if (!res.ok) {
//           const body = await res.json();
//           throw new Error(body.message || 'Failed to create application');
//         }
//       }
//       setSelectedApplication(null);
//       setShowForm(false);
//       fetchApplications();
//     } catch (err) {
//       setActionError(err.message);
//     }
//   };

//   const handleEdit = (app) => {
//     setSelectedApplication(app);
//     setShowForm(true);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleDelete = async (id) => {
//     setActionError('');
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/job-applications/${id}`, {
//         method: 'DELETE',
//         headers: authHeaders,
//       });
//       if (!res.ok) throw new Error('Failed to delete application');
//       fetchApplications();
//     } catch (err) {
//       setActionError(err.message);
//     }
//   };

//   const stats = {
//     total: applications.length,
//     applied: applications.filter(a => a.status === 'Applied').length,
//     interview: applications.filter(a => a.status === 'Interview').length,
//     offer: applications.filter(a => a.status === 'Offer').length,
//     rejected: applications.filter(a => a.status === 'Rejected').length,
//   };

//   return (
//     <div className="dashboard">
//       <aside className="sidebar">
//         <div className="sidebar-brand">
//           <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
//             <rect width="32" height="32" rx="8" fill="url(#grad2)" />
//             <path d="M8 20l4-8 4 6 3-4 5 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
//             <defs>
//               <linearGradient id="grad2" x1="0" y1="0" x2="32" y2="32">
//                 <stop offset="0%" stopColor="#f59e0b" />
//                 <stop offset="100%" stopColor="#d97706" />
//               </linearGradient>
//             </defs>
//           </svg>
//           <span>JobTrackr</span>
//         </div>

//         <div className="sidebar-user">
//           <div className="sidebar-avatar">{user.name.charAt(0).toUpperCase()}</div>
//           <div>
//             <div className="sidebar-user-name">{user.name}</div>
//             <div className="sidebar-user-email">{user.email}</div>
//           </div>
//         </div>

//         <nav className="sidebar-nav">
//           <div className="sidebar-nav-item active">
//             <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//               <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//             </svg>
//             Dashboard
//           </div>
//         </nav>

//         <div className="sidebar-stats">
//           <div className="stat-chip"><span className="stat-dot applied" /><span>{stats.applied} Applied</span></div>
//           <div className="stat-chip"><span className="stat-dot interview" /><span>{stats.interview} Interview</span></div>
//           <div className="stat-chip"><span className="stat-dot offer" /><span>{stats.offer} Offer</span></div>
//           <div className="stat-chip"><span className="stat-dot rejected" /><span>{stats.rejected} Rejected</span></div>
//         </div>

//         <button className="sidebar-logout" onClick={onLogout}>
//           <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//             <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//           </svg>
//           Sign Out
//         </button>
//       </aside>

//       <main className="main-content">
//         <header className="main-header">
//           <div>
//             <h1 className="main-title">My Applications</h1>
//             <p className="main-subtitle">
//               {stats.total} total · {stats.interview} in interview · {stats.offer} offer{stats.offer !== 1 ? 's' : ''}
//             </p>
//           </div>
//           <button
//             className="btn-add"
//             onClick={() => { setSelectedApplication(null); setShowForm(!showForm); }}
//           >
//             {showForm ? '✕ Cancel' : '+ New Application'}
//           </button>
//         </header>

//         {/* Only fires for create / edit / delete failures — never for "list is empty" */}
//         {actionError && (
//           <div className="error-banner">
//             ⚠️ {actionError}
//             <button onClick={() => setActionError('')}>✕</button>
//           </div>
//         )}

//         {showForm && (
//           <div className="form-section">
//             <JobApplicationForm
//               onSubmit={handleSubmit}
//               selectedApplication={selectedApplication}
//             />
//           </div>
//         )}

//         <JobApplicationList
//           applications={applications}
//           loading={loading}
//           fetchError={fetchError}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//           onRetry={fetchApplications}
//         />
//       </main>
//     </div>
//   );
// };

// export default Dashboard;





import React, { useState, useEffect } from 'react';
import JobApplicationForm from './JobApplicationForm';
import JobApplicationList from './JobApplicationList';
import Analytics          from './Analytics';
import Settings           from './Settings';

const API = import.meta.env.VITE_API_BASE_URL || 'https://kartavya-job-application-manager.onrender.com';

export default function Dashboard({ user, token, onLogout, onUserUpdate }) {
  const [view,        setView]        = useState('apps'); // apps | analytics | settings
  const [apps,        setApps]        = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [editing,     setEditing]     = useState(null);   // app being edited
  const [showForm,    setShowForm]    = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const headers = {
    'Content-Type': 'application/json',
    Authorization:  `Bearer ${token}`,
  };

  const fetchApps = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/job-applications`, { headers });
      if (res.status === 401) { onLogout(); return; }
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setApps(data);
    } catch (e) {
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApps(); }, []);

  const handleEdit = (app) => {
    setEditing(app);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormClose = () => {
    setEditing(null);
    setShowForm(false);
  };

  const stats = {
    total:     apps.length,
    applied:   apps.filter(a => a.status === 'Applied').length,
    interview: apps.filter(a => a.status === 'Interview').length,
    offer:     apps.filter(a => a.status === 'Offer').length,
    rejected:  apps.filter(a => a.status === 'Rejected').length,
  };

  const navItems = [
    { id: 'apps',      label: 'Applications', Icon: GridIcon    },
    { id: 'analytics', label: 'Analytics',    Icon: ChartIcon   },
    { id: 'settings',  label: 'Settings',     Icon: SettingsIcon },
  ];

  return (
    <div className="dash">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sb-brand">
          <div className="brand-icon small">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <span>JobTrackr</span>
        </div>

        <div className="sb-user">
          <div className="sb-avatar">{user.name[0].toUpperCase()}</div>
          <div>
            <div className="sb-name">{user.name}</div>
            <div className="sb-email">{user.email}</div>
          </div>
        </div>

        <nav className="sb-nav">
          {navItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`sb-item ${view === id ? 'active' : ''}`}
              onClick={() => { setView(id); setSidebarOpen(false); }}
            >
              <Icon /> {label}
            </button>
          ))}
        </nav>

        <div className="sb-stats">
          <div className="sb-stats-title">Overview</div>
          {[
            { label: 'Applied',   val: stats.applied,   cls: 'c-blue'   },
            { label: 'Interview', val: stats.interview, cls: 'c-yellow' },
            { label: 'Offer',     val: stats.offer,     cls: 'c-mint'   },
            { label: 'Rejected',  val: stats.rejected,  cls: 'c-pink'   },
          ].map(s => (
            <div key={s.label} className="sb-stat">
              <span className={`sb-dot ${s.cls}`} />
              <span>{s.label}</span>
              <span className="sb-stat-val">{s.val}</span>
            </div>
          ))}
        </div>

        <button className="sb-logout" onClick={onLogout}>
          <LogoutIcon /> Sign Out
        </button>
      </aside>

      {/* ── Main ────────────────────────────────────────────── */}
      <div className="dash-main">
        {/* Mobile topbar */}
        <div className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}><MenuIcon /></button>
          <span className="topbar-title">{navItems.find(n => n.id === view)?.label}</span>
          <div className="topbar-avatar">{user.name[0].toUpperCase()}</div>
        </div>

        {error && (
          <div className="banner error">
            {error} <button onClick={() => setError('')}>✕</button>
          </div>
        )}

        <div className="view-content">
          {view === 'apps' && (
            <div>
              {/* Header */}
              <div className="view-header">
                <div>
                  <h1 className="view-title">Applications</h1>
                  <p className="view-sub">
                    {stats.total} tracked · {stats.interview} in interview · {stats.offer} offer{stats.offer !== 1 ? 's' : ''}
                  </p>
                </div>
                <button className="btn-primary" onClick={() => { setEditing(null); setShowForm(s => !s); }}>
                  {showForm ? '✕ Close' : '+ New Application'}
                </button>
              </div>

              {/* Form */}
              {showForm && (
                <div style={{ marginBottom: 24 }}>
                  <JobApplicationForm
                    token={token}
                    selectedApplication={editing}
                    onCancel={handleFormClose}
                    onSaved={() => { handleFormClose(); fetchApps(); }}
                  />
                </div>
              )}

              {/* List */}
              <JobApplicationList
                apps={apps}
                loading={loading}
                token={token}
                onEdit={handleEdit}
                onRefresh={fetchApps}
                onError={setError}
              />
            </div>
          )}

          {view === 'analytics' && <Analytics apps={apps} />}

          {view === 'settings' && (
            <Settings
              user={user}
              token={token}
              onLogout={onLogout}
              onUserUpdate={onUserUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────────────
const GridIcon = () => (
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
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);