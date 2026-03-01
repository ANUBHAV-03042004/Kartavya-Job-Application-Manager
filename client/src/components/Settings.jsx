// import React, { useState } from 'react';

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

// // Section header colours — darkest shades from the brand palette
// // All use white text for legibility
// const HEAD = {
//   profile:  { bg: '#5BC0EB', sub: 'rgba(255,255,255,0.75)' },  // sky blue
//   password: { bg: '#FBB02D', sub: 'rgba(255,255,255,0.75)' },  // lime green
//   security: { bg: '#7CB518', sub: 'rgba(255,255,255,0.75)' },  // forest (darkest)
//   danger:   { bg: '#FB6107', sub: 'rgba(255,255,255,0.75)' },  // blaze orange
// };

// export default function Settings({ user, token, onLogout }) {
//   // Detect OAuth — users who signed in via Google/GitHub have no local password
//   const isOAuth = Boolean(user?.provider && user.provider !== 'local');

//   const [pw,    setPw]     = useState({ current:'', next:'', confirm:'' });
//   const [pwMsg, setPwMsg]  = useState({ type:'', text:'' });
//   const [pwBusy,setPwBusy] = useState(false);

//   const [sq,    setSq]     = useState({ question:SECURITY_QUESTIONS[0], answer:'', password:'' });
//   const [sqMsg, setSqMsg]  = useState({ type:'', text:'' });
//   const [sqBusy,setSqBusy] = useState(false);

//   const [delPw,   setDelPw]   = useState('');
//   const [delMsg,  setDelMsg]  = useState({ type:'', text:'' });
//   const [delBusy, setDelBusy] = useState(false);
//   const [showDel, setShowDel] = useState(false);

//   const hdr = { 'Content-Type':'application/json', Authorization:`Bearer ${token}` };

//   const changePw = async (e) => {
//     e.preventDefault();
//     if (pw.next !== pw.confirm) { setPwMsg({type:'error',text:"Passwords don't match"}); return; }
//     if (pw.next.length < 6)    { setPwMsg({type:'error',text:'Min 6 characters'}); return; }
//     setPwBusy(true); setPwMsg({type:'',text:''});
//     try {
//       const res  = await fetch(`${API}/api/auth/change-password`, {
//         method:'PATCH', headers:hdr,
//         body:JSON.stringify({currentPassword:pw.current, newPassword:pw.next})
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);
//       setPwMsg({type:'success',text:'✓ Password updated!'});
//       setPw({current:'',next:'',confirm:''});
//     } catch(e) { setPwMsg({type:'error',text:e.message}); }
//     finally { setPwBusy(false); }
//   };

//   const updateSq = async (e) => {
//     e.preventDefault();
//     if (!sq.answer.trim())        { setSqMsg({type:'error',text:'Please provide an answer'}); return; }
//     if (!isOAuth && !sq.password) { setSqMsg({type:'error',text:'Enter your current password to confirm'}); return; }
//     setSqBusy(true); setSqMsg({type:'',text:''});
//     try {
//       const res  = await fetch(`${API}/api/auth/security-question`, {
//         method:'PATCH', headers:hdr,
//         body:JSON.stringify({
//           currentPassword:   sq.password,
//           securityQuestion:  sq.question,
//           securityAnswer:    sq.answer.trim().toLowerCase()
//         }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);
//       setSqMsg({type:'success',text:'✓ Security question updated!'});
//       setSq(s => ({ ...s, answer:'', password:'' }));
//     } catch(e) { setSqMsg({type:'error',text:e.message}); }
//     finally { setSqBusy(false); }
//   };

//   const deleteAcc = async () => {
//     if (!isOAuth && !delPw) { setDelMsg({type:'error',text:'Enter your password'}); return; }
//     setDelBusy(true); setDelMsg({type:'',text:''});
//     try {
//       const res  = await fetch(`${API}/api/auth/account`, {
//         method:'DELETE', headers:hdr,
//         body:JSON.stringify({password:delPw})
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message);
//       onLogout();
//     } catch(e) { setDelMsg({type:'error',text:e.message}); setDelBusy(false); }
//   };

//   return (
//     <div>
//       <div className="view-header">
//         <div>
//           <h1 className="view-title">Settings</h1>
//           <p className="view-sub">Manage your account</p>
//         </div>
//       </div>

