'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Admin() {
  const [vagas, setVagas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  async function carregarVagas() {
    const { data, error } = await supabase.from('vagas').select('*').order('numero');
    if (!error && data) setVagas(data);
    setCarregando(false);
  }

  useEffect(() => {
    carregarVagas();
  }, []);

  async function alternarStatus(vaga) {
    const novoStatus = vaga.status === 'livre' ? 'ocupada' : 'livre';
    await supabase.from('vagas').update({ status: novoStatus }).eq('id', vaga.id);
    carregarVagas();
  }

  const livres = vagas.filter((v) => v.status === 'livre').length;

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <div className="road-divider w-16 mb-8" />
      <h1 className="font-display text-2xl uppercase mb-2">Painel do estacionamento</h1>
      <p className="text-chalk/60 text-sm mb-10">Clique em uma vaga para marcar como ocupada ou livre.</p>

      {carregando ? (
        <p className="text-chalk/50 font-mono text-sm">Carregando...</p>
      ) : vagas.length === 0 ? (
        <p className="text-chalk/50 font-mono text-sm max-w-md">
          Nenhuma vaga encontrada. Configure o Supabase e rode o script em supabase/schema.sql.
        </p>
      ) : (
        <>
          <p className="font-mono text-sm text-chalk/60 mb-6">{livres} de {vagas.length} vagas livres</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {vagas.map((v) => (
              <button
                key={v.id}
                onClick={() => alternarStatus(v)}
                className={`aspect-square rounded-sm font-mono text-sm font-bold border transition-colors ${
                  v.status === 'livre'
                    ? 'border-asphalt-line text-chalk/70 hover:border-signal'
                    : 'bg-signal text-asphalt border-signal'
                }`}
              >
                {v.numero}
              </button>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
