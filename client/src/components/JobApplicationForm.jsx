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

const STATUS_OPTIONS = [
  { value: 'Applied',   color: '#00bbf9' },
  { value: 'Interview', color: '#fee440' },
  { value: 'Offer',     color: '#00f5d4' },
  { value: 'Rejected',  color: '#f15bb5' },
];

export default function JobApplicationForm({ token, selectedApplication, onCancel, onSaved }) {
  const blank = {
    id:              uuidv4(),
    companyName:     '',
    jobTitle:        '',
    applicationDate: new Date().toISOString().split('T')[0],
    status:          'Applied',
    jobLink:         '',
    notes:           '',
  };

  const [form,  setForm]  = useState(blank);
  const [error, setError] = useState('');
  const [busy,  setBusy]  = useState(false);

  useEffect(() => {
    if (selectedApplication) {
      setForm({
        ...selectedApplication,
        applicationDate: selectedApplication.applicationDate?.split('T')[0] || '',
      });
    } else {
      setForm({ ...blank, id: uuidv4() });
    }
  }, [selectedApplication]);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.companyName || !form.jobTitle || !form.applicationDate) {
      setError('Please fill in all required fields');
      return;
    }
    setBusy(true);
    try {
      const isEdit = !!selectedApplication;
      const res = await fetch(
        `${API}/api/job-applications${isEdit ? '/' + form.id : ''}`,
        {
          method:  isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body:    JSON.stringify(form),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="form-card slide-down">
      <div className="form-head">
        <h2>{selectedApplication ? '✏️ Edit Application' : '✨ New Application'}</h2>
        <button className="icon-btn" onClick={onCancel} type="button">✕</button>
      </div>

      {error && <div className="msg error" style={{ margin: '0 20px 12px' }}>{error}</div>}

      <form onSubmit={handleSubmit} className="app-form">
        <div className="form-row">
          <div className="ff">
            <label>Company Name <span>*</span></label>
            <input
              type="text" value={form.companyName} required
              onChange={e => set('companyName', e.target.value)}
              placeholder="Google, Meta, Stripe…"
            />
          </div>
          <div className="ff">
            <label>Job Title <span>*</span></label>
            <input
              type="text" value={form.jobTitle} required
              onChange={e => set('jobTitle', e.target.value)}
              placeholder="Senior Engineer"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="ff">
            <label>Date Applied <span>*</span></label>
            <input
              type="date" value={form.applicationDate} required
              onChange={e => set('applicationDate', e.target.value)}
            />
          </div>
          <div className="ff">
            <label>Status <span>*</span></label>
            <div className="status-pick">
              {STATUS_OPTIONS.map(({ value, color }) => (
                <button
                  key={value}
                  type="button"
                  className={`sp-btn ${form.status === value ? 'active' : ''}`}
                  style={form.status === value ? { '--sc': color, '--sb': `${color}20` } : {}}
                  onClick={() => set('status', value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="ff">
          <label>Job Link</label>
          <input
            type="url" value={form.jobLink}
            onChange={e => set('jobLink', e.target.value)}
            placeholder="https://…"
          />
        </div>

        <div className="ff">
          <label>Notes</label>
          <textarea
            rows={3} value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="Salary range, recruiter name, interview rounds…"
          />
        </div>

        <div className="form-btns">
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? <span className="spinner" /> : (selectedApplication ? 'Update Application' : 'Add Application')}
          </button>
          <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}