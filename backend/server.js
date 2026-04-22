import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';
import Database from 'better-sqlite3';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import articlesRouter from './routes/articles.js';
import contactsRouter from './routes/contacts.js';
import ordersRouter from './routes/orders.js';
import { createTables } from './db/schema.js';
import { seedData } from './db/seed.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, 'data');
mkdirSync(dataDir, { recursive: true });

const db = new Database(join(dataDir, 'xuongrong.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

createTables(db);
seedData(db);

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : '*',
  credentials: true,
}));
app.use(express.json());

app.use('/api/products', productsRouter(db));
app.use('/api/categories', categoriesRouter(db));
app.use('/api/articles', articlesRouter(db));
app.use('/api/contacts', contactsRouter(db));
app.use('/api/orders', ordersRouter(db));

const PORT = process.env.PORT || 5013;
app.listen(PORT, () => {
  console.log(`🌿 Server chạy tại http://localhost:${PORT}`);
});
