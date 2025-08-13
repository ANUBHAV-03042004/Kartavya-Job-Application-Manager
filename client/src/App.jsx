import React, { useState, useEffect } from 'react';
import JobApplicationForm from './components/JobApplicationForm';
import JobApplicationList from './components/JobApplicationList';

const App = () => {
  const API_BASE_URL = import.meta.env.API_BASE_URL;
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [error, setError] = useState('');

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/job-applications`);
      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError('Failed to fetch applications');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedApplication) {
        // Update
        const response = await fetch(`${API_BASE_URL}/api/job-applications/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Failed to update');
      } else {
        // Create
        const response = await fetch(`${API_BASE_URL}/api/job-applications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Failed to create');
      }
      setSelectedApplication(null);
      fetchApplications();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (application) => {
    setSelectedApplication(application);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/job-applications/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');
      fetchApplications();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

return (
  <div className="container">
    <div style={{ display: 'flex', alignItems: 'center', justifyContent:'center', gap: '10px' }}>
      <img
        src="/kartavya_logo.png"
        alt="Logo"
        style={{ height: '80px', width: '80px', objectFit: 'contain' }}
      />
      <h1>Job Application Tracker</h1>
    </div>

    {error && <div className="error">{error}</div>}

    <JobApplicationForm
      onSubmit={handleSubmit}
      selectedApplication={selectedApplication}
    />

    <JobApplicationList
      applications={applications}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  </div>
);
};

export default App;