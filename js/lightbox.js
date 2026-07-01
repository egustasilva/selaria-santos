/**
 * Lightbox mínimo (vanilla) para galeria de fotos do produto.
 * openLightbox([urls], startIndex, alt) — Esc fecha, ← → navegam, clique fora fecha.
 */
let el, imgEl, countEl, imgs = [], idx = 0;

function ensure() {
  if (el) return;
  el = document.createElement('div');
  el.className = 'lightbox';
  el.hidden = true;
  el.innerHTML = `
    <button class="lightbox__close" type="button" aria-label="Fechar">&times;</button>
    <button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Foto anterior">&#8249;</button>
    <img class="lightbox__img" alt="" />
    <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Próxima foto">&#8250;</button>
    <div class="lightbox__count" aria-hidden="true"></div>`;
  document.body.appendChild(el);
  imgEl = el.querySelector('.lightbox__img');
  countEl = el.querySelector('.lightbox__count');
  el.querySelector('.lightbox__close').addEventListener('click', close);
  el.querySelector('.lightbox__nav--prev').addEventListener('click', (e) => { e.stopPropagation(); go(-1); });
  el.querySelector('.lightbox__nav--next').addEventListener('click', (e) => { e.stopPropagation(); go(1); });
  el.addEventListener('click', (e) => { if (e.target === el) close(); });
  document.addEventListener('keydown', onKey);
}

function onKey(e) {
  if (!el || el.hidden) return;
  if (e.key === 'Escape') close();
  else if (e.key === 'ArrowLeft') go(-1);
  else if (e.key === 'ArrowRight') go(1);
}

function show() {
  imgEl.src = imgs[idx];
  const multi = imgs.length > 1;
  el.querySelectorAll('.lightbox__nav').forEach((n) => { n.hidden = !multi; });
  countEl.textContent = multi ? `${idx + 1}/${imgs.length}` : '';
}

function go(d) {
  idx = (idx + d + imgs.length) % imgs.length;
  show();
}

function close() {
  if (!el) return;
  el.hidden = true;
  document.body.style.overflow = '';
  imgEl.src = '';
}

export function openLightbox(list, start = 0, alt = '') {
  const clean = (list || []).filter(Boolean);
  if (!clean.length) return;
  ensure();
  imgs = clean;
  idx = Math.max(0, Math.min(start, clean.length - 1));
  imgEl.alt = alt || '';
  el.hidden = false;
  document.body.style.overflow = 'hidden';
  show();
}
