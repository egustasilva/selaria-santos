/**
 * Painel ADM — login (Supabase Auth) + CRUD de categorias/produtos.
 * Edição inline: o form abre dentro do próprio item. Escrita protegida por RLS.
 */
import { supabase, isConfigured } from './supabase-client.js';
import { esc } from './catalogo-render.js';

const $ = (id) => document.getElementById(id);
const MAX_FOTOS = 5;
const COR_SELO_PADRAO = '#7C4A2D';

// "?" com tooltip CSS (hover/foco mostra a função do campo)
const help = (txt) => ` <span class="adm-help" tabindex="0" role="img" aria-label="${esc(txt)}" data-tip="${esc(txt)}">?</span>`;

let categorias = [];
let produtos = [];
let fotos = []; // form de produto: [{url?, file?, preview}] — a 1ª é a capa

/* ---------------- helpers ---------------- */
function msg(el, texto, tipo) {
  el.className = `adm-msg adm-msg--${tipo}`;
  el.textContent = texto;
  el.hidden = !texto;
}
const slugify = (s) =>
  String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '');

// Toast fixo na tela (aparece onde a pessoa está, não no topo da página).
let toastEl, toastTimer;
function toast(texto, tipo = 'ok') {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.setAttribute('role', 'status');
    toastEl.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastEl);
  }
  toastEl.className = `adm-toast adm-toast--${tipo} show`;
  toastEl.textContent = texto;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3400);
}

// Mensagem amigável quando falta rodar uma migração (coluna inexistente).
function erroAmigavel(err) {
  const m = (err && err.message) || String(err);
  if (err?.code === '42703' || err?.code === 'PGRST204' || /could not find|schema cache|column .* does not exist/i.test(m)) {
    return 'Falta rodar uma migração no banco. Me chame aqui que eu te passo o SQL.';
  }
  return m;
}

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
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('Falha ao processar a imagem (tempo esgotado).')), 15000);
    canvas.toBlob((blob) => {
      clearTimeout(t);
      blob ? resolve(blob) : reject(new Error('Falha ao processar a imagem.'));
    }, 'image/webp', quality);
  });
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
    toast('Erro ao carregar: ' + err.message, 'err');
  }
}

/** Fecha qualquer form aberto (novo ou inline) redesenhando as listas. */
function fecharForms() {
  $('catNovoForm').innerHTML = '';
  $('prodNovoForm').innerHTML = '';
  renderCategorias();
  renderProdutos();
}

/* ---------------- categorias ---------------- */
function itemCategoria(c) {
  return `
    <div class="adm-item">
      <img class="adm-item__thumb" src="${esc(c.imagem || '')}" alt="" onerror="this.style.visibility='hidden'" />
      <div class="adm-item__main">
        <div class="adm-item__title">${esc(c.titulo)}</div>
        <div class="adm-item__sub">${esc(c.slug)} · ordem ${c.ordem}</div>
      </div>
      <div class="adm-item__actions">
        <button type="button" class="adm-btn adm-btn--ghost" data-edit-cat="${esc(c.id)}">Editar</button>
        <button type="button" class="adm-btn adm-btn--danger" data-del-cat="${esc(c.id)}">Excluir</button>
      </div>
    </div>`;
}

function renderCategorias() {
  $('catLista').innerHTML = categorias.length
    ? categorias.map((c) => `<div class="adm-item-wrap" data-id="${esc(c.id)}">${itemCategoria(c)}</div>`).join('')
    : '<p class="adm-empty">Nenhuma categoria ainda.</p>';
}

