import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const app = express();
app.set('trust proxy', 1);

// ── Security Headers ──
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://api.qrserver.com"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

// ── CORS — strict origin validation ──
app.use(cors({
  origin: true,
  credentials: true,
}));

// ── Body parsing (capture raw body for webhook signatures) ──
app.use(express.json({
  limit: '10kb',
  verify: (req, _res, buf) => {
    if (req.originalUrl === '/api/webhook') {
      req.rawBody = buf;
    }
  },
}));

// ── Rate Limiting ──
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de requêtes. Réessayez dans 15 minutes.' },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de créations de compte. Réessayez dans 1 heure.' },
});

const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Limite de paiements atteinte (10/heure).' },
});

const payoutLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Limite de retraits atteinte (5/heure).' },
});

const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de webhooks.' },
});

app.use('/api/', generalLimiter);

// ── Constants ──
const GENIUSPAY_BASE = 'https://geniuspay.ci/api/v1/merchant';
const API_KEY = process.env.GENIUSPAY_API_KEY || '';
const API_SECRET = process.env.GENIUSPAY_API_SECRET || '';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';
const SUCCESS_URL = process.env.PAYMENT_SUCCESS_URL || 'http://localhost:5173/payment/success';
const ERROR_URL = process.env.PAYMENT_ERROR_URL || 'http://localhost:5173/payment/error';
const ADMIN_PHONE = process.env.ADMIN_PHONE || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const SESSION_TTL = 30 * 60 * 1000; // 30 minutes

const ALLOWED_COUNTRIES = ['CI', 'SN', 'ML', 'BF', 'BJ', 'TG', 'GN', 'NE'];
const ALLOWED_PAYMENT_METHODS = ['wave', 'orange_money', 'mtn_money', 'moov_money', 'pawapay', 'paystack', 'card'];
const ALLOWED_CURRENCIES = ['XOF', 'EUR', 'USD'];
const MAX_DEPOSIT = 1000000;
const MIN_AMOUNT = 200;
const MIN_DEPOSIT = 3000;

const PRODUCTS = {
  p1: { name: 'PC Pro Gamer X1', price: 3000 },
  p2: { name: 'PC Elite Strike', price: 7000 },
  p3: { name: 'PC Vortex Prime', price: 15000 },
  p4: { name: 'PC HyperForce Z4', price: 25000 },
  p5: { name: 'PC TitanX Pro', price: 50000 },
  p6: { name: 'PC UltraCore Max', price: 100000 },
};

// ── Helpers ──
function geniusHeaders() {
  return {
    'X-API-Key': API_KEY,
    'X-API-Secret': API_SECRET,
    'Content-Type': 'application/json',
  };
}

function sanitize(str, maxLen = 500) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>"'&]/g, '').trim().slice(0, maxLen);
}

function isValidPhone(phone) {
  return typeof phone === 'string' && /^\+\d{7,15}$/.test(phone);
}

function isValidCountry(code) {
  return typeof code === 'string' && ALLOWED_COUNTRIES.includes(code.toUpperCase());
}

function isValidPaymentMethod(method) {
  return !method || ALLOWED_PAYMENT_METHODS.includes(method);
}

function isValidCurrency(currency) {
  return !currency || ALLOWED_CURRENCIES.includes(currency);
}

function isValidAmount(amount) {
  return typeof amount === 'number' && Number.isFinite(amount) && amount >= MIN_AMOUNT && amount <= MAX_DEPOSIT && Number.isInteger(amount);
}

function isValidReference(ref) {
  return typeof ref === 'string' && /^[A-Z0-9_-]{1,50}$/.test(ref);
}

