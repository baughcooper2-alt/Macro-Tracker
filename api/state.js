const { neon } = require('@neondatabase/serverless');

const CONN =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.NEON_DATABASE_URL ||
  process.env.DATABASE_URL_UNPOOLED;

const KEYS = ['entries', 'phases', 'favs', 'hidden', 'weights'];

module.exports = async (req, res) => {
  if (!CONN) {
    res.status(500).json({ error: 'No database connection string found (DATABASE_URL).' });
    return;
  }
  const sql = neon(CONN);

  try {
    await sql`CREATE TABLE IF NOT EXISTS kv_store (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`;

    if (req.method === 'GET') {
      const rows = await sql`SELECT key, value FROM kv_store WHERE key = ANY(${KEYS})`;
      const out = {};
      rows.forEach(function (r) { out[r.key] = r.value; });
      res.status(200).json(out);
      return;
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) { body = null; }
      }
      const key = body && body.key;
      const value = body ? body.value : undefined;
      if (!KEYS.includes(key) || value === undefined) {
        res.status(400).json({ error: 'body must be { key: one of ' + KEYS.join('/') + ', value }' });
        return;
      }
      await sql`
        INSERT INTO kv_store (key, value, updated_at)
        VALUES (${key}, ${JSON.stringify(value)}::jsonb, now())
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
      `;
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: 'method not allowed' });
  } catch (err) {
    console.error('state api error', err);
    res.status(500).json({ error: 'server error' });
  }
};
