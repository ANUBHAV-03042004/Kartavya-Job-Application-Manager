// import React, { useState, useEffect } from 'react';

// const API = import.meta.env.VITE_API_BASE_URL || 'https://kartavya-job-application-manager.onrender.com';

// const SECURITY_QUESTIONS = [
//   "What was the name of your first pet?",
//   "What city were you born in?",
//   "What is your mother's maiden name?",
//   "What was the name of your first school?",
//   "What is your favourite movie?",
//   "What was the make of your first car?",
//   "What street did you grow up on?",
//   "What is the name of your childhood best friend?",
// ];

// const HEAD = {
//   profile:  '#5BC0EB',
//   password: '#FBB02D',
//   security: '#7CB518',
//   danger:   '#d94f00',
// };

// const AV_COLORS = ['#5BC0EB', '#7CB518', '#FB6107', '#5C8001', '#F3DE2C'];
// const getAvColor = (str = 'U') => AV_COLORS[str.charCodeAt(0) % AV_COLORS.length];

// export default function Settings({ user, token, onLogout }) {


//   const [meUser,    setMeUser]    = useState(null);
//   const [meLoading, setMeLoading] = useState(true);

//   useEffect(() => {
//     fetch(`${API}/api/auth/me`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//       .then(r => r.ok ? r.json() : null)
//       .then(data => { setMeUser(data); setMeLoading(false); })
//       .catch(() => { setMeUser(user); setMeLoading(false); });
//   }, [token]);

  
//   const u = meUser || user;


//   const isOAuth      = typeof u?.oauthProvider === 'string' && u.oauthProvider.length > 0;
//   const providerName = u?.oauthProvider || 'OAuth';

//   // ── Form state ────────────────────────────────────────────────────────────
//   const [pw,     setPw]     = useState({ current: '', next: '', confirm: '' });
//   const [pwMsg,  setPwMsg]  = useState({ type: '', text: '' });
//   const [pwBusy, setPwBusy] = useState(false);

//   const [sq,     setSq]     = useState({ question: SECURITY_QUESTIONS[0], answer: '', password: '' });
//   const [sqMsg,  setSqMsg]  = useState({ type: '', text: '' });
//   const [sqBusy, setSqBusy] = useState(false);

//   const [delPw,   setDelPw]   = useState('');
//   const [delMsg,  setDelMsg]  = useState({ type: '', text: '' });
//   const [delBusy, setDelBusy] = useState(false);
//   const [showDel, setShowDel] = useState(false);

//   const hdr = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

//   // ── Change password (email users only) ───────────────────────────────────
//   const changePw = async (e) => {
//     e.preventDefault();
//     if (pw.next !== pw.confirm) { setPwMsg({ type: 'error', text: "Passwords don't match" }); return; }
//     if (pw.next.length < 6)    { setPwMsg({ type: 'error', text: 'Min 6 characters' }); return; }
//     setPwBusy(true); setPwMsg({ type: '', text: '' });
//     try {
//       const res  = await fetch(`${API}/api/auth/change-password`, {
//         method: 'PATCH', headers: hdr,
//         body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.next }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);
//       setPwMsg({ type: 'success', text: '✓ Password updated!' });
//       setPw({ current: '', next: '', confirm: '' });
//     } catch (e) { setPwMsg({ type: 'error', text: e.message }); }
//     finally { setPwBusy(false); }
//   };

//   // ── Update security question (email users only) ───────────────────────────
//   const updateSq = async (e) => {
//     e.preventDefault();
//     if (!sq.answer.trim()) { setSqMsg({ type: 'error', text: 'Please provide an answer' }); return; }
//     if (!sq.password)      { setSqMsg({ type: 'error', text: 'Enter your current password to confirm' }); return; }
//     setSqBusy(true); setSqMsg({ type: '', text: '' });
//     try {
//       const res  = await fetch(`${API}/api/auth/security-question`, {
//         method: 'PATCH', headers: hdr,
//         body: JSON.stringify({
//           currentPassword:  sq.password,
//           securityQuestion: sq.question,
//           securityAnswer:   sq.answer.trim().toLowerCase(),
//         }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);
//       setSqMsg({ type: 'success', text: '✓ Security question updated!' });
//       setSq(s => ({ ...s, answer: '', password: '' }));
//     } catch (e) { setSqMsg({ type: 'error', text: e.message }); }
//     finally { setSqBusy(false); }
//   };