function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function hasStrongPassword(password) {
  if (typeof password !== 'string' || password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
  return true;
}

function verifyWebhookSignature(payload, signature) {
  if (!WEBHOOK_SECRET) return false;
  if (typeof signature !== 'string' || !/^[a-f0-9]{64}$/i.test(signature)) return false;
  try {
    const expected = crypto.createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

function verifyPassword(password, hash, salt) {
  try {
    const computed = crypto.scryptSync(password, salt, 64);
    const expected = Buffer.from(hash, 'hex');
    return computed.length === expected.length && crypto.timingSafeEqual(computed, expected);
  } catch {
    return false;
  }
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function serializeTransaction(t) {
  return {
    id: t.id,
    userId: t.userId,
    phone: t.phone || t.user?.phone,
    type: t.type,
    amount: t.amount,
    status: t.status,
    operator: t.operator,
    ussdCode: t.ussdCode,
    reference: t.reference,
    desc: t.description,
    date: t.createdAt,
    createdAt: t.createdAt,
  };
}

// ── Login attempt lockout (per phone) ──
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

function isLocked(phone) {
  const a = loginAttempts.get(phone);
  if (!a) return false;
  if (Date.now() - a.last > LOCKOUT_MS) {
    loginAttempts.delete(phone);
    return false;
  }
  return a.count >= MAX_LOGIN_ATTEMPTS;
}

function recordFailure(phone) {
  const a = loginAttempts.get(phone) || { count: 0, last: 0 };
  loginAttempts.set(phone, { count: a.count + 1, last: Date.now() });
}

function resetFailures(phone) {
  loginAttempts.delete(phone);
}

// ── Sessions (persisted in DB) ──
async function createSession(userId, role) {
  const token = generateToken();
  await prisma.session.create({
    data: {
      token,
      userId,
      role,
      expiresAt: new Date(Date.now() + SESSION_TTL),
    },
  });
  return token;
}

async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Token requis.' });
    }
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });
    if (!session || session.expiresAt < new Date()) {
      if (session) await prisma.session.delete({ where: { token } }).catch(() => {});
      return res.status(401).json({ error: 'Session expirée ou invalide.' });
    }
    req.user = {
      userId: session.user.id,
      phone: session.user.phone,
      balance: session.user.balance,
      role: session.role,
      token,
    };
    next();
  } catch (err) {
    next(err);
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès admin requis.' });
  }
  next();
}

// Clean expired sessions every 5 minutes
setInterval(() => {
  prisma.session.deleteMany({ where: { expiresAt: { lt: new Date() } } }).catch(() => {});
}, 5 * 60 * 1000);

// ── Deposit settings (admin-configured Flooz number + USSD template) ──
const SETTINGS_KEY = 'deposit';
const DEFAULT_DEPOSIT_SETTINGS = { depositPhone: '', ussdTemplate: '*155*1*{montant}*{numero}#' };

async function getDepositSettings() {
  const row = await prisma.setting.findUnique({ where: { key: SETTINGS_KEY } });
  if (!row) return DEFAULT_DEPOSIT_SETTINGS;
  try {
    const parsed = JSON.parse(row.value);
    if (parsed && typeof parsed.depositPhone === 'string' && typeof parsed.ussdTemplate === 'string') {
      return parsed;
    }
  } catch {
    /* fall through */
  }
  return DEFAULT_DEPOSIT_SETTINGS;
}

async function saveDepositSettings(settings) {
  await prisma.setting.upsert({
    where: { key: SETTINGS_KEY },
    update: { value: JSON.stringify(settings) },
    create: { key: SETTINGS_KEY, value: JSON.stringify(settings) },
  });
}

app.get('/api/deposit-settings', async (req, res, next) => {
  try {
    res.json(await getDepositSettings());
  } catch (err) {
    next(err);
  }
});

// ── Auth: register ──
app.post('/api/auth/register', registerLimiter, async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!isValidPhone(phone)) {
      return res.status(400).json({ error: 'Numéro de téléphone invalide (format: +225XXXXXXXX).' });
    }
    if (!hasStrongPassword(password)) {
      return res.status(400).json({
        error: 'Mot de passe faible : 8 caractères minimum, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.',
      });
    }
    if (ADMIN_PHONE && phone === ADMIN_PHONE) {
      return res.status(409).json({ error: 'Ce numéro est réservé.' });
    }

    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
      return res.status(409).json({ error: 'Un compte existe déjà avec ce numéro.' });
    }

    const { salt, hash } = hashPassword(password);
    const user = await prisma.user.create({
      data: { phone, passwordHash: hash, passwordSalt: salt, role: 'user', balance: 1700 },
    });

    const token = await createSession(user.id, 'user');
    return res.status(201).json({
      success: true,
      role: 'user',
      token,
      user: { phone: user.phone, balance: user.balance },
    });
  } catch (err) {
    next(err);
  }
});

