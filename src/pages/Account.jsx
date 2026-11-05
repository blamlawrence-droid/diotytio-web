import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { LogOut, Eye, EyeOff, Info, FileText, Headset, History, CreditCard, ChevronRight, Gift, Lock, ArrowDownToLine, ArrowUpFromLine, Sun, Moon } from 'lucide-react';

const Account = () => {
  const navigate = useNavigate();
  const { balance, showModal, logout, phone, isAdmin, theme, toggleTheme, refreshUser } = useStore();
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const handleLogout = () => {
    showModal({
      type: 'confirm',
      title: 'Déconnexion',
      message: 'Voulez-vous vraiment vous déconnecter ?',
      onConfirm: () => {
        logout();
        navigate('/login');
      }
    });
  };

  const menuItems = [
    { icon: <Info size={18} />,       label: 'À propos de nous',           action: () => navigate('/about') },
    { icon: <FileText size={18} />,   label: 'Réglementation',             action: () => navigate('/rules') },
    { icon: <History size={18} />,    label: 'Historique des transactions', action: () => navigate('/history') },
    { icon: <Headset size={18} />,    label: 'Service client',              action: () => navigate('/customer-service') },
    { icon: <CreditCard size={18} />, label: 'Lier une carte bancaire',     action: () => navigate('/bank-accounts') },
    { icon: <Lock size={18} />,       label: 'Modifier le mot de passe',    action: () => navigate('/change-password') },
    { icon: <Gift size={18} />,       label: 'Échanger un cadeau',          action: () => showModal({ type: 'prompt', title: 'Code cadeau', message: 'Entrez votre code cadeau :' }) },
  ];

  if (isAdmin) {
    menuItems.unshift({ icon: <span style={{ fontSize: '16px' }}>🛡️</span>, label: 'Panneau Administrateur', action: () => navigate('/admin') });
  }

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '100px' }}>

      {/* Profile Card */}
      <div className="glass-panel" style={{ padding: 'clamp(18px, 5vw, 28px)', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 'var(--spacing-md)', textAlign: 'center', position: 'relative' }}>

        {/* Theme toggle — top right of card */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
          style={{
            position: 'absolute', top: '14px', right: '14px',
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 12px', borderRadius: '20px',
            background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-secondary)',
            fontSize: '12px', fontWeight: '600',
            transition: 'all 0.3s',
          }}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          {theme === 'dark' ? 'Clair' : 'Sombre'}
        </button>

        <div style={{
          width: 'clamp(56px, 14vw, 70px)', height: 'clamp(56px, 14vw, 70px)',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(138,43,226,0.2), rgba(69,162,158,0.2))',
          border: '2px solid rgba(138,43,226,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '14px',
        }}>
          <img src="/assets/logo.png" alt="Profile" style={{ width: '60%', height: '60%', objectFit: 'contain' }} />
        </div>

        {phone && (
          <p style={{ fontSize: 'var(--font-md)', fontWeight: '700', marginBottom: '4px' }}>{phone}</p>
        )}
        {isAdmin && (
          <span style={{ fontSize: 'var(--font-xs)', fontWeight: '700', padding: '3px 10px', background: 'rgba(138,43,226,0.15)', color: 'var(--primary)', borderRadius: '20px', marginBottom: '8px', letterSpacing: '1px' }}>
            ADMINISTRATEUR
          </span>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', marginTop: '4px' }}>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>Solde total</p>
          <span onClick={() => setShowBalance(!showBalance)} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}>
            {showBalance ? <Eye size={15} /> : <EyeOff size={15} />}
          </span>
        </div>

        <h2 style={{ fontSize: 'clamp(26px, 7vw, 34px)', fontWeight: '800', marginBottom: 'var(--spacing-md)', letterSpacing: '-0.5px' }}>
          {showBalance ? `${balance.toLocaleString('fr-FR')} F` : '••••••'}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%' }}>
          <button onClick={() => navigate('/deposit')} style={{
            padding: 'clamp(11px, 3vw, 14px)',
            background: 'var(--primary)',
            color: '#fff', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', fontSize: 'var(--font-sm)', fontWeight: '700',
          }}>
            <ArrowDownToLine size={16} /> Dépôt
          </button>
          <button onClick={() => navigate('/withdraw')} style={{
            padding: 'clamp(11px, 3vw, 14px)',
            background: 'var(--bg-input)',
            color: 'var(--text-primary)', borderRadius: '12px',
            border: '1px solid var(--border-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', fontSize: 'var(--font-sm)', fontWeight: '700',
          }}>
            <ArrowUpFromLine size={16} /> Retrait
          </button>
        </div>
      </div>

      {/* Menu */}
      <div className="glass-panel" style={{ padding: 'clamp(6px, 2vw, 10px) clamp(12px, 3vw, 18px)', marginBottom: 'var(--spacing-md)' }}>
        {menuItems.map((item, idx, arr) => (
          <div
            key={idx}
            onClick={item.action}
            style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: 'clamp(13px, 3.5vw, 16px) 0',
              borderBottom: idx < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              cursor: 'pointer', color: 'var(--text-secondary)',
            }}
          >
            <span style={{ flexShrink: 0 }}>{item.icon}</span>
            <span style={{ flex: 1, fontSize: 'var(--font-md)', color: 'var(--text-primary)', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.label}
            </span>
            <ChevronRight size={16} style={{ flexShrink: 0 }} />
          </div>
        ))}
      </div>

      {/* Logout */}
      <button onClick={handleLogout} style={{
        width: '100%',
        padding: 'clamp(13px, 3.5vw, 16px)',
        background: 'rgba(255, 76, 76, 0.05)',
        border: '1px solid rgba(255, 76, 76, 0.2)',
        color: 'var(--danger)',
        borderRadius: '12px',
        fontSize: 'var(--font-md)', fontWeight: '700',
        display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
        transition: 'background 0.2s',
      }}>
        <LogOut size={18} />
        Se déconnecter
      </button>
    </div>
  );
};

export default Account;
