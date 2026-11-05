import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Code, Eye, EyeOff } from 'lucide-react';
import CountryPicker from '../components/CountryPicker';

const Register = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [refCode, setRefCode] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, showModal, country } = useStore();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!phone || !password || !confirmPassword) {
      showModal({ type: 'alert', title: 'Erreur', message: 'Veuillez remplir tous les champs.' });
      return;
    }
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 8) {
      showModal({ type: 'alert', title: 'Erreur', message: `Veuillez saisir un numero valide (${country.dial} + au moins 8 chiffres).` });
      return;
    }
    if (password.length < 8) {
      showModal({ type: 'alert', title: 'Erreur', message: 'Le mot de passe doit contenir au moins 8 caracteres.' });
      return;
    }
    if (!/[A-Z]/.test(password)) {
      showModal({ type: 'alert', title: 'Erreur', message: 'Le mot de passe doit contenir au moins 1 majuscule.' });
      return;
    }
    if (!/[0-9]/.test(password)) {
      showModal({ type: 'alert', title: 'Erreur', message: 'Le mot de passe doit contenir au moins 1 chiffre.' });
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      showModal({ type: 'alert', title: 'Erreur', message: 'Le mot de passe doit contenir au moins 1 caractere special (!@#$%...).' });
      return;
    }
    if (password !== confirmPassword) {
      showModal({ type: 'alert', title: 'Erreur', message: 'Les mots de passe ne correspondent pas.' });
      return;
    }

    const fullPhone = `${country.dial}${digits}`;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la création du compte');
      }
      login(fullPhone, data.role, data.token, data.user?.balance ?? 0);
      showModal({ type: 'alert', title: 'Bienvenue !', message: 'Inscription réussie. Vous avez reçu une prime de bienvenue de 1 700 FCFA !' });
      navigate('/');
    } catch (err) {
      showModal({ type: 'alert', title: 'Erreur', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center', padding: '20px' }}>
      
      {/* Logo Area */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <img src="/assets/logo.png" alt="DIOTYTIO" style={{ width: '80px', marginBottom: '16px' }} />
        <h1 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '2px', marginBottom: '8px' }}>
          <span style={{ color: '#fff' }}>DIOT</span><span style={{ color: 'var(--primary)' }}>YTIO</span>
        </h1>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '3px' }}>TECHNOLOGIE GAMING</p>
      </div>

      <div className="glass-panel" style={{ padding: '30px 20px', borderRadius: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Inscription</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Plateforme premium</p>
          <div style={{ width: '30px', height: '3px', background: 'var(--primary)', margin: '16px auto 0', borderRadius: '2px' }}></div>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Country */}
          <CountryPicker />

          {/* Phone */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px', borderRadius: '12px' }}>
            <User size={20} color="var(--primary)" style={{ marginRight: '12px' }} />
            <span style={{ fontSize: '15px', fontWeight: '700', marginRight: '8px' }}>{country.dial}</span>
            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', marginRight: '12px' }}></div>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Votre numéro"
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '15px', outline: 'none' }}
            />
          </div>

          {/* Password */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px', borderRadius: '12px' }}>
            <Lock size={20} color="var(--primary)" style={{ marginRight: '16px' }} />
            <input 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '15px', outline: 'none' }}
            />
            <div onClick={() => setShowPassword(!showPassword)} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px', borderRadius: '12px' }}>
            <Lock size={20} color="var(--primary)" style={{ marginRight: '16px' }} />
            <input 
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmateur MDP"
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '15px', outline: 'none' }}
            />
            <div onClick={() => setShowPassword(!showPassword)} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </div>
          </div>

          {/* Invite Code */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px', borderRadius: '12px' }}>
            <Code size={20} color="var(--primary)" style={{ marginRight: '16px' }} />
            <input 
              type="text"
              value={refCode}
              onChange={(e) => setRefCode(e.target.value)}
              placeholder="Code d'invitation (optionnel)"
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '15px', outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '18px', fontSize: '16px', fontWeight: '700', borderRadius: '30px', background: 'var(--primary)', marginTop: '10px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Inscription...' : "S'inscrire ›"}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>OU</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button onClick={() => navigate('/login')} style={{ background: 'transparent', color: '#fff', fontSize: '15px', fontWeight: '600' }}>
            Aller à la connexion ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
