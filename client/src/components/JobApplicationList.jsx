// import React from 'react';

// const JobApplicationList = ({ applications, onEdit, onDelete }) => {
//   return (
//     <div className="table-container">
//       <h2>Job Applications</h2>
//       {applications.length === 0 ? (
//         <p>No applications found.</p>
//       ) : (
//         <table>
//           <thead>
//             <tr>
//               <th>Company</th>
//               <th>Job Title</th>
//               <th>Application Date</th>
//               <th>Status</th>
//               <th>Job Link</th>
//               <th>Notes</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {applications.map((app) => (
//               <tr key={app.id}>
//                 <td>{app.companyName}</td>
//                 <td>{app.jobTitle}</td>
//                 <td>{new Date(app.applicationDate).toLocaleDateString()}</td>
//                 <td>{app.status}</td>
//                 <td>
//                   {app.jobLink ? (
//                     <a href={app.jobLink} target="_blank" rel="noopener noreferrer">
//                       Link
//                     </a>
//                   ) : (
//                     '-'
//                   )}
//                 </td>
//                 <td>{app.notes || '-'}</td>
//                 <td id="action">
//                   <button
//                     className="button button-primary"
//                     onClick={() => onEdit(app)}
//                     style={{ marginRight: '10px' }}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="button button-danger"
//                     onClick={() => {
//                       if (window.confirm('Are you sure you want to delete this application?')) {
//                         onDelete(app.id);
//                       }
//                     }}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default JobApplicationList;



// import React, { useState } from 'react';

// const STATUS_CONFIG = {
//   Applied:   { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', icon: '📤' },
//   Interview: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', icon: '🎯' },
//   Offer:     { color: '#10b981', bg: 'rgba(16,185,129,0.15)', icon: '🎉' },
//   Rejected:  { color: '#ef4444', bg: 'rgba(239,68,68,0.15)',  icon: '✖️' },
// };

// const JobApplicationList = ({ applications, loading, onEdit, onDelete }) => {
//   const [filter, setFilter] = useState('All');
//   const [search, setSearch] = useState('');
//   const [activeCard, setActiveCard] = useState(null);

//   const filtered = applications.filter(app => {
//     const matchFilter = filter === 'All' || app.status === filter;
//     const matchSearch = !search ||
//       app.companyName.toLowerCase().includes(search.toLowerCase()) ||
//       app.jobTitle.toLowerCase().includes(search.toLowerCase());
//     return matchFilter && matchSearch;
//   });

//   const filters = ['All', 'Applied', 'Interview', 'Offer', 'Rejected'];

//   if (loading) {
//     return (
//       <div className="list-loading">
//         {[1,2,3].map(i => <div key={i} className="skeleton-card" />)}
//       </div>
//     );
//   }

//   return (
//     <div className="list-section">
//       {/* Toolbar */}
//       <div className="list-toolbar">
//         <div className="search-box">
//           <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//             <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
//           </svg>
//           <input
//             type="text"
//             placeholder="Search company or title..."
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//           />
//           {search && <button onClick={() => setSearch('')} className="search-clear">✕</button>}
//         </div>

//         <div className="filter-pills">
//           {filters.map(f => (
//             <button
//               key={f}
//               className={`filter-pill ${filter === f ? 'active' : ''}`}
//               onClick={() => setFilter(f)}
//               style={filter === f && f !== 'All' ? {
//                 '--pill-color': STATUS_CONFIG[f]?.color,
//                 '--pill-bg': STATUS_CONFIG[f]?.bg,
//               } : {}}
//             >
//               {f !== 'All' && <span className="pill-dot" style={{ background: STATUS_CONFIG[f]?.color }} />}
//               {f}
//               <span className="pill-count">
//                 {f === 'All' ? applications.length : applications.filter(a => a.status === f).length}
//               </span>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Applications */}
//       {filtered.length === 0 ? (
//         <div className="list-empty">
//           <div className="empty-icon">🔍</div>
//           <p>{applications.length === 0 ? 'No applications yet. Add your first one!' : 'No results found.'}</p>
//         </div>
//       ) : (
//         <div className="app-grid">
//           {filtered.map((app, idx) => {
//             const conf = STATUS_CONFIG[app.status] || STATUS_CONFIG.Applied;
//             const isActive = activeCard === app.id;
//             return (
//               <div
//                 key={app.id}
//                 className={`app-card ${isActive ? 'expanded' : ''}`}
//                 style={{ animationDelay: `${idx * 40}ms` }}
//                 onClick={() => setActiveCard(isActive ? null : app.id)}
//               >
//                 <div className="app-card-top">
//                   <div className="app-card-meta">
//                     <div className="company-logo">
//                       {app.companyName.charAt(0).toUpperCase()}
//                     </div>
//                     <div>
//                       <div className="company-name">{app.companyName}</div>
//                       <div className="job-title">{app.jobTitle}</div>
//                     </div>
//                   </div>
//                   <span
//                     className="status-badge"
//                     style={{ color: conf.color, background: conf.bg }}
//                   >
//                     {conf.icon} {app.status}
//                   </span>
//                 </div>

