import React, { useEffect } from 'react';
import { Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import Team from './pages/Team';
import Account from './pages/Account';
import Deposit from './pages/Deposit';
import UssdDeposit from './pages/UssdDeposit';import Withdraw from './pages/Withdraw';
import Tasks from './pages/Tasks';
import Statistics from './pages/Statistics';
import History from './pages/History';
import Missions from './pages/Missions';
import CustomerService from './pages/CustomerService';
import About from './pages/About';
import BankAccounts from './pages/BankAccounts';
import ChangePassword from './pages/ChangePassword';
import Rules from './pages/Rules';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import PaymentResult from './pages/PaymentResult';
import Modal from './components/Modal';
import { useStore } from './store';
import { Home as HomeIcon, MonitorPlay, Users, User, ArrowLeft } from 'lucide-react';

function App() {
  const location = useLocation();
  const { isAuthenticated, isAdmin, theme, refreshUser, loadTransactions } = useStore();

  const isMainPage  = ['/', '/products', '/team', '/account'].includes(location.pathname);
  const isAuthPage  = ['/login', '/register'].includes(location.pathname);
  const isAdminPage = location.pathname === '/admin';
  const isPublicPage = location.pathname.startsWith('/payment/');

  // Apply theme to <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Refresh session data from the server
  useEffect(() => {
    if (isAuthenticated) {
      refreshUser();
      loadTransactions();
    }
  }, [isAuthenticated, refreshUser, loadTransactions]);

  if (!isAuthenticated && !isAuthPage && !isPublicPage) return <Navigate to="/login" replace />;
  if (isAuthenticated  && isAuthPage)  return <Navigate to="/"      replace />;

  const pageTitle = {
    '/deposit':         'Dépôt',
    '/deposit/ussd':    'Dépôt Flooz',    '/withdraw':        'Retrait',
    '/tasks':           'Tâches & Pointage',
    '/history':         'Historique',
    '/statistics':      'Statistiques',
    '/customer-service':'Service Client',
    '/about':           'À propos de nous',
    '/rules':           'Réglementation',
    '/bank-accounts':   'Comptes bancaires',
    '/change-password': 'Sécurité',
  }[location.pathname] || 'DIOTYTIO';

  return (
    <div className="page-container">
      <Modal />

      {/* Admin header */}
      {isAdminPage && isAdmin && (
        <header className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px solid var(--glass-border)' }}>
          <div onClick={() => window.history.back()} style={{ cursor: 'pointer', display: 'flex' }}>
            <ArrowLeft size={22} />
          </div>
          <h2 style={{ fontSize: '18px', margin: 0, fontWeight: '800' }}>🛡️ Administration</h2>
        </header>
      )}

      {/* Sub-page header */}
      {!isMainPage && !isAuthPage && !isAdminPage && (
        <header className="glass-nav" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px solid var(--glass-border)' }}>
          <div onClick={() => window.history.back()} style={{ cursor: 'pointer', display: 'flex' }}>
            <ArrowLeft size={22} />
          </div>
          <h2 style={{ fontSize: '18px', margin: 0, fontWeight: '800' }}>{pageTitle}</h2>
          {isAdmin && (
            <NavLink to="/admin" style={{ marginLeft: 'auto', padding: '6px 14px', background: 'var(--primary)', borderRadius: '10px', fontSize: '12px', fontWeight: '700', color: '#fff' }}>
              Admin
            </NavLink>
          )}
        </header>
      )}

      {/* Admin floating badge on main pages */}
      {isMainPage && isAdmin && (
        <NavLink to="/admin" style={{
          position: 'fixed', top: '14px', right: '14px', zIndex: 100,
          padding: '7px 14px', background: 'var(--primary)', borderRadius: '12px',
          fontSize: '12px', fontWeight: '700', color: '#fff',
          boxShadow: '0 4px 15px rgba(138,43,226,0.5)',
        }}>
          🛡️ Admin
        </NavLink>
      )}

      <Routes>
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/"                element={<Home />} />
        <Route path="/products"        element={<Products />} />
        <Route path="/team"            element={<Team />} />
        <Route path="/account"         element={<Account />} />
        <Route path="/deposit"         element={<Deposit />} />
<Route path="/deposit/ussd"    element={<UssdDeposit />} />        <Route path="/withdraw"        element={<Withdraw />} />
        <Route path="/tasks"           element={<Tasks />} />
        <Route path="/missions"        element={<Missions />} />
        <Route path="/statistics"      element={<Statistics />} />
        <Route path="/history"         element={<History />} />
        <Route path="/customer-service"element={<CustomerService />} />
        <Route path="/about"           element={<About />} />
        <Route path="/rules"           element={<Rules />} />
        <Route path="/bank-accounts"   element={<BankAccounts />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/payment/success"  element={<PaymentResult />} />
        <Route path="/payment/error"    element={<PaymentResult />} />
        <Route path="/admin"           element={isAdmin ? <Admin /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Bottom nav — shown on main pages on ALL devices */}
      {isMainPage && isAuthenticated && (
        <nav className="bottom-nav glass-nav">
          <NavLink to="/"          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <HomeIcon size={22} /><span>Accueil</span>
          </NavLink>
          <NavLink to="/products"  className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <MonitorPlay size={22} /><span>Produits</span>
          </NavLink>
          <NavLink to="/statistics" className="nav-item">
            <div className="center-fab">
              <img 
                src={theme === 'light' ? "/assets/gaming_controller.png" : "/assets/logo.png"} 
                alt="DIOTYTIO" 
                style={{ 
                  width: theme === 'light' ? '46px' : '32px', 
                  height: theme === 'light' ? '46px' : '32px', 
                  objectFit: 'contain' 
                }} 
              />
            </div>
          </NavLink>
          <NavLink to="/team"      className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <Users size={22} /><span>Équipe</span>
          </NavLink>
          <NavLink to="/account"   className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <User size={22} /><span>Compte</span>
          </NavLink>
        </nav>
      )}
    </div>
  );
}

export default App;
