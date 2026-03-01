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
  const [view,    setView]    = useState('login');
  const [form,    setForm]    = useState({ name:'', email:'', password:'', confirm:'', token:'', newPassword:'' });
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(''); setSuccess(''); };
  const go  = (v)    => { setView(v); setError(''); setSuccess(''); };

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      let endpoint, body;
      if      (view === 'login')  { endpoint = '/api/auth/login';          body = { email: form.email, password: form.password }; }
      else if (view === 'signup') {
        if (form.password !== form.confirm) { setError("Passwords don't match"); setLoading(false); return; }
        endpoint = '/api/auth/signup';
        body = { name: form.name, email: form.email, password: form.password };
      }
      else if (view === 'forgot') { endpoint = '/api/auth/forgot-password'; body = { email: form.email }; }
      else if (view === 'reset')  { endpoint = '/api/auth/reset-password';  body = { token: form.token, newPassword: form.newPassword }; }

      const res  = await fetch(`${API}${endpoint}`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (view === 'login' || view === 'signup') { onAuthSuccess(data); }
      else if (view === 'forgot') { setSuccess(data.resetToken ? `Dev token: ${data.resetToken}` : 'Token sent!'); }
      else if (view === 'reset')  { setSuccess('Password reset! Redirecting…'); setTimeout(() => go('login'), 2000); }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-root">
      {/* Decorative shapes */}
      <div className="auth-shape s1" />
      <div className="auth-shape s2" />
      <div className="auth-shape s3" />

      <div className="auth-layout">
        {/* Left panel */}
        <div className="auth-panel-left">
          <img src="/kartavya_logo.png" alt="Kartavya Logo" className="auth-logo-img" />
          <h1 className="auth-app-name">KARTAVYA</h1>
          <p className="auth-app-sub">Job Application Manager</p>
          <div className="auth-features">
            {['Track every application in one place','Get insights with analytics dashboard','Never miss a follow-up again'].map(f => (
              <div key={f} className="auth-feature">
                <span className="auth-feature-dot" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right card */}
        <div className="auth-card">
          <div className="auth-card-inner">
            <div className="auth-card-head">
              <h2>
                {view==='login'  ? 'Sign in'          :
                 view==='signup' ? 'Create account'   :
                 view==='forgot' ? 'Forgot password'  :
                                   'Reset password'}
              </h2>
              <p>
                {view==='login'  ? 'Welcome back! Sign in to continue'     :
                 view==='signup' ? 'Start tracking your job applications'  :
                 view==='forgot' ? "Enter your email to get a reset token" :
                                   'Enter your token and new password'}
              </p>
            </div>

            {(view==='login'||view==='signup') && (
              <div className="auth-tabs">
                <button className={`auth-tab ${view==='login'  ?'active':''}`} onClick={()=>go('login')}>Sign In</button>
                <button className={`auth-tab ${view==='signup' ?'active':''}`} onClick={()=>go('signup')}>Sign Up</button>
              </div>
            )}

            {error   && <div className="msg error">{error}</div>}
            {success && <div className="msg success">{success}</div>}

            <form onSubmit={submit} className="auth-form">
              {view==='signup' && (
                <div className="afield">
                  <label>Full Name</label>
                  <input type="text" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Alex Johnson" required autoComplete="name" />
                </div>
              )}
              {(view==='login'||view==='signup'||view==='forgot') && (
                <div className="afield">
                  <label>Email Address</label>
                  <input type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="you@example.com" required autoComplete="email" />
                </div>
              )}
              {(view==='login'||view==='signup') && (
                <div className="afield">
                  <label>Password</label>
                  <input type="password" value={form.password} onChange={e=>set('password',e.target.value)} placeholder="••••••••" required minLength={6} autoComplete={view==='login'?'current-password':'new-password'} />
                </div>
              )}
              {view==='signup' && (
                <div className="afield">
                  <label>Confirm Password</label>
                  <input type="password" value={form.confirm} onChange={e=>set('confirm',e.target.value)} placeholder="••••••••" required minLength={6} autoComplete="new-password" />
                </div>
              )}
              {view==='reset' && (<>
                <div className="afield">
                  <label>Reset Token</label>
                  <input type="text" value={form.token} onChange={e=>set('token',e.target.value)} placeholder="Paste your reset token" required />
                </div>
                <div className="afield">
                  <label>New Password</label>
                  <input type="password" value={form.newPassword} onChange={e=>set('newPassword',e.target.value)} placeholder="Min 6 characters" required minLength={6} />
                </div>
              </>)}

              {view==='login' && (
                <button type="button" className="link-btn" onClick={()=>go('forgot')}>Forgot password?</button>
              )}

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? <span className="spinner white" /> :
                  view==='login'  ? 'Sign In →' :
                  view==='signup' ? 'Create Account →' :
                  view==='forgot' ? 'Send Reset Token →' : 'Reset Password →'}
              </button>
            </form>

            {(view==='forgot'||view==='reset') && (
              <button className="back-btn" onClick={()=>go('login')}>← Back to Sign In</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}