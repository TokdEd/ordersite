import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  const { id } = req.query;
  if (id) {
    const user = await kv.get(`user:${id}`);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } else {
    res.status(400).json({ message: 'Missing user id' });
  }
}
