import { getDatabase } from '@netlify/database';
import { drizzle } from 'drizzle-orm/netlify-db';
import { and, asc, desc, eq, ne, lt, gte, sql, count } from 'drizzle-orm';
import * as schema from './schema.ts';

// Keep the existing API contract while all persistence runs through Drizzle.
export function createRepository(connection, locked = false) {
  let client = connection;
  const database = () => client ||= drizzle({ client: getDatabase(), schema });
  const repository = {};
  const tables = { user: schema.users, session: schema.sessions, transaction: schema.transactions, setting: schema.settings, bankAccount: schema.bankAccounts };
  function condition(table, where = {}) {
    return and(...Object.entries(where).map(([key, value]) => {
      if (!table[key]) throw new Error('Unknown database field');
      if (value && typeof value === 'object' && !(value instanceof Date)) {
        if ('not' in value) return ne(table[key], value.not);
        if ('lt' in value) return lt(table[key], value.lt);
        if ('gte' in value) return gte(table[key], value.gte);
        throw new Error('Unsupported database filter');
      }
      return eq(table[key], value);
    }));
  }
  function values(table, data) {
    return Object.fromEntries(Object.entries(data).map(([key, value]) => {
      if (value && typeof value === 'object' && !(value instanceof Date)) {
        if ('increment' in value) return [key, sql`${table[key]} + ${value.increment}`];
        if ('decrement' in value) return [key, sql`${table[key]} - ${value.decrement}`];
      }
      return [key, value];
    }));
  }
  for (const [name, table] of Object.entries(tables)) {
    async function findMany({ where, orderBy, take, include, select } = {}) {
      const db = database();
      let query = db.select(select ? Object.fromEntries(Object.keys(select).filter(k => select[k]).map(k => [k, table[k]])) : undefined)
        .from(table).where(condition(table, where)).$dynamic();
      if (orderBy) query = query.orderBy(...Object.entries(orderBy).map(([key, direction]) => direction === 'desc' ? desc(table[key]) : asc(table[key])));
      if (take) query = query.limit(take);
      if (locked) query = query.for('update');
      const rows = await query;
      if (include?.user) {
        for (const row of rows) row.user = await repository.user.findUnique({ where: { id: row.userId }, select: include.user.select });
      }
      return rows;
    }
    repository[name] = {
      findMany,
      async findUnique(args) { return (await findMany({ ...args, take: 1 }))[0] || null; },
      async findFirst(args) { return (await findMany({ ...args, take: 1 }))[0] || null; },
      async create({ data }) { return (await database().insert(table).values(data).returning())[0]; },
      async update({ where, data }) {
        const result = (await database().update(table).set({ ...values(table, data), ...(table.updatedAt ? { updatedAt: new Date() } : {}) }).where(condition(table, where)).returning())[0];
        if (!result) throw Object.assign(new Error('Record not found'), { code: 'P2025' });
        return result;
      },
      async upsert({ where, create, update }) {
        const key = Object.keys(where)[0];
        return (await database().insert(table).values(create).onConflictDoUpdate({ target: table[key], set: update }).returning())[0];
      },
      async delete({ where }) { return (await database().delete(table).where(condition(table, where)).returning())[0]; },
      async deleteMany({ where }) { return database().delete(table).where(condition(table, where)); },
      async count({ where } = {}) { return (await database().select({ value: count() }).from(table).where(condition(table, where)))[0].value; },
    };
  }
  repository.$transaction = (callback) => database().transaction(tx => callback(createRepository(tx, true)));
  repository.$connect = () => database().execute(sql`select 1`);
  return repository;
}
