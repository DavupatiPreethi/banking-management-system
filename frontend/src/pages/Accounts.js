import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { getMyAccounts, createAccount, deposit, withdraw } from '../services/api';

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // 'create' | 'deposit' | 'withdraw'
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchAccounts = async () => {
    try {
      const res = await getMyAccounts();
      setAccounts(res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAccounts(); }, []);

  const openModal = (type, acc = null) => {
    setModal(type); setSelected(acc);
    setForm(type === 'create' ? { accountType: 'SAVINGS', initialDeposit: '' } : { accountNumber: acc?.accountNumber, amount: '', description: '' });
    setMsg({ type: '', text: '' });
  };

  const closeModal = () => { setModal(null); setSelected(null); setForm({}); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setMsg({ type: '', text: '' });
    try {
      if (modal === 'create') {
        await createAccount({ accountType: form.accountType, initialDeposit: form.initialDeposit || 0 });
        setMsg({ type: 'success', text: 'Account created successfully!' });
      } else if (modal === 'deposit') {
        await deposit({ accountNumber: selected.accountNumber, amount: parseFloat(form.amount), description: form.description });
        setMsg({ type: 'success', text: 'Deposit successful!' });
      } else if (modal === 'withdraw') {
        await withdraw({ accountNumber: selected.accountNumber, amount: parseFloat(form.amount), description: form.description });
        setMsg({ type: 'success', text: 'Withdrawal successful!' });
      }
      await fetchAccounts();
      setTimeout(closeModal, 1200);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data || 'Operation failed.' });
    } finally { setSubmitting(false); }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">My Accounts</h1>
          <p className="page-sub">Manage your bank accounts, deposits and withdrawals.</p>
        </div>

        <div className="section-header">
          <span className="section-title">All Accounts ({accounts.length})</span>
          <button className="btn-gold" onClick={() => openModal('create')}>+ Open New Account</button>
        </div>

        {loading ? (
          <div className="empty-state"><div className="empty-icon">⏳</div><div className="empty-text">Loading accounts...</div></div>
        ) : accounts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🏦</div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No accounts found</div>
            <p style={{ color: 'var(--gray-600)', marginBottom: 24 }}>Open your first account to start banking.</p>
            <button className="btn-gold" onClick={() => openModal('create')}>Open Account</button>
          </div>
        ) : (
          <div className="accounts-grid">
            {accounts.map((acc) => (
              <div key={acc.id} className="account-card">
                <div className="account-card-status">{acc.status}</div>
                <div className="account-card-type">{acc.accountType.replace('_', ' ')} Account</div>
                <div className="account-card-num">{acc.accountNumber}</div>
                <div className="account-card-balance-label">Available Balance</div>
                <div className="account-card-balance">{fmt(acc.balance)}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 20, position: 'relative', zIndex: 1 }}>
                  <button
                    onClick={() => openModal('deposit', acc)}
                    style={{ flex: 1, padding: '9px', borderRadius: 8, border: '1.5px solid rgba(201,168,76,0.5)', background: 'rgba(201,168,76,0.1)', color: 'var(--gold-light)', fontWeight: 600, cursor: 'pointer', fontSize: 13, fontFamily: 'Sora, sans-serif' }}>
                    ⬇ Deposit
                  </button>
                  <button
                    onClick={() => openModal('withdraw', acc)}
                    style={{ flex: 1, padding: '9px', borderRadius: 8, border: '1.5px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', fontWeight: 600, cursor: 'pointer', fontSize: 13, fontFamily: 'Sora, sans-serif' }}>
                    ⬆ Withdraw
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Account summary table */}
        {accounts.length > 0 && (
          <>
            <div className="section-header" style={{ marginTop: 8 }}>
              <span className="section-title">Account Summary</span>
            </div>
            <div className="card">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Account Number</th>
                      <th>Type</th>
                      <th>Balance</th>
                      <th>Status</th>
                      <th>Opened On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((acc) => (
                      <tr key={acc.id}>
                        <td className="mono">{acc.accountNumber}</td>
                        <td>{acc.accountType.replace('_', ' ')}</td>
                        <td style={{ fontWeight: 700 }}>{fmt(acc.balance)}</td>
                        <td><span className="tx-type-badge DEPOSIT">{acc.status}</span></td>
                        <td style={{ color: 'var(--gray-600)', fontSize: 13 }}>{new Date(acc.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">
              {modal === 'create' ? '🏦 Open New Account' : modal === 'deposit' ? '⬇ Deposit Funds' : '⬆ Withdraw Funds'}
            </h3>
            <p className="modal-sub">
              {modal === 'create' ? 'Choose an account type to get started.' : `Account: ${selected?.accountNumber}`}
            </p>

            {msg.text && <div className={msg.type === 'success' ? 'success-msg' : 'error-msg'}>{msg.text}</div>}

            <form onSubmit={handleSubmit}>
              {modal === 'create' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Account Type</label>
                    <select className="form-select" value={form.accountType} onChange={(e) => setForm({ ...form, accountType: e.target.value })}>
                      <option value="SAVINGS">Savings Account</option>
                      <option value="CHECKING">Checking Account</option>
                      <option value="FIXED_DEPOSIT">Fixed Deposit</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Initial Deposit (Optional)</label>
                    <input className="form-input" type="number" min="0" step="0.01" placeholder="₹0.00"
                      value={form.initialDeposit} onChange={(e) => setForm({ ...form, initialDeposit: e.target.value })} />
                  </div>
                </>
              )}

              {(modal === 'deposit' || modal === 'withdraw') && (
                <>
                  <div className="form-group">
                    <label className="form-label">Amount (₹)</label>
                    <input className="form-input" type="number" min="0.01" step="0.01" placeholder="Enter amount"
                      value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description (Optional)</label>
                    <input className="form-input" type="text" placeholder="e.g. Salary credit"
                      value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                </>
              )}

              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={closeModal} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-gold" disabled={submitting} style={{ flex: 1 }}>
                  {submitting ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
