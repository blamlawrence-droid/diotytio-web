import { create } from 'zustand';
import { COUNTRIES } from './countries';

const storage = {
  get: (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch {
      return fallback;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  },
};

const session = {
  get: (key, fallback) => {
    try {
      const value = sessionStorage.getItem(key);
      return value === null ? fallback : value;
    } catch {
      return fallback;
    }
  },
  set: (key, value) => {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  },
  remove: (key) => {
    try {
      sessionStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
  clearAuth: () => {
    ['diotytio_token', 'diotytio_phone', 'diotytio_role', 'diotytio_balance'].forEach((k) => session.remove(k));
  },
};

const initialToken = session.get('diotytio_token', null);
const initialRole = session.get('diotytio_role', '');

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const useStore = create((set, get) => ({
  isAuthenticated: Boolean(initialToken),
  isAdmin: initialRole === 'admin',
  phone: session.get('diotytio_phone', null),
  authToken: initialToken,
  country: COUNTRIES[0],
  theme: 'dark', // 'dark' | 'light'
  depositPhone: storage.get('diotytio_deposit_phone', ''),
  ussdTemplate: storage.get('diotytio_ussd_template', '*155*1*{montant}*{numero}#'),
  balance: Number(session.get('diotytio_balance', 0)) || 0,
  totalRevenue: 0,
  userLevel: 1,
  teamSize: 0,
  teamRecharge: 0,
  products: [],
  transactions: [],
  bankAccounts: [],
  lastCheckInDate: null,
  checkInDays: 0,

  // --- Admin State ---
  adminUsers: [],
  adminTransactions: [],

  modal: null, // { type: 'alert' | 'confirm' | 'prompt' | 'qr', title, message, onConfirm, onSubmit, qrUrl }

  login: (phone, role, token, balance = 0) => {
    session.set('diotytio_token', token);
    session.set('diotytio_phone', phone);
    session.set('diotytio_role', role);
    session.set('diotytio_balance', String(balance));
    set({
      isAuthenticated: true,
      phone,
      isAdmin: role === 'admin',
      authToken: token,
      balance,
    });
  },

  logout: () => {
    const token = get().authToken;
    if (token) {
      fetch('/api/auth/logout', { method: 'POST', headers: authHeaders(token) }).catch(() => {});
    }
    session.clearAuth();
    set({
      isAuthenticated: false,
      isAdmin: false,
      authToken: null,
      phone: null,
      balance: 0,
      transactions: [],
      products: [],
      bankAccounts: [],
      checkInDays: 0,
      lastCheckInDate: null,
      totalRevenue: 0,
      adminUsers: [],
      adminTransactions: [],
    });
  },

  refreshUser: async () => {
    const token = get().authToken;
    if (!token) return null;
    try {
      const res = await fetch('/api/me', { headers: authHeaders(token) });
      if (res.status === 401) {
        get().logout();
        return null;
      }
      if (!res.ok) return null;
      const user = await res.json();
      session.set('diotytio_phone', user.phone);
      session.set('diotytio_role', user.role);
      session.set('diotytio_balance', String(user.balance));
      set({ phone: user.phone, isAdmin: user.role === 'admin', balance: user.balance });
      return user;
    } catch {
      return null;
    }
  },

  loadTransactions: async () => {
    const token = get().authToken;
    if (!token) return;
    try {
      const res = await fetch('/api/transactions', { headers: authHeaders(token) });
      if (!res.ok) return;
      const transactions = await res.json();
      set({ transactions, totalRevenue: transactions.filter(t => t.type === 'reward' && t.status === 'approved').reduce((sum, t) => sum + t.amount, 0) });
    } catch {
      /* ignore */
    }
  },

  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  showModal: (config) => set({ modal: { ...config, id: crypto.randomUUID() } }),
  hideModal: () => set({ modal: null }),

  setCountry: (country) => set({ country }),

  setDepositSettings: (depositPhone, ussdTemplate) => {
    storage.set('diotytio_deposit_phone', depositPhone);
    storage.set('diotytio_ussd_template', ussdTemplate);
    set({ depositPhone, ussdTemplate });
  },

  loadBankAccounts: async () => {
    const res = await fetch('/api/bank-accounts', { headers: authHeaders(get().authToken) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Chargement des comptes impossible.');
    set({ bankAccounts: data });
  },

  addBankAccount: async (number) => {
    const res = await fetch('/api/bank-accounts', {
      method: 'POST', headers: authHeaders(get().authToken),
      body: JSON.stringify({ number: number.replace(/\s/g, ''), countryCode: get().country.code }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ajout du compte impossible.');
    await get().loadBankAccounts();
  },

  removeBankAccount: async (id) => {
    const res = await fetch(`/api/bank-accounts/${id}`, {
      method: 'DELETE', headers: authHeaders(get().authToken),
    });
    if (!res.ok) throw new Error('Suppression du compte impossible.');
    await get().loadBankAccounts();
  },

  deposit: async (amount, meta = {}) => {
    const token = get().authToken;
    const res = await fetch('/api/deposits', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({
        amount,
        phone: meta.phone || get().phone,
        operator: meta.operator || '',
        ussdCode: meta.ussdCode || '',
        reference: meta.reference || '',
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur lors de la création du dépôt');
    set((state) => ({ transactions: [data, ...state.transactions] }));
    return data;
  },

  withdraw: async (amount, meta = {}) => {
    const token = get().authToken;
    const res = await fetch('/api/withdrawals', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({
        amount,
        phone: meta.phone || get().phone,
        operator: meta.operator || '',
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur lors de la création du retrait');
    session.set('diotytio_balance', String(data.balance));
    set((state) => ({
      balance: data.balance,
      transactions: [data, ...state.transactions],
    }));
    return data;
  },

  loadPurchases: async () => {
    const token = get().authToken;
    if (!token) return;
    try {
      const res = await fetch('/api/purchases', { headers: authHeaders(token) });
      if (!res.ok) return;
      set({ products: await res.json() });
    } catch {
      /* ignore */
    }
  },

  buyProduct: async (product) => {
    const token = get().authToken;
    const res = await fetch('/api/products/purchase', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ productId: product.id }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erreur lors de l'achat");
    session.set('diotytio_balance', String(data.balance));
    set((state) => ({
      balance: data.balance,
      products: [{ ...product, purchaseDate: data.transaction?.date || new Date().toISOString() }, ...state.products],
      transactions: data.transaction ? [data.transaction, ...state.transactions] : state.transactions,
    }));
    return data;
  },

  loadTasks: async () => {
    const token = get().authToken;
    if (!token) return;
    try {
      const res = await fetch('/api/tasks/status', { headers: authHeaders(token) });
      if (!res.ok) return;
      const data = await res.json();
      set({
        checkInDays: data.checkInDays,
        lastCheckInDate: data.checkedIn ? new Date().toLocaleDateString() : null,
      });
    } catch {
      /* ignore */
    }
  },

  checkIn: async () => {
    const token = get().authToken;
    const res = await fetch('/api/tasks/checkin', {
      method: 'POST',
      headers: authHeaders(token),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur lors du pointage');
    session.set('diotytio_balance', String(data.balance));
    set((state) => ({
      balance: data.balance,
      lastCheckInDate: new Date().toLocaleDateString(),
      checkInDays: state.checkInDays + 1,
      transactions: data.transaction ? [data.transaction, ...state.transactions] : state.transactions,
    }));
    return data;
  },

  // --- Admin Actions ---
  loadAdminData: async () => {
    const token = get().authToken;
    if (!token) return;
    try {
      const [txRes, usersRes] = await Promise.all([
        fetch('/api/admin/transactions', { headers: authHeaders(token) }),
        fetch('/api/admin/users', { headers: authHeaders(token) }),
      ]);
      if (txRes.ok) set({ adminTransactions: await txRes.json() });
      if (usersRes.ok) set({ adminUsers: await usersRes.json() });
    } catch {
      /* ignore */
    }
  },

  approveTransaction: async (txId) => {
    const token = get().authToken;
    const res = await fetch(`/api/admin/transactions/${txId}/approve`, {
      method: 'POST',
      headers: authHeaders(token),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Erreur lors de la validation');
    }
    await get().loadAdminData();
    await get().refreshUser();
  },

  rejectTransaction: async (txId) => {
    const token = get().authToken;
    const res = await fetch(`/api/admin/transactions/${txId}/reject`, {
      method: 'POST',
      headers: authHeaders(token),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Erreur lors du rejet');
    }
    await get().loadAdminData();
    await get().refreshUser();
  },

  updateUserBalance: async (userId, newBalance) => {
    const token = get().authToken;
    const res = await fetch(`/api/admin/users/${userId}/balance`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({ newBalance }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Erreur lors de la mise à jour du solde');
    }
    await get().loadAdminData();
  },
}));
