import { useState } from 'react';

export default function LoginForm({ onLogin }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password }),
    });
    if (res.ok) {
      const { user } = await res.json();
      onLogin(user);
    } else {
      alert('登錄失敗');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="ID"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="密碼"
        required
      />
      <button type="submit">登錄</button>
    </form>
  );
}