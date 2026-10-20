'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setCarregando(true);
    setMensagem('');
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setCarregando(false);
    setMensagem(error ? 'E-mail ou senha inválidos.' : 'Login realizado!');
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="road-divider w-16 mb-8" />
        <h1 className="font-display text-2xl uppercase mb-2">Área do cliente</h1>
        <p className="text-chalk/60 text-sm mb-10">Entre para reservar sua vaga e ver seu histórico.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-chalk/50 mb-2">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-asphalt-soft border border-asphalt-line rounded-sm px-4 py-3 text-chalk focus:border-signal outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-chalk/50 mb-2">Senha</label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full bg-asphalt-soft border border-asphalt-line rounded-sm px-4 py-3 text-chalk focus:border-signal outline-none"
            />
          </div>

          {mensagem && <p className="text-sm text-signal">{mensagem}</p>}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-signal text-asphalt font-bold py-3 rounded-sm hover:bg-signal-bright transition-colors disabled:opacity-50"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-sm text-chalk/50 mt-6">
          Ainda não tem conta?{' '}
          <Link href="/cadastro" className="text-signal hover:text-signal-bright">Cadastre-se</Link>
        </p>
      </div>
    </main>
  );
}
