import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Admin() {
  const [restaurant, setRestaurant] = useState('');
  const [menu, setMenu] = useState('');
  const [currentOrder, setCurrentOrder] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchCurrentOrder();
    //const interval = setInterval(fetchCurrentOrder, 5000); // 每5秒刷新一次
    //return () => clearInterval(interval);
  }, []);

  const fetchCurrentOrder = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setCurrentOrder(data);
      } else if (res.status === 404) {
        setCurrentOrder(null);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
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
        await fetchCurrentOrder();
        setRestaurant('');
        setMenu('');
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleEndOrder = async () => {
    try {
      console.log('Sending request to end order');
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const data = await res.json();
      console.log('Response:', res.status, data);
  
      if (res.ok) {
        alert(data.message);
        setCurrentOrder(null);
      } else {
        console.error('Failed to end order:', data);
        alert(`結束訂單失敗: ${data.message}`);
      }
    } catch (error) {
      console.error('Error ending order:', error);
      alert('結束訂單時發生錯誤');
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
      <h2>用戶訂單:</h2>
      <ul>
        {currentOrder.items && currentOrder.items.map((item, index) => (
          <li key={index}>
            用戶 {item.userId}: {item.item} - 備註: {item.note}
          </li>
        ))}
      </ul>
      <button onClick={handleEndOrder}>結束訂單</button>
    </div>
  );
}