//                 <div className="app-card-date">
//                   <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                     <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
//                     <line x1="16" y1="2" x2="16" y2="6" />
//                     <line x1="8" y1="2" x2="8" y2="6" />
//                     <line x1="3" y1="10" x2="21" y2="10" />
//                   </svg>
//                   {new Date(app.applicationDate).toLocaleDateString('en-US', {
//                     month: 'short', day: 'numeric', year: 'numeric'
//                   })}
//                   {app.jobLink && (
//                     <a
//                       href={app.jobLink}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="app-link"
//                       onClick={e => e.stopPropagation()}
//                     >
//                       ↗ View Job
//                     </a>
//                   )}
//                 </div>

//                 {isActive && app.notes && (
//                   <div className="app-card-notes">
//                     <p>{app.notes}</p>
//                   </div>
//                 )}

//                 <div className="app-card-actions" onClick={e => e.stopPropagation()}>
//                   <button className="action-btn edit" onClick={() => onEdit(app)}>
//                     <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                       <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
//                       <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
//                     </svg>
//                     Edit
//                   </button>
//                   <button
//                     className="action-btn delete"
//                     onClick={() => {
//                       if (window.confirm('Delete this application?')) onDelete(app.id);
//                     }}
//                   >
//                     <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                       <polyline points="3 6 5 6 21 6" />
//                       <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
//                       <path d="M10 11v6M14 11v6" />
//                     </svg>
//                     Delete
//                   </button>
//                 </div>

//                 <div className="card-expand-hint">
//                   {isActive ? '▲ Less' : '▼ More'}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default JobApplicationList;.






// import React from 'react';

// const JobApplicationList = ({ applications, onEdit, onDelete }) => {
//   return (
//     <div className="table-container">
//       <h2>Job Applications</h2>
//       {applications.length === 0 ? (
//         <p>No applications found.</p>
//       ) : (
//         <table>
//           <thead>
//             <tr>
//               <th>Company</th>
//               <th>Job Title</th>
//               <th>Application Date</th>
//               <th>Status</th>
//               <th>Job Link</th>
//               <th>Notes</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {applications.map((app) => (
//               <tr key={app.id}>
//                 <td>{app.companyName}</td>
//                 <td>{app.jobTitle}</td>
//                 <td>{new Date(app.applicationDate).toLocaleDateString()}</td>
//                 <td>{app.status}</td>
//                 <td>
//                   {app.jobLink ? (
//                     <a href={app.jobLink} target="_blank" rel="noopener noreferrer">
//                       Link
//                     </a>
//                   ) : (
//                     '-'
//                   )}
//                 </td>
//                 <td>{app.notes || '-'}</td>
//                 <td id="action">
//                   <button
//                     className="button button-primary"
//                     onClick={() => onEdit(app)}
//                     style={{ marginRight: '10px' }}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="button button-danger"
//                     onClick={() => {
//                       if (window.confirm('Are you sure you want to delete this application?')) {
//                         onDelete(app.id);
//                       }
//                     }}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default JobApplicationList;



// import React, { useState } from 'react';

// const STATUS_CONFIG = {
//   Applied:   { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', icon: '📤' },
//   Interview: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', icon: '🎯' },
//   Offer:     { color: '#10b981', bg: 'rgba(16,185,129,0.15)', icon: '🎉' },
//   Rejected:  { color: '#ef4444', bg: 'rgba(239,68,68,0.15)',  icon: '✖️' },
// };

// const JobApplicationList = ({ applications, loading, onEdit, onDelete }) => {
//   const [filter, setFilter] = useState('All');
//   const [search, setSearch] = useState('');
//   const [activeCard, setActiveCard] = useState(null);

//   const filtered = applications.filter(app => {
//     const matchFilter = filter === 'All' || app.status === filter;
//     const matchSearch = !search ||
//       app.companyName.toLowerCase().includes(search.toLowerCase()) ||
//       app.jobTitle.toLowerCase().includes(search.toLowerCase());
//     return matchFilter && matchSearch;
//   });

//   const filters = ['All', 'Applied', 'Interview', 'Offer', 'Rejected'];

