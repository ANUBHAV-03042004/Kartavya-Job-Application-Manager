import React, { useState, useEffect, useRef, useCallback } from 'react';
import AuthPage  from './auth/AuthPage';
import Dashboard from './components/Dashboard';
import './styles.css';

// ── Idle logout ────────────────────────────────────────────────────
// 45 minutes of inactivity → auto-logout
// "Activity" = any mouse move, click, keypress, scroll, or touch
const IDLE_MS = 45 * 60 * 1000; 

export default function App() {
  const [user,       setUser]       = useState(null);
  const [token,      setToken]      = useState(null);
  const [oauthError, setOauthError] = useState('');

  // Ref so the timer callback always has the latest logout function
  const idleTimer   = useRef(null);
  const isLoggedIn  = useRef(false);


  const handleLogout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('kv_token');
    localStorage.removeItem('kv_user');
    localStorage.removeItem('kv_last_active');
    isLoggedIn.current = false;
    clearTimeout(idleTimer.current);
  }, []);


  const resetIdleTimer = useCallback(() => {
    if (!isLoggedIn.current) return;
    clearTimeout(idleTimer.current);

    localStorage.setItem('kv_last_active', Date.now().toString());
    idleTimer.current = setTimeout(() => {
      if (isLoggedIn.current) handleLogout();
    }, IDLE_MS);
  }, [handleLogout]);


  useEffect(() => {
    if (!token) return;            
    isLoggedIn.current = true;

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(e => window.addEventListener(e, resetIdleTimer, { passive: true }));
    resetIdleTimer();                   

    return () => {
      events.forEach(e => window.removeEventListener(e, resetIdleTimer));
      clearTimeout(idleTimer.current);
    };
  }, [token, resetIdleTimer]);


  const checkStaleSession = () => {
    const lastActive = localStorage.getItem('kv_last_active');
    if (lastActive && Date.now() - parseInt(lastActive, 10) > IDLE_MS) {
      localStorage.removeItem('kv_token');
      localStorage.removeItem('kv_user');
      localStorage.removeItem('kv_last_active');
      return false;  
    }
    return true;
  };


  useEffect(() => {
    const params   = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const urlUser  = params.get('user');
    const urlError = params.get('error');

    if (urlError) {
      setOauthError(
        urlError === 'google_failed' ? 'Google sign-in failed. Please try again.' :
        urlError === 'github_failed' ? 'GitHub sign-in failed. Please try again.' :
        'Sign-in failed. Please try again.'
      );
      window.history.replaceState({}, document.title, window.location.pathname);

    } else if (urlToken && urlUser) {
  
      try {
        const parsedUser = JSON.parse(decodeURIComponent(urlUser));
        setToken(urlToken);
        setUser(parsedUser);
        localStorage.setItem('kv_token', urlToken);
        localStorage.setItem('kv_user', JSON.stringify(parsedUser));
        localStorage.setItem('kv_last_active', Date.now().toString());
      } catch {}
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    try {
      const t = localStorage.getItem('kv_token');
      const u = localStorage.getItem('kv_user');
      if (t && u && checkStaleSession()) {
        setToken(t);
        setUser(JSON.parse(u));
      }
    } catch {}
  }, []);

  const handleAuth = ({ token, user }) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('kv_token', token);
    localStorage.setItem('kv_user', JSON.stringify(user));
    localStorage.setItem('kv_last_active', Date.now().toString());
  };


  const updateUser = (u) => {
    setUser(u);
    localStorage.setItem('kv_user', JSON.stringify(u));
  };

  if (!user || !token)
    return <AuthPage onAuthSuccess={handleAuth} oauthError={oauthError} />;

  return (
    <Dashboard
      user={user}
      token={token}
      onLogout={handleLogout}
      onUserUpdate={updateUser}
    />
  );
}