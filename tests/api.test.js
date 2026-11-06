import { test } from 'node:test';
import assert from 'node:assert/strict';
import serverless from 'serverless-http';
import { createApp } from '../server/index.js';

function fixture({ balance = 5000, role = 'user', transaction, checkedIn = false } = {}) {
  const writes = [];
  const user = { id: 'test-user', phone: '+2250100000000', balance, role };
  const repository = {
    session: { findUnique: async () => ({ expiresAt: new Date(Date.now() + 60000), user, role }) },
    user: {
      findUnique: async () => user,
      update: async ({ data }) => {
        writes.push(data);
        if (data.balance?.increment) user.balance += data.balance.increment;
        if (data.balance?.decrement) user.balance -= data.balance.decrement;
        return user;
      },
      upsert: async () => user,
    },
    transaction: {
      findUnique: async () => transaction,
      findFirst: async () => checkedIn ? { id: 'previous-checkin' } : null,
      create: async ({ data }) => { writes.push(data); return { id: 'test-transaction', ...data }; },
      update: async ({ data }) => { writes.push(data); return { ...transaction, ...data }; },
    },
  };
  repository.$transaction = async callback => callback(repository);
  const handler = serverless(createApp({ repository }).app);
  const request = async (path, { method = 'GET', body, authenticated = true, raw } = {}) => {
    const result = await handler({
      httpMethod: method, path,
      headers: { 'content-type': 'application/json', ...(authenticated ? { authorization: 'Bearer test-fixture' } : {}) },
      body: raw ?? (body ? JSON.stringify(body) : undefined),
      requestContext: { identity: { sourceIp: '127.0.0.1' } },
    }, {});
    return { status: result.statusCode, body: JSON.parse(result.body) };
  };
  return { request, writes };
}

test('protected routes reject missing credentials', async () => {
  const { request } = fixture();
  for (const path of ['/api/me', '/api/transactions', '/api/bank-accounts', '/api/admin/users']) {
    assert.equal((await request(path, { authenticated: false })).status, 401);
  }
});

test('unknown nested API routes return JSON 404', async () => {
  const { request } = fixture();
  assert.equal((await request('/api/unknown/nested/path')).status, 404);
});

test('malformed JSON returns a client error', async () => {
  const { request } = fixture();
  assert.equal((await request('/api/auth/login', { method: 'POST', raw: '{' })).status, 400);
});

test('normal users cannot approve deposits', async () => {
  const { request, writes } = fixture();
  assert.equal((await request('/api/admin/transactions/test/approve', { method: 'POST' })).status, 403);
  assert.equal(writes.length, 0);
});

test('withdrawal rejects insufficient funds without changing balances', async () => {
  const { request, writes } = fixture({ balance: 1700 });
  const result = await request('/api/withdrawals', { method: 'POST', body: { amount: 3000, phone: '+2250100000000' } });
  assert.equal(result.status, 400);
  assert.equal(writes.length, 0);
});

test('withdrawal reserves funds and creates a pending record', async () => {
  const { request, writes } = fixture();
  const result = await request('/api/withdrawals', { method: 'POST', body: { amount: 3000, phone: '+2250100000000' } });
  assert.equal(result.status, 201);
  assert.equal(result.body.balance, 2000);
  assert.equal(result.body.status, 'pending');
  assert.equal(writes.length, 2);
});

test('already processed deposits cannot be credited again', async () => {
  const { request, writes } = fixture({ role: 'admin', transaction: { id: 'test', userId: 'test-user', type: 'deposit', status: 'approved', amount: 3000 } });
  assert.equal((await request('/api/admin/transactions/test/approve', { method: 'POST' })).status, 404);
  assert.equal(writes.length, 0);
});

test('rejecting a pending withdrawal refunds reserved funds', async () => {
  const { request, writes } = fixture({ role: 'admin', transaction: { id: 'test', userId: 'test-user', type: 'withdraw', status: 'pending', amount: 3000 } });
  const result = await request('/api/admin/transactions/test/reject', { method: 'POST' });
  assert.equal(result.status, 200);
  assert.equal(result.body.status, 'rejected');
  assert.deepEqual(writes[0], { balance: { increment: 3000 } });
});

test('an existing daily check-in cannot receive another reward', async () => {
  const { request, writes } = fixture({ checkedIn: true });
  assert.equal((await request('/api/tasks/checkin', { method: 'POST' })).status, 409);
  assert.equal(writes.length, 0);
});

test('legacy direct payout cannot bypass the withdrawal ledger', async () => {
  const { request, writes } = fixture();
  assert.equal((await request('/api/payouts', { method: 'POST' })).status, 409);
  assert.equal(writes.length, 0);
});
