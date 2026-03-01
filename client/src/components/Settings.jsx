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

export default function Settings({ user, token, onLogout }) {
  const [pw,    setPw]    = useState({ current:'', next:'', confirm:'' });
  const [pwMsg, setPwMsg] = useState({ type:'', text:'' });
  const [pwBusy,setPwBusy]= useState(false);

  const [sq,    setSq]    = useState({ question: SECURITY_QUESTIONS[0], answer:'', password:'' });
  const [sqMsg, setSqMsg] = useState({ type:'', text:'' });
  const [sqBusy,setSqBusy]= useState(false);

  const [delPw,   setDelPw]   = useState('');
  const [delMsg,  setDelMsg]  = useState({ type:'', text:'' });
  const [delBusy, setDelBusy] = useState(false);
  const [showDel, setShowDel] = useState(false);

  const hdr = { 'Content-Type':'application/json', Authorization:`Bearer ${token}` };

  // Change Password
  const changePw = async (e) => {
    e.preventDefault();
    if (pw.next !== pw.confirm) { setPwMsg({type:'error',text:"Passwords don't match"}); return; }
    if (pw.next.length < 6)    { setPwMsg({type:'error',text:'Min 6 characters'}); return; }
    setPwBusy(true); setPwMsg({type:'',text:''});
    try {
      const res  = await fetch(`${API}/api/auth/change-password`, { method:'PATCH', headers:hdr, body:JSON.stringify({currentPassword:pw.current,newPassword:pw.next}) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPwMsg({type:'success',text:'Password updated!'});
      setPw({current:'',next:'',confirm:''});
    } catch(e) { setPwMsg({type:'error',text:e.message}); }
    finally { setPwBusy(false); }
  };

  // Update Security Question
  const updateSq = async (e) => {
    e.preventDefault();
    if (!sq.answer.trim()) { setSqMsg({type:'error',text:'Please provide an answer'}); return; }
    if (!sq.password)      { setSqMsg({type:'error',text:'Enter your current password to confirm'}); return; }
    setSqBusy(true); setSqMsg({type:'',text:''});
    try {
      const res  = await fetch(`${API}/api/auth/security-question`, {
        method:'PATCH', headers:hdr,
        body: JSON.stringify({ currentPassword: sq.password, securityQuestion: sq.question, securityAnswer: sq.answer.trim().toLowerCase() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSqMsg({type:'success',text:'Security question updated!'});
      setSq(s=>({...s, answer:'', password:''}));
    } catch(e) { setSqMsg({type:'error',text:e.message}); }
    finally { setSqBusy(false); }
  };

  // Delete Account
  const deleteAcc = async () => {
    if (!delPw) { setDelMsg({type:'error',text:'Enter your password'}); return; }
    setDelBusy(true); setDelMsg({type:'',text:''});
    try {
      const res  = await fetch(`${API}/api/auth/account`, { method:'DELETE', headers:hdr, body:JSON.stringify({password:delPw}) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onLogout();
    } catch(e) { setDelMsg({type:'error',text:e.message}); setDelBusy(false); }
  };

  return (
    <div>
      <div className="view-header">
        <div><h1 className="view-title">Settings</h1><p className="view-sub">Manage your account</p></div>
      </div>

      <div className="settings-stack">
        {/* Profile */}
        <div className="s-section">
          <div className="s-head"><h3>Profile</h3><p>Your account info</p></div>
          <div className="s-body">
            <div className="profile-row">
              <div className="profile-av">{user.name[0].toUpperCase()}</div>
              <div>
                <div className="pname">{user.name}</div>
                <div className="pemail">{user.email}</div>
                <div className="pmember">Member since {new Date(user.createdAt||Date.now()).toLocaleDateString('en-US',{month:'long',year:'numeric'})}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="s-section">
          <div className="s-head"><h3>Change Password</h3><p>Keep your account secure</p></div>
          <div className="s-body">
            {pwMsg.text && <div className={`msg ${pwMsg.type}`} style={{marginBottom:16}}>{pwMsg.text}</div>}
            <form onSubmit={changePw} className="s-form">
              <div className="ff"><label>Current Password</label><input type="password" value={pw.current} onChange={e=>setPw(p=>({...p,current:e.target.value}))} placeholder="••••••••" required autoComplete="current-password" /></div>
              <div className="form-row">
                <div className="ff"><label>New Password</label><input type="password" value={pw.next} onChange={e=>setPw(p=>({...p,next:e.target.value}))} placeholder="Min 6 chars" required minLength={6} autoComplete="new-password" /></div>
                <div className="ff"><label>Confirm New Password</label><input type="password" value={pw.confirm} onChange={e=>setPw(p=>({...p,confirm:e.target.value}))} placeholder="Repeat" required minLength={6} autoComplete="new-password" /></div>
              </div>
              <div><button type="submit" className="btn-primary" disabled={pwBusy}>{pwBusy?<span className="spinner white"/>:'Update Password'}</button></div>
            </form>
          </div>
        </div>

        {/* Security Question */}
        <div className="s-section">
          <div className="s-head">
            <h3>🔐 Security Question</h3>
            <p>Used to recover your account without email — keep this updated</p>
          </div>
          <div className="s-body">
            {sqMsg.text && <div className={`msg ${sqMsg.type}`} style={{marginBottom:16}}>{sqMsg.text}</div>}
            <form onSubmit={updateSq} className="s-form">
              <div className="ff">
                <label>Security Question</label>
                <select value={sq.question} onChange={e=>setSq(s=>({...s,question:e.target.value}))}>
                  {SECURITY_QUESTIONS.map(q=><option key={q} value={q}>{q}</option>)}
                </select>
              </div>
              <div className="ff">
                <label>New Answer</label>
                <input type="text" value={sq.answer} onChange={e=>setSq(s=>({...s,answer:e.target.value}))} placeholder="Case-insensitive" required autoComplete="off" />
              </div>
              <div className="ff">
                <label>Confirm with Current Password</label>
                <input type="password" value={sq.password} onChange={e=>setSq(s=>({...s,password:e.target.value}))} placeholder="••••••••" required autoComplete="current-password" />
              </div>
              <div><button type="submit" className="btn-primary" disabled={sqBusy}>{sqBusy?<span className="spinner white"/>:'Update Security Question'}</button></div>
            </form>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="s-section danger">
          <div className="s-head danger-head"><h3>Danger Zone</h3><p>Irreversible actions</p></div>
          <div className="s-body">
            <div className="dz-row">
              <div>
                <div className="dz-title">Delete Account</div>
                <div className="dz-sub">Permanently delete your account and all application data.</div>
              </div>
              {!showDel
                ? <button className="btn-danger" onClick={()=>setShowDel(true)}>Delete Account</button>
                : (
                  <div className="del-box">
                    <div className="del-warn">⚠️ This cannot be undone. Enter your password to confirm.</div>
                    {delMsg.text && <div className={`msg ${delMsg.type}`} style={{marginBottom:12}}>{delMsg.text}</div>}
                    <div className="ff" style={{marginBottom:12}}><label>Password</label><input type="password" value={delPw} onChange={e=>setDelPw(e.target.value)} placeholder="Enter your password" autoComplete="current-password"/></div>
                    <div style={{display:'flex',gap:10}}>
                      <button className="btn-danger" onClick={deleteAcc} disabled={delBusy}>{delBusy?<span className="spinner white"/>:'🗑 Delete Everything'}</button>
                      <button className="btn-ghost" onClick={()=>{setShowDel(false);setDelPw('');setDelMsg({type:'',text:''});}}>Cancel</button>
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