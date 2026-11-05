import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import CountryPicker from '../components/CountryPicker';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, showModal, country } = useStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!phone || !password) {
      showModal({ type: 'alert', title: 'Erreur', message: 'Veuillez remplir tous les champs.' });
      return;
    }

    const digits = phone.replace(/\D/g, '');
    if (digits.length < 8) {
      showModal({ type: 'alert', title: 'Erreur', message: `Veuillez saisir un numéro valide (${country.dial} + au moins 8 chiffres).` });
      return;
    }

    if (password.length < 8) {
      showModal({ type: 'alert', title: 'Erreur', message: 'Le mot de passe doit contenir au moins 8 caractères.' });
      return;
    }

    setLoading(true);
    try {
      const fullPhone = `${country.dial}${digits}`;
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur de connexion');
      }

      login(fullPhone, data.role, data.token, data.user?.balance ?? 0);
      navigate('/');
    } catch (err) {
      showModal({ type: 'alert', title: 'Erreur', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center', padding: '20px' }}>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <img src="/assets/logo.png" alt="DIOTYTIO" style={{ width: '80px', marginBottom: '16px' }} />
        <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '2px', marginBottom: '8px' }}>
          <span style={{ color: '#fff' }}>DIOT</span><span style={{ color: 'var(--primary)' }}>YTIO</span>
        </h1>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '3px' }}>TECHNOLOGIE GAMING</p>
      </div>

      <div className="glass-panel" style={{ padding: '30px 20px', borderRadius: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Connexion</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Espace sécurisé</p>
          <div style={{ width: '30px', height: '3px', background: 'var(--primary)', margin: '16px auto 0', borderRadius: '2px' }}></div>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <CountryPicker />

          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px', borderRadius: '12px' }}>
            <User size={20} color="var(--primary)" style={{ marginRight: '12px' }} />
            <span style={{ fontSize: '15px', fontWeight: '700', marginRight: '8px', whiteSpace: 'nowrap' }}>{country.dial}</span>
            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', marginRight: '12px' }}></div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Votre numéro"
              inputMode="numeric"
              maxLength={15}
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '15px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px', borderRadius: '12px' }}>
            <Lock size={20} color="var(--primary)" style={{ marginRight: '16px' }} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '15px', outline: 'none' }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', padding: 0 }}>
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '18px', fontSize: '16px', fontWeight: '700', borderRadius: '30px', background: 'var(--primary)', marginTop: '10px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> Connexion...</> : 'Se connecter'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button onClick={() => navigate('/register')} style={{ background: 'transparent', color: '#fff', fontSize: '15px', fontWeight: '600', borderBottom: '1px solid var(--primary)', paddingBottom: '4px' }}>
            Aller a <span style={{ color: 'var(--primary)' }}>l'inscription</span> {'>'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
