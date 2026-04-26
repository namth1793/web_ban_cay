import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

function toPostgres(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

async function createPgAdapter() {
  const { default: pg } = await import('pg');
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const makeTx = (client) => ({
    all: async (sql, params = []) => {
      const { rows } = await client.query(toPostgres(sql), params);
      return rows;
    },
    get: async (sql, params = []) => {
      const { rows } = await client.query(toPostgres(sql), params);
      return rows[0];
    },
    run: async (sql, params = []) => {
      const pgSql = toPostgres(sql);
      const isInsert = pgSql.trim().toUpperCase().startsWith('INSERT');
      const { rows, rowCount } = await client.query(
        isInsert ? pgSql + ' RETURNING id' : pgSql,
        params
      );
      return { lastId: rows[0]?.id ?? null, changes: rowCount };
    },
  });

  return {
    type: 'pg',
    ...makeTx(pool),
    exec: async (sql) => { await pool.query(sql); },
    transaction: async (fn) => {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const result = await fn(makeTx(client));
        await client.query('COMMIT');
        return result;
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
    },
  };
}

async function createSqliteAdapter() {
  const { default: Database } = await import('better-sqlite3');
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const dataDir = join(__dirname, '../data');
  mkdirSync(dataDir, { recursive: true });
  const db = new Database(join(dataDir, 'xuongrong.db'));
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.type = 'sqlite';
  return db;
}

const db = await (process.env.DATABASE_URL ? createPgAdapter() : createSqliteAdapter());
console.log(`🗄  Database: ${db.type === 'pg' ? 'PostgreSQL' : 'SQLite'}`);
export default db;
