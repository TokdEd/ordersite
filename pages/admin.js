import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Admin() {
  const [restaurant, setRestaurant] = useState('');
  const [menu, setMenu] = useState('');
  const [currentOrder, setCurrentOrder] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchCurrentOrder();
  }, []);

  const fetchCurrentOrder = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        console.log('Fetched order:', data); // 添加日誌
        setCurrentOrder(data);
      } else if (res.status === 404) {
        setCurrentOrder(null);
      } else {
        console.error('Failed to fetch order:', await res.text());
      }
    } catch (error) {
      console.error('Error fetching current order:', error);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurant, menu }),
      });
      if (res.ok) {
        console.log('Order created successfully');
        setRestaurant('');
        setMenu('');
        fetchCurrentOrder();
      } else {
        console.error('Failed to create order:', await res.text());
      }
    } catch (error) {
      console.error('Error creating order:', error);
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
      <h2>菜單:</h2>
      <pre>{currentOrder.menu}</pre>
      {/* 這裡可以添加顯示訂單項目的代碼 */}
    </div>
  );
}