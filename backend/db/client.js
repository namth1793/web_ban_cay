import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = join(__dirname, '../data');
mkdirSync(dataDir, { recursive: true });

const db = new Database(join(dataDir, 'xuongrong.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export default db;
