/**
 * Testa o render puro do catálogo (js/catalogo-render.js) — sem DOM, sem Supabase.
 * Rodar: node tests/catalogo.test.mjs
 * Foco no que mais importa: escape de XSS (conteúdo agora vem do ADM), sprite do
 * WhatsApp, link gerado do nome e classes de badge.
 */
import assert from 'node:assert/strict';
import { esc, wppLink, buildProdutoCard, buildCategoriaCard } from '../js/catalogo-render.js';

// esc
assert.equal(esc(`<b>"a"&'x'`), '&lt;b&gt;&quot;a&quot;&amp;&#39;x&#39;');
assert.equal(esc(null), '');

// wppLink — mensagem do nome, URL-encoded
const link = wppLink('Cinto Liso');
assert.ok(link.startsWith('https://wa.me/5512988520409?text='), 'base do wa.me');
assert.ok(link.includes(encodeURIComponent('Cinto Liso')), 'nome no texto');
assert.ok(!link.includes(' '), 'sem espaço cru na URL');

// produto: sprite, badge gold, detalhes, escape
const cardP = buildProdutoCard({
  nome: 'Cinto Liso', descricao: 'Couro legítimo', detalhes: ['A', 'B'],
  badge: 'Sob medida', badge_mod: 'gold', imagem: 'assets/images/cinto.webp',
});
assert.ok(cardP.includes('<use href="#ic-wpp"/>'), 'usa o sprite do WhatsApp');
assert.ok(cardP.includes('produto-card__badge produto-card__badge--gold'), 'classe de badge gold');
assert.ok(cardP.includes('<li>A</li>') && cardP.includes('<li>B</li>'), 'detalhes viram <li>');
assert.ok(cardP.includes('src="assets/images/cinto.webp"'), 'src da imagem');

// produto sem badge → sem div de badge
assert.ok(!buildProdutoCard({ nome: 'X', descricao: 'y', detalhes: [], imagem: '' }).includes('produto-card__badge'),
  'sem badge não renderiza a div');

// XSS: nome malicioso é escapado, não injeta <script>
const evil = buildProdutoCard({ nome: '<script>alert(1)</script>', descricao: 'x', detalhes: [], imagem: '' });
assert.ok(!evil.includes('<script>alert(1)</script>'), 'script cru não vaza');
assert.ok(evil.includes('&lt;script&gt;'), 'script é escapado');

// selo com cor custom: fundo inline + texto contrastante, sem classe --mod
const corEscura = buildProdutoCard({ nome: 'X', descricao: 'd', detalhes: [], imagem: 'a.webp', badge: 'Novo', badge_cor: '#4E2C18' });
assert.ok(corEscura.includes('style="background:#4E2C18;color:#fff"'), 'cor escura → texto branco');
assert.ok(!corEscura.includes('produto-card__badge--'), 'cor custom não usa classe modificadora');
const corClara = buildProdutoCard({ nome: 'X', descricao: 'd', detalhes: [], imagem: 'a.webp', badge: 'Novo', badge_cor: '#F0BE4F' });
assert.ok(corClara.includes('color:#2E1A0E'), 'cor clara → texto escuro');
// cor inválida → cai no fallback do modificador antigo
const corRuim = buildProdutoCard({ nome: 'X', descricao: 'd', detalhes: [], imagem: 'a.webp', badge: 'Novo', badge_cor: 'red', badge_mod: 'gold' });
assert.ok(corRuim.includes('produto-card__badge--gold'), 'cor inválida cai no badge_mod');

// estoque: controla + 0 → "Esgotado"; controla + >0 ou não controla → sem esgotado
const esg = buildProdutoCard({ nome: 'X', descricao: 'd', detalhes: [], imagem: 'a.webp', estoque_ativo: true, estoque: 0 });
assert.ok(esg.includes('produto-card--esgotado') && esg.includes('>Esgotado<'), 'estoque 0 → Esgotado');
const comEstoque = buildProdutoCard({ nome: 'X', descricao: 'd', detalhes: [], imagem: 'a.webp', estoque_ativo: true, estoque: 3 });
assert.ok(!comEstoque.includes('produto-card--esgotado'), 'estoque >0 → sem Esgotado');
const semControle = buildProdutoCard({ nome: 'X', descricao: 'd', detalhes: [], imagem: 'a.webp', estoque_ativo: false, estoque: 0 });
assert.ok(!semControle.includes('produto-card--esgotado'), 'sem controle → sem Esgotado');

// galeria: com fotos adicionais → miniaturas + data-imgs com todas
const cardG = buildProdutoCard({ nome: 'Sela', descricao: 'd', detalhes: [], imagem: 'a.webp', imagens: ['b.webp', 'c.webp'] });
assert.ok(cardG.includes('produto-card__thumbs'), 'galeria: renderiza miniaturas');
assert.ok(cardG.includes('3 fotos'), 'galeria: contador de fotos (capa + 2)');
assert.ok(cardG.includes('a.webp') && cardG.includes('b.webp') && cardG.includes('c.webp'), 'galeria: todas as fotos no data-imgs');
assert.ok(/data-imgs="[^"]*&quot;/.test(cardG), 'galeria: data-imgs é JSON escapado (atributo seguro)');

// produto com 1 foto só → sem miniaturas, mas data-imgs tem a capa
const card1 = buildProdutoCard({ nome: 'Sela', descricao: 'd', detalhes: [], imagem: 'a.webp' });
assert.ok(!card1.includes('produto-card__thumbs'), '1 foto: sem miniaturas');
assert.ok(card1.includes('data-imgs='), '1 foto: ainda tem data-imgs (abre no lightbox)');

// categoria: destaque + slug no href + badge dark
const cardC = buildCategoriaCard({
  slug: 'cintos', titulo: 'Cintos', descricao: 'desc', imagem: 'x.webp',
  badge: 'Sob medida', badge_mod: 'dark', destaque: true,
});
assert.ok(cardC.includes('categoria-card--destaque'), 'classe destaque');
assert.ok(cardC.includes('catalogo.html?c=cintos#catContent'), 'href com slug');
assert.ok(cardC.includes('categoria-card__badge categoria-card__badge--dark'), 'badge dark');

console.log('OK — render: escape/XSS, sprite, wppLink, badges e href conferidos.');
