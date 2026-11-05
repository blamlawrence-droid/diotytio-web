import React from 'react';
import { Gamepad2, Globe, Users, Award, Monitor, Cpu, Zap, Trophy, Target, TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      {/* Hero Section */}
      <div style={{ position: 'relative', marginBottom: '28px', borderRadius: '24px', overflow: 'hidden' }}>
        <img src="/assets/hero_banner.png" alt="PC Gamer" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,12,16,1) 10%, rgba(11,12,16,0.7) 50%, transparent 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={14} color="var(--primary)" />
            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>À propos de nous</span>
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', lineHeight: '1.2', marginBottom: '6px' }}>
            La <span className="text-gradient">Révolution</span><br/>Gaming est là.
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>L'avenir du PC gaming en Afrique commence ici.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        {[
          { icon: <Gamepad2 size={20} />, value: '2022', label: 'Fondée en' },
          { icon: <Globe size={20} />, value: '50+', label: 'Pays actifs' },
          { icon: <Users size={20} />, value: '2M+', label: 'Membres' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel" style={{ padding: '18px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(138,43,226,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              {stat.icon}
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>{stat.value}</h3>
            <p style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: '600', letterSpacing: '0.5px' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Qui sommes-nous */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '16px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative glow */}
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(138,43,226,0.15), transparent 70%)', pointerEvents: 'none' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(138,43,226,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <Monitor size={18} />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: '800' }}>Qui sommes-nous ?</h3>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.7', textAlign: 'justify' }}>
          <strong style={{ color: '#fff' }}>DIOTYTIO</strong> est une entreprise technologique internationale spécialisée dans la conception, l'assemblage et la commercialisation de <strong style={{ color: '#fff' }}>PC gaming hautes performances</strong>. Notre mission : démocratiser l'accès aux technologies de jeu de pointe en Afrique, tout en offrant à nos membres une opportunité de <strong style={{ color: 'var(--primary)' }}>croissance financière réelle</strong>, adossée à la vente et la distribution de machines gaming certifiées aux normes internationales.
        </p>
      </div>

      {/* Nos produits phares */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(46,204,113,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
            <Cpu size={18} />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: '800' }}>Nos PC Gaming</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { name: 'GAMER X1', desc: 'Configuration entrée de gamme pour les débutants', img: '/assets/pc_gamer_x1.png', price: '350 000 FCFA' },
            { name: 'VORTEX PRIME', desc: 'Le choix des compétiteurs e-sport', img: '/assets/pc_vortex_prime.png', price: '650 000 FCFA' },
            { name: 'ELITE STRIKE', desc: 'Puissance ultime pour le gaming professionnel', img: '/assets/pc_elite_strike.png', price: '1 200 000 FCFA' },
          ].map((pc, i) => (
            <div key={i} style={{ display: 'flex', gap: '14px', padding: '14px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', alignItems: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, background: 'rgba(138,43,226,0.08)' }}>
                <img src={pc.img} alt={pc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '2px' }}>{pc.name}</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{pc.desc}</p>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>{pc.price}</span>
              </div>
              <Zap size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Pourquoi nous choisir */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(243,156,18,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f39c12' }}>
            <Trophy size={18} />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: '800' }}>Pourquoi DIOTYTIO ?</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { icon: <Monitor size={20} />, title: 'PC sur mesure', desc: 'Configurations adaptées à vos besoins', color: '#8a2be2' },
            { icon: <ShieldCheck size={20} />, title: 'Garantie 2 ans', desc: 'Tous nos PC sont garantis', color: '#2ecc71' },
            { icon: <Target size={20} />, title: 'SAV 24/7', desc: 'Support technique permanent', color: '#3498db' },
            { icon: <TrendingUp size={20} />, title: 'Revenus passifs', desc: 'Investissez et générez des gains', color: '#f39c12' },
          ].map((item, i) => (
            <div key={i} style={{ padding: '16px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
                {item.icon}
              </div>
              <h4 style={{ fontSize: '13px', fontWeight: '700' }}>{item.title}</h4>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notre histoire - Timeline */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(138,43,226,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <Award size={18} />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: '800' }}>Notre histoire</h3>
        </div>

        <div style={{ position: 'relative', paddingLeft: '24px' }}>
          {/* Timeline line */}
          <div style={{ position: 'absolute', left: '4px', top: '4px', bottom: '4px', width: '2px', background: 'linear-gradient(to bottom, var(--primary), rgba(138,43,226,0.1))' }} />
          
          {[
            { year: '2022', title: 'Naissance du projet', desc: "DIOTYTIO voit le jour à Dubaï avec une vision claire : rendre le PC gaming accessible à l'Afrique entière. Une équipe d'ingénieurs et de gamers passionnés s'unit pour créer des machines performantes à des prix compétitifs." },
            { year: '2024', title: 'Expansion en Afrique de l\'Ouest', desc: "Ouverture des activités en Côte d'Ivoire, au Sénégal et au Mali. Lancement de notre programme d'investissement participatif, permettant à des milliers d'utilisateurs de générer des revenus en soutenant notre chaîne de production." },
            { year: '2026', title: 'Plateforme digitale', desc: "Lancement officiel de notre application web. Plus de 2 millions de membres actifs dans plus de 50 pays. DIOTYTIO devient la référence du gaming premium en Afrique francophone." },
          ].map((event, i) => (
            <div key={i} style={{ position: 'relative', marginBottom: i < 2 ? '28px' : '0' }}>
              {/* Dot */}
              <div style={{ position: 'absolute', left: '-24px', top: '2px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 12px rgba(138,43,226,0.5)' }} />
              
              <div style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(138,43,226,0.1)', color: 'var(--primary)', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>
                {event.year}
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '6px' }}>{event.title}</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {event.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default About;