function formCategoriaHTML(c) {
  return `
    <input type="hidden" name="imagem" value="${esc(c.imagem || '')}" />
    <div class="adm-row">
      <div class="adm-field"><label>Título${help('Nome da categoria que aparece no site, ex: "Cintos".')}</label><input name="titulo" value="${esc(c.titulo || '')}" required /></div>
      <div class="adm-field"><label>Slug (URL)${help('Parte do endereço da categoria (só letras/números, sem espaço). Gerado do título automaticamente.')}</label><input name="slug" value="${esc(c.slug || '')}" required /></div>
    </div>
    <div class="adm-field"><label>Descrição${help('Texto curto do card da categoria na página inicial.')}</label><textarea name="descricao">${esc(c.descricao || '')}</textarea></div>
    <div class="adm-row">
      <div class="adm-field"><label>Selo (texto)${help('Etiqueta no canto do card, ex: "Mais pedido". Vazio = não mostra.')}</label><input name="badge" value="${esc(c.badge || '')}" /></div>
      <div class="adm-field"><label>Cor do selo${help('Cor de fundo da etiqueta. Só aparece se o selo tiver texto.')}</label><input type="color" name="badge_cor" value="${esc(c.badge_cor || COR_SELO_PADRAO)}" /></div>
    </div>
    <div class="adm-row">
      <div class="adm-field"><label>Ordem${help('Posição na lista. Menor número aparece primeiro.')}</label><input name="ordem" type="number" value="${Number(c.ordem) || 0}" /></div>
      <div class="adm-field adm-field--check"><input type="checkbox" name="destaque" id="catDestaque" ${c.destaque ? 'checked' : ''} /><label for="catDestaque" style="margin:0">Destaque (borda dourada)${help('Borda dourada no card pra chamar atenção.')}</label></div>
    </div>
    <div class="adm-field">
      <label>Foto de capa${help('Imagem do card. Melhor em paisagem (4:3). É comprimida automaticamente.')}</label>
      <input type="file" name="foto" accept="image/*" />
      ${c.imagem ? `<img class="adm-preview" src="${esc(c.imagem)}" style="display:block" />` : ''}
    </div>
    <div class="adm-form__actions">
      <button type="submit" class="adm-btn">Salvar</button>
      <button type="button" class="adm-btn adm-btn--ghost" data-cancel>Cancelar</button>
    </div>`;
}

function abrirFormCategoria(c = {}, novo = false) {
  fecharForms();
  const mount = novo ? $('catNovoForm') : document.querySelector(`#catLista .adm-item-wrap[data-id="${CSS.escape(c.id)}"]`);
  if (!mount) return;
  mount.innerHTML = `<form class="adm-form" data-tipo="cat" data-id="${esc(c.id || '')}">${formCategoriaHTML(c)}</form>`;
  const form = mount.querySelector('form');
  form.querySelector('[name=titulo]').addEventListener('input', (e) => {
    const slug = form.querySelector('[name=slug]');
    if (!c.id && !slug.dataset.touched) slug.value = slugify(e.target.value);
  });
  form.querySelector('[name=slug]').addEventListener('input', (e) => (e.target.dataset.touched = '1'));
  form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function salvarCategoria(f) {
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
      badge_cor: fd.get('badge').trim() ? fd.get('badge_cor') : null,
      destaque: fd.get('destaque') === 'on',
      ordem: Number(fd.get('ordem')) || 0,
      imagem,
    };
    const id = f.dataset.id;
    const resp = id
      ? await supabase.from('categorias').update(row).eq('id', id)
      : await supabase.from('categorias').insert(row);
    if (resp.error) throw resp.error;
    toast('Categoria salva.', 'ok');
    await carregarTudo();
  } catch (err) {
    toast('Erro ao salvar categoria: ' + erroAmigavel(err), 'err');
    btn.disabled = false;
  }
}

async function excluirCategoria(id) {
  const cat = categorias.find((c) => c.id === id);
  if (!confirm(`Excluir a categoria "${cat ? cat.titulo : ''}"?`)) return;
  const { error } = await supabase.from('categorias').delete().eq('id', id);
  if (error) {
    const fk = error.code === '23503' || /foreign key|violates/i.test(error.message);
    toast(fk ? 'Essa categoria tem produtos. Exclua ou mova os produtos antes.' : 'Erro: ' + error.message, 'err');
    return;
  }
  toast('Categoria excluída.', 'ok');
  await carregarTudo();
}

