import { getUser } from '../../lib/auth';
import { createOrder, getCurrentOrder, addOrderItem, getOrderItems, endOrder } from '../../lib/db';

export default async function handler(req, res) {
  const user = await getUser(req);
  if (!user) {
    return res.status(401).json({ message: '未授權' });
  }

  if (req.method === 'POST') {
    if (user.isAdmin) {
      const { restaurant, menu } = req.body;
      const orderId = await createOrder(restaurant, menu);
      res.status(200).json({ orderId });
    } else {
      const item = req.body;
      const success = await addOrderItem(user.id, item);
      if (success) {
        res.status(200).json({ message: '訂單已添加' });
      } else {
        res.status(400).json({ message: '無法添加訂單' });
      }
    }
  } else if (req.method === 'GET') {
    const order = await getCurrentOrder();
    const items = await getOrderItems();
    res.status(200).json({ order, items });
  } else if (req.method === 'PUT' && user.isAdmin) {
    const success = await endOrder();
    if (success) {
      res.status(200).json({ message: '訂單已結束' });
    } else {
      res.status(400).json({ message: '無法結束訂單' });
    }
  } else {
    res.status(405).end();
  }
}