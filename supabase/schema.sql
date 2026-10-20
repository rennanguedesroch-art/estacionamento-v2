-- Schema do banco de dados - Valent Estacionamentos
-- Rode este script no SQL Editor do Supabase (Project > SQL Editor > New query)
-- Se o banco já existia ANTES do sistema de reservas, use supabase/migracao-reservas.sql
-- em vez de rodar este arquivo de novo.

create extension if not exists "pgcrypto";

-- Perfis de usuário (cliente ou admin)
create table if not exists perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  telefone text,
  tipo text not null default 'cliente' check (tipo in ('cliente', 'admin')),
  criado_em timestamptz not null default now()
);

-- Vagas do estacionamento (uso ilustrativo/demonstrativo do painel em tempo real)
create table if not exists vagas (
  id serial primary key,
  numero integer not null unique,
  status text not null default 'livre' check (status in ('livre', 'ocupada')),
  atualizado_em timestamptz not null default now()
);

-- Mensalistas (planos mensais)
create table if not exists mensalistas (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid references perfis(id) on delete cascade,
  placa text not null,
  modelo_veiculo text,
  plano text not null default 'mensal',
  vencimento date,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

-- Reservas (carro ou moto, com data/hora de entrada e saída)
create table if not exists reservas (
  id uuid primary key default gen_random_uuid(),
  perfil_id uuid references perfis(id) on delete set null,
  vaga_id integer references vagas(id) on delete set null,
  tipo_veiculo text not null default 'carro' check (tipo_veiculo in ('carro', 'moto')),
  placa text,
  entrada timestamptz not null default now(),
  saida timestamptz,
  valor numeric(10,2),
  status text not null default 'ativa' check (status in ('ativa', 'finalizada', 'cancelada'))
);

-- 30 vagas de exemplo (ajuste para o número real do estacionamento)
insert into vagas (numero, status)
select g, 'livre' from generate_series(1, 30) g
on conflict (numero) do nothing;

alter table perfis enable row level security;
alter table vagas enable row level security;
alter table mensalistas enable row level security;
alter table reservas enable row level security;

create policy "Vagas são visíveis para todos" on vagas
  for select using (true);

create policy "Usuário vê o próprio perfil" on perfis
  for select using (auth.uid() = id);

create policy "Usuário edita o próprio perfil" on perfis
  for update using (auth.uid() = id);

create policy "Usuario cria o proprio perfil" on perfis
  for insert with check (auth.uid() = id);

create policy "Usuário vê as próprias reservas" on reservas
  for select using (auth.uid() = perfil_id);

create policy "Usuário cria as próprias reservas" on reservas
  for insert with check (auth.uid() = perfil_id);

create policy "Usuario cancela a propria reserva" on reservas
  for update using (auth.uid() = perfil_id)
  with check (auth.uid() = perfil_id);

-- View pública (somente leitura) para calcular disponibilidade na página de
-- reserva, sem expor dados pessoais (placa, cliente) de outras pessoas.
create or replace view reservas_disponibilidade as
select tipo_veiculo, entrada, saida, status
from reservas
where status = 'ativa';

grant select on reservas_disponibilidade to authenticated, anon;
