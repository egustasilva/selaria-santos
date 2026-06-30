/**
 * Painel ADM — login (Supabase Auth) + CRUD de categorias/produtos + upload de foto.
 * Escrita protegida por RLS no banco; aqui é só a interface.
 */
import { supabase, isConfigured } from './supabase-client.js';
import { esc } from './catalogo-render.js';

const $ = (id) => document.getElementById(id);
const BADGE_MODS = [
  { v: '', t: 'Sem cor' },
  { v: 'gold', t: 'Dourado' },
  { v: 'dark', t: 'Escuro' },
];

let categorias = [];
let produtos = [];

/* ---------------- helpers ---------------- */
function msg(el, texto, tipo) {
  el.className = `adm-msg adm-msg--${tipo}`;
  el.textContent = texto;
  el.hidden = !texto;
}
const slugify = (s) =>
  String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '');

function loadImage(file) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = URL.createObjectURL(file);
  });
}
async function compressToWebp(file, maxSide = 1000, quality = 0.8) {
  const img = await loadImage(file);
  let { width, height } = img;
  if (width >= height && width > maxSide) { height = Math.round((height * maxSide) / width); width = maxSide; }
  else if (height > width && height > maxSide) { width = Math.round((width * maxSide) / height); height = maxSide; }
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  canvas.getContext('2d').drawImage(img, 0, 0, width, height);
  return new Promise((res) => canvas.toBlob(res, 'image/webp', quality));
}
async function uploadImagem(file, prefix) {
  const blob = await compressToWebp(file);
  const path = `${prefix}/${crypto.randomUUID()}.webp`;
  const { error } = await supabase.storage.from('catalogo').upload(path, blob, { contentType: 'image/webp' });
  if (error) throw error;
  return supabase.storage.from('catalogo').getPublicUrl(path).data.publicUrl;
}

/* ---------------- auth ---------------- */
async function entrar(e) {
  e.preventDefault();
  $('loginErr').hidden = true;
  $('loginBtn').disabled = true;
  const { error } = await supabase.auth.signInWithPassword({ email: $('email').value, password: $('senha').value });
  $('loginBtn').disabled = false;
  if (error) msg($('loginErr'), 'E-mail ou senha incorretos.', 'err');
}
async function sair() { await supabase.auth.signOut(); }

function mostrarView(session) {
  const logado = !!session;
  $('loginView').hidden = logado;
  $('appView').hidden = !logado;
  if (logado) {
    $('admUser').textContent = session.user.email;
    carregarTudo();
  }
}

/* ---------------- carregar ---------------- */
async function carregarTudo() {
  try {
    const [c, p] = await Promise.all([
      supabase.from('categorias').select('*').order('ordem'),
      supabase.from('produtos').select('*').order('ordem'),
    ]);
    if (c.error) throw c.error;
    if (p.error) throw p.error;
    categorias = c.data;
    produtos = p.data;
    renderCategorias();
    renderProdutos();
  } catch (err) {
    msg($('globalMsg'), 'Erro ao carregar: ' + err.message, 'err');
  }
}

/* ---------------- categorias ---------------- */
function renderCategorias() {
  $('catLista').innerHTML = categorias.length
    ? categorias.map((c) => `
      <div class="adm-item">
        <img class="adm-item__thumb" src="${esc(c.imagem || '')}" alt="" onerror="this.style.visibility='hidden'" />
        <div class="adm-item__main">
          <div class="adm-item__title">${esc(c.titulo)}</div>
          <div class="adm-item__sub">${esc(c.slug)} · ordem ${c.ordem}</div>
        </div>
        <div class="adm-item__actions">
          <button class="adm-btn adm-btn--ghost" data-edit-cat="${esc(c.id)}">Editar</button>
          <button class="adm-btn adm-btn--danger" data-del-cat="${esc(c.id)}">Excluir</button>
        </div>
      </div>`).join('')
    : '<p class="adm-empty">Nenhuma categoria ainda.</p>';
}

