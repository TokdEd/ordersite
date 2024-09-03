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
        setCurrentOrder(data);
      } else if (res.status === 404) {
        setCurrentOrder(null);
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
        const data = await res.json();
        alert('訂單已提交');
        setSelectedItem('');
        setNote('');
        setCurrentOrder(data.order);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  if (!currentOrder) {
    return <div>目前沒有進行中的訂單</div>;
  }

  return (
    <div>
      <h1>{currentOrder.restaurant} 訂單</h1>
      <form onSubmit={handleOrder}>
        <select
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
          required
        >
          <option value="">選擇項目</option>
          {currentOrder.menu.split('\n').map((item, index) => (
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
    </div>
  );
}