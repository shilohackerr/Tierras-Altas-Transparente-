/* ══════════════════════════════════════
   APP.JS v4.0 — Premium Minimal
   Alcaldía de Tierras Altas
══════════════════════════════════════ */

/* ── SVG ICON LIBRARY (inline, no emojis) ── */
const ICONS = {
  money:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 000 4h4a2 2 0 010 4H8"/><path d="M12 6v2m0 8v2"/></svg>`,
  spending: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`,
  sync:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>`,
  bank:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>`,
  bars:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  clock:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  file:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  pdf:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  pin:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>`,
  check:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  process:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>`,
  pending:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  car:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v5h-3"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`,
  store:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 9l1-4h16l1 4"/><rect x="2" y="9" width="20" height="12" rx="1"/><line x1="12" y1="9" x2="12" y2="21"/></svg>`,
  shield:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  hammer:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M15.45 6.83L11 2.38c-.78-.78-2.05-.78-2.83 0L2.38 8.17c-.78.78-.78 2.05 0 2.83l4.45 4.45"/><path d="M22 22l-7.5-7.5"/><path d="M9 15l5.5 5.5"/></svg>`,
  tax:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 14l2 2 4-4"/><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  lock:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>`,
  vote:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  thumb:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>`,
  send:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  alert:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  location: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>`,
  road:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 17l3-12h12l3 12M12 5v16"/></svg>`,
  water:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>`,
  trash:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>`,
  light:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="1" x2="12" y2="3"/><path d="M17.66 4.34l-1.42 1.42"/><line x1="23" y1="12" x2="21" y2="12"/><path d="M17.66 19.66l-1.42-1.42"/><line x1="12" y1="23" x2="12" y2="21"/><path d="M6.34 19.66l1.42-1.42"/><line x1="1" y1="12" x2="3" y2="12"/><path d="M6.34 4.34l1.42 1.42"/><circle cx="12" cy="12" r="4"/></svg>`,
  sign:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="7" width="20" height="10" rx="1"/><line x1="12" y1="17" x2="12" y2="22"/></svg>`,
  building: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></svg>`,
  other:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`,
  progress: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  arrow:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
};

const INCIDENCIA_ICONS = {
  luminaria: ICONS.light,
  bache:     ICONS.road,
  agua:      ICONS.water,
  arbol:     ICONS.pin,
  basura:    ICONS.trash,
  senal:     ICONS.sign,
  obra:      ICONS.building,
  otro:      ICONS.other,
};

const TRAMITE_ICONS = {
  car: ICONS.car, store: ICONS.store, shield: ICONS.shield,
  hammer: ICONS.hammer, tax: ICONS.tax, lock: ICONS.lock,
};

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initDashboard();
  initMapa();
  initProyectosList();
  renderVotaciones();
  renderTickets('todos');
  renderTramites();
  renderPromesas();
  initScrollSpy();
  // Remove duplicate a11y panel (already in HTML)
  document.querySelectorAll('.a11y-panel').forEach((p, i) => { if (i > 0) p.remove(); });
});

/* ── NAVEGACIÓN ── */
function initNav() { adjustNavOffset(); }

function adjustNavOffset() {
  const strip = document.getElementById('alertStrip');
  const nav   = document.querySelector('.nav-principal');
  const mNav  = document.getElementById('modulosNav');
  const stripH = strip && strip.style.display !== 'none' ? 38 : 0;
  if (nav)  nav.style.top  = stripH + 'px';
  if (mNav) mNav.style.top = (stripH + 64) + 'px';
  const hero = document.querySelector('.hero');
  if (hero) hero.style.paddingTop = (stripH + 64 + 64) + 'px';
}

function closeAlert() {
  const strip = document.getElementById('alertStrip');
  if (strip) strip.style.display = 'none';
  adjustNavOffset();
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.querySelector('.nav-hamburger');
  const open = menu.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
  menu.setAttribute('aria-hidden', !open);
}
function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.remove('open');
  document.querySelector('.nav-hamburger').setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-hidden', 'true');
}
function openLogin() { openModal('loginModal'); }

/* ── MÓDULO 1 · DASHBOARD ── */
function initDashboard() {
  renderKPIs('todos');
  renderBarChart();
  renderProgressBars();
  renderDocs();
}
function filterDashboard() {
  const correg = document.getElementById('filtro-correg').value;
  renderKPIs(correg);
  renderBarChart();
  renderProgressBars();
}

