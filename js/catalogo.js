/**
 * Página de catálogo — lê categorias/produtos do Supabase e renderiza.
 * Mantém: tabs, deep-link ?c=, history.pushState/popstate, animação de entrada.
 */
import { fetchCategorias, fetchProdutos } from './catalogo-data.js';
import { buildProdutoCard, esc } from './catalogo-render.js';
import { isConfigured } from './supabase-client.js';
import { openLightbox } from './lightbox.js';

const tabsEl     = document.getElementById('catTabs');
const produtosEl = document.getElementById('catProdutos');
const tituloEl   = document.getElementById('catTitulo');
const countEl    = document.getElementById('catCount');

let categorias = [];

function showMensagem(txt) {
  tituloEl.textContent = '';
  countEl.textContent = '';
  produtosEl.innerHTML = `<p class="cat-aviso">${esc(txt)}</p>`;
}

function renderTabs(activeSlug) {
  tabsEl.innerHTML = categorias
    .map((c) => {
      const ativa = c.slug === activeSlug;
      return `<button class="cat-tab${ativa ? ' active' : ''}" role="tab" data-cat="${esc(c.slug)}" aria-selected="${ativa}">${esc(c.titulo)}</button>`;
    })
    .join('');
}

function scrollParaConteudo() {
  const tabsWrap = document.querySelector('.cat-tabs-wrap');
  if (!tabsWrap) return;
  const tabsBottom = tabsWrap.getBoundingClientRect().bottom + window.scrollY;
  if (window.scrollY > tabsBottom) {
    window.scrollTo({ top: tabsBottom - 10, behavior: 'smooth' });
  }
}

async function renderCategoria(slug, { push = true } = {}) {
  let cat = categorias.find((c) => c.slug === slug);
  if (!cat) cat = categorias[0];
  if (!cat) return;

  renderTabs(cat.slug);
  tituloEl.textContent = cat.titulo;
  countEl.textContent = 'Carregando…';
  document.title = `${cat.titulo} | Catálogo | Selaria & Casa de Couro Santos`;

  if (push) {
    const url = new URL(window.location.href);
    url.searchParams.set('c', cat.slug);
    history.pushState({ categoria: cat.slug }, '', url.toString());
  }

  let produtos;
  try {
    produtos = await fetchProdutos(cat.id);
  } catch (e) {
    countEl.textContent = '';
    produtosEl.innerHTML = `<p class="cat-aviso">Não foi possível carregar os produtos agora. Fale direto no WhatsApp que a Márcia te ajuda.</p>`;
    return;
  }

  const n = produtos.length;
  countEl.textContent = `${n} produto${n !== 1 ? 's' : ''} nesta categoria`;
  produtosEl.innerHTML = produtos.map(buildProdutoCard).join('');
  scrollParaConteudo();
}

tabsEl.addEventListener('click', (e) => {
  const tab = e.target.closest('.cat-tab');
  if (tab) renderCategoria(tab.dataset.cat);
});

// Galeria: clicar na foto/miniatura abre o lightbox
function abrirGaleria(trigger, index) {
  const card = trigger.closest('.produto-card');
  if (!card) return;
  let imgs = [];
  try { imgs = JSON.parse(card.dataset.imgs || '[]'); } catch { /* ignora */ }
  openLightbox(imgs, index, card.dataset.alt || '');
}
produtosEl.addEventListener('click', (e) => {
  const thumb = e.target.closest('.produto-card__thumb');
  if (thumb) { abrirGaleria(thumb, Number(thumb.dataset.i) || 0); return; }
  const zona = e.target.closest('[data-open]');
  if (zona) abrirGaleria(zona, Number(zona.dataset.open) || 0);
});
produtosEl.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const zona = e.target.closest('.produto-card__img-wrap--zoom');
  if (zona) { e.preventDefault(); abrirGaleria(zona, 0); }
});

window.addEventListener('popstate', (e) => {
  const slug =
    (e.state && e.state.categoria) ||
    new URLSearchParams(window.location.search).get('c') ||
    (categorias[0] && categorias[0].slug);
  if (slug) renderCategoria(slug, { push: false });
});

(async function init() {
  if (!isConfigured()) {
    showMensagem('Catálogo ainda não configurado. (Falta ligar o Supabase.)');
    return;
  }
  try {
    categorias = await fetchCategorias();
  } catch (e) {
    showMensagem('Não foi possível carregar o catálogo agora. Fale no WhatsApp que a Márcia te atende.');
    return;
  }
  if (!categorias.length) {
    showMensagem('Nenhuma categoria cadastrada ainda.');
    return;
  }
  const slugInicial = new URLSearchParams(window.location.search).get('c') || categorias[0].slug;
  renderCategoria(slugInicial, { push: false });
})();
