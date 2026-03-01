import React, { useState } from 'react';

const API = import.meta.env.VITE_API_BASE_URL || 'https://kartavya-job-application-manager.onrender.com';

export default function Settings({ user, token, onLogout, onUserUpdate }) {
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwMsg,  setPwMsg]  = useState({ type: '', text: '' });
  const [pwBusy, setPwBusy] = useState(false);

  const [delPass,    setDelPass]    = useState('');
  const [delMsg,     setDelMsg]     = useState({ type: '', text: '' });
  const [delBusy,    setDelBusy]    = useState(false);
  const [delConfirm, setDelConfirm] = useState(false);

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const handlePwChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { setPwMsg({ type: 'error', text: "Passwords don't match" }); return; }
    if (pwForm.newPassword.length < 6)         { setPwMsg({ type: 'error', text: 'Minimum 6 characters' }); return; }
    setPwBusy(true); setPwMsg({ type: '', text: '' });
    try {
      const res  = await fetch(`${API}/api/auth/change-password`, {
        method: 'PATCH', headers,
        body:   JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPwMsg({ type: 'success', text: 'Password changed successfully!' });
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setPwMsg({ type: 'error', text: err.message });
    } finally { setPwBusy(false); }
  };

  const handleDeleteAccount = async () => {
    if (!delPass) { setDelMsg({ type: 'error', text: 'Enter your password to confirm' }); return; }
    setDelBusy(true); setDelMsg({ type: '', text: '' });
    try {
      const res  = await fetch(`${API}/api/auth/account`, {
        method: 'DELETE', headers, body: JSON.stringify({ password: delPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onLogout();
    } catch (err) {
      setDelMsg({ type: 'error', text: err.message });
      setDelBusy(false);
    }
  };

  return (
    <div>
      <div className="view-header">
        <div>
          <h1 className="view-title">Settings</h1>
          <p className="view-sub">Manage your account and preferences</p>
        </div>
      </div>

      <div className="settings-stack">
        {/* Profile */}
        <div className="settings-section">
          <div className="settings-section-head">
            <h3>Profile</h3>
            <p>Your account information</p>
          </div>
          <div className="settings-body">
            <div className="profile-display">
              <div className="profile-avatar-lg">{user.name[0].toUpperCase()}</div>
              <div>
                <div className="pname">{user.name}</div>
                <div className="pemail">{user.email}</div>
                <div className="pmember">
                  Member since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="settings-section">
          <div className="settings-section-head">
            <h3>Change Password</h3>
            <p>Use a strong password you haven't used before</p>
          </div>
          <div className="settings-body">
            {pwMsg.text && <div className={`msg ${pwMsg.type}`} style={{ marginBottom: 16 }}>{pwMsg.text}</div>}
            <form onSubmit={handlePwChange} className="settings-form">
              <div className="ff">
                <label>Current Password</label>
                <input type="password" value={pwForm.currentPassword}
                  onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                  placeholder="••••••••" required autoComplete="current-password" />
              </div>
              <div className="form-row">
                <div className="ff">
                  <label>New Password</label>
                  <input type="password" value={pwForm.newPassword}
                    onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                    placeholder="Min 6 characters" required minLength={6} autoComplete="new-password" />
                </div>
                <div className="ff">
                  <label>Confirm New Password</label>
                  <input type="password" value={pwForm.confirm}
                    onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                    placeholder="Repeat new password" required minLength={6} autoComplete="new-password" />
                </div>
              </div>
              <div>
                <button type="submit" className="btn-primary" disabled={pwBusy}>
                  {pwBusy ? <span className="spinner" /> : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-section">
          <div className="settings-section-head" style={{ borderBottom: '1px solid rgba(241,91,181,0.2)' }}>
            <h3 style={{ color: 'var(--pink)' }}>Danger Zone</h3>
            <p>Irreversible and destructive actions</p>
          </div>
          <div className="settings-body">
            <div className="danger-zone">
              <div>
                <div className="dz-title">Delete Account</div>
                <div className="dz-sub">
                  Permanently delete your account and all job application data. This cannot be undone.
                </div>
              </div>
              {!delConfirm ? (
                <button className="btn-danger" onClick={() => setDelConfirm(true)}>
                  Delete Account
                </button>
              ) : (
                <div className="del-confirm-box" style={{ width: '100%', marginTop: 16 }}>
                  <div className="del-warning">
                    ⚠️ This will permanently delete your account and all your applications.
                    Type your password to confirm.
                  </div>
                  {delMsg.text && <div className={`msg ${delMsg.type}`} style={{ marginBottom: 12 }}>{delMsg.text}</div>}
                  <div className="ff" style={{ marginBottom: 12 }}>
                    <label>Password</label>
                    <input type="password" value={delPass}
                      onChange={e => setDelPass(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password" />
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn-danger" onClick={handleDeleteAccount} disabled={delBusy}>
                      {delBusy ? <span className="spinner" /> : '🗑 Yes, Delete Everything'}
                    </button>
                    <button className="btn-ghost" onClick={() => { setDelConfirm(false); setDelPass(''); setDelMsg({ type: '', text: '' }); }}>
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