function renderKPIs(correg) {
  const d = PRESUPUESTO[correg] || PRESUPUESTO.todos;
  animateNumber('kpi-recibido',  d.recibido,  'B/.');
  animateNumber('kpi-ejecutado', d.ejecutado, 'B/.');
  animateNumber('kpi-proceso',   d.proceso,   'B/.');
  animateNumber('kpi-saldo',     d.saldo,     'B/.');
}

function animateNumber(id, target, prefix = '') {
  const el = document.getElementById(id);
  if (!el) return;
  const duration = 900;
  const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);
    el.textContent = prefix + value.toLocaleString('es-PA');
    // Auto-fit font size to container
    fitKpiText(el);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function fitKpiText(el) {
  // Scale down font if text overflows container width
  const parent = el.closest('.kpi-card');
  if (!parent) return;
  const maxW = parent.clientWidth - 38; // 38px padding each side
  el.style.fontSize = '';
  let fs = parseFloat(getComputedStyle(el).fontSize);
  while (el.scrollWidth > maxW && fs > 11) {
    fs -= 0.5;
    el.style.fontSize = fs + 'px';
  }
}

function renderBarChart() {
  const container = document.getElementById('barChart');
  if (!container) return;
  const data = PRESUPUESTO.todos.corregimientos;
  container.innerHTML = data.map(c => `
    <div class="bar-group">
      <div class="bar-wrap">
        <div class="bar" style="height:${c.recibidoPct}%; background:var(--azul-light);" title="${c.nombre}: Recibido ${c.recibidoPct}%"></div>
        <div class="bar" style="height:${c.ejecutadoPct}%; background:var(--verde);"      title="${c.nombre}: Ejecutado ${c.ejecutadoPct}%"></div>
      </div>
      <div class="bar-label">${c.nombre}</div>
    </div>
  `).join('');
}

function renderProgressBars() {
  const container = document.getElementById('progressSection');
  if (!container) return;
  const progIcons = ['money','spending','sync','bank','progress'];
  container.innerHTML = PRESUPUESTO.todos.rubros.map((r, i) => `
    <div class="progress-item" role="listitem">
      <div class="progress-meta">
        <span class="progress-name">
          <span style="color:${r.color};width:16px;height:16px;display:inline-block" aria-hidden="true">${ICONS[progIcons[i % progIcons.length]]}</span>
          ${r.nombre}
        </span>
        <span class="progress-pct" style="color:${r.color}">${r.pct}%</span>
      </div>
      <div class="progress-bar-bg" role="progressbar" aria-valuenow="${r.pct}" aria-valuemin="0" aria-valuemax="100" aria-label="${r.nombre}: ${r.pct}%">
        <div class="progress-bar-fill" style="width:${r.pct}%; background:${r.color}"></div>
      </div>
    </div>
  `).join('');
}

function renderDocs() {
  const container = document.getElementById('docList');
  if (!container) return;
  const docs = [
    { codigo:'OC-2026-0043', nombre:'Pavimentación Calle Principal Volcán',   fecha:'4 feb 2026',  monto:'B/.145,000' },
    { codigo:'OC-2026-0039', nombre:'Mejora Acueducto Cerro Punta',            fecha:'28 ene 2026', monto:'B/.87,500'  },
    { codigo:'OC-2026-0031', nombre:'Luminarias LED Paso Ancho',               fecha:'15 ene 2026', monto:'B/.62,300'  },
    { codigo:'OC-2025-0187', nombre:'Cancha Multipropósito Río Sereno',        fecha:'12 nov 2025', monto:'B/.110,000' },
  ];
  container.innerHTML = docs.map(d => `
    <a class="doc-item" href="#" role="listitem" aria-label="Descargar ${d.nombre}" onclick="return false;">
      <div class="doc-info">
        <div class="doc-icon" aria-hidden="true" style="color:#e53e3e">${ICONS.pdf}</div>
        <div>
          <span class="doc-name">${d.codigo} · ${d.nombre}</span>
          <div class="doc-meta">Contraloría de la República · ${d.fecha} · ${d.monto}</div>
        </div>
      </div>
      <div class="doc-action">
        ${ICONS.download}
        PDF
      </div>
    </a>
  `).join('');
}

