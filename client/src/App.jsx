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




import React, { useState, useEffect, useCallback } from 'react';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import './styles.css';

const STORAGE_KEYS = {
  token:     'jat_token',
  user:      'jat_user',
  expiresAt: 'jat_expires_at',
};

const clearSession = () => {
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
};

const App = () => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  const [expired, setExpired] = useState(false); // shows "session expired" notice on AuthPage

  // ── restore session from localStorage ──────────────────────────────
  useEffect(() => {
    const savedToken     = localStorage.getItem(STORAGE_KEYS.token);
    const savedUser      = localStorage.getItem(STORAGE_KEYS.user);
    const savedExpiresAt = localStorage.getItem(STORAGE_KEYS.expiresAt);

    if (!savedToken || !savedUser || !savedExpiresAt) return;

    // Already expired? Wipe immediately and show login (no flash of dashboard)
    if (Date.now() >= Number(savedExpiresAt)) {
      clearSession();
      setExpired(true);
      return;
    }

    setToken(savedToken);
    setUser(JSON.parse(savedUser));
  }, []);

  // ── auto-logout timer — fires exactly when the token expires ───────
  useEffect(() => {
    if (!token) return;

    const expiresAt = Number(localStorage.getItem(STORAGE_KEYS.expiresAt));
    const msUntilExpiry = expiresAt - Date.now();

    if (msUntilExpiry <= 0) { handleLogout(true); return; }

    const timer = setTimeout(() => handleLogout(true), msUntilExpiry);
    return () => clearTimeout(timer); // cleanup if user logs out manually first
  }, [token]);

  // ── handlers ───────────────────────────────────────────────────────
  const handleAuthSuccess = ({ token, user, expiresAt }) => {
    setToken(token);
    setUser(user);
    setExpired(false);
    localStorage.setItem(STORAGE_KEYS.token,     token);
    localStorage.setItem(STORAGE_KEYS.user,      JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.expiresAt, String(expiresAt));
  };

  // isExpiry = true → show "session expired" notice on login page
  const handleLogout = useCallback((isExpiry = false) => {
    setToken(null);
    setUser(null);
    setExpired(isExpiry);
    clearSession();
  }, []);

  if (!user || !token) {
    return (
      <AuthPage
        onAuthSuccess={handleAuthSuccess}
        sessionExpired={expired}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      token={token}
      onLogout={handleLogout}
      onUnauthorized={() => handleLogout(true)} // called on any 401
    />
  );
};

export default App;