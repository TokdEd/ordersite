import { kv } from '@vercel/kv';
import { getCookie } from 'cookies-next';



export async function login(id, password) {
    if (id >= 1 && id <= 35 && password === `31014${id}`) {
      const user = { id, isAdmin: id === '1' || id === '2' };
      await kv.set(`user:${id}`, user);
      return user;
    }
    return null;
  }
export async function getUser(req) {
  if (typeof window === 'undefined') {
    // 服務器端
    const userId = getCookie('user', { req });
    if (userId) {
      return await kv.get(`user:${userId}`);
    }
  } else {
    // 客戶端
    const userId = getCookie('user');
    if (userId) {
      const res = await fetch(`/api/user?id=${userId}`);
      if (res.ok) {
        return await res.json();
      }
    }
  }
  return null;
}