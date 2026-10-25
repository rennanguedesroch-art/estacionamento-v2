-- O projeto Supabase conectado usa esta estrutura (migration add_site_leads).
-- Visitantes só podem inserir cadastro com consentimento; não podem consultar registros.
create table if not exists public.site_leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(btrim(nome)) between 2 and 120),
  telefone text not null check (char_length(btrim(telefone)) between 10 and 24),
  veiculo text check (veiculo is null or char_length(btrim(veiculo)) <= 80),
  interesse text not null check (interesse in ('estacionamento-avulso', 'mensalista', 'pernoite', 'lava-rapido', 'outro')),
  consentimento boolean not null check (consentimento is true),
  criado_em timestamptz not null default now()
);

alter table public.site_leads enable row level security;
revoke all on table public.site_leads from public, anon, authenticated;
grant insert (nome, telefone, veiculo, interesse, consentimento) on public.site_leads to anon;
drop policy if exists "Anon envia interesse pelo site" on public.site_leads;
create policy "Anon envia interesse pelo site" on public.site_leads
  for insert to anon with check (consentimento is true);

