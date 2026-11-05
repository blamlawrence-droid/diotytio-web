import React, { useEffect } from 'react';
import { useStore } from '../store';
import { CalendarCheck, Gift, Star, Calendar } from 'lucide-react';

const Tasks = () => {
  const { checkIn, loadTasks, showModal, lastCheckInDate, checkInDays } = useStore();
  const today = new Date().toLocaleDateString();
  const checkedIn = lastCheckInDate === today;

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCheckIn = async () => {
    if (checkedIn) {
      showModal({ type: 'alert', title: 'Déjà pointé', message: "Vous avez déjà effectué votre pointage aujourd'hui. Revenez demain !" });
      return;
    }
    try {
      await checkIn();
      showModal({ type: 'alert', title: 'Pointage réussi !', message: '+150 FCFA ajoutés à votre solde.\nContinuez à vous connecter chaque jour pour cumuler encore plus.' });
    } catch (err) {
      showModal({ type: 'alert', title: 'Erreur', message: err.message });
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '20px' }}>
      {/* Hero */}
      <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', marginBottom: '24px' }}>
        <img src="/assets/hero_banner.png" alt="Pointage" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(11,12,16,0.95) 50%, transparent 100%)', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--primary)', marginBottom: '4px' }}>DIOTYTIO {'>'} Pointage</span>
          <h2 style={{ fontSize: '20px', marginBottom: '4px' }}>Boostez votre activité, <span className="text-gradient">cumulez plus de points</span></h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Plus vous êtes actif, plus vous êtes récompensé.</p>
        </div>
      </div>

      {/* Cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
        {/* Bonus cumulé */}
        <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(138,43,226,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <img src="/assets/logo.png" alt="" style={{ width: '28px' }} />
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Bonus cumulé</p>
          <h3 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primary)' }}>FCFA 0</h3>
          <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--primary)', color: 'var(--primary)' }}>Niveau 1 ›</span>
        </div>

        {/* Débutant */}
        <div className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(138,43,226,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <Star size={24} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Débutant</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Continuez ainsi !</p>
          <div style={{ width: '100%', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.1)' }}>
            <div style={{ width: `${Math.min(checkInDays * 20, 100)}%`, height: '100%', borderRadius: '2px', background: 'var(--primary)' }}></div>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{checkInDays} / 5 jours</span>
        </div>

        {/* Récompense quotidienne */}
        <div className="glass-panel" style={{ padding: '18px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>Récompense quotidienne de pointage</h3>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Obtenez des récompenses chaque jour</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            <Gift size={40} color="var(--primary)" />
          </div>
          <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)' }}>FCFA 150 ›</p>
        </div>

        {/* Jours de pointage */}
        <div className="glass-panel" style={{ padding: '18px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>Jours de pointage</h3>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Nombre total de jours pointés</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            <Calendar size={40} color="var(--primary)" />
          </div>
          <p style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)', textAlign: 'center' }}>{checkInDays} jours</p>
        </div>
      </div>

      {/* Pointer button */}
      <button
        onClick={handleCheckIn}
        disabled={checkedIn}
        className="btn-primary"
        style={{ width: '100%', padding: '16px', fontSize: '18px', fontWeight: '700', borderRadius: '14px', background: checkedIn ? 'rgba(255,255,255,0.1)' : 'var(--gradient-main)', boxShadow: checkedIn ? 'none' : '0 4px 20px rgba(138,43,226,0.5)', gap: '10px' }}
      >
        <CalendarCheck size={24} />
        {checkedIn ? 'Pointé avec succès ✓' : 'Pointer maintenant'}
      </button>
    </div>
  );
};

export default Tasks;
