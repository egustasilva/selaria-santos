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

// categoria: destaque + slug no href + badge dark
const cardC = buildCategoriaCard({
  slug: 'cintos', titulo: 'Cintos', descricao: 'desc', imagem: 'x.webp',
  badge: 'Sob medida', badge_mod: 'dark', destaque: true,
});
assert.ok(cardC.includes('categoria-card--destaque'), 'classe destaque');
assert.ok(cardC.includes('catalogo.html?c=cintos#catContent'), 'href com slug');
assert.ok(cardC.includes('categoria-card__badge categoria-card__badge--dark'), 'badge dark');

console.log('OK — render: escape/XSS, sprite, wppLink, badges e href conferidos.');
