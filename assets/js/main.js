(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const menu = document.querySelector('#menu-overlay');
  const openButton = document.querySelector('[data-menu-open]');
  const closeButton = document.querySelector('[data-menu-close]');
  let lastFocus = null;

  const getFocusable = () => menu
    ? [...menu.querySelectorAll('a[href], button:not([disabled])')].filter(el => !el.hidden)
    : [];

  function openMenu() {
    if (!menu) return;
    lastFocus = document.activeElement;
    menu.hidden = false;
    document.body.classList.add('menu-open');
    openButton?.setAttribute('aria-expanded', 'true');
    closeButton?.focus();
  }

  function closeMenu() {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    document.body.classList.remove('menu-open');
    openButton?.setAttribute('aria-expanded', 'false');
    if (lastFocus instanceof HTMLElement) lastFocus.focus();
  }

  openButton?.addEventListener('click', openMenu);
  closeButton?.addEventListener('click', closeMenu);
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', event => {
    if (!menu || menu.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = getFocusable();
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });

  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  // Entradas suaves y ritmo escalonado en grupos editoriales.
  document.querySelectorAll('.process-grid, .tips-grid, .practices, .access-steps').forEach(group => {
    [...group.querySelectorAll('.reveal')].forEach((item, index) => item.style.setProperty('--reveal-delay', `${Math.min(index * 70, 280)}ms`));
  });
  const revealItems = document.querySelectorAll('.reveal, .image-reveal');
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-pending');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
    revealItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      if (rect.top > window.innerHeight * 0.92) item.classList.add('reveal-pending');
      observer.observe(item);
    });
  }

  // Parallax acotado de tres capas: imagen, curvas y contenido permanece en el DOM.
  const parallaxImages = [...document.querySelectorAll('[data-parallax]')];
  const editorialImages = [...document.querySelectorAll('.feature-media img, .mosaic img')];
  const contours = [...document.querySelectorAll('[data-contours]')];
  let ticking = false;

  function renderParallax() {
    ticking = false;
    if (reduceMotion.matches) return;
    parallaxImages.forEach(image => {
      const host = image.closest('.home-hero, .page-hero');
      if (!host) return;
      const rect = host.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const progress = Math.max(-1, Math.min(1, -rect.top / Math.max(rect.height, 1)));
      const strength = Number(image.dataset.parallax || 5);
      image.style.transform = `translate3d(0, ${progress * strength}%, 0) scale(1.06)`;
    });
    editorialImages.forEach(image => {
      const host = image.closest('.feature-media, figure');
      if (!host) return;
      const rect = host.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const progress = (window.innerHeight / 2 - (rect.top + rect.height / 2)) / (window.innerHeight + rect.height);
      image.style.setProperty('--media-shift', `${Math.max(-3.5, Math.min(3.5, progress * -7))}%`);
    });
    contours.forEach(layer => {
      const host = layer.closest('.home-hero');
      if (!host) return;
      const rect = host.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, -rect.top / Math.max(rect.height, 1)));
      layer.style.transform = `translate3d(0, ${progress * -7}%, 0) rotate(${progress * 2}deg)`;
    });
  }

  function requestParallax() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(renderParallax);
    }
  }

  if (parallaxImages.length || editorialImages.length || contours.length) {
    window.addEventListener('scroll', requestParallax, { passive: true });
    window.addEventListener('resize', requestParallax, { passive: true });
    reduceMotion.addEventListener?.('change', requestParallax);
    renderParallax();
  }

  document.querySelectorAll('[data-copy-target]').forEach(button => {
    button.addEventListener('click', async () => {
      const target = document.getElementById(button.dataset.copyTarget);
      if (!target) return;
      const original = button.textContent;
      try {
        await navigator.clipboard.writeText(target.textContent.trim());
        button.textContent = 'Cita copiada';
      } catch {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(target);
        selection.removeAllRanges();
        selection.addRange(range);
        button.textContent = 'Cita seleccionada';
      }
      window.setTimeout(() => { button.textContent = original; }, 2200);
    });
  });
})();