//   // ── Delete account ────────────────────────────────────────────────────────
//   const deleteAcc = async () => {
//     if (!isOAuth && !delPw) { setDelMsg({ type: 'error', text: 'Enter your password' }); return; }
//     setDelBusy(true); setDelMsg({ type: '', text: '' });
//     try {
//       const res  = await fetch(`${API}/api/auth/account`, {
//         method: 'DELETE', headers: hdr,
//         body: JSON.stringify(isOAuth ? {} : { password: delPw }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);
//       onLogout();
//     } catch (e) { setDelMsg({ type: 'error', text: e.message }); setDelBusy(false); }
//   };

//   // ── Avatar ────────────────────────────────────────────────────────────────
//   const initials = (u?.name || u?.email || 'U')[0].toUpperCase();
//   const avBg     = getAvColor(initials);
//   const avText   = avBg === '#F3DE2C' ? '#000' : '#fff';

//   // Loading skeleton
//   if (meLoading) return (
//     <div>
//       <div className="view-header">
//         <div><h1 className="view-title">Settings</h1><p className="view-sub">Manage your account</p></div>
//       </div>
//       <div className="settings-stack" style={{ opacity: 0.4 }}>
//         <div className="s-section" style={{ height: 120, borderRadius: 12, background: '#e5e7eb' }} />
//         <div className="s-section" style={{ height: 80,  borderRadius: 12, background: '#e5e7eb' }} />
//       </div>
//     </div>
//   );

//   return (
//     <div>
//       <div className="view-header">
//         <div>
//           <h1 className="view-title">Settings</h1>
//           <p className="view-sub">Manage your account</p>
//         </div>
//       </div>

//       <div className="settings-stack">

