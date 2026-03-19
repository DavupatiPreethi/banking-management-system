import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getMyAccounts, getTransactions } from '../services/api';
import { useAuth } from '../context/AuthContext';

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [recentTx, setRecentTx] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accRes = await getMyAccounts();
        setAccounts(accRes.data);
        if (accRes.data.length > 0) {
          const txRes = await getTransactions(accRes.data[0].accountNumber);
          setRecentTx(txRes.data.slice(0, 5));
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const totalBalance = accounts.reduce((sum, a) => sum + Number(a.balance), 0);

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">{greet()}, {user?.fullName?.split(' ')[0]} 👋</h1>
          <p className="page-sub">Here's what's happening with your finances today.</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card gold">
            <div className="stat-icon gold">💰</div>
            <div className="stat-label">Total Balance</div>
            <div className="stat-value">{fmt(totalBalance)}</div>
          </div>
          <div className="stat-card navy">
            <div className="stat-icon navy">🏦</div>
            <div className="stat-label">Accounts</div>
            <div className="stat-value">{accounts.length}</div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon green">✅</div>
            <div className="stat-label">Transactions</div>
            <div className="stat-value">{recentTx.length}</div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon blue">🔒</div>
            <div className="stat-label">Security</div>
            <div className="stat-value">Active</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section-header">
          <span className="section-title">Quick Actions</span>
        </div>
        <div className="quick-actions">
          {[
            { icon: '⬇', label: 'Deposit', color: '#dcfce7', path: '/accounts' },
            { icon: '⬆', label: 'Withdraw', color: '#fee2e2', path: '/accounts' },
            { icon: '↔', label: 'Transfer', color: '#dbeafe', path: '/transfer' },
            { icon: '+', label: 'New Account', color: 'rgba(201,168,76,0.15)', path: '/accounts' },
          ].map((a) => (
            <div key={a.label} className="quick-action" onClick={() => navigate(a.path)}>
              <div className="quick-action-icon" style={{ background: a.color, fontSize: 20 }}>{a.icon}</div>
              <div className="quick-action-label">{a.label}</div>
            </div>
          ))}
        </div>

        {/* Accounts */}
        <div className="section-header">
          <span className="section-title">My Accounts</span>
          <button className="btn-gold" onClick={() => navigate('/accounts')}>View All</button>
        </div>

        {loading ? (
          <div className="empty-state"><div className="empty-icon">⏳</div><div className="empty-text">Loading...</div></div>
        ) : accounts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🏦</div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>No accounts yet</div>
            <p style={{ color: 'var(--gray-600)', fontSize: 14, marginBottom: 20 }}>Open your first bank account to get started.</p>
            <button className="btn-gold" onClick={() => navigate('/accounts')}>Open Account</button>
          </div>
        ) : (
          <div className="accounts-grid">
            {accounts.map((acc) => (
              <div key={acc.id} className="account-card" onClick={() => navigate('/accounts')}>
                <div className="account-card-status">{acc.status}</div>
                <div className="account-card-type">{acc.accountType.replace('_', ' ')} Account</div>
                <div className="account-card-num">{acc.accountNumber}</div>
                <div className="account-card-balance-label">Available Balance</div>
                <div className="account-card-balance">{fmt(acc.balance)}</div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Transactions */}
        <div className="section-header" style={{ marginTop: 8 }}>
          <span className="section-title">Recent Transactions</span>
          <button className="btn-outline" onClick={() => navigate('/transactions')}>View All</button>
        </div>

        <div className="card">
          {recentTx.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <div className="empty-text">No transactions yet</div>
              <div className="empty-sub">Your transaction history will appear here.</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Transaction ID</th>
                    <th>Date</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTx.map((tx) => (
                    <tr key={tx.id}>
                      <td><span className={`tx-type-badge ${tx.type}`}>{tx.type}</span></td>
                      <td>{tx.description || '—'}</td>
                      <td><span className="tx-id">{tx.transactionId}</span></td>
                      <td style={{ color: 'var(--gray-600)', fontSize: 13 }}>
                        {new Date(tx.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className={`tx-amount ${tx.type === 'DEPOSIT' ? 'positive' : 'negative'}`}>
                        {tx.type === 'DEPOSIT' ? '+' : '-'}{fmt(tx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
