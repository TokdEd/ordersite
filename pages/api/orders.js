// pages/api/orders.js
import { kv } from '@vercel/kv';
import { getUser } from '../../lib/auth';

export default async function handler(req, res) {
  try {
    const user = await getUser(req);

    if (!user) {
      return res.status(401).json({ message: '未授權' });
    }

    if (req.method === 'GET') {
      const currentOrderId = await kv.get('currentOrder');
      if (currentOrderId) {
        const order = await kv.get(`order:${currentOrderId}`);
        return res.status(200).json(order);
      } else {
        return res.status(404).json({ message: '沒有進行中的訂單' });
      }
    } else if (req.method === 'POST' && user.isAdmin) {
      const { restaurant, menu } = req.body;
      const orderId = Date.now().toString();
      await kv.set(`order:${orderId}`, { restaurant, menu, items: [] });
      await kv.set('currentOrder', orderId);
      return res.status(200).json({ orderId, message: '訂單已創建' });
    } else if (req.method === 'PUT' && user.isAdmin) {
      // 處理結束訂單的邏輯
      const currentOrderId = await kv.get('currentOrder');
      if (currentOrderId) {
        await kv.del(`order:${currentOrderId}`);
        await kv.del('currentOrder');
        return res.status(200).json({ message: '訂單已結束' });
      } else {
        return res.status(404).json({ message: '沒有進行中的訂單可結束' });
      }
    } else {
      return res.status(405).json({ message: '方法不允許' });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ message: '服務器錯誤' });
  }
}