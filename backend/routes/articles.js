import { Router } from 'express';

export default function articlesRouter(db) {
  const router = Router();

  router.get('/', async (req, res) => {
    try {
      const { type, limit = 10 } = req.query;
      let sql = 'SELECT id,type,title,slug,summary,image,created_at FROM articles WHERE 1=1';
      const params = [];
      if (type) { sql += ' AND type = ?'; params.push(type); }
      sql += ' ORDER BY created_at DESC LIMIT ?';
      params.push(Number(limit));
      const rows = await db.all(sql, params);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id/reactions', async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const { session_id } = req.query;
      const counts = await db.all(
        'SELECT reaction_type, COUNT(*) as count FROM article_reactions WHERE article_id = ? GROUP BY reaction_type',
        [articleId]
      );
      const result = { likes: 0, dislikes: 0, user_reaction: null };
      for (const c of counts) {
        if (c.reaction_type === 'like') result.likes = Number(c.count);
        else result.dislikes = Number(c.count);
      }
      if (session_id) {
        const ur = await db.get(
          'SELECT reaction_type FROM article_reactions WHERE article_id = ? AND session_id = ?',
          [articleId, session_id]
        );
        result.user_reaction = ur?.reaction_type || null;
      }
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/:id/react', async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const { session_id, reaction_type } = req.body;
      if (!session_id || !['like', 'dislike'].includes(reaction_type)) {
        return res.status(400).json({ error: 'Dữ liệu không hợp lệ' });
      }
      const existing = await db.get(
        'SELECT * FROM article_reactions WHERE article_id = ? AND session_id = ?',
        [articleId, session_id]
      );
      if (existing) {
        if (existing.reaction_type === reaction_type) {
          await db.run('DELETE FROM article_reactions WHERE id = ?', [existing.id]);
        } else {
          await db.run('UPDATE article_reactions SET reaction_type = ? WHERE id = ?', [reaction_type, existing.id]);
        }
      } else {
        await db.run(
          'INSERT INTO article_reactions (article_id, session_id, reaction_type) VALUES (?,?,?)',
          [articleId, session_id, reaction_type]
        );
      }
      const counts = await db.all(
        'SELECT reaction_type, COUNT(*) as count FROM article_reactions WHERE article_id = ? GROUP BY reaction_type',
        [articleId]
      );
      const result = { likes: 0, dislikes: 0, user_reaction: null };
      for (const c of counts) {
        if (c.reaction_type === 'like') result.likes = Number(c.count);
        else result.dislikes = Number(c.count);
      }
      const ur = await db.get(
        'SELECT reaction_type FROM article_reactions WHERE article_id = ? AND session_id = ?',
        [articleId, session_id]
      );
      result.user_reaction = ur?.reaction_type || null;
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/:id/comments', async (req, res) => {
    try {
      const comments = await db.all(
        'SELECT * FROM article_comments WHERE article_id = ? ORDER BY created_at ASC',
        [parseInt(req.params.id)]
      );
      res.json(comments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/:id/comments', async (req, res) => {
    try {
      const { author_name, content } = req.body;
      if (!author_name?.trim() || !content?.trim()) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ tên và nội dung bình luận' });
      }
      const { lastId } = await db.run(
        'INSERT INTO article_comments (article_id, author_name, content) VALUES (?,?,?)',
        [parseInt(req.params.id), author_name.trim(), content.trim()]
      );
      const comment = await db.get('SELECT * FROM article_comments WHERE id = ?', [lastId]);
      res.json(comment);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // /:slug must come after all /:id/... routes
  router.get('/:slug', async (req, res) => {
    try {
      const article = await db.get('SELECT * FROM articles WHERE slug = ?', [req.params.slug]);
      if (!article) return res.status(404).json({ error: 'Không tìm thấy bài viết' });
      await db.run('UPDATE articles SET views = views + 1 WHERE id = ?', [article.id]);
      const related = await db.all(
        'SELECT id,title,slug,image,created_at FROM articles WHERE type = ? AND id != ? LIMIT 3',
        [article.type, article.id]
      );
      res.json({ ...article, views: article.views + 1, related });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