/* ---------------- produtos ---------------- */
function nomeCategoria(id) {
  const c = categorias.find((x) => x.id === id);
  return c ? c.titulo : '—';
}

function estoqueLabel(p) {
  if (!p.estoque_ativo) return '';
  return p.estoque > 0 ? ` · ${p.estoque} em estoque` : ' · ESGOTADO';
}

function itemProduto(p) {
  return `
    <div class="adm-item">
      <img class="adm-item__thumb" src="${esc(p.imagem || '')}" alt="" onerror="this.style.visibility='hidden'" />
      <div class="adm-item__main">
        <div class="adm-item__title">${esc(p.nome)}</div>
        <div class="adm-item__sub">${esc(nomeCategoria(p.categoria_id))}${estoqueLabel(p)}</div>
      </div>
      <div class="adm-item__actions">
        <button type="button" class="adm-btn adm-btn--ghost" data-edit-prod="${esc(p.id)}">Editar</button>
        <button type="button" class="adm-btn adm-btn--danger" data-del-prod="${esc(p.id)}">Excluir</button>
      </div>
    </div>`;
}

function renderProdutos() {
  $('prodLista').innerHTML = produtos.length
    ? produtos.map((p) => `<div class="adm-item-wrap" data-id="${esc(p.id)}">${itemProduto(p)}</div>`).join('')
    : '<p class="adm-empty">Nenhum produto ainda.</p>';
}

function renderFotos() {
  const box = $('prodFotos');
  if (!box) return;
  box.innerHTML = fotos.length
    ? fotos.map((f, i) => `
      <div class="adm-foto${i === 0 ? ' adm-foto--capa' : ''}">
        <img src="${esc(f.preview)}" alt="" />
        ${i === 0
          ? '<span class="adm-foto__tag">Capa</span>'
          : `<button type="button" class="adm-foto__cap" data-foto-capa="${i}" title="Tornar esta a capa">tornar capa</button>`}
        <button type="button" class="adm-foto__rm" data-foto-rm="${i}" aria-label="Remover foto" title="Remover">&times;</button>
      </div>`).join('')
    : '<p class="adm-hint">Nenhuma foto ainda. Clique em “+ Adicionar foto”.</p>';
  const add = $('addFoto');
  if (add) {
    const cheio = fotos.length >= MAX_FOTOS;
    add.disabled = cheio;
    add.textContent = cheio ? `Máximo de ${MAX_FOTOS} fotos` : `+ Adicionar foto (${fotos.length}/${MAX_FOTOS})`;
  }
}

