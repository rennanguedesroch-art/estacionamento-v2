'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { PLANOS, CAPACIDADE } from '@/lib/planos';

function combinarDataHora(data, hora) {
  return new Date(`${data}T${hora}:00`);
}

function intervalosSeSobrepoem(inicioA, fimA, inicioB, fimB) {
  return inicioA < fimB && fimA > inicioB;
}

export default function Reservar() {
  const [usuario, setUsuario] = useState(undefined); // undefined = carregando, null = deslogado
  const [tipoVeiculo, setTipoVeiculo] = useState('carro');
  const [planoId, setPlanoId] = useState(PLANOS.carro[0].id);
  const [data, setData] = useState('');
  const [horaInicio, setHoraInicio] = useState('08:00');
  const [placa, setPlaca] = useState('');

  const [verificando, setVerificando] = useState(false);
  const [vagasLivresNoPeriodo, setVagasLivresNoPeriodo] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const planos = PLANOS[tipoVeiculo];
  const plano = planos.find((p) => p.id === planoId) || planos[0];

  useEffect(() => {
    setPlanoId(PLANOS[tipoVeiculo][0].id);
    setVagasLivresNoPeriodo(null);
  }, [tipoVeiculo]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUsuario(data.user ?? null));
  }, []);

  const horarioFim = useMemo(() => {
    if (!data || !horaInicio) return null;
    const inicio = combinarDataHora(data, horaInicio);
    return new Date(inicio.getTime() + plano.horas * 60 * 60 * 1000);
  }, [data, horaInicio, plano]);

  async function verificarDisponibilidade() {
    if (!data || !horaInicio) {
      setMensagem('Escolha a data e o horário de entrada primeiro.');
      return;
    }
    setVerificando(true);
    setMensagem('');
    setVagasLivresNoPeriodo(null);

    const inicioDesejado = combinarDataHora(data, horaInicio);
    const fimDesejado = horarioFim;

    // Busca reservas ativas do mesmo tipo de veículo num raio de 2 dias
    // (suficiente para cobrir qualquer sobreposição possível com planos de até 12h)
    const janelaInicio = new Date(inicioDesejado.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const janelaFim = new Date(fimDesejado.getTime() + 24 * 60 * 60 * 1000).toISOString();

    const { data: reservas, error } = await supabase
      .from('reservas_disponibilidade')
      .select('entrada, saida')
      .eq('tipo_veiculo', tipoVeiculo)
      .gte('entrada', janelaInicio)
      .lte('entrada', janelaFim);

    setVerificando(false);

    if (error) {
      setMensagem(`Não foi possível verificar disponibilidade agora (${error.message}).`);
      return;
    }

    const sobrepostas = (reservas || []).filter((r) =>
      intervalosSeSobrepoem(inicioDesejado, fimDesejado, new Date(r.entrada), new Date(r.saida))
    ).length;

    const capacidade = CAPACIDADE[tipoVeiculo];
    setVagasLivresNoPeriodo(Math.max(capacidade - sobrepostas, 0));
  }

  async function handleReservar(e) {
    e.preventDefault();
    setMensagem('');

    if (!usuario) {
      setMensagem('Você precisa entrar na sua conta para reservar. Faça login ou cadastre-se.');
      return;
    }
    if (vagasLivresNoPeriodo === null) {
      setMensagem('Verifique a disponibilidade antes de confirmar a reserva.');
      return;
    }
    if (vagasLivresNoPeriodo <= 0) {
      setMensagem('Sem vagas disponíveis nesse horário. Tente outro período.');
      return;
    }
    if (!placa.trim()) {
      setMensagem('Informe a placa do veículo.');
      return;
    }

    setEnviando(true);
    const inicio = combinarDataHora(data, horaInicio);
    const fim = horarioFim;

    const { error } = await supabase.from('reservas').insert({
      perfil_id: usuario.id,
      tipo_veiculo: tipoVeiculo,
      placa: placa.trim().toUpperCase(),
      entrada: inicio.toISOString(),
      saida: fim.toISOString(),
      valor: plano.valor,
      status: 'ativa',
    });

    setEnviando(false);

    if (error) {
      setMensagem(`Não foi possível confirmar a reserva (${error.message}).`);
      return;
    }

    setSucesso(true);
    setMensagem(
      `Vaga reservada! Entrada em ${inicio.toLocaleString('pt-BR')}, saída prevista ${fim.toLocaleString('pt-BR')}.`
    );
  }

  const hoje = new Date().toISOString().split('T')[0];

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="max-w-lg mx-auto">
        <div className="road-divider w-16 mb-8" />
        <h1 className="font-display text-2xl uppercase mb-2">Reservar vaga</h1>
        <p className="text-chalk/60 text-sm mb-10">
          Escolha o tipo de veículo, data e período. A disponibilidade é calculada na hora.
        </p>

        {usuario === null && (
          <div className="border border-signal/40 bg-signal/5 rounded-sm p-4 mb-8 text-sm">
            Você precisa estar logado para reservar.{' '}
            <Link href="/login" className="text-signal underline">Entrar</Link>{' '}
            ou{' '}
            <Link href="/cadastro" className="text-signal underline">criar conta</Link>.
          </div>
        )}

        {sucesso ? (
          <div className="border border-signal/40 bg-signal/5 rounded-sm p-6">
            <p className="text-signal font-medium mb-4">{mensagem}</p>
            <Link href="/minhas-reservas" className="text-sm underline text-chalk/80">
              Ver minhas reservas
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReservar} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase text-chalk/50 mb-2">Tipo de veículo</label>
              <div className="grid grid-cols-2 gap-3">
                {['carro', 'moto'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTipoVeiculo(t)}
                    className={`py-3 rounded-sm border text-sm font-medium capitalize transition-colors ${
                      tipoVeiculo === t
                        ? 'border-signal bg-signal/10 text-signal'
                        : 'border-asphalt-line text-chalk/60 hover:border-chalk/30'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-chalk/50 mb-2">Plano / período</label>
              <div className="space-y-2">
                {planos.map((p) => (
                  <label
                    key={p.id}
                    className={`flex items-center justify-between px-4 py-3 rounded-sm border cursor-pointer transition-colors ${
                      planoId === p.id ? 'border-signal bg-signal/10' : 'border-asphalt-line'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="plano"
                        checked={planoId === p.id}
                        onChange={() => setPlanoId(p.id)}
                        className="accent-signal"
                      />
                      {p.label}
                    </span>
                    <span className="font-mono text-signal">R$ {p.valor.toFixed(2)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-chalk/50 mb-2">Data</label>
                <input
                  type="date"
                  required
                  min={hoje}
                  value={data}
                  onChange={(e) => {
                    setData(e.target.value);
                    setVagasLivresNoPeriodo(null);
                  }}
                  className="w-full bg-asphalt-soft border border-asphalt-line rounded-sm px-4 py-3 text-chalk focus:border-signal outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-chalk/50 mb-2">Entrada</label>
                <input
                  type="time"
                  required
                  value={horaInicio}
                  onChange={(e) => {
                    setHoraInicio(e.target.value);
                    setVagasLivresNoPeriodo(null);
                  }}
                  className="w-full bg-asphalt-soft border border-asphalt-line rounded-sm px-4 py-3 text-chalk focus:border-signal outline-none"
                />
              </div>
            </div>

            {horarioFim && (
              <p className="text-xs text-chalk/40 font-mono">
                Saída prevista: {horarioFim.toLocaleString('pt-BR')}
              </p>
            )}

            <div>
              <label className="block text-xs font-mono uppercase text-chalk/50 mb-2">Placa do veículo</label>
              <input
                type="text"
                required
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
                placeholder="ABC1D23"
                className="w-full bg-asphalt-soft border border-asphalt-line rounded-sm px-4 py-3 text-chalk focus:border-signal outline-none uppercase"
              />
            </div>

            <button
              type="button"
              onClick={verificarDisponibilidade}
              disabled={verificando}
              className="w-full border border-asphalt-line py-3 rounded-sm text-sm hover:border-signal transition-colors disabled:opacity-50"
            >
              {verificando ? 'Verificando...' : 'Verificar disponibilidade'}
            </button>

            {vagasLivresNoPeriodo !== null && (
              <p className={`text-sm ${vagasLivresNoPeriodo > 0 ? 'text-signal' : 'text-red-400'}`}>
                {vagasLivresNoPeriodo > 0
                  ? `${vagasLivresNoPeriodo} vaga(s) disponível(is) nesse horário.`
                  : 'Sem vagas disponíveis nesse horário.'}
              </p>
            )}

            {mensagem && !sucesso && <p className="text-sm text-red-400">{mensagem}</p>}

            <button
              type="submit"
              disabled={enviando || !usuario}
              className="w-full bg-signal text-asphalt font-bold py-3 rounded-sm hover:bg-signal-bright transition-colors disabled:opacity-50"
            >
              {enviando ? 'Confirmando...' : `Confirmar reserva — R$ ${plano.valor.toFixed(2)}`}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
