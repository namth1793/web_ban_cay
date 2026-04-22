import { Router } from 'express';

export default function contactsRouter(pool) {
  const router = Router();

  router.post('/', async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;
      if (!name || !message) return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
      const { rows } = await pool.query(
        'INSERT INTO contacts (name,email,phone,message) VALUES ($1,$2,$3,$4) RETURNING id',
        [name, email, phone, message]
      );
      res.json({ success: true, id: rows[0].id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
