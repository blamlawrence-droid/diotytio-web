import React, { useState } from 'react';
import { parseDepositAmount, isValidDepositAmount } from '../depositAmount.js';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Smartphone, CheckCircle2, ArrowRight } from 'lucide-react';import CountryPicker from '../components/CountryPicker';

const Deposit = () => {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [operator, setOperator] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { showModal, country } = useStore();
  const navigate = useNavigate();

  const presets = [3000, 7000, 15000, 25000, 45000, 75000];

  const handleNextStep = () => {
    const val = parseDepositAmount(amount);
    if (isValidDepositAmount(val)) {
      setStep(2);
      if (country.operators && country.operators.length > 0) {
        setOperator(country.operators[0].name);
      }
    } else {
      showModal({ type: 'alert', title: 'Erreur', message: 'Le montant du dépôt doit être un entier entre 3 000 et 1 000 000 FCFA.' });
    }
  };

  const handleConfirm = () => {
    if (!operator || !phoneNumber || phoneNumber.length < 8) {
      showModal({ type: 'alert', title: 'Erreur', message: 'Veuillez choisir un opérateur et entrer un numéro valide.' });
      return;
    }

    const val = parseDepositAmount(amount);
    if (!isValidDepositAmount(val)) {
      showModal({ type: 'alert', title: 'Erreur', message: 'Le montant du dépôt doit être un entier entre 3 000 et 1 000 000 FCFA.' });
      return;
    }
    const fullPhone = `${country.dial}${phoneNumber}`;

    navigate('/deposit/ussd', { state: { amount: val, operator, phone: fullPhone, country } });
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '20px' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
        <ShieldCheck size={20} color="var(--success)" />
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>DIOTYTIO</h2>
          <p style={{ fontSize: '10px', color: 'var(--success)', letterSpacing: '1px', margin: 0 }}>DÉPÔT SÉCURISÉ</p>
        </div>
      </div>

      {step === 1 && (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '16px', letterSpacing: '1px' }}>1. CHOISISSEZ VOTRE PAYS</h4>
            <CountryPicker />
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '16px', letterSpacing: '1px' }}>2. MONTANT DU DÉPÔT (FCFA)</h4>

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
              {presets.map(p => (
                <button
                  key={p}
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
                  {p.toLocaleString('fr-FR')}
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
            <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Montant à déposer</h3>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary)' }}>
              {amount} F
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Pays : {country.flag} {country.name}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '16px', letterSpacing: '1px' }}>3. OPÉRATEUR MOBILE MONEY</h4>

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

            <h4 style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '16px', letterSpacing: '1px' }}>4. NUMÉRO DE TÉLÉPHONE</h4>
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
              style={{ background: 'var(--success)', boxShadow: '0 4px 20px rgba(46, 204, 113, 0.3)' }}
            >
              Payer maintenant
            </button>
            <button
              onClick={() => setStep(1)}
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

export default Deposit;
