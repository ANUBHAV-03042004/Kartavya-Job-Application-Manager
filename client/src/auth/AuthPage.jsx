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

const API = import.meta.env.VITE_API_BASE_URL || 'https://kartavya-job-application-manager.onrender.com';

export default function AuthPage({ onAuthSuccess }) {
  const [view,    setView]    = useState('login'); // login | signup | forgot | reset
  const [form,    setForm]    = useState({ name:'', email:'', password:'', confirm:'', token:'', newPassword:'' });
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setError('');
    setSuccess('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      let endpoint, body;
      if (view === 'login') {
        endpoint = '/api/auth/login';
        body = { email: form.email, password: form.password };
      } else if (view === 'signup') {
        if (form.password !== form.confirm) { setError("Passwords don't match"); setLoading(false); return; }
        endpoint = '/api/auth/signup';
        body = { name: form.name, email: form.email, password: form.password };
      } else if (view === 'forgot') {
        endpoint = '/api/auth/forgot-password';
        body = { email: form.email };
      } else if (view === 'reset') {
        endpoint = '/api/auth/reset-password';
        body = { token: form.token, newPassword: form.newPassword };
      }

      const res  = await fetch(`${API}${endpoint}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');

      if (view === 'login' || view === 'signup') {
        onAuthSuccess(data);
      } else if (view === 'forgot') {
        setSuccess(data.resetToken
          ? `Dev mode — Reset token: ${data.resetToken}`
          : 'If that email exists, a reset token was sent.');
      } else if (view === 'reset') {
        setSuccess('Password reset! Redirecting to sign in…');
        setTimeout(() => { setView('login'); setForm(f => ({ ...f, token:'', newPassword:'' })); }, 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchView = (v) => { setView(v); setError(''); setSuccess(''); };

  return (
    <div className="auth-root">
      <div className="auth-bg-grid" />
      <div className="auth-blobs">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
      </div>

      <div className="auth-wrap">
        {/* Brand */}
        <div className="auth-brand">
          <div className="brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <span>JobTrackr</span>
        </div>

        <div className="auth-card">
          <div className="auth-card-top">
            <h1>
              {view === 'login'  ? 'Welcome back'      :
               view === 'signup' ? 'Create account'    :
               view === 'forgot' ? 'Forgot password'   :
                                   'Reset password'}
            </h1>
            <p>
              {view === 'login'  ? 'Sign in to your account'       :
               view === 'signup' ? 'Start tracking your career'    :
               view === 'forgot' ? "We'll help you reset it"       :
                                   'Enter your token and new password'}
            </p>
          </div>

          {/* Login / Signup tabs */}
          {(view === 'login' || view === 'signup') && (
            <div className="auth-tabs">
              <button className={`at ${view === 'login'  ? 'active' : ''}`} onClick={() => switchView('login')}>Sign In</button>
              <button className={`at ${view === 'signup' ? 'active' : ''}`} onClick={() => switchView('signup')}>Sign Up</button>
            </div>
          )}

          {error   && <div className="msg error"   style={{ margin: '0 24px 12px' }}>{error}</div>}
          {success && <div className="msg success" style={{ margin: '0 24px 12px' }}>{success}</div>}

          <form onSubmit={submit} className="auth-form" autoComplete="off">
            {view === 'signup' && (
              <div className="af">
                <label>Full Name</label>
                <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="Alex Johnson" required autoComplete="name" />
              </div>
            )}
            {(view === 'login' || view === 'signup' || view === 'forgot') && (
              <div className="af">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="you@example.com" required autoComplete="email" />
              </div>
            )}
            {(view === 'login' || view === 'signup') && (
              <div className="af">
                <label>Password</label>
                <input type="password" value={form.password} onChange={e => set('password', e.target.value)}
                  placeholder="••••••••" required minLength={6}
                  autoComplete={view === 'login' ? 'current-password' : 'new-password'} />
              </div>
            )}
            {view === 'signup' && (
              <div className="af">
                <label>Confirm Password</label>
                <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)}
                  placeholder="••••••••" required minLength={6} autoComplete="new-password" />
              </div>
            )}
            {view === 'reset' && (
              <>
                <div className="af">
                  <label>Reset Token</label>
                  <input type="text" value={form.token} onChange={e => set('token', e.target.value)}
                    placeholder="Paste your reset token" required />
                </div>
                <div className="af">
                  <label>New Password</label>
                  <input type="password" value={form.newPassword} onChange={e => set('newPassword', e.target.value)}
                    placeholder="Min 6 characters" required minLength={6} />
                </div>
              </>
            )}

            {view === 'login' && (
              <button type="button" className="forgot-link" onClick={() => switchView('forgot')}>
                Forgot password?
              </button>
            )}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading
                ? <span className="spinner" />
                : view === 'login'  ? 'Sign In →'
                : view === 'signup' ? 'Create Account →'
                : view === 'forgot' ? 'Send Reset Token →'
                :                    'Reset Password →'}
            </button>
          </form>

          {(view === 'forgot' || view === 'reset') && (
            <button className="back-link" onClick={() => switchView('login')}>← Back to Sign In</button>
          )}
          {view === 'reset' && (
            <button className="back-link" style={{ marginTop: 4 }} onClick={() => switchView('forgot')}>
              Need a new token?
            </button>
          )}
        </div>
      </div>
    </div>
  );
}