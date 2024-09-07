import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Order() {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState('');
  const [note, setNote] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchCurrentOrder();
  }, []);

  const fetchCurrentOrder = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        console.log('Fetched order:', data);
        setCurrentOrder(data);
      } else if (res.status === 404) {
        console.log('No current order found');
        setCurrentOrder(null);
      } else {
        console.error('Error fetching order:', await res.text());
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: selectedItem, note }),
      });
      if (res.ok) {
        alert('訂單已提交');
        setSelectedItem('');
        setNote('');
        await fetchCurrentOrder(); // 重新獲取訂單以更新狀態
      } else {
        const errorData = await res.json();
        alert(`提交訂單失敗: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('提交訂單時發生錯誤');
    }
  };

  if (!currentOrder) {
    return <div>目前沒有進行中的訂單</div>;
  }

  const menuItems = currentOrder.menu ? currentOrder.menu.split('\n').filter(item => item.trim() !== '') : [];

  return (
    <div>
      <h1>{currentOrder.restaurant || '未知餐廳'} 訂單</h1>
      {menuItems.length > 0 ? (
        <form onSubmit={handleOrder}>
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            required
          >
            <option value="">選擇項目</option>
            {menuItems.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="備註"
          />
          <button type="submit">提交訂單</button>
        </form>
      ) : (
        <p>目前沒有可用的菜單項目</p>
      )}
      <button onClick={fetchCurrentOrder}>刷新訂單</button>
    </div>
  );
}
