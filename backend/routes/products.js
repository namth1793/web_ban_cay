import { Router } from 'express';

export default function productsRouter(db) {
  const router = Router();

  router.get('/', (req, res) => {
    try {
      const { category, featured, search, limit = 50, offset = 0 } = req.query;
      let sql = `SELECT p.*, c.name as category_name, c.slug as category_slug
                 FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1`;
      const params = [];
      if (category) { sql += ' AND c.slug = ?'; params.push(category); }
      if (featured) { sql += ' AND p.featured = 1'; }
      if (search) { sql += ' AND p.name LIKE ?'; params.push(`%${search}%`); }
      sql += ' ORDER BY p.featured DESC, p.sold DESC LIMIT ? OFFSET ?';
      params.push(Number(limit), Number(offset));
      const rows = db.prepare(sql).all(...params);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:slug', (req, res) => {
    try {
      const product = db.prepare(`
        SELECT p.*, c.name as category_name, c.slug as category_slug
        FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = ?
      `).get(req.params.slug);
      if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
      const related = db.prepare(
        'SELECT * FROM products WHERE category_id = ? AND id != ? ORDER BY featured DESC LIMIT 4'
      ).all(product.category_id, product.id);
      res.json({ ...product, related });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
