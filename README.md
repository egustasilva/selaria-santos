# Selaria & Casa de Couro Santos — Site

Site institucional/vitrine da Selaria & Casa de Couro Santos (São José dos Campos/SP).
HTML + CSS + JavaScript puro, sem build. Conversão 100% via WhatsApp.

---

## 📁 Estrutura

```
selaria-santos/
├── index.html            → Landing page (12 seções, funil de conversão)
├── catalogo.html         → Catálogo dinâmico (categorias via JS)
├── lp-campanha.html      → Landing de campanha (ads) — foco em "conserto", sem menu
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── css/
│   └── style.css         → Todo o estilo (variáveis, componentes, responsivo, catálogo)
├── js/
│   ├── main.js           → Interatividade (menu, scroll, reveal, WhatsApp float)
│   └── catalogo.js       → Dados e renderização do catálogo
├── assets/images/        → Imagens em WebP otimizado + favicons + og-image
└── docs/
    ├── superpowers/specs/ → Spec de design (Onda 2)
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

## 🌐 Publicar (Netlify/Vercel, grátis)

Arraste a pasta para o Netlify, ou conecte o repositório no Vercel. Depois configure o domínio próprio e **troque os placeholders de domínio** (ver tabela acima).

---

## 📊 SEO já incluído

- JSON-LD `LocalBusiness` + `FAQPage` (home) e `BreadcrumbList` (catálogo)
- Open Graph + Twitter Cards + `og-image`
- `robots.txt`, `sitemap.xml`, favicons, manifest, meta geo

Antes de investir em ads, instale **GA4 + Meta Pixel** (ver `docs/marketing/`).
