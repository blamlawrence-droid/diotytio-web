import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

const Rules = () => {
  const [openSection, setOpenSection] = useState(null);

  const sections = [
    {
      title: 'À propos de DIOTYTIO',
      content: "DIOTYTIO est une plateforme d'investissement innovante spécialisée dans l'industrie du jeu vidéo et de l'e-sport. Notre mission est de démocratiser l'accès aux revenus générés par les produits gaming de nouvelle génération. En devenant membre, vous louez des équipements virtuels qui génèrent des rendements quotidiens stables et garantis."
    },
    {
      title: 'Programme de parrainage',
      content: "Invitez vos amis et gagnez des commissions sur leurs investissements !\n\n• Niveau 1 (Directs) : Gagnez 10% sur chaque dépôt effectué par vos filleuls de niveau 1.\n• Niveau 2 (Indirects) : Gagnez 5% sur les dépôts de vos filleuls de niveau 2.\n• Niveau 3 : Gagnez 2% sur les dépôts de vos filleuls de niveau 3.\n\nPlus votre équipe est grande, plus vos revenus passifs augmentent."
    },
    {
      title: 'Avantages membres',
      content: "En tant que membre VIP, vous bénéficiez de :\n\n• Tâches quotidiennes rémunérées (pointage journaier).\n• Assistance client prioritaire 24/7.\n• Retraits accélérés.\n• Bonus exclusifs lors d'événements spéciaux.\n\nLe niveau VIP augmente en fonction de votre activité et du montant total investi sur la plateforme."
    },
    {
      title: 'Conditions de retrait',
      content: "• Vous devez avoir au minimum 1 produit actif pour effectuer un retrait.\n• Le montant minimum de retrait est de 3 000 FCFA.\n• Les frais de retrait sont fixés à 5% du montant demandé.\n• Les retraits sont traités du Lundi au Vendredi, de 09h00 à 18h00. Le délai de traitement varie généralement de 1 à 24 heures ouvrées."
    },
    {
      title: 'Sécurité & protection des données',
      content: "Vos données personnelles et transactions sont protégées par un cryptage SSL de bout en bout de qualité bancaire. DIOTYTIO s'engage à ne jamais partager vos informations personnelles ou financières avec des tiers. Chaque compte est rigoureusement lié à un numéro de téléphone unique et à un seul appareil pour prévenir toute tentative de fraude."
    }
  ];

  const toggleSection = (index) => {
    if (openSection === index) {
      setOpenSection(null);
    } else {
      setOpenSection(index);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      {/* Banner */}
      <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
        <img src="/assets/hero_banner.png" alt="Rules" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0.4))', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <CheckCircle2 size={16} color="var(--primary)" />
            <span style={{ fontSize: '10px', color: 'var(--primary)', letterSpacing: '1px' }}>SÉCURISÉES & CRYPTÉES</span>
          </div>
          <h2 style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '2px', color: '#fff', marginBottom: '4px' }}>DIOTYTIO</h2>
          <p style={{ fontSize: '11px', color: '#ccc', letterSpacing: '1px' }}>L'INVESTISSEMENT AUTREMENT</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(138,43,226, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={18} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: '700' }}>Conditions générales</h3>
        </div>

        {sections.map((item, index) => (
          <div key={index} style={{ borderBottom: index < sections.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
            <div 
              onClick={() => toggleSection(index)}
              style={{ 
                padding: '20px', 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                cursor: 'pointer',
                background: openSection === index ? 'rgba(138,43,226, 0.05)' : 'transparent',
                transition: 'background 0.3s'
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: '600', color: openSection === index ? 'var(--primary)' : 'var(--text-primary)' }}>
                {item.title}
              </span>
              {openSection === index ? <ChevronUp size={16} color="var(--primary)" /> : <ChevronDown size={16} color="var(--text-secondary)" />}
            </div>
            
            {openSection === index && (
              <div 
                className="animate-fade-in"
                style={{ 
                  padding: '0 20px 20px 20px', 
                  fontSize: '13px', 
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-line'
                }}
              >
                {item.content}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default Rules;
