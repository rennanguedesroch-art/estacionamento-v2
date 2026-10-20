# Valent Estacionamentos — Sistema Web

Sistema web para o **Valent Estacionamentos** (R. Cavour, 329 — Vila Prudente, São Paulo),
desenvolvido como Projeto em Sistemas.

🔗 **Site publicado:** _(coloque aqui o link do Vercel)_
🎥 **Vídeo de apresentação:** _(coloque aqui o link do YouTube)_

## Integrantes do grupo

- Nome completo — RA
- _(adicione todos os integrantes aqui)_

## Funcionalidades

- Site institucional com fotos reais do local, tabela de preços e galeria
- Indicador de vagas disponíveis em tempo real
- Cadastro e login de clientes (Supabase Auth)
- **Reserva de vaga online** (carro ou moto), com cálculo automático de disponibilidade
  a partir das reservas já existentes no horário escolhido
- Histórico de reservas do cliente, com opção de cancelar
- Painel administrativo simples para marcar vagas como ocupadas/livres

## Stack

Next.js 14 (React) · Tailwind CSS · Supabase (Postgres + Auth + Realtime) · Vercel

## Como rodar localmente

```bash
npm install
cp .env.local.example .env.local
# preencha o .env.local com a URL e a chave do seu projeto Supabase
npm run dev
```

## Configurar o banco de dados (Supabase)

**Projeto novo, do zero:**
Rode `supabase/schema.sql` inteiro no SQL Editor do Supabase. Já cria todas as
tabelas, políticas de segurança e a view usada para calcular disponibilidade.

**Projeto que você já tinha criado antes do sistema de reservas:**
Rode apenas `supabase/migracao-reservas.sql` — ele adiciona só o que falta
(coluna de tipo de veículo, permissão de cancelamento e a view de disponibilidade)
sem duplicar o que já existe.

## Deploy na Vercel

1. Suba o projeto pro GitHub
2. Importe o repositório na Vercel
3. Em Environment Variables, adicione `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

## Estrutura

```
app/
  page.js             → Página inicial
  reservar/page.js     → Reserva de vaga (carro/moto)
  minhas-reservas/      → Histórico de reservas do cliente
  login/, cadastro/     → Autenticação
  admin/                → Painel de vagas
components/
  NavBar, FAQ, ParkingScene, FloatingWhatsapp, icons
lib/
  supabaseClient.js, planos.js (preços e capacidade)
supabase/
  schema.sql            → Script completo (projeto novo)
  migracao-reservas.sql → Script incremental (projeto existente)
public/images/
  patio-1.jpg, patio-2.jpg → Fotos reais do estacionamento
```

## Dados ainda provisórios

- [ ] Confirmar quantidade real de vagas (hoje: 30 carros / 6 motos, estimado)
- [ ] Confirmar se o lava-rápido precisa de agendamento
- [ ] Gravar o vídeo de apresentação
