import { Router } from 'express';

export default function contactsRouter(db) {
  const router = Router();

  router.post('/', (req, res) => {
    const { name, email, phone, message } = req.body;
    if (!name || !message) return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    const result = db.prepare('INSERT INTO contacts (name,email,phone,message) VALUES (?,?,?,?)').run(name, email, phone, message);
    res.json({ success: true, id: result.lastInsertRowid });
  });

  return router;
}