//       <div className="settings-stack">

//         {/* ── Profile ── sky blue header */}
//         <div className="s-section">
//           <div className="s-head" style={{background: HEAD.profile.bg}}>
//             <h3 style={{color:'#fff'}}>Profile</h3>
//             <p  style={{color: HEAD.profile.sub}}>Your account information</p>
//           </div>
//           <div className="s-body">
//             <div className="profile-row">
//               <div className="profile-av">{(user.name || user.email || 'U')[0].toUpperCase()}</div>
//               <div>
//                 <div className="pname">{user.name || user.email}</div>
//                 <div className="pemail">{user.email}</div>
//                 <div className="pmember">
//                   Member since {new Date(user.createdAt||Date.now()).toLocaleDateString('en-US',{month:'long',year:'numeric'})}
//                 </div>
//                 {isOAuth && (
//                   <div className="pmember" style={{marginTop:4, color:'#5C8001', fontWeight:800}}>
//                     ✓ Signed in with {user.provider}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ── Change Password ── lime green header — hidden for OAuth users */}
//         {!isOAuth && (
//           <div className="s-section">
//             <div className="s-head" style={{background: HEAD.password.bg}}>
//               <h3 style={{color:'#fff'}}>Change Password</h3>
//               <p  style={{color: HEAD.password.sub}}>Keep your account secure</p>
//             </div>
//             <div className="s-body">
//               {pwMsg.text && <div className={`msg ${pwMsg.type}`} style={{marginBottom:16}}>{pwMsg.text}</div>}
//               <form onSubmit={changePw} className="s-form">
//                 <div className="ff">
//                   <label>Current Password</label>
//                   <input type="password" value={pw.current} onChange={e=>setPw(p=>({...p,current:e.target.value}))}
//                     placeholder="••••••••" required autoComplete="current-password" />
//                 </div>
//                 <div className="form-row">
//                   <div className="ff">
//                     <label>New Password</label>
//                     <input type="password" value={pw.next} onChange={e=>setPw(p=>({...p,next:e.target.value}))}
//                       placeholder="Min 6 chars" required minLength={6} autoComplete="new-password" />
//                   </div>
//                   <div className="ff">
//                     <label>Confirm New Password</label>
//                     <input type="password" value={pw.confirm} onChange={e=>setPw(p=>({...p,confirm:e.target.value}))}
//                       placeholder="Repeat" required minLength={6} autoComplete="new-password" />
//                   </div>
//                 </div>
//                 <div>
//                   <button type="submit" className="btn-primary" disabled={pwBusy}>
//                     {pwBusy ? <span className="spinner white"/> : 'Update Password'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* ── Security Question ── forest green header (darkest) */}
//         <div className="s-section">
//           <div className="s-head" style={{background: HEAD.security.bg}}>
//             <h3 style={{color:'#fff'}}>Security Question</h3>
//             <p  style={{color: HEAD.security.sub}}>Used to recover your account without email</p>
//           </div>
//           <div className="s-body">
//             {sqMsg.text && <div className={`msg ${sqMsg.type}`} style={{marginBottom:16}}>{sqMsg.text}</div>}
//             <form onSubmit={updateSq} className="s-form">
//               <div className="ff">
//                 <label>Security Question</label>
//                 <select value={sq.question} onChange={e=>setSq(s=>({...s,question:e.target.value}))}>
//                   {SECURITY_QUESTIONS.map(q=><option key={q} value={q}>{q}</option>)}
//                 </select>
//               </div>
//               <div className="ff">
//                 <label>Your Answer</label>
//                 <input type="text" value={sq.answer} onChange={e=>setSq(s=>({...s,answer:e.target.value}))}
//                   placeholder="Case-insensitive" required autoComplete="off" />
//               </div>
//               {/* OAuth users don't have a local password — skip confirmation */}
//               {!isOAuth && (
//                 <div className="ff">
//                   <label>Confirm with Current Password</label>
//                   <input type="password" value={sq.password} onChange={e=>setSq(s=>({...s,password:e.target.value}))}
//                     placeholder="••••••••" required autoComplete="current-password" />
//                 </div>
//               )}
//               <div>
//                 <button type="submit" className="btn-primary" disabled={sqBusy}>
//                   {sqBusy ? <span className="spinner white"/> : 'Save Security Question'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>

