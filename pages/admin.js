import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Admin() {
  const [restaurant, setRestaurant] = useState('');
  const [menu, setMenu] = useState('');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchCurrentOrder();
  }, []);

  const fetchCurrentOrder = async () => {
    const res = await fetch('/api/orders');
    if (res.ok) {
      const data = await res.json();
      setCurrentOrder(data.order);
      setOrderItems(data.items);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restaurant, menu }),
    });
    if (res.ok) {
      fetchCurrentOrder();
    }
  };

  const handleEndOrder = async () => {
    const res = await fetch('/api/orders', { method: 'PUT' });
    if (res.ok) {
      setCurrentOrder(null);
      setOrderItems([]);
    }
  };

  if (!currentOrder) {
    return (
      <div>
        <h1>創建新訂單</h1>
        <form onSubmit={handleCreateOrder}>
          <input
            type="text"
            value={restaurant}
            onChange={(e) => setRestaurant(e.target.value)}
            placeholder="餐廳名稱"
            required
          />
          <textarea
            value={menu}
            onChange={(e) => setMenu(e.target.value)}
            placeholder="菜單 (每行一個項目)"
            required
          />
          <button type="submit">創建訂單</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1>當前訂單</h1>
      <p>餐廳: {currentOrder.restaurant}</p>
      <h2>訂單項目:</h2>
      <ul>
        {orderItems.map((item, index) => (
          <li key={index}>
            用戶 {item.userId}: {item.name} - {item.price}元
            (甜度: {item.sweetness}, 冰塊: {item.ice})
          </li>
        ))}
      </ul>
      <button onClick={handleEndOrder}>結束訂單</button>
    </div>
  );
}