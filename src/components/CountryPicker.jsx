import React, { useState } from 'react';
import { useStore } from '../store';
import { ChevronDown, Check, Search } from 'lucide-react';
import { COUNTRIES } from '../countries';

const CountryPicker = ({ style = {} }) => {
  const { country, setCountry } = useStore();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial.includes(search)
  );

  return (
    <>
      <div onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '16px', borderRadius: '12px', cursor: 'pointer', ...style }}>
        <span style={{ fontSize: '20px', marginRight: '12px' }}>{country.flag}</span>
        <span style={{ flex: 1, fontSize: '15px', fontWeight: '600' }}>{country.name}</span>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', marginRight: '8px' }}>{country.dial}</span>
        <ChevronDown size={20} color="var(--primary)" />
      </div>

      {open && (
        <div className="modal-overlay" onClick={(e) => { if (e.target.className === 'modal-overlay') setOpen(false); }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 9999 }}>
          <div className="glass-panel animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '500px', maxHeight: '75vh', background: 'var(--bg-secondary)', borderRadius: '20px 20px 0 0', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '14px' }}>Choisissez votre pays</h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 16px', marginBottom: '14px' }}>
              <Search size={18} color="var(--text-secondary)" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un pays..."
                autoFocus
                style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '15px', outline: 'none' }}
              />
            </div>

            <div style={{ overflowY: 'auto', flex: 1 }}>
              {filtered.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px', padding: '20px 0' }}>Aucun pays trouvé.</p>
              )}
              {filtered.map(c => (
                <div
                  key={c.code}
                  onClick={() => { setCountry(c); setOpen(false); setSearch(''); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 8px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '22px' }}>{c.flag}</span>
                  <span style={{ flex: 1, fontSize: '15px', fontWeight: '600' }}>{c.name}</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{c.dial}</span>
                  {country.code === c.code && <Check size={18} color="var(--primary)" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CountryPicker;
