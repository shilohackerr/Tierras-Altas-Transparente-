/* ══════════════════════════════════════
   APP.JS — Lógica principal de la plataforma
   Tierras Altas Transparente v1.0
══════════════════════════════════════ */

/* ══════════════════════════════════════
   INICIALIZACIÓN
══════════════════════════════════════ */
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
  initAccessibilityPanel();
});

/* ══════════════════════════════════════
   NAVEGACIÓN
══════════════════════════════════════ */
function initNav() {
  // Ajustar offset del nav según si el banner está visible
  adjustNavOffset();
}

function adjustNavOffset() {
  const strip = document.getElementById('alertStrip');
  const nav   = document.querySelector('.nav-principal');
  const mNav  = document.getElementById('modulosNav');
  const stripH = strip && strip.style.display !== 'none' ? 38 : 0;
  if (nav)  nav.style.top  = stripH + 'px';
  if (mNav) mNav.style.top = (stripH + 68) + 'px';
  // ajustar hero padding
  const hero = document.querySelector('.hero');
  if (hero) hero.style.paddingTop = (stripH + 68 + 60) + 'px';
}

function closeAlert() {
  document.getElementById('alertStrip').style.display = 'none';
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

function openLogin() {
  openModal('loginModal');
}

/* ══════════════════════════════════════
   MÓDULO 1 · DASHBOARD PRESUPUESTAL
══════════════════════════════════════ */
function initDashboard() {
  renderKPIs('todos');
  renderBarChart('todos');
  renderProgressBars('todos');
  renderDocs();
}

function filterDashboard() {
  const correg = document.getElementById('filtro-correg').value;
  renderKPIs(correg);
  if (correg !== 'todos') {
    // Para corregimiento específico, mostrar solo barra de ese correg
    renderBarChartSingle(correg);
  } else {
    renderBarChart('todos');
  }
}

function renderKPIs(correg) {
  const d = PRESUPUESTO[correg] || PRESUPUESTO.todos;
  animateNumber('kpi-recibido', d.recibido, 'B/.');
  animateNumber('kpi-ejecutado', d.ejecutado, 'B/.');
  animateNumber('kpi-proceso', d.proceso, 'B/.');
  animateNumber('kpi-saldo', d.saldo, 'B/.');
}

function animateNumber(id, target, prefix = '') {
  const el = document.getElementById(id);
  if (!el) return;
  const start = 0;
  const duration = 900;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);
    el.textContent = prefix + value.toLocaleString('es-PA');
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function renderBarChart(correg) {
  const container = document.getElementById('barChart');
  if (!container) return;
  const data = PRESUPUESTO.todos.corregimientos;
  container.innerHTML = data.map(c => `
    <div class="bar-group">
      <div class="bar-wrap">
        <div class="bar" style="height:${c.recibidoPct}%; background:var(--verde-claro);" title="${c.nombre}: Recibido ${c.recibidoPct}%"></div>
        <div class="bar" style="height:${c.ejecutadoPct}%; background:var(--oro-chiricano);" title="${c.nombre}: Ejecutado ${c.ejecutadoPct}%"></div>
      </div>
      <div class="bar-label">${c.nombre}</div>
    </div>
  `).join('');
}

function renderBarChartSingle(correg) {
  const container = document.getElementById('barChart');
  if (!container) return;
  const d = PRESUPUESTO[correg];
  if (!d) return renderBarChart('todos');
  const recPct = Math.round((d.recibido / PRESUPUESTO.todos.recibido) * 100);
  const exePct = Math.round((d.ejecutado / d.recibido) * 100);
  container.innerHTML = `
    <div class="bar-group" style="max-width:120px;margin:0 auto;">
      <div class="bar-wrap">
        <div class="bar" style="height:${recPct}%; background:var(--verde-claro);" title="Participación: ${recPct}%"></div>
        <div class="bar" style="height:${exePct}%; background:var(--oro-chiricano);" title="Ejecución: ${exePct}%"></div>
      </div>
      <div class="bar-label">${correg.charAt(0).toUpperCase() + correg.slice(1)}</div>
    </div>
  `;
}

function renderProgressBars(correg) {
  const container = document.getElementById('progressSection');
  if (!container) return;
  container.innerHTML = PRESUPUESTO.todos.rubros.map(r => `
    <div class="progress-item" role="listitem">
      <div class="progress-meta">
        <span class="progress-name">${r.nombre}</span>
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
    { codigo: 'OC-2026-0043', nombre: 'Pavimentación Calle Principal Volcán',    fecha: '4 feb 2026',  monto: 'B/.145,000' },
    { codigo: 'OC-2026-0039', nombre: 'Mejora Acueducto Cerro Punta',            fecha: '28 ene 2026', monto: 'B/.87,500'  },
    { codigo: 'OC-2026-0031', nombre: 'Luminarias LED Paso Ancho',               fecha: '15 ene 2026', monto: 'B/.62,300'  },
    { codigo: 'OC-2025-0187', nombre: 'Cancha Multipropósito Río Sereno',        fecha: '12 nov 2025', monto: 'B/.110,000' },
  ];
  container.innerHTML = docs.map(d => `
    <a class="doc-item" href="#" role="listitem" aria-label="Descargar ${d.nombre}, monto ${d.monto}" onclick="return false;">
      <div class="doc-info">
        <span class="doc-pdf" aria-hidden="true">📄</span>
        <div>
          <span class="doc-name">${d.codigo} · ${d.nombre}</span>
          <div class="doc-meta">Contraloría · Aprobado ${d.fecha} · ${d.monto}</div>
        </div>
      </div>
      <div class="doc-action">⬇ Descargar PDF</div>
    </a>
  `).join('');
}

function exportData(format) {
  const data = format === 'json'
    ? JSON.stringify({ presupuesto: PRESUPUESTO.todos, proyectos: PROYECTOS, tickets: TICKETS }, null, 2)
    : objectToCSV(PROYECTOS);
  const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `tierras-altas-transparente-${Date.now()}.${format}`;
  a.click();
  URL.revokeObjectURL(url);
}

function objectToCSV(arr) {
  if (!arr.length) return '';
  const headers = Object.keys(arr[0]).filter(k => !['cx','cy'].includes(k));
  const rows = arr.map(obj => headers.map(h => `"${(obj[h]||'').toString().replace(/"/g,'""')}"`).join(','));
  return [headers.join(','), ...rows].join('\n');
}

