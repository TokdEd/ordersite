import { kv } from '@vercel/kv';
import { getUser } from '../../lib/auth';

export default async function handler(req, res) {
  console.log('Received request:', req.method, req.url);
  try {
    const user = await getUser(req);
    console.log('User:', user);

    if (!user) {
      return res.status(401).json({ message: '未授權' });
    }

    if (req.method === 'GET') {
      const currentOrderId = await kv.get('currentOrder');
      if (currentOrderId) {
        const order = await kv.get(`order:${currentOrderId}`);
        if (order) {
          const items = await kv.lrange(`order:${currentOrderId}:items`, 0, -1);
          order.items = items.map(item => {
            try {
              return typeof item === 'string' ? JSON.parse(item) : item;
            } catch (error) {
              console.error('Error parsing item:', item);
              return item;
            }
          });
          console.log('Fetched order:', order);
          return res.status(200).json(order);
        }
      }
      console.log('No current order found');
      return res.status(404).json({ message: '沒有進行中的訂單' });
    } 
    else if (req.method === 'POST') {
      if (user.isAdmin) {
        // 管理員創建新訂單
        const { restaurant, menu } = req.body;
        if (!restaurant || !menu) {
          return res.status(400).json({ message: '餐廳名稱和菜單都是必須的' });
        }
        const orderId = Date.now().toString();
        const newOrder = { restaurant, menu, items: [] };
        await kv.set(`order:${orderId}`, newOrder);
        await kv.set('currentOrder', orderId);
        console.log('Created new order:', newOrder);
        return res.status(200).json({ message: '訂單已創建', order: newOrder });
      } else {
        // 普通用戶下單
        const { item, note } = req.body;
        const currentOrderId = await kv.get('currentOrder');
        if (currentOrderId) {
          const newItem = { userId: user.id, item, note };
          await kv.rpush(`order:${currentOrderId}:items`, JSON.stringify(newItem));
          console.log('Added new item to order:', newItem);
          
          // 獲取更新後的訂單數據
          const updatedOrder = await kv.get(`order:${currentOrderId}`);
          const items = await kv.lrange(`order:${currentOrderId}:items`, 0, -1);
          updatedOrder.items = items.map(item => {
            try {
              return typeof item === 'string' ? JSON.parse(item) : item;
            } catch (error) {
              console.error('Error parsing item:', item);
              return item;
            }
          });
          
          return res.status(200).json({ message: '訂單已提交', order: updatedOrder });
        } else {
          return res.status(404).json({ message: '沒有進行中的訂單' });
        }
      }
    } 
    else if (req.method === 'PUT') {
      if (user.isAdmin) {
        // 結束訂單
        const currentOrderId = await kv.get('currentOrder');
        if (currentOrderId) {
          await kv.del('currentOrder');
          console.log('Ended order:', currentOrderId);
          return res.status(200).json({ message: '訂單已結束' });
        } else {
          return res.status(404).json({ message: '沒有進行中的訂單' });
        }
      } else {
        return res.status(403).json({ message: '只有管理員可以結束訂單' });
      }
    } 
    else {
      return res.status(405).json({ message: '方法不允許' });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ message: '服務器錯誤', error: error.message });
  }
}