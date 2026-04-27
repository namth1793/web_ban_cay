import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import db from './db/client.js';
import { createTables } from './db/schema.js';
import { seedData } from './db/seed.js';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import articlesRouter from './routes/articles.js';
import contactsRouter from './routes/contacts.js';
import ordersRouter from './routes/orders.js';
import adminRouter from './routes/admin.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

await createTables(db);
await seedData(db);

app.use('/api/products', productsRouter(db));
app.use('/api/categories', categoriesRouter(db));
app.use('/api/articles', articlesRouter(db));
app.use('/api/contacts', contactsRouter(db));
app.use('/api/orders', ordersRouter(db));
app.get('/api/banners', async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM hero_banners WHERE active = 1 ORDER BY sort_order ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api/admin', adminRouter(db));

// Serve frontend build (production)
const frontendDist = join(__dirname, '../frontend/dist');
if (existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => res.sendFile(join(frontendDist, 'index.html')));
}

const PORT = process.env.PORT || 5013;
app.listen(PORT, () => console.log(`🌿 Server chạy tại http://localhost:${PORT}`));
