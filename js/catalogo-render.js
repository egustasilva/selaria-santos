/**
 * Render puro do catálogo (sem DOM, sem Supabase) — usado pela home, pela página
 * de catálogo e testável em Node.
 *
 * IMPORTANTE: os dados agora vêm do banco (escritos pelo ADM), então TODO texto
 * interpolado é escapado para evitar XSS armazenado que afetaria os visitantes.
 */
const WPP_NUM = '5512988520409';

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}

/** Link de WhatsApp com mensagem gerada a partir do nome do produto. */
export function wppLink(nome) {
  const msg = `Olá Márcia! Tenho interesse em ${nome}. Pode me passar mais informações?`;
  return `https://wa.me/${WPP_NUM}?text=${encodeURIComponent(msg)}`;
}

function badgeClass(base, mod) {
  return mod ? `${base} ${base}--${esc(mod)}` : base;
}

/** Card de produto (página de catálogo). Usa o sprite #ic-wpp já presente na página. */
export function buildProdutoCard(p) {
  const badge = p.badge
    ? `<div class="${badgeClass('produto-card__badge', p.badge_mod)}">${esc(p.badge)}</div>`
    : '';
  const detalhes = (p.detalhes || []).map((d) => `<li>${esc(d)}</li>`).join('');

  // Galeria = capa + fotos adicionais. Abre no lightbox (wiring em catalogo.js).
  const galeria = [p.imagem, ...(p.imagens || [])].filter(Boolean);
  const multi = galeria.length > 1;
  const imgsAttr = esc(JSON.stringify(galeria));
  const thumbs = multi
    ? `<div class="produto-card__thumbs">${galeria
        .slice(0, 4)
        .map((src, i) => `<button type="button" class="produto-card__thumb" data-i="${i}" aria-label="Ver foto ${i + 1}"><img src="${esc(src)}" alt="" loading="lazy" /></button>`)
        .join('')}${galeria.length > 4 ? `<span class="produto-card__more">+${galeria.length - 4}</span>` : ''}</div>`
    : '';

  return `
    <article class="produto-card" data-imgs="${imgsAttr}" data-alt="${esc(p.nome)}">
      <div class="produto-card__img-wrap produto-card__img-wrap--zoom" data-open="0" role="button" tabindex="0" aria-label="Ampliar foto de ${esc(p.nome)}">
        <img src="${esc(p.imagem)}" alt="${esc(p.nome)}" class="produto-card__img" loading="lazy"
             onerror="this.closest('.produto-card__img-wrap').classList.add('img-placeholder')" />
        ${badge}
        ${multi ? `<span class="produto-card__gcount" aria-hidden="true">${galeria.length} fotos</span>` : ''}
      </div>
      ${thumbs}
      <div class="produto-card__body">
        <h3 class="produto-card__title">${esc(p.nome)}</h3>
        <p class="produto-card__desc">${esc(p.descricao)}</p>
        <ul class="produto-card__details">${detalhes}</ul>
        <a href="${esc(wppLink(p.nome))}" class="btn btn--produto" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><use href="#ic-wpp"/></svg>
          Tenho interesse
        </a>
      </div>
    </article>`;
}

/** Card de categoria (grid da home). Linka para a página de catálogo. */
export function buildCategoriaCard(c) {
  const destaque = c.destaque ? ' categoria-card--destaque' : '';
  const badge = c.badge
    ? `<div class="${badgeClass('categoria-card__badge', c.badge_mod)}">${esc(c.badge)}</div>`
    : '';
  const arrow = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
  return `
    <a class="categoria-card${destaque}" data-reveal href="catalogo.html?c=${encodeURIComponent(c.slug)}#catContent" aria-label="Ver produtos de ${esc(c.titulo)}">
      <div class="categoria-card__img-wrap">
        <img src="${esc(c.imagem)}" alt="${esc(c.titulo)}" class="categoria-card__img" loading="lazy"
             onerror="this.closest('.categoria-card__img-wrap').classList.add('img-placeholder')" />
        ${badge}
        <div class="categoria-card__overlay" aria-hidden="true">
          <span class="categoria-card__ver">Ver produtos ${arrow}</span>
        </div>
      </div>
      <div class="categoria-card__body">
        <h3 class="categoria-card__title">${esc(c.titulo)}</h3>
        <p class="categoria-card__desc">${esc(c.descricao)}</p>
      </div>
    </a>`;
}
