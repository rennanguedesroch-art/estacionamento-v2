'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import NavBar from '@/components/NavBar';
import FAQ from '@/components/FAQ';
import ParkingScene from '@/components/ParkingScene';
import {
  IconAvulso,
  IconMensal,
  IconCamera,
  IconLava,
  IconAcesso,
  IconRapido,
  IconPin,
  IconWhatsapp,
} from '@/components/icons';

const HORARIOS = [
  { dia: 'Segunda a sexta', horario: '06:00 – 23:00' },
  { dia: 'Sábado', horario: '08:00 – 16:00' },
  { dia: 'Domingo', horario: 'Fechado' },
];

const BENEFICIOS = [
  { Icon: IconCamera, titulo: 'Monitoramento por câmeras', texto: 'Pátio com câmeras de segurança, inclusive durante o pernoite.' },
  { Icon: IconMensal, titulo: 'Planos para mensalistas', texto: 'Vaga garantida nos dias de funcionamento, com condição especial.' },
  { Icon: IconAvulso, titulo: 'Pernoite', texto: 'Deixe o veículo durante a noite com segurança monitorada.' },
  { Icon: IconLava, titulo: 'Lava-rápido', texto: 'Produtos Vonixx e Protelim, lavagem completa no mesmo endereço.' },
  { Icon: IconAcesso, titulo: 'Fácil acesso', texto: 'Localização de fácil chegada na Vila Prudente, perto de tudo.' },
  { Icon: IconRapido, titulo: 'Atendimento rápido', texto: 'Entrada e saída ágeis, sem perder tempo no dia a dia.' },
];

const PASSOS = [
  { n: '1', titulo: 'Reserve pelo site', texto: 'Escolha o tipo de veículo, data e período direto no site — ou chegue sem reserva se preferir.' },
  { n: '2', titulo: 'Deixe o veículo', texto: 'Chegue na R. Cavour, 329 dentro do horário reservado e deixe com nossa equipe.' },
  { n: '3', titulo: 'Retire quando quiser', texto: 'Pague na saída — dinheiro, Pix, cartão ou Sem Parar — e pegue o carro limpo, se pediu lavagem.' },
];

