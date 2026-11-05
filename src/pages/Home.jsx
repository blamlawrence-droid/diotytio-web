import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { ArrowDownToLine, ArrowUpFromLine, CalendarCheck, ListChecks, Gamepad2, ChevronRight, Headset } from 'lucide-react';
import WelcomePopup from '../components/WelcomePopup';

const Home = () => {
  const { balance, totalRevenue } = useStore();
  const navigate = useNavigate();

  const games = [
    { name: 'CYBER QUEST', img: '/assets/game1.png' },
    { name: 'SKY STRIKE',  img: '/assets/game2.png' },
    { name: 'TURBO CLASH', img: '/assets/game3.png' },
  ];

  return (
    <div className="container animate-fade-in">
      <WelcomePopup />

      {/* Hero Banner */}
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px', marginBottom: 'var(--spacing-md)' }}>
        <img src="/assets/hero_banner.png" alt="Banner" style={{ width: '100%', height: 'clamp(160px, 42vw, 220px)', objectFit: 'cover', display: 'block' }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.92) 40%, transparent 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(14px, 4vw, 24px)',
        }}>
          <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: 'var(--font-xs)', letterSpacing: '2px', marginBottom: '6px', textTransform: 'uppercase' }}>ENTREZ</span>
          <h1 style={{ fontSize: 'clamp(20px, 5vw, 28px)', lineHeight: '1.2', marginBottom: '8px', fontWeight: '800', color: '#fff' }}>
            Dans un<br/>nouveau<br/>monde
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-xs)', marginBottom: '14px', lineHeight: '1.4' }}>
            La technologie gaming au service<br/>de vos ambitions
          </p>
          <button onClick={() => navigate('/products')} style={{
            alignSelf: 'flex-start',
            padding: 'clamp(7px, 2vw, 9px) clamp(14px, 4vw, 20px)',
            background: 'transparent',
            border: '1.5px solid var(--primary)',
            borderRadius: '20px',
            color: 'var(--primary)',
            fontSize: 'var(--font-sm)',
            fontWeight: '700',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            Découvrez nos PC <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Balance Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-md)' }}>
        {[
          { icon: <Gamepad2 size={18} />, value: `${balance.toLocaleString('fr-FR')} F`, label: 'Mon solde' },
          { icon: <ArrowUpFromLine size={18} />, value: `${totalRevenue.toLocaleString('fr-FR')} F`, label: 'Revenu cumulé' },
          { icon: <Headset size={18} />, value: 'Service client', label: '24h/24 7j/7', action: () => window.open('https://t.me/', '_blank') },
        ].map((card, i) => (
          <div
            key={i}
            className="glass-panel"
            onClick={card.action}
            style={{
              padding: 'clamp(10px, 3vw, 16px) clamp(8px, 2vw, 12px)',
              textAlign: 'center',
              cursor: card.action ? 'pointer' : 'default',
            }}
          >
            <div style={{
              width: 'clamp(32px, 8vw, 40px)', height: 'clamp(32px, 8vw, 40px)',
              borderRadius: '50%', background: 'rgba(138,43,226,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 6px', color: 'var(--primary)',
            }}>
              {card.icon}
            </div>
            <p style={{ fontSize: 'clamp(11px, 2.8vw, 14px)', fontWeight: '700', color: 'var(--primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {card.value}
            </p>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: '2px' }}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-lg)' }}>
        {[
          { icon: <ArrowDownToLine size={20} />, label: 'Dépôt',    path: '/deposit' },
          { icon: <ArrowUpFromLine size={20} />, label: 'Retrait',  path: '/withdraw' },
          { icon: <CalendarCheck size={20} />,   label: 'Pointage', path: '/tasks' },
          { icon: <ListChecks size={20} />,      label: 'Tâches',   path: '/missions' },
        ].map((a, i) => (
          <div key={i} onClick={() => navigate(a.path)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <div style={{
              width: 'clamp(44px, 11vw, 54px)', height: 'clamp(44px, 11vw, 54px)',
              borderRadius: '50%',
              border: '1.5px solid rgba(255,255,255,0.14)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-primary)',
              transition: 'border-color 0.2s, background 0.2s',
            }}>
              {a.icon}
            </div>
            <span style={{ fontSize: 'clamp(9px, 2.3vw, 11px)', color: 'var(--text-secondary)', textAlign: 'center' }}>
              {a.label}
            </span>
          </div>
        ))}
      </div>

      {/* Games Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
          <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: '700' }}>Jeux pour tous</h3>
          <span style={{ color: 'var(--primary)', fontSize: 'var(--font-sm)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Voir tout <ChevronRight size={14} />
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px', WebkitOverflowScrolling: 'touch' }}>
          {games.map((g, i) => (
            <div key={i} style={{
              minWidth: 'clamp(110px, 30vw, 140px)',
              height: 'clamp(150px, 38vw, 180px)',
              borderRadius: '14px', overflow: 'hidden',
              position: 'relative', flexShrink: 0,
            }}>
              <img src={g.img} alt={g.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)' }}>
                <span style={{ fontWeight: '700', fontSize: 'clamp(9px, 2.3vw, 11px)', letterSpacing: '1px' }}>{g.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: '12px' }} />
    </div>
  );
};

export default Home;
