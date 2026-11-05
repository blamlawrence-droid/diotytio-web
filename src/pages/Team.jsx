import React from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Users, Link as LinkIcon, QrCode, BarChart3, UserPlus, Copy, Share2, ChevronRight, TrendingUp, Award } from 'lucide-react';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
);
const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
);

const Team = () => {
  const { showModal } = useStore();
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = React.useState(false);

  const refCode = 'DT26GAME';
  const refLink = `https://diotytio.com/register?ref=${refCode}`;

  const handleCopy = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showModal({ type: 'alert', title: 'Copié !', message: 'Le texte a été copié dans votre presse-papiers.' });
    } catch {
      showModal({ type: 'alert', title: 'Copie impossible', message: 'Copiez manuellement :\n' + text });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'DIOTYTIO', text: `Rejoins-moi sur DIOTYTIO ! Mon code : ${refCode}`, url: refLink });
      } catch {}
    } else {
      handleCopy(refLink);
    }
  };

  const handleShowQr = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(refLink)}`;
    showModal({
      type: 'qr',
      title: 'Mon code QR',
      message: `Présentez ce code ou partagez votre lien.\n\nCode : ${refCode}`,
      qrUrl,
    });
  };

  const levels = [
    { label: 'LV1', commission: '36%', users: 0, rewards: 0 },
    { label: 'LV2', commission: '2%', users: 0, rewards: 0 },
    { label: 'LV3', commission: '1%', users: 0, rewards: 0 },
  ];

  return (
    <div className="container animate-fade-in">
      {/* Hero invite banner */}
      <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', marginBottom: '20px' }}>
        <img src="/assets/hero_banner.png" alt="Invite" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(11,12,16,0.95) 50%, transparent 100%)', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '4px' }}>DIOTYTIO</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Invitez vos amis et développez votre<br/>réseau tout en gagnant des<br/>récompenses exclusives.</p>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '12px', textAlign: 'center' }}>
          <Users size={20} color="var(--primary)" />
          <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)' }}>0</p>
          <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Utilisateurs totaux</p>
        </div>
        <div className="glass-panel" style={{ padding: '12px', textAlign: 'center' }}>
          <Award size={20} color="var(--primary)" />
          <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)' }}>FCFA 0</p>
          <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Récompenses totales</p>
        </div>
        <div className="glass-panel" style={{ padding: '12px', textAlign: 'center' }}>
          <TrendingUp size={20} color="var(--primary)" />
          <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--primary)' }}>LV1</p>
          <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Niveau actuel</p>
        </div>
      </div>

      {/* Invite card */}
      <div className="glass-panel" style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <img src="/assets/pc_gamer_x1.png" alt="Invite" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '12px' }} />
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '10px' }}>Commencez à inviter vos amis</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>Partagez le code ou le lien d'invitation</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '8px 12px' }}>
              <Copy size={14} color="var(--text-secondary)" style={{ marginRight: '8px' }} />
              <span style={{ flex: 1, fontSize: '13px', fontFamily: 'monospace' }}>{refCode}</span>
              <button onClick={() => handleCopy(refCode)} style={{ background: 'transparent', color: 'var(--primary)', fontSize: '12px', fontWeight: '600' }}>Copier</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '8px 12px' }}>
              <LinkIcon size={14} color="var(--text-secondary)" style={{ marginRight: '8px' }} />
              <span style={{ flex: 1, fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{refLink}</span>
              <button onClick={() => handleCopy(refLink)} style={{ background: 'transparent', color: 'var(--primary)', fontSize: '12px', fontWeight: '600' }}>Copier</button>
            </div>
          </div>
          <button onClick={() => setShowShareModal(true)} className="btn-primary" style={{ width: '100%', marginTop: '12px', padding: '12px', fontSize: '13px', borderRadius: '12px', gap: '6px' }}>
            <Share2 size={16} /> Partager maintenant
          </button>
        </div>
      </div>

      {/* VOS GAINS PAR NIVEAU */}
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <TrendingUp size={18} color="var(--primary)" /> VOS GAINS PAR NIVEAU
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {levels.map((lv, i) => (
          <div key={i} className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px' }}>
            <div style={{ padding: '8px 14px', borderRadius: '8px', background: i === 0 ? 'var(--primary)' : i === 1 ? 'var(--secondary)' : '#e74c3c', color: '#fff', fontWeight: '700', fontSize: '13px' }}>{lv.label}</div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', gap: '4px' }}>
              <div>
                <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--primary)' }}>{lv.commission}</p>
                <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Commission</p>
              </div>
              <div>
                <p style={{ fontSize: '16px', fontWeight: '700' }}>{lv.users}</p>
                <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Utilisateurs</p>
              </div>
              <div>
                <p style={{ fontSize: '16px', fontWeight: '700' }}>{lv.rewards}</p>
                <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Récompenses</p>
              </div>
            </div>
            <ChevronRight size={16} color="var(--text-secondary)" />
          </div>
        ))}
      </div>

      {/* Bottom actions */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
        {[
          { icon: <UserPlus size={20} />, label: 'Inviter un ami', action: () => setShowShareModal(true) },
          { icon: <Share2 size={20} />, label: 'Partager le lien', action: () => setShowShareModal(true) },
          { icon: <QrCode size={20} />, label: 'Mes codes QR', action: handleShowQr },
          { icon: <BarChart3 size={20} />, label: 'Statistiques', action: () => navigate('/statistics') },
        ].map((a, i) => (
          <div key={i} onClick={a.action} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            {a.icon}
            <span style={{ fontSize: '10px', textAlign: 'center' }}>{a.label}</span>
          </div>
        ))}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div 
          onClick={(e) => e.target === e.currentTarget && setShowShareModal(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}
        >
          <div className="animate-fade-in" style={{ width: '100%', maxWidth: '340px', background: 'var(--bg-secondary)', borderRadius: '24px', padding: '24px', position: 'relative' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px', textAlign: 'center' }}>Partager sur</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <button 
                  onClick={() => { setShowShareModal(false); window.open(`https://wa.me/?text=${encodeURIComponent(`Rejoins-moi sur DIOTYTIO ! Mon code : ${refCode} ${refLink}`)}`, '_blank'); }}
                  style={{ width: '48px', height: '48px', background: 'rgba(37, 211, 102, 0.1)', border: '1px solid rgba(37, 211, 102, 0.3)', borderRadius: '14px', color: '#25D366', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <WhatsAppIcon />
                </button>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>WhatsApp</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <button 
                  onClick={() => { setShowShareModal(false); window.open(`https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent(`Rejoins-moi sur DIOTYTIO ! Mon code : ${refCode}`)}`, '_blank'); }}
                  style={{ width: '48px', height: '48px', background: 'rgba(56, 161, 243, 0.1)', border: '1px solid rgba(56, 161, 243, 0.3)', borderRadius: '14px', color: '#38A1F3', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <TelegramIcon />
                </button>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Telegram</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <button 
                  onClick={() => { setShowShareModal(false); window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(refLink)}`, '_blank'); }}
                  style={{ width: '48px', height: '48px', background: 'rgba(24, 119, 242, 0.1)', border: '1px solid rgba(24, 119, 242, 0.3)', borderRadius: '14px', color: '#1877F2', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <FacebookIcon />
                </button>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Facebook</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <button 
                  onClick={() => { setShowShareModal(false); window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent(`Rejoins-moi sur DIOTYTIO ! Mon code : ${refCode}`)}`, '_blank'); }}
                  style={{ width: '48px', height: '48px', background: 'rgba(29, 161, 242, 0.1)', border: '1px solid rgba(29, 161, 242, 0.3)', borderRadius: '14px', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <XIcon />
                </button>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>X</span>
              </div>
            </div>

            <button 
              onClick={() => { setShowShareModal(false); handleShare(); }} 
              style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '14px', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '12px' }}
            >
              <Share2 size={16} /> Plus d'options natives
            </button>
            
            <button 
              onClick={() => setShowShareModal(false)} 
              style={{ width: '100%', padding: '14px', background: 'transparent', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600' }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
