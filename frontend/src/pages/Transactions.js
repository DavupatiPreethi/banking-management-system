import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { getMyAccounts, getTransactions } from '../services/api';

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

export default function Transactions() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedAcc, setSelectedAcc] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMyAccounts().then(res => {
      setAccounts(res.data);
      if (res.data.length > 0) setSelectedAcc(res.data[0].accountNumber);
    });
  }, []);

  useEffect(() => {
    if (!selectedAcc) return;
    setLoading(true);
    getTransactions(selectedAcc)
      .then(res => setTransactions(res.data))
      .finally(() => setLoading(false));
  }, [selectedAcc]);

  const filtered = filter === 'ALL' ? transactions : transactions.filter(t => t.type === filter);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Transaction History</h1>
          <p className="page-sub">View all your past transactions and activity.</p>
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <select className="form-select" value={selectedAcc} onChange={(e) => setSelectedAcc(e.target.value)}>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.accountNumber}>
                    {acc.accountNumber} — {acc.accountType}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['ALL', 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER'].map(type => (
                <button key={type} onClick={() => setFilter(type)}
                  style={{
                    padding: '8px 16px', borderRadius: 8, border: '1.5px solid',
                    borderColor: filter === type ? 'var(--gold)' : 'var(--gray-200)',
                    background: filter === type ? 'rgba(201,168,76,0.12)' : 'transparent',
                    color: filter === type ? 'var(--gold)' : 'var(--gray-600)',
                    fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'Sora, sans-serif',
                    textTransform: 'uppercase', letterSpacing: '0.5px'
                  }}>
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
          {[
            { label: 'Total Credits', type: 'DEPOSIT', color: 'var(--green)', bg: 'var(--green-pale)', icon: '⬇' },
            { label: 'Total Debits', type: 'WITHDRAWAL', color: 'var(--red)', bg: 'var(--red-pale)', icon: '⬆' },
            { label: 'Transfers', type: 'TRANSFER', color: 'var(--blue)', bg: 'var(--blue-pale)', icon: '↔' },
          ].map(({ label, type, color, bg, icon }) => {
            const total = transactions.filter(t => t.type === type).reduce((s, t) => s + Number(t.amount), 0);
            return (
              <div key={type} className="card" style={{ borderLeft: `4px solid ${color}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{icon} {label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color }}>{fmt(total)}</div>
              </div>
            );
          })}
        </div>

        <div className="card">
          {loading ? (
            <div className="empty-state"><div className="empty-icon">⏳</div><div className="empty-text">Loading transactions...</div></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <div className="empty-text">No transactions found</div>
              <div className="empty-sub">Try a different filter or account.</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Txn ID</th>
                    <th>Balance After</th>
                    <th>Date & Time</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tx) => (
                    <tr key={tx.id}>
                      <td><span className={`tx-type-badge ${tx.type}`}>{tx.type}</span></td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{tx.description || '—'}</div>
                        {tx.toAccountNumber && <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>To: {tx.toAccountNumber}</div>}
                      </td>
                      <td className="tx-id">{tx.transactionId}</td>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>{fmt(tx.balanceAfter)}</td>
                      <td style={{ fontSize: 13, color: 'var(--gray-600)' }}>
                        {new Date(tx.createdAt).toLocaleDateString('en-IN')}<br />
                        <span style={{ fontSize: 11 }}>{new Date(tx.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </td>
                      <td className={`tx-amount ${tx.type === 'DEPOSIT' ? 'positive' : 'negative'}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
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
