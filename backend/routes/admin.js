import { Router } from 'express';
import { createHmac } from 'crypto';
import { Readable } from 'stream';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const SECRET = process.env.ADMIN_SECRET || 'xrn_admin_2025';
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';

function makeToken(payload) {
  const data = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 3600 * 1000 })).toString('base64url');
  const sig = createHmac('sha256', SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function verifyToken(token) {
  if (!token) throw new Error('No token');
  const [data, sig] = token.split('.');
  const expected = createHmac('sha256', SECRET).update(data).digest('base64url');
  if (sig !== expected) throw new Error('Invalid token');
  const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
  if (payload.exp < Date.now()) throw new Error('Token expired');
  return payload;
}

function auth(req, res, next) {
  try {
    const raw = req.headers.authorization?.replace('Bearer ', '');
    verifyToken(raw);
    next();
  } catch {
    res.status(401).json({ error: 'Chưa đăng nhập hoặc phiên hết hạn' });
  }
}

const toSlug = (str) => {
  const m = { à:'a',á:'a',ả:'a',ã:'a',ạ:'a',ă:'a',ắ:'a',ặ:'a',ằ:'a',ẳ:'a',ẵ:'a',â:'a',ấ:'a',ầ:'a',ẩ:'a',ẫ:'a',ậ:'a',è:'e',é:'e',ẻ:'e',ẽ:'e',ẹ:'e',ê:'e',ế:'e',ề:'e',ể:'e',ễ:'e',ệ:'e',ì:'i',í:'i',ỉ:'i',ĩ:'i',ị:'i',ò:'o',ó:'o',ỏ:'o',õ:'o',ọ:'o',ô:'o',ố:'o',ồ:'o',ổ:'o',ỗ:'o',ộ:'o',ơ:'o',ớ:'o',ờ:'o',ở:'o',ỡ:'o',ợ:'o',ù:'u',ú:'u',ủ:'u',ũ:'u',ụ:'u',ư:'u',ứ:'u',ừ:'u',ử:'u',ữ:'u',ự:'u',ỳ:'y',ý:'y',ỷ:'y',ỹ:'y',ỵ:'y',đ:'d' };
  return str.toLowerCase().split('').map(c => m[c] || c).join('').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
};

export default function adminRouter(db) {
  const router = Router();

  router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      res.json({ token: makeToken({ username, role: 'admin' }) });
    } else {
      res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }
  });

  router.get('/stats', auth, async (req, res) => {
    try {
      const [products, articles, orders, contacts] = await Promise.all([
        db.get('SELECT COUNT(*) as c FROM products'),
        db.get('SELECT COUNT(*) as c FROM articles'),
        db.get('SELECT COUNT(*) as c FROM orders'),
        db.get('SELECT COUNT(*) as c FROM contacts'),
      ]);
      const revenue = await db.get("SELECT COALESCE(SUM(total),0) as r FROM orders WHERE status != 'cancelled'");
      res.json({
        products: Number(products.c),
        articles: Number(articles.c),
        orders: Number(orders.c),
        contacts: Number(contacts.c),
        revenue: Number(revenue.r),
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  function parseImgField(raw) {
    if (!raw) return [];
    try { const p = JSON.parse(raw); if (Array.isArray(p)) return p; } catch {}
    return [raw];
  }

  function withImages(row) {
    const imgs = parseImgField(row.image);
    return { ...row, image: imgs[0] || null, images: imgs };
  }

  // Products CRUD
  router.get('/products', auth, async (req, res) => {
    try {
      const rows = await db.all(`
        SELECT p.*, c.name as category_name FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
        ORDER BY p.created_at DESC
      `);
      res.json(rows.map(withImages));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/products', auth, async (req, res) => {
    try {
      const { category_id, name, price, original_price, description, care_info, images, stock, featured } = req.body;
      if (!name || !price) return res.status(400).json({ error: 'Thiếu tên hoặc giá sản phẩm' });
      const imageJson = Array.isArray(images) && images.length ? JSON.stringify(images) : null;
      const slug = toSlug(name) + '-' + Date.now().toString(36);
      const { lastId } = await db.run(
        'INSERT INTO products (category_id,name,slug,price,original_price,description,care_info,image,stock,featured) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [category_id || null, name, slug, price, original_price || null, description || null, care_info || null, imageJson, stock ?? 100, featured ? 1 : 0]
      );
      const product = await db.get('SELECT * FROM products WHERE id = ?', [lastId]);
      res.json(withImages(product));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/products/:id', auth, async (req, res) => {
    try {
      const { category_id, name, price, original_price, description, care_info, images, stock, featured } = req.body;
      if (!name || !price) return res.status(400).json({ error: 'Thiếu tên hoặc giá sản phẩm' });
      const imageJson = Array.isArray(images) && images.length ? JSON.stringify(images) : null;
      await db.run(
        'UPDATE products SET category_id=?,name=?,price=?,original_price=?,description=?,care_info=?,image=?,stock=?,featured=? WHERE id=?',
        [category_id || null, name, price, original_price || null, description || null, care_info || null, imageJson, stock ?? 100, featured ? 1 : 0, req.params.id]
      );
      const product = await db.get('SELECT * FROM products WHERE id = ?', [req.params.id]);
      res.json(withImages(product));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/products/:id', auth, async (req, res) => {
    try {
      await db.run('DELETE FROM products WHERE id = ?', [req.params.id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Articles CRUD
  router.get('/articles', auth, async (req, res) => {
    try {
      const rows = await db.all('SELECT * FROM articles ORDER BY created_at DESC');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/articles', auth, async (req, res) => {
    try {
      const { type, title, summary, content, image, author } = req.body;
      if (!title || !type) return res.status(400).json({ error: 'Thiếu tiêu đề hoặc loại bài viết' });
      const slug = toSlug(title) + '-' + Date.now().toString(36);
      const { lastId } = await db.run(
        'INSERT INTO articles (type,title,slug,summary,content,image,author) VALUES (?,?,?,?,?,?,?)',
        [type, title, slug, summary || null, content || null, image || null, author || null]
      );
      const article = await db.get('SELECT * FROM articles WHERE id = ?', [lastId]);
      res.json(article);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/articles/:id', auth, async (req, res) => {
    try {
      const { type, title, summary, content, image, author } = req.body;
      if (!title || !type) return res.status(400).json({ error: 'Thiếu tiêu đề hoặc loại bài viết' });
      await db.run(
        'UPDATE articles SET type=?,title=?,summary=?,content=?,image=?,author=? WHERE id=?',
        [type, title, summary || null, content || null, image || null, author || null, req.params.id]
      );
      const article = await db.get('SELECT * FROM articles WHERE id = ?', [req.params.id]);
      res.json(article);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/articles/:id', auth, async (req, res) => {
    try {
      await db.run('DELETE FROM articles WHERE id = ?', [req.params.id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Orders
  router.get('/orders', auth, async (req, res) => {
    try {
      const orders = await db.all('SELECT * FROM orders ORDER BY created_at DESC');
      const items = await db.all('SELECT * FROM order_items');
      const result = orders.map(o => ({
        ...o,
        items: items.filter(i => i.order_id === o.id),
      }));
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/orders/:id/status', auth, async (req, res) => {
    try {
      const { status } = req.body;
      const valid = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];
      if (!valid.includes(status)) return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
      await db.run('UPDATE orders SET status=? WHERE id=?', [status, req.params.id]);
      const order = await db.get('SELECT * FROM orders WHERE id=?', [req.params.id]);
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Contacts
  router.get('/contacts', auth, async (req, res) => {
    try {
      const rows = await db.all('SELECT * FROM contacts ORDER BY created_at DESC');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Categories CRUD
  router.get('/categories', auth, async (req, res) => {
    try {
      const rows = await db.all('SELECT * FROM categories ORDER BY sort_order ASC, id ASC');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/categories', auth, async (req, res) => {
    try {
      const { name, description, image, sort_order } = req.body;
      if (!name) return res.status(400).json({ error: 'Thiếu tên danh mục' });
      const slug = toSlug(name) + '-' + Date.now().toString(36);
      const { lastId } = await db.run(
        'INSERT INTO categories (name, slug, description, image, sort_order) VALUES (?,?,?,?,?)',
        [name, slug, description || null, image || null, sort_order ?? 0]
      );
      const row = await db.get('SELECT * FROM categories WHERE id = ?', [lastId]);
      res.json(row);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/categories/:id', auth, async (req, res) => {
    try {
      const { name, description, image, sort_order } = req.body;
      if (!name) return res.status(400).json({ error: 'Thiếu tên danh mục' });
      await db.run(
        'UPDATE categories SET name=?, description=?, image=?, sort_order=? WHERE id=?',
        [name, description || null, image || null, sort_order ?? 0, req.params.id]
      );
      const row = await db.get('SELECT * FROM categories WHERE id = ?', [req.params.id]);
      res.json(row);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/categories/:id', auth, async (req, res) => {
    try {
      const products = await db.get('SELECT COUNT(*) as c FROM products WHERE category_id = ?', [req.params.id]);
      if (Number(products.c) > 0) return res.status(400).json({ error: `Không thể xóa: còn ${products.c} sản phẩm thuộc danh mục này` });
      await db.run('DELETE FROM categories WHERE id = ?', [req.params.id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Hero Banners CRUD
  router.get('/banners', auth, async (req, res) => {
    try {
      const rows = await db.all('SELECT * FROM hero_banners ORDER BY sort_order ASC');
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/banners', auth, async (req, res) => {
    try {
      const { title, description, tag, image, link, cta_text, bg_gradient, sort_order, active } = req.body;
      if (!title || !image) return res.status(400).json({ error: 'Thiếu tiêu đề hoặc ảnh banner' });
      const { lastId } = await db.run(
        'INSERT INTO hero_banners (title,description,tag,image,link,cta_text,bg_gradient,sort_order,active) VALUES (?,?,?,?,?,?,?,?,?)',
        [title, description || null, tag || null, image, link || '/san-pham', cta_text || 'Xem ngay', bg_gradient || 'from-primary-900 via-primary-800 to-teal-700', sort_order ?? 0, active !== false ? 1 : 0]
      );
      const banner = await db.get('SELECT * FROM hero_banners WHERE id = ?', [lastId]);
      res.json(banner);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/banners/:id', auth, async (req, res) => {
    try {
      const { title, description, tag, image, link, cta_text, bg_gradient, sort_order, active } = req.body;
      if (!title || !image) return res.status(400).json({ error: 'Thiếu tiêu đề hoặc ảnh banner' });
      await db.run(
        'UPDATE hero_banners SET title=?,description=?,tag=?,image=?,link=?,cta_text=?,bg_gradient=?,sort_order=?,active=? WHERE id=?',
        [title, description || null, tag || null, image, link || '/san-pham', cta_text || 'Xem ngay', bg_gradient || 'from-primary-900 via-primary-800 to-teal-700', sort_order ?? 0, active !== false ? 1 : 0, req.params.id]
      );
      const banner = await db.get('SELECT * FROM hero_banners WHERE id = ?', [req.params.id]);
      res.json(banner);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/banners/:id', auth, async (req, res) => {
    try {
      await db.run('DELETE FROM hero_banners WHERE id = ?', [req.params.id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Cloudinary image upload
  router.post('/upload', auth, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Không có file được gửi lên' });
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(503).json({ error: 'Chưa cấu hình Cloudinary. Vui lòng thêm CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET vào file .env' });
    }
    try {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'xuongrong', resource_type: 'auto' },
          (error, result) => error ? reject(error) : resolve(result)
        );
        Readable.from(req.file.buffer).pipe(stream);
      });
      res.json({ url: result.secure_url });
    } catch (err) {
      res.status(500).json({ error: 'Upload thất bại: ' + err.message });
    }
  });

  // Site Settings
  router.get('/settings', auth, async (req, res) => {
    try {
      const rows = await db.all('SELECT key, value FROM site_settings');
      res.json(Object.fromEntries(rows.map(r => [r.key, r.value])));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/settings', auth, async (req, res) => {
    try {
      const upsert = db.type === 'pg'
        ? 'INSERT INTO site_settings (key, value) VALUES (?, ?) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value'
        : 'INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)';
      for (const [key, value] of Object.entries(req.body)) {
        await db.run(upsert, [key, String(value)]);
      }
      const rows = await db.all('SELECT key, value FROM site_settings');
      res.json(Object.fromEntries(rows.map(r => [r.key, r.value])));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