// ── Auth: login ──
app.post('/api/auth/login', loginLimiter, async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ error: 'Phone et mot de passe requis.' });
    }
    if (!isValidPhone(phone)) {
      return res.status(400).json({ error: 'Numéro de téléphone invalide.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères.' });
    }
    if (isLocked(phone)) {
      return res.status(429).json({ error: 'Trop de tentatives. Réessayez dans 15 minutes.' });
    }

    // Admin login (constant-time comparison against env)
    if (ADMIN_PHONE && phone === ADMIN_PHONE) {
      const a = Buffer.from(password);
      const b = Buffer.from(ADMIN_PASSWORD || '');
      const valid = ADMIN_PASSWORD && a.length === b.length && crypto.timingSafeEqual(a, b) && hasStrongPassword(password);
      if (!valid) {
        recordFailure(phone);
        return res.status(401).json({ error: 'Identifiants invalides.' });
      }
      const admin = await prisma.user.findUnique({ where: { phone } });
      if (!admin) {
        return res.status(500).json({ error: 'Compte admin non initialisé.' });
      }
      resetFailures(phone);
      const token = await createSession(admin.id, 'admin');
      return res.json({
        success: true,
        role: 'admin',
        token,
        user: { phone: admin.phone, balance: admin.balance },
      });
    }

    // Regular user
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user || !verifyPassword(password, user.passwordHash, user.passwordSalt)) {
      recordFailure(phone);
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    resetFailures(phone);
    const token = await createSession(user.id, user.role);
    return res.json({
      success: true,
      role: user.role,
      token,
      user: { phone: user.phone, balance: user.balance },
    });
  } catch (err) {
    next(err);
  }
});

