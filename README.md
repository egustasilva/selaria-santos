# Selaria & Casa de Couro Santos — Site

Site institucional/vitrine da Selaria & Casa de Couro Santos (São José dos Campos/SP).
HTML + CSS + JavaScript puro, sem build. Conversão 100% via WhatsApp.

---

## 📁 Estrutura

```
selaria-santos/
├── index.html            → Landing page (home; grid de categorias do banco + fallback)
├── catalogo.html         → Catálogo dinâmico (lê do Supabase)
├── admin.html            → Painel ADM (login + CRUD de categoria/produto)
├── lp-campanha.html      → Landing de campanha (ads) — foco em "conserto", sem menu
├── robots.txt · sitemap.xml · site.webmanifest
├── netlify.toml          → deploy estático sem build
├── package.json          → só para testes/ESM (não gera build no deploy)
├── css/style.css         → Todo o estilo
├── js/
│   ├── main.js               → Interatividade (menu, scroll, reveal, WhatsApp float)
│   ├── supabase-config.js    → chaves do Supabase (PREENCHER)
│   ├── supabase-client.js    → init do client (CDN)
│   ├── catalogo-data.js      → leitura de categorias/produtos
│   ├── catalogo-render.js    → render puro dos cards (testável)
│   ├── catalogo.js           → controlador da página de catálogo
│   ├── home-catalogo.js      → grid de categorias da home
│   └── admin.js              → painel ADM (auth + CRUD + upload)
├── db/
│   ├── schema.sql        → tabelas + RLS + storage
│   └── seed.sql          → dados atuais (6 categorias + 19 produtos)
├── tests/catalogo.test.mjs → teste do render
├── assets/images/        → WebP + favicons + og-image
└── docs/
    ├── superpowers/specs/ → Specs de design
    └── marketing/         → Estratégia de anúncios
```

---

## ⚠️ Pendências do cliente (placeholders marcados no código)

Procure pelos comentários no código:

| Marcador | O que fazer |
|---|---|
| `⚠️ TROQUE o domínio` | Trocar `https://www.selariasantos.com.br/` pelo domínio real em `index.html`, `catalogo.html`, `lp-campanha.html`, `robots.txt`, `sitemap.xml` |
| `AJUSTAR PREÇO` | Preencher as faixas `a partir de R$ ___` na seção Preços do `index.html` |
| `TROCAR POR FOTO REAL DA MÁRCIA` | Substituir o placeholder da seção História por foto real (`assets/images/marcia.webp`) |
| `DEPOIMENTO PLACEHOLDER` | Trocar os 3 depoimentos-modelo por reais (ou ocultar a seção até ter) |
| `CONFIRMAR COM A MÁRCIA` | Revisar respostas do FAQ (prazo, envio, pagamento, garantia) |

---

## 🖼️ Imagens

- Formato: **WebP** (otimizado — todas as fotos somam ~1 MB).
- Originais `.png`/`.jpg` em `assets/images/` **não são mais usados** pelo site (podem ser removidos).
- Ao adicionar fotos reais: salve em WebP (~1000px no maior lado, qualidade ~80).

---

## 📱 WhatsApp

Número configurado: **+55 (12) 98852-0409**. Para trocar, faça Find & Replace de `5512988520409`.
Cada anúncio/seção usa um texto pré-preenchido diferente — assim a Márcia sabe a origem do contato.

---

## 🔐 Painel administrativo (Supabase)

O catálogo (home + `catalogo.html`) lê **categorias e produtos do Supabase**. Um ADM
logado gerencia tudo em `admin.html` (criar/editar/excluir categoria e produto, com
upload de foto). Segurança no servidor via RLS: qualquer um lê, só logado escreve.

**Arquivos:** `db/schema.sql` (tabelas + RLS + storage), `db/seed.sql` (dados atuais),
`js/supabase-config.js` (chaves), `js/admin.js` (painel).

### Configurar (uma vez)

1. **Criar projeto** em [supabase.com](https://supabase.com) → New project (região *South
   America / São Paulo*). Anote a senha do banco.
2. **Rodar o SQL:** SQL Editor → colar e *Run* o conteúdo de `db/schema.sql`, depois
   `db/seed.sql` (migra as 6 categorias + 19 produtos atuais).
3. **Criar o ADM:** Authentication → Users → *Add user* → email + senha. (Sem cadastro
   público; esse é o único login que edita.)
4. **Pegar as chaves:** Project Settings → API → copiar *Project URL* e *anon public key*
   → colar em `js/supabase-config.js`. (A anon key é pública por design — a proteção é a
   RLS, não a chave.)
5. **Fotos:** o bucket `catalogo` é criado pelo `schema.sql`. Upload feito pelo painel
   (foto é comprimida para WebP no navegador antes de subir).

### Migrações
Ao atualizar o projeto, rode no SQL Editor as migrações em `db/` na ordem
(idempotentes). Ex.: `db/migration-002-imagens.sql` adiciona a coluna de fotos da
galeria (`produtos.imagens`).

### Usar
`https://SEU-SITE/admin.html` → login → gerenciar. Não dá para excluir categoria que ainda
tem produtos (mova/exclua os produtos antes).

- **Galeria:** cada produto tem 1 foto de capa + fotos adicionais (upload múltiplo). No
  site, clicar na foto abre em tela cheia com setas.
- **Exportar:** botão *Exportar XLSX* baixa `catalogo-selaria.xlsx` (abas Produtos e
  Categorias).

### Testar/local
`npm test` roda o teste do render (escape/XSS, sprite, badges). Não precisa de chaves.

---

## 🌐 Publicar (Netlify/Vercel, grátis)

Site estático: arraste a pasta para o **Netlify** (o `netlify.toml` já diz "sem build,
publica a raiz"), ou conecte o repositório. No Vercel, use o preset **Other** sem build.
Antes de publicar, preencha `js/supabase-config.js` (passo acima) e **troque os
placeholders de domínio** (ver tabela acima). O `package.json`/`netlify.toml` são só para
testes/deploy — não geram build.

---

## 📊 SEO já incluído

- JSON-LD `LocalBusiness` + `FAQPage` (home) e `BreadcrumbList` (catálogo)
- Open Graph + Twitter Cards + `og-image`
- `robots.txt`, `sitemap.xml`, favicons, manifest, meta geo

Antes de investir em ads, instale **GA4 + Meta Pixel** (ver `docs/marketing/`).
