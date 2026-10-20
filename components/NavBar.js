'use client';

import { useEffect, useState } from 'react';
import { IconWhatsapp } from './icons';

const LINKS = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#precos', label: 'Preços' },
  { href: '#faq', label: 'Dúvidas' },
  { href: '#localizacao', label: 'Localização' },
];

export default function NavBar() {
  const [aberto, setAberto] = useState(false);
  const [rolado, setRolado] = useState(false);

  useEffect(() => {
    function onScroll() {
      setRolado(window.scrollY > 24);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-asphalt/85 border-b border-asphalt-line">
      <div
        className={`max-w-5xl mx-auto px-6 flex items-center justify-between transition-[height] duration-300 ${
          rolado ? 'h-12' : 'h-16'
        }`}
      >
        <a href="#" className="font-display text-sm tracking-wide uppercase">
          Valent<span className="text-signal">.</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-chalk/70 hover:text-chalk transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://wa.me/5511991767870"
            target="_blank"
            rel="noreferrer"
            aria-label="Falar no WhatsApp"
            className="text-chalk/70 hover:text-signal transition-colors"
          >
            <IconWhatsapp className="w-5 h-5" />
          </a>
          <a
            href="/reservar"
            className="bg-signal text-asphalt text-sm font-bold px-4 py-2 rounded-sm hover:bg-signal-bright transition-colors"
          >
            Reservar vaga
          </a>
        </div>

        <button
          onClick={() => setAberto((a) => !a)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Abrir menu"
          aria-expanded={aberto}
        >
          <span className={`block h-0.5 w-5 bg-chalk transition-transform ${aberto ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-5 bg-chalk transition-opacity ${aberto ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-5 bg-chalk transition-transform ${aberto ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      <div
        className="md:hidden overflow-hidden transition-all duration-300 border-b border-asphalt-line"
        style={{ maxHeight: aberto ? '280px' : '0px' }}
      >
        <nav className="flex flex-col px-6 py-4 gap-4">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setAberto(false)} className="text-chalk/80">
              {l.label}
            </a>
          ))}
          <a href="/reservar" className="bg-signal text-asphalt text-sm font-bold px-4 py-2 rounded-sm text-center">
            Reservar vaga
          </a>
        </nav>
      </div>
    </header>
  );
}
