import { Router } from 'express';

export default function articlesRouter(pool) {
  const router = Router();

  router.get('/', async (req, res) => {
    try {
      const { type, limit = 10 } = req.query;
      let query = 'SELECT id,type,title,slug,summary,image,created_at FROM articles WHERE 1=1';
      const params = [];
      let i = 1;
      if (type) { query += ` AND type = $${i++}`; params.push(type); }
      query += ` ORDER BY created_at DESC LIMIT $${i}`;
      params.push(Number(limit));
      const { rows } = await pool.query(query, params);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:slug', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM articles WHERE slug = $1', [req.params.slug]);
      if (!rows.length) return res.status(404).json({ error: 'Không tìm thấy bài viết' });
      const article = rows[0];
      await pool.query('UPDATE articles SET views = views + 1 WHERE id = $1', [article.id]);
      const { rows: related } = await pool.query(
        'SELECT id,title,slug,image,created_at FROM articles WHERE type = $1 AND id != $2 LIMIT 3',
        [article.type, article.id]
      );
      res.json({ ...article, related });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
