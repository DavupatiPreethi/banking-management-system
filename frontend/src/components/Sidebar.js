import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { icon: '▦', label: 'Dashboard', path: '/dashboard' },
  { icon: '💳', label: 'Accounts', path: '/accounts' },
  { icon: '↔', label: 'Transfer', path: '/transfer' },
  { icon: '📊', label: 'Transactions', path: '/transactions' },
  { icon: '⚙', label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🏦</div>
        <div className="sidebar-logo-text">Nova<span>Bank</span></div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-badge">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.fullName}</div>
            <div className="user-role">{user?.role}</div>
          </div>
          <button className="logout-btn" onClick={() => { logout(); navigate('/login'); }} title="Logout">
            ⏻
          </button>
        </div>
      </div>
    </div>
  );
}
