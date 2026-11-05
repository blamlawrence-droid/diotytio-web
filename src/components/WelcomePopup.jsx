import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, TrendingUp, Users, Gift, Wifi, Send, Phone, Rocket, Sparkles } from 'lucide-react';
import { useStore } from '../store';

const WelcomePopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const { country } = useStore();

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('diotytio_welcome_seen');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Trigger scale animation after mount
        requestAnimationFrame(() => setAnimateIn(true));
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('diotytio_welcome_seen', 'true');
    }, 300);
  };

  if (!isVisible) return null;

  const infoItems = [
    { icon: <CheckCircle2 size={18} />, text: 'Déposez 3 000 FCFA et retirez immédiatement 1 900 FCFA', highlight: ['3 000 FCFA', '1 900 FCFA'] },
    { icon: <CheckCircle2 size={18} />, text: 'Frais de retrait : 6 %', highlight: ['6 %'] },
    { icon: <Users size={18} />, text: 'Commissions de parrainage : 35 % niveau 1, 3 % niveau 2 et 2 % niveau 3', highlight: ['35 %', '3 %', '2 %'] },
    { icon: <TrendingUp size={18} />, text: "Jusqu'à 4 retraits par jour", highlight: ['4 retraits par jour'] },
    { icon: <Gift size={18} />, text: 'Bonus de bienvenue : 1 700 FCFA', highlight: ['1 700 FCFA'] },
    { icon: <Wifi size={18} />, text: 'Connexion quotidienne : 150 FCFA', highlight: ['150 FCFA'] },
  ];

  const renderHighlightedText = (text, highlights) => {
    let result = text;
    let parts = [text];
    highlights.forEach(h => {
      const newParts = [];
      parts.forEach(part => {
        if (typeof part === 'string') {
          const idx = part.indexOf(h);
          if (idx !== -1) {
            if (idx > 0) newParts.push(part.substring(0, idx));
            newParts.push({ highlight: true, text: h });
            if (idx + h.length < part.length) newParts.push(part.substring(idx + h.length));
          } else {
            newParts.push(part);
          }
        } else {
          newParts.push(part);
        }
      });
      parts = newParts;
    });
    return parts.map((p, i) => 
      typeof p === 'string' 
        ? <span key={i}>{p}</span> 
        : <strong key={i} style={{ color: '#2ecc71' }}>{p.text}</strong>
    );
  };

  return (
    <div 
      onClick={handleClose} 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        background: animateIn ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0)', 
        backdropFilter: animateIn ? 'blur(8px)' : 'blur(0px)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        zIndex: 10000, 
        padding: '16px',
        transition: 'all 0.4s ease',
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          width: '100%', 
          maxWidth: '420px', 
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '28px', 
          overflow: 'hidden', 
          position: 'relative', 
          background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(46,204,113,0.15)',
          transform: animateIn ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(30px)',
          opacity: animateIn ? 1 : 0,
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        {/* Header Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '16px 20px', 
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '36px', height: '36px', borderRadius: '10px', 
              background: 'linear-gradient(135deg, #2ecc71, #27ae60)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(46,204,113,0.3)',
            }}>
              <img src="/assets/logo.png" alt="Logo" style={{ width: '24px', borderRadius: '4px' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: '800', margin: 0, letterSpacing: '1.5px', color: '#fff' }}>DIOTYTIO</h2>
              <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', margin: 0, letterSpacing: '1px', fontWeight: '600' }}>GAMING · TECHNOLOGIE · PERFORMANCE</p>
            </div>
          </div>
          <button 
            onClick={handleClose} 
            style={{ 
              width: '34px', height: '34px', borderRadius: '50%', 
              background: 'rgba(255,255,255,0.08)', 
              border: '1px solid rgba(255,255,255,0.15)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Hero Image */}
        <div style={{ width: '100%', height: '170px', position: 'relative', overflow: 'hidden' }}>
          <img 
            src="/assets/hero_banner.png" 
            alt="Lancement" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div style={{ 
            position: 'absolute', inset: 0, 
            background: 'linear-gradient(to bottom, transparent 40%, #1a1a2e 100%)',
          }} />
          
          {/* Floating Badge */}
          <div style={{ 
            position: 'absolute', bottom: '-22px', left: '50%', transform: 'translateX(-50%)', 
            width: '44px', height: '44px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, #2ecc71, #27ae60)', 
            border: '3px solid #1a1a2e',
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            color: '#fff', zIndex: 10,
            boxShadow: '0 4px 20px rgba(46,204,113,0.4)',
          }}>
            <Rocket size={22} />
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px 22px 24px' }}>
          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '8px' }}>
              <Sparkles size={16} color="#2ecc71" />
              <span style={{ fontSize: '11px', color: '#2ecc71', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>Lancement officiel</span>
              <Sparkles size={16} color="#2ecc71" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '6px', lineHeight: '1.3', color: '#fff' }}>
              🚀 DIOTYTIO {country?.name || "Côte d'Ivoire"}
            </h3>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
              La plateforme est maintenant en ligne !
            </p>
          </div>

          {/* Info Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '24px' }}>
            {infoItems.map((item, idx) => (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  gap: '14px', 
                  alignItems: 'flex-start', 
                  padding: '14px 0',
                  borderBottom: idx !== infoItems.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}
              >
                <div style={{ 
                  flexShrink: 0, marginTop: '1px', 
                  color: '#2ecc71',
                  width: '28px', height: '28px', borderRadius: '8px',
                  background: 'rgba(46,204,113,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {item.icon}
                </div>
                <p style={{ fontSize: '13px', lineHeight: '1.5', margin: 0, color: 'rgba(255,255,255,0.85)' }}>
                  {renderHighlightedText(item.text, item.highlight)}
                </p>
              </div>
            ))}
          </div>

          {/* Social Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button 
              onClick={() => window.open('https://t.me/', '_blank')}
              style={{ 
                padding: '14px', 
                background: 'rgba(56, 161, 243, 0.08)', 
                border: '1px solid rgba(56, 161, 243, 0.25)', 
                borderRadius: '14px', 
                color: '#38A1F3', 
                fontSize: '13px', 
                fontWeight: '700', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <Send size={16} /> Télégramme
            </button>
            <button 
              onClick={() => window.open('https://wa.me/', '_blank')}
              style={{ 
                padding: '14px', 
                background: 'rgba(37, 211, 102, 0.08)', 
                border: '1px solid rgba(37, 211, 102, 0.25)', 
                borderRadius: '14px', 
                color: '#25D366', 
                fontSize: '13px', 
                fontWeight: '700', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <Phone size={16} /> WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
