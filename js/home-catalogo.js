/**
 * Grid de categorias da home — substitui os cards estáticos pelos do banco.
 * Se o Supabase não estiver configurado ou falhar, mantém os cards estáticos
 * do index.html (a home nunca fica vazia).
 */
import { fetchCategorias } from './catalogo-data.js';
import { buildCategoriaCard } from './catalogo-render.js';
import { isConfigured } from './supabase-client.js';

const grid = document.getElementById('categoriasGrid');

if (grid && isConfigured()) {
  fetchCategorias()
    .then((cats) => {
      if (!cats || !cats.length) return; // mantém fallback estático
      grid.innerHTML = cats.map(buildCategoriaCard).join('');
      // Cards inseridos depois do observer de reveal do main.js → torná-los visíveis.
      grid.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('revealed'));
    })
    .catch(() => {/* mantém os cards estáticos de fallback */});
}
