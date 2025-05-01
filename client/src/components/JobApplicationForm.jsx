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
      setFormData(selectedApplication);
    } else {
      setFormData({
        id: uuidv4(),
        companyName: '',
        jobTitle: '',
        applicationDate: '',
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
    if (!formData.companyName || !formData.jobTitle || !formData.applicationDate || !formData.status) {
      setError('Please fill in all required fields');
      return;
    }
    try {
      await onSubmit(formData);
      if (!selectedApplication) {
        setFormData({
          id: uuidv4(),
          companyName: '',
          jobTitle: '',
          applicationDate: '',
          status: 'Applied',
          jobLink: '',
          notes: '',
        });
      }
    } catch (err) {
      setError('Failed to save application');
    }
  };

  return (
    <div className="form-container">
      <h2>{selectedApplication ? 'Edit Application' : 'Add Application'}</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="companyName">Company Name *</label>
          <input
            type="text"
            name="companyName"
            id="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="jobTitle">Job Title *</label>
          <input
            type="text"
            name="jobTitle"
            id="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="applicationDate">Application Date *</label>
          <input
            type="date"
            name="applicationDate"
            id="applicationDate"
            value={formData.applicationDate.split('T')[0] || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status *</label>
          <select name="status" id="status" value={formData.status} onChange={handleChange} required>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="jobLink">Job Link</label>
          <input
            type="url"
            name="jobLink"
            id="jobLink"
            value={formData.jobLink}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea name="notes" id="notes" value={formData.notes} onChange={handleChange} />
        </div>
        <button type="submit" className="button button-primary">
          {selectedApplication ? 'Update' : 'Add'} Application
        </button>
        {selectedApplication && (
          <button
            type="button"
            className="button button-secondary"
            onClick={() => onSubmit(null)}
            style={{ marginLeft: '10px' }}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default JobApplicationForm;