// api/users.js
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const result = await sql`SELECT * FROM users ORDER BY id DESC`;
      return res.status(200).json(result.rows);
    }

    if (req.method === 'POST') {
      const { name, email } = req.body;
      const result = await sql`
        INSERT INTO users (name, email) VALUES (${name}, ${email}) RETURNING *
      `;
      return res.status(200).json(result.rows[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}