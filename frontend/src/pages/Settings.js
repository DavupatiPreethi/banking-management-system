import React from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Settings</h1>
          <p className="page-sub">Manage your account settings and preferences.</p>
        </div>

        {/* Profile Card */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, fontWeight: 800, color: 'var(--navy)', flexShrink: 0
            }}>{initials}</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--navy)' }}>{user?.fullName}</div>
              <div style={{ fontSize: 14, color: 'var(--gray-600)', marginTop: 2 }}>{user?.email}</div>
              <span style={{ marginTop: 6, display: 'inline-block', padding: '3px 10px', background: 'rgba(201,168,76,0.15)', color: 'var(--gold)', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{user?.role}</span>
            </div>
          </div>
        </div>

        <div className="grid-2">
          {/* Account Info */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 18 }}>Account Information</h3>
            {[
              ['Full Name', user?.fullName],
              ['Email', user?.email],
              ['Role', user?.role],
              ['Status', 'Active'],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--gray-100)' }}>
                <span style={{ fontSize: 13, color: 'var(--gray-600)', fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)' }}>{val || '—'}</span>
              </div>
            ))}
          </div>

          {/* Security */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 18 }}>Security & Privacy</h3>
            {[
              ['🔒', 'SSL Encryption', '256-bit TLS encryption active'],
              ['🛡', 'JWT Authentication', 'Token-based secure login'],
              ['🔐', 'Session Management', 'Stateless, secure sessions'],
              ['✅', 'Data Privacy', 'Your data is never shared'],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ display: 'flex', gap: 14, marginBottom: 16, padding: '12px', background: 'var(--off-white)', borderRadius: 8 }}>
                <span style={{ fontSize: 22 }}>{icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{title}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-600)', marginTop: 2 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginTop: 20, borderLeft: '4px solid var(--red)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--red)' }}>Danger Zone</h3>
          <p style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 16 }}>Signing out will end your current session.</p>
          <button className="btn-outline" onClick={() => { logout(); navigate('/login'); }}
            style={{ color: 'var(--red)', borderColor: 'var(--red)' }}>
            ⏻ Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
