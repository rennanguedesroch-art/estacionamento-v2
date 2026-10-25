module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Método não permitido.' });
    return;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    res.status(503).json({ error: 'Configuração do cadastro indisponível.' });
    return;
  }

  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  res.status(200).json({ url, key });
};

