import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { getMyAccounts, transfer } from '../services/api';

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

export default function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({ fromAccountNumber: '', toAccountNumber: '', amount: '', description: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMyAccounts().then(res => {
      setAccounts(res.data);
      if (res.data.length > 0) setForm(f => ({ ...f, fromAccountNumber: res.data[0].accountNumber }));
    });
  }, []);

  const selectedAccount = accounts.find(a => a.accountNumber === form.fromAccountNumber);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg({ type: '', text: '' });
    try {
      await transfer({ ...form, amount: parseFloat(form.amount) });
      setMsg({ type: 'success', text: `₹${form.amount} transferred successfully!` });
      setForm(f => ({ ...f, toAccountNumber: '', amount: '', description: '' }));
      const res = await getMyAccounts();
      setAccounts(res.data);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data || 'Transfer failed. Please try again.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Fund Transfer</h1>
          <p className="page-sub">Transfer money between accounts instantly and securely.</p>
        </div>

        <div className="grid-2" style={{ alignItems: 'start' }}>
          {/* Transfer Form */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 6 }}>Make a Transfer</h3>
            <p style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 24 }}>
              Enter the destination account number and amount.
            </p>

            {msg.text && <div className={msg.type === 'success' ? 'success-msg' : 'error-msg'}>{msg.text}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">From Account</label>
                <select className="form-select" value={form.fromAccountNumber}
                  onChange={(e) => setForm({ ...form, fromAccountNumber: e.target.value })}>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.accountNumber}>
                      {acc.accountNumber} — {acc.accountType} ({fmt(acc.balance)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">To Account Number</label>
                <input className="form-input" type="text" placeholder="Enter recipient account number"
                  value={form.toAccountNumber} onChange={(e) => setForm({ ...form, toAccountNumber: e.target.value })} required />
              </div>

              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input className="form-input" type="number" min="0.01" step="0.01"
                  placeholder="0.00" value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
              </div>

              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <input className="form-input" type="text" placeholder="e.g. Rent payment"
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>

              <button className="btn-primary" type="submit" disabled={loading || accounts.length === 0}>
                {loading ? 'Processing...' : '↔ Transfer Funds'}
              </button>
            </form>
          </div>

          {/* Account Balance Info */}
          <div>
            {selectedAccount && (
              <div className="account-card" style={{ marginBottom: 16 }}>
                <div className="account-card-status">{selectedAccount.status}</div>
                <div className="account-card-type">{selectedAccount.accountType.replace('_', ' ')} Account</div>
                <div className="account-card-num">{selectedAccount.accountNumber}</div>
                <div className="account-card-balance-label">Available Balance</div>
                <div className="account-card-balance">{fmt(selectedAccount.balance)}</div>
              </div>
            )}

            <div className="card">
              <h4 style={{ fontWeight: 700, marginBottom: 14 }}>Transfer Tips</h4>
              {[
                ['🔒', 'Secure', 'All transfers are encrypted with 256-bit SSL.'],
                ['⚡', 'Instant', 'Transfers reflect instantly in both accounts.'],
                ['✅', 'Verified', 'Double-check the account number before sending.'],
              ].map(([icon, title, desc]) => (
                <div key={title} style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                  <span style={{ fontSize: 20 }}>{icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{title}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-600)', marginTop: 2 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