//   if (loading) {
//     return (
//       <div className="list-loading">
//         {[1,2,3].map(i => <div key={i} className="skeleton-card" />)}
//       </div>
//     );
//   }

//   return (
//     <div className="list-section">
//       {/* Toolbar */}
//       <div className="list-toolbar">
//         <div className="search-box">
//           <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//             <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
//           </svg>
//           <input
//             type="text"
//             placeholder="Search company or title..."
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//           />
//           {search && <button onClick={() => setSearch('')} className="search-clear">✕</button>}
//         </div>

//         <div className="filter-pills">
//           {filters.map(f => (
//             <button
//               key={f}
//               className={`filter-pill ${filter === f ? 'active' : ''}`}
//               onClick={() => setFilter(f)}
//               style={filter === f && f !== 'All' ? {
//                 '--pill-color': STATUS_CONFIG[f]?.color,
//                 '--pill-bg': STATUS_CONFIG[f]?.bg,
//               } : {}}
//             >
//               {f !== 'All' && <span className="pill-dot" style={{ background: STATUS_CONFIG[f]?.color }} />}
//               {f}
//               <span className="pill-count">
//                 {f === 'All' ? applications.length : applications.filter(a => a.status === f).length}
//               </span>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Applications */}
//       {filtered.length === 0 ? (
//         <div className="list-empty">
//           <div className="empty-icon">🔍</div>
//           <p>{applications.length === 0 ? 'No applications yet. Add your first one!' : 'No results found.'}</p>
//         </div>
//       ) : (
//         <div className="app-grid">
//           {filtered.map((app, idx) => {
//             const conf = STATUS_CONFIG[app.status] || STATUS_CONFIG.Applied;
//             const isActive = activeCard === app.id;
//             return (
//               <div
//                 key={app.id}
//                 className={`app-card ${isActive ? 'expanded' : ''}`}
//                 style={{ animationDelay: `${idx * 40}ms` }}
//                 onClick={() => setActiveCard(isActive ? null : app.id)}
//               >
//                 <div className="app-card-top">
//                   <div className="app-card-meta">
//                     <div className="company-logo">
//                       {app.companyName.charAt(0).toUpperCase()}
//                     </div>
//                     <div>
//                       <div className="company-name">{app.companyName}</div>
//                       <div className="job-title">{app.jobTitle}</div>
//                     </div>
//                   </div>
//                   <span
//                     className="status-badge"
//                     style={{ color: conf.color, background: conf.bg }}
//                   >
//                     {conf.icon} {app.status}
//                   </span>
//                 </div>

//                 <div className="app-card-date">
//                   <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                     <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
//                     <line x1="16" y1="2" x2="16" y2="6" />
//                     <line x1="8" y1="2" x2="8" y2="6" />
//                     <line x1="3" y1="10" x2="21" y2="10" />
//                   </svg>
//                   {new Date(app.applicationDate).toLocaleDateString('en-US', {
//                     month: 'short', day: 'numeric', year: 'numeric'
//                   })}
//                   {app.jobLink && (
//                     <a
//                       href={app.jobLink}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="app-link"
//                       onClick={e => e.stopPropagation()}
//                     >
//                       ↗ View Job
//                     </a>
//                   )}
//                 </div>

//                 {isActive && app.notes && (
//                   <div className="app-card-notes">
//                     <p>{app.notes}</p>
//                   </div>
//                 )}

//                 <div className="app-card-actions" onClick={e => e.stopPropagation()}>
//                   <button className="action-btn edit" onClick={() => onEdit(app)}>
//                     <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                       <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
//                       <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
//                     </svg>
//                     Edit
//                   </button>
//                   <button
//                     className="action-btn delete"
//                     onClick={() => {
//                       if (window.confirm('Delete this application?')) onDelete(app.id);
//                     }}
//                   >
//                     <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                       <polyline points="3 6 5 6 21 6" />
//                       <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
//                       <path d="M10 11v6M14 11v6" />
//                     </svg>
//                     Delete
//                   </button>
//                 </div>

//                 <div className="card-expand-hint">
//                   {isActive ? '▲ Less' : '▼ More'}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default JobApplicationList;.






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
          <div className="sb-avatar">{user.name[0].toUpperCase()}</div>
          <div>
            <div className="sb-uname">{user.name}</div>
            <div className="sb-uemail">{user.email}</div>
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
          <div className="topbar-av">{user.name[0].toUpperCase()}</div>
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
                apps={apps}
                loading={loading}
                token={token}
                editingId={editing?.id ?? null}   // ← passed down to dim the card
                onEdit={handleEdit}
                onRefresh={fetchApps}
                onError={setError}
              />
            </>
          )}

          {view === 'analytics' && <Analytics apps={apps} />}
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