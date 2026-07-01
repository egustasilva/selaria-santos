-- Migracao 002: galeria de fotos por produto.
-- Adiciona coluna de fotos adicionais (alem da capa em produtos.imagem).
-- Idempotente (if not exists). Rode uma vez no SQL Editor.

alter table public.produtos
  add column if not exists imagens text[] not null default '{}';
