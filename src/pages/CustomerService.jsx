import React from 'react';
import { Headset, Clock, Send, Volume2, ShieldAlert } from 'lucide-react';

const CustomerService = () => {
  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      {/* Banner */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Service<br/>client</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Nous sommes là pour<br/>vous accompagner</p>
      </div>
      
      <div style={{ position: 'relative', marginBottom: '24px', borderRadius: '16px', overflow: 'hidden' }}>
        <img src="/assets/game1.png" alt="Gaming" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
      </div>

      {/* Horaires */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(233, 30, 99, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Headset size={28} color="var(--primary)" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Horaires en ligne</span>
              <span style={{ fontSize: '10px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }}></span> En temps réel
              </span>
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>9h00 - 19h00</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Nous répondons à vos questions<br/>du lundi au dimanche</p>
          </div>
        </div>
        <Clock size={32} color="var(--primary)" style={{ opacity: 0.5 }} />
      </div>

      {/* Telegram */}
      <div className="glass-panel" style={{ padding: '0', marginBottom: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0088cc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Send size={16} color="#fff" />
          </div>
          <span style={{ fontSize: '15px', fontWeight: '700' }}>Télégramme</span>
        </div>
        
        <div onClick={() => window.open('https://t.me/diotytio_support', '_blank')} style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(233, 30, 99, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Send size={20} color="var(--primary)" />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '14px', fontWeight: '700' }}>@DiotytioSupport</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Contactez notre service client</p>
          </div>
          <span style={{ color: 'var(--text-secondary)' }}>›</span>
        </div>

        <div onClick={() => window.open('https://t.me/diotytio_channel', '_blank')} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(233, 30, 99, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Volume2 size={20} color="var(--primary)" />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '14px', fontWeight: '700' }}>@Chaîne Telegram officielle</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Suivez toutes nos actualités</p>
          </div>
          <span style={{ color: 'var(--text-secondary)' }}>›</span>
        </div>
      </div>

      {/* Règles */}
      <div className="glass-panel" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <ShieldAlert size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '15px', fontWeight: '700' }}>Règles importantes</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>1</div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>Pour toute question, n'hésitez pas à contacter notre service client en ligne. Nous serons ravis de vous aider.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>2</div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>Veuillez conserver votre mot de passe en lieu sûr et ne le divulguez jamais à personne. Le personnel officiel ne vous le demandera jamais.</p>
          </div>
        </div>

        <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', width: '120px', height: '120px', borderRadius: '30px', background: 'rgba(233, 30, 99, 0.05)', transform: 'rotate(15deg)', zIndex: 0 }}></div>
      </div>

    </div>
  );
};

export default CustomerService;