/* ══════════════════════════════════════
   MÓDULO 2 · MAPA DE PROYECTOS
══════════════════════════════════════ */
function initMapa() {
  const svg = document.getElementById('mapaSVG');
  if (!svg) return;

  // Fondo decorativo
  svg.innerHTML = `
    <defs>
      <radialGradient id="gmapGrad" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#1a4a2e" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#0a1e10" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="600" height="420" fill="url(#gmapGrad)"/>
    <path d="M0,280 L80,200 L160,240 L220,160 L300,200 L360,130 L420,170 L480,100 L540,140 L600,110 L600,420 L0,420 Z" fill="rgba(74,148,101,0.08)"/>
    <path d="M0,320 L100,280 L200,300 L300,260 L400,285 L500,250 L600,270 L600,420 L0,420 Z" fill="rgba(26,74,46,0.15)"/>
    <line x1="0" y1="140" x2="600" y2="140" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    <line x1="0" y1="210" x2="600" y2="210" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    <line x1="0" y1="280" x2="600" y2="280" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    <line x1="150" y1="0" x2="150" y2="420" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    <line x1="300" y1="0" x2="300" y2="420" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    <line x1="450" y1="0" x2="450" y2="420" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
    <text x="120" y="310" fill="rgba(255,255,255,0.3)" font-size="9" font-family="DM Sans" text-anchor="middle">VOLCÁN</text>
    <text x="260" y="220" fill="rgba(255,255,255,0.3)" font-size="9" font-family="DM Sans" text-anchor="middle">CERRO PUNTA</text>
    <text x="400" y="270" fill="rgba(255,255,255,0.3)" font-size="9" font-family="DM Sans" text-anchor="middle">C. DE PIEDRA</text>
    <text x="505" y="195" fill="rgba(255,255,255,0.3)" font-size="9" font-family="DM Sans" text-anchor="middle">RÍO SERENO</text>
    <text x="195" y="385" fill="rgba(255,255,255,0.3)" font-size="9" font-family="DM Sans" text-anchor="middle">PASO ANCHO</text>
  `;

  // Colores de estado
  const colorMap = { finalizado: '#4a9465', construccion: '#d4ac0d', detenido: '#c0392b' };
  const iconMap  = { finalizado: '✓', construccion: '⚒', detenido: '!' };

  // Agregar pines
  PROYECTOS.forEach(p => {
    const color = colorMap[p.estado];
    const icon  = iconMap[p.estado];
    const g = document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('class', 'mapa-pin');
    g.setAttribute('role', 'button');
    g.setAttribute('tabindex', '0');
    g.setAttribute('aria-label', `Proyecto: ${p.nombre}, ${p.zona}, estado: ${p.estado}`);
    g.innerHTML = `
      <circle cx="${p.cx}" cy="${p.cy}" r="15" fill="${color}" opacity="0.92"/>
      <circle cx="${p.cx}" cy="${p.cy}" r="10" fill="${color.replace(')',',0.7)')}"/>
      <text x="${p.cx}" y="${p.cy + 4}" fill="white" font-size="9" font-family="DM Sans" text-anchor="middle" font-weight="bold">${icon}</text>
      ${p.estado !== 'detenido' ? `<circle cx="${p.cx}" cy="${p.cy}" r="18" fill="${color}" opacity="0.15"><animate attributeName="r" values="15;24;15" dur="2.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.15;0;0.15" dur="2.5s" repeatCount="indefinite"/></circle>` : ''}
    `;
    g.addEventListener('click', () => selectProject(p.id));
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') selectProject(p.id); });
    svg.appendChild(g);
  });

  // Seleccionar primero por defecto
  selectProject('p1');
}

