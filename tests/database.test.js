import { test } from 'node:test';
import assert from 'node:assert/strict';
import { drizzle } from 'drizzle-orm/node-postgres';
import { createRepository } from '../db/index.js';

function recordingDatabase() {
  const queries = [];
  const client = {
    query: async (query, params) => {
      const text = typeof query === 'string' ? query : query.text;
      queries.push({ text, params });
      return { rows: text.startsWith('select') ? [['test-user']] : [] };
    },
  };
  return { queries, repository: createRepository(drizzle({ client })) };
}

test('transactional reads acquire row locks before financial decisions', async () => {
  const { queries, repository } = recordingDatabase();
  await repository.$transaction(async tx => {
    const row = await tx.user.findUnique({ where: { id: 'test-user' }, select: { id: true } });
    assert.equal(row.id, 'test-user');
  });
  assert.equal(queries[0].text, 'begin');
  assert.match(queries[1].text, /for update$/);
  assert.equal(queries.at(-1).text, 'commit');
});

test('failed operations roll back the transaction', async () => {
  const { queries, repository } = recordingDatabase();
  await assert.rejects(repository.$transaction(async () => { throw new Error('test rollback'); }));
  assert.equal(queries.at(-1).text, 'rollback');
});

test('untrusted filter values are parameters, not SQL text', async () => {
  const { queries, repository } = recordingDatabase();
  const value = "unexpected' OR TRUE --";
  await repository.user.findUnique({ where: { phone: value }, select: { id: true } });
  assert.equal(queries[0].text.includes(value), false);
  assert.equal(queries[0].params[0], value);
});
