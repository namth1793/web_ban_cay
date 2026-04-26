export async function createTables(db) {
  const AI = db.type === 'pg' ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
  const TS = db.type === 'pg' ? 'TIMESTAMP' : 'DATETIME';

  const tables = [
    `CREATE TABLE IF NOT EXISTS categories (
      id ${AI}, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL,
      description TEXT, image TEXT, sort_order INTEGER DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS products (
      id ${AI}, category_id INTEGER REFERENCES categories(id),
      name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL,
      price INTEGER NOT NULL, original_price INTEGER,
      description TEXT, care_info TEXT, image TEXT,
      stock INTEGER DEFAULT 100, featured INTEGER DEFAULT 0,
      sold INTEGER DEFAULT 0, created_at ${TS} DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS articles (
      id ${AI}, type TEXT NOT NULL, title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL, summary TEXT, content TEXT,
      image TEXT, views INTEGER DEFAULT 0,
      created_at ${TS} DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS contacts (
      id ${AI}, name TEXT NOT NULL, email TEXT,
      phone TEXT, message TEXT,
      created_at ${TS} DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS orders (
      id ${AI}, customer_name TEXT NOT NULL,
      phone TEXT NOT NULL, address TEXT NOT NULL,
      note TEXT, total INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at ${TS} DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS order_items (
      id ${AI}, order_id INTEGER REFERENCES orders(id),
      product_id INTEGER, product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL, price INTEGER NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS article_reactions (
      id ${AI}, article_id INTEGER REFERENCES articles(id),
      session_id TEXT NOT NULL, reaction_type TEXT NOT NULL,
      UNIQUE(article_id, session_id)
    )`,
    `CREATE TABLE IF NOT EXISTS article_comments (
      id ${AI}, article_id INTEGER REFERENCES articles(id),
      author_name TEXT NOT NULL, content TEXT NOT NULL,
      created_at ${TS} DEFAULT CURRENT_TIMESTAMP
    )`,
  ];

  for (const sql of tables) {
    await db.exec(sql);
  }
}
