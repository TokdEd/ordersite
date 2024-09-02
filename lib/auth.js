import { kv } from '@vercel/kv';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

export async function login(id, password) {
  if (id >= 1 && id <= 35 && password === `31014${id}`) {
    const user = { id, isAdmin: id === '2' };
    await kv.set(`user:${id}`, user);
    return user;
  }
  return null;
}

export async function getUser(req) {
  const userId = getCookie('user', { req });
  if (userId) {
    return await kv.get(`user:${userId}`);
  }
  return null;
}

export function setUserCookie(res, user) {
  setCookie('user', user.id, { res, maxAge: 60 * 60 * 24 });
}

export function clearUserCookie(res) {
  deleteCookie('user', { res });
}