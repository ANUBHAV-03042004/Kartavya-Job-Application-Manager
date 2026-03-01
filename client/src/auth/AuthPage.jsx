import React, { useState } from 'react';

const API = import.meta.env.VITE_API_BASE_URL || 'https://kartavya-job-application-manager.onrender.com';

const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What city were you born in?",
  "What is your mother's maiden name?",
  "What was the name of your first school?",
  "What is your favourite movie?",
  "What was the make of your first car?",
  "What street did you grow up on?",
  "What is the name of your childhood best friend?",
];

export default function AuthPage({ onAuthSuccess }) {
  const [view,       setView]       = useState('login'); // login | signup | forgot
  const [form,       setForm]       = useState({
    name:'', email:'', password:'', confirm:'',
    securityQuestion: SECURITY_QUESTIONS[0], securityAnswer:'',
    forgotEmail:'', sqAnswer:'', newPassword:'',
  });
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState('');
  const [loading,    setLoading]    = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotCtx,  setForgotCtx]  = useState({ email:'', question:'', token:'' });
  const [oauthMsg,   setOauthMsg]   = useState('');

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(''); setSuccess(''); };
  const go  = (v)    => { setView(v); setError(''); setSuccess(''); setForgotStep(1); setOauthMsg(''); };

  // ── OAuth — shows friendly message since backend not configured yet ──
  const oauthLogin = (provider) => {
    // Once you add passport-google-oauth20 / passport-github2 to backend,
    // uncomment: window.location.href = `${API}/api/auth/${provider}`;
    setOauthMsg(`${provider === 'google' ? 'Google' : 'GitHub'} sign-in requires backend OAuth setup. See the backend guide below, or sign in with email for now.`);
  };

  const handleLogin = async () => {
    const res  = await fetch(`${API}/api/auth/login`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email: form.email, password: form.password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    onAuthSuccess(data);
  };

  const handleSignup = async () => {
    if (form.password !== form.confirm) throw new Error("Passwords don't match");
    if (!form.securityAnswer.trim())    throw new Error('Please provide a security answer');
    const res  = await fetch(`${API}/api/auth/signup`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        name: form.name, email: form.email, password: form.password,
        securityQuestion: form.securityQuestion,
        securityAnswer:   form.securityAnswer.trim().toLowerCase(),
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    onAuthSuccess(data);
  };

  const handleForgotStep1 = async () => {
    const res  = await fetch(`${API}/api/auth/security-question`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email: form.forgotEmail.trim().toLowerCase() })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Email not found');
    setForgotCtx({ email: form.forgotEmail.trim().toLowerCase(), question: data.securityQuestion, token:'' });
    setForgotStep(2);
  };

  const handleForgotStep2 = async () => {
    const res  = await fetch(`${API}/api/auth/verify-security-answer`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email: forgotCtx.email, securityAnswer: form.sqAnswer.trim().toLowerCase() })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Incorrect answer');
    setForgotCtx(c => ({ ...c, token: data.resetToken }));
    setForgotStep(3);
  };

  const handleForgotStep3 = async () => {
    if (form.newPassword.length < 6) throw new Error('Password must be at least 6 characters');
    const res  = await fetch(`${API}/api/auth/reset-password`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ token: forgotCtx.token, newPassword: form.newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setSuccess('Password reset! Redirecting…');
    setTimeout(() => go('login'), 2000);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      if      (view === 'login')  await handleLogin();
      else if (view === 'signup') await handleSignup();
      else if (view === 'forgot') {
        if      (forgotStep === 1) await handleForgotStep1();
        else if (forgotStep === 2) await handleForgotStep2();
        else if (forgotStep === 3) await handleForgotStep3();
      }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-root">
      {/* animated background blobs */}
      <div className="auth-blob b1" />
      <div className="auth-blob b2" />
      <div className="auth-blob b3" />

      <div className={`auth-layout ${view === 'signup' ? 'wide' : ''}`}>

        {/* ══ LEFT PANEL ══ */}
        <div className="auth-panel-left">
          <div className="apl-top">
            <img src="/kartavya_logo.png" alt="Kartavya" className="apl-logo" />
            <div className="apl-brand">KARTAVYA</div>
            <div className="apl-tagline">Job Application Manager</div>
          </div>

          <div className="apl-features">
            {[
              { icon:'📋', text:'Track every application' },
              { icon:'📊', text:'Analytics & insights' },
              { icon:'🔔', text:'Never miss a follow-up' },
              { icon:'🔐', text:'Secure & private' },
            ].map(f => (
              <div key={f.text} className="apl-feat">
                <span className="apl-feat-icon">{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>

          <div className="apl-bottom">
            <div className="apl-stat"><span className="apl-stat-n">100%</span><span>Free</span></div>
            <div className="apl-stat-div" />
            <div className="apl-stat"><span className="apl-stat-n">∞</span><span>Applications</span></div>
            <div className="apl-stat-div" />
            <div className="apl-stat"><span className="apl-stat-n">5★</span><span>Tracking</span></div>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="auth-right">

          {/* ── LOGIN ── */}
          {view === 'login' && (
            <div className="auth-box">
              <div className="auth-box-head">
                <h2>Welcome back</h2>
                <p>Sign in to your account</p>
              </div>

              <div className="atabs">
                <button className="atab active">Sign In</button>
                <button className="atab" onClick={()=>go('signup')}>Sign Up</button>
              </div>

              {/* OAuth */}
              <div className="oauth-row">
                <button type="button" className="oauth-btn google" onClick={()=>oauthLogin('google')}>
                  <GoogleIcon /> Continue with Google
                </button>
                <button type="button" className="oauth-btn github" onClick={()=>oauthLogin('github')}>
                  <GitHubIcon /> Continue with GitHub
                </button>
              </div>
              {oauthMsg && <div className="msg warn" style={{marginBottom:4}}>{oauthMsg}</div>}
              <div className="oauth-div"><span>or sign in with email</span></div>

              {error   && <div className="msg error">{error}</div>}
              {success && <div className="msg success">{success}</div>}

              <form onSubmit={submit} className="aform">
                <div className="afield">
                  <label>Email Address</label>
                  <input type="email" value={form.email} onChange={e=>set('email',e.target.value)}
                    placeholder="you@example.com" required autoComplete="email" />
                </div>
                <div className="afield">
                  <label>Password</label>
                  <input type="password" value={form.password} onChange={e=>set('password',e.target.value)}
                    placeholder="••••••••" required minLength={6} autoComplete="current-password" />
                </div>
                <button type="button" className="link-btn" onClick={()=>go('forgot')}>Forgot password?</button>
                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading ? <span className="spinner white" /> : 'Sign In →'}
                </button>
              </form>

              <div className="auth-switch">
                Don't have an account? <button onClick={()=>go('signup')}>Sign up free</button>
              </div>
            </div>
          )}

          {/* ── SIGNUP ── TWO COLUMNS ── */}
          {view === 'signup' && (
            <div className="auth-box signup-box">
              <div className="auth-box-head">
                <h2>Create your account</h2>
                <p>Start tracking your job applications today</p>
              </div>

              <div className="atabs">
                <button className="atab" onClick={()=>go('login')}>Sign In</button>
                <button className="atab active">Sign Up</button>
              </div>

              {/* OAuth */}
              <div className="oauth-row">
                <button type="button" className="oauth-btn google" onClick={()=>oauthLogin('google')}>
                  <GoogleIcon /> Continue with Google
                </button>
                <button type="button" className="oauth-btn github" onClick={()=>oauthLogin('github')}>
                  <GitHubIcon /> Continue with GitHub
                </button>
              </div>
              {oauthMsg && <div className="msg warn" style={{marginBottom:4}}>{oauthMsg}</div>}
              <div className="oauth-div"><span>or create account with email</span></div>

              {error   && <div className="msg error">{error}</div>}
              {success && <div className="msg success">{success}</div>}

              {/* Two-column split */}
              <div className="signup-cols">
                {/* Left col — account details */}
                <div className="signup-col">
                  <div className="signup-col-title">Account Details</div>
                  <form id="signup-form" onSubmit={submit} className="aform">
                    <div className="afield">
                      <label>Full Name</label>
                      <input type="text" value={form.name} onChange={e=>set('name',e.target.value)}
                        placeholder="Alex Johnson" required autoComplete="name" />
                    </div>
                    <div className="afield">
                      <label>Email Address</label>
                      <input type="email" value={form.email} onChange={e=>set('email',e.target.value)}
                        placeholder="you@example.com" required autoComplete="email" />
                    </div>
                    <div className="afield">
                      <label>Password</label>
                      <input type="password" value={form.password} onChange={e=>set('password',e.target.value)}
                        placeholder="Min 6 characters" required minLength={6} autoComplete="new-password" />
                    </div>
                    <div className="afield">
                      <label>Confirm Password</label>
                      <input type="password" value={form.confirm} onChange={e=>set('confirm',e.target.value)}
                        placeholder="Repeat password" required minLength={6} autoComplete="new-password" />
                    </div>
                  </form>
                </div>

                {/* Divider */}
                <div className="signup-col-div">
                  <div className="signup-col-div-line" />
                  <div className="signup-col-div-badge">🔐</div>
                  <div className="signup-col-div-line" />
                </div>

                {/* Right col — account recovery */}
                <div className="signup-col">
                  <div className="signup-col-title">Account Recovery</div>
                  <div className="sq-info-box">
                    No email needed to recover your account — just answer this question.
                  </div>
                  <div className="aform" style={{gap:14,display:'flex',flexDirection:'column'}}>
                    <div className="afield">
                      <label>Security Question</label>
                      <select value={form.securityQuestion} onChange={e=>set('securityQuestion',e.target.value)}
                        form="signup-form">
                        {SECURITY_QUESTIONS.map(q=><option key={q} value={q}>{q}</option>)}
                      </select>
                    </div>
                    <div className="afield">
                      <label>Your Answer</label>
                      <input type="text" value={form.securityAnswer} onChange={e=>set('securityAnswer',e.target.value)}
                        placeholder="Case-insensitive" required autoComplete="off" form="signup-form" />
                    </div>
                    <div className="sq-tip">
                      💡 Make sure you remember this answer — it's the only way to reset your password without email.
                    </div>
                  </div>
                </div>
              </div>

              {/* Full-width submit */}
              <button type="submit" form="signup-form" className="auth-submit" disabled={loading}>
                {loading ? <span className="spinner white" /> : 'Create Account →'}
              </button>

              <div className="auth-switch">
                Already have an account? <button onClick={()=>go('login')}>Sign in</button>
              </div>
            </div>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {view === 'forgot' && (
            <div className="auth-box">
              <div className="auth-box-head">
                <h2>Recover Account</h2>
                <p>Answer your security question — no email needed</p>
              </div>

              {/* Step dots */}
              <div className="forgot-steps">
                {[{n:1,label:'Email'},{n:2,label:'Security Q'},{n:3,label:'New Password'}].map(({n,label}) => (
                  <React.Fragment key={n}>
                    <div className={`fstep ${forgotStep>=n?'act':''} ${forgotStep>n?'done':''}`}>
                      <div className="fsdot">{forgotStep>n?'✓':n}</div>
                      <div className="fslabel">{label}</div>
                    </div>
                    {n<3 && <div className={`fsline ${forgotStep>n?'done':''}`} />}
                  </React.Fragment>
                ))}
              </div>

              {error   && <div className="msg error">{error}</div>}
              {success && <div className="msg success">{success}</div>}

              <form onSubmit={submit} className="aform">
                {forgotStep===1 && (
                  <div className="afield">
                    <label>Email Address</label>
                    <input type="email" value={form.forgotEmail} onChange={e=>set('forgotEmail',e.target.value)}
                      placeholder="The email you registered with" required autoComplete="email" />
                  </div>
                )}
                {forgotStep===2 && (
                  <>
                    <div className="sq-question-box">
                      <div className="sq-q-label">Your Security Question</div>
                      <div className="sq-q-text">"{forgotCtx.question}"</div>
                    </div>
                    <div className="afield">
                      <label>Your Answer</label>
                      <input type="text" value={form.sqAnswer} onChange={e=>set('sqAnswer',e.target.value)}
                        placeholder="Type your answer (case-insensitive)" required autoComplete="off" />
                    </div>
                  </>
                )}
                {forgotStep===3 && (
                  <>
                    <div className="msg success">✓ Identity verified! Set your new password.</div>
                    <div className="afield">
                      <label>New Password</label>
                      <input type="password" value={form.newPassword} onChange={e=>set('newPassword',e.target.value)}
                        placeholder="At least 6 characters" required minLength={6} autoComplete="new-password" />
                    </div>
                  </>
                )}
                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading ? <span className="spinner white" /> :
                    forgotStep===1 ? 'Find My Account →' :
                    forgotStep===2 ? 'Verify Answer →' :
                                     'Reset Password →'}
                </button>
              </form>

              <button className="back-btn" onClick={()=>go('login')}>← Back to Sign In</button>
            </div>
          )}

        </div>{/* auth-right */}
      </div>
    </div>
  );
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" style={{flexShrink:0}}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0}}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);