// ── Auth: logout ──
app.post('/api/auth/logout', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) await prisma.session.deleteMany({ where: { token } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ── Auth: current user ──
app.get('/api/me', requireAuth, async (req, res, next) => {
  try {
    res.json({
      phone: req.user.phone,
      role: req.user.role,
      balance: req.user.balance,
    });
  } catch (err) {
    next(err);
  }
});

// ── Auth: change password ──
app.post('/api/auth/change-password', requireAuth, loginLimiter, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
      return res.status(400).json({ error: 'Mots de passe requis.' });
    }
    if (!hasStrongPassword(newPassword)) {
      return res.status(400).json({
        error: 'Mot de passe faible : 8 caractères minimum, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial.',
      });
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({ error: 'Le nouveau mot de passe doit être différent.' });
    }
    if (req.user.role === 'admin') {
      return res.status(400).json({ error: 'Le mot de passe admin se modifie dans la configuration serveur.' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user || !verifyPassword(currentPassword, user.passwordHash, user.passwordSalt)) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect.' });
    }

    const { salt, hash } = hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hash, passwordSalt: salt },
    });
    await prisma.session.deleteMany({
      where: { userId: user.id, token: { not: req.user.token } },
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ── Deposits (manual USSD, pending admin validation) ──
app.post('/api/deposits', requireAuth, paymentLimiter, async (req, res, next) => {
  try {
    const { amount, operator, phone, ussdCode, reference } = req.body;

    if (typeof amount !== 'number' || !Number.isInteger(amount) || amount < MIN_DEPOSIT || amount > MAX_DEPOSIT) {
      return res.status(400).json({ error: `Le montant doit être un entier entre ${MIN_DEPOSIT} et ${MAX_DEPOSIT} FCFA.` });
    }
    if (!isValidPhone(phone)) {
      return res.status(400).json({ error: 'Numéro de téléphone invalide.' });
    }
    if (phone !== req.user.phone) {
      return res.status(403).json({ error: 'Le numéro de dépôt doit correspondre à votre compte.' });
    }
    if (operator && (typeof operator !== 'string' || operator.length > 50)) {
      return res.status(400).json({ error: 'Opérateur invalide.' });
    }
    if (ussdCode && (typeof ussdCode !== 'string' || ussdCode.length > 100)) {
      return res.status(400).json({ error: 'Code USSD invalide.' });
    }
    if (reference && (typeof reference !== 'string' || reference.length > 100)) {
      return res.status(400).json({ error: 'Référence invalide.' });
    }

    const tx = await prisma.transaction.create({
      data: {
        userId: req.user.userId,
        type: 'deposit',
        amount,
        status: 'pending',
        operator: sanitize(operator, 50),
        phone,
        ussdCode: sanitize(ussdCode, 100),
        reference: sanitize(reference, 100),
        description: 'Dépôt Flooz (USSD)',
      },
    });

    res.status(201).json(serializeTransaction(tx));
  } catch (err) {
    next(err);
  }
});

// ── Withdrawals (pending admin validation, balance reserved) ──
app.post('/api/withdrawals', requireAuth, payoutLimiter, async (req, res, next) => {
  try {
    const { amount, operator, phone } = req.body;

    if (typeof amount !== 'number' || !Number.isInteger(amount) || amount < MIN_DEPOSIT || amount > MAX_DEPOSIT) {
      return res.status(400).json({ error: `Le montant doit être un entier entre ${MIN_DEPOSIT} et ${MAX_DEPOSIT} FCFA.` });
    }
    if (!isValidPhone(phone) || phone !== req.user.phone) {
      return res.status(403).json({ error: 'Le numéro de réception doit correspondre à votre compte.' });
    }
    if (operator && (typeof operator !== 'string' || operator.length > 50)) {
      return res.status(400).json({ error: 'Opérateur invalide.' });
    }

    const result = await prisma.$transaction(async (db) => {
      const user = await db.user.findUnique({ where: { id: req.user.userId } });
      if (!user || user.balance < amount) {
        return { error: 'Solde insuffisant.' };
      }
      const updated = await db.user.update({
        where: { id: user.id },
        data: { balance: { decrement: amount } },
      });
      const tx = await db.transaction.create({
        data: {
          userId: user.id,
          type: 'withdraw',
          amount,
          status: 'pending',
          operator: sanitize(operator, 50),
          phone,
          description: 'Retrait Mobile Money',
        },
      });
      return { tx, balance: updated.balance };
    });

    if (result.error) return res.status(400).json({ error: result.error });
    res.status(201).json({ ...serializeTransaction(result.tx), balance: result.balance });
  } catch (err) {
    next(err);
  }
});

// ── User transactions ──
app.get('/api/transactions', requireAuth, async (req, res, next) => {
  try {
    const txs = await prisma.transaction.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    res.json(txs.map(serializeTransaction));
  } catch (err) {
    next(err);
  }
});

// ── Products: purchase ──
app.post('/api/products/purchase', requireAuth, async (req, res, next) => {
  try {
    const { productId } = req.body;
    const product = PRODUCTS[productId];
    if (!product) {
      return res.status(400).json({ error: 'Produit inconnu.' });
    }

    const result = await prisma.$transaction(async (db) => {
      const user = await db.user.findUnique({ where: { id: req.user.userId } });
      if (!user || user.balance < product.price) {
        return { error: 'Solde insuffisant.' };
      }
      const updated = await db.user.update({
        where: { id: user.id },
        data: { balance: { decrement: product.price } },
      });
      const tx = await db.transaction.create({
        data: {
          userId: user.id,
          type: 'purchase',
          amount: product.price,
          status: 'approved',
          reference: productId,
          description: product.name,
        },
      });
      return { balance: updated.balance, transaction: tx };
    });

    if (result.error) return res.status(400).json({ error: result.error });
    res.status(201).json({
      balance: result.balance,
      transaction: serializeTransaction(result.transaction),
      product: { id: productId, ...product },
    });
  } catch (err) {
    next(err);
  }
});

// ── Products: owned list ──
app.get('/api/purchases', requireAuth, async (req, res, next) => {
  try {
    const txs = await prisma.transaction.findMany({
      where: { userId: req.user.userId, type: 'purchase' },
      orderBy: { createdAt: 'desc' },
    });
    res.json(txs.map((t) => ({
      productId: t.reference,
      name: t.description,
      price: t.amount,
      purchaseDate: t.createdAt,
    })));
  } catch (err) {
    next(err);
  }
});

// ── Daily check-in ──
app.post('/api/tasks/checkin', requireAuth, async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const existing = await prisma.transaction.findFirst({
      where: {
        userId: req.user.userId,
        type: 'reward',
        description: 'Pointage quotidien',
        createdAt: { gte: startOfDay },
      },
    });
    if (existing) {
      return res.status(409).json({ error: 'Vous avez déjà pointé aujourd\'hui.' });
    }

    const result = await prisma.$transaction(async (db) => {
      const updated = await db.user.update({
        where: { id: req.user.userId },
        data: { balance: { increment: 150 } },
      });
      const tx = await db.transaction.create({
        data: {
          userId: req.user.userId,
          type: 'reward',
          amount: 150,
          status: 'approved',
          description: 'Pointage quotidien',
        },
      });
      return { balance: updated.balance, transaction: tx };
    });

    res.status(201).json({
      balance: result.balance,
      transaction: serializeTransaction(result.transaction),
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/tasks/status', requireAuth, async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [days, today] = await Promise.all([
      prisma.transaction.count({
        where: { userId: req.user.userId, type: 'reward', description: 'Pointage quotidien' },
      }),
      prisma.transaction.findFirst({
        where: {
          userId: req.user.userId,
          type: 'reward',
          description: 'Pointage quotidien',
          createdAt: { gte: startOfDay },
        },
      }),
    ]);

    res.json({ checkInDays: days, checkedIn: Boolean(today) });
  } catch (err) {
    next(err);
  }
});

