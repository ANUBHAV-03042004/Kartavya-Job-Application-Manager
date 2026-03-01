// import React, { useState, useEffect } from 'react';
// import JobApplicationForm from './components/JobApplicationForm';
// import JobApplicationList from './components/JobApplicationList';

// const App = () => {
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `https://kartavya-job-application-manager.onrender.com`;
//   const [applications, setApplications] = useState([]);
//   const [selectedApplication, setSelectedApplication] = useState(null);
//   const [error, setError] = useState('');

//   const fetchApplications = async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/job-applications`);
//       const data = await response.json();
//       setApplications(data);
//     } catch (err) {
//       setError('Failed to fetch applications');
//     }
//   };

//   const handleSubmit = async (formData) => {
//     try {
//       if (selectedApplication) {
//         // Update
//         const response = await fetch(`${API_BASE_URL}/api/job-applications/${formData.id}`, {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(formData),
//         });
//         if (!response.ok) throw new Error('Failed to update');
//       } else {
//         // Create
//         const response = await fetch(`${API_BASE_URL}/api/job-applications`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(formData),
//         });
//         if (!response.ok) throw new Error('Failed to create');
//       }
//       setSelectedApplication(null);
//       fetchApplications();
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleEdit = (application) => {
//     setSelectedApplication(application);
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/job-applications/${id}`, {
//         method: 'DELETE',
//       });
//       if (!response.ok) throw new Error('Failed to delete');
//       fetchApplications();
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   useEffect(() => {
//     fetchApplications();
//   }, []);

// return (
//   <div className="container">
//     <div style={{ display: 'flex', alignItems: 'center', justifyContent:'center', gap: '10px' }}>
//       <img
//         src="/kartavya_logo.png"
//         alt="Logo"
//         style={{ height: '80px', width: '80px', objectFit: 'contain' }}
//       />
//       <h1>Job Application Tracker</h1>
//     </div>

//     {error && <div className="error">{error}</div>}

//     <JobApplicationForm
//       onSubmit={handleSubmit}
//       selectedApplication={selectedApplication}
//     />

//     <JobApplicationList
//       applications={applications}
//       onEdit={handleEdit}
//       onDelete={handleDelete}
//     />
//   </div>
// );
// };

// export default App;



// import React, { useState, useEffect } from 'react';
// import AuthPage from './auth/AuthPage';
// import Dashboard from './components/Dashboard';
// import './styles.css';

// const App = () => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);

//   useEffect(() => {
//     const savedToken = localStorage.getItem('jat_token');
//     const savedUser = localStorage.getItem('jat_user');
//     if (savedToken && savedUser) {
//       setToken(savedToken);
//       setUser(JSON.parse(savedUser));
//     }
//   }, []);

//   const handleAuthSuccess = ({ token, user }) => {
//     setToken(token);
//     setUser(user);
//     localStorage.setItem('jat_token', token);
//     localStorage.setItem('jat_user', JSON.stringify(user));
//   };

//   const handleLogout = () => {
//     setToken(null);
//     setUser(null);
//     localStorage.removeItem('jat_token');
//     localStorage.removeItem('jat_user');
//   };

//   if (!user || !token) {
//     return <AuthPage onAuthSuccess={handleAuthSuccess} />;
//   }

//   return <Dashboard user={user} token={token} onLogout={handleLogout} />;
// };

// export default App;


import React, { useState, useEffect } from 'react';
import AuthPage   from './auth/AuthPage';
import Dashboard  from './components/Dashboard';
import './styles.css';

export default function App() {
  const [user,  setUser]  = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    try {
      const t = localStorage.getItem('jt_token');
      const u = localStorage.getItem('jt_user');
      if (t && u) { setToken(t); setUser(JSON.parse(u)); }
    } catch {}
  }, []);

  const handleAuth = ({ token, user }) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('jt_token', token);
    localStorage.setItem('jt_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jt_token');
    localStorage.removeItem('jt_user');
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem('jt_user', JSON.stringify(updated));
  };

  if (!user || !token)
    return <AuthPage onAuthSuccess={handleAuth} />;

  return (
    <Dashboard
      user={user}
      token={token}
      onLogout={handleLogout}
      onUserUpdate={updateUser}
    />
  );
}