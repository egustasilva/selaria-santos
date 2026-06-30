/**
 * Gera db/seed.sql a partir dos dados atuais em js/catalogo.js.
 * Uso: node scripts/gen-seed.mjs > db/seed.sql
 *
 * Os produtos vêm do objeto CATEGORIAS (fonte versionada e confiável).
 * Os metadados de cada categoria (capa/descrição da home) ficam aqui porque
 * hoje vivem espalhados no index.html — centralizo no seed.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function loadCategorias() {
  const src = readFileSync(join(root, 'js/catalogo.js'), 'utf8');
  const start = src.indexOf('const CATEGORIAS');
  const open = src.indexOf('{', start);
  let depth = 0, end = -1;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}' && --depth === 0) { end = i; break; }
  }
  // eval seguro: entrada é literal do nosso próprio js/catalogo.js (encodeURIComponent é global).
  return eval('(' + src.slice(open, end + 1) + ')'); // eslint-disable-line no-eval
}

// Metadados de categoria (card da home) — espelham o index.html atual.
const CAT_META = {
  selas:     { descricao: 'Selas artesanais em couro legítimo, feitas à mão para durar anos.',     imagem: 'assets/images/sela.webp',         badge: 'Mais pedido', badge_mod: '',     destaque: false },
  arreios:   { descricao: 'Arreios completos e acessórios equestres em couro selecionado.',         imagem: 'assets/images/arreio.webp',       badge: '',            badge_mod: '',     destaque: false },
  cintos:    { descricao: 'Cintos em couro legítimo com bordados e acabamentos personalizados.',    imagem: 'assets/images/cinto.webp',        badge: 'Sob medida',  badge_mod: 'dark', destaque: false },
  bolsas:    { descricao: 'Bolsas, carteiras e porta-documentos com acabamento artesanal.',         imagem: 'assets/images/bolsa.webp',        badge: '',            badge_mod: '',     destaque: false },
  consertos: { descricao: 'Costura, reforço, restauração e hidratação de peças em couro.',          imagem: 'assets/images/conserto.webp',     badge: '',            badge_mod: '',     destaque: false },
  sobmedida: { descricao: 'Peças personalizadas do seu jeito, com seu nome e suas medidas.',        imagem: 'assets/images/personalizado.webp', badge: 'Especial',   badge_mod: 'gold', destaque: true  },
};

// badge_mod no banco é semântico: 'gold' | 'dark' | '' (o renderer monta a classe CSS).
const normMod = (v) => { const m = String(v || '').match(/--(\w+)$/); return m ? m[1] : ''; };
const q = (v) => (v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`);
const arr = (a) => `ARRAY[${a.map(q).join(', ')}]::text[]`;

const CAT = loadCategorias();
const out = [];
out.push('-- Gerado por scripts/gen-seed.mjs — NÃO editar à mão. Rode depois do schema.sql.');
out.push('-- Idempotente: limpa e recria os dados de catálogo.');
out.push('begin;');
out.push('delete from public.produtos;');
out.push('delete from public.categorias;');
out.push('');

let ordemCat = 0;
for (const [slug, cat] of Object.entries(CAT)) {
  ordemCat++;
  const m = CAT_META[slug] || {};
  out.push(
    `insert into public.categorias (slug, titulo, descricao, imagem, badge, badge_mod, destaque, ordem) values (` +
    `${q(slug)}, ${q(cat.titulo)}, ${q(m.descricao)}, ${q(m.imagem)}, ${q(m.badge || null)}, ${q(m.badge_mod || '')}, ${m.destaque ? 'true' : 'false'}, ${ordemCat});`
  );
}
out.push('');

for (const [slug, cat] of Object.entries(CAT)) {
  let ordem = 0;
  for (const p of cat.produtos) {
    ordem++;
    out.push(
      `insert into public.produtos (categoria_id, nome, descricao, detalhes, badge, badge_mod, imagem, ordem) values (` +
      `(select id from public.categorias where slug = ${q(slug)}), ` +
      `${q(p.nome)}, ${q(p.desc)}, ${arr(p.detalhes)}, ${q(p.badge || null)}, ${q(normMod(p.badgeMod))}, ${q(p.img)}, ${ordem});`
    );
  }
}
out.push('');
out.push('commit;');
console.log(out.join('\n'));
