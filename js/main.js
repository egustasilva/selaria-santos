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
     HERO — VÍDEO + REVEAL GSAP
  ---------------------------------------------------------------- */
  const heroSection = document.querySelector('.hero');
  const heroVideo   = document.querySelector('.hero__video');
  const heroScroll  = document.getElementById('heroScroll');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroVideo && heroSection) {
    const markVideoReady = () => heroSection.classList.add('hero--video-ready');

    heroVideo.addEventListener('canplay', markVideoReady, { once: true });
    heroVideo.addEventListener('playing', markVideoReady, { once: true });

    heroVideo.play().catch(() => {
      /* Autoplay bloqueado ou fonte indisponível — textura permanece visível */
    });
  }

  function initHeroReveal() {
    if (!heroSection || typeof gsap === 'undefined') return;

    const eyebrow  = document.querySelector('.hero__eyebrow');
    const titleLines = document.querySelectorAll('.hero__title-line > span');
    const sub      = document.querySelector('.hero__sub');
    const actions  = document.querySelector('.hero__actions');
    const trustSpans = document.querySelectorAll('.hero__trust span');
    const overlay  = document.querySelector('.hero__overlay');
    const video    = document.querySelector('.hero__video');

    const showAll = () => {
      [eyebrow, sub, actions, heroScroll].forEach(el => {
        if (el) { el.style.visibility = 'visible'; el.style.opacity = '1'; }
      });
      titleLines.forEach(el => { el.style.visibility = 'visible'; el.style.transform = 'none'; });
      trustSpans.forEach(el => { el.style.visibility = 'visible'; el.style.opacity = '1'; });
    };

    if (reducedMotion) {
      showAll();
      return;
    }

    gsap.set([eyebrow, sub, actions, ...titleLines, ...trustSpans], { visibility: 'visible' });
    if (heroScroll) gsap.set(heroScroll, { visibility: 'visible' });

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    if (video) {
      tl.fromTo(video,
        { scale: 1.14 },
        { scale: 1.08, duration: 9, ease: 'power1.inOut' },
        0
      );
    }

    if (overlay) {
      tl.fromTo(overlay,
        { opacity: 0.35 },
        { opacity: 1, duration: 2.8, ease: 'power2.inOut' },
        0
      );
    }

    tl.from(eyebrow,
      { yPercent: 110, opacity: 0, duration: 1.3 },
      1.1
    )
    .from(titleLines,
      { yPercent: 115, opacity: 0, duration: 1.4, stagger: 0.18 },
      1.35
    )
    .from(sub,
      { yPercent: 100, opacity: 0, duration: 1.2 },
      '-=0.7'
    )
    .from(actions,
      { y: 36, opacity: 0, duration: 1.1 },
      '-=0.55'
    )
    .from(trustSpans,
      { y: 20, opacity: 0, duration: 0.9, stagger: 0.09 },
      '-=0.45'
    );

    if (heroScroll) {
      tl.from(heroScroll,
        { y: 16, opacity: 0, duration: 1 },
        '-=0.2'
      );
    }
  }

  function initHeroScrollHide() {
    if (!heroScroll || typeof gsap === 'undefined') return;

    let hidden = false;

    function hideIndicator() {
      if (hidden || window.scrollY < 40) return;
      hidden = true;
      gsap.to(heroScroll, {
        opacity: 0,
        y: 12,
        duration: 0.6,
        ease: 'power2.in',
        onComplete: () => heroScroll.classList.add('is-hidden')
      });
    }

    window.addEventListener('scroll', hideIndicator, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initHeroReveal();
      initHeroScrollHide();
    });
  } else {
    initHeroReveal();
    initHeroScrollHide();
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