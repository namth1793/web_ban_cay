import { Router } from 'express';

export default function productsRouter(pool) {
  const router = Router();

  router.get('/', async (req, res) => {
    try {
      const { category, featured, search, limit = 50, offset = 0 } = req.query;
      let query = `SELECT p.*, c.name as category_name, c.slug as category_slug
                   FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1`;
      const params = [];
      let i = 1;
      if (category) { query += ` AND c.slug = $${i++}`; params.push(category); }
      if (featured) { query += ` AND p.featured = 1`; }
      if (search) { query += ` AND p.name ILIKE $${i++}`; params.push(`%${search}%`); }
      query += ` ORDER BY p.featured DESC, p.sold DESC LIMIT $${i++} OFFSET $${i++}`;
      params.push(Number(limit), Number(offset));
      const { rows } = await pool.query(query, params);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:slug', async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT p.*, c.name as category_name, c.slug as category_slug
         FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = $1`,
        [req.params.slug]
      );
      if (!rows.length) return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
      const product = rows[0];
      const { rows: related } = await pool.query(
        `SELECT * FROM products WHERE category_id = $1 AND id != $2 ORDER BY featured DESC LIMIT 4`,
        [product.category_id, product.id]
      );
      res.json({ ...product, related });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
