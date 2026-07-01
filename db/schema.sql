-- ============================================================
-- Selaria Santos — schema do catálogo (Supabase / Postgres)
-- Rode no SQL Editor do projeto Supabase ANTES do seed.sql.
-- Idempotente: pode rodar de novo sem quebrar.
-- ============================================================

create extension if not exists pgcrypto;  -- gen_random_uuid()

-- ----------------------------------------------------------
-- TABELAS
-- ----------------------------------------------------------
create table if not exists public.categorias (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  titulo     text not null,
  descricao  text,
  imagem     text,                       -- usável direto em <img src> (path relativo OU URL do Storage)
  badge      text,
  badge_mod  text,                        -- '', '--dark', '--gold'
  destaque   boolean not null default false,
  ordem      int not null default 0,
  criado_em  timestamptz not null default now()
);

create table if not exists public.produtos (
  id           uuid primary key default gen_random_uuid(),
  categoria_id uuid not null references public.categorias(id) on delete restrict,
  nome         text not null,
  descricao    text not null,
  detalhes     text[] not null default '{}',
  badge        text,
  badge_mod    text,
  imagem       text,                      -- usável direto em <img src>
  ordem        int not null default 0,
  criado_em    timestamptz not null default now()
);

create index if not exists produtos_categoria_idx on public.produtos(categoria_id);

-- ----------------------------------------------------------
-- RLS — leitura pública, escrita só autenticado
-- ----------------------------------------------------------
alter table public.categorias enable row level security;
alter table public.produtos   enable row level security;

-- categorias
drop policy if exists categorias_select_public on public.categorias;
create policy categorias_select_public on public.categorias
  for select using (true);

drop policy if exists categorias_write_auth on public.categorias;
create policy categorias_write_auth on public.categorias
  for all to authenticated using (true) with check (true);

-- produtos
drop policy if exists produtos_select_public on public.produtos;
create policy produtos_select_public on public.produtos
  for select using (true);

drop policy if exists produtos_write_auth on public.produtos;
create policy produtos_write_auth on public.produtos
  for all to authenticated using (true) with check (true);

-- ----------------------------------------------------------
-- STORAGE — bucket público 'catalogo' (leitura pública, escrita só auth)
-- ----------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('catalogo', 'catalogo', true)
on conflict (id) do nothing;

drop policy if exists catalogo_read_public on storage.objects;
create policy catalogo_read_public on storage.objects
  for select using (bucket_id = 'catalogo');

drop policy if exists catalogo_write_auth on storage.objects;
create policy catalogo_write_auth on storage.objects
  for all to authenticated
  using (bucket_id = 'catalogo')
  with check (bucket_id = 'catalogo');
