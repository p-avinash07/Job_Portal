import React, { useState, useEffect } from 'react';
import { Moon, Sun, Bell, User, Lock, Mail, Save } from 'lucide-react';

const Settings = ({ user }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [appUpdates, setAppUpdates] = useState(true);

  useEffect(() => {
    // Check local storage or body class on mount
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || document.body.classList.contains('dark')) {
      setIsDarkMode(true);
      document.body.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.body.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Account Settings</h1>
        <p>Manage your preferences, profile details, and account security.</p>
      </div>

      <div style={{ display: 'grid', gap: '30px', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
        
        {/* Profile Settings */}
        <div className="card" style={{ marginBottom: 0 }}>
          <h2 className="section-title" style={{ marginTop: 0, fontSize: '18px' }}><User size={20} color="var(--primary)" /> Profile Details</h2>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" className="form-input" value={user?.name || user?.username || ''} disabled style={{ background: 'var(--bg)', opacity: 0.8 }} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-input" value={user?.email || ''} disabled style={{ background: 'var(--bg)', opacity: 0.8 }} />
          </div>
          <div className="form-group">
            <label>Account Role</label>
            <input type="text" className="form-input" value={user?.role || ''} disabled style={{ background: 'var(--bg)', opacity: 0.8 }} />
          </div>
        </div>

        {/* Preferences */}
        <div className="card" style={{ marginBottom: 0 }}>
          <h2 className="section-title" style={{ marginTop: 0, fontSize: '18px' }}><Moon size={20} color="var(--primary)" /> Preferences</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text)' }}>Appearance</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Toggle between light UI and dark mode</div>
            </div>
            <button 
              onClick={toggleDarkMode}
              style={{
                background: isDarkMode ? 'var(--primary)' : 'var(--bg)',
                border: '1px solid var(--border)',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDarkMode ? '#FFFFFF' : 'var(--text)'
              }}
            >
              {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>

          <h2 className="section-title" style={{ marginTop: '25px', fontSize: '18px' }}><Bell size={20} color="var(--primary)" /> Notifications</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Mail size={18} color="var(--text-muted)" />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text)' }}>Email Alerts</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Receive updates straight to your inbox</div>
              </div>
            </div>
            <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" checked={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} />
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Bell size={18} color="var(--text-muted)" />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text)' }}>App Updates</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Status changes on your applications</div>
              </div>
            </div>
            <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="checkbox" checked={appUpdates} onChange={() => setAppUpdates(!appUpdates)} style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} />
            </label>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
