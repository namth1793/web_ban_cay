import { Router } from 'express';

export default function articlesRouter(db) {
  const router = Router();

  router.get('/', (req, res) => {
    try {
      const { type, limit = 10 } = req.query;
      let sql = 'SELECT id,type,title,slug,summary,image,created_at FROM articles WHERE 1=1';
      const params = [];
      if (type) { sql += ' AND type = ?'; params.push(type); }
      sql += ' ORDER BY created_at DESC LIMIT ?';
      params.push(Number(limit));
      const rows = db.prepare(sql).all(...params);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Reactions: GET /:id/reactions
  router.get('/:id/reactions', (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const { session_id } = req.query;
      const counts = db.prepare(
        'SELECT reaction_type, COUNT(*) as count FROM article_reactions WHERE article_id = ? GROUP BY reaction_type'
      ).all(articleId);
      const result = { likes: 0, dislikes: 0, user_reaction: null };
      for (const c of counts) {
        if (c.reaction_type === 'like') result.likes = c.count;
        else result.dislikes = c.count;
      }
      if (session_id) {
        const ur = db.prepare(
          'SELECT reaction_type FROM article_reactions WHERE article_id = ? AND session_id = ?'
        ).get(articleId, session_id);
        result.user_reaction = ur?.reaction_type || null;
      }
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Reactions: POST /:id/react
  router.post('/:id/react', (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const { session_id, reaction_type } = req.body;
      if (!session_id || !['like', 'dislike'].includes(reaction_type)) {
        return res.status(400).json({ error: 'Dữ liệu không hợp lệ' });
      }
      const existing = db.prepare(
        'SELECT * FROM article_reactions WHERE article_id = ? AND session_id = ?'
      ).get(articleId, session_id);

      if (existing) {
        if (existing.reaction_type === reaction_type) {
          db.prepare('DELETE FROM article_reactions WHERE id = ?').run(existing.id);
        } else {
          db.prepare('UPDATE article_reactions SET reaction_type = ? WHERE id = ?').run(reaction_type, existing.id);
        }
      } else {
        db.prepare(
          'INSERT INTO article_reactions (article_id, session_id, reaction_type) VALUES (?,?,?)'
        ).run(articleId, session_id, reaction_type);
      }

      const counts = db.prepare(
        'SELECT reaction_type, COUNT(*) as count FROM article_reactions WHERE article_id = ? GROUP BY reaction_type'
      ).all(articleId);
      const result = { likes: 0, dislikes: 0, user_reaction: null };
      for (const c of counts) {
        if (c.reaction_type === 'like') result.likes = c.count;
        else result.dislikes = c.count;
      }
      const ur = db.prepare(
        'SELECT reaction_type FROM article_reactions WHERE article_id = ? AND session_id = ?'
      ).get(articleId, session_id);
      result.user_reaction = ur?.reaction_type || null;
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Comments: GET /:id/comments
  router.get('/:id/comments', (req, res) => {
    try {
      const comments = db.prepare(
        'SELECT * FROM article_comments WHERE article_id = ? ORDER BY created_at ASC'
      ).all(parseInt(req.params.id));
      res.json(comments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Comments: POST /:id/comments
  router.post('/:id/comments', (req, res) => {
    try {
      const { author_name, content } = req.body;
      if (!author_name?.trim() || !content?.trim()) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ tên và nội dung bình luận' });
      }
      const { lastInsertRowid } = db.prepare(
        'INSERT INTO article_comments (article_id, author_name, content) VALUES (?,?,?)'
      ).run(parseInt(req.params.id), author_name.trim(), content.trim());
      const comment = db.prepare('SELECT * FROM article_comments WHERE id = ?').get(lastInsertRowid);
      res.json(comment);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Article by slug — must come after specific /:id/... routes
  router.get('/:slug', (req, res) => {
    try {
      const article = db.prepare('SELECT * FROM articles WHERE slug = ?').get(req.params.slug);
      if (!article) return res.status(404).json({ error: 'Không tìm thấy bài viết' });
      db.prepare('UPDATE articles SET views = views + 1 WHERE id = ?').run(article.id);
      const related = db.prepare(
        'SELECT id,title,slug,image,created_at FROM articles WHERE type = ? AND id != ? LIMIT 3'
      ).all(article.type, article.id);
      res.json({ ...article, views: article.views + 1, related });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
