import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:olaflex.db',
  authToken: process.env.TURSO_AUTH_TOKEN || undefined,
});

// ===== Simple in-memory cache with short TTL =====
const cache = new Map();
const CACHE_TTL = 5_000; // 5 seconds — fast expiry so products show quickly after add
let lastWriteAt = 0; // track the last write time

function getCached(key) {
  const entry = cache.get(key);
  // If a write happened after this cache entry was created, treat as stale
  if (entry && Date.now() - entry.time < CACHE_TTL && entry.time > lastWriteAt) return entry.data;
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, time: Date.now() });
}

function invalidateAll() {
  cache.clear();
  lastWriteAt = Date.now();
}

// Helper: run a query and return rows (with caching for reads)
export async function dbAll(sql, params = []) {
  const cacheKey = `all:${sql}:${JSON.stringify(params)}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const result = await db.execute({ sql, args: params.map(p => typeof p === 'bigint' ? Number(p) : p) });
  setCache(cacheKey, result.rows);
  return result.rows;
}

// Helper: run a query and return first row (with caching for reads)
export async function dbGet(sql, params = []) {
  const cacheKey = `get:${sql}:${JSON.stringify(params)}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const result = await db.execute({ sql, args: params.map(p => typeof p === 'bigint' ? Number(p) : p) });
  const row = result.rows[0] || null;
  if (row) setCache(cacheKey, row);
  return row;
}

// Helper: run a statement (INSERT/UPDATE/DELETE) — invalidates ALL cache immediately
export async function dbRun(sql, params = []) {
  invalidateAll();
  const result = await db.execute({ sql, args: params.map(p => typeof p === 'bigint' ? Number(p) : p) });
  return {
    lastInsertRowid: Number(result.lastInsertRowid),
    changes: Number(result.rowsAffected),
  };
}

// Helper: run multiple statements in a transaction
export async function dbTransaction(fn) {
  await db.execute('BEGIN');
  try {
    await fn();
    await db.execute('COMMIT');
    invalidateAll();
  } catch (err) {
    await db.execute('ROLLBACK');
    throw err;
  }
}

// Create tables
export async function initializeDatabase() {
  await db.execute(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  await db.execute(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT DEFAULT 'watches',
    price INTEGER NOT NULL,
    description TEXT,
    short_description TEXT,
    availability TEXT DEFAULT 'in_stock',
    stock_quantity INTEGER DEFAULT 0,
    is_featured INTEGER DEFAULT 0,
    specifications TEXT,
    reference TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  await db.execute(`CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    is_primary INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  )`);
}

export default db;
