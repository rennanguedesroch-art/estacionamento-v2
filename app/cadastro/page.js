'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Cadastro() {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', senha: '', confirmarSenha: '' });
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  function atualizar(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem('');
    setSucesso(false);

    if (form.senha.length < 6) {
      setMensagem('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (form.senha !== form.confirmarSenha) {
      setMensagem('As senhas não conferem.');
      return;
    }

    setCarregando(true);

    const { data, error: erroAuth } = await supabase.auth.signUp({
      email: form.email,
      password: form.senha,
    });

    if (erroAuth) {
      setCarregando(false);
      setMensagem(traduzErro(erroAuth.message));
      return;
    }
    if (!data.user) {
      setCarregando(false);
      setMensagem('Não foi possível criar a conta. Tente novamente.');
      return;
    }

    const { error: erroPerfil } = await supabase.from('perfis').insert({
      id: data.user.id,
      nome: form.nome,
      telefone: form.telefone,
      tipo: 'cliente',
    });

    setCarregando(false);

    if (erroPerfil) {
      setMensagem(`Conta criada, mas houve um problema ao salvar seus dados (${erroPerfil.message}). Fale com o suporte.`);
      return;
    }

    setSucesso(true);
    setMensagem('Conta criada com sucesso! Verifique seu e-mail para confirmar o cadastro antes de fazer login.');
    setForm({ nome: '', email: '', telefone: '', senha: '', confirmarSenha: '' });
  }

  function traduzErro(msg) {
    if (msg.includes('already registered')) return 'Esse e-mail já está cadastrado. Tente fazer login.';
    if (msg.includes('Password should be')) return 'A senha é muito curta ou fraca.';
    if (msg.includes('Unable to validate email')) return 'Esse e-mail não parece válido.';
    return `Erro ao criar conta: ${msg}`;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="road-divider w-16 mb-8" />
        <h1 className="font-display text-2xl uppercase mb-2">Criar conta</h1>
        <p className="text-chalk/60 text-sm mb-10">Cadastre-se para reservar vagas e virar mensalista.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-chalk/50 mb-2">Nome completo</label>
            <input type="text" required value={form.nome} onChange={(e) => atualizar('nome', e.target.value)}
              className="w-full bg-asphalt-soft border border-asphalt-line rounded-sm px-4 py-3 text-chalk focus:border-signal outline-none" />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-chalk/50 mb-2">E-mail</label>
            <input type="email" required value={form.email} onChange={(e) => atualizar('email', e.target.value)}
              className="w-full bg-asphalt-soft border border-asphalt-line rounded-sm px-4 py-3 text-chalk focus:border-signal outline-none" />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-chalk/50 mb-2">Telefone / WhatsApp</label>
            <input type="tel" required value={form.telefone} onChange={(e) => atualizar('telefone', e.target.value)} placeholder="(11) 99999-9999"
              className="w-full bg-asphalt-soft border border-asphalt-line rounded-sm px-4 py-3 text-chalk focus:border-signal outline-none" />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-chalk/50 mb-2">Senha</label>
            <input type="password" required minLength={6} value={form.senha} onChange={(e) => atualizar('senha', e.target.value)}
              className="w-full bg-asphalt-soft border border-asphalt-line rounded-sm px-4 py-3 text-chalk focus:border-signal outline-none" />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase text-chalk/50 mb-2">Confirmar senha</label>
            <input type="password" required minLength={6} value={form.confirmarSenha} onChange={(e) => atualizar('confirmarSenha', e.target.value)}
              className="w-full bg-asphalt-soft border border-asphalt-line rounded-sm px-4 py-3 text-chalk focus:border-signal outline-none" />
          </div>

          {mensagem && <p className={`text-sm ${sucesso ? 'text-signal' : 'text-red-400'}`}>{mensagem}</p>}

          <button type="submit" disabled={carregando}
            className="w-full bg-signal text-asphalt font-bold py-3 rounded-sm hover:bg-signal-bright transition-colors disabled:opacity-50">
            {carregando ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>
      </div>
    </main>
  );
}