//         {/* ══ PROFILE ══════════════════════════════════════════════════════════ */}
//         <div className="s-section">
//           <div className="s-head" style={{ background: HEAD.profile, borderBottom: '2px solid rgba(0,0,0,0.1)' }}>
//             <h3 style={{ color: '#fff' }}>👤 Profile</h3>
//             <p  style={{ color: 'rgba(255,255,255,0.85)' }}>Your account information</p>
//           </div>
//           <div className="s-body">
//             <div className="profile-row">
//               <div className="profile-av"
//                 style={{ background: avBg, color: avText, boxShadow: `0 4px 16px ${avBg}77` }}>
//                 {initials}
//               </div>
//               <div>
//                 <div className="pname">{u?.name || u?.email}</div>
//                 <div className="pemail">{u?.email}</div>
//                 <div className="pmember">
//                   Member since {new Date(u?.createdAt || Date.now())
//                     .toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//                 </div>
//                 {isOAuth && (
//                   <div style={{
//                     marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6,
//                     background: '#f1f8de', border: '1.5px solid #7CB518',
//                     borderRadius: 20, padding: '3px 12px',
//                     fontSize: 12, fontWeight: 800, color: '#4a6601', textTransform: 'capitalize',
//                   }}>
//                     ✓ Signed in with {providerName}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {!isOAuth && (
//           <div className="s-section">
//             <div className="s-head" style={{ background: HEAD.password, borderBottom: '2px solid rgba(0,0,0,0.1)' }}>
//               <h3 style={{ color: '#fff' }}>🔑 Change Password</h3>
//               <p  style={{ color: 'rgba(255,255,255,0.85)' }}>Keep your account secure</p>
//             </div>
//             <div className="s-body">
//               {pwMsg.text && <div className={`msg ${pwMsg.type}`} style={{ marginBottom: 16 }}>{pwMsg.text}</div>}
//               <form onSubmit={changePw} className="s-form">
//                 <div className="ff">
//                   <label>Current Password</label>
//                   <input type="password" value={pw.current}
//                     onChange={e => setPw(p => ({ ...p, current: e.target.value }))}
//                     placeholder="••••••••" required autoComplete="current-password" />
//                 </div>
//                 <div className="form-row">
//                   <div className="ff">
//                     <label>New Password</label>
//                     <input type="password" value={pw.next}
//                       onChange={e => setPw(p => ({ ...p, next: e.target.value }))}
//                       placeholder="Min 6 chars" required minLength={6} autoComplete="new-password" />
//                   </div>
//                   <div className="ff">
//                     <label>Confirm New Password</label>
//                     <input type="password" value={pw.confirm}
//                       onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))}
//                       placeholder="Repeat" required minLength={6} autoComplete="new-password" />
//                   </div>
//                 </div>
//                 <button type="submit" className="btn-gold" disabled={pwBusy}
//                   style={{ width: 'auto', alignSelf: 'flex-start' }}>
//                   {pwBusy ? <span className="spinner dark" /> : '🔑 Update Password'}
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* ══ SECURITY QUESTION — email users only ═════════════════════════════
//             OAuth users (Google/GitHub) recover accounts through their provider,
//             so they don't need a security question at all                        */}
//         {!isOAuth && (
//           <div className="s-section">
//             <div className="s-head" style={{ background: HEAD.security, borderBottom: '2px solid rgba(0,0,0,0.1)' }}>
//               <h3 style={{ color: '#fff' }}>🔐 Security Question</h3>
//               <p  style={{ color: 'rgba(255,255,255,0.85)' }}>Used to recover your account without email</p>
//             </div>
//             <div className="s-body">
//               {sqMsg.text && <div className={`msg ${sqMsg.type}`} style={{ marginBottom: 16 }}>{sqMsg.text}</div>}
//               <form onSubmit={updateSq} className="s-form">
//                 <div className="ff">
//                   <label>Security Question</label>
//                   <select value={sq.question}
//                     onChange={e => setSq(s => ({ ...s, question: e.target.value }))}>
//                     {SECURITY_QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
//                   </select>
//                 </div>
//                 <div className="ff">
//                   <label>Your Answer</label>
//                   <input type="text" value={sq.answer}
//                     onChange={e => setSq(s => ({ ...s, answer: e.target.value }))}
//                     placeholder="Case-insensitive" required autoComplete="off" />
//                 </div>
//                 <div className="ff">
//                   <label>Confirm with Current Password</label>
//                   <input type="password" value={sq.password}
//                     onChange={e => setSq(s => ({ ...s, password: e.target.value }))}
//                     placeholder="••••••••" required autoComplete="current-password" />
//                 </div>
//                 <button type="submit" className="btn-primary" disabled={sqBusy}
//                   style={{ width: 'auto', alignSelf: 'flex-start' }}>
//                   {sqBusy ? <span className="spinner white" /> : 'Save Security Question'}
//                 </button>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* ══ DANGER ZONE ══════════════════════════════════════════════════════ */}
//         <div className="s-section">
//           <div className="s-head" style={{ background: HEAD.danger, borderBottom: '2px solid rgba(0,0,0,0.1)' }}>
//             <h3 style={{ color: '#fff' }}>⚠️ Danger Zone</h3>
//             <p  style={{ color: 'rgba(255,255,255,0.85)' }}>Irreversible actions — proceed with caution</p>
//           </div>
//           <div className="s-body">
//             <div className="dz-row">
//               <div>
//                 <div className="dz-title">Delete Account</div>
//                 <div className="dz-sub">
//                   Permanently delete your account and all application data. This cannot be undone.
//                 </div>
//               </div>
//               {!showDel ? (
//                 <button className="btn-danger" onClick={() => setShowDel(true)}>
//                   🗑 Delete Account
//                 </button>
//               ) : (
//                 <div className="del-box">
//                   <div className="del-warn">
//                     ⚠️ This cannot be undone.{' '}
//                     {isOAuth
//                       ? 'Click below to permanently delete your account.'
//                       : 'Enter your password to confirm deletion.'}
//                   </div>
//                   {delMsg.text && <div className={`msg ${delMsg.type}`} style={{ marginBottom: 12 }}>{delMsg.text}</div>}
//                   {!isOAuth && (
//                     <div className="ff" style={{ marginBottom: 12 }}>
//                       <label>Password</label>
//                       <input type="password" value={delPw}
//                         onChange={e => setDelPw(e.target.value)}
//                         placeholder="Enter your password" autoComplete="current-password" />
//                     </div>
//                   )}
//                   <div style={{ display: 'flex', gap: 10 }}>
//                     <button className="btn-danger" onClick={deleteAcc} disabled={delBusy}>
//                       {delBusy ? <span className="spinner white" /> : '🗑 Delete Everything'}
//                     </button>
//                     <button className="btn-ghost" onClick={() => {
//                       setShowDel(false); setDelPw(''); setDelMsg({ type: '', text: '' });
//                     }}>
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }




