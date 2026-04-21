import { Router } from 'express';

export default function articlesRouter(db) {
  const router = Router();

  router.get('/', (req, res) => {
    const { type, limit = 10 } = req.query;
    let query = 'SELECT id,type,title,slug,summary,image,created_at FROM articles WHERE 1=1';
    const params = [];
    if (type) { query += ' AND type = ?'; params.push(type); }
    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(Number(limit));
    res.json(db.prepare(query).all(...params));
    db.prepare('UPDATE articles SET views = views + 1').run();
  });

  router.get('/:slug', (req, res) => {
    const article = db.prepare('SELECT * FROM articles WHERE slug = ?').get(req.params.slug);
    if (!article) return res.status(404).json({ error: 'Không tìm thấy bài viết' });
    db.prepare('UPDATE articles SET views = views + 1 WHERE id = ?').run(article.id);
    const related = db.prepare('SELECT id,title,slug,image,created_at FROM articles WHERE type = ? AND id != ? LIMIT 3')
      .all(article.type, article.id);
    res.json({ ...article, related });
  });

  return router;
}
