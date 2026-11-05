import React, { useEffect } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, CheckCircle2, Clock, TrendingUp, MonitorPlay, ChevronRight, RefreshCw } from 'lucide-react';

const Products = () => {
  const { balance, buyProduct, loadPurchases, showModal, products: ownedProducts } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadPurchases();
  }, [loadPurchases]);

  const products = [
    { id: 'p1', name: 'PC Pro Gamer X1',   badge: 'MEILLEURE VENTE', price: 3000,   duration: 60, daily: 900,   total: 54000,    image: '/assets/pc_gamer_x1.png' },
    { id: 'p2', name: 'PC Elite Strike',   badge: null,              price: 7000,   duration: 60, daily: 2100,  total: 126000,   image: '/assets/pc_elite_strike.png' },
    { id: 'p3', name: 'PC Vortex Prime',   badge: null,              price: 15000,  duration: 60, daily: 4500,  total: 270000,   image: '/assets/pc_vortex_prime.png' },
    { id: 'p4', name: 'PC HyperForce Z4',  badge: null,              price: 25000,  duration: 60, daily: 7500,  total: 450000,   image: '/assets/pc_gamer_x1.png' },
    { id: 'p5', name: 'PC TitanX Pro',     badge: null,              price: 50000,  duration: 60, daily: 15000, total: 900000,   image: '/assets/pc_elite_strike.png' },
    { id: 'p6', name: 'PC UltraCore Max',  badge: null,              price: 100000, duration: 60, daily: 30000, total: 1800000,  image: '/assets/pc_vortex_prime.png' },
  ];

  const fmt = (n) => n.toLocaleString('fr-FR');

  const handleBuy = (product) => {
    if (balance >= product.price) {
      showModal({
        type: 'confirm',
        title: 'Confirmer l\'achat',
        message: `Voulez-vous acheter ${product.name} pour ${fmt(product.price)} FCFA ?\n\nRevenu quotidien : ${fmt(product.daily)} FCFA\nRevenus totaux : ${fmt(product.total)} FCFA`,
        onConfirm: () => {
          setTimeout(async () => {
            try {
              await buyProduct(product);
              showModal({ type: 'alert', title: 'Achat réussi !', message: `${product.name} activé ! Vos revenus quotidiens démarrent maintenant.` });
            } catch (err) {
              showModal({ type: 'alert', title: 'Erreur', message: err.message });
            }
          }, 300);
        }
      });
    } else {
      showModal({
        type: 'confirm',
        title: 'Solde insuffisant',
        message: `Il vous manque ${fmt(product.price - balance)} FCFA. Voulez-vous recharger votre compte ?`,
        onConfirm: () => navigate('/deposit')
      });
    }
  };

  return (
    <div className="container animate-fade-in">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/assets/logo.png" alt="logo" style={{ height: 'clamp(22px, 5vw, 28px)' }} />
          <div>
            <h2 style={{ fontSize: 'var(--font-lg)', fontWeight: '800' }}>DIOTYTIO</h2>
            <p style={{ fontSize: 'clamp(9px, 2vw, 11px)', color: 'var(--text-secondary)', letterSpacing: '2px' }}>— ENTREPRISE —</p>
          </div>
        </div>
        <RefreshCw size={18} color="var(--text-secondary)" style={{ cursor: 'pointer', flexShrink: 0 }} />
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-md)' }}>
        <div className="glass-panel" style={{ padding: 'clamp(12px, 3vw, 16px)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(138,43,226,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
            <MonitorPlay size={18} />
          </div>
          <div>
            <p style={{ fontSize: 'var(--font-lg)', fontWeight: '700' }}>{ownedProducts.length}</p>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>Mes produits</p>
          </div>
          <ChevronRight size={16} color="var(--text-secondary)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
        </div>
        <div className="glass-panel" style={{ padding: 'clamp(12px, 3vw, 16px)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(138,43,226,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
            <TrendingUp size={18} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 'var(--font-md)', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>FCFA 0</p>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>Mes revenus</p>
          </div>
          <ChevronRight size={16} color="var(--text-secondary)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
        </div>
      </div>

      <h2 style={{ marginBottom: '4px', fontSize: 'var(--font-xl)' }}>NOS PC <span className="text-gradient">PREMIUM</span></h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)', marginBottom: 'var(--spacing-md)' }}>Investissez dans l'avenir. Générez des revenus.</p>

      {/* Product Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
        {products.map((p) => (
          <div key={p.id} className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ display: 'flex' }}>
              {/* Image */}
              <div style={{ width: 'clamp(95px, 25vw, 120px)', minHeight: '140px', flexShrink: 0 }}>
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {/* Details */}
              <div style={{ flex: 1, padding: 'clamp(10px, 3vw, 14px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div style={{ minWidth: 0 }}>
                      {p.badge && <span style={{ fontSize: 'clamp(8px, 2vw, 10px)', fontWeight: '700', color: 'var(--primary)', letterSpacing: '0.5px', display: 'block' }}>{p.badge}</span>}
                      <h3 style={{ fontSize: 'clamp(12px, 3.2vw, 15px)', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</h3>
                    </div>
                    <span style={{ fontSize: 'clamp(9px, 2.2vw, 11px)', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0, marginLeft: '6px' }}>
                      <CheckCircle2 size={11} /> Dispo
                    </span>
                  </div>

                  <div style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {[
                      { icon: <ShoppingCart size={10} />, label: 'Prix',     value: `${fmt(p.price)} F`,   color: '#fff' },
                      { icon: <Clock size={10} />,        label: 'Durée',    value: `${p.duration} j`,     color: '#fff' },
                      { icon: <TrendingUp size={10} />,   label: 'Journalier',value: `${fmt(p.daily)} F`,  color: 'var(--accent)' },
                    ].map((row, ri) => (
                      <div key={ri} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>{row.icon} {row.label}</span>
                        <span style={{ fontWeight: '600', color: row.color }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={() => handleBuy(p)} style={{
                  marginTop: '10px',
                  padding: 'clamp(7px, 2vw, 9px)',
                  background: 'var(--primary)',
                  color: '#fff',
                  borderRadius: '8px',
                  fontSize: 'clamp(11px, 2.8vw, 13px)',
                  fontWeight: '700',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                  width: '100%',
                }}>
                  <ShoppingCart size={13} /> Acheter
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ height: '12px' }} />
    </div>
  );
};

export default Products;
