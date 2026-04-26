import { Router } from 'express';

export default function categoriesRouter(db) {
  const router = Router();

  router.get('/', async (req, res) => {
    try {
      const rows = await db.all(`
        SELECT c.id, c.name, c.slug, c.description, c.image, c.sort_order, COUNT(p.id) as product_count
        FROM categories c LEFT JOIN products p ON p.category_id = c.id
        GROUP BY c.id, c.name, c.slug, c.description, c.image, c.sort_order
        ORDER BY c.sort_order
      `);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:slug', async (req, res) => {
    try {
      const row = await db.get('SELECT * FROM categories WHERE slug = ?', [req.params.slug]);
      if (!row) return res.status(404).json({ error: 'Không tìm thấy danh mục' });
      res.json(row);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
