import React from 'react';
import { Zap, Award, Users, TrendingUp, Shield } from 'lucide-react';

const Missions = () => {

  const missions = [
    { level: 'VIP 6', desc: 'Commandez le PC Gamer Ultra X6 pour recevoir :', reward: 'FCFA 2 000', status: 'En cours', icon: <Zap size={18} /> },
    { level: 'VIP 7', desc: 'Commandez le PC Gamer Master X7 pour recevoir :', reward: 'FCFA 5 000', status: 'En cours', icon: <Zap size={18} /> },
    { level: 'VIP 8', desc: 'Commandez le PC Gamer Legend X8 pour recevoir :', reward: 'FCFA 10 000', status: 'En cours', icon: <Zap size={18} /> },
  ];

  const teamMissions = [
    { level: 'LV 1', desc: 'Invitez 5 filleuls DIOTYTIO avec un VIP actif pour recevoir :', reward: '1 500 FCFA', current: 0, target: 5, icon: <Users size={20} color="var(--primary)" /> },
    { level: 'LV 2', desc: 'Invitez 15 filleuls DIOTYTIO avec un VIP actif pour recevoir :', reward: '3 000 FCFA', current: 0, target: 15, icon: <Shield size={20} color="var(--primary)" /> },
    { level: 'LV 3', desc: 'Invitez 30 filleuls DIOTYTIO avec un VIP actif pour recevoir :', reward: '5 000 FCFA', current: 0, target: 30, icon: <Award size={20} color="var(--primary)" /> },
    { level: 'LV 4', desc: 'Invitez 70 filleuls DIOTYTIO avec un VIP actif pour recevoir :', reward: '10 000 FCFA', current: 0, target: 70, icon: <Award size={20} color="var(--primary)" /> },
  ];

  const teamGoals = [
    { desc: 'Équipe de clients atteignant 300 000 FCFA de dépôts approuvés pour recevoir un revenu quotidien :', reward: 'FCFA 350 /jour', current: '0k', target: '300k' },
    { desc: 'Équipe de clients atteignant 1 000 000 FCFA de dépôts approuvés pour recevoir un revenu quotidien :', reward: 'FCFA 1 000 /jour', current: '0k', target: '1M' },
  ];

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '20px' }}>
      {/* Hero banner */}
      <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', marginBottom: '20px' }}>
        <img src="/assets/hero_banner.png" alt="Missions" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(11,12,16,0.95) 50%, transparent 100%)', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>DIOTYTIO {'>'} Centre des missions</span>
          <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Centre des<br/><span className="text-gradient">missions</span></h1>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Accomplissez des missions et cumulez des récompenses</p>
        </div>
      </div>

      {/* Récompenses cumulées */}
      <div style={{ background: 'linear-gradient(135deg, rgba(138,43,226,0.3) 0%, rgba(69,162,158,0.3) 100%)', borderRadius: '16px', padding: '18px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Récompenses cumulées</p>
          <h2 style={{ fontSize: '26px', fontWeight: '800' }}>FCFA <span className="text-gradient">0</span></h2>
        </div>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Award size={24} />
        </div>
      </div>

      {/* VIP Missions */}
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px' }}>Missions VIP</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
        {missions.map((m, i) => (
          <div key={i} className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px' }}>
            <img src={i % 3 === 0 ? '/assets/pc_gamer_x1.png' : i % 3 === 1 ? '/assets/pc_elite_strike.png' : '/assets/pc_vortex_prime.png'} alt="" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px' }} />
            <div style={{ flex: 1 }}>
              <span style={{ display: 'inline-block', padding: '2px 8px', background: 'var(--primary)', borderRadius: '6px', fontSize: '11px', fontWeight: '700', marginBottom: '4px' }}>{m.level}</span>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{m.desc}</p>
              <p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--primary)' }}>{m.reward}</p>
            </div>
            <div style={{ padding: '8px 14px', background: 'var(--bg-secondary)', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {m.icon} {m.status}
            </div>
          </div>
        ))}
      </div>

      {/* Team Missions */}
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px' }}>Missions d'équipe</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
        {teamMissions.map((m, i) => (
          <div key={i} className="glass-panel" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span style={{ display: 'inline-block', padding: '4px 12px', background: 'var(--primary)', borderRadius: '8px', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>{m.level}</span>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{m.desc} <strong style={{ color: 'var(--primary)' }}>{m.reward}</strong></p>
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(138,43,226,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{m.icon}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
              <div><p style={{ fontSize: '18px', fontWeight: '700' }}>{m.current}</p><p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Actuel</p></div>
              <div><p style={{ fontSize: '18px', fontWeight: '700' }}>{m.target}</p><p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Objectif</p></div>
              <div><p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)' }}>{m.current}/{m.target}</p><p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Progression</p></div>
            </div>
            <div style={{ textAlign: 'right', marginTop: '10px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 16px', background: 'var(--bg-secondary)', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                <Zap size={14} /> En cours
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Team Revenue Goals */}
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px' }}>Objectifs de revenus d'équipe</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {teamGoals.map((g, i) => (
          <div key={i} className="glass-panel" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', flex: 1 }}>{g.desc} <strong style={{ color: 'var(--primary)' }}>{g.reward}</strong></p>
              <TrendingUp size={24} color="var(--primary)" style={{ marginLeft: '10px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
              <div><p style={{ fontSize: '18px', fontWeight: '700' }}>{g.current}</p><p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Actuel</p></div>
              <div><p style={{ fontSize: '18px', fontWeight: '700' }}>{g.target}</p><p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Objectif</p></div>
              <div><p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)' }}>0%</p><p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Progression</p></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Missions;
