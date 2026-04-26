import { Router } from 'express';

export default function ordersRouter(db) {
  const router = Router();

  router.post('/', async (req, res) => {
    try {
      const { customer_name, phone, address, note, items } = req.body;
      if (!customer_name || !phone || !address || !items?.length) {
        return res.status(400).json({ error: 'Thiếu thông tin đặt hàng' });
      }
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const orderId = await db.transaction(async (tx) => {
        const { lastId } = await tx.run(
          'INSERT INTO orders (customer_name,phone,address,note,total) VALUES (?,?,?,?,?)',
          [customer_name, phone, address, note || null, total]
        );
        for (const item of items) {
          await tx.run(
            'INSERT INTO order_items (order_id,product_id,product_name,quantity,price) VALUES (?,?,?,?,?)',
            [lastId, item.product_id || null, item.product_name, item.quantity, item.price]
          );
        }
        return lastId;
      });

      res.json({ success: true, orderId, total });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