//         {/* ── Danger Zone ── flame orange header */}
//         <div className="s-section">
//           <div className="s-head" style={{background: HEAD.danger.bg}}>
//             <h3 style={{color:'#fff'}}>Danger Zone</h3>
//             <p  style={{color: HEAD.danger.sub}}>Irreversible actions — proceed with caution</p>
//           </div>
//           <div className="s-body">
//             <div className="dz-row">
//               <div>
//                 <div className="dz-title">Delete Account</div>
//                 <div className="dz-sub">
//                   Permanently delete your account and all application data. This cannot be undone.
//                 </div>
//               </div>
//               {!showDel
//                 ? <button className="btn-danger" onClick={()=>setShowDel(true)}>🗑 Delete Account</button>
//                 : (
//                   <div className="del-box">
//                     <div className="del-warn">
//                       ⚠️ This cannot be undone.{' '}
//                       {isOAuth ? 'Confirm deletion below.' : 'Enter your password to confirm deletion.'}
//                     </div>
//                     {delMsg.text && <div className={`msg ${delMsg.type}`} style={{marginBottom:12}}>{delMsg.text}</div>}
//                     {/* Password field only for non-OAuth users */}
//                     {!isOAuth && (
//                       <div className="ff" style={{marginBottom:12}}>
//                         <label>Password</label>
//                         <input type="password" value={delPw} onChange={e=>setDelPw(e.target.value)}
//                           placeholder="Enter your password" autoComplete="current-password" />
//                       </div>
//                     )}
//                     <div style={{display:'flex',gap:10}}>
//                       <button className="btn-danger" onClick={deleteAcc} disabled={delBusy}>
//                         {delBusy ? <span className="spinner white"/> : '🗑 Delete Everything'}
//                       </button>
//                       <button className="btn-ghost" onClick={()=>{setShowDel(false);setDelPw('');setDelMsg({type:'',text:''});}}>
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 )
//               }
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

// Per-section header colours — darkest shades from brand palette
const HEAD = {
  profile:  { bg: '#5BC0EB', text: '#fff' },   // Sky blue
  password: { bg: '#FBB02D', sub: 'rgba(255,255,255,0.75)' },  // lime green
  security: { bg: '#7CB518', sub: 'rgba(255,255,255,0.75)' }, 
  danger:   { bg: '#d94f00', text: '#fff' },   // Flame dark
};

// Avatar colour cycles through brand palette based on first letter
const AV_COLORS = ['#5BC0EB', '#7CB518', '#FB6107', '#5C8001', '#F3DE2C'];
const getAvColor = (str = 'U') => AV_COLORS[str.charCodeAt(0) % AV_COLORS.length];

// ─────────────────────────────────────────────────────────────────
// OAuth detection — triple-check to cover all backend serialisation
// variants: oauthProvider field set OR password is null/absent
// ─────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────
// OAuth detection — only true when oauthProvider is explicitly a
// non-empty string ('google' or 'github').
//
// IMPORTANT:
//   • Email users  → oauthProvider: null   → returns false → show password fields
//   • Google users → oauthProvider: 'google' → returns true  → hide password fields
//   • GitHub users → oauthProvider: 'github' → returns true  → hide password fields
//
// We NEVER use `user.password` for this check — userDTO doesn't send it,
// so it is always `undefined` for every user and would give false positives.
//
// If the stored user object (localStorage) predates the Auth.js fix and is
// missing oauthProvider, the user will be treated as a local account (safe
// default — they see the password field, which is correct for email users).
// ─────────────────────────────────────────────────────────────────
function detectOAuth(user) {
  if (!user) return false;
  const p = user.oauthProvider;
  // Only true when oauthProvider is a non-empty, non-null string
  return typeof p === 'string' && p.length > 0;
}