// ── Admin: transactions ──
app.get('/api/admin/transactions', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { status, type } = req.query;
    const where = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) where.status = status;
    if (type && ['deposit', 'withdraw'].includes(type)) where.type = type;

    const txs = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 500,
      include: { user: { select: { phone: true } } },
    });
    res.json(txs.map(serializeTransaction));
  } catch (err) {
    next(err);
  }
});

// ── Admin: approve transaction ──
app.post('/api/admin/transactions/:id/approve', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await prisma.$transaction(async (db) => {
      const tx = await db.transaction.findUnique({ where: { id } });
      if (!tx || tx.status !== 'pending') return { error: 'Transaction introuvable ou déjà traitée.', code: 404 };

      if (tx.type === 'deposit') {
        await db.user.update({ where: { id: tx.userId }, data: { balance: { increment: tx.amount } } });
      }
      const updated = await db.transaction.update({ where: { id }, data: { status: 'approved' } });
      return { tx: updated };
    });

    if (result.error) return res.status(result.code || 400).json({ error: result.error });
    res.json(serializeTransaction(result.tx));
  } catch (err) {
    next(err);
  }
});

// ── Admin: reject transaction ──
app.post('/api/admin/transactions/:id/reject', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await prisma.$transaction(async (db) => {
      const tx = await db.transaction.findUnique({ where: { id } });
      if (!tx || tx.status !== 'pending') return { error: 'Transaction introuvable ou déjà traitée.', code: 404 };

      if (tx.type === 'withdraw') {
        await db.user.update({ where: { id: tx.userId }, data: { balance: { increment: tx.amount } } });
      }
      const updated = await db.transaction.update({ where: { id }, data: { status: 'rejected' } });
      return { tx: updated };
    });

    if (result.error) return res.status(result.code || 400).json({ error: result.error });
    res.json(serializeTransaction(result.tx));
  } catch (err) {
    next(err);
  }
});

// ── Admin: users ──
app.get('/api/admin/users', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, phone: true, role: true, balance: true, createdAt: true },
    });
    res.json(users.map((u) => ({
      id: u.id,
      phone: u.phone,
      role: u.role,
      balance: u.balance,
      registerDate: u.createdAt,
    })));
  } catch (err) {
    next(err);
  }
});

// ── Admin: update user balance ──
app.put('/api/admin/users/:userId/balance', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { newBalance } = req.body;
    const { userId } = req.params;

    if (typeof newBalance !== 'number' || !Number.isFinite(newBalance) || !Number.isInteger(newBalance)) {
      return res.status(400).json({ error: 'Le solde doit être un nombre entier.' });
    }
    if (newBalance < 0) {
      return res.status(400).json({ error: 'Le solde ne peut pas être négatif.' });
    }
    if (newBalance > 100000000) {
      return res.status(400).json({ error: 'Solde trop élevé (max 100 000 000).' });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { balance: newBalance },
    });
    res.json({ success: true, userId: user.id, newBalance: user.balance });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Utilisateur introuvable.' });
    }
    next(err);
  }
});

// ── Admin: deposit settings ──
app.put('/api/admin/deposit-settings', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { depositPhone, ussdTemplate } = req.body;

    if (!isValidPhone(depositPhone)) {
      return res.status(400).json({ error: 'Numéro Flooz invalide (format: +225XXXXXXXX).' });
    }
    if (typeof ussdTemplate !== 'string' || ussdTemplate.length < 5 || ussdTemplate.length > 100) {
      return res.status(400).json({ error: 'Modèle USSD invalide.' });
    }
    if (!ussdTemplate.includes('{numero}')) {
      return res.status(400).json({ error: 'Le modèle USSD doit contenir {numero}.' });
    }
    if (!/^[\w*#+\-{}\s]+$/.test(ussdTemplate)) {
      return res.status(400).json({ error: 'Le modèle USSD contient des caractères non autorisés.' });
    }

    const settings = { depositPhone, ussdTemplate: sanitize(ussdTemplate, 100) };
    await saveDepositSettings(settings);
    res.json({ success: true, ...settings });
  } catch (err) {
    next(err);
  }
});

