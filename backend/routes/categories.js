import { Router } from 'express';

export default function categoriesRouter(pool) {
  const router = Router();

  router.get('/', async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT c.*, COUNT(p.id)::int as product_count
         FROM categories c LEFT JOIN products p ON p.category_id = c.id
         GROUP BY c.id ORDER BY c.sort_order`
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:slug', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM categories WHERE slug = $1', [req.params.slug]);
      if (!rows.length) return res.status(404).json({ error: 'Không tìm thấy danh mục' });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
