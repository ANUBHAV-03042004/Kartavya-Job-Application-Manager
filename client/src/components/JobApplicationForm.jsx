import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const API = import.meta.env.VITE_API_BASE_URL || 'https://kartavya-job-application-manager.onrender.com';

// Status list — no color/bg needed here, active state is always #7CB518 from CSS
const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected'];

export default function JobApplicationForm({ token, selectedApplication, onCancel, onSaved }) {
  const blank = {
    id: uuidv4(),
    companyName: '',
    jobTitle: '',
    applicationDate: new Date().toISOString().split('T')[0],
    status: 'Applied',
    jobLink: '',
    notes: '',
  };
  const [form, setForm] = useState(blank);
  const [err,  setErr]  = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setForm(selectedApplication
      ? { ...selectedApplication, applicationDate: selectedApplication.applicationDate?.split('T')[0] || '' }
      : { ...blank, id: uuidv4() }
    );
  }, [selectedApplication]);

  const set = (k, v) => { setForm(f => ({...f, [k]: v})); setErr(''); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.companyName || !form.jobTitle || !form.applicationDate) {
      setErr('Fill required fields'); return;
    }
    setBusy(true);
    try {
      const isEdit = !!selectedApplication;
      const res = await fetch(
        `${API}/api/job-applications${isEdit ? '/'+form.id : ''}`,
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onSaved();
    } catch(e) { setErr(e.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="form-card slide-in">
      <div className="form-head">
        <h2>{selectedApplication ? '✏️ Edit Application' : '✨ Add Application'}</h2>
        <button className="icon-btn" onClick={onCancel} type="button">✕</button>
      </div>
      {err && <div className="msg error" style={{margin:'0 20px 12px'}}>{err}</div>}
      <form onSubmit={submit} className="app-form">
        <div className="form-row">
          <div className="ff">
            <label>Company Name <req>*</req></label>
            <input value={form.companyName} onChange={e=>set('companyName',e.target.value)} placeholder="Google, Meta, Stripe…" required />
          </div>
          <div className="ff">
            <label>Job Title <req>*</req></label>
            <input value={form.jobTitle} onChange={e=>set('jobTitle',e.target.value)} placeholder="Senior Engineer" required />
          </div>
        </div>
        <div className="form-row">
          <div className="ff">
            <label>Date Applied <req>*</req></label>
            <input type="date" value={form.applicationDate} onChange={e=>set('applicationDate',e.target.value)} required />
          </div>
          <div className="ff">
            <label>Status <req>*</req></label>
            <div className="status-pick">
              {STATUSES.map(s => (
                <button
                  key={s}
                  type="button"
                  className={`sp-btn ${form.status === s ? 'active' : ''}`}
                  onClick={() => set('status', s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="ff">
          <label>Job Link</label>
          <input type="url" value={form.jobLink} onChange={e=>set('jobLink',e.target.value)} placeholder="https://…" />
        </div>
        <div className="ff">
          <label>Notes</label>
          <textarea rows={3} value={form.notes} onChange={e=>set('notes',e.target.value)} placeholder="Salary range, recruiter, rounds…" />
        </div>
        <div className="form-btns">
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? <span className="spinner white" /> : (selectedApplication ? 'Update Application' : 'Add Application')}
          </button>
          <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}