function selectProject(id) {
  const p = PROYECTOS.find(x => x.id === id);
  if (!p) return;

  // Actualizar banner del mapa
  document.getElementById('mapaInfoTitulo').textContent = `${p.zona} · ${p.nombre}`;
  document.getElementById('mapaInfoCosto').textContent = p.costo;
  document.getElementById('mapaInfoEmpresa').textContent = p.empresa;
  document.getElementById('mapaInfoContrato').textContent = p.contrato;
  document.getElementById('mapaInfoBanner').classList.add('visible');

  // Resaltar card en lista
  document.querySelectorAll('.proyecto-card').forEach(c => {
    c.classList.toggle('active', c.dataset.id === id);
  });
}

function initProyectosList() {
  renderProjectsList(PROYECTOS);
}

function renderProjectsList(proyectos) {
  const container = document.getElementById('proyectosList');
  if (!container) return;
  container.innerHTML = proyectos.map(p => `
    <div class="proyecto-card ${p.id === 'p1' ? 'active' : ''}"
         data-id="${p.id}"
         role="listitem button"
         tabindex="0"
         onclick="selectProject('${p.id}')"
         onkeydown="if(event.key==='Enter')selectProject('${p.id}')"
         aria-label="${p.nombre}, ${p.zona}, estado: ${p.estado}">
      <div class="proyecto-status ${p.estado}">${estadoLabel(p.estado)}</div>
      <div class="proyecto-nombre">${p.nombre} — ${p.zona}</div>
      <div class="proyecto-meta">
        <span>${p.costo}</span>
        <span>${p.fecha}</span>
      </div>
    </div>
  `).join('');
}

function estadoLabel(estado) {
  const map = { finalizado: '● Finalizado', construccion: '● En Construcción', detenido: '● Detenido' };
  return map[estado] || estado;
}

function filterProjects(query) {
  const q = query.toLowerCase().trim();
  const filtered = q ? PROYECTOS.filter(p =>
    p.nombre.toLowerCase().includes(q) ||
    p.zona.toLowerCase().includes(q) ||
    p.estado.toLowerCase().includes(q)
  ) : PROYECTOS;
  renderProjectsList(filtered);
}

