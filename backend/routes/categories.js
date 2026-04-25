import { Router } from 'express';

export default function categoriesRouter(db) {
  const router = Router();

  router.get('/', (req, res) => {
    try {
      const rows = db.prepare(`
        SELECT c.*, COUNT(p.id) as product_count
        FROM categories c LEFT JOIN products p ON p.category_id = c.id
        GROUP BY c.id ORDER BY c.sort_order
      `).all();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:slug', (req, res) => {
    try {
      const row = db.prepare('SELECT * FROM categories WHERE slug = ?').get(req.params.slug);
      if (!row) return res.status(404).json({ error: 'Không tìm thấy danh mục' });
      res.json(row);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
