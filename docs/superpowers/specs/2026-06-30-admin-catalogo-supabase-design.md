# Painel ADM + catálogo dinâmico (Supabase) — Design

**Data:** 2026-06-30
**Status:** aprovado (aguardando chaves do Supabase para configurar)

## Objetivo

Permitir que **apenas um usuário ADM** (login email+senha) gerencie o catálogo —
criar/editar/excluir **categorias** e **produtos**, com **upload de foto** — e que o
site público (home + catálogo) leia esses dados em tempo real. Sem build, hospedagem
estática grátis mantida.

## Decisões

- **Backend:** Supabase (Auth + Postgres + Storage). Escolhido por dar login real,
  banco e storage num só serviço grátis, sem servidor próprio. Usuário já usa Supabase.
- **Segurança server-side (RLS):** leitura pública de categorias/produtos/fotos;
  escrita só para usuário autenticado. Regra no banco → não burlável pelo cliente.
- **1 conta ADM**, criada manualmente no painel do Supabase. **Sem cadastro público.**
- **Sem build:** JS puro + `@supabase/supabase-js` via CDN (ESM). Combina com o projeto.
- **Home e catálogo dinâmicos:** ambos leem do banco; categoria nova aparece nos dois.
- **Mensagem do WhatsApp** por produto é gerada automaticamente do nome (ADM não digita
  link). Texto: `Olá Márcia! Tenho interesse em <NOME>. Pode me passar mais informações?`
- **Foto:** upload no painel, comprimida no navegador para WebP (~1000px, q~0.8) antes de
  subir ao Storage. Evita fotos pesadas.

## Fora de escopo (YAGNI)

Múltiplos perfis/papéis, log de auditoria, histórico de edição, recuperação de senha
self-service (ADM reseta pelo painel Supabase), carrinho/checkout/e-commerce, busca.

## Modelo de dados

### tabela `categorias`
| coluna | tipo | nota |
|---|---|---|
| id | uuid PK (default gen_random_uuid) | |
| slug | text unique not null | usado na URL `?c=` e âncoras |
| titulo | text not null | ex: "Cintos" |
| descricao | text | texto curto do card da home |
| imagem | text | path no Storage (capa da home) |
| badge | text | opcional, ex: "Mais pedido" |
| badge_mod | text | opcional: '', '--dark', '--gold' |
| destaque | boolean default false | borda dourada (categoria-card--destaque) |
| ordem | int default 0 | ordenação |
| criado_em | timestamptz default now() | |

### tabela `produtos`
| coluna | tipo | nota |
|---|---|---|
| id | uuid PK | |
| categoria_id | uuid FK -> categorias(id) ON DELETE RESTRICT | bloqueia excluir categoria com produto |
| nome | text not null | |
| descricao | text not null | |
| detalhes | text[] | lista de bullets |
| badge | text | opcional |
| badge_mod | text | opcional |
| imagem | text | path no Storage |
| ordem | int default 0 | |
| criado_em | timestamptz default now() | |

`ON DELETE RESTRICT` em `categoria_id` implementa "não excluir categoria com produtos".

### Storage
Bucket público `catalogo` (somente leitura pública; escrita só autenticado via policy).
Fotos em `catalogo/produtos/<uuid>.webp` e `catalogo/categorias/<uuid>.webp`.

## RLS (resumo)

- `categorias`, `produtos`: `SELECT` para `anon` e `authenticated`; `INSERT/UPDATE/DELETE`
  só `authenticated`.
- Storage bucket `catalogo`: `SELECT` público; `INSERT/UPDATE/DELETE` só `authenticated`.

SQL completo em `db/schema.sql`. Seed dos dados atuais em `db/seed.sql`.

## Front-end

### Arquivos novos
- `js/supabase-config.js` — `SUPABASE_URL` + `SUPABASE_ANON_KEY` (placeholder; público).
- `js/supabase-client.js` — inicializa o client (CDN ESM) e expõe helpers de leitura.
- `js/catalogo-data.js` — busca categorias/produtos (usado por home + catálogo).
- `admin.html` + `js/admin.js` — painel protegido.

### Alterações
- `catalogo.js` — em vez do objeto `CATEGORIAS` fixo, busca do Supabase e renderiza
  (mantém `buildCard`, sprite WhatsApp, animação, deep-link `?c=`, popstate).
- `index.html` + `js/main.js` — grid de categorias da home renderizado do banco.

### Fluxo público
1. Página carrega → busca categorias (e produtos da categoria ativa) do Supabase.
2. Render igual ao atual (mesmas classes CSS). Sem foto → placeholder 📷 que já existe.
3. Se o Supabase não responder → mensagem amigável "catálogo indisponível, fale no
   WhatsApp" (link WhatsApp continua funcionando, pois é estático).

### Fluxo admin (`admin.html`)
1. Não logado → formulário de login (email+senha) via Supabase Auth.
2. Logado → duas seções: **Categorias** e **Produtos**.
   - Listar, criar, editar, excluir.
   - Form de produto: nome, descrição, detalhes (linhas), badge, categoria (select), foto.
   - Foto: `<input type=file>` → comprime no canvas → WebP → upload Storage → salva path.
   - Excluir categoria com produtos → erro do banco (RESTRICT) tratado: avisa e bloqueia.
3. Logout.

## Runbook (passos do usuário)

1. Criar projeto Supabase (região São Paulo).
2. SQL Editor → rodar `db/schema.sql`, depois `db/seed.sql`.
3. Authentication → Users → Add user (email+senha do ADM).
4. Project Settings → API → copiar Project URL + anon key → preencher
   `js/supabase-config.js`.
5. Deploy estático (Netlify/Vercel) arrastando a pasta ou conectando o repo.
6. Testar `/admin.html`: login → criar produto → conferir no catálogo.

## Riscos / atenção

- Site público passa a depender do Supabase (uptime do plano grátis). Fallback amigável.
- anon key fica no JS público — esperado; a proteção é a RLS, não a chave.
- Sem build: usar `@supabase/supabase-js` via ESM CDN (`esm.sh`/`jsdelivr`).

## Verificação

- Sem chaves: syntax check dos JS; render do catálogo com dados-mock; teste de
  `tests/catalogo.test.mjs` adaptado (estrutura do card a partir de mock).
- Com chaves (usuário): login, CRUD, upload, exclusão bloqueada de categoria com produto.
