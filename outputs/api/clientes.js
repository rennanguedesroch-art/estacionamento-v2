const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.send(JSON.stringify(body));
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Método não permitido.' });
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return json(res, 503, { error: 'Cadastro temporariamente indisponível.' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  if (typeof body.website === 'string' && body.website.trim()) return json(res, 200, { ok: true });

  const nome = typeof body.nome === 'string' ? body.nome.trim() : '';
  const telefone = typeof body.telefone === 'string' ? body.telefone.trim() : '';
  const veiculo = typeof body.veiculo === 'string' ? body.veiculo.trim() : '';
  const placa = typeof body.placa === 'string' ? body.placa.trim().toUpperCase().replace(/[\s-]/g, '') : '';
  const interesse = typeof body.interesse === 'string' ? body.interesse : '';
  const allowedInterests = new Set(['estacionamento-avulso', 'mensalista', 'pernoite', 'lava-rapido', 'outro']);
  const digits = telefone.replace(/\D/g, '');

  if (nome.length < 2 || nome.length > 120) return json(res, 400, { error: 'Informe um nome entre 2 e 120 caracteres.' });
  if (digits.length < 10 || digits.length > 13) return json(res, 400, { error: 'Informe um telefone/WhatsApp válido com DDD.' });
  if (veiculo.length > 80) return json(res, 400, { error: 'O campo veículo deve ter até 80 caracteres.' });
  if (placa && !/^[A-Z0-9]{7}$/.test(placa)) return json(res, 400, { error: 'Informe uma placa válida com 7 caracteres.' });
  if (!allowedInterests.has(interesse)) return json(res, 400, { error: 'Selecione um assunto válido.' });
  if (body.consentimento !== true && body.consentimento !== 'on') return json(res, 400, { error: 'É necessário autorizar o uso dos dados para retorno do contato.' });

  const baseUrl = SUPABASE_URL.replace(/\/$/, '');
  try {
    const response = await fetch(`${baseUrl}/rest/v1/site_leads`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({ nome, telefone, placa: placa || null, veiculo: veiculo || null, interesse, consentimento: true })
    });

    if (!response.ok) return json(res, 502, { error: 'Não foi possível salvar seu cadastro agora. Tente novamente mais tarde.' });
    return json(res, 201, { ok: true });
  } catch {
    return json(res, 502, { error: 'Não foi possível conectar ao serviço de cadastro. Tente novamente mais tarde.' });
  }
};