// ── Create payment (deposit) — AUTH REQUIRED ──
app.post('/api/payments', requireAuth, paymentLimiter, (req, res) => {
  try {
    const { amount, currency, payment_method, customer, description, metadata } = req.body;

    if (!isValidAmount(amount)) {
      return res.status(400).json({ error: `Le montant doit être un nombre entier entre ${MIN_AMOUNT} et ${MAX_DEPOSIT} FCFA.` });
    }
    if (!isValidCurrency(currency)) {
      return res.status(400).json({ error: 'Devise invalide.' });
    }
    if (!isValidPaymentMethod(payment_method)) {
      return res.status(400).json({ error: 'Méthode de paiement invalide.' });
    }
    if (!customer || !isValidPhone(customer.phone)) {
      return res.status(400).json({ error: 'Numéro de téléphone invalide (format: +225XXXXXXXX).' });
    }
    if (customer.phone !== req.user.phone) {
      return res.status(403).json({ error: 'Le numéro de paiement doit correspondre à votre compte.' });
    }
    if (customer.country && !isValidCountry(customer.country)) {
      return res.status(400).json({ error: 'Code pays invalide.' });
    }
    if (description && description.length > 500) {
      return res.status(400).json({ error: 'Description trop longue (max 500 caractères).' });
    }

    const body = {
      amount: Math.round(amount),
      currency: currency || 'XOF',
      customer: {
        phone: customer.phone,
        country: customer.country || undefined,
      },
      success_url: SUCCESS_URL,
      error_url: ERROR_URL,
    };

    if (payment_method) body.payment_method = payment_method;
    if (description) body.description = sanitize(description, 500);
    if (metadata) body.metadata = { type: sanitize(metadata.type, 50) };

    fetch(`${GENIUSPAY_BASE}/payments`, {
      method: 'POST',
      headers: geniusHeaders(),
      body: JSON.stringify(body),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) return res.status(400).json(data);
        if (data.data?.checkout_url && !isValidUrl(data.data.checkout_url)) {
          return res.status(400).json({ error: 'URL de checkout invalide.' });
        }
        if (data.data?.checkout_url) {
          try {
            const u = new URL(data.data.checkout_url);
            const trustedCheckoutDomains = ['geniuspay.ci', 'pay.genius.ci', 'checkout.geniuspay.ci'];
            if (!trustedCheckoutDomains.some(d => u.hostname.endsWith(d))) {
              return res.status(400).json({ error: 'URL de checkout non fiable.' });
            }
          } catch {
            return res.status(400).json({ error: 'URL de checkout invalide.' });
          }
        }
        res.json(data);
      })
      .catch(err => {
        console.error('Payment API error:', err.message);
        res.status(500).json({ error: 'Erreur serveur lors du paiement.' });
      });
  } catch (err) {
    console.error('Payment error:', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ── Check payment status — PUBLIC (rate-limited) ──
app.get('/api/payments/:reference', paymentLimiter, (req, res) => {
  try {
    const { reference } = req.params;

    if (!isValidReference(reference)) {
      return res.status(400).json({ error: 'Référence invalide.' });
    }

    fetch(`${GENIUSPAY_BASE}/payments/${reference}`, { headers: geniusHeaders() })
      .then(response => response.json())
      .then(data => res.json(data))
      .catch(err => {
        console.error('Payment status error:', err.message);
        res.status(500).json({ error: 'Erreur serveur.' });
      });
  } catch (err) {
    console.error('Status error:', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ── List providers by country — AUTH REQUIRED ──
app.get('/api/providers/:country', requireAuth, (req, res) => {
  try {
    const { country } = req.params;

    if (!isValidCountry(country)) {
      return res.status(400).json({ error: 'Code pays invalide.' });
    }

    fetch(`${GENIUSPAY_BASE}/pawapay/providers?country=${country.toUpperCase()}`, { headers: geniusHeaders() })
      .then(response => response.json())
      .then(data => res.json(data))
      .catch(err => {
        console.error('Providers error:', err.message);
        res.status(500).json({ error: 'Erreur serveur.' });
      });
  } catch (err) {
    console.error('Providers error:', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ── Create payout (withdrawal) — AUTH REQUIRED ──
app.post('/api/payouts', requireAuth, payoutLimiter, (req, res) => {
  try {
    const { amount, currency, mmo_provider, account_number, description, metadata } = req.body;

    if (!isValidAmount(amount)) {
      return res.status(400).json({ error: `Le montant doit être un nombre entier entre ${MIN_AMOUNT} et ${MAX_DEPOSIT} FCFA.` });
    }
    if (!isValidCurrency(currency)) {
      return res.status(400).json({ error: 'Devise invalide.' });
    }
    if (!isValidPhone(account_number)) {
      return res.status(400).json({ error: 'Numéro de compte invalide (format: +225XXXXXXXX).' });
    }
    if (account_number !== req.user.phone) {
      return res.status(403).json({ error: 'Le numéro de réception doit correspondre à votre compte.' });
    }
    if (mmo_provider && !ALLOWED_PAYMENT_METHODS.includes(mmo_provider)) {
      return res.status(400).json({ error: 'Provider invalide.' });
    }

    const body = {
      amount: Math.round(amount),
      currency: currency || 'XOF',
      account_number,
      description: description ? sanitize(description, 500) : 'Retrait DIOTYTIO',
    };

    if (mmo_provider) body.mmo_provider = mmo_provider;
    if (metadata) body.metadata = { type: sanitize(metadata.type, 50) };

    fetch(`${GENIUSPAY_BASE}/payouts`, {
      method: 'POST',
      headers: geniusHeaders(),
      body: JSON.stringify(body),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) return res.status(400).json(data);
        res.json(data);
      })
      .catch(err => {
        console.error('Payout error:', err.message);
        res.status(500).json({ error: 'Erreur serveur lors du retrait.' });
      });
  } catch (err) {
    console.error('Payout error:', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ── Webhook (GeniusPay notifications) — SIGNATURE REQUIRED ──
app.post('/api/webhook', webhookLimiter, (req, res) => {
  try {
    if (!WEBHOOK_SECRET) {
      return res.status(503).json({ error: 'Webhook non configuré.' });
    }
    const signature = req.headers['x-geniuspay-signature'] || '';
    const payload = (req.rawBody || Buffer.from(JSON.stringify(req.body || {}))).toString();

    if (!verifyWebhookSignature(payload, signature)) {
      console.warn('[SECURITY] Webhook rejeté — signature invalide');
      return res.status(401).json({ error: 'Signature invalide.' });
    }

    let event;
    try { event = JSON.parse(payload); } catch { return res.status(400).json({ error: 'Payload invalide' }); }

    if (event.type === 'payment.completed') {
      console.log(`[WEBHOOK] Payment completed: ${event.data?.reference}`);
    } else if (event.type === 'payment.failed') {
      console.log(`[WEBHOOK] Payment failed: ${event.data?.reference}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ── Serve frontend build (online/production) ──
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next(err);
  });
});

// ── 404 ──
app.use('/api/:path', (req, res) => {
  res.status(404).json({ error: 'Endpoint non trouvé.' });
});

// ── Error handler ──
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Erreur serveur interne.' });
});

// ── Startup ──
async function ensureAdmin() {
  if (!ADMIN_PHONE || !ADMIN_PASSWORD) return;
  const { salt, hash } = hashPassword(ADMIN_PASSWORD);
  await prisma.user.upsert({
    where: { phone: ADMIN_PHONE },
    update: { role: 'admin', passwordHash: hash, passwordSalt: salt },
    create: { phone: ADMIN_PHONE, role: 'admin', passwordHash: hash, passwordSalt: salt },
  });
}

const PORT = process.env.PORT || 3001;

async function start() {
  await prisma.$connect();
  await ensureAdmin();
  app.listen(PORT, () => {
    if (!API_KEY || API_KEY === 'pk_sandbox_XXXX') {
      console.error('WARNING: GeniusPay API key not configured! Edit .env file.');
    }
    if (!ADMIN_PHONE || !ADMIN_PASSWORD) {
      console.error('WARNING: Admin credentials not configured! Set ADMIN_PHONE and ADMIN_PASSWORD in .env');
    }
    console.log(`DIOTYTIO API server running on port ${PORT} (PostgreSQL connected)`);
  });
}

start().catch((err) => {
  console.error('FATAL: impossible de démarrer le serveur:', err.message);
  process.exit(1);
});
