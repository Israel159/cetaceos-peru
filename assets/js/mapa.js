(() => {
  'use strict';
  const mapElement = document.getElementById('map');
  if (!mapElement || typeof L === 'undefined') return;

  const records = Array.isArray(window.AVISTAMIENTOS)
    ? window.AVISTAMIENTOS.filter(item => Number.isFinite(Number(item.latitud)) && Number.isFinite(Number(item.longitud)))
    : [];
  const speciesSelect = document.getElementById('filtro-especie');
  const regionSelect = document.getElementById('filtro-region');
  const total = document.getElementById('resultados-total');
  const empty = document.getElementById('map-empty');
  const dialog = document.getElementById('record-dialog');
  const dialogTitle = document.getElementById('record-title');
  const dialogDetails = document.getElementById('record-details');
  const recordMedia = document.getElementById('record-media');
  const recordImage = document.getElementById('record-image');
  const recordCredit = document.getElementById('record-credit');
  const dataNotice = document.getElementById('map-data-notice');
  const mapWrap = mapElement.closest('.map-wrap');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const colors = ['#bc773f', '#093753', '#47778a', '#8d6046', '#697b5b', '#b78c57'];
  let filterTimer;

  if (records.length && dataNotice) {
    dataNotice.textContent = `${records.length} ${records.length === 1 ? 'registro público cargado' : 'registros públicos cargados'}. Selecciona un punto para consultar su ficha.`;
  }

  const map = L.map(mapElement, {
    scrollWheelZoom: false,
    minZoom: 4,
    maxZoom: 18,
    maxBounds: [[-25, -96], [8, -58]],
    attributionControl: true
  });
  map.attributionControl.setPrefix(false);
  map.attributionControl.addAttribution('Mapa base: Natural Earth y geoBoundaries · dominio público');
  map.fitBounds([[-19.5, -85], [-0.5, -68]], { padding: [12, 12] });

  // Malla geográfica dibujada localmente: no depende de servidores de teselas.
  for (let lat = -20; lat <= 0; lat += 5) {
    L.polyline([[lat, -94], [lat, -60]], { color: '#89a8ae', weight: 0.6, opacity: 0.35, interactive: false }).addTo(map);
  }
  for (let lon = -90; lon <= -60; lon += 5) {
    L.polyline([[-24, lon], [6, lon]], { color: '#89a8ae', weight: 0.6, opacity: 0.35, interactive: false }).addTo(map);
  }

  fetch('assets/data/peru.geojson')
    .then(response => {
      if (!response.ok) throw new Error('No se pudo cargar el mapa base');
      return response.json();
    })
    .then(geojson => {
      L.geoJSON(geojson, {
        style: { color: '#093753', weight: 1.6, fillColor: '#f2eadf', fillOpacity: 1 }
      }).addTo(map);
    })
    .catch(() => {
      const notice = document.getElementById('map-empty');
      notice.innerHTML = '<strong>No se pudo dibujar el mapa base</strong>Recarga la página para intentarlo nuevamente.';
    });

  const updateDepartmentLabels = () => {
    mapElement.classList.toggle('show-departments', map.getZoom() >= 6);
  };
  map.on('zoomend', updateDepartmentLabels);

  fetch('assets/data/peru-departamentos.geojson')
    .then(response => {
      if (!response.ok) throw new Error('No se pudieron cargar los departamentos');
      return response.json();
    })
    .then(geojson => {
      L.geoJSON(geojson, {
        style: {
          color: '#6f898d',
          weight: 0.75,
          opacity: 0.9,
          fillColor: '#f2eadf',
          fillOpacity: 0.94
        },
        onEachFeature: (feature, layer) => {
          const name = feature.properties.name;
          layer.bindTooltip(name, {
            permanent: true,
            direction: 'center',
            className: 'department-label',
            interactive: false,
            opacity: 1
          });
          layer.on('mouseover', () => layer.setStyle({ color: '#093753', weight: 1.5, fillColor: '#e8e0d4' }));
          layer.on('mouseout', () => layer.setStyle({ color: '#6f898d', weight: 0.75, fillColor: '#f2eadf' }));
        }
      }).addTo(map);
      updateDepartmentLabels();
    })
    .catch(() => {
      if (dataNotice) dataNotice.textContent = 'El contorno nacional está disponible, pero no se pudieron cargar los límites departamentales. Recarga la página para intentarlo nuevamente.';
    });

  const labelOptions = { permanent: true, direction: 'center', className: 'map-label', interactive: false };
  L.marker([-10.5, -75], { interactive: false, keyboard: false, icon: L.divIcon({ html: '', className: 'label-anchor' }) }).addTo(map).bindTooltip('PERÚ', labelOptions);
  const oceanMarker = L.marker([-11.5, window.innerWidth < 600 ? -80.5 : -86], { interactive: false, keyboard: false, icon: L.divIcon({ html: '', className: 'label-anchor' }) }).addTo(map).bindTooltip('OCÉANO PACÍFICO', labelOptions);
  window.addEventListener('resize', () => {
    oceanMarker.setLatLng([-11.5, window.innerWidth < 600 ? -80.5 : -86]);
  }, { passive: true });

  const cluster = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 48,
    iconCreateFunction: group => L.divIcon({
      html: `<span>${group.getChildCount()}</span>`,
      className: 'record-marker',
      iconSize: L.point(30, 30)
    })
  });
  map.addLayer(cluster);

  const unique = key => [...new Set(records.map(item => item[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
  const addOptions = (select, values) => values.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
  addOptions(speciesSelect, unique('especie'));
  addOptions(regionSelect, unique('region'));

  function speciesColor(species) {
    const index = Math.max(0, unique('especie').indexOf(species));
    return colors[index % colors.length];
  }

  const markerIcons = {
    ballena: '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M5 16c2-5 7-8 13-7 4 1 7 4 9 7l3-2c.5 3-.3 5-2 7-2 2-5 3-9 3l-2 4-1-4c-5 0-9-2-12-5l-4 1 3-4-3-2 4 1Z" fill="currentColor"/><circle cx="22" cy="13" r="1" fill="var(--marker-color)"/></svg>',
    delfin: '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M3 23c5-2 6-7 10-11 3-3 7-5 11-4l4-3 1 5c2 2 3 4 2 7-3-2-6-2-9 0l-3 5-2-5c-4 3-8 6-14 6Z" fill="currentColor"/><path d="M12 11l-1-6c4 0 7 2 8 5M26 13l5 2-6 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="25" cy="10" r=".9" fill="var(--marker-color)"/></svg>',
    cetaceo: '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 15c-2-5 0-8 3-10-1 4 1 6 0 9M14 14c-4-4-7-3-9-1 4 0 5 3 7 5M5 23c3-2 5-2 8 0s5 2 8 0 5-2 6 0M8 27c2-1 4-1 6 0s4 1 6 0 4-1 5 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  };

  function speciesKind(record) {
    const value = String(record.tipo || record.especie || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    if (/delfin|orca|marsopa|tonina/.test(value)) return 'delfin';
    if (/ballena|jorobada|yubarta|rorcual|cachalote|zifio/.test(value)) return 'ballena';
    return 'cetaceo';
  }

  function createMarkerIcon(record) {
    const kind = speciesKind(record);
    return L.divIcon({
      className: 'species-div-icon',
      html: `<div class="sight-marker" style="--marker-color:${speciesColor(record.especie)}"><span class="sight-pulse"></span><span class="sight-pulse"></span><span class="sight-icon">${markerIcons[kind]}</span></div>`,
      iconSize: [42, 42],
      iconAnchor: [21, 21]
    });
  }

  function text(value) {
    return String(value || 'No consignado');
  }

  function showRecord(record) {
    dialogTitle.textContent = text(record.especie);
    const fields = [
      ['Nombre científico', record.nombreCientifico],
      ['Fecha del avistamiento', record.fecha],
      ['Región o zona', record.region],
      ['Nombre del observador', record.observador],
      ['Código de registro', record.id]
    ];
    dialogDetails.replaceChildren();
    fields.forEach(([label, value]) => {
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = label;
      dd.textContent = text(value);
      dialogDetails.append(dt, dd);
    });
    if (record.foto) {
      recordImage.src = record.foto;
      recordImage.alt = `Fotografía del avistamiento: ${text(record.especie)}`;
      recordCredit.textContent = record.credito || '';
      recordMedia.hidden = false;
    } else {
      recordImage.removeAttribute('src');
      recordImage.alt = '';
      recordCredit.textContent = '';
      recordMedia.hidden = true;
    }
    dialog.showModal();
  }

  function focusRecords(filtered) {
    if (!filtered.length) return;
    const points = filtered.map(record => [Number(record.latitud), Number(record.longitud)]);
    if (points.length === 1) {
      if (reduceMotion.matches) map.setView(points[0], 9);
      else map.flyTo(points[0], 9, { duration: 0.8 });
      return;
    }
    const bounds = L.latLngBounds(points);
    const options = { padding: [48, 48], maxZoom: 9 };
    if (reduceMotion.matches) map.fitBounds(bounds, options);
    else map.flyToBounds(bounds, { ...options, duration: 0.8 });
  }

  function render(shouldFocus = false) {
    const species = speciesSelect.value;
    const region = regionSelect.value;
    const filtered = records.filter(record => (!species || record.especie === species) && (!region || record.region === region));
    mapWrap.classList.add('is-filtering');
    window.clearTimeout(filterTimer);
    filterTimer = window.setTimeout(() => mapWrap.classList.remove('is-filtering'), reduceMotion.matches ? 0 : 220);
    cluster.clearLayers();
    filtered.forEach(record => {
      const marker = L.marker([Number(record.latitud), Number(record.longitud)], {
        icon: createMarkerIcon(record),
        title: `${text(record.especie)} · abrir ficha`,
        alt: text(record.especie),
        keyboard: true
      });
      marker.on('click', () => showRecord(record));
      marker.on('add', () => {
        const element = marker.getElement();
        if (!element) return;
        element.setAttribute('aria-label', `${text(record.especie)}. Abrir ficha del avistamiento`);
        element.onkeydown = event => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          showRecord(record);
        };
      });
      cluster.addLayer(marker);
    });
    total.textContent = `${filtered.length} ${filtered.length === 1 ? 'registro' : 'registros'}`;
    if (!reduceMotion.matches) {
      total.classList.remove('count-updated');
      void total.offsetWidth;
      total.classList.add('count-updated');
    }
    empty.hidden = filtered.length > 0;
    empty.style.display = filtered.length > 0 ? 'none' : 'block';
    renderLegend();
    if (shouldFocus) focusRecords(filtered);
  }

  function renderLegend() {
    const legend = document.getElementById('mapa-leyenda');
    const species = unique('especie');
    legend.replaceChildren();
    if (!species.length) {
      const item = document.createElement('li');
      item.innerHTML = `<span class="legend-species" style="--marker-color:${colors[1]}">${markerIcons.cetaceo}</span>Avistamiento de cetáceo`;
      legend.appendChild(item);
      return;
    }
    species.forEach(name => {
      const item = document.createElement('li');
      const symbol = document.createElement('span');
      symbol.className = 'legend-species';
      symbol.style.setProperty('--marker-color', speciesColor(name));
      symbol.innerHTML = markerIcons[speciesKind({ especie: name })];
      symbol.setAttribute('aria-hidden', 'true');
      item.append(symbol, document.createTextNode(name));
      legend.appendChild(item);
    });
  }

  document.getElementById('aplicar-filtros').addEventListener('click', () => render(true));
  document.getElementById('limpiar-filtros').addEventListener('click', () => {
    speciesSelect.value = '';
    regionSelect.value = '';
    render();
    if (records.length) focusRecords(records);
    else map.fitBounds([[-19.5, -85], [-0.5, -68]], { padding: [12, 12] });
  });
  speciesSelect.addEventListener('change', () => render(true));
  regionSelect.addEventListener('change', () => render(true));

  const toggle = document.querySelector('.map-toggle');
  const panel = document.getElementById('filter-panel');
  toggle.addEventListener('click', () => {
    const open = panel.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Ocultar filtros' : 'Mostrar filtros';
    window.setTimeout(() => map.invalidateSize(), 220);
  });

  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });

  render();
  window.setTimeout(() => map.invalidateSize(), 100);
})();
