import React from 'react';

const JobApplicationList = ({ applications, onEdit, onDelete }) => {
  return (
    <div className="table-container">
      <h2>Job Applications</h2>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Job Title</th>
              <th>Application Date</th>
              <th>Status</th>
              <th>Job Link</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.companyName}</td>
                <td>{app.jobTitle}</td>
                <td>{new Date(app.applicationDate).toLocaleDateString()}</td>
                <td>{app.status}</td>
                <td>
                  {app.jobLink ? (
                    <a href={app.jobLink} target="_blank" rel="noopener noreferrer">
                      Link
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
                <td>{app.notes || '-'}</td>
                <td>
                  <button
                    className="button button-primary"
                    onClick={() => onEdit(app)}
                    style={{ marginRight: '10px' }}
                  >
                    Edit
                  </button>
                  <button
                    className="button button-danger"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this application?')) {
                        onDelete(app.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default JobApplicationList;