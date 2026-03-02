import React, { useState } from 'react';

const API = import.meta.env.VITE_API_BASE_URL || 'https://kartavya-job-application-manager.onrender.com';

const S = {
  Applied:   { color:'#3B82F6', bg:'rgba(59,130,246,0.12)',  emoji:'📤' },
  Interview: { color:'#F59E0B', bg:'rgba(245,158,11,0.12)',  emoji:'🎯' },
  Offer:     { color:'#7CB518', bg:'rgba(124,181,24,0.12)',  emoji:'🎉' },
  Rejected:  { color:'#EF4444', bg:'rgba(239,68,68,0.12)',   emoji:'✖'  },
};

function Card({ app, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const c = S[app.status] || S.Applied;
  return (
    <div className={`app-card ${open?'expanded':''}`} onClick={()=>setOpen(o=>!o)}>
      <div className="ac-top">
        <div className="ac-left">
          <div className="ac-logo" style={{background:c.bg, color:c.color}}>
            {app.companyName[0].toUpperCase()}
          </div>
          <div>
            <div className="ac-company">{app.companyName}</div>
            <div className="ac-role">{app.jobTitle}</div>
          </div>
        </div>
        {/* Badge: always its own status color, never changes on click */}
        <span className="ac-badge" style={{color:c.color, background:c.bg}}>
          {c.emoji} {app.status}
        </span>
      </div>

      <div className="ac-meta">
        <span>📅 {new Date(app.applicationDate).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>
        {app.jobLink && (
          <a href={app.jobLink} target="_blank" rel="noopener noreferrer"
            className="ac-link" onClick={e=>e.stopPropagation()}>↗ View</a>
        )}
      </div>

      {open && app.notes && <div className="ac-notes">{app.notes}</div>}

      <div className="ac-actions" onClick={e=>e.stopPropagation()}>
        <button className="ac-btn edit" onClick={()=>onEdit(app)}>Edit</button>
        <button className="ac-btn del" onClick={()=>{ if(window.confirm('Delete this application?')) onDelete(app.id); }}>Delete</button>
      </div>
      <div className="ac-hint">{open?'▲':'▼'}</div>
    </div>
  );
}

export default function JobApplicationList({ apps, loading, token, onEdit, onRefresh, onError }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const del = async (id) => {
    try {
      const res = await fetch(`${API}/api/job-applications/${id}`, {
        method:'DELETE', headers:{Authorization:`Bearer ${token}`}
      });
      if (!res.ok) { const d=await res.json(); throw new Error(d.message); }
      onRefresh();
    } catch(e) { onError(e.message); }
  };

  // Sort newest first: prefer updatedAt, fall back to createdAt, then applicationDate
  const sorted = [...apps].sort((a, b) => {
    const ta = new Date(a.updatedAt || a.createdAt || a.applicationDate).getTime();
    const tb = new Date(b.updatedAt || b.createdAt || b.applicationDate).getTime();
    return tb - ta;
  });

  const shown = sorted.filter(a => {
    const mf = filter === 'All' || a.status === filter;
    const ms = !search
      || a.companyName.toLowerCase().includes(search.toLowerCase())
      || a.jobTitle.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  const filters = ['All','Applied','Interview','Offer','Rejected'];

  if (loading) return <div className="grid">{[1,2,3].map(i=><div key={i} className="skel" />)}</div>;

  return (
    <div>
      <div className="toolbar">
        <div className="search-box">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search company or role…" />
          {search && <button className="sc" onClick={()=>setSearch('')}>✕</button>}
        </div>
        <div className="filter-row">
          {filters.map(f => (
            <button
              key={f}
              className={`fp ${filter===f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {/* Dot keeps its own status color for visual identity */}
              {f !== 'All' && <span className="fd" style={{background: S[f]?.color}} />}
              {f}
              <span className="fc">
                {f === 'All' ? apps.length : apps.filter(a => a.status === f).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0
        ? apps.length === 0
          ? (
            <div className="empty-video-wrap">
              <video src="/dashboard.mp4" autoPlay loop muted playsInline className="empty-video" />
              <p className="empty-video-text">No applications yet — add your first one to get started!</p>
            </div>
          )
          : <div className="empty"><p>No results match your filters.</p></div>
        : <div className="grid">{shown.map(app => <Card key={app.id} app={app} onEdit={onEdit} onDelete={del} />)}</div>
      }
    </div>
  );
}