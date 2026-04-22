import express from 'express';
import cors from 'cors';
import pool from './db/client.js';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import articlesRouter from './routes/articles.js';
import contactsRouter from './routes/contacts.js';
import ordersRouter from './routes/orders.js';
import { createTables } from './db/schema.js';
import { seedData } from './db/seed.js';

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : '*',
  credentials: true,
}));
app.use(express.json());

app.use('/api/products', productsRouter(pool));
app.use('/api/categories', categoriesRouter(pool));
app.use('/api/articles', articlesRouter(pool));
app.use('/api/contacts', contactsRouter(pool));
app.use('/api/orders', ordersRouter(pool));

const PORT = process.env.PORT || 5013;

async function start() {
  try {
    await createTables(pool);
    await seedData(pool);
    app.listen(PORT, () => {
      console.log(`🌿 Server chạy tại http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Lỗi khởi động server:', err);
    process.exit(1);
  }
}

start();
