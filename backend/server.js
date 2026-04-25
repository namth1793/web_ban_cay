import express from 'express';
import cors from 'cors';
import db from './db/client.js';
import { createTables } from './db/schema.js';
import { seedData } from './db/seed.js';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import articlesRouter from './routes/articles.js';
import contactsRouter from './routes/contacts.js';
import ordersRouter from './routes/orders.js';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

createTables(db);
seedData(db);

app.use('/api/products', productsRouter(db));
app.use('/api/categories', categoriesRouter(db));
app.use('/api/articles', articlesRouter(db));
app.use('/api/contacts', contactsRouter(db));
app.use('/api/orders', ordersRouter(db));

const PORT = 5013;
app.listen(PORT, () => console.log(`🌿 Server chạy tại http://localhost:${PORT}`));
