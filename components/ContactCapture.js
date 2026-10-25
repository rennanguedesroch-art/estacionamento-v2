'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const INTERESSES = [
  ['estacionamento-avulso', 'Estacionamento avulso'],
  ['mensalista', 'Plano mensalista'],
  ['pernoite', 'Pernoite'],
  ['lava-rapido', 'Lava-rápido'],
  ['outro', 'Outro assunto'],
];

export default function ContactCapture() {
  const [form, setForm] = useState({ nome: '', telefone: '', veiculo: '', interesse: '' });
  const [status, setStatus] = useState({ tipo: '', texto: '' });
  const [enviando, setEnviando] = useState(false);

  function atualizar(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  }

  async function enviar(event) {
    event.preventDefault();
    setStatus({ tipo: '', texto: '' });

    const nome = form.nome.trim();
    const telefone = form.telefone.trim();
    const digitos = telefone.replace(/\\D/g, '');

    if (nome.length < 2) {
      setStatus({ tipo: 'erro', texto: 'Informe seu nome completo.' });
      return;
    }
    if (digitos.length < 10 || digitos.length > 13) {
      setStatus({ tipo: 'erro', texto: 'Informe um WhatsApp válido com DDD.' });
      return;
    }

    setEnviando(true);
    const { error } = await supabase.from('site_leads').insert({
      nome,
      telefone,
      veiculo: form.veiculo.trim() || null,
      interesse: form.interesse,
      consentimento: true,
    });
    setEnviando(false);

    if (error) {
      setStatus({ tipo: 'erro', texto: 'Não foi possível enviar agora. Tente novamente ou fale conosco pelo WhatsApp.' });
      return;
    }

    setForm({ nome: '', telefone: '', veiculo: '', interesse: '' });
    setStatus({ tipo: 'sucesso', texto: 'Recebemos seu contato. A equipe do Valent poderá falar com você pelo WhatsApp.' });
  }

  const campo = 'w-full min-h-12 bg-asphalt-soft border border-asphalt-line rounded-sm px-4 py-3 text-chalk focus:border-signal outline-none';

  return (
    <div className="border border-asphalt-line bg-asphalt p-6 md:p-8">
      <form onSubmit={enviar} className="space-y-4">
        <div>
          <label htmlFor="lead-nome" className="block text-xs font-mono uppercase text-chalk/60 mb-2">Nome completo *</label>
          <input id="lead-nome" name="nome" autoComplete="name" maxLength={120} required value={form.nome}
            onChange={(event) => atualizar('nome', event.target.value)} className={campo} />
        </div>
        <div>
          <label htmlFor="lead-telefone" className="block text-xs font-mono uppercase text-chalk/60 mb-2">WhatsApp com DDD *</label>
          <input id="lead-telefone" name="telefone" type="tel" inputMode="tel" autoComplete="tel" maxLength={24}
            placeholder="(11) 99999-9999" required value={form.telefone}
            onChange={(event) => atualizar('telefone', event.target.value)} className={campo} />
        </div>
        <div>
          <label htmlFor="lead-veiculo" className="block text-xs font-mono uppercase text-chalk/60 mb-2">Veículo (opcional)</label>
          <input id="lead-veiculo" name="veiculo" maxLength={80} placeholder="Ex.: carro, moto ou SUV"
            value={form.veiculo} onChange={(event) => atualizar('veiculo', event.target.value)} className={campo} />
        </div>
        <div>
          <label htmlFor="lead-interesse" className="block text-xs font-mono uppercase text-chalk/60 mb-2">Tenho interesse em *</label>
          <select id="lead-interesse" name="interesse" required value={form.interesse}
            onChange={(event) => atualizar('interesse', event.target.value)} className={campo}>
            <option value="" disabled>Selecione uma opção</option>
            {INTERESSES.map(([valor, rotulo]) => <option key={valor} value={valor}>{rotulo}</option>)}
          </select>
        </div>
        <label className="flex items-start gap-3 text-xs leading-relaxed text-chalk/60">
          <input type="checkbox" required className="mt-0.5 h-5 w-5 accent-signal shrink-0" />
          <span>Autorizo o Valent Estacionamentos a usar estes dados para responder ao meu contato. *</span>
        </label>
        {status.texto && (
          <p role="status" aria-live="polite" className={status.tipo === 'sucesso' ? 'text-sm text-signal' : 'text-sm text-red-400'}>
            {status.texto}
          </p>
        )}
        <button type="submit" disabled={enviando}
          className="w-full min-h-12 bg-signal text-asphalt font-bold px-5 py-3 rounded-sm hover:bg-signal-bright transition-colors disabled:opacity-50">
          {enviando ? 'Enviando...' : 'Enviar cadastro'}
        </button>
      </form>
    </div>
  );
}