import React, { useState, useEffect } from 'react';

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

const HEAD = {
  profile:  '#5BC0EB',
  password: '#FBB02D',
  security: '#7CB518',
  danger:   '#d94f00',
};

const AV_COLORS = ['#5BC0EB', '#7CB518', '#FB6107', '#5C8001', '#F3DE2C'];
const getAvColor = (str = 'U') => AV_COLORS[str.charCodeAt(0) % AV_COLORS.length];

export default function Settings({ user, token, onLogout }) {

  const [meUser,    setMeUser]    = useState(null);
  const [meLoading, setMeLoading] = useState(true);

  // Always fetch /me on mount — gets the real DB values, bypasses stale localStorage
  useEffect(() => {
    fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => { setMeUser(data); setMeLoading(false); })
      .catch(() => { setMeUser(user); setMeLoading(false); });
  }, [token]);

  const u = meUser || user;

  // ── THE ONLY RULE ─────────────────────────────────────────────────────────
  // isOAuth = the user has NO local password hash in the database.
  // hasPassword comes from userDTO: !!u.password (true for email, false for Google/GitHub)
  // This is the only signal we need. oauthProvider is only used for display.
  //
  //   Email user  → hasPassword: true  → isOAuth: false → show Change PW + Security Q
  //   Google user → hasPassword: false → isOAuth: true  → hide  Change PW + Security Q
  //   GitHub user → hasPassword: false → isOAuth: true  → hide  Change PW + Security Q
  // ─────────────────────────────────────────────────────────────────────────
  const isOAuth      = u?.hasPassword === false;
  const providerName = u?.oauthProvider || 'OAuth';

  const [pw,     setPw]     = useState({ current: '', next: '', confirm: '' });
  const [pwMsg,  setPwMsg]  = useState({ type: '', text: '' });
  const [pwBusy, setPwBusy] = useState(false);

  const [sq,     setSq]     = useState({ question: SECURITY_QUESTIONS[0], answer: '', password: '' });
  const [sqMsg,  setSqMsg]  = useState({ type: '', text: '' });
  const [sqBusy, setSqBusy] = useState(false);

  const [delPw,   setDelPw]   = useState('');
  const [delMsg,  setDelMsg]  = useState({ type: '', text: '' });
  const [delBusy, setDelBusy] = useState(false);
  const [showDel, setShowDel] = useState(false);

  const hdr = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const changePw = async (e) => {
    e.preventDefault();
    if (pw.next !== pw.confirm) { setPwMsg({ type: 'error', text: "Passwords don't match" }); return; }
    if (pw.next.length < 6)    { setPwMsg({ type: 'error', text: 'Min 6 characters' }); return; }
    setPwBusy(true); setPwMsg({ type: '', text: '' });
    try {
      const res  = await fetch(`${API}/api/auth/change-password`, {
        method: 'PATCH', headers: hdr,
        body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPwMsg({ type: 'success', text: '✓ Password updated!' });
      setPw({ current: '', next: '', confirm: '' });
    } catch (e) { setPwMsg({ type: 'error', text: e.message }); }
    finally { setPwBusy(false); }
  };

  const updateSq = async (e) => {
    e.preventDefault();
    if (!sq.answer.trim()) { setSqMsg({ type: 'error', text: 'Please provide an answer' }); return; }
    if (!sq.password)      { setSqMsg({ type: 'error', text: 'Enter your current password to confirm' }); return; }
    setSqBusy(true); setSqMsg({ type: '', text: '' });
    try {
      const res  = await fetch(`${API}/api/auth/security-question`, {
        method: 'PATCH', headers: hdr,
        body: JSON.stringify({
          currentPassword:  sq.password,
          securityQuestion: sq.question,
          securityAnswer:   sq.answer.trim().toLowerCase(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSqMsg({ type: 'success', text: '✓ Security question updated!' });
      setSq(s => ({ ...s, answer: '', password: '' }));
    } catch (e) { setSqMsg({ type: 'error', text: e.message }); }
    finally { setSqBusy(false); }
  };

  const deleteAcc = async () => {
    if (!isOAuth && !delPw) { setDelMsg({ type: 'error', text: 'Enter your password' }); return; }
    setDelBusy(true); setDelMsg({ type: '', text: '' });
    try {
      const res  = await fetch(`${API}/api/auth/account`, {
        method: 'DELETE', headers: hdr,
        body: JSON.stringify(isOAuth ? {} : { password: delPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onLogout();
    } catch (e) { setDelMsg({ type: 'error', text: e.message }); setDelBusy(false); }
  };

  const initials = (u?.name || u?.email || 'U')[0].toUpperCase();
  const avBg     = getAvColor(initials);
  const avText   = avBg === '#F3DE2C' ? '#000' : '#fff';

  if (meLoading) return (
    <div>
      <div className="view-header">
        <div><h1 className="view-title">Settings</h1><p className="view-sub">Manage your account</p></div>
      </div>
      <div className="settings-stack" style={{ opacity: 0.4 }}>
        <div className="s-section" style={{ height: 120, borderRadius: 12, background: '#e5e7eb' }} />
        <div className="s-section" style={{ height: 80,  borderRadius: 12, background: '#e5e7eb' }} />
      </div>
    </div>
  );

  return (
    <div>
      <div className="view-header">
        <div>
          <h1 className="view-title">Settings</h1>
          <p className="view-sub">Manage your account</p>
        </div>
      </div>

      <div className="settings-stack">

        {/* ══ PROFILE ══════════════════════════════════════════════════════════ */}
        <div className="s-section">
          <div className="s-head" style={{ background: HEAD.profile, borderBottom: '2px solid rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#fff' }}>👤 Profile</h3>
            <p  style={{ color: 'rgba(255,255,255,0.85)' }}>Your account information</p>
          </div>
          <div className="s-body">
            <div className="profile-row">
              <div className="profile-av"
                style={{ background: avBg, color: avText, boxShadow: `0 4px 16px ${avBg}77` }}>
                {initials}
              </div>
              <div>
                <div className="pname">{u?.name || u?.email}</div>
                <div className="pemail">{u?.email}</div>
                <div className="pmember">
                  Member since {new Date(u?.createdAt || Date.now())
                    .toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                {/* OAuth badge — only when hasPassword is false */}
                {isOAuth && (
                  <div style={{
                    marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: '#f1f8de', border: '1.5px solid #7CB518',
                    borderRadius: 20, padding: '3px 12px',
                    fontSize: 12, fontWeight: 800, color: '#4a6601', textTransform: 'capitalize',
                  }}>
                    ✓ Signed in with {providerName}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ══ CHANGE PASSWORD — email users only (hasPassword: true) ═══════════ */}
        {!isOAuth && (
          <div className="s-section">
            <div className="s-head" style={{ background: HEAD.password, borderBottom: '2px solid rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#fff' }}>🔑 Change Password</h3>
              <p  style={{ color: 'rgba(255,255,255,0.85)' }}>Keep your account secure</p>
            </div>
            <div className="s-body">
              {pwMsg.text && <div className={`msg ${pwMsg.type}`} style={{ marginBottom: 16 }}>{pwMsg.text}</div>}
              <form onSubmit={changePw} className="s-form">
                <div className="ff">
                  <label>Current Password</label>
                  <input type="password" value={pw.current}
                    onChange={e => setPw(p => ({ ...p, current: e.target.value }))}
                    placeholder="••••••••" required autoComplete="current-password" />
                </div>
                <div className="form-row">
                  <div className="ff">
                    <label>New Password</label>
                    <input type="password" value={pw.next}
                      onChange={e => setPw(p => ({ ...p, next: e.target.value }))}
                      placeholder="Min 6 chars" required minLength={6} autoComplete="new-password" />
                  </div>
                  <div className="ff">
                    <label>Confirm New Password</label>
                    <input type="password" value={pw.confirm}
                      onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))}
                      placeholder="Repeat" required minLength={6} autoComplete="new-password" />
                  </div>
                </div>
                <button type="submit" className="btn-gold" disabled={pwBusy}
                  style={{ width: 'auto', alignSelf: 'flex-start' }}>
                  {pwBusy ? <span className="spinner dark" /> : '🔑 Update Password'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ══ SECURITY QUESTION — email users only (hasPassword: true) ═════════ */}
        {!isOAuth && (
          <div className="s-section">
            <div className="s-head" style={{ background: HEAD.security, borderBottom: '2px solid rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#fff' }}>🔐 Security Question</h3>
              <p  style={{ color: 'rgba(255,255,255,0.85)' }}>Used to recover your account without email</p>
            </div>
            <div className="s-body">
              {sqMsg.text && <div className={`msg ${sqMsg.type}`} style={{ marginBottom: 16 }}>{sqMsg.text}</div>}
              <form onSubmit={updateSq} className="s-form">
                <div className="ff">
                  <label>Security Question</label>
                  <select value={sq.question}
                    onChange={e => setSq(s => ({ ...s, question: e.target.value }))}>
                    {SECURITY_QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
                <div className="ff">
                  <label>Your Answer</label>
                  <input type="text" value={sq.answer}
                    onChange={e => setSq(s => ({ ...s, answer: e.target.value }))}
                    placeholder="Case-insensitive" required autoComplete="off" />
                </div>
                <div className="ff">
                  <label>Confirm with Current Password</label>
                  <input type="password" value={sq.password}
                    onChange={e => setSq(s => ({ ...s, password: e.target.value }))}
                    placeholder="••••••••" required autoComplete="current-password" />
                </div>
                <button type="submit" className="btn-primary" disabled={sqBusy}
                  style={{ width: 'auto', alignSelf: 'flex-start' }}>
                  {sqBusy ? <span className="spinner white" /> : 'Save Security Question'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ══ DANGER ZONE ══════════════════════════════════════════════════════ */}
        <div className="s-section">
          <div className="s-head" style={{ background: HEAD.danger, borderBottom: '2px solid rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#fff' }}>⚠️ Danger Zone</h3>
            <p  style={{ color: 'rgba(255,255,255,0.85)' }}>Irreversible actions — proceed with caution</p>
          </div>
          <div className="s-body">
            <div className="dz-row">
              <div>
                <div className="dz-title">Delete Account</div>
                <div className="dz-sub">
                  Permanently delete your account and all application data. This cannot be undone.
                </div>
              </div>
              {!showDel ? (
                <button className="btn-danger" onClick={() => setShowDel(true)}>
                  🗑 Delete Account
                </button>
              ) : (
                <div className="del-box">
                  <div className="del-warn">
                    ⚠️ This cannot be undone.{' '}
                    {isOAuth
                      ? 'Click below to permanently delete your account.'
                      : 'Enter your password to confirm deletion.'}
                  </div>
                  {delMsg.text && <div className={`msg ${delMsg.type}`} style={{ marginBottom: 12 }}>{delMsg.text}</div>}
                  {!isOAuth && (
                    <div className="ff" style={{ marginBottom: 12 }}>
                      <label>Password</label>
                      <input type="password" value={delPw}
                        onChange={e => setDelPw(e.target.value)}
                        placeholder="Enter your password" autoComplete="current-password" />
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn-danger" onClick={deleteAcc} disabled={delBusy}>
                      {delBusy ? <span className="spinner white" /> : '🗑 Delete Everything'}
                    </button>
                    <button className="btn-ghost" onClick={() => {
                      setShowDel(false); setDelPw(''); setDelMsg({ type: '', text: '' });
                    }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}