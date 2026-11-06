import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Smartphone, Phone, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';

const UssdDeposit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { deposit, showModal, depositPhone, ussdTemplate } = useStore();

  const data = location.state;
  const [customUssd, setCustomUssd] = useState(null);
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [remoteSettings, setRemoteSettings] = useState(null);

  const amountValue = data?.amount;

  useEffect(() => {
    let cancelled = false;
    fetch('/api/deposit-settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((settings) => {
        if (!cancelled && settings && settings.depositPhone) setRemoteSettings(settings);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const activeDepositPhone = remoteSettings?.depositPhone || depositPhone;
  const activeTemplate = remoteSettings?.ussdTemplate || ussdTemplate;
  const adminDigits = String(activeDepositPhone || '').replace(/\D/g, '');

  const generatedUssd = activeDepositPhone && amountValue
    ? (activeTemplate || '*155*1*{montant}*{numero}#')
      .replace(/\{montant\}/g, amountValue)
      .replace(/\{numero\}/g, adminDigits)
    : '';
  const ussd = customUssd ?? generatedUssd;

  if (!data) return <Navigate to="/deposit" replace />;

  const { amount, operator, phone, country } = data;

  const handleLaunch = () => {
    const code = ussd.trim();
    if (!code) {
      showModal({ type: 'alert', title: 'Erreur', message: 'Veuillez coller le code USSD Flooz à composer.' });
      return;
    }
    if (!/^\*[\d*#]+$/.test(code)) {
      showModal({ type: 'alert', title: 'Erreur', message: 'Code USSD invalide. Format attendu : *155#...' });
      return;
    }
    window.location.href = `tel:${encodeURIComponent(code)}`;
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await deposit(amount, { ussdCode: ussd.trim(), reference: reference.trim(), operator, phone });
      showModal({
        type: 'alert',
        title: 'Dépôt envoyé',
        message: `Votre dépôt de ${amount.toLocaleString('fr-FR')} FCFA est en attente de validation par l'administrateur.`,
      });
      navigate('/account');
    } catch (err) {
      showModal({ type: 'alert', title: 'Erreur', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
        <Smartphone size={20} color="var(--success)" />
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>DIOTYTIO</h2>
          <p style={{ fontSize: '10px', color: 'var(--success)', letterSpacing: '1px', margin: 0 }}>DÉPÔT FLOOZ (USSD)</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Montant à déposer</h3>
        <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary)' }}>
          {amount.toLocaleString('fr-FR')} F
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          {country?.flag} {country?.name} · {operator} · {phone}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
        <h4 style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '16px', letterSpacing: '1px' }}>1. CODE USSD FLOOZ</h4>
        {activeDepositPhone ? (
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Code généré avec le numéro de dépôt admin : <strong style={{ color: 'var(--text-primary)' }}>{activeDepositPhone}</strong>
          </p>
        ) : (
          <p style={{ fontSize: '12px', color: 'var(--danger)', marginBottom: '12px' }}>
            Numéro de dépôt non configuré par l'admin. Contactez le service client.
          </p>
        )}
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Vérifiez le code, puis lancez-le dans l'application téléphone.
        </p>
        <input
          type="text"
          placeholder="Ex: *155#"
          value={ussd}
          onChange={(e) => setCustomUssd(e.target.value)}
          className="form-input"
          style={{ marginBottom: '12px' }}
        />
        <button
          onClick={handleLaunch}
          className="btn-primary"
          style={{ background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <Phone size={18} /> Lancer dans l'app téléphone
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
        <h4 style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '16px', letterSpacing: '1px' }}>2. CONFIRMATION</h4>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Après avoir effectué le paiement Flooz, collez la référence de transaction (optionnel) puis confirmez.
        </p>
        <input
          type="text"
          placeholder="Référence de transaction (optionnel)"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          className="form-input"
          style={{ marginBottom: '16px' }}
        />
        <button
          onClick={handleConfirm}
          className="btn-primary"
          disabled={loading}
          style={{ background: 'var(--success)', boxShadow: '0 4px 20px rgba(46, 204, 113, 0.3)', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {loading ? <><Loader2 size={18} className="animate-spin" /> Envoi...</> : <><CheckCircle2 size={18} /> J'ai payé, confirmer le dépôt</>}
        </button>
      </div>

      <button
        onClick={() => navigate('/deposit')}
        disabled={loading}
        style={{ width: '100%', padding: '16px', marginTop: '4px', background: 'transparent', color: 'var(--text-secondary)', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
      >
        <ArrowLeft size={16} /> Retour
      </button>
    </div>
  );
};

export default UssdDeposit;