/* ══════════════════════════════════════
   MÓDULO 3 · PROPUESTAS CIUDADANAS
══════════════════════════════════════ */
function renderVotaciones() {
  const container = document.getElementById('votoCards');
  if (!container) return;
  const t = I18N[currentLang] || I18N.es;
  container.innerHTML = PROPUESTAS_ACTIVAS.map(p => {
    const pct = Math.round((p.votos / p.maxVotos) * 100);
    return `
      <div class="voto-card" role="listitem">
        <div class="voto-header">
          <div class="voto-nombre">${p.nombre}</div>
          <div class="voto-zona">${p.zona}</div>
        </div>
        <div class="voto-bar-wrap" role="progressbar" aria-valuenow="${p.votos}" aria-valuemax="${p.maxVotos}" aria-label="${p.votos} votos de ${p.maxVotos}">
          <div class="voto-bar-bg">
            <div class="voto-bar-fill" style="width:${pct}%"></div>
          </div>
          <div class="voto-count">${p.votos.toLocaleString('es-PA')} votos</div>
        </div>
        <div class="voto-actions">
          <button class="btn-voto" id="voto-${p.id}"
                  onclick="toggleVoto('${p.id}', ${p.votos})"
                  aria-label="Apoyar propuesta: ${p.nombre}">
            👍 Apoyar
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
  btn.textContent = voted ? '✅ Apoyado' : '👍 Apoyar';
  // Actualizar contador local
  const propuesta = PROPUESTAS_ACTIVAS.find(p => p.id === id);
  if (propuesta) {
    propuesta.votos = voted ? currentVotes + 1 : currentVotes;
    renderVotaciones();
    // Restaurar estado del botón después de re-render
    const newBtn = document.getElementById(`voto-${id}`);
    if (voted && newBtn) {
      newBtn.classList.add('voted');
      newBtn.textContent = '✅ Apoyado';
    }
  }
}

function submitPropuesta(e) {
  e.preventDefault();
  const errorEl = document.getElementById('error-propuesta');
  errorEl.classList.remove('visible');

  const cedula  = document.getElementById('cedula-prop').value.trim();
  const correg  = document.getElementById('correg-prop').value;
  const titulo  = document.getElementById('titulo-prop').value.trim();
  const desc    = document.getElementById('desc-prop').value.trim();

  // Validación
  if (!cedula || !isValidCedula(cedula)) {
    showError('error-propuesta', 'Por favor ingresa un número de cédula válido (ej: 8-888-888).');
    document.getElementById('cedula-prop').focus();
    return;
  }
  if (!correg) {
    showError('error-propuesta', 'Selecciona tu corregimiento.');
    return;
  }
  if (!titulo) {
    showError('error-propuesta', 'El título de la propuesta es requerido.');
    return;
  }
  if (desc.length < 50) {
    showError('error-propuesta', 'La descripción debe tener al menos 50 caracteres.');
    return;
  }

  // Éxito
  const code = '#PRP-2026-' + String(Math.floor(Math.random() * 900) + 100);
  document.getElementById('propuestaCodeDisplay').textContent = code;
  openModal('propuestaModal');
  e.target.reset();
  document.getElementById('preview-fotos').innerHTML = '';
}

function isValidCedula(cedula) {
  return /^[0-9PE][- ]?[0-9]+[- ]?[0-9]+$/.test(cedula.replace(/\s/g,''));
}

function previewFiles(input) {
  const preview = document.getElementById('preview-fotos');
  preview.innerHTML = '';
  Array.from(input.files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.alt = 'Vista previa de foto adjunta';
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
}

/* ══════════════════════════════════════
   MÓDULO 4 · QUEJAS 311
══════════════════════════════════════ */
function submitQueja(e) {
  e.preventDefault();
  const errorEl = document.getElementById('error-queja');
  errorEl.classList.remove('visible');

  const tipo  = document.getElementById('tipo-queja').value;
  const desc  = document.getElementById('desc-queja').value.trim();

  if (!tipo) {
    showError('error-queja', 'Selecciona el tipo de incidencia.');
    return;
  }
  if (desc.length < 20) {
    showError('error-queja', 'La descripción debe tener al menos 20 caracteres.');
    return;
  }

  // Generar código
  const lastCode = parseInt(TICKETS[0].codigo.split('-').pop()) + 1;
  const code = `#TAQ-2026-${lastCode}`;
  document.getElementById('ticketCodeDisplay').textContent = code;

  // Agregar a la lista local
  const correg = document.getElementById('correg-queja').value;
  TICKETS.unshift({
    codigo: code, tipo: tipo,
    lugar: `${correg.charAt(0).toUpperCase() + correg.slice(1)}`,
    estado: 'abierto', tiempo: 'Nuevo', fecha: formatDate(new Date()), zona: correg
  });

  openModal('ticketModal');
  e.target.reset();
  document.getElementById('geoStatus').textContent = I18N[currentLang]?.geo_pending || 'Coordenadas no capturadas.';
  document.getElementById('geoStatus').classList.remove('captured');
  renderTickets('todos');
}

function renderTickets(filtro) {
  const container = document.getElementById('ticketItems');
  if (!container) return;
  const filtered = filtro === 'todos' ? TICKETS : TICKETS.filter(t => t.estado === filtro);
  const estadoLabel = { abierto: '⏳ Pendiente', proceso: '🔄 En Proceso', resuelto: '✔ Resuelto' };
  container.innerHTML = filtered.map(t => `
    <div class="ticket-item" role="listitem" tabindex="0" aria-label="Reporte ${t.codigo}: ${t.tipo}, estado ${t.estado}">
      <div class="ticket-header">
        <div class="ticket-code">${t.codigo}</div>
        <div class="ticket-estado ${t.estado}">${estadoLabel[t.estado]}</div>
      </div>
      <div class="ticket-desc">${t.tipo} · ${t.lugar}</div>
      <div class="ticket-meta">
        <span>📍 ${t.lugar.split(',').pop()?.trim() || t.zona}</span>
        <span>🕐 ${t.tiempo}</span>
        <span>📅 ${t.fecha}</span>
      </div>
    </div>
  `).join('') || '<p style="color:var(--gris-piedra);font-size:0.85rem;padding:1rem 0;">No hay reportes en esta categoría.</p>';
}

function filterTickets(estado, btn) {
  document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTickets(estado);
}

function captureGeo() {
  const status = document.getElementById('geoStatus');
  status.textContent = 'Obteniendo coordenadas...';
  status.classList.remove('captured');

  if (!navigator.geolocation) {
    status.textContent = 'GPS no disponible en este dispositivo.';
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = pos.coords.latitude.toFixed(5);
      const lng = pos.coords.longitude.toFixed(5);
      document.getElementById('geo-lat').value = lat;
      document.getElementById('geo-lng').value  = lng;
      status.textContent = `📍 Lat: ${lat}, Lng: ${lng} — Capturado`;
      status.classList.add('captured');
    },
    () => {
      // Fallback simulado (zona de Volcán)
      const lat = (8.7653 + Math.random() * 0.01).toFixed(5);
      const lng = (-82.6304 - Math.random() * 0.01).toFixed(5);
      document.getElementById('geo-lat').value = lat;
      document.getElementById('geo-lng').value  = lng;
      status.textContent = `📍 Lat: ${lat}, Lng: ${lng} — Ubicación aproximada`;
      status.classList.add('captured');
    },
    { timeout: 8000, maximumAge: 60000 }
  );
}

/* ══════════════════════════════════════
   MÓDULO 5 · TRÁMITES
══════════════════════════════════════ */
function renderTramites() {
  const container = document.getElementById('tramitesGrid');
  if (!container) return;
  container.innerHTML = TRAMITES.map(t => `
    <div class="tramite-card ${t.featured ? 'featured' : ''}"
         role="listitem"
         tabindex="0"
         onclick="handleTramite('${t.titulo}')"
         onkeydown="if(event.key==='Enter')handleTramite('${t.titulo}')"
         aria-label="${t.titulo}: ${t.desc}">
      <div class="tramite-icon-wrap" style="background:${t.color}" aria-hidden="true">${t.icon}</div>
      <div class="tramite-title">${t.titulo}</div>
      <div class="tramite-desc">${t.desc}</div>
      <div class="payment-logos" aria-label="Métodos de pago disponibles">
        ${t.pagos.map(p => `<div class="payment-logo" aria-label="${p}">${p}</div>`).join('')}
      </div>
      <div class="tramite-cta" aria-hidden="true">${t.cta} →</div>
    </div>
  `).join('');
}

function handleTramite(titulo) {
  if (titulo.includes('Panamá Digital')) {
    alert('Redirigiendo al portal de Panamá Digital (SSO)...\n\nEn producción, este botón conecta con la identidad digital oficial del Gobierno de Panamá.');
  } else {
    alert(`Trámite: ${titulo}\n\nEn producción, este módulo conecta con el sistema de pagos de la Alcaldía y la pasarela Yappy / tarjetas de crédito.`);
  }
}

/* ══════════════════════════════════════
   MÓDULO 6 · RENDICIÓN DE CUENTAS
══════════════════════════════════════ */
function renderPromesas() {
  const container = document.getElementById('promesasGrid');
  if (!container) return;
  const estadoLabel = { cumplida: '✔ Cumplida', proceso: '🔄 En Proceso', pendiente: '⏳ Pendiente' };
  container.innerHTML = PROMESAS.map(p => `
    <div class="promesa-card" role="listitem" aria-label="${p.texto} - Estado: ${p.estado} - Avance: ${p.pct}%">
      <div class="promesa-estado ${p.estado}">${estadoLabel[p.estado]}</div>
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

function showApiInfo() {
  openModal('apiModal');
}

/* ══════════════════════════════════════
   SCROLL SPY — MÓDULOS NAV
══════════════════════════════════════ */
function initScrollSpy() {
  const sections = ['fiscalizacion','proyectos','propuestas','quejas','tramites','rendicion'];
  const tabs = document.querySelectorAll('.mod-tab');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        tabs.forEach(t => {
          t.classList.toggle('active', t.dataset.section === id);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-120px 0px -40% 0px' });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

/* ══════════════════════════════════════
   PANEL DE ACCESIBILIDAD
══════════════════════════════════════ */
function initAccessibilityPanel() {
  const panel = document.createElement('div');
  panel.className = 'a11y-panel';
  panel.setAttribute('role', 'group');
  panel.setAttribute('aria-label', 'Herramientas de accesibilidad');
  panel.innerHTML = `
    <button class="a11y-btn" onclick="toggleTextoGrande()" data-tooltip="Texto más grande" aria-label="Alternar texto grande">A+</button>
    <button class="a11y-btn" onclick="toggleAltoContraste()" data-tooltip="Alto contraste" aria-label="Alternar alto contraste" style="font-size:0.8rem;">◑</button>
    <button class="a11y-btn" onclick="setLang('simple')" data-tooltip="Lenguaje Fácil" aria-label="Activar lenguaje fácil" style="font-size:0.75rem;">📖</button>
  `;
  document.body.appendChild(panel);
}

function toggleTextoGrande() {
  document.body.classList.toggle('texto-grande');
}

function toggleAltoContraste() {
  document.body.classList.toggle('alto-contraste');
}

/* ══════════════════════════════════════
   MODALES
══════════════════════════════════════ */
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add('open');
  // Focus primer elemento interactivo
  const focusable = modal.querySelector('button, input, a');
  if (focusable) setTimeout(() => focusable.focus(), 100);
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Cerrar modal con ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      closeModal(m.id);
    });
  }
});

/* ══════════════════════════════════════
   UTILIDADES
══════════════════════════════════════ */
function showError(elId, msg) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = msg;
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 5000);
}

function formatDate(date) {
  const d = date.getDate();
  const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${d} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
