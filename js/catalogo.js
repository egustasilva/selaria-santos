/**
 * Selaria & Casa de Couro Santos
 * catalogo.js — Lógica da página de catálogo
 *
 * Responsabilidades:
 *  - Ler ?c= da URL para exibir a categoria certa ao carregar
 *  - Renderizar os cards de produto da categoria ativa
 *  - Trocar de categoria ao clicar nas tabs (sem recarregar)
 *  - Atualizar a URL com history.pushState ao trocar de aba
 */

(function () {
  'use strict';

  /* ----------------------------------------------------------------
     CONSTANTES
  ---------------------------------------------------------------- */
  const WPP_BASE = 'https://wa.me/5512988520409?text=';

  const WPP_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

  /* ----------------------------------------------------------------
     DADOS DO CATÁLOGO
  ---------------------------------------------------------------- */
  const CATEGORIAS = {

    selas: {
      titulo: 'Selas',
      produtos: [
        {
          nome: 'Sela de Vaqueiro',
          img: 'assets/images/sela.jpg',
          desc: 'Sela artesanal estilo vaqueiro, em couro curtido de alta resistência. Trabalhada à mão para encaixe perfeito e durabilidade excepcional.',
          detalhes: ['Couro curtido de alta resistência', 'Acabamento manual caprichado', 'Ajuste personalizado disponível'],
          badge: 'Mais pedido',
          badgeMod: '',
          wpp: encodeURIComponent('Olá Márcia! Tenho interesse em uma SELA DE VAQUEIRO. Pode me dar mais informações sobre modelos e preços?'),
        },
        {
          nome: 'Sela Inglesa',
          img: 'assets/images/sela.jpg',
          desc: 'Sela no estilo inglês, leve e de encaixe preciso. Ideal para hipismo e equitação clássica com couro de primeira linha.',
          detalhes: ['Couro macio e resistente', 'Design clássico e elegante', 'Pode ser feita sob medida'],
          badge: '',
          badgeMod: '',
          wpp: encodeURIComponent('Olá Márcia! Tenho interesse em uma SELA INGLESA. Quais modelos vocês têm disponíveis?'),
        },
        {
          nome: 'Sela Personalizada',
          img: 'assets/images/personalizado.jpg',
          desc: 'Sela 100% personalizada conforme suas especificações: medidas, acabamentos, gravações e cor do couro do seu jeito.',
          detalhes: ['Projeto junto com o cliente', 'Gravação e bordado opcional', 'Medidas exatas do cavaleiro'],
          badge: 'Sob medida',
          badgeMod: 'produto-card__badge--gold',
          wpp: encodeURIComponent('Olá Márcia! Gostaria de encomendar uma SELA PERSONALIZADA. Posso te contar o que tenho em mente?'),
        },
      ]
    },

    arreios: {
      titulo: 'Arreios',
      produtos: [
        {
          nome: 'Arreio Completo',
          img: 'assets/images/arreio.jpg',
          desc: 'Conjunto completo de arreio em couro selecionado, com todas as peças necessárias para equipar seu animal com segurança e durabilidade.',
          detalhes: ['Couro curtido e selecionado', 'Peças costuradas a mão', 'Ferragens de qualidade'],
          badge: '',
          badgeMod: '',
          wpp: encodeURIComponent('Olá Márcia! Tenho interesse em um ARREIO COMPLETO. Pode me passar informações sobre modelos e preços?'),
        },
        {
          nome: 'Cabeçada',
          img: 'assets/images/arreio.jpg',
          desc: 'Cabeçadas em couro legítimo para cavalos e outros animais. Resistentes, confortáveis e com acabamento artesanal.',
          detalhes: ['Vários tamanhos disponíveis', 'Ajuste regulável', 'Gravação do nome do animal'],
          badge: '',
          badgeMod: '',
          wpp: encodeURIComponent('Olá Márcia! Tenho interesse em uma CABEÇADA de couro. Quais opções vocês têm?'),
        },
        {
          nome: 'Rédeas e Acessórios',
          img: 'assets/images/arreio.jpg',
          desc: 'Rédeas, peitorais, grupeiras e demais acessórios equestres feitos com o mesmo cuidado e qualidade de toda a nossa linha.',
          detalhes: ['Diversos modelos', 'Material resistente', 'Pode complementar seu arreio'],
          badge: '',
          badgeMod: '',
          wpp: encodeURIComponent('Olá Márcia! Tenho interesse em RÉDEAS E ACESSÓRIOS equestres. O que vocês têm disponível?'),
        },
      ]
    },

    cintos: {
      titulo: 'Cintos',
      produtos: [
        {
          nome: 'Cinto Liso',
          img: 'assets/images/cinto.jpg',
          desc: 'Cinto em couro legítimo com acabamento liso e elegante. Disponível em diversas espessuras e larguras, com fivela a escolher.',
          detalhes: ['Couro legítimo nacional', 'Fivelas em diversas opções', 'Sob medida sem custo extra'],
          badge: 'Sob medida',
          badgeMod: 'produto-card__badge--dark',
          wpp: encodeURIComponent('Olá Márcia! Tenho interesse em um CINTO LISO de couro. Quais modelos e preços vocês têm?'),
        },
        {
          nome: 'Cinto com Bordado',
          img: 'assets/images/cinto.jpg',
          desc: 'Cinto artesanal com bordado e trabalhos manuais exclusivos. Cada peça é única — um verdadeiro objeto de artesanato.',
          detalhes: ['Bordados feitos à mão', 'Motivos personalizados', 'Presente sofisticado'],
          badge: 'Artesanal',
          badgeMod: '',
          wpp: encodeURIComponent('Olá Márcia! Tenho interesse em um CINTO COM BORDADO. Podem fazer personalizado?'),
        },
        {
          nome: 'Cinto de Montaria',
          img: 'assets/images/cinto.jpg',
          desc: 'Cinturão robusto de montaria, com couro mais espesso e fivela reforçada. Feito para aguentar o trabalho pesado no campo.',
          detalhes: ['Couro espesso e resistente', 'Fivela reforçada', 'Ideal para o trabalho no campo'],
          badge: '',
          badgeMod: '',
          wpp: encodeURIComponent('Olá Márcia! Tenho interesse em um CINTO DE MONTARIA. Quais opções vocês têm?'),
        },
      ]
    },

    bolsas: {
      titulo: 'Bolsas & Acessórios',
      produtos: [
        {
          nome: 'Bolsa de Couro',
          img: 'assets/images/bolsa.jpg',
          desc: 'Bolsas femininas e masculinas em couro legítimo, com costura manual e acabamento caprichado. Durabilidade de décadas.',
          detalhes: ['Couro legítimo de qualidade', 'Costura manual reforçada', 'Vários modelos e tamanhos'],
          badge: '',
          badgeMod: '',
          wpp: encodeURIComponent('Olá Márcia! Tenho interesse em uma BOLSA DE COURO. Quais modelos vocês têm disponíveis?'),
        },
        {
          nome: 'Carteira & Porta-documentos',
          img: 'assets/images/bolsa.jpg',
          desc: 'Carteiras, porta-documentos e pequenos acessórios em couro fino. Práticos, elegantes e com longa vida útil.',
          detalhes: ['Couro fino e macio', 'Compartimentos bem organizados', 'Gravação do nome possível'],
          badge: '',
          badgeMod: '',
          wpp: encodeURIComponent('Olá Márcia! Tenho interesse em uma CARTEIRA ou PORTA-DOCUMENTOS de couro. O que vocês têm?'),
        },
        {
          nome: 'Acessórios de Montaria',
          img: 'assets/images/bolsa.jpg',
          desc: 'Alforjes, porta-garrafas, saca-coisas e outros acessórios de montaria feitos para durar muito mais que os industrializados.',
          detalhes: ['Feitos para uso intenso', 'Material selecionado', 'Sob medida disponível'],
          badge: '',
          badgeMod: '',
          wpp: encodeURIComponent('Olá Márcia! Tenho interesse em ACESSÓRIOS DE MONTARIA de couro. O que vocês fazem?'),
        },
      ]
    },

    consertos: {
      titulo: 'Consertos & Restauração',
      produtos: [
        {
          nome: 'Conserto de Selas e Arreios',
          img: 'assets/images/conserto.jpg',
          desc: 'Sua sela ou arreio com costura solta, couro ressecado ou ferragem quebrada? A Márcia resolve com o mesmo capricho de uma peça nova.',
          detalhes: ['Costura e reforço de peças', 'Troca de fivelas e ferragens', 'Avaliação sem compromisso'],
          badge: '',
          badgeMod: '',
          wpp: encodeURIComponent('Olá Márcia! Preciso consertar uma SELA ou ARREIO. Vocês fazem? Gostaria de saber o processo.'),
        },
        {
          nome: 'Restauração de Peças Antigas',
          img: 'assets/images/conserto.jpg',
          desc: 'Tem aquela peça com história que merecia uma segunda vida? Restauração de peças antigas em couro, com respeito pela originalidade.',
          detalhes: ['Restauração cuidadosa', 'Hidratação e limpeza profunda', 'Peças com valor sentimental'],
          badge: 'Especial',
          badgeMod: 'produto-card__badge--gold',
          wpp: encodeURIComponent('Olá Márcia! Tenho uma PEÇA ANTIGA de couro que gostaria de restaurar. Vocês fazem?'),
        },
        {
          nome: 'Conserto de Cintos e Bolsas',
          img: 'assets/images/conserto.jpg',
          desc: 'Cinto desgastado, bolsa com alça solta ou fivela partida? Trazemos de volta ao estado original sem a dor de jogar fora uma boa peça.',
          detalhes: ['Troca de alças e fechos', 'Reforço de pontos fracos', 'Hidratação e acabamento'],
          badge: '',
          badgeMod: '',
          wpp: encodeURIComponent('Olá Márcia! Preciso consertar um CINTO ou BOLSA de couro. Vocês fazem esse tipo de serviço?'),
        },
      ]
    },

    sobmedida: {
      titulo: 'Sob Medida',
      produtos: [
        {
          nome: 'Cinto para Coluna',
          img: 'assets/images/Cinto%20coluna.jpg',
          desc: 'Cinto ortopédico em couro legítimo para suporte lombar. Acabamento artesanal com costura reforçada, interior acolchoado e fivela metálica — feito sob medida para o seu conforto.',
          detalhes: ['Couro legítimo com costura reforçada', 'Interior acolchoado para conforto', 'Medidas personalizadas'],
          badge: 'Sob medida',
          badgeMod: 'produto-card__badge--gold',
          wpp: encodeURIComponent('Olá Márcia! Tenho interesse no CINTO PARA COLUNA de couro. Pode me passar mais informações e valores?'),
        },
        {
          nome: 'Peça Personalizada',
          img: 'assets/images/personalizado.jpg',
          desc: 'Tem uma ideia na cabeça? A Márcia faz. Descreva o que você quer — o couro, o tamanho, os detalhes — e receba uma peça única.',
          detalhes: ['Projeto junto com o cliente', 'Gravação e bordado personalizado', 'Presente com significado'],
          badge: 'Especial',
          badgeMod: 'produto-card__badge--gold',
          wpp: encodeURIComponent('Olá Márcia! Tenho interesse em uma PEÇA SOB MEDIDA. Posso te contar o que tenho em mente?'),
        },
        {
          nome: 'Presente Personalizado',
          img: 'assets/images/personalizado.jpg',
          desc: 'Um presente em couro com o nome da pessoa, uma data especial ou um brasão de família. Algo que vai durar e ser lembrado.',
          detalhes: ['Gravação de nomes e datas', 'Embalagem especial disponível', 'Prazo combinado com antecedência'],
          badge: 'Presente',
          badgeMod: '',
          wpp: encodeURIComponent('Olá Márcia! Quero fazer um PRESENTE PERSONALIZADO de couro. Pode me ajudar?'),
        },
        {
          nome: 'Encomenda Especial',
          img: 'assets/images/personalizado.jpg',
          desc: 'Peças fora do padrão — tamanhos especiais, combinações incomuns, projetos únicos. Se é de couro, a Márcia sente, analisa e faz.',
          detalhes: ['Sem limitação de modelo', 'Consulta gratuita por WhatsApp', 'Orçamento sem compromisso'],
          badge: '',
          badgeMod: '',
          wpp: encodeURIComponent('Olá Márcia! Tenho uma ENCOMENDA ESPECIAL e gostaria de conversar sobre o projeto.'),
        },
      ]
    },

  };

  /* ----------------------------------------------------------------
     SELETORES
  ---------------------------------------------------------------- */
  const tabs        = document.querySelectorAll('.cat-tab');
  const produtosEl  = document.getElementById('catProdutos');
  const tituloEl    = document.getElementById('catTitulo');
  const countEl     = document.getElementById('catCount');

  /* ----------------------------------------------------------------
     CONSTRUTOR DE CARD
  ---------------------------------------------------------------- */
  function buildCard(p) {
    return `
      <article class="produto-card">
        <div class="produto-card__img-wrap">
          <img
            src="${p.img}"
            alt="${p.nome}"
            class="produto-card__img"
            loading="lazy"
            onerror="this.closest('.produto-card__img-wrap').classList.add('img-placeholder')"
          />
          ${p.badge
            ? `<div class="produto-card__badge ${p.badgeMod}">${p.badge}</div>`
            : ''}
        </div>
        <div class="produto-card__body">
          <h3 class="produto-card__title">${p.nome}</h3>
          <p class="produto-card__desc">${p.desc}</p>
          <ul class="produto-card__details">
            ${p.detalhes.map(d => `<li>${d}</li>`).join('')}
          </ul>
          <a
            href="${WPP_BASE}${p.wpp}"
            class="btn btn--produto"
            target="_blank"
            rel="noopener noreferrer"
          >
            ${WPP_SVG} Tenho interesse
          </a>
        </div>
      </article>`;
  }

  /* ----------------------------------------------------------------
     RENDERIZAR CATEGORIA
  ---------------------------------------------------------------- */
  function renderCategoria(slug) {
    const cat = CATEGORIAS[slug];
    if (!cat) {
      // Slug inválido: cai na primeira categoria disponível
      const primeiroSlug = Object.keys(CATEGORIAS)[0];
      renderCategoria(primeiroSlug);
      return;
    }

    // Atualiza título e contagem
    tituloEl.textContent = cat.titulo;
    const n = cat.produtos.length;
    countEl.textContent = `${n} produto${n !== 1 ? 's' : ''} nesta categoria`;

    // Injeta cards (forçar reflow para a animação reiniciar)
    produtosEl.innerHTML = '';
    // pequeno timeout para o browser registrar a mudança antes da animação
    requestAnimationFrame(() => {
      produtosEl.innerHTML = cat.produtos.map(buildCard).join('');
    });

    // Atualiza tabs
    tabs.forEach(tab => {
      const isActive = tab.dataset.cat === slug;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });

    // Atualiza <title> da aba do navegador
    document.title = `${cat.titulo} | Catálogo | Selaria & Casa de Couro Santos`;

    // Atualiza URL sem recarregar a página
    const url = new URL(window.location.href);
    url.searchParams.set('c', slug);
    history.pushState({ categoria: slug }, '', url.toString());

    // Scroll suave até a área de conteúdo (sem ultrapassar as tabs)
    const tabsWrap = document.querySelector('.cat-tabs-wrap');
    if (tabsWrap) {
      const tabsBottom = tabsWrap.getBoundingClientRect().bottom + window.scrollY;
      if (window.scrollY > tabsBottom) {
        window.scrollTo({ top: tabsBottom - 10, behavior: 'smooth' });
      }
    }
  }

  /* ----------------------------------------------------------------
     INICIALIZAÇÃO — lê ?c= da URL
  ---------------------------------------------------------------- */
  const params     = new URLSearchParams(window.location.search);
  const slugInicial = params.get('c') || Object.keys(CATEGORIAS)[0];
  renderCategoria(slugInicial);

  /* ----------------------------------------------------------------
     EVENTOS DE TAB
  ---------------------------------------------------------------- */
  tabs.forEach(tab => {
    tab.addEventListener('click', () => renderCategoria(tab.dataset.cat));
  });

  /* ----------------------------------------------------------------
     NAVEGAÇÃO COM BOTÃO VOLTAR/AVANÇAR DO BROWSER
  ---------------------------------------------------------------- */
  window.addEventListener('popstate', (e) => {
    const slug = (e.state && e.state.categoria)
      ? e.state.categoria
      : new URLSearchParams(window.location.search).get('c')
      || Object.keys(CATEGORIAS)[0];
    renderCategoria(slug);
  });

  /* ----------------------------------------------------------------
     LAZY LOAD FALLBACK — placeholder para imagens de produto
  ---------------------------------------------------------------- */
  produtosEl.addEventListener('error', function (e) {
    if (e.target.tagName === 'IMG') {
      const wrap = e.target.closest('.produto-card__img-wrap');
      if (wrap) {
        wrap.classList.add('img-placeholder');
        e.target.style.display = 'none';
      }
    }
  }, true);

})();