import React, { useEffect } from 'react';
import { useStore } from '../store';
import { Plus, ShieldCheck, Wallet, Trash2 } from 'lucide-react';
import CountryPicker from '../components/CountryPicker';

const BankAccounts = () => {
  const { bankAccounts, loadBankAccounts, addBankAccount, removeBankAccount, showModal, country } = useStore();

  useEffect(() => {
    loadBankAccounts().catch(error => showModal({ type: 'alert', title: 'Erreur', message: error.message }));
  }, [loadBankAccounts, showModal]);

  const countryAccounts = bankAccounts.filter(acc => acc.countryCode === country.code);

  const handleAddAccount = () => {
    showModal({
      type: 'prompt',
      title: 'Ajouter un compte',
      message: `Veuillez saisir votre numéro Mobile Money en ${country.name} ${country.flag} :`,
      onSubmit: async (value) => {
        const number = (value || '').trim();
        if (!number) {
          showModal({ type: 'alert', title: 'Erreur', message: 'Le numéro ne peut pas être vide.' });
          return;
        }
        if ((number.replace(/\D/g, '')).length < 8) {
          showModal({ type: 'alert', title: 'Erreur', message: 'Veuillez saisir un numéro valide (au moins 8 chiffres).' });
          return;
        }
        if (bankAccounts.some(acc => acc.number.replace(/\s/g, '') === number.replace(/\s/g, ''))) {
          showModal({ type: 'alert', title: 'Erreur', message: 'Ce compte est déjà lié.' });
          return;
        }
        try {
          await addBankAccount(number);
          showModal({ type: 'alert', title: 'Succès', message: `Votre compte ${number} a été ajouté avec succès.` });
        } catch (error) {
          showModal({ type: 'alert', title: 'Erreur', message: error.message });
        }
      }
    });
  };

  const handleRemoveAccount = (acc) => {
    showModal({
      type: 'confirm',
      title: 'Supprimer le compte',
      message: `Voulez-vous vraiment supprimer le compte ${acc.number} ?`,
      onConfirm: async () => {
        try { await removeBankAccount(acc.id); }
        catch (error) { showModal({ type: 'alert', title: 'Erreur', message: error.message }); }
      }
    });
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '40px' }}>

      {/* Banner */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Comptes<br/>bancaires</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Gérez vos comptes de retrait<br/>en toute sécurité.</p>
      </div>

      {/* Sélecteur de pays */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <h4 style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '16px', letterSpacing: '1px' }}>PAYS DU COMPTE</h4>
        <CountryPicker />
      </div>

      <div className="glass-panel" style={{ padding: '0', marginBottom: '30px', borderRadius: '24px', overflow: 'hidden' }}>
        <img src="/assets/safe.png" alt="Safe" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />

        {countryAccounts.length === 0 ? (
          <div style={{ padding: '30px 20px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>Aucun compte en {country.name} {country.flag}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>Ajoutez un compte dans ce pays pour recevoir<br/>vos retraits en toute simplicité.</p>
          </div>
        ) : (
          <div style={{ padding: '16px 20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Mes comptes ({countryAccounts.length})</h3>
            {countryAccounts.map(acc => (
              <div key={acc.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(233, 30, 99, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                  <Wallet size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '15px', fontWeight: '700', display: 'block' }}>Mobile Money {country.flag}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{country.dial} {acc.number}</span>
                </div>
                <div onClick={() => handleRemoveAccount(acc)} style={{ color: 'var(--danger)', cursor: 'pointer', padding: '6px' }}>
                  <Trash2 size={18} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleAddAccount}
        className="btn-primary"
        style={{ width: '100%', padding: '18px', fontSize: '16px', fontWeight: '700', borderRadius: '16px', background: 'var(--primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '20px' }}
      >
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={14} />
        </div>
        Ajouter un compte
      </button>

      <div className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(233, 30, 99, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ShieldCheck size={24} color="var(--primary)" />
        </div>
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>Vos informations sont protégées</h4>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Nous utilisons un cryptage de niveau bancaire pour sécuriser vos données.</p>
        </div>
      </div>

    </div>
  );
};

export default BankAccounts;
