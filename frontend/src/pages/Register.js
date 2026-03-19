import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await registerUser(form);
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <div className="brand-logo">
          <div className="brand-logo-icon">🏦</div>
          <div className="brand-logo-text">Nova<span>Bank</span></div>
        </div>
        <h1 className="brand-headline">Open your<br /><span>account today</span></h1>
        <p className="brand-sub">Join thousands of customers who trust NovaBank for secure, seamless digital banking.</p>
        <div className="brand-stats">
          <div className="brand-stat">
            <div className="brand-stat-num">0 fees</div>
            <div className="brand-stat-label">Account Opening</div>
          </div>
          <div className="brand-stat">
            <div className="brand-stat-num">256-bit</div>
            <div className="brand-stat-label">Encryption</div>
          </div>
          <div className="brand-stat">
            <div className="brand-stat-num">24/7</div>
            <div className="brand-stat-label">Support</div>
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-box">
          <h2 className="auth-form-title">Create account</h2>
          <p className="auth-form-sub">Fill in your details to get started</p>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" type="text" name="fullName"
                placeholder="John Doe" value={form.fullName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" name="email"
                placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" type="tel" name="phone"
                placeholder="+91 9876543210" value={form.phone} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" name="password"
                placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account? <a onClick={() => navigate('/login')}>Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
}
