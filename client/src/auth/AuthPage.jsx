// import React, { useState } from 'react';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://kartavya-job-application-manager.onrender.com';

// const AuthPage = ({ onAuthSuccess }) => {
//   const [mode, setMode] = useState('login'); // 'login' | 'signup'
//   const [form, setForm] = useState({ name: '', email: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
//     const body = mode === 'login'
//       ? { email: form.email, password: form.password }
//       : { name: form.name, email: form.email, password: form.password };

//     try {
//       const res = await fetch(`${API_BASE_URL}${endpoint}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || 'Something went wrong');
//       onAuthSuccess(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const switchMode = () => {
//     setMode(mode === 'login' ? 'signup' : 'login');
//     setForm({ name: '', email: '', password: '' });
//     setError('');
//   };

//   return (
//     <div className="auth-page">
//       <div className="auth-bg">
//         <div className="auth-orb auth-orb-1" />
//         <div className="auth-orb auth-orb-2" />
//         <div className="auth-orb auth-orb-3" />
//       </div>

//       <div className="auth-container">
//         <div className="auth-brand">
//           <div className="auth-logo">
//             <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
//               <rect width="32" height="32" rx="8" fill="url(#grad)" />
//               <path d="M8 20l4-8 4 6 3-4 5 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
//               <defs>
//                 <linearGradient id="grad" x1="0" y1="0" x2="32" y2="32">
//                   <stop offset="0%" stopColor="#f59e0b" />
//                   <stop offset="100%" stopColor="#d97706" />
//                 </linearGradient>
//               </defs>
//             </svg>
//           </div>
//           <h1 className="auth-brand-name">JobTrackr</h1>
//           <p className="auth-brand-tagline">Your career, organized.</p>
//         </div>

//         <div className="auth-card">
//           <div className="auth-tabs">
//             <button
//               className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
//               onClick={() => switchMode()}
//               type="button"
//             >
//               Sign In
//             </button>
//             <button
//               className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
//               onClick={() => switchMode()}
//               type="button"
//             >
//               Create Account
//             </button>
//             <div className={`auth-tab-indicator ${mode === 'signup' ? 'right' : 'left'}`} />
//           </div>

//           <div className="auth-form-wrapper">
//             <h2 className="auth-form-title">
//               {mode === 'login' ? 'Welcome back' : 'Get started'}
//             </h2>
//             <p className="auth-form-subtitle">
//               {mode === 'login'
//                 ? 'Sign in to access your applications'
//                 : 'Create your free account today'}
//             </p>

//             {error && <div className="auth-error">{error}</div>}

//             <form onSubmit={handleSubmit} className="auth-form">
//               {mode === 'signup' && (
//                 <div className="auth-field">
//                   <label>Full Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={form.name}
//                     onChange={handleChange}
//                     placeholder="Alex Johnson"
//                     required
//                     autoComplete="name"
//                   />
//                 </div>
//               )}
//               <div className="auth-field">
//                 <label>Email Address</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={form.email}
//                   onChange={handleChange}
//                   placeholder="you@example.com"
//                   required
//                   autoComplete="email"
//                 />
//               </div>
//               <div className="auth-field">
//                 <label>Password</label>
//                 <input
//                   type="password"
//                   name="password"
//                   value={form.password}
//                   onChange={handleChange}
//                   placeholder="••••••••"
//                   required
//                   autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
//                   minLength={6}
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="auth-submit"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <span className="auth-spinner" />
//                 ) : (
//                   mode === 'login' ? 'Sign In →' : 'Create Account →'
//                 )}
//               </button>
//             </form>

//             <p className="auth-switch">
//               {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
//               {' '}
//               <button type="button" onClick={switchMode} className="auth-switch-btn">
//                 {mode === 'login' ? 'Sign up' : 'Sign in'}
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthPage;




import React, { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://kartavya-job-application-manager.onrender.com';

const AuthPage = ({ onAuthSuccess, sessionExpired = false }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
    const body = mode === 'login'
      ? { email: form.email, password: form.password }
      : { name: form.name, email: form.email, password: form.password };

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      onAuthSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setForm({ name: '', email: '', password: '' });
    setError('');
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-orb auth-orb-3" />
      </div>

      <div className="auth-container">
        <div className="auth-brand">
          <div className="auth-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#grad)" />
              <path d="M8 20l4-8 4 6 3-4 5 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="auth-brand-name">JobTrackr</h1>
          <p className="auth-brand-tagline">Your career, organized.</p>
        </div>

        {sessionExpired && (
          <div className="session-expired-notice">
            🔒 Your session expired — please sign in again.
          </div>
        )}

        <div className="auth-card">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => switchMode()}
              type="button"
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => switchMode()}
              type="button"
            >
              Create Account
            </button>
            <div className={`auth-tab-indicator ${mode === 'signup' ? 'right' : 'left'}`} />
          </div>

          <div className="auth-form-wrapper">
            <h2 className="auth-form-title">
              {mode === 'login' ? 'Welcome back' : 'Get started'}
            </h2>
            <p className="auth-form-subtitle">
              {mode === 'login'
                ? 'Sign in to access your applications'
                : 'Create your free account today'}
            </p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              {mode === 'signup' && (
                <div className="auth-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Alex Johnson"
                    required
                    autoComplete="name"
                  />
                </div>
              )}
              <div className="auth-field">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="auth-field">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="auth-spinner" />
                ) : (
                  mode === 'login' ? 'Sign In →' : 'Create Account →'
                )}
              </button>
            </form>

            <p className="auth-switch">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              {' '}
              <button type="button" onClick={switchMode} className="auth-switch-btn">
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;