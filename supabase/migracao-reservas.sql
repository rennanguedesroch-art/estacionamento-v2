-- Migração: sistema de reserva online
-- Rode este script no SQL Editor do Supabase (Project > SQL Editor > New query)
-- Só precisa rodar uma vez, depois de já ter rodado o schema.sql original.

-- Adiciona o campo de tipo de veículo na tabela de reservas
alter table reservas
  add column if not exists tipo_veiculo text not null default 'carro'
  check (tipo_veiculo in ('carro', 'moto'));

-- Permite que o usuário cancele (atualize) a própria reserva
create policy if not exists "Usuario cancela a propria reserva" on reservas
  for update using (auth.uid() = perfil_id)
  with check (auth.uid() = perfil_id);

-- View pública (somente leitura) para calcular disponibilidade sem expor dados
-- pessoais de outros clientes (placa, id do cliente etc). Qualquer pessoa logada
-- pode ver apenas tipo de veículo, horários e status das reservas ativas.
create or replace view reservas_disponibilidade as
select tipo_veiculo, entrada, saida, status
from reservas
where status = 'ativa';

grant select on reservas_disponibilidade to authenticated, anon;
