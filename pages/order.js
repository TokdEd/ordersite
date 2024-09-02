import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Order() {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [selectedItem, setSelectedItem] = useState('');
  const [sweetness, setSweetness] = useState('正常');
  const [ice, setIce] = useState('正常');
  const router = useRouter();

  useEffect(() => {
    fetchCurrentOrder();
  }, []);

  const fetchCurrentOrder = async () => {
    const res = await fetch('/api/orders');
    if (res.ok) {
      const data = await res.json();
      setCurrentOrder(data.order);
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    const [name, price] = selectedItem.split(' - ');
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price: parseInt(price), sweetness, ice }),
    });
    if (res.ok) {
      alert('訂單已提交');
      setSelectedItem('');
      setSweetness('正常');
      setIce('正常');
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
        <select value={sweetness} onChange={(e) => setSweetness(e.target.value)}>
          <option>無糖</option>
          <option>微糖</option>
          <option>半糖</option>
          <option>少糖</option>
          <option>正常</option>
        </select>
        <select value={ice} onChange={(e) => setIce(e.target.value)}>
          <option>去冰</option>
          <option>微冰</option>
          <option>少冰</option>
          <option>正常冰</option>
        </select>
        <button type="submit">提交訂單</button>
      </form>
    </div>
  );
}