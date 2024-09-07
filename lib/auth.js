import { kv } from '@vercel/kv';
import { getCookie } from 'cookies-next';

export async function getUser(req) {
  const userId = getCookie('user', { req });
  if (userId) {
    const user = await kv.get(`user:${userId}`);
    return user;
  }
  return null;
}

export async function login(id, password) {
  const numId = parseInt(id, 10);
  const expectedPassword = `31014${numId}`;
  console.log('Login check:', { numId, expectedPassword, providedPassword: password });
  if (numId >= 1 && numId <= 35 && password === expectedPassword) {
    const user = {
      id: numId,
      isAdmin: numId === 27
    };
    await kv.set(`user:${numId}`, user);
    return user;
  }
  return null;
}

export function logout(res) {
  // 清除 cookie
  deleteCookie('user', { res });
}
