(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Video cinematográfico: decorativo, silenciado y siempre controlable.
  const heroVideo = document.querySelector('[data-hero-video]');
  const videoToggle = document.querySelector('[data-video-toggle]');
  if (heroVideo && videoToggle) {
    const icon = videoToggle.querySelector('.video-toggle-icon');
    const label = videoToggle.querySelector('[data-video-label]');
    let pausedByVisitor = reduceMotion.matches;

    const updateVideoControl = () => {
      const paused = heroVideo.paused;
      icon.textContent = paused ? '▶' : 'Ⅱ';
      label.textContent = paused ? 'Reproducir video' : 'Pausar video';
      videoToggle.setAttribute('aria-label', paused ? 'Reproducir video de fondo' : 'Pausar video de fondo');
    };

    const playVideo = () => {
      if (!pausedByVisitor && !reduceMotion.matches && !document.hidden) {
        heroVideo.play().catch(updateVideoControl);
      }
    };

    videoToggle.addEventListener('click', () => {
      if (heroVideo.paused) {
        pausedByVisitor = false;
        heroVideo.play().catch(updateVideoControl);
      } else {
        pausedByVisitor = true;
        heroVideo.pause();
      }
    });
    const revealVideo = () => heroVideo.classList.add('is-ready');
    heroVideo.addEventListener('loadeddata', revealVideo);
    heroVideo.addEventListener('playing', revealVideo);
    if (heroVideo.readyState >= 2) revealVideo();
    heroVideo.addEventListener('play', updateVideoControl);
    heroVideo.addEventListener('pause', updateVideoControl);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) heroVideo.pause();
      else playVideo();
    });
    reduceMotion.addEventListener?.('change', event => {
      if (event.matches) {
        pausedByVisitor = true;
        heroVideo.pause();
      }
      updateVideoControl();
    });
    updateVideoControl();
    playVideo();
  }

  // Explorador de especies con pestañas y navegación por flechas.
  const species = [
    {
      name: 'Ballena jorobada',
      scientific: 'Megaptera novaeangliae',
      group: 'Ballenas barbadas',
      image: 'assets/img/hero-ballena.webp',
      alt: 'Ballena jorobada saltando sobre el océano',
      credit: 'Eclipse Chasers / Pexels',
      description: 'Reconocible por sus aletas pectorales inusualmente largas y sus espectaculares saltos. Antes de una inmersión profunda suele elevar la cola.',
      observe: 'La forma de la cola, las aletas pectorales y la secuencia del salto.',
      report: 'Anota si había crías, cuántos animales viste y qué estaban haciendo.'
    },
    {
      name: 'Delfín común',
      scientific: 'Delphinus delphis',
      group: 'Delfines oceánicos',
      image: 'assets/img/especie-delfin-comun.webp',
      alt: 'Dos delfines comunes saltando sobre la superficie del mar',
      credit: 'NOAA NMFS / Wikimedia Commons · dominio público',
      description: 'Tiene un cuerpo esbelto, un hocico bien definido y un patrón lateral en forma de reloj de arena. Puede desplazarse en grupos y acercarse a las olas producidas por embarcaciones.',
      observe: 'El hocico, el patrón de colores en los costados y el tamaño del grupo.',
      report: 'Registra la cantidad aproximada, la dirección del desplazamiento y si hubo acercamiento a la embarcación.'
    },
    {
      name: 'Cachalote',
      scientific: 'Physeter macrocephalus',
      group: 'Ballenas dentadas',
      image: 'assets/img/especie-cachalote.webp',
      alt: 'Cachalote elevando su cola antes de sumergirse',
      credit: 'Bernard Spragg. NZ / Wikimedia Commons · CC0',
      description: 'Su cabeza grande y de perfil cuadrado es muy característica. El soplo se dirige hacia adelante y hacia la izquierda; antes de una inmersión profunda puede elevar la cola casi verticalmente.',
      observe: 'La forma de la cabeza, la dirección del soplo y la posición de la cola al sumergirse.',
      report: 'Anota la duración aproximada entre inmersiones y la distancia a la que realizaste la observación.'
    }
  ];

  const speciesTabs = [...document.querySelectorAll('[data-species-index]')];
  const speciesPanel = document.getElementById('species-panel');
  if (speciesTabs.length && speciesPanel) {
    const fields = {
      image: document.getElementById('species-image'),
      credit: document.getElementById('species-credit'),
      count: document.getElementById('species-count'),
      group: document.getElementById('species-group'),
      name: document.getElementById('species-name'),
      scientific: document.getElementById('species-scientific'),
      description: document.getElementById('species-description'),
      observe: document.getElementById('species-observe'),
      report: document.getElementById('species-report')
    };
    species.forEach(item => { const preload = new Image(); preload.src = item.image; });

    const selectSpecies = (index, moveFocus = false) => {
      const item = species[index];
      speciesTabs.forEach((tab, tabIndex) => {
        const active = tabIndex === index;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      speciesPanel.setAttribute('aria-labelledby', `species-tab-${index}`);
      fields.image.src = item.image;
      fields.image.alt = item.alt;
      fields.credit.textContent = item.credit;
      fields.count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(species.length).padStart(2, '0')}`;
      fields.group.textContent = item.group;
      fields.name.textContent = item.name;
      fields.scientific.textContent = item.scientific;
      fields.description.textContent = item.description;
      fields.observe.textContent = item.observe;
      fields.report.textContent = item.report;
      if (!reduceMotion.matches) {
        speciesPanel.classList.remove('species-enter');
        void speciesPanel.offsetWidth;
        speciesPanel.classList.add('species-enter');
      }
      if (moveFocus) speciesTabs[index].focus();
    };

    speciesTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectSpecies(index));
      tab.addEventListener('keydown', event => {
        let next = null;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % speciesTabs.length;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + speciesTabs.length) % speciesTabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = speciesTabs.length - 1;
        if (next !== null) {
          event.preventDefault();
          selectSpecies(next, true);
        }
      });
    });
  }

  // Galería horizontal y visor accesible de imágenes o video.
  const galleryTrack = document.querySelector('[data-gallery-track]');
  const galleryItems = [...document.querySelectorAll('[data-gallery-item]')];
  const mediaDialog = document.getElementById('media-dialog');
  const mediaImage = document.getElementById('media-image');
  const mediaVideo = document.getElementById('media-video');
  const mediaCaption = document.getElementById('media-caption');
  let activeMedia = 0;

  const updateGalleryButtons = () => {
    if (!galleryTrack) return;
    const max = galleryTrack.scrollWidth - galleryTrack.clientWidth;
    const previous = document.querySelector('[data-gallery-scroll="prev"]');
    const next = document.querySelector('[data-gallery-scroll="next"]');
    if (previous) previous.disabled = galleryTrack.scrollLeft <= 4;
    if (next) next.disabled = galleryTrack.scrollLeft >= max - 4;
  };

  document.querySelectorAll('[data-gallery-scroll]').forEach(button => {
    button.addEventListener('click', () => {
      const direction = button.dataset.galleryScroll === 'next' ? 1 : -1;
      galleryTrack.scrollBy({ left: direction * galleryTrack.clientWidth * 0.78, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    });
  });
  galleryTrack?.addEventListener('scroll', updateGalleryButtons, { passive: true });
  galleryTrack?.addEventListener('keydown', event => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    galleryTrack.scrollBy({ left: (event.key === 'ArrowRight' ? 1 : -1) * galleryTrack.clientWidth * 0.55, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  });
  window.addEventListener('resize', updateGalleryButtons, { passive: true });
  updateGalleryButtons();

  const showMedia = index => {
    if (!mediaDialog) return;
    activeMedia = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[activeMedia];
    const isVideo = item.dataset.type === 'video';
    mediaVideo.pause();
    mediaImage.hidden = isVideo;
    mediaVideo.hidden = !isVideo;
    if (isVideo) {
      mediaVideo.poster = item.dataset.poster;
      const webm = item.dataset.webm;
      const supportsWebm = mediaVideo.canPlayType('video/webm; codecs="vp9"');
      mediaVideo.src = webm && supportsWebm ? webm : item.dataset.src;
      mediaVideo.setAttribute('aria-label', item.dataset.caption);
    } else {
      mediaVideo.removeAttribute('src');
      mediaImage.src = item.dataset.src;
      mediaImage.alt = item.dataset.alt || item.dataset.caption;
    }
    mediaCaption.textContent = item.dataset.caption;
    if (!mediaDialog.open) mediaDialog.showModal();
    if (isVideo && !reduceMotion.matches) mediaVideo.play().catch(() => {});
  };

  galleryItems.forEach((item, index) => item.addEventListener('click', () => showMedia(index)));
  document.querySelectorAll('[data-media-nav]').forEach(button => {
    button.addEventListener('click', () => showMedia(activeMedia + (button.dataset.mediaNav === 'next' ? 1 : -1)));
  });
  mediaDialog?.querySelector('.media-close').addEventListener('click', () => mediaDialog.close());
  mediaDialog?.addEventListener('close', () => mediaVideo.pause());
  mediaDialog?.addEventListener('click', event => {
    const rect = mediaDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) mediaDialog.close();
  });

  // Las cifras se calculan exclusivamente con los registros públicos disponibles.
  const counterElements = [...document.querySelectorAll('[data-counter]')];
  const publicRecords = Array.isArray(window.AVISTAMIENTOS) ? window.AVISTAMIENTOS : [];
  if (counterElements.length && publicRecords.length) {
    const unique = key => new Set(publicRecords.map(record => String(record[key] || '').trim()).filter(Boolean)).size;
    const values = { registros: publicRecords.length, especies: unique('especie'), participantes: unique('observador') };
    const format = new Intl.NumberFormat('es-PE');

    const animateCounter = element => {
      const target = values[element.dataset.counter] || 0;
      if (!target) return;
      element.closest('.stat')?.querySelector('[data-counter-note]')?.replaceChildren(document.createTextNode('Datos públicos cargados'));
      if (reduceMotion.matches) {
        element.textContent = format.format(target);
        return;
      }
      const start = performance.now();
      const duration = 1050;
      const tick = now => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = format.format(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counterElements.forEach(element => counterObserver.observe(element));
    } else counterElements.forEach(animateCounter);
  }
})();
