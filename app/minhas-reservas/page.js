'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function MinhasReservas() {
  const [usuario, setUsuario] = useState(undefined);
  const [reservas, setReservas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  async function carregar(userId) {
    setCarregando(true);
    const { data } = await supabase
      .from('reservas')
      .select('*')
      .eq('perfil_id', userId)
      .order('entrada', { ascending: false });
    setReservas(data || []);
    setCarregando(false);
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUsuario(data.user ?? null);
      if (data.user) carregar(data.user.id);
      else setCarregando(false);
    });
  }, []);

  async function cancelar(id) {
    await supabase.from('reservas').update({ status: 'cancelada' }).eq('id', id);
    if (usuario) carregar(usuario.id);
  }

  if (usuario === null) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-chalk/70 mb-4">Você precisa entrar na sua conta para ver suas reservas.</p>
          <Link href="/login" className="text-signal underline">Entrar</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <div className="road-divider w-16 mb-8" />
      <h1 className="font-display text-2xl uppercase mb-2">Minhas reservas</h1>
      <p className="text-chalk/60 text-sm mb-10">Histórico de reservas feitas na sua conta.</p>

      {carregando ? (
        <p className="text-chalk/50 font-mono text-sm">Carregando...</p>
      ) : reservas.length === 0 ? (
        <div>
          <p className="text-chalk/50 font-mono text-sm mb-4">Você ainda não tem reservas.</p>
          <Link href="/reservar" className="text-signal underline text-sm">Fazer uma reserva</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reservas.map((r) => (
            <div key={r.id} className="border border-asphalt-line rounded-sm p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="font-display text-sm uppercase capitalize">{r.tipo_veiculo}</span>
                <span
                  className={`text-xs font-mono px-2 py-1 rounded-sm ${
                    r.status === 'ativa'
                      ? 'bg-signal/10 text-signal'
                      : r.status === 'cancelada'
                      ? 'bg-red-400/10 text-red-400'
                      : 'bg-asphalt-line text-chalk/50'
                  }`}
                >
                  {r.status}
                </span>
              </div>
              <p className="text-sm text-chalk/70 font-mono">
                {new Date(r.entrada).toLocaleString('pt-BR')} → {new Date(r.saida).toLocaleString('pt-BR')}
              </p>
              <p className="text-sm text-chalk/50 mt-1">Placa: {r.placa} · R$ {Number(r.valor).toFixed(2)}</p>
              {r.status === 'ativa' && (
                <button
                  onClick={() => cancelar(r.id)}
                  className="mt-3 text-xs text-red-400 underline"
                >
                  Cancelar reserva
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
