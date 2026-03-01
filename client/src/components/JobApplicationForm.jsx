// import React, { useState, useEffect } from 'react';
// import { v4 as uuidv4 } from 'uuid';

// const JobApplicationForm = ({ onSubmit, selectedApplication }) => {
//   const [formData, setFormData] = useState({
//     id: '',
//     companyName: '',
//     jobTitle: '',
//     applicationDate: '',
//     status: 'Applied',
//     jobLink: '',
//     notes: '',
//   });
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (selectedApplication) {
//       setFormData(selectedApplication);
//     } else {
//       setFormData({
//         id: uuidv4(),
//         companyName: '',
//         jobTitle: '',
//         applicationDate: '',
//         status: 'Applied',
//         jobLink: '',
//         notes: '',
//       });
//     }
//   }, [selectedApplication]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.companyName || !formData.jobTitle || !formData.applicationDate || !formData.status) {
//       setError('Please fill in all required fields');
//       return;
//     }
//     try {
//       await onSubmit(formData);
//       if (!selectedApplication) {
//         setFormData({
//           id: uuidv4(),
//           companyName: '',
//           jobTitle: '',
//           applicationDate: '',
//           status: 'Applied',
//           jobLink: '',
//           notes: '',
//         });
//       }
//     } catch (err) {
//       setError('Failed to save application');
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>{selectedApplication ? 'Edit Application' : 'Add Application'}</h2>
//       {error && <div className="error">{error}</div>}
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="companyName">Company Name *</label>
//           <input
//             type="text"
//             name="companyName"
//             id="companyName"
//             value={formData.companyName}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="jobTitle">Job Title *</label>
//           <input
//             type="text"
//             name="jobTitle"
//             id="jobTitle"
//             value={formData.jobTitle}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="applicationDate">Application Date *</label>
//           <input
//             type="date"
//             name="applicationDate"
//             id="applicationDate"
//             value={formData.applicationDate.split('T')[0] || ''}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="status">Status *</label>
//           <select name="status" id="status" value={formData.status} onChange={handleChange} required>
//             <option value="Applied">Applied</option>
//             <option value="Interview">Interview</option>
//             <option value="Offer">Offer</option>
//             <option value="Rejected">Rejected</option>
//           </select>
//         </div>
//         <div className="form-group">
//           <label htmlFor="jobLink">Job Link</label>
//           <input
//             type="url"
//             name="jobLink"
//             id="jobLink"
//             value={formData.jobLink}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="notes">Notes</label>
//           <textarea name="notes" id="notes" value={formData.notes} onChange={handleChange} />
//         </div>
//         <button type="submit" className="button button-primary">
//           {selectedApplication ? 'Update' : 'Add'} Application
//         </button>
//         {selectedApplication && (
//           <button
//             type="button"
//             className="button button-secondary"
//             onClick={() => onSubmit(null)}
//             style={{ marginLeft: '10px' }}
//           >
//             Cancel
//           </button>
//         )}
//       </form>
//     </div>
//   );
// };

// export default JobApplicationForm;










import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const API = import.meta.env.VITE_API_BASE_URL || 'https://kartavya-job-application-manager.onrender.com';

const STATUS_CFG = [
  { value:'Applied',   color:'var(--sky)',    bg:'var(--sky-light)'    },
  { value:'Interview', color:'var(--banana)', bg:'var(--banana-light)' },
  { value:'Offer',     color:'var(--green)',  bg:'var(--green-light)'  },
  { value:'Rejected',  color:'var(--terra)',  bg:'var(--terra-light)'  },
];

export default function JobApplicationForm({ token, selectedApplication, onCancel, onSaved }) {
  const blank = { id:uuidv4(), companyName:'', jobTitle:'', applicationDate:new Date().toISOString().split('T')[0], status:'Applied', jobLink:'', notes:'' };
  const [form, setForm] = useState(blank);
  const [err,  setErr]  = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setForm(selectedApplication
      ? { ...selectedApplication, applicationDate: selectedApplication.applicationDate?.split('T')[0]||'' }
      : { ...blank, id:uuidv4() }
    );
  }, [selectedApplication]);

  const set = (k,v) => { setForm(f=>({...f,[k]:v})); setErr(''); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.companyName||!form.jobTitle||!form.applicationDate) { setErr('Fill required fields'); return; }
    setBusy(true);
    try {
      const isEdit = !!selectedApplication;
      const res = await fetch(
        `${API}/api/job-applications${isEdit?'/'+form.id:''}`,
        { method:isEdit?'PUT':'POST', headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`}, body:JSON.stringify(form) }
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
              {STATUS_CFG.map(s=>(
                <button key={s.value} type="button"
                  className={`sp-btn ${form.status===s.value?'active':''}`}
                  style={form.status===s.value?{'--sc':s.color,'--sb':s.bg}:{}}
                  onClick={()=>set('status',s.value)}>
                  {s.value}
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
            {busy ? <span className="spinner white" /> : (selectedApplication?'Update Application':'Add Application')}
          </button>
          <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}