function formProdutoHTML(p) {
  const catOpts = categorias.map((c) => `<option value="${esc(c.id)}" ${p.categoria_id === c.id ? 'selected' : ''}>${esc(c.titulo)}</option>`).join('');
  return `
    <div class="adm-row">
      <div class="adm-field"><label>Nome${help('Nome do produto que aparece no card, ex: "Cinto Liso".')}</label><input name="nome" value="${esc(p.nome || '')}" required /></div>
      <div class="adm-field"><label>Categoria${help('Em qual categoria o produto entra.')}</label><select name="categoria_id" required>${catOpts}</select></div>
    </div>
    <div class="adm-field"><label>Descrição${help('Texto que descreve o produto no card.')}</label><textarea name="descricao" required>${esc(p.descricao || '')}</textarea></div>
    <div class="adm-field"><label>Detalhes${help('Uma característica por linha — viram uma lista com traços no card.')}</label><textarea name="detalhes" placeholder="Couro legítimo&#10;Costura reforçada">${esc((p.detalhes || []).join('\n'))}</textarea></div>
    <div class="adm-row">
      <div class="adm-field"><label>Selo (texto)${help('Etiqueta no canto da foto, ex: "Novo". Vazio = não mostra.')}</label><input name="badge" value="${esc(p.badge || '')}" /></div>
      <div class="adm-field"><label>Cor do selo${help('Cor de fundo da etiqueta. Só aparece se o selo tiver texto.')}</label><input type="color" name="badge_cor" value="${esc(p.badge_cor || COR_SELO_PADRAO)}" /></div>
    </div>
    <div class="adm-row">
      <div class="adm-field adm-field--check"><input type="checkbox" name="estoque_ativo" id="estAtivo" ${p.estoque_ativo ? 'checked' : ''} /><label for="estAtivo" style="margin:0">Controlar estoque${help('Ligado: o site mostra "Esgotado" quando a quantidade chega a 0.')}</label></div>
      <div class="adm-field"><label>Quantidade em estoque${help('Só usado se "Controlar estoque" estiver ligado.')}</label><input name="estoque" type="number" min="0" value="${Number(p.estoque) || 0}" /></div>
    </div>
    <div class="adm-field" style="max-width:12rem"><label>Ordem${help('Posição na categoria. Menor aparece primeiro.')}</label><input name="ordem" type="number" value="${Number(p.ordem) || 0}" /></div>
    <div class="adm-field">
      <label>Fotos${help('A 1ª foto é a capa. Adicione até ' + MAX_FOTOS + '. Use "tornar capa" pra trocar a principal.')}</label>
      <div class="adm-fotos" id="prodFotos"></div>
      <input type="file" id="fotoInput" accept="image/*" multiple hidden />
      <button type="button" class="adm-btn adm-btn--ghost" id="addFoto">+ Adicionar foto</button>
    </div>
    <div class="adm-form__actions">
      <button type="submit" class="adm-btn">Salvar</button>
      <button type="button" class="adm-btn adm-btn--ghost" data-cancel>Cancelar</button>
    </div>`;
}

