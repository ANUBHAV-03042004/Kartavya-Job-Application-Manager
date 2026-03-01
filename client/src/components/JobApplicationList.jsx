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








import React, { useState } from 'react';

const API = import.meta.env.VITE_API_BASE_URL || 'https://kartavya-job-application-manager.onrender.com';

const STATUS = {
  Applied:   { color: '#00bbf9', bg: 'rgba(0,187,249,0.12)',   emoji: '📤' },
  Interview: { color: '#fee440', bg: 'rgba(254,228,64,0.12)',  emoji: '🎯' },
  Offer:     { color: '#00f5d4', bg: 'rgba(0,245,212,0.12)',   emoji: '🎉' },
  Rejected:  { color: '#f15bb5', bg: 'rgba(241,91,181,0.12)', emoji: '✖'  },
};

function AppCard({ app, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const conf = STATUS[app.status] || STATUS.Applied;

  return (
    <div className={`app-card ${expanded ? 'expanded' : ''}`} onClick={() => setExpanded(e => !e)}>
      <div className="ac-top">
        <div className="ac-left">
          <div className="ac-logo" style={{ color: conf.color }}>
            {app.companyName[0].toUpperCase()}
          </div>
          <div>
            <div className="ac-company">{app.companyName}</div>
            <div className="ac-title">{app.jobTitle}</div>
          </div>
        </div>
        <span className="ac-status" style={{ color: conf.color, background: conf.bg }}>
          {conf.emoji} {app.status}
        </span>
      </div>

      <div className="ac-meta">
        <span>
          📅 {new Date(app.applicationDate).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
          })}
        </span>
        {app.jobLink && (
          <a
            href={app.jobLink} target="_blank" rel="noopener noreferrer"
            className="ac-link"
            onClick={e => e.stopPropagation()}
          >
            ↗ View Job
          </a>
        )}
      </div>

      {expanded && app.notes && (
        <div className="ac-notes">{app.notes}</div>
      )}

      <div className="ac-actions" onClick={e => e.stopPropagation()}>
        <button className="ab edit" onClick={() => onEdit(app)}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/>
          </svg>
          Edit
        </button>
        <button
          className="ab delete"
          onClick={() => { if (window.confirm('Delete this application?')) onDelete(app.id); }}
        >
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
          </svg>
          Delete
        </button>
      </div>
      <div className="ac-hint">{expanded ? '▲' : '▼'}</div>
    </div>
  );
}

export default function JobApplicationList({ apps, loading, token, onEdit, onRefresh, onError }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/api/job-applications/${id}`, {
        method:  'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.message); }
      onRefresh();
    } catch (e) {
      onError(e.message);
    }
  };

  const filtered = apps.filter(a => {
    const mf = filter === 'All' || a.status === filter;
    const ms = !search ||
      a.companyName.toLowerCase().includes(search.toLowerCase()) ||
      a.jobTitle.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  const filters = ['All', 'Applied', 'Interview', 'Offer', 'Rejected'];

  if (loading) {
    return (
      <div className="grid">
        <div className="skel" /><div className="skel" /><div className="skel" />
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search company or title…"
          />
          {search && <button className="sc" onClick={() => setSearch('')}>✕</button>}
        </div>

        <div className="filter-row">
          {filters.map(f => (
            <button
              key={f}
              className={`fp ${filter === f ? 'active' : ''}`}
              style={filter === f && f !== 'All' ? { '--fc': STATUS[f]?.color, '--fb': STATUS[f]?.bg } : {}}
              onClick={() => setFilter(f)}
            >
              {f !== 'All' && <span className="fd" style={{ background: STATUS[f]?.color }} />}
              {f}
              <span className="fc">
                {f === 'All' ? apps.length : apps.filter(a => a.status === f).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="empty">
          <div style={{ fontSize: 48 }}>🎯</div>
          <p>{apps.length === 0 ? 'No applications yet. Add your first one!' : 'No results match your filters.'}</p>
        </div>
      ) : (
        <div className="grid">
          {filtered.map(app => (
            <AppCard
              key={app.id}
              app={app}
              onEdit={onEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}