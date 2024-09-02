import { kv } from '@vercel/kv';

export async function createOrder(restaurant, menu) {
  const orderId = Date.now().toString();
  await kv.set(`order:${orderId}`, { restaurant, menu, items: [] });
  await kv.set('currentOrder', orderId);
  return orderId;
}

export async function getCurrentOrder() {
  const orderId = await kv.get('currentOrder');
  if (orderId) {
    return await kv.get(`order:${orderId}`);
  }
  return null;
}

export async function addOrderItem(userId, item) {
  const orderId = await kv.get('currentOrder');
  if (orderId) {
    await kv.lpush(`order:${orderId}:items`, JSON.stringify({ userId, ...item }));
    return true;
  }
  return false;
}

export async function getOrderItems() {
  const orderId = await kv.get('currentOrder');
  if (orderId) {
    const items = await kv.lrange(`order:${orderId}:items`, 0, -1);
    return items.map(item => JSON.parse(item));
  }
  return [];
}

export async function endOrder() {
  const orderId = await kv.get('currentOrder');
  if (orderId) {
    const order = await kv.get(`order:${orderId}`);
    const items = await getOrderItems();
    await kv.lpush('orderHistory', JSON.stringify({ ...order, items, endTime: Date.now() }));
    await kv.del(`order:${orderId}`);
    await kv.del(`order:${orderId}:items`);
    await kv.del('currentOrder');
    return true;
  }
  return false;
}

export async function getOrderHistory() {
  return await kv.lrange('orderHistory', 0, -1);
}