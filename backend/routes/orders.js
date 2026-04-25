import { Router } from 'express';

export default function ordersRouter(db) {
  const router = Router();

  router.post('/', (req, res) => {
    try {
      const { customer_name, phone, address, note, items } = req.body;
      if (!customer_name || !phone || !address || !items?.length) {
        return res.status(400).json({ error: 'Thiếu thông tin đặt hàng' });
      }
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const createOrder = db.transaction(() => {
        const { lastInsertRowid: orderId } = db.prepare(
          'INSERT INTO orders (customer_name,phone,address,note,total) VALUES (?,?,?,?,?)'
        ).run(customer_name, phone, address, note || null, total);

        const insertItem = db.prepare(
          'INSERT INTO order_items (order_id,product_id,product_name,quantity,price) VALUES (?,?,?,?,?)'
        );
        for (const item of items) {
          insertItem.run(orderId, item.product_id || null, item.product_name, item.quantity, item.price);
        }
        return orderId;
      });

      const orderId = createOrder();
      res.json({ success: true, orderId, total });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