function abrirFormProduto(p = {}, novo = false) {
  fecharForms();
  const mount = novo ? $('prodNovoForm') : document.querySelector(`#prodLista .adm-item-wrap[data-id="${CSS.escape(p.id)}"]`);
  if (!mount) return;
  fotos.forEach((f) => { if (f.file) URL.revokeObjectURL(f.preview); }); // libera previews antigos
  fotos = [p.imagem, ...(p.imagens || [])].filter(Boolean).map((url) => ({ url, preview: url }));
  mount.innerHTML = `<form class="adm-form" data-tipo="prod" data-id="${esc(p.id || '')}">${formProdutoHTML(p)}</form>`;
  renderFotos();
  mount.querySelector('form').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function salvarProduto(f) {
  const fd = new FormData(f);
  const btn = f.querySelector('button[type=submit]');
  btn.disabled = true;
  try {
    // Fotos: sobe as novas (arquivo), mantém as existentes (url). A 1ª é a capa.
    const urls = [];
    for (const foto of fotos) {
      urls.push(foto.file ? await uploadImagem(foto.file, 'produtos') : foto.url);
    }
    const row = {
      categoria_id: fd.get('categoria_id'),
      nome: fd.get('nome').trim(),
      descricao: fd.get('descricao').trim(),
      detalhes: fd.get('detalhes').split('\n').map((s) => s.trim()).filter(Boolean),
      badge: fd.get('badge').trim() || null,
      badge_cor: fd.get('badge').trim() ? fd.get('badge_cor') : null,
      estoque_ativo: fd.get('estoque_ativo') === 'on',
      estoque: Number(fd.get('estoque')) || 0,
      ordem: Number(fd.get('ordem')) || 0,
      imagem: urls[0] || null,
      imagens: urls.slice(1),
    };
    const id = f.dataset.id;
    const resp = id
      ? await supabase.from('produtos').update(row).eq('id', id)
      : await supabase.from('produtos').insert(row);
    if (resp.error) throw resp.error;
    toast('Produto salvo.', 'ok');
    await carregarTudo();
  } catch (err) {
    toast('Erro ao salvar produto: ' + erroAmigavel(err), 'err');
    btn.disabled = false;
  }
}

async function excluirProduto(id) {
  const p = produtos.find((x) => x.id === id);
  if (!confirm(`Excluir o produto "${p ? p.nome : ''}"?`)) return;
  const { error } = await supabase.from('produtos').delete().eq('id', id);
  if (error) { toast('Erro: ' + error.message, 'err'); return; }
  toast('Produto excluído.', 'ok');
  await carregarTudo();
}

/* ---------------- exportar XLSX ---------------- */
function exportarXLSX() {
  const XLSX = window.XLSX;
  if (!XLSX) { toast('Biblioteca de planilha não carregou. Recarregue a página.', 'err'); return; }
  const catNome = Object.fromEntries(categorias.map((c) => [c.id, c.titulo]));
  const prodRows = produtos.map((p) => ({
    Categoria: catNome[p.categoria_id] || '',
    Nome: p.nome,
    Descrição: p.descricao,
    Detalhes: (p.detalhes || []).join(' | '),
    Selo: p.badge || '',
    Estoque: p.estoque_ativo ? p.estoque : '—',
    Ordem: p.ordem,
    Fotos: 1 + (p.imagens ? p.imagens.length : 0),
  }));
  const catRows = categorias.map((c) => ({
    Slug: c.slug, Título: c.titulo, Descrição: c.descricao || '',
    Selo: c.badge || '', Destaque: c.destaque ? 'sim' : '', Ordem: c.ordem,
  }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(prodRows), 'Produtos');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(catRows), 'Categorias');
  XLSX.writeFile(wb, 'catalogo-selaria.xlsx');
}

/* ---------------- wiring ---------------- */
function init() {
  if (!isConfigured()) { $('naoConfig').hidden = false; return; }

  $('loginForm').addEventListener('submit', entrar);
  $('logoutBtn').addEventListener('click', sair);
  $('exportBtn').addEventListener('click', exportarXLSX);
  $('novaCategoria').addEventListener('click', () => abrirFormCategoria({}, true));
  $('novoProduto').addEventListener('click', () => {
    if (!categorias.length) { toast('Crie uma categoria antes de adicionar produtos.', 'err'); return; }
    abrirFormProduto({}, true);
  });

  const app = $('appView');

  app.addEventListener('submit', (e) => {
    const form = e.target.closest('form.adm-form');
    if (!form) return;
    e.preventDefault();
    if (form.dataset.tipo === 'cat') salvarCategoria(form);
    else if (form.dataset.tipo === 'prod') salvarProduto(form);
  });

  app.addEventListener('click', (e) => {
    if (e.target.closest('[data-cancel]')) { fecharForms(); return; }
    if (e.target.closest('#addFoto')) { $('fotoInput').click(); return; }
    const rm = e.target.closest('[data-foto-rm]');
    if (rm) { const [x] = fotos.splice(Number(rm.dataset.fotoRm), 1); if (x && x.file) URL.revokeObjectURL(x.preview); renderFotos(); return; }
    const cap = e.target.closest('[data-foto-capa]');
    if (cap) { const i = Number(cap.dataset.fotoCapa); const [x] = fotos.splice(i, 1); fotos.unshift(x); renderFotos(); return; }
    const ec = e.target.closest('[data-edit-cat]');
    if (ec) { abrirFormCategoria(categorias.find((c) => c.id === ec.dataset.editCat)); return; }
    const dc = e.target.closest('[data-del-cat]');
    if (dc) { excluirCategoria(dc.dataset.delCat); return; }
    const ep = e.target.closest('[data-edit-prod]');
    if (ep) { abrirFormProduto(produtos.find((p) => p.id === ep.dataset.editProd)); return; }
    const dp = e.target.closest('[data-del-prod]');
    if (dp) { excluirProduto(dp.dataset.delProd); return; }
  });

  app.addEventListener('change', (e) => {
    if (e.target.id !== 'fotoInput') return;
    for (const file of e.target.files) {
      if (fotos.length >= MAX_FOTOS) break;
      fotos.push({ file, preview: URL.createObjectURL(file) });
    }
    e.target.value = '';
    renderFotos();
  });

  supabase.auth.getSession().then(({ data }) => mostrarView(data.session));
  supabase.auth.onAuthStateChange((_e, session) => mostrarView(session));
}

init();
