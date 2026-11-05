import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { showModal, authToken } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showModal({ type: 'alert', title: 'Erreur', message: 'Veuillez remplir tous les champs.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      showModal({ type: 'alert', title: 'Erreur', message: 'Les nouveaux mots de passe ne correspondent pas.' });
      return;
    }
    if (newPassword.length < 8) {
      showModal({ type: 'alert', title: 'Erreur', message: 'Le mot de passe doit contenir au moins 8 caractères.' });
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      showModal({ type: 'alert', title: 'Erreur', message: 'Le mot de passe doit contenir au moins 1 majuscule.' });
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      showModal({ type: 'alert', title: 'Erreur', message: 'Le mot de passe doit contenir au moins 1 chiffre.' });
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      showModal({ type: 'alert', title: 'Erreur', message: 'Le mot de passe doit contenir au moins 1 caractère spécial (!@#$%...).' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors du changement de mot de passe');
      }
      showModal({
        type: 'alert',
        title: 'Succès',
        message: 'Votre mot de passe a été modifié avec succès.',
      });
      navigate('/account');
    } catch (err) {
      showModal({ type: 'alert', title: 'Erreur', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '40px', paddingTop: '20px' }}>
      
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(233, 30, 99, 0.4)' }}>
          <Lock size={24} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>Modifier le mot de passe</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Choisissez un mot de passe fort d'au moins 8 caractères avec majuscule, chiffre et spécial.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div>
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '1px', marginLeft: '16px', marginBottom: '8px', display: 'block' }}>MOT DE PASSE ACTUEL</label>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px', borderRadius: '16px' }}>
            <Lock size={18} color="var(--text-secondary)" style={{ marginRight: '12px' }} />
            <input 
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '15px', outline: 'none', letterSpacing: currentPassword && !showCurrent ? '3px' : 'normal' }}
            />
            <div onClick={() => setShowCurrent(!showCurrent)} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>
              {showCurrent ? <Eye size={18} /> : <EyeOff size={18} />}
            </div>
          </div>
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '1px', marginLeft: '16px', marginBottom: '8px', display: 'block' }}>NOUVEAU MOT DE PASSE</label>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px', borderRadius: '16px' }}>
            <Lock size={18} color="var(--text-secondary)" style={{ marginRight: '12px' }} />
            <input 
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '15px', outline: 'none', letterSpacing: newPassword && !showNew ? '3px' : 'normal' }}
            />
            <div onClick={() => setShowNew(!showNew)} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>
              {showNew ? <Eye size={18} /> : <EyeOff size={18} />}
            </div>
          </div>
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '1px', marginLeft: '16px', marginBottom: '8px', display: 'block' }}>CONFIRMER LE NOUVEAU MOT DE PASSE</label>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px', borderRadius: '16px' }}>
            <Lock size={18} color="var(--text-secondary)" style={{ marginRight: '12px' }} />
            <input 
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '15px', outline: 'none', letterSpacing: confirmPassword && !showConfirm ? '3px' : 'normal' }}
            />
            <div onClick={() => setShowConfirm(!showConfirm)} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>
              {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
            </div>
          </div>
        </div>

      </div>

      <button
        onClick={handleSubmit}
        className="btn-primary"
        disabled={loading}
        style={{ width: '100%', marginTop: '30px', padding: '18px', fontSize: '16px', fontWeight: '700', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', borderRadius: '16px', background: 'var(--primary)', opacity: loading ? 0.7 : 1 }}
      >
        <ShieldCheck size={18} /> {loading ? 'Modification...' : 'Confirmer le changement'}
      </button>

      <div style={{ marginTop: '20px', padding: '16px', borderRadius: '12px', background: 'rgba(233, 30, 99, 0.05)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <ShieldCheck size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          Ne partagez jamais votre mot de passe. Le personnel DIOTYTIO ne vous le demandera jamais.
        </p>
      </div>

    </div>
  );
};

export default ChangePassword;