function exportData(format) {
  const data = format === 'json'
    ? JSON.stringify({ presupuesto:PRESUPUESTO.todos, proyectos:PROYECTOS, tickets:TICKETS }, null, 2)
    : objectToCSV(PROYECTOS);
  const blob = new Blob([data], { type: format==='json' ? 'application/json' : 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `tierras-altas-${Date.now()}.${format}`; a.click();
  URL.revokeObjectURL(url);
}
function objectToCSV(arr) {
  if (!arr.length) return '';
  const h = Object.keys(arr[0]).filter(k => !['cx','cy'].includes(k));
  return [h.join(','), ...arr.map(o => h.map(k => `"${(o[k]||'').toString().replace(/"/g,'""')}"`).join(','))].join('\n');
}

/* ── MÓDULO 2 · MAPA PROYECTOS ── */
function initMapa() {
  const svg = document.getElementById('mapaSVG');
  if (!svg) return;

  // Fondo del mapa
  svg.innerHTML = `
    <defs>
      <radialGradient id="mapbg" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="#0f1e4a"/>
        <stop offset="100%" stop-color="#060c22"/>
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <rect width="600" height="420" fill="url(#mapbg)"/>
    <!-- Grid lines sutil -->
    <g stroke="rgba(255,255,255,.04)" stroke-width="1">
      ${Array.from({length:10},(_,i)=>`<line x1="${i*60}" y1="0" x2="${i*60}" y2="420"/>`).join('')}
      ${Array.from({length:7},(_,i)=>`<line x1="0" y1="${i*60}" x2="600" y2="${i*60}"/>`).join('')}
    </g>
    <!-- Contorno distrito estilizado -->
    <path d="M 80 80 L 160 50 L 260 60 L 370 45 L 460 70 L 520 110 L 530 200 L 490 280 L 400 340 L 300 370 L 180 350 L 100 290 L 60 200 Z"
          fill="rgba(13,53,184,.15)" stroke="rgba(13,53,184,.4)" stroke-width="1.5"/>
    <!-- Nombre distrito -->
    <text x="300" y="200" text-anchor="middle" fill="rgba(255,255,255,.07)"
          font-family="Syne,sans-serif" font-size="28" font-weight="800" letter-spacing="4">TIERRAS ALTAS</text>
  `;

  // Pins de proyectos
  PROYECTOS.forEach((p, i) => {
    const colors = { finalizado:'#00e64d', construccion:'#f6c90e', detenido:'#e53e3e' };
    const color = colors[p.estado] || '#aaa';
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('mapa-pin');
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.setAttribute('aria-label', `Proyecto: ${p.nombre}`);
    // Pulse ring
    g.innerHTML = `
      <circle cx="${p.cx}" cy="${p.cy}" r="16" fill="${color}" opacity=".1"/>
      <circle cx="${p.cx}" cy="${p.cy}" r="10" fill="${color}" opacity=".2"/>
      <circle cx="${p.cx}" cy="${p.cy}" r="6"  fill="${color}" filter="url(#glow)"/>
      <circle cx="${p.cx}" cy="${p.cy}" r="2.5" fill="#fff"/>
      <text x="${p.cx}" y="${p.cy - 20}" text-anchor="middle"
            fill="${color}" font-family="Syne,sans-serif" font-size="9"
            font-weight="700" letter-spacing="0.5">${p.nombre.substring(0,14).toUpperCase()}</text>
    `;
    g.addEventListener('click', () => showProyectoInfo(p));
    g.addEventListener('keydown', e => { if(e.key==='Enter') showProyectoInfo(p); });
    svg.appendChild(g);
  });
}

function showProyectoInfo(p) {
  const banner = document.getElementById('mapaInfoBanner');
  document.getElementById('mapaInfoTitulo').textContent  = p.nombre;
  document.getElementById('mapaInfoCosto').textContent   = p.costo;
  document.getElementById('mapaInfoEmpresa').textContent = p.empresa;
  document.getElementById('mapaInfoContrato').textContent= p.contrato;
  banner.classList.add('visible');
  // Resaltar card en la lista
  document.querySelectorAll('.proyecto-card').forEach(c => {
    c.classList.toggle('active', c.dataset.id === p.id);
  });
}

function initProyectosList() {
  renderProyectosList(PROYECTOS);
}

function filterProjects(query) {
  const filtered = PROYECTOS.filter(p =>
    p.nombre.toLowerCase().includes(query.toLowerCase()) ||
    p.corregimiento.toLowerCase().includes(query.toLowerCase())
  );
  renderProyectosList(filtered);
}

function renderProyectosList(list) {
  const container = document.getElementById('proyectosList');
  if (!container) return;
  const statusLabel = { finalizado:'Finalizado', construccion:'En Obra', detenido:'Detenido' };
  container.innerHTML = list.map(p => `
    <div class="proyecto-card" role="listitem" data-id="${p.id}" tabindex="0"
         onclick="showProyectoInfo(PROYECTOS.find(x=>x.id==='${p.id}'))"
         onkeydown="if(event.key==='Enter')showProyectoInfo(PROYECTOS.find(x=>x.id==='${p.id}'))"
         aria-label="Proyecto: ${p.nombre}, estado: ${p.estado}">
      <div class="proyecto-status ${p.estado}">
        <span style="width:14px;height:14px;display:inline-block" aria-hidden="true">
          ${p.estado==='finalizado' ? ICONS.check : p.estado==='construccion' ? ICONS.process : ICONS.pending}
        </span>
        ${statusLabel[p.estado]}
      </div>
      <div class="proyecto-nombre">${p.nombre}</div>
      <div class="proyecto-meta">
        <span>${p.costo}</span>
        <span>${p.corregimiento}</span>
      </div>
    </div>
  `).join('');
}

/* ── MÓDULO 3 · PROPUESTAS ── */
function renderVotaciones() {
  const container = document.getElementById('votoCards');
  if (!container) return;
  container.innerHTML = PROPUESTAS_ACTIVAS.map(p => {
    const pct = Math.round((p.votos / p.maxVotos) * 100);
    return `
      <div class="voto-card" role="listitem">
        <div class="voto-header">
          <div class="voto-nombre">${p.nombre}</div>
          <div class="voto-zona">${p.zona}</div>
        </div>
        <div class="voto-bar-wrap" role="progressbar" aria-valuenow="${p.votos}" aria-valuemax="${p.maxVotos}" aria-label="${p.votos} votos">
          <div class="voto-bar-bg"><div class="voto-bar-fill" style="width:${pct}%"></div></div>
          <div class="voto-count">${p.votos.toLocaleString('es-PA')}</div>
        </div>
        <div class="voto-actions">
          <button class="btn-voto" id="voto-${p.id}"
                  onclick="toggleVoto('${p.id}', ${p.votos})"
                  aria-label="Apoyar propuesta: ${p.nombre}">
            <span style="width:15px;height:15px;display:inline-block" aria-hidden="true">${ICONS.thumb}</span>
            Apoyar
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function toggleVoto(id, currentVotes) {
  const btn = document.getElementById(`voto-${id}`);
  if (!btn) return;
  const voted = btn.classList.toggle('voted');
  btn.innerHTML = voted
    ? `<span style="width:15px;height:15px;display:inline-block" aria-hidden="true">${ICONS.check}</span> Apoyado`
    : `<span style="width:15px;height:15px;display:inline-block" aria-hidden="true">${ICONS.thumb}</span> Apoyar`;
  const propuesta = PROPUESTAS_ACTIVAS.find(p => p.id === id);
  if (propuesta) {
    propuesta.votos = voted ? currentVotes + 1 : currentVotes;
    renderVotaciones();
    const newBtn = document.getElementById(`voto-${id}`);
    if (voted && newBtn) {
      newBtn.classList.add('voted');
      newBtn.innerHTML = `<span style="width:15px;height:15px;display:inline-block">${ICONS.check}</span> Apoyado`;
    }
  }
}

function submitPropuesta(e) {
  e.preventDefault();
  const errorEl = document.getElementById('error-propuesta');
  errorEl.classList.remove('visible');
  const cedula = document.getElementById('cedula-prop').value.trim();
  const correg = document.getElementById('correg-prop').value;
  const titulo = document.getElementById('titulo-prop').value.trim();
  const desc   = document.getElementById('desc-prop').value.trim();
  if (!cedula || !isValidCedula(cedula)) {
    showError('error-propuesta', 'Ingresa un número de cédula válido (ej: 8-888-888).');
    document.getElementById('cedula-prop').focus(); return;
  }
  if (!correg) { showError('error-propuesta', 'Selecciona tu corregimiento.'); return; }
  if (!titulo) { showError('error-propuesta', 'El título de la propuesta es requerido.'); return; }
  if (desc.length < 50) { showError('error-propuesta', 'La descripción debe tener al menos 50 caracteres.'); return; }
  const code = '#PRP-2026-' + String(Math.floor(Math.random() * 900) + 100);
  document.getElementById('propuestaCodeDisplay').textContent = code;
  openModal('propuestaModal');
  e.target.reset();
  document.getElementById('preview-fotos').innerHTML = '';
}

function isValidCedula(v) { return /^[0-9PE][- ]?[0-9]+[- ]?[0-9]+$/.test(v.replace(/\s/g,'')); }

function previewFiles(input) {
  const preview = document.getElementById('preview-fotos');
  preview.innerHTML = '';
  Array.from(input.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement('img');
      img.src = e.target.result; img.alt = 'Vista previa foto adjunta';
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

/* ── MÓDULO 4 · QUEJAS 311 ── */
function submitQueja(e) {
  e.preventDefault();
  const errorEl = document.getElementById('error-queja');
  errorEl.classList.remove('visible');
  const tipo = document.getElementById('tipo-queja').value;
  const desc = document.getElementById('desc-queja').value.trim();
  if (!tipo) { showError('error-queja', 'Selecciona el tipo de incidencia.'); return; }
  if (desc.length < 20) { showError('error-queja', 'La descripción debe tener al menos 20 caracteres.'); return; }
  const lastCode = parseInt(TICKETS[0].codigo.split('-').pop()) + 1;
  const code = `#TAQ-2026-${lastCode}`;
  document.getElementById('ticketCodeDisplay').textContent = code;
  const correg = document.getElementById('correg-queja').value;
  const tipoLabel = { luminaria:'Luminaria', bache:'Bache', agua:'Agua', arbol:'Árbol', basura:'Basura', senal:'Señal', obra:'Obra', otro:'Otro' };
  TICKETS.unshift({
    codigo:code, tipo:tipoLabel[tipo]||tipo, tipoKey:tipo,
    lugar:`${correg.charAt(0).toUpperCase()+correg.slice(1)}`,
    estado:'abierto', tiempo:'Nuevo', fecha:formatDate(new Date()), zona:correg
  });
  openModal('ticketModal');
  e.target.reset();
  const geoS = document.getElementById('geoStatus');
  geoS.textContent = 'Coordenadas no capturadas.';
  geoS.classList.remove('captured');
  renderTickets('todos');
}

function renderTickets(filtro) {
  const container = document.getElementById('ticketItems');
  if (!container) return;
  const filtered = filtro === 'todos' ? TICKETS : TICKETS.filter(t => t.estado === filtro);
  const estadoLabel = { abierto:'Pendiente', proceso:'En Proceso', resuelto:'Resuelto' };
  if (!filtered.length) {
    container.innerHTML = '<p style="color:var(--gris-400);font-size:.82rem;padding:1rem 0;text-align:center">Sin reportes en esta categoría.</p>';
    return;
  }
  container.innerHTML = filtered.map(t => `
    <div class="ticket-item" role="listitem" tabindex="0" aria-label="Reporte ${t.codigo}: ${t.tipo}">
      <div class="ticket-header">
        <div class="ticket-code">${t.codigo}</div>
        <div class="ticket-estado ${t.estado}">${estadoLabel[t.estado]}</div>
      </div>
      <div class="ticket-desc" style="display:flex;align-items:center;gap:.45rem">
        <span style="width:16px;height:16px;display:inline-block;color:var(--gris-400)" aria-hidden="true">
          ${INCIDENCIA_ICONS[t.tipoKey] || ICONS.other}
        </span>
        ${t.tipo} · ${t.lugar}
      </div>
      <div class="ticket-meta">
        <span style="display:flex;align-items:center;gap:.25rem">
          <span style="width:12px;height:12px;display:inline-block" aria-hidden="true">${ICONS.pin}</span>
          ${t.lugar}
        </span>
        <span style="display:flex;align-items:center;gap:.25rem">
          <span style="width:12px;height:12px;display:inline-block" aria-hidden="true">${ICONS.clock}</span>
          ${t.tiempo}
        </span>
        <span>${t.fecha}</span>
      </div>
    </div>
  `).join('');
}

function filterTickets(estado, btn) {
  document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTickets(estado);
}

function captureGeo() {
  const status = document.getElementById('geoStatus');
  status.textContent = 'Obteniendo coordenadas GPS...';
  status.classList.remove('captured');
  if (!navigator.geolocation) { status.textContent = 'GPS no disponible.'; return; }
  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = pos.coords.latitude.toFixed(5);
      const lng = pos.coords.longitude.toFixed(5);
      document.getElementById('geo-lat').value = lat;
      document.getElementById('geo-lng').value  = lng;
      status.textContent = `Lat: ${lat}, Lng: ${lng} — Capturado`;
      status.classList.add('captured');
    },
    () => {
      const lat = (8.7653 + Math.random()*.01).toFixed(5);
      const lng = (-82.6304 - Math.random()*.01).toFixed(5);
      document.getElementById('geo-lat').value = lat;
      document.getElementById('geo-lng').value  = lng;
      status.textContent = `Lat: ${lat}, Lng: ${lng} — Aprox.`;
      status.classList.add('captured');
    },
    { timeout:8000, maximumAge:60000 }
  );
}

/* ── MÓDULO 5 · TRÁMITES ── */
const TRAMITE_ICON_MAP = ['car','store','shield','hammer','tax','lock'];
function renderTramites() {
  const container = document.getElementById('tramitesGrid');
  if (!container) return;
  container.innerHTML = TRAMITES.map((t, i) => {
    const iconKey = TRAMITE_ICON_MAP[i] || 'file';
    const iconSvg = TRAMITE_ICONS[iconKey] || ICONS.file;
    return `
      <div class="tramite-card ${t.featured ? 'featured' : ''}"
           role="listitem" tabindex="0"
           onclick="handleTramite('${t.titulo}')"
           onkeydown="if(event.key==='Enter')handleTramite('${t.titulo}')"
           aria-label="${t.titulo}">
        <div class="tramite-icon-wrap" style="background:${t.color}" aria-hidden="true">
          <span style="width:24px;height:24px;display:block;color:${t.featured?'var(--verde)':'var(--azul)'}">${iconSvg}</span>
        </div>
        <div class="tramite-title">${t.titulo}</div>
        <div class="tramite-desc">${t.desc}</div>
        <div class="payment-logos" aria-label="Métodos de pago">
          ${t.pagos.map(p => `<div class="payment-logo">${p}</div>`).join('')}
        </div>
        <div class="tramite-cta" aria-hidden="true">
          ${t.cta}
          <span style="width:14px;height:14px;display:inline-block">${ICONS.arrow}</span>
        </div>
      </div>
    `;
  }).join('');
}
function handleTramite(titulo) {
  if (titulo.includes('Panamá Digital')) {
    alert('Redirigiendo al portal Panamá Digital (SSO)...\n\nEn producción conecta con la identidad digital oficial del Gobierno.');
  } else {
    alert(`Trámite: ${titulo}\n\nEn producción conecta con el sistema de pagos y la pasarela Yappy / tarjetas.`);
  }
}

/* ── MÓDULO 6 · RENDICIÓN ── */
function renderPromesas() {
  const container = document.getElementById('promesasGrid');
  if (!container) return;
  const estadoLabel  = { cumplida:'Cumplida', proceso:'En Proceso', pendiente:'Pendiente' };
  const estadoIcon   = { cumplida:ICONS.check, proceso:ICONS.process, pendiente:ICONS.pending };
  container.innerHTML = PROMESAS.map(p => `
    <div class="promesa-card" role="listitem" aria-label="${p.texto} — ${p.estado}, ${p.pct}%">
      <div class="promesa-estado ${p.estado}">
        <span style="width:12px;height:12px;display:inline-block" aria-hidden="true">${estadoIcon[p.estado]}</span>
        ${estadoLabel[p.estado]}
      </div>
      <div class="promesa-texto">${p.texto}</div>
      <div class="promesa-avance">
        <div class="promesa-bar-bg" role="progressbar" aria-valuenow="${p.pct}" aria-valuemin="0" aria-valuemax="100">
          <div class="promesa-bar-fill ${p.estado}" style="width:${p.pct}%"></div>
        </div>
        <div class="promesa-pct">${p.pct}%</div>
      </div>
    </div>
  `).join('');
}

function showApiInfo() { openModal('apiModal'); }

/* ── SCROLL SPY ── */
function initScrollSpy() {
  const sections = ['fiscalizacion','proyectos','propuestas','quejas','tramites','rendicion'];
  const tabs = document.querySelectorAll('.mod-tab');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        tabs.forEach(t => t.classList.toggle('active', t.dataset.section === id));
      }
    });
  }, { threshold:0.3, rootMargin:'-120px 0px -40% 0px' });
  sections.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
}

/* ── MODALES ── */
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  const focusable = modal.querySelector('button, input, a');
  if (focusable) setTimeout(() => focusable.focus(), 80);
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
});

/* ── A11Y ── */
function toggleTextoGrande() { document.body.classList.toggle('texto-grande'); }
function toggleAltoContraste() { document.body.classList.toggle('alto-contraste'); }

/* ── UTILIDADES ── */
function showError(elId, msg) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = msg; el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 5000);
}
function formatDate(date) {
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
