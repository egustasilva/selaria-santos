/**
 * Selaria & Casa de Couro Santos
 * script.js — Interatividade principal
 */

(function () {
  'use strict';

  /* ----------------------------------------------------------------
     SELETORES
  ---------------------------------------------------------------- */
  const header   = document.getElementById('header');
  const burger   = document.getElementById('burger');
  const nav      = document.getElementById('nav');
  const reveals  = document.querySelectorAll('[data-reveal]');
  const navLinks = document.querySelectorAll('.nav__link');

  /* ----------------------------------------------------------------
     HEADER — SCROLL EFFECT
  ---------------------------------------------------------------- */
  function handleHeaderScroll() {
    header.classList.toggle('scrolled', window.scrollY > 80);
  }
  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ----------------------------------------------------------------
     MENU MOBILE — FIX: nav usa position:fixed com top:0 + padding-top
     para que o posicionamento não dependa do scroll atual.
  ---------------------------------------------------------------- */
  function toggleMenu(forceClose) {
    const isOpen = nav.classList.contains('open');
    const shouldOpen = (forceClose === true) ? false : !isOpen;

    nav.classList.toggle('open', shouldOpen);
    burger.classList.toggle('active', shouldOpen);
    burger.setAttribute('aria-expanded', String(shouldOpen));
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  }

  burger.addEventListener('click', () => toggleMenu());

  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(true));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      toggleMenu(true);
      burger.focus();
    }
  });

  /* ----------------------------------------------------------------
     SCROLL SUAVE — LINKS ÂNCORA
  ---------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const headerH = header.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  /* ----------------------------------------------------------------
     REVEAL ON SCROLL — INTERSECTION OBSERVER
  ---------------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => revealObserver.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('revealed'));
  }

  /* ----------------------------------------------------------------
     ACTIVE NAV LINK
  ---------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
              link.style.color = link.getAttribute('href') === `#${id}`
                ? 'var(--cor-ouro-claro)'
                : '';
            });
          }
        });
      },
      { rootMargin: `-${header.offsetHeight + 10}px 0px -60% 0px` }
    );
    sections.forEach(section => navObserver.observe(section));
  }

  /* ----------------------------------------------------------------
     WHATSAPP FLOAT
  ---------------------------------------------------------------- */
  const wppWrap = document.querySelector('.whatsapp-float-wrap');
  if (wppWrap) {
    wppWrap.style.opacity = '0';
    wppWrap.style.transform = 'scale(0.8) translateY(10px)';
    wppWrap.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    function showWppFloat() {
      wppWrap.style.opacity = '1';
      wppWrap.style.transform = '';
    }

    let shown = false;
    function maybeShow() {
      if (!shown && window.scrollY > 300) {
        shown = true;
        showWppFloat();
      }
    }
    window.addEventListener('scroll', maybeShow, { passive: true });
    setTimeout(() => { if (!shown) { shown = true; showWppFloat(); } }, 3000);
  }

  /* ----------------------------------------------------------------
     HERO — IMAGEM DE FUNDO DINÂMICA
  ---------------------------------------------------------------- */
  const heroTexture = document.querySelector('.hero__texture');
  if (heroTexture) {
    const heroBg = new Image();
    heroBg.src = 'assets/images/hero.jpg';
    heroBg.onload = function () {
      heroTexture.style.backgroundImage = `url('assets/images/hero.jpg')`;
      heroTexture.style.backgroundSize = 'cover';
      heroTexture.style.backgroundPosition = 'center';
    };
  }

  /* ----------------------------------------------------------------
     LAZY LOAD FALLBACK — imagens de categoria
  ---------------------------------------------------------------- */
  document.querySelectorAll('.categoria-card__img').forEach(img => {
    img.addEventListener('error', function () {
      const wrap = this.closest('.categoria-card__img-wrap');
      if (wrap) wrap.classList.add('img-placeholder');
      this.style.display = 'none';
    });
  });

})();