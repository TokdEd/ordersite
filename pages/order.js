import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Order() {
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
        setCurrentOrder(data);
      } else {
        console.error('Failed to fetch order');
      }
    } catch (error) {
      console.error('Error fetching current order:', error);
    }
  };

  if (!currentOrder) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>當前訂單</h1>
      <p>餐廳: {currentOrder.restaurant}</p>
      <h2>菜單:</h2>
      <pre>{currentOrder.menu}</pre>
      {/* 添加訂單表單等其他內容 */}
    </div>
  );
}