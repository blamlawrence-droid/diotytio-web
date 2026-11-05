import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { Clock, ArrowDownToLine, ArrowUpFromLine, ShoppingCart, Gift, Filter } from 'lucide-react';

const typeConfig = {
  deposit:  { label: 'Dépôt',         icon: ArrowDownToLine, color: '#2ecc71', bg: 'rgba(46,204,113,0.1)',  sign: '+' },
  withdraw: { label: 'Retrait',        icon: ArrowUpFromLine, color: '#ff4c4c', bg: 'rgba(255,76,76,0.1)',   sign: '-' },
  purchase: { label: 'Achat',          icon: ShoppingCart,    color: '#8a2be2', bg: 'rgba(138,43,226,0.1)', sign: '-' },
  reward:   { label: 'Récompense',     icon: Gift,            color: '#f39c12', bg: 'rgba(243,156,18,0.1)', sign: '+' },
};

const statusBadge = {
  pending:  { label: 'En attente', color: '#f39c12', bg: 'rgba(243,156,18,0.12)' },
  approved: { label: 'Approuvé',   color: '#2ecc71', bg: 'rgba(46,204,113,0.12)' },
  rejected: { label: 'Rejeté',     color: '#ff4c4c', bg: 'rgba(255,76,76,0.12)'  },
};

const History = () => {
  const { transactions, loadTransactions } = useStore();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const filtered = filter === 'all'
    ? transactions
    : transactions.filter(t => t.type === filter);

  const totalIn  = transactions.filter(t => (t.type === 'deposit' || t.type === 'reward') && t.status !== 'rejected').reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => (t.type === 'withdraw' || t.type === 'purchase') && t.status !== 'rejected').reduce((s, t) => s + t.amount, 0);

  const fmt = (n) => new Intl.NumberFormat('fr-FR').format(n);

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '16px', paddingBottom: '32px' }}>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
          <ArrowDownToLine size={20} color="#2ecc71" style={{ margin: '0 auto 6px' }} />
          <p style={{ fontSize: '18px', fontWeight: '800', color: '#2ecc71' }}>+{fmt(totalIn)}</p>
          <p style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>FCFA REÇUS</p>
        </div>
        <div className="glass-panel" style={{ padding: '16px', textAlign: 'center' }}>
          <ArrowUpFromLine size={20} color="#ff4c4c" style={{ margin: '0 auto 6px' }} />
          <p style={{ fontSize: '18px', fontWeight: '800', color: '#ff4c4c' }}>-{fmt(totalOut)}</p>
          <p style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>FCFA ENVOYÉS</p>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px', WebkitOverflowScrolling: 'touch' }}>
        {[
          { id: 'all',      label: 'Tout' },
          { id: 'deposit',  label: 'Dépôts' },
          { id: 'withdraw', label: 'Retraits' },
          { id: 'purchase', label: 'Achats' },
          { id: 'reward',   label: 'Récompenses' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: `1px solid ${filter === f.id ? 'var(--primary)' : 'rgba(255,255,255,0.08)'}`,
              background: filter === f.id ? 'rgba(138,43,226,0.18)' : 'rgba(255,255,255,0.03)',
              color: filter === f.id ? 'var(--primary-light)' : 'var(--text-secondary)',
              fontSize: '12px',
              fontWeight: '700',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Filter size={12} /> {f.label}
          </button>
        ))}
      </div>

      {/* Transaction list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '48px 20px' }}>
            <Clock size={40} color="var(--text-secondary)" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Aucune transaction trouvée.</p>
          </div>
        ) : (
          filtered.map((t, idx) => {
            const cfg = typeConfig[t.type] || typeConfig.deposit;
            const Icon = cfg.icon;
            const badge = statusBadge[t.status] || statusBadge.approved;
            return (
              <div
                key={t.id || idx}
                className="glass-panel"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 16px',
                  borderLeft: `3px solid ${cfg.color}`,
                  borderRadius: '14px',
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: cfg.bg,
                  color: cfg.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={20} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '700' }}>{cfg.label}</h3>
                    {t.desc && <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>— {t.desc}</span>}
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {new Date(t.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Amount + Status */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                  <span style={{ fontSize: '15px', fontWeight: '800', color: cfg.color }}>
                    {cfg.sign}{fmt(Math.abs(t.amount))} F
                  </span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    padding: '3px 8px',
                    borderRadius: '20px',
                    background: badge.bg,
                    color: badge.color,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                  }}>
                    {badge.label}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default History;
