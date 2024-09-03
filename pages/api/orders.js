import { kv } from '@vercel/kv';
import { getUser } from '../../lib/auth';

export default async function handler(req, res) {
  const user = await getUser(req);

  if (!user) {
    return res.status(401).json({ message: '未授權' });
  }

  if (req.method === 'GET') {
    try {
      const currentOrderId = await kv.get('currentOrder');
      if (currentOrderId) {
        const order = await kv.get(`order:${currentOrderId}`);
        const items = await kv.lrange(`order:${currentOrderId}:items`, 0, -1);
        order.items = items.map(item => JSON.parse(item));
        res.status(200).json(order);
      } else {
        res.status(404).json({ message: '沒有進行中的訂單' });
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ message: '獲取訂單時出錯' });
    }
  } else if (req.method === 'POST') {
    if (user.isAdmin) {
      // 管理員創建新訂單
      const { restaurant, menu } = req.body;
      const orderId = Date.now().toString();
      await kv.set(`order:${orderId}`, { restaurant, menu, items: [] });
      await kv.set('currentOrder', orderId);
      res.status(200).json({ message: '訂單已創建' });
    } else {
      // 普通用戶下單
      const { item, note } = req.body;
      const currentOrderId = await kv.get('currentOrder');
      if (currentOrderId) {
        await kv.rpush(`order:${currentOrderId}:items`, JSON.stringify({ userId: user.id, item, note }));
        // 獲取更新後的訂單信息
        const updatedOrder = await kv.get(`order:${currentOrderId}`);
        const items = await kv.lrange(`order:${currentOrderId}:items`, 0, -1);
        updatedOrder.items = items.map(item => JSON.parse(item));
        res.status(200).json({ message: '訂單已提交', order: updatedOrder });
      } else {
        res.status(404).json({ message: '沒有進行中的訂單' });
      }
    }
  } else if (req.method === 'PUT' && user.isAdmin) {
    // 結束訂單
    const currentOrderId = await kv.get('currentOrder');
    if (currentOrderId) {
      await kv.del('currentOrder');
      res.status(200).json({ message: '訂單已結束' });
    } else {
      res.status(404).json({ message: '沒有進行中的訂單' });
    }
  } else {
    res.status(405).end();
  }
}