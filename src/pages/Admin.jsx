import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { Navigate } from 'react-router-dom';
import { Users, CreditCard, ArrowDownToLine, ArrowUpFromLine, CheckCircle2, XCircle, Search, Edit2, Settings } from 'lucide-react';

const Admin = () => {
  const { isAdmin, authToken, adminUsers, adminTransactions, loadAdminData, approveTransaction, rejectTransaction, updateUserBalance, depositPhone, ussdTemplate, setDepositSettings, showModal } = useStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [newBalance, setNewBalance] = useState('');
  const [phoneInput, setPhoneInput] = useState(depositPhone || '');
  const [templateInput, setTemplateInput] = useState(ussdTemplate || '*155*1*{montant}*{numero}#');

  useEffect(() => {
    if (isAdmin) loadAdminData();
  }, [isAdmin, loadAdminData]);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const pendingDeposits = adminTransactions.filter(tx => tx.type === 'deposit' && tx.status === 'pending');
  const pendingWithdraws = adminTransactions.filter(tx => tx.type === 'withdraw' && tx.status === 'pending');
  
  const totalUsers = adminUsers.length;
  const totalDeposits = adminTransactions.filter(tx => tx.type === 'deposit' && tx.status === 'approved').reduce((acc, curr) => acc + curr.amount, 0);
  const totalWithdraws = adminTransactions.filter(tx => tx.type === 'withdraw' && tx.status === 'approved').reduce((acc, curr) => acc + curr.amount, 0);

  const filteredUsers = adminUsers.filter(u => u.phone.includes(searchTerm));

  const handleEditBalance = (user) => {
    setEditingUser(user);
    setNewBalance(user.balance.toString());
  };

  const handleSaveBalance = async () => {
    if (editingUser && newBalance !== '') {
      const parsed = parseInt(newBalance, 10);
      if (isNaN(parsed) || parsed < 0) {
        return;
      }
      if (parsed > 100000000) {
        return;
      }
      try {
        await updateUserBalance(editingUser.id, parsed);
        setEditingUser(null);
      } catch (err) {
        showModal({ type: 'alert', title: 'Erreur', message: err.message });
      }
    }
  };

  const handleApprove = async (txId) => {
    try {
      await approveTransaction(txId);
    } catch (err) {
      showModal({ type: 'alert', title: 'Erreur', message: err.message });
    }
  };

  const handleReject = async (txId) => {
    try {
      await rejectTransaction(txId);
    } catch (err) {
      showModal({ type: 'alert', title: 'Erreur', message: err.message });
    }
  };

  const handleSaveSettings = async () => {
    const digits = phoneInput.replace(/\D/g, '');
    if (digits.length < 8) {
      showModal({ type: 'alert', title: 'Erreur', message: 'Veuillez saisir un numéro Flooz valide.' });
      return;
    }
    if (!templateInput.includes('{numero}')) {
      showModal({ type: 'alert', title: 'Erreur', message: 'Le modèle USSD doit contenir la variable {numero}.' });
      return;
    }
    try {
      const res = await fetch('/api/admin/deposit-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ depositPhone: phoneInput.trim(), ussdTemplate: templateInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de l\'enregistrement');
      setDepositSettings(data.depositPhone, data.ussdTemplate);
      showModal({ type: 'alert', title: 'Enregistré', message: 'Les paramètres de dépôt Flooz ont été mis à jour.' });
    } catch (err) {
      showModal({ type: 'alert', title: 'Erreur', message: err.message });
    }
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '80px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
          Panneau <span className="text-gradient">Admin</span>
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Gérez votre plateforme en temps réel</p>
      </div>

      {/* Admin Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px', WebkitOverflowScrolling: 'touch' }}>
        {[
          { id: 'dashboard', label: 'Vue d\'ensemble', icon: <CreditCard size={16} /> },
          { id: 'users', label: 'Utilisateurs', icon: <Users size={16} /> },
          { id: 'deposits', label: `Dépôts (${pendingDeposits.length})`, icon: <ArrowDownToLine size={16} /> },
          { id: 'withdraws', label: `Retraits (${pendingWithdraws.length})`, icon: <ArrowUpFromLine size={16} /> },
          { id: 'settings', label: 'Paramètres', icon: <Settings size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              background: activeTab === tab.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${activeTab === tab.id ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
              fontSize: '13px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
            <Users size={24} color="var(--primary)" style={{ margin: '0 auto 8px' }} />
            <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{totalUsers}</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Total Utilisateurs</p>
          </div>
          <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
            <ArrowDownToLine size={24} color="var(--success)" style={{ margin: '0 auto 8px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '800' }}>{formatMoney(totalDeposits)}</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Dépôts validés</p>
          </div>
          <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
            <ArrowUpFromLine size={24} color="var(--danger)" style={{ margin: '0 auto 8px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '800' }}>{formatMoney(totalWithdraws)}</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Retraits validés</p>
          </div>
          <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
            <CreditCard size={24} color="var(--secondary)" style={{ margin: '0 auto 8px' }} />
            <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{pendingDeposits.length + pendingWithdraws.length}</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>En attente</p>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Rechercher par numéro..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '40px' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredUsers.map(user => (
              <div key={user.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{user.phone}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Inscrit le : {new Date(user.registerDate).toLocaleDateString()}</p>
                </div>
                
                {editingUser?.id === user.id ? (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input 
                      type="number" 
                      value={newBalance} 
                      onChange={(e) => setNewBalance(e.target.value)}
                      style={{ width: '80px', padding: '8px', borderRadius: '8px', border: '1px solid var(--primary)', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '13px' }}
                    />
                    <button onClick={handleSaveBalance} style={{ padding: '8px', background: 'var(--success)', borderRadius: '8px', color: '#fff' }}>
                      <CheckCircle2 size={16} />
                    </button>
                    <button onClick={() => setEditingUser(null)} style={{ padding: '8px', background: 'var(--danger)', borderRadius: '8px', color: '#fff' }}>
                      <XCircle size={16} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary)' }}>{formatMoney(user.balance)}</span>
                    <button onClick={() => handleEditBalance(user)} style={{ background: 'rgba(138,43,226,0.1)', padding: '6px', borderRadius: '8px', color: 'var(--primary)' }}>
                      <Edit2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px', padding: '20px' }}>Aucun utilisateur trouvé.</p>
            )}
          </div>
        </div>
      )}

      {/* DEPOSITS TAB */}
      {activeTab === 'deposits' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pendingDeposits.map(tx => (
            <div key={tx.id} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{tx.phone}</p>
                <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--success)' }}>+{formatMoney(tx.amount)}</span>
                {tx.ussdCode && <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>USSD : {tx.ussdCode}</p>}
                {tx.reference && <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Réf : {tx.reference}</p>}
                {tx.operator && <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Opérateur : {tx.operator}</p>}
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>{new Date(tx.date).toLocaleString()}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleApprove(tx.id)} style={{ padding: '10px', background: 'rgba(46,204,113,0.1)', border: '1px solid var(--success)', borderRadius: '12px', color: 'var(--success)' }}>
                  <CheckCircle2 size={20} />
                </button>
                <button onClick={() => handleReject(tx.id)} style={{ padding: '10px', background: 'rgba(231,76,60,0.1)', border: '1px solid var(--danger)', borderRadius: '12px', color: 'var(--danger)' }}>
                  <XCircle size={20} />
                </button>
              </div>
            </div>
          ))}
          {pendingDeposits.length === 0 && (
            <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Aucun dépôt en attente.
            </div>
          )}
        </div>
      )}

      {/* WITHDRAWS TAB */}
      {activeTab === 'withdraws' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pendingWithdraws.map(tx => (
            <div key={tx.id} className="glass-panel" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{tx.phone}</p>
                <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--danger)' }}>-{formatMoney(tx.amount)}</span>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>{new Date(tx.date).toLocaleString()}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleApprove(tx.id)} style={{ padding: '10px', background: 'rgba(46,204,113,0.1)', border: '1px solid var(--success)', borderRadius: '12px', color: 'var(--success)' }}>
                  <CheckCircle2 size={20} />
                </button>
                <button onClick={() => handleReject(tx.id)} style={{ padding: '10px', background: 'rgba(231,76,60,0.1)', border: '1px solid var(--danger)', borderRadius: '12px', color: 'var(--danger)' }}>
                  <XCircle size={20} />
                </button>
              </div>
            </div>
          ))}
          {pendingWithdraws.length === 0 && (
            <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Aucun retrait en attente.
            </div>
          )}
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '12px', letterSpacing: '1px' }}>NUMÉRO FLOOZ DE RÉCEPTION</h4>
          <input
            type="tel"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            placeholder="Ex: +228 90 00 00 00"
            className="form-input"
            style={{ marginBottom: '20px' }}
          />

          <h4 style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '700', marginBottom: '12px', letterSpacing: '1px' }}>MODÈLE DU CODE USSD</h4>
          <input
            type="text"
            value={templateInput}
            onChange={(e) => setTemplateInput(e.target.value)}
            placeholder="*155*1*{montant}*{numero}#"
            className="form-input"
            style={{ marginBottom: '8px' }}
          />
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Variables disponibles : <strong>{'{montant}'}</strong> et <strong>{'{numero}'}</strong>.
          </p>

          <button onClick={handleSaveSettings} className="btn-primary">
            Enregistrer les paramètres
          </button>
        </div>
      )}

    </div>
  );
};

export default Admin;