const PAGAMENTOS = ['Dinheiro', 'Pix', 'Débito', 'Crédito', 'Sem Parar'];
const WHATSAPP = '5511991767870';
const ENDERECO = 'R. Cavour, 329 - Vila Prudente, São Paulo - SP, 03136-010';
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ENDERECO)}`;

export default function Home() {
  const [vagasLivres, setVagasLivres] = useState(null);
  const [totalVagas, setTotalVagas] = useState(30);

  useEffect(() => {
    let subscription;
    async function carregarVagas() {
      const { data, error } = await supabase.from('vagas').select('status');
      if (error || !data) return;
      setTotalVagas(data.length);
      setVagasLivres(data.filter((v) => v.status === 'livre').length);
    }
    carregarVagas();
    subscription = supabase
      .channel('vagas-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vagas' }, () => carregarVagas())
      .subscribe();
    return () => subscription && supabase.removeChannel(subscription);
  }, []);

  const mensagemWhatsapp = encodeURIComponent('Olá! Vim pelo site e gostaria de saber mais sobre vagas no Valent Estacionamentos.');
  const ocupacaoPct = vagasLivres !== null && totalVagas ? Math.round(((totalVagas - vagasLivres) / totalVagas) * 100) : null;

  return (
    <main>
      <NavBar />

      {/* HERO com foto real do pátio */}
      <section className="relative overflow-hidden border-b border-asphalt-line">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/patio-2.jpg"
            alt="Pátio do estacionamento Valent, bem iluminado e organizado"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-asphalt via-asphalt/85 to-asphalt/50" />
          <div className="absolute inset-0 bg-asphalt/30" />
        </div>

        <div className="road-divider relative" />
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-20 md:pt-28 md:pb-28 relative">
          <p className="font-mono text-signal text-xs tracking-[0.25em] uppercase mb-6">Vila Prudente · São Paulo</p>
          <h1 className="font-display text-4xl md:text-6xl leading-[1.05] uppercase max-w-2xl">
            Sua vaga te espera, todos os dias.
          </h1>
          <p className="mt-6 text-lg text-chalk/80 max-w-lg">
            Avulso, mensalista, pernoite, câmeras de segurança e lava-rápido profissional, tudo no
            mesmo endereço, na Vila Prudente.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a href="/reservar" className="bg-signal text-asphalt font-bold px-6 py-3 rounded-sm hover:bg-signal-bright transition-colors">
              Reservar vaga
            </a>
            <a
              href={`https://wa.me/${WHATSAPP}?text=${mensagemWhatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 border border-chalk/20 bg-asphalt/40 backdrop-blur-sm px-6 py-3 rounded-sm text-chalk hover:border-signal transition-colors"
            >
              <IconWhatsapp className="w-4 h-4" />
              Falar no WhatsApp
            </a>
            <a
              href="#localizacao"
              className="border border-chalk/20 bg-asphalt/40 backdrop-blur-sm px-6 py-3 rounded-sm text-chalk hover:border-signal transition-colors"
            >
              Ver localização
            </a>
          </div>

          {/* Painel de vagas, estilo "placar" */}
          <div className="mt-14 inline-flex items-stretch border border-chalk/15 bg-asphalt/60 backdrop-blur-sm rounded-sm overflow-hidden">
            <div className="road-divider--vertical" />
            <div className="px-6 py-4 relative">
              <span className="absolute top-4 right-4 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
                <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-signal">ao vivo</span>
              </span>
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-chalk/50">Vagas disponíveis agora</p>
              <p className="font-display text-3xl mt-1">
                {vagasLivres !== null ? vagasLivres : '—'}
                <span className="text-chalk/40 text-lg"> / {totalVagas}</span>
              </p>
              {ocupacaoPct !== null && (
                <div className="mt-2 h-1.5 w-40 rounded-full bg-asphalt-line overflow-hidden">
                  <div className="h-full bg-signal transition-all duration-700" style={{ width: `${ocupacaoPct}%` }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="font-display text-2xl uppercase mb-2">Como funciona</h2>
        <div className="road-divider w-24 mb-12" />
        <div className="grid md:grid-cols-3 gap-10">
          {PASSOS.map((p) => (
            <div key={p.n}>
              <span className="font-display text-5xl text-signal/25">{p.n}</span>
              <h3 className="font-display text-base uppercase mt-2 mb-2">{p.titulo}</h3>
              <p className="text-chalk/60 text-sm leading-relaxed">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section id="servicos" className="border-y border-asphalt-line bg-asphalt-soft">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="font-display text-2xl uppercase mb-2">Por que escolher o Valent</h2>
          <div className="road-divider w-24 mb-12" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-asphalt-line">
            {BENEFICIOS.map(({ Icon, titulo, texto }) => (
              <div key={titulo} className="bg-asphalt p-8 group hover:bg-asphalt-soft transition-colors">
                <Icon className="w-9 h-9 text-signal mb-4 transition-transform group-hover:scale-110" />
                <h3 className="font-display text-base uppercase mb-2">{titulo}</h3>
                <p className="text-chalk/70 text-sm leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREÇOS */}
      <section id="precos" className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="font-display text-2xl uppercase mb-2">Tabela de preços</h2>
        <div className="road-divider w-24 mb-12" />

        <h3 className="font-display text-sm uppercase text-signal mb-5">Estacionamento</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-14">
          {[
            ['1 hora', 'R$ 10,00'],
            ['Período 4h', 'R$ 18,00'],
            ['Período 12h', 'R$ 28,00'],
            ['Hora adicional', 'R$ 5,00'],
            ['Moto — diária 12h', 'R$ 15,00'],
          ].map(([label, valor]) => (
            <div key={label} className="border border-asphalt-line rounded-sm p-4">
              <p className="text-xs text-chalk/50 mb-2">{label}</p>
              <p className="font-display text-xl text-signal">{valor}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-chalk/40 -mt-10 mb-14">Veículos grandes: valores sob consulta.</p>

        <h3 className="font-display text-sm uppercase text-signal mb-5">Lava-rápido</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { tipo: 'Carro pequeno', simples: 'R$ 60', cera: 'R$ 65', ducha: 'R$ 30' },
            { tipo: 'Carro grande', simples: 'R$ 70', cera: 'R$ 75', ducha: 'R$ 30' },
            { tipo: 'Caminhonete', simples: 'R$ 80', cera: 'R$ 85', ducha: '—' },
          ].map((c) => (
            <div key={c.tipo} className="border border-asphalt-line rounded-sm p-5">
              <p className="font-display text-sm uppercase mb-4">{c.tipo}</p>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex justify-between"><span className="text-chalk/60">Simples</span><span>{c.simples}</span></div>
                <div className="flex justify-between"><span className="text-chalk/60">C/ cera</span><span>{c.cera}</span></div>
                <div className="flex justify-between"><span className="text-chalk/60">Ducha completa</span><span>{c.ducha}</span></div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-chalk/40 mt-4">Lavagem de moto: consulte disponibilidade e valor.</p>
        <p className="text-xs text-chalk/30 mt-8 font-mono">Não nos responsabilizamos por objetos deixados dentro dos veículos.</p>
      </section>

      {/* EXPERIÊNCIA E CONFIANÇA */}
      <section id="galeria" className="border-t border-asphalt-line bg-asphalt-soft">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="font-display text-2xl uppercase mb-2">Experiência e confiança</h2>
          <div className="road-divider w-24 mb-12" />
          <div className="grid sm:grid-cols-3 gap-4">
            <figure className="rounded-sm overflow-hidden border border-asphalt-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/patio-1.jpg" alt="Pátio do estacionamento Valent à noite" className="w-full h-56 object-cover" />
              <figcaption className="p-3 text-xs text-chalk/50 font-mono">Entrada sinalizada e bem iluminada</figcaption>
            </figure>
            <figure className="rounded-sm overflow-hidden border border-asphalt-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/patio-2.jpg" alt="Vagas do estacionamento Valent com carros e moto" className="w-full h-56 object-cover" />
              <figcaption className="p-3 text-xs text-chalk/50 font-mono">Vagas espaçosas e organizadas</figcaption>
            </figure>
            <figure className="rounded-sm overflow-hidden border border-asphalt-line bg-asphalt flex flex-col">
              <div className="flex-1 flex items-center p-4">
                <ParkingScene />
              </div>
              <figcaption className="p-3 text-xs text-chalk/50 font-mono">Fluxo de entrada e saída monitorado</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* HORÁRIOS E PAGAMENTO */}
      <section className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="font-display text-2xl uppercase mb-2">Horário</h2>
          <div className="road-divider w-24 mb-8" />
          <table className="w-full font-mono text-sm">
            <tbody>
              {HORARIOS.map((h) => (
                <tr key={h.dia} className="border-b border-asphalt-line/60">
                  <td className="py-3 text-chalk/70">{h.dia}</td>
                  <td className="py-3 text-right text-chalk">{h.horario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h2 className="font-display text-2xl uppercase mb-2">Pagamento</h2>
          <div className="road-divider w-24 mb-8" />
          <ul className="flex flex-wrap gap-3">
            {PAGAMENTOS.map((p) => (
              <li key={p} className="font-mono text-sm border border-asphalt-line px-4 py-2 rounded-sm text-chalk/80">{p}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-asphalt-line bg-asphalt-soft">
        <div className="max-w-2xl mx-auto px-6 py-20">
          <h2 className="font-display text-2xl uppercase mb-2">Dúvidas frequentes</h2>
          <div className="road-divider w-24 mb-8" />
          <FAQ />
        </div>
      </section>

      {/* LOCALIZAÇÃO */}
      <section id="localizacao" className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="font-display text-2xl uppercase mb-2">Onde estamos</h2>
        <div className="road-divider w-24 mb-8" />
        <div className="grid md:grid-cols-2 gap-10 mb-8">
          <div>
            <div className="flex items-start gap-2 text-chalk/70 mb-4">
              <IconPin className="w-5 h-5 text-signal shrink-0 mt-0.5" />
              <p>{ENDERECO}</p>
            </div>
            <p className="font-mono text-xs text-chalk/50 mb-6">
              Seg a sex 06:00–23:00 · Sáb 08:00–16:00 · Dom fechado
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="bg-signal text-asphalt font-bold px-5 py-2.5 rounded-sm text-sm hover:bg-signal-bright transition-colors"
              >
                Abrir no Google Maps
              </a>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 border border-asphalt-line px-5 py-2.5 rounded-sm text-sm hover:border-signal transition-colors"
              >
                <IconWhatsapp className="w-4 h-4" />
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
        <div className="border border-asphalt-line rounded-sm overflow-hidden aspect-video">
          <iframe
            title="Mapa - Valent Estacionamentos"
            className="w-full h-full grayscale contrast-125"
            loading="lazy"
            src={`https://www.google.com/maps?q=${encodeURIComponent(ENDERECO)}&output=embed`}
          />
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="border-t border-asphalt-line bg-asphalt-soft">
        <div className="max-w-5xl mx-auto px-6 py-14 grid sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <p className="font-display text-sm uppercase mb-3">
              Valent<span className="text-signal">.</span>
            </p>
            <p className="text-xs text-chalk/50 leading-relaxed">{ENDERECO}</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-chalk/40 mb-3">Horário</p>
            <ul className="text-xs text-chalk/60 space-y-1.5">
              <li>Seg a sex: 06:00–23:00</li>
              <li>Sábado: 08:00–16:00</li>
              <li>Domingo: fechado</li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-chalk/40 mb-3">Links rápidos</p>
            <ul className="text-xs text-chalk/60 space-y-1.5">
              <li><a href="#servicos" className="hover:text-signal">Serviços</a></li>
              <li><a href="#precos" className="hover:text-signal">Preços</a></li>
              <li><a href="#faq" className="hover:text-signal">Dúvidas</a></li>
              <li><a href="/reservar" className="hover:text-signal">Reservar vaga</a></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-chalk/40 mb-3">Contato</p>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="text-xs text-signal font-mono">
              (11) 99176-7870
            </a>
            <p className="mt-3">
              <a href="/login" className="text-xs text-chalk/50 hover:text-signal">Área do cliente</a>
            </p>
          </div>
        </div>
        <div className="border-t border-asphalt-line">
          <div className="max-w-5xl mx-auto px-6 py-4 text-[11px] text-chalk/30 font-mono">
            © Valent Estacionamentos — Vila Prudente, São Paulo
          </div>
        </div>
      </footer>
    </main>
  );
}
