import { Router } from 'express';

export default function ordersRouter(db) {
  const router = Router();

  router.post('/', (req, res) => {
    const { customer_name, phone, address, note, items } = req.body;
    if (!customer_name || !phone || !address || !items?.length) {
      return res.status(400).json({ error: 'Thiếu thông tin đặt hàng' });
    }
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = db.prepare('INSERT INTO orders (customer_name,phone,address,note,total) VALUES (?,?,?,?,?)').run(customer_name, phone, address, note, total);
    const orderId = order.lastInsertRowid;
    const insertItem = db.prepare('INSERT INTO order_items (order_id,product_id,product_name,quantity,price) VALUES (?,?,?,?,?)');
    for (const item of items) {
      insertItem.run(orderId, item.product_id, item.product_name, item.quantity, item.price);
    }
    res.json({ success: true, orderId, total });
  });

  return router;
}
