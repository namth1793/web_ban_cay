import { Router } from 'express';

export default function contactsRouter(db) {
  const router = Router();

  router.post('/', (req, res) => {
    try {
      const { name, email, phone, message } = req.body;
      if (!name || !message) return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
      const { lastInsertRowid } = db.prepare(
        'INSERT INTO contacts (name,email,phone,message) VALUES (?,?,?,?)'
      ).run(name, email || null, phone || null, message);
      res.json({ success: true, id: lastInsertRowid });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
