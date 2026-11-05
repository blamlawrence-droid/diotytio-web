import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Banknote, Smartphone, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import CountryPicker from '../components/CountryPicker';

const Withdraw = () => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [operator, setOperator] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const { balance, withdraw, showModal, country, products } = useStore();
  const navigate = useNavigate();

  const presets = [3000, 7000, 15000, 25000, 45000, balance];

  const handleNextStep = () => {
    if (!products || products.length === 0) {
      showModal({
        type: 'alert',
        title: 'Action requise',
        message: 'Vous devez activer au moins un produit avant de pouvoir effectuer un retrait.',
      });
      navigate('/products');
      return;
    }

    const val = parseInt(amount.replace(/\D/g, ''));
    if (!isNaN(val) && val >= 3000) {
      if (val > balance) {
        showModal({ type: 'alert', title: 'Solde insuffisant', message: 'Le montant demandé dépasse votre solde actuel.' });
        return;
      }
      setStep(2);
      if (country.operators && country.operators.length > 0) {
        setOperator(country.operators[0].name);
      }
    } else {
      showModal({ type: 'alert', title: 'Erreur', message: 'Le retrait minimum est de 3 000 FCFA.' });
    }
  };

  const handleConfirm = async () => {
    if (!operator || !phoneNumber || phoneNumber.length < 8) {
      showModal({ type: 'alert', title: 'Erreur', message: 'Veuillez choisir un opérateur et entrer un numéro valide.' });
      return;
    }

    const val = parseInt(amount.replace(/\D/g, ''));
    const fullPhone = `${country.dial}${phoneNumber}`;

    setLoading(true);
    try {
      await withdraw(val, { phone: fullPhone, operator });
      showModal({
        type: 'alert',
        title: 'Retrait envoyé',
        message: `Votre retrait de ${val.toLocaleString('fr-FR')} FCFA via ${operator} vers ${fullPhone} est en attente de validation par l'administrateur.`,
      });
      navigate('/account');
    } catch (err) {
      showModal({
        type: 'alert',
        title: 'Erreur',
        message: `Impossible de créer le retrait : ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '20px' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
        <Banknote size={20} color="var(--primary)" />
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>DIOTYTIO</h2>
          <p style={{ fontSize: '10px', color: 'var(--primary)', letterSpacing: '1px', margin: 0 }}>RETRAIT RAPIDE</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Solde disponible</p>
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}>
            {balance.toLocaleString('fr-FR')} F
          </h3>
        </div>
      </div>

      {step === 1 && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '16px', letterSpacing: '1px' }}>1. PAYS DE RETRAIT</h4>
            <CountryPicker />
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '16px', letterSpacing: '1px' }}>2. MONTANT DU RETRAIT (FCFA)</h4>

            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <input
                type="tel"
                placeholder="Ex: 5000"
                value={amount}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setAmount(val ? parseInt(val).toLocaleString('fr-FR') : '');
                }}
                className="form-input"
                style={{ fontSize: '24px', fontWeight: '800', padding: '16px 20px', textAlign: 'center' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
              {presets.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setAmount(p.toLocaleString('fr-FR'))}
                  style={{
                    padding: '12px 0',
                    background: amount.replace(/\D/g,'') === String(p) ? 'var(--primary)' : 'var(--bg-input)',
                    color: amount.replace(/\D/g,'') === String(p) ? '#fff' : 'var(--text-primary)',
                    borderRadius: '10px',
                    border: `1px solid ${amount.replace(/\D/g,'') === String(p) ? 'var(--primary)' : 'var(--border-color)'}`,
                    fontSize: '14px', fontWeight: '600',
                    transition: 'all 0.2s',
                  }}
                >
                  {i === presets.length - 1 ? 'TOUT' : p.toLocaleString('fr-FR')}
                </button>
              ))}
            </div>

            <button onClick={handleNextStep} className="btn-primary">
              Suivant <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Montant du retrait</h3>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary)' }}>
              {amount} F
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Pays : {country.flag} {country.name}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '16px', letterSpacing: '1px' }}>3. OPÉRATEUR DE RÉCEPTION</h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {country.operators?.map(op => (
                <div
                  key={op.name}
                  onClick={() => setOperator(op.name)}
                  style={{
                    padding: '16px', borderRadius: '12px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    border: operator === op.name ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: operator === op.name ? 'rgba(138,43,226,0.1)' : 'var(--bg-input)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Smartphone size={20} color={operator === op.name ? 'var(--primary)' : 'var(--text-secondary)'} />
                    <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>{op.name}</span>
                  </div>
                  {operator === op.name && <CheckCircle2 size={20} color="var(--primary)" />}
                </div>
              ))}
            </div>

            <h4 style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '16px', letterSpacing: '1px' }}>4. NUMÉRO DE RÉCEPTION</h4>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                padding: '16px', background: 'var(--bg-input)', border: '1px solid var(--border-color)',
                borderRadius: '12px', display: 'flex', alignItems: 'center', fontWeight: '700', color: 'var(--text-primary)'
              }}>
                {country.dial}
              </div>
              <input
                type="tel"
                placeholder="Numéro sans l'indicatif"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                className="form-input"
                style={{ flex: 1 }}
              />
            </div>

            <button
              onClick={handleConfirm}
              className="btn-primary"
              disabled={loading}
              style={{ background: 'var(--primary)', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Retrait en cours...</> : 'Confirmer le retrait'}
            </button>
            <button
              onClick={() => setStep(1)}
              disabled={loading}
              style={{ width: '100%', padding: '16px', marginTop: '12px', background: 'transparent', color: 'var(--text-secondary)', fontWeight: '600' }}
            >
              Retour
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Withdraw;
