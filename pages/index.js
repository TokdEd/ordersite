import { useState } from 'react';
import { useRouter } from 'next/router';
import LoginForm from '../components/LoginForm';

export default function Home() {
  const router = useRouter();

  const handleLogin = async (user) => {
    if (user.isAdmin) {
      router.push('/admin');
    } else {
      router.push('/order');
    }
  };

  return (
    <div>
      <h1>訂餐系統登錄</h1>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}