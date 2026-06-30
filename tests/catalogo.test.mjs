/**
 * Teste mínimo do caminho crítico do catálogo (sem framework — node tests/catalogo.test.mjs).
 * Garante que:
 *   1. cada categoria tem título + ao menos 1 produto com os campos que buildCard usa;
 *   2. toda imagem referenciada existe em assets/ (pega imagem movida/renomeada por engano);
 *   3. as tabs do catalogo.html batem 1-a-1 com as chaves de CATEGORIAS (sem desync).
 */
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Extrai o literal CATEGORIAS do catalogo.js e avalia (encodeURIComponent é global no Node).
function loadCategorias() {
  const src = readFileSync(join(root, 'js/catalogo.js'), 'utf8');
  const start = src.indexOf('const CATEGORIAS');
  assert.ok(start !== -1, 'CATEGORIAS não encontrado em catalogo.js');
  const open = src.indexOf('{', start);
  let depth = 0, end = -1;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}' && --depth === 0) { end = i; break; }
  }
  assert.ok(end !== -1, 'literal CATEGORIAS sem chave de fechamento');
  // eval é seguro aqui: a entrada é um literal do nosso próprio js/catalogo.js
  // (fonte versionada e confiável), não input externo. JSON.parse não serve
  // porque o literal usa chamadas encodeURIComponent(...).
  return eval('(' + src.slice(open, end + 1) + ')'); // eslint-disable-line no-eval
}

// Slugs das tabs no HTML (data-cat="...").
function loadTabSlugs() {
  const html = readFileSync(join(root, 'catalogo.html'), 'utf8');
  return [...html.matchAll(/data-cat="([^"]+)"/g)].map((m) => m[1]);
}

const CATEGORIAS = loadCategorias();
const slugs = Object.keys(CATEGORIAS);
assert.ok(slugs.length > 0, 'nenhuma categoria');

let produtos = 0;
for (const [slug, cat] of Object.entries(CATEGORIAS)) {
  assert.ok(cat.titulo && typeof cat.titulo === 'string', `${slug}: título ausente`);
  assert.ok(Array.isArray(cat.produtos) && cat.produtos.length > 0, `${slug}: sem produtos`);
  for (const p of cat.produtos) {
    produtos++;
    for (const campo of ['nome', 'img', 'desc', 'wpp']) {
      assert.ok(p[campo] && typeof p[campo] === 'string', `${slug}/${p.nome || '?'}: campo "${campo}" ausente`);
    }
    assert.ok(Array.isArray(p.detalhes) && p.detalhes.length > 0, `${slug}/${p.nome}: sem detalhes`);
    assert.ok(existsSync(join(root, p.img)), `${slug}/${p.nome}: imagem não existe -> ${p.img}`);
  }
}

// Paridade tabs <-> dados (nas duas direções).
const tabs = loadTabSlugs();
assert.deepEqual([...tabs].sort(), [...slugs].sort(), 'tabs do HTML não batem com as chaves de CATEGORIAS');

console.log(`OK — ${slugs.length} categorias, ${produtos} produtos, ${tabs.length} tabs, imagens existem.`);
