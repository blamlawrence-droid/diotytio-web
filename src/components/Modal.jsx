import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { X, CheckCircle2, AlertTriangle, Info, HelpCircle, ShieldCheck, Sparkles } from 'lucide-react';

const Modal = () => {
  const { modal, hideModal } = useStore();
  const [inputValue, setInputValue] = useState('');
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (modal) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateIn(true));
      });
    } else {
      setAnimateIn(false);
    }
  }, [modal]);

  if (!modal) return null;

  const closeWithAnimation = (callback) => {
    setAnimateIn(false);
    setTimeout(() => {
      if (callback) callback();
      hideModal();
    }, 250);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeWithAnimation();
    }
  };

  const handleSubmit = () => {
    if (modal.onSubmit) {
      modal.onSubmit(inputValue);
    }
    closeWithAnimation();
    setInputValue('');
  };

  const handleConfirm = () => {
    closeWithAnimation(modal.onConfirm);
  };

  // Determine icon and accent color based on modal title/type
  const getModalTheme = () => {
    const title = (modal.title || '').toLowerCase();
    if (title.includes('succès') || title.includes('réussi') || title.includes('envoyée') || title.includes('envoyé')) {
      return { icon: <CheckCircle2 size={28} />, color: '#2ecc71', bgGlow: 'rgba(46,204,113,0.15)', label: 'Succès' };
    }
    if (title.includes('erreur') || title.includes('insuffisant')) {
      return { icon: <AlertTriangle size={28} />, color: '#e74c3c', bgGlow: 'rgba(231,76,60,0.15)', label: 'Erreur' };
    }
    if (title.includes('confirmer') || title.includes('demande')) {
      return { icon: <HelpCircle size={28} />, color: '#8a2be2', bgGlow: 'rgba(138,43,226,0.15)', label: 'Confirmation' };
    }
    if (title.includes('pointage')) {
      return { icon: <Sparkles size={28} />, color: '#f39c12', bgGlow: 'rgba(243,156,18,0.15)', label: 'Récompense' };
    }
    return { icon: <Info size={28} />, color: '#3498db', bgGlow: 'rgba(52,152,219,0.15)', label: 'Information' };
  };

  const theme = getModalTheme();

  // Parse message to highlight FCFA amounts
  const renderMessage = (msg) => {
    if (!msg) return null;
    const parts = msg.split('\n');
    return parts.map((line, i) => {
      // Highlight FCFA amounts
      const highlighted = line.replace(
        /(\d[\d\s]*(?:FCFA|F CFA|F))/g,
        '|||$1|||'
      );
      const segments = highlighted.split('|||');
      return (
        <span key={i} style={{ display: 'block', marginBottom: i < parts.length - 1 ? '8px' : 0 }}>
          {segments.map((seg, j) => {
            if (/\d[\d\s]*(?:FCFA|F CFA|F)/.test(seg)) {
              return <strong key={j} style={{ color: theme.color, fontWeight: '700' }}>{seg}</strong>;
            }
            return <span key={j}>{seg}</span>;
          })}
        </span>
      );
    });
  };

  return (
    <div 
      onClick={handleOverlayClick} 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        background: animateIn ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0)', 
        backdropFilter: animateIn ? 'blur(8px)' : 'blur(0px)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        zIndex: 9999, 
        padding: '20px',
        transition: 'all 0.3s ease',
      }}
    >
      <div 
        style={{ 
          width: '100%', 
          maxWidth: '400px', 
          position: 'relative', 
          borderRadius: '24px',
          overflow: 'hidden',
          background: 'linear-gradient(170deg, #1a1d2e 0%, #141722 50%, #0d0f18 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: `0 25px 60px rgba(0,0,0,0.5), 0 0 30px ${theme.bgGlow}`,
          transform: animateIn ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
          opacity: animateIn ? 1 : 0,
          transition: 'all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        {/* Top Accent Stripe */}
        <div style={{ 
          height: '4px', 
          background: `linear-gradient(90deg, transparent, ${theme.color}, transparent)`,
        }} />

        {/* Close Button (non-alert) */}
        {modal.type !== 'alert' && modal.type !== 'qr' && (
          <button 
            onClick={() => closeWithAnimation()} 
            style={{ 
              position: 'absolute', top: '16px', right: '16px', 
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)', 
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s', zIndex: 10,
            }}
          >
            <X size={16} />
          </button>
        )}

        {/* Content */}
        <div style={{ padding: '28px 24px 24px' }}>
          
          {/* Icon Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ 
              width: '64px', height: '64px', borderRadius: '20px',
              background: theme.bgGlow,
              border: `1px solid ${theme.color}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: theme.color,
              boxShadow: `0 8px 24px ${theme.bgGlow}`,
            }}>
              {theme.icon}
            </div>
          </div>

          {/* Title */}
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '800', 
            marginBottom: '4px', 
            color: '#fff', 
            textAlign: 'center',
            letterSpacing: '0.3px',
          }}>
            {modal.title || 'Information'}
          </h3>

          {/* Subtle label */}
          <p style={{ 
            fontSize: '11px', 
            color: theme.color, 
            textAlign: 'center', 
            marginBottom: '20px',
            fontWeight: '600',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}>
            {theme.label}
          </p>

          {/* QR Code */}
          {modal.type === 'qr' && modal.qrUrl && (
            <div style={{ 
              display: 'flex', justifyContent: 'center', marginBottom: '20px', 
              padding: '16px', background: '#fff', borderRadius: '16px', 
              width: 'fit-content', margin: '0 auto 20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}>
              <img src={modal.qrUrl} alt="Code QR" style={{ width: '200px', height: '200px' }} />
            </div>
          )}

          {/* Message */}
          <div style={{ 
            fontSize: '14px', 
            color: 'rgba(255,255,255,0.7)', 
            marginBottom: '24px', 
            lineHeight: '1.6',
            textAlign: 'center',
            padding: '16px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.05)',
          }}>
            {renderMessage(modal.message)}
          </div>

          {/* Prompt Input */}
          {modal.type === 'prompt' && (
            <div style={{ marginBottom: '24px' }}>
              <input 
                type="text" 
                placeholder="Tapez ici..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                autoFocus
                style={{ 
                  width: '100%', padding: '14px 18px', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.12)', 
                  borderRadius: '14px', color: '#fff', fontSize: '15px', 
                  fontFamily: 'Outfit, sans-serif', outline: 'none',
                  transition: 'border-color 0.3s',
                }}
                onFocus={(e) => e.target.style.borderColor = theme.color}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            
            {/* Cancel button for non-alert modals */}
            {modal.type !== 'alert' && modal.type !== 'qr' && (
              <button 
                onClick={() => closeWithAnimation()} 
                style={{ 
                  flex: 1, padding: '14px 20px', 
                  background: 'rgba(255,255,255,0.06)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '14px', 
                  color: 'rgba(255,255,255,0.6)', 
                  fontSize: '14px', fontWeight: '600',
                  cursor: 'pointer', transition: 'all 0.2s',
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                Annuler
              </button>
            )}

            {/* OK / Confirm / Submit button */}
            {(modal.type === 'alert' || modal.type === 'qr') && (
              <button 
                onClick={() => closeWithAnimation()} 
                style={{ 
                  flex: 1, padding: '14px 20px', 
                  background: `linear-gradient(135deg, ${theme.color}, ${theme.color}cc)`,
                  borderRadius: '14px', border: 'none',
                  color: '#fff', fontSize: '15px', fontWeight: '700',
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: `0 4px 20px ${theme.bgGlow}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                <ShieldCheck size={18} /> Compris
              </button>
            )}

            {modal.type === 'confirm' && (
              <button 
                onClick={handleConfirm} 
                style={{ 
                  flex: 1, padding: '14px 20px', 
                  background: `linear-gradient(135deg, ${theme.color}, ${theme.color}cc)`,
                  borderRadius: '14px', border: 'none',
                  color: '#fff', fontSize: '15px', fontWeight: '700',
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: `0 4px 20px ${theme.bgGlow}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                <CheckCircle2 size={18} /> Confirmer
              </button>
            )}

            {modal.type === 'prompt' && (
              <button 
                onClick={handleSubmit} 
                style={{ 
                  flex: 1, padding: '14px 20px', 
                  background: `linear-gradient(135deg, ${theme.color}, ${theme.color}cc)`,
                  borderRadius: '14px', border: 'none',
                  color: '#fff', fontSize: '15px', fontWeight: '700',
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: `0 4px 20px ${theme.bgGlow}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                <CheckCircle2 size={18} /> Soumettre
              </button>
            )}
          </div>

          {/* Security footer */}
          <div style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', 
            marginTop: '16px', fontSize: '11px', color: 'rgba(255,255,255,0.3)',
          }}>
            <ShieldCheck size={12} /> Transaction sécurisée par DIOTYTIO
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
