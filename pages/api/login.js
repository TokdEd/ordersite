import { login } from '../../lib/auth';
import { setCookie } from 'cookies-next';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, password } = req.body;
    const user = await login(id, password);
    if (user) {
      setCookie('user', user.id, { req, res, maxAge: 60 * 60 * 24 }); // 設置 cookie，有效期 1 天
      res.status(200).json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: '無效的憑證' });
    }
  } else {
    res.status(405).end();
  }
}
