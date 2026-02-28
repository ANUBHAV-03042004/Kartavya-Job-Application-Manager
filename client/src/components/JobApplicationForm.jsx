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

const JobApplicationForm = ({ onSubmit, selectedApplication }) => {
  const [formData, setFormData] = useState({
    id: '',
    companyName: '',
    jobTitle: '',
    applicationDate: '',
    status: 'Applied',
    jobLink: '',
    notes: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedApplication) {
      setFormData({
        ...selectedApplication,
        applicationDate: selectedApplication.applicationDate?.split('T')[0] || '',
      });
    } else {
      setFormData({
        id: uuidv4(),
        companyName: '',
        jobTitle: '',
        applicationDate: new Date().toISOString().split('T')[0],
        status: 'Applied',
        jobLink: '',
        notes: '',
      });
    }
  }, [selectedApplication]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.jobTitle || !formData.applicationDate) {
      setError('Please fill in all required fields');
      return;
    }
    try {
      await onSubmit(formData);
    } catch {
      setError('Failed to save application');
    }
  };

  const statusOptions = [
    { value: 'Applied', color: '#3b82f6' },
    { value: 'Interview', color: '#f59e0b' },
    { value: 'Offer', color: '#10b981' },
    { value: 'Rejected', color: '#ef4444' },
  ];

  return (
    <div className="form-card">
      <div className="form-card-header">
        <h2>{selectedApplication ? '✏️ Edit Application' : '✨ New Application'}</h2>
        {error && <span className="form-error">{error}</span>}
      </div>

      <form onSubmit={handleSubmit} className="app-form">
        <div className="form-row">
          <div className="form-field">
            <label>Company Name <span>*</span></label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g. Google, Meta, Apple"
              required
            />
          </div>
          <div className="form-field">
            <label>Job Title <span>*</span></label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="e.g. Senior Engineer"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label>Application Date <span>*</span></label>
            <input
              type="date"
              name="applicationDate"
              value={formData.applicationDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-field">
            <label>Status <span>*</span></label>
            <div className="status-selector">
              {statusOptions.map(({ value, color }) => (
                <button
                  key={value}
                  type="button"
                  className={`status-option ${formData.status === value ? 'active' : ''}`}
                  style={{ '--status-color': color }}
                  onClick={() => setFormData({ ...formData, status: value })}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-field">
          <label>Job Link</label>
          <input
            type="url"
            name="jobLink"
            value={formData.jobLink}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <div className="form-field">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Interview rounds, salary range, recruiter name..."
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {selectedApplication ? 'Update Application' : 'Add Application'}
          </button>
          <button type="button" className="btn-ghost" onClick={() => onSubmit(null)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobApplicationForm;