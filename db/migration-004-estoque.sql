-- Migracao 004: controle de estoque por produto (opcional).
-- estoque_ativo: liga/desliga o controle; estoque: quantidade.
-- Se estoque_ativo e estoque = 0, o site mostra "Esgotado".
-- Idempotente. Rode uma vez no SQL Editor.

alter table public.produtos add column if not exists estoque_ativo boolean not null default false;
alter table public.produtos add column if not exists estoque       integer not null default 0;
