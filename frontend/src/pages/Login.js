import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login, sessionExpired, clearSessionExpired } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionExpired) {
      setError('Your session has expired. Please sign in again.');
    }
    if (sessionStorage.getItem('sessionExpired')) {
      setError('Your session has expired. Please sign in again.');
      sessionStorage.removeItem('sessionExpired');
    }
    return () => clearSessionExpired();
  }, [sessionExpired, clearSessionExpired]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error && !error.includes('expired')) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data;
      setError(typeof msg === 'string' ? msg : 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <div className="brand-logo">
          <div className="brand-logo-icon">🏦</div>
          <div className="brand-logo-text">Nova<span>Bank</span></div>
        </div>
        <h1 className="brand-headline">Banking made<br /><span>simple & secure</span></h1>
        <p className="brand-sub">Experience next-generation banking with real-time transfers, smart analytics, and enterprise-grade security.</p>
        <div className="brand-stats">
          <div className="brand-stat">
            <div className="brand-stat-num">₹2.4B+</div>
            <div className="brand-stat-label">Transactions</div>
          </div>
          <div className="brand-stat">
            <div className="brand-stat-num">50K+</div>
            <div className="brand-stat-label">Customers</div>
          </div>
          <div className="brand-stat">
            <div className="brand-stat-num">99.9%</div>
            <div className="brand-stat-label">Uptime</div>
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-box">
          <h2 className="auth-form-title">Welcome back</h2>
          <p className="auth-form-sub">Sign in to your account to continue</p>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" name="email"
                placeholder="you@example.com" value={form.email}
                onChange={handleChange} required autoComplete="email" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" name="password"
                placeholder="Enter your password" value={form.password}
                onChange={handleChange} required autoComplete="current-password" />
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account? <a onClick={() => navigate('/register')}>Create one</a>
          </div>
        </div>
      </div>
    </div>
  );
}
