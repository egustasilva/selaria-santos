-- Migracao 003: cor personalizada do selo (badge).
-- Guarda um hex (ex: #C9971C) por produto/categoria; se nulo, usa o estilo padrao.
-- Idempotente. Rode uma vez no SQL Editor.

alter table public.produtos   add column if not exists badge_cor text;
alter table public.categorias add column if not exists badge_cor text;
