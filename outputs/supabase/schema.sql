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

-- A área /admin é somente para usuários inseridos nesta lista por um administrador.
create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  criado_em timestamptz not null default now()
);
alter table public.site_admins enable row level security;
revoke all on table public.site_admins from public, anon, authenticated;
grant select on table public.site_admins to authenticated;
drop policy if exists "Admin consulta propria permissao" on public.site_admins;
create policy "Admin consulta propria permissao" on public.site_admins
  for select to authenticated using (user_id = auth.uid());

grant select on table public.site_leads to authenticated;
drop policy if exists "Admins consultam cadastros do site" on public.site_leads;
create policy "Admins consultam cadastros do site" on public.site_leads
  for select to authenticated using (
    exists (select 1 from public.site_admins where site_admins.user_id = auth.uid())
  );

