import { useState } from 'react';

export default function LoginForm({ onLogin }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, password }),
      });
      const data = await res.json();
      if (data.success) {
        console.log('Login successful:', data.user);
        onLogin(data.user);
      } else {
        console.error('Login failed:', data.message);
        alert('登入失敗：' + data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('登入過程中出現錯誤');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
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
      <button type="submit">登入</button>
    </form>
  );
}