function abrirFormCategoria(c = {}) {
  const opts = BADGE_MODS.map((m) => `<option value="${m.v}" ${(c.badge_mod || '') === m.v ? 'selected' : ''}>${m.t}</option>`).join('');
  const f = $('catForm');
  f.hidden = false;
  f.dataset.id = c.id || '';
  f.innerHTML = `
    <input type="hidden" name="imagem" value="${esc(c.imagem || '')}" />
    <div class="adm-row">
      <div class="adm-field"><label>Título</label><input name="titulo" value="${esc(c.titulo || '')}" required /></div>
      <div class="adm-field"><label>Slug (URL)</label><input name="slug" value="${esc(c.slug || '')}" required /></div>
    </div>
    <div class="adm-field"><label>Descrição (card da home)</label><textarea name="descricao">${esc(c.descricao || '')}</textarea></div>
    <div class="adm-row">
      <div class="adm-field"><label>Selo (opcional)</label><input name="badge" value="${esc(c.badge || '')}" /></div>
      <div class="adm-field"><label>Cor do selo</label><select name="badge_mod">${opts}</select></div>
    </div>
    <div class="adm-row">
      <div class="adm-field"><label>Ordem</label><input name="ordem" type="number" value="${Number(c.ordem) || 0}" /></div>
      <div class="adm-field adm-field--check"><input type="checkbox" name="destaque" id="catDestaque" ${c.destaque ? 'checked' : ''} /><label for="catDestaque" style="margin:0">Destaque (borda dourada)</label></div>
    </div>
    <div class="adm-field">
      <label>Foto de capa</label>
      <input type="file" name="foto" accept="image/*" />
      ${c.imagem ? `<img class="adm-preview" src="${esc(c.imagem)}" style="display:block" />` : ''}
    </div>
    <div class="adm-form__actions">
      <button type="submit" class="adm-btn">Salvar</button>
      <button type="button" class="adm-btn adm-btn--ghost" data-cancel>Cancelar</button>
    </div>`;
  f.querySelector('[name=titulo]').addEventListener('input', (e) => {
    const slug = f.querySelector('[name=slug]');
    if (!c.id && !slug.dataset.touched) slug.value = slugify(e.target.value);
  });
  f.querySelector('[name=slug]').addEventListener('input', (e) => (e.target.dataset.touched = '1'));
}

async function salvarCategoria(e) {
  e.preventDefault();
  const f = $('catForm');
  const fd = new FormData(f);
  const btn = f.querySelector('button[type=submit]');
  btn.disabled = true;
  try {
    let imagem = fd.get('imagem') || null;
    const foto = fd.get('foto');
    if (foto && foto.size) imagem = await uploadImagem(foto, 'categorias');
    const row = {
      titulo: fd.get('titulo').trim(),
      slug: slugify(fd.get('slug')),
      descricao: fd.get('descricao').trim() || null,
      badge: fd.get('badge').trim() || null,
      badge_mod: fd.get('badge_mod') || '',
      destaque: fd.get('destaque') === 'on',
      ordem: Number(fd.get('ordem')) || 0,
      imagem,
    };
    const id = f.dataset.id;
    const resp = id
      ? await supabase.from('categorias').update(row).eq('id', id)
      : await supabase.from('categorias').insert(row);
    if (resp.error) throw resp.error;
    f.hidden = true;
    msg($('globalMsg'), 'Categoria salva.', 'ok');
    await carregarTudo();
  } catch (err) {
    msg($('globalMsg'), 'Erro ao salvar categoria: ' + err.message, 'err');
  } finally {
    btn.disabled = false;
  }
}

async function excluirCategoria(id) {
  const cat = categorias.find((c) => c.id === id);
  if (!confirm(`Excluir a categoria "${cat ? cat.titulo : ''}"?`)) return;
  const { error } = await supabase.from('categorias').delete().eq('id', id);
  if (error) {
    const fk = error.code === '23503' || /foreign key|violates/i.test(error.message);
    msg($('globalMsg'), fk ? 'Essa categoria tem produtos. Exclua ou mova os produtos antes.' : 'Erro: ' + error.message, 'err');
    return;
  }
  msg($('globalMsg'), 'Categoria excluída.', 'ok');
  await carregarTudo();
}

/* ---------------- produtos ---------------- */
function nomeCategoria(id) {
  const c = categorias.find((x) => x.id === id);
  return c ? c.titulo : '—';
}

function renderProdutos() {
  $('prodLista').innerHTML = produtos.length
    ? produtos.map((p) => `
      <div class="adm-item">
        <img class="adm-item__thumb" src="${esc(p.imagem || '')}" alt="" onerror="this.style.visibility='hidden'" />
        <div class="adm-item__main">
          <div class="adm-item__title">${esc(p.nome)}</div>
          <div class="adm-item__sub">${esc(nomeCategoria(p.categoria_id))}</div>
        </div>
        <div class="adm-item__actions">
          <button class="adm-btn adm-btn--ghost" data-edit-prod="${esc(p.id)}">Editar</button>
          <button class="adm-btn adm-btn--danger" data-del-prod="${esc(p.id)}">Excluir</button>
        </div>
      </div>`).join('')
    : '<p class="adm-empty">Nenhum produto ainda.</p>';
}

function abrirFormProduto(p = {}) {
  const catOpts = categorias.map((c) => `<option value="${esc(c.id)}" ${p.categoria_id === c.id ? 'selected' : ''}>${esc(c.titulo)}</option>`).join('');
  const modOpts = BADGE_MODS.map((m) => `<option value="${m.v}" ${(p.badge_mod || '') === m.v ? 'selected' : ''}>${m.t}</option>`).join('');
  const f = $('prodForm');
  f.hidden = false;
  f.dataset.id = p.id || '';
  f.innerHTML = `
    <input type="hidden" name="imagem" value="${esc(p.imagem || '')}" />
    <div class="adm-row">
      <div class="adm-field"><label>Nome</label><input name="nome" value="${esc(p.nome || '')}" required /></div>
      <div class="adm-field"><label>Categoria</label><select name="categoria_id" required>${catOpts}</select></div>
    </div>
    <div class="adm-field"><label>Descrição</label><textarea name="descricao" required>${esc(p.descricao || '')}</textarea></div>
    <div class="adm-field"><label>Detalhes (um por linha)</label><textarea name="detalhes">${esc((p.detalhes || []).join('\n'))}</textarea></div>
    <div class="adm-row">
      <div class="adm-field"><label>Selo (opcional)</label><input name="badge" value="${esc(p.badge || '')}" /></div>
      <div class="adm-field"><label>Cor do selo</label><select name="badge_mod">${modOpts}</select></div>
    </div>
    <div class="adm-row">
      <div class="adm-field"><label>Ordem</label><input name="ordem" type="number" value="${Number(p.ordem) || 0}" /></div>
      <div class="adm-field">
        <label>Foto</label>
        <input type="file" name="foto" accept="image/*" />
      </div>
    </div>
    ${p.imagem ? `<img class="adm-preview" src="${esc(p.imagem)}" style="display:block" />` : ''}
    <div class="adm-form__actions">
      <button type="submit" class="adm-btn">Salvar</button>
      <button type="button" class="adm-btn adm-btn--ghost" data-cancel>Cancelar</button>
    </div>`;
}

async function salvarProduto(e) {
  e.preventDefault();
  const f = $('prodForm');
  const fd = new FormData(f);
  const btn = f.querySelector('button[type=submit]');
  btn.disabled = true;
  try {
    let imagem = fd.get('imagem') || null;
    const foto = fd.get('foto');
    if (foto && foto.size) imagem = await uploadImagem(foto, 'produtos');
    const row = {
      categoria_id: fd.get('categoria_id'),
      nome: fd.get('nome').trim(),
      descricao: fd.get('descricao').trim(),
      detalhes: fd.get('detalhes').split('\n').map((s) => s.trim()).filter(Boolean),
      badge: fd.get('badge').trim() || null,
      badge_mod: fd.get('badge_mod') || '',
      ordem: Number(fd.get('ordem')) || 0,
      imagem,
    };
    const id = f.dataset.id;
    const resp = id
      ? await supabase.from('produtos').update(row).eq('id', id)
      : await supabase.from('produtos').insert(row);
    if (resp.error) throw resp.error;
    f.hidden = true;
    msg($('globalMsg'), 'Produto salvo.', 'ok');
    await carregarTudo();
  } catch (err) {
    msg($('globalMsg'), 'Erro ao salvar produto: ' + err.message, 'err');
  } finally {
    btn.disabled = false;
  }
}

async function excluirProduto(id) {
  const p = produtos.find((x) => x.id === id);
  if (!confirm(`Excluir o produto "${p ? p.nome : ''}"?`)) return;
  const { error } = await supabase.from('produtos').delete().eq('id', id);
  if (error) { msg($('globalMsg'), 'Erro: ' + error.message, 'err'); return; }
  msg($('globalMsg'), 'Produto excluído.', 'ok');
  await carregarTudo();
}

/* ---------------- wiring ---------------- */
function init() {
  if (!isConfigured()) { $('naoConfig').hidden = false; return; }

  $('loginForm').addEventListener('submit', entrar);
  $('logoutBtn').addEventListener('click', sair);
  $('novaCategoria').addEventListener('click', () => abrirFormCategoria());
  $('novoProduto').addEventListener('click', () => {
    if (!categorias.length) { msg($('globalMsg'), 'Crie uma categoria antes de adicionar produtos.', 'err'); return; }
    abrirFormProduto();
  });
  $('catForm').addEventListener('submit', salvarCategoria);
  $('prodForm').addEventListener('submit', salvarProduto);

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-edit-cat],[data-del-cat],[data-edit-prod],[data-del-prod],[data-cancel]');
    if (!t) return;
    if (t.dataset.cancel !== undefined) { t.closest('form').hidden = true; return; }
    if (t.dataset.editCat) abrirFormCategoria(categorias.find((c) => c.id === t.dataset.editCat));
    else if (t.dataset.delCat) excluirCategoria(t.dataset.delCat);
    else if (t.dataset.editProd) abrirFormProduto(produtos.find((p) => p.id === t.dataset.editProd));
    else if (t.dataset.delProd) excluirProduto(t.dataset.delProd);
  });

  supabase.auth.getSession().then(({ data }) => mostrarView(data.session));
  supabase.auth.onAuthStateChange((_e, session) => mostrarView(session));
}

init();