export default function Settings({ user, token, onLogout }) {
  // isOAuthUser — true when signed in via Google / GitHub
  const isOAuthUser = detectOAuth(user);
  // Which provider name to display ('google', 'github', or generic 'OAuth')
  const providerName = user?.oauthProvider || user?.provider || 'OAuth';

  // ── Self-heal: if stored user is missing oauthProvider (old localStorage),
  // fetch /me to get the fresh user object so OAuth detection works correctly.
  useEffect(() => {
    if (user && !('oauthProvider' in user)) {
      fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.ok ? r.json() : null)
        .then(fresh => {
          if (fresh && typeof fresh.oauthProvider !== 'undefined') {
            // Merge oauthProvider into stored user and persist
            const updated = { ...user, oauthProvider: fresh.oauthProvider };
            localStorage.setItem('kv_user', JSON.stringify(updated));
            // Reload page so Settings re-mounts with the correct user object
            window.location.reload();
          }
        })
        .catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  /* ── Change password ── */
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

  /* ── Security question ── */
  const updateSq = async (e) => {
    e.preventDefault();
    if (!sq.answer.trim()) { setSqMsg({ type: 'error', text: 'Please provide an answer' }); return; }
    // Only require password confirmation for local (non-OAuth) accounts
    if (!isOAuthUser && !sq.password) {
      setSqMsg({ type: 'error', text: 'Enter your current password to confirm' });
      return;
    }
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

  /* ── Delete account ── */
  const deleteAcc = async () => {
    // OAuth users have no password — skip the check
    if (!isOAuthUser && !delPw) {
      setDelMsg({ type: 'error', text: 'Enter your password' });
      return;
    }
    setDelBusy(true); setDelMsg({ type: '', text: '' });
    try {
      const res  = await fetch(`${API}/api/auth/account`, {
        method: 'DELETE', headers: hdr,
        body: JSON.stringify({ password: delPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onLogout();
    } catch (e) { setDelMsg({ type: 'error', text: e.message }); setDelBusy(false); }
  };

  // Avatar
  const initials = (user.name || user.email || 'U')[0].toUpperCase();
  const avBg     = getAvColor(initials);
  const avText   = avBg === '#F3DE2C' ? '#000' : '#fff';

  return (
    <div>
      <div className="view-header">
        <div>
          <h1 className="view-title">Settings</h1>
          <p className="view-sub">Manage your account</p>
        </div>
      </div>

      <div className="settings-stack">

        {/* ══ PROFILE ══════════════════════════════════════════════ */}
        <div className="s-section">
          <div className="s-head"
            style={{ background: HEAD.profile.bg, borderBottom: '2px solid rgba(0,0,0,0.12)' }}>
            <h3 style={{ color: HEAD.profile.text }}>👤 Profile</h3>
            <p  style={{ color: 'rgba(255,255,255,0.8)' }}>Your account information</p>
          </div>
          <div className="s-body">
            <div className="profile-row">
              {/* Coloured avatar — hue based on first initial */}
              <div className="profile-av"
                style={{ background: avBg, color: avText, boxShadow: `0 4px 16px ${avBg}77` }}>
                {initials}
              </div>
              <div>
                <div className="pname">{user.name || user.email}</div>
                <div className="pemail">{user.email}</div>
                <div className="pmember">
                  Member since {new Date(user.createdAt || Date.now())
                    .toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                {/* OAuth badge — only when signed in via Google / GitHub */}
                {isOAuthUser && (
                  <div style={{
                    marginTop: 8,
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: '#f1f8de', border: '1.5px solid #7CB518',
                    borderRadius: 20, padding: '3px 12px',
                    fontSize: 12, fontWeight: 800, color: '#4a6601',
                    textTransform: 'capitalize',
                  }}>
                    ✓ Signed in with {providerName}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ══ CHANGE PASSWORD — hidden entirely for OAuth users ═════
            OAuth users have password: null in DB — there's nothing to change */}
        {!isOAuthUser && (
          <div className="s-section">
            <div className="s-head"
              style={{ background: HEAD.password.bg, borderBottom: '2px solid rgba(0,0,0,0.12)' }}>
              <h3 style={{ color: HEAD.password.text }}>🔑 Change Password</h3>
              <p  style={{ color: 'rgba(255,255,255,0.75)' }}>Keep your account secure</p>
            </div>
            <div className="s-body">
              {pwMsg.text && (
                <div className={`msg ${pwMsg.type}`} style={{ marginBottom: 16 }}>
                  {pwMsg.text}
                </div>
              )}
              <form onSubmit={changePw} className="s-form">
                <div className="ff">
                  <label>Current Password</label>
                  <input
                    type="password" value={pw.current}
                    onChange={e => setPw(p => ({ ...p, current: e.target.value }))}
                    placeholder="••••••••" required autoComplete="current-password"
                  />
                </div>
                <div className="form-row">
                  <div className="ff">
                    <label>New Password</label>
                    <input
                      type="password" value={pw.next}
                      onChange={e => setPw(p => ({ ...p, next: e.target.value }))}
                      placeholder="Min 6 chars" required minLength={6} autoComplete="new-password"
                    />
                  </div>
                  {/* ── Confirm Password — only shown for local (email) accounts ── */}
                  {!isOAuthUser && (
                    <div className="ff">
                      <label>Confirm New Password</label>
                      <input
                        type="password" value={pw.confirm}
                        onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))}
                        placeholder="Repeat" required minLength={6} autoComplete="new-password"
                      />
                    </div>
                  )}
                </div>
                <div>
                  {/* Update Password — Sunflower Gold #FBB02D */}
                  <button type="submit" className="btn-gold" disabled={pwBusy}>
                    {pwBusy ? <span className="spinner dark" /> : '🔑 Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ══ SECURITY QUESTION ════════════════════════════════════ */}
        <div className="s-section">
          <div className="s-head"
            style={{ background: HEAD.security.bg, borderBottom: '2px solid rgba(0,0,0,0.12)' }}>
            <h3 style={{ color: HEAD.security.text }}>🔐 Security Question</h3>
            <p  style={{ color: 'rgba(255,255,255,0.75)' }}>Used to recover your account without email</p>
          </div>
          <div className="s-body">
            {sqMsg.text && (
              <div className={`msg ${sqMsg.type}`} style={{ marginBottom: 16 }}>
                {sqMsg.text}
              </div>
            )}
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
                <input
                  type="text" value={sq.answer}
                  onChange={e => setSq(s => ({ ...s, answer: e.target.value }))}
                  placeholder="Case-insensitive" required autoComplete="off"
                />
              </div>

              {/* ── Confirm with Current Password
                  Hidden for OAuth users — they have no local password to confirm with ── */}
              {!isOAuthUser && (
                <div className="ff">
                  <label>Confirm with Current Password</label>
                  <input
                    type="password" value={sq.password}
                    onChange={e => setSq(s => ({ ...s, password: e.target.value }))}
                    placeholder="••••••••" required autoComplete="current-password"
                  />
                </div>
              )}

              <div>
                <button type="submit" className="btn-primary" disabled={sqBusy}>
                  {sqBusy ? <span className="spinner white" /> : 'Save Security Question'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ══ DANGER ZONE ══════════════════════════════════════════ */}
        <div className="s-section">
          <div className="s-head"
            style={{ background: HEAD.danger.bg, borderBottom: '2px solid rgba(0,0,0,0.12)' }}>
            <h3 style={{ color: HEAD.danger.text }}>⚠️ Danger Zone</h3>
            <p  style={{ color: 'rgba(255,255,255,0.75)' }}>Irreversible actions — proceed with caution</p>
          </div>
          <div className="s-body">
            <div className="dz-row">
              <div>
                <div className="dz-title">Delete Account</div>
                <div className="dz-sub">
                  Permanently delete your account and all application data. This cannot be undone.
                </div>
              </div>
              {!showDel
                ? (
                  <button className="btn-danger" onClick={() => setShowDel(true)}>
                    🗑 Delete Account
                  </button>
                ) : (
                  <div className="del-box">
                    <div className="del-warn">
                      ⚠️ This cannot be undone.{' '}
                      {isOAuthUser
                        ? 'Click the button below to permanently delete your account.'
                        : 'Enter your password to confirm deletion.'}
                    </div>
                    {delMsg.text && (
                      <div className={`msg ${delMsg.type}`} style={{ marginBottom: 12 }}>
                        {delMsg.text}
                      </div>
                    )}
                    {/* ── Password field — hidden for OAuth users ── */}
                    {!isOAuthUser && (
                      <div className="ff" style={{ marginBottom: 12 }}>
                        <label>Password</label>
                        <input
                          type="password" value={delPw}
                          onChange={e => setDelPw(e.target.value)}
                          placeholder="Enter your password" autoComplete="current-password"
                        />
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button className="btn-danger" onClick={deleteAcc} disabled={delBusy}>
                        {delBusy ? <span className="spinner white" /> : '🗑 Delete Everything'}
                      </button>
                      <button className="btn-ghost"
                        onClick={() => {
                          setShowDel(false);
                          setDelPw('');
                          setDelMsg({ type: '', text: '' });
                        }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}