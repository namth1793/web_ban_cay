import { Router } from 'express';

export default function ordersRouter(pool) {
  const router = Router();

  router.post('/', async (req, res) => {
    const client = await pool.connect();
    try {
      const { customer_name, phone, address, note, items } = req.body;
      if (!customer_name || !phone || !address || !items?.length) {
        return res.status(400).json({ error: 'Thiếu thông tin đặt hàng' });
      }
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      await client.query('BEGIN');
      const { rows } = await client.query(
        'INSERT INTO orders (customer_name,phone,address,note,total) VALUES ($1,$2,$3,$4,$5) RETURNING id',
        [customer_name, phone, address, note, total]
      );
      const orderId = rows[0].id;
      for (const item of items) {
        await client.query(
          'INSERT INTO order_items (order_id,product_id,product_name,quantity,price) VALUES ($1,$2,$3,$4,$5)',
          [orderId, item.product_id, item.product_name, item.quantity, item.price]
        );
      }
      await client.query('COMMIT');
      res.json({ success: true, orderId, total });
    } catch (err) {
      await client.query('ROLLBACK');
      res.status(500).json({ error: err.message });
    } finally {
      client.release();
    }
  });

  return router;
}
