import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Download, History, ChevronRight, Gift, CalendarCheck, TrendingUp, ChevronDown } from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

const Statistics = () => {
  const navigate = useNavigate();
  const { balance, totalRevenue } = useStore();
  const [showBalance, setShowBalance] = useState(true);

  const mockData = [
    { date: '17 août', value: 0 },
    { date: '18 août', value: 0 },
    { date: '19 août', value: 0 },
    { date: '20 août', value: 1200 },
    { date: '21 août', value: 1500 },
    { date: '22 août', value: 1700 },
    { date: '23 août', value: balance },
  ];

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '100px' }}>
      
      {/* Hero Balances */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            Solde disponible
            <span onClick={() => setShowBalance(!showBalance)} style={{ cursor: 'pointer' }}>
              {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
            </span>
          </p>
          <h2 style={{ fontSize: '24px', fontWeight: '800' }}>
            {showBalance ? `${balance.toLocaleString('fr-FR')} F` : '••••••'}
          </h2>
          <p style={{ fontSize: '11px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            <TrendingUp size={12} /> +100% ce mois
          </p>
        </div>

        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(138,43,226,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/assets/logo.png" alt="DIOTYTIO" style={{ width: '36px', height: '36px' }} />
        </div>

        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Revenu cumulé</p>
          <h2 style={{ fontSize: '24px', fontWeight: '800' }}>
            {showBalance ? `${totalRevenue.toLocaleString('fr-FR')} F` : '••••••'}
          </h2>
          <p style={{ fontSize: '11px', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '8px' }}>
            <TrendingUp size={12} /> +0% ce mois
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '24px' }}>
        <button onClick={() => navigate('/deposit')} style={{ padding: '12px 10px', background: 'rgba(138,43,226,0.15)', color: 'var(--primary)', borderRadius: '12px', border: '1px solid rgba(138,43,226,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontWeight: '600' }}>
          <Download size={14} style={{ transform: 'rotate(180deg)' }} /> Crédits
        </button>
        <button onClick={() => navigate('/withdraw')} style={{ padding: '12px 10px', background: 'transparent', color: 'var(--text-secondary)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontWeight: '600' }}>
          <Download size={14} /> Débits
        </button>
        <button onClick={() => navigate('/history')} style={{ padding: '12px 10px', background: 'transparent', color: 'var(--text-secondary)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontWeight: '600' }}>
          <History size={14} /> Historique
        </button>
      </div>

      {/* Boostez vos revenus */}
      <div className="glass-panel" onClick={() => navigate('/team')} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', marginBottom: '24px', cursor: 'pointer' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(138,43,226,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src="/assets/logo.png" alt="" style={{ width: '28px' }} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>Boostez vos revenus</h3>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Invitez vos amis et gagnez des bonus à chaque inscription.</p>
        </div>
        <span style={{ color: 'var(--primary)', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
          Inviter <ChevronRight size={14} />
        </span>
      </div>

      {/* Recent History Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(138,43,226,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <CalendarCheck size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700' }}>Pointage</h4>
              <span style={{ fontSize: '10px', background: 'rgba(138,43,226,0.2)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px' }}>Quotidien</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Points bonus quotidiens</p>
            <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>23 août</p>
          </div>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <span style={{ color: 'var(--success)', fontWeight: '700', fontSize: '14px' }}>+ FCFA 150</span>
            <ChevronRight size={14} color="var(--text-secondary)" />
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(138,43,226,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <Gift size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700' }}>Bonus</h4>
              <span style={{ fontSize: '10px', background: 'rgba(138,43,226,0.2)', color: 'var(--primary)', padding: '2px 6px', borderRadius: '4px' }}>Inscription</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Bonus d'inscription</p>
            <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>22 août</p>
          </div>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <span style={{ color: 'var(--success)', fontWeight: '700', fontSize: '14px' }}>+ FCFA 1 700</span>
            <ChevronRight size={14} color="var(--text-secondary)" />
          </div>
        </div>
      </div>

      {/* Aperçu de vos gains */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700' }}>Aperçu de vos gains</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', color: 'var(--text-secondary)' }}>
            7 derniers jours <ChevronDown size={14} />
          </div>
        </div>
        
        <div style={{ height: '180px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ background: '#1e1f26', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: 'var(--primary)' }}
              />
              <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default Statistics;
