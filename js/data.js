/* ══════════════════════════════════════
   DATA.JS — Datos y traducciones
   Tierras Altas Transparente v1.0
══════════════════════════════════════ */

/* ── DATOS DE PRESUPUESTO ── */
const PRESUPUESTO = {
  todos: {
    recibido: 2430000, ejecutado: 1148400, proceso: 680000, saldo: 601600,
    corregimientos: [
      { nombre: 'Volcán',        recibidoPct: 85, ejecutadoPct: 62 },
      { nombre: 'Cerro Punta',   recibidoPct: 70, ejecutadoPct: 40 },
      { nombre: 'C. Piedra',     recibidoPct: 55, ejecutadoPct: 48 },
      { nombre: 'Paso Ancho',    recibidoPct: 45, ejecutadoPct: 30 },
      { nombre: 'Río Sereno',    recibidoPct: 65, ejecutadoPct: 55 },
    ],
    rubros: [
      { nombre: '🛣️ Infraestructura Vial', pct: 72, color: '#4a9465' },
      { nombre: '💧 Agua y Saneamiento',   pct: 45, color: '#1a5276' },
      { nombre: '🌿 Ambiente y Parques',   pct: 88, color: '#4a9465' },
      { nombre: '🏫 Educación y Cultura',  pct: 31, color: '#d4ac0d' },
      { nombre: '💡 Alumbrado Público',    pct: 18, color: '#c0392b' },
    ]
  },
  volcan:       { recibido: 820000, ejecutado: 508400, proceso: 180000, saldo: 131600 },
  cerropunta:   { recibido: 540000, ejecutado: 216000, proceso: 150000, saldo: 174000 },
  cuestapiedra: { recibido: 380000, ejecutado: 182400, proceso: 110000, saldo: 87600  },
  pasoancho:    { recibido: 310000,  ejecutado: 93000,  proceso: 120000, saldo: 97000  },
  riosereno:    { recibido: 380000, ejecutado: 148600, proceso: 120000, saldo: 111400 }
};

/* ── PROYECTOS ── */
const PROYECTOS = [
  {
    id: 'p1',
    nombre: 'Pavimentación Calle Principal',
    zona: 'Volcán',
    estado: 'finalizado',
    costo: 'B/.145,000',
    empresa: 'Const. Chiriquí S.A.',
    contrato: 'MTA-2025-043',
    fecha: 'Dic 2025',
    cx: 120, cy: 290,
    descripcion: 'Pavimentación de 2.4 km de calle principal del casco urbano de Volcán, incluyendo señalización horizontal y vertical.'
  },
  {
    id: 'p2',
    nombre: 'Mejora Acueducto',
    zona: 'Cerro Punta',
    estado: 'construccion',
    costo: 'B/.87,500',
    empresa: 'HidroAndes S.A.',
    contrato: 'MTA-2026-039',
    fecha: 'Mar 2026 est.',
    cx: 265, cy: 200,
    descripcion: 'Sustitución de 3.8 km de tubería de asbestos-cemento por PVC de alta resistencia en el sistema de acueducto de Cerro Punta.'
  },
  {
    id: 'p3',
    nombre: 'Ampliación Mercado Municipal',
    zona: 'Cuesta de Piedra',
    estado: 'detenido',
    costo: 'B/.210,000',
    empresa: 'Sin adjudicar',
    contrato: 'MTA-2025-031',
    fecha: 'Sin fecha definida',
    cx: 410, cy: 255,
    descripcion: 'Ampliación de 800 m² del mercado municipal existente. Proyecto detenido por revisión de planos. En proceso de licitación.'
  },
  {
    id: 'p4',
    nombre: 'Cancha Multipropósito',
    zona: 'Río Sereno',
    estado: 'finalizado',
    costo: 'B/.110,000',
    empresa: 'Deportivo Bocas S.A.',
    contrato: 'MTA-2025-044',
    fecha: 'Nov 2025',
    cx: 500, cy: 175,
    descripcion: 'Construcción de cancha cubierta de usos múltiples: fútbol sala, baloncesto y voleibol. Capacidad para 250 espectadores.'
  },
  {
    id: 'p5',
    nombre: 'Aceras y Rampas Accesibles',
    zona: 'Paso Ancho',
    estado: 'construccion',
    costo: 'B/.42,000',
    empresa: 'Pavimentos del Sur',
    contrato: 'MTA-2026-011',
    fecha: 'Abr 2026 est.',
    cx: 195, cy: 365,
    descripcion: 'Construcción de 1.2 km de aceras y 24 rampas de accesibilidad para personas con discapacidad conforme a la Ley 42/1999.'
  }
];

/* ── PROPUESTAS EN VOTACIÓN ── */
const PROPUESTAS_ACTIVAS = [
  { id: 'v1', nombre: 'Alumbrado LED en Barrio Las Flores', zona: 'Volcán',        votos: 287, maxVotos: 350 },
  { id: 'v2', nombre: 'Centro de Acopio de Residuos',       zona: 'Cerro Punta',   votos: 224, maxVotos: 350 },
  { id: 'v3', nombre: 'Reparación del Puente Peatonal',     zona: 'Paso Ancho',    votos: 179, maxVotos: 350 },
  { id: 'v4', nombre: 'Biblioteca Comunitaria Digital',      zona: 'Río Sereno',    votos: 134, maxVotos: 350 },
];

/* ── TICKETS 311 ── */
const TICKETS = [
  { codigo: '#TAQ-2026-1041', tipo: 'Luminaria apagada', lugar: 'Av. Principal, Volcán',      estado: 'resuelto', tiempo: 'Resuelto en 48h', fecha: '6 mar 2026',  zona: 'volcan' },
  { codigo: '#TAQ-2026-1038', tipo: 'Bache profundo',    lugar: 'Calle 2da, Paso Ancho',      estado: 'proceso',  tiempo: 'Día 3',           fecha: '8 mar 2026',  zona: 'pasoancho' },
  { codigo: '#TAQ-2026-1035', tipo: 'Tubería rota',      lugar: 'Sector 4, Cerro Punta',      estado: 'proceso',  tiempo: 'Día 5',           fecha: '6 mar 2026',  zona: 'cerropunta' },
  { codigo: '#TAQ-2026-1029', tipo: 'Árbol caído',       lugar: 'Camino rural, Río Sereno',   estado: 'abierto',  tiempo: 'Nuevo',           fecha: '10 mar 2026', zona: 'riosereno' },
  { codigo: '#TAQ-2026-1022', tipo: 'Basura acumulada',  lugar: 'B. El Porvenir, Volcán',     estado: 'resuelto', tiempo: 'Resuelto en 72h', fecha: '5 mar 2026',  zona: 'volcan' },
  { codigo: '#TAQ-2026-1018', tipo: 'Señal dañada',      lugar: 'Intersección Ruta 36',       estado: 'resuelto', tiempo: 'Resuelto en 24h', fecha: '4 mar 2026',  zona: 'cuestapiedra' },
];

/* ── TRÁMITES ── */
const TRAMITES = [
  {
    icon: '🚗', titulo: 'Consulta de Deuda de Placas',
    desc: 'Verifica el estado de tus impuestos vehiculares municipales y genera tu paz y salvo al instante.',
    pagos: ['YAPPY', 'VISA', 'ACH'],
    color: 'rgba(26,82,118,0.1)',
    cta: 'Consultar ahora'
  },
  {
    icon: '🏪', titulo: 'Licencias Comerciales',
    desc: 'Solicita o renueva tu licencia de funcionamiento. Recibe tu certificado digital en 48h hábiles.',
    pagos: ['YAPPY', 'MasterCard'],
    color: 'rgba(74,148,101,0.1)',
    cta: 'Iniciar trámite'
  },
  {
    icon: '📋', titulo: 'Paz y Salvo Municipal',
    desc: 'Genera tu paz y salvo en segundos. Válido para transferencias de propiedad y trámites notariales.',
    pagos: ['YAPPY', 'VISA'],
    color: 'rgba(200,149,42,0.1)',
    cta: 'Generar paz y salvo'
  },
  {
    icon: '🏗️', titulo: 'Permisos de Construcción',
    desc: 'Solicita permisos de obra menor, cercas, ampliaciones y movimiento de tierra con seguimiento en línea.',
    pagos: ['YAPPY', 'ACH'],
    color: 'rgba(108,52,131,0.1)',
    cta: 'Solicitar permiso'
  },
  {
    icon: '📊', titulo: 'Consulta de Tributos IBI',
    desc: 'Revisa el estado de tu Impuesto de Bienes Inmuebles (IBI) y realiza tu pago directamente desde el sitio.',
    pagos: ['YAPPY', 'VISA', 'MasterCard'],
    color: 'rgba(192,57,43,0.08)',
    cta: 'Consultar IBI'
  },
  {
    icon: '🔐', titulo: 'Ingreso con Panamá Digital',
    desc: 'Accede con tu identidad digital oficial. Single Sign-On seguro compatible con todos los trámites del portal.',
    pagos: ['SSO', '2FA'],
    color: 'rgba(200,149,42,0.2)',
    cta: 'Ingresar con Panamá Digital',
    featured: true
  }
];

/* ── PROMESAS DE GESTIÓN ── */
const PROMESAS = [
  { texto: '"Pavimentar las calles principales de Volcán y conectar el centro urbano."', estado: 'cumplida', pct: 100 },
  { texto: '"Dotar de alumbrado LED eficiente al 80% de los barrios del distrito."',     estado: 'proceso',  pct: 52  },
  { texto: '"Digitalizar el 100% de los trámites de la ventanilla municipal."',          estado: 'proceso',  pct: 35  },
  { texto: '"Construir una cancha multipropósito en Río Sereno antes del primer año."',  estado: 'cumplida', pct: 100 },
  { texto: '"Instalar planta de tratamiento de agua potable en Cerro Punta."',           estado: 'pendiente',pct: 8   },
  { texto: '"Crear un programa de empleo agrícola juvenil en los corregimientos de altura."', estado: 'proceso', pct: 61 },
];

/* ── TRADUCCIONES ── */
const I18N = {
  es: {
    badge:                 'Plataforma Oficial · Fase I · 2026',
    hero_title_1:          'Tu municipio,',
    hero_title_2:          'sin secretos.',
    hero_sub:              'Fiscaliza el gasto público, propone obras para tu corregimiento, reporta incidencias y gestiona tus trámites municipales — todo en un solo lugar.',
    hero_btn1:             '📊 Ver Presupuesto en Vivo',
    hero_btn2:             '🚨 Reportar Incidencia',
    stat1:                 'Presupuesto 2026',
    stat2:                 'Proyectos Activos',
    stat3:                 'Tickets Resueltos',
    mod1: 'Fiscalización', mod2: 'Proyectos', mod3: 'Propuestas',
    mod4: 'Quejas 311',    mod5: 'Trámites',  mod6: 'Rendición',
    fiscal_sub:            'Datos actualizados desde la Autoridad Nacional de Descentralización y la Contraloría.',
    kpi1:                  'Total Recibido (IBI + PIOPS)',
    kpi2:                  'Ejecutado (47.3%)',
    kpi3:                  'En Proceso de Ejecución',
    kpi4:                  'Saldo por Comprometer',
    proyectos_sub:         'Haz clic en un pin del mapa o en la lista para ver la ficha técnica completa.',
    propuestas_sub:        'Las propuestas más votadas son presentadas al Consejo Municipal en la próxima sesión.',
    form_propuesta_title:  'Enviar Nueva Propuesta',
    cedula_ph:             '8-888-888',
    cedula_hint:           'Necesitamos tu cédula para confirmar que eres vecino del distrito.',
    upload_hint:           'Toca para adjuntar fotos o ubicación de la zona',
    btn_enviar_propuesta:  'Enviar Propuesta al Consejo',
    votacion_title:        '🗳️ Propuestas en Votación',
    quejas_sub:            'Tu reporte se sincroniza automáticamente con el sistema nacional 311 Panamá.',
    ticket_title:          'Nueva Incidencia',
    ticket_sub:            'Generamos tu código de rastreo automáticamente al enviar.',
    geo_btn:               'Capturar mi Ubicación',
    geo_pending:           'Coordenadas no capturadas aún.',
    btn_ticket:            'Enviar y Generar Código',
    historial_title:       'Reportes Recientes del Distrito',
    tramites_sub:          'Gestiona tus pagos y solicitudes municipales sin salir de casa.',
    rendicion_sub:         'Seguimiento público de los compromisos de gestión del período 2024–2029.',
    opendata_label:        'Datos Abiertos · Ley de Transparencia · Compatible con OCDS Panamá',
    footer_tagline:        'Plataforma oficial de transparencia, participación ciudadana y trámites digitales del Municipio de Tierras Altas.',
    ticket_ok_title:       '¡Reporte Enviado!',
    ticket_ok_sub:         'Tu incidencia fue registrada y se está sincronizando con el sistema 311 Panamá.',
    ticket_code_label:     'Tu código de rastreo',
    btn_entendido:         'Entendido',
  },

  simple: {
    badge:                 '🏔️ Página oficial del municipio',
    hero_title_1:          'Aquí puedes ver',
    hero_title_2:          'cómo se usa tu dinero.',
    hero_sub:              'Esta página es para ti. Puedes saber cuánto dinero tiene el municipio, ver las obras de tu comunidad, reportar un problema y hacer trámites fácil.',
    hero_btn1:             '💰 Ver el dinero del municipio',
    hero_btn2:             '🚨 Reportar un problema',
    stat1:                 'Dinero total 2026',
    stat2:                 'Obras en curso',
    stat3:                 'Problemas resueltos',
    mod1: '💰 Dinero',     mod2: '🏗️ Obras',  mod3: '💡 Tus ideas',
    mod4: '🚨 Reportar',   mod5: '📋 Trámites', mod6: '✅ Promesas',
    fiscal_sub:            'Aquí puedes ver cuánto dinero tiene el municipio y en qué se está gastando.',
    kpi1:                  'Dinero recibido este año',
    kpi2:                  'Dinero ya gastado',
    kpi3:                  'Dinero en obras ahora mismo',
    kpi4:                  'Dinero que falta por usar',
    proyectos_sub:         'Toca un punto en el mapa para ver información sobre esa obra.',
    propuestas_sub:        '¿Hay algo que necesita tu comunidad? Cuéntanos aquí. Las ideas más votadas se presentan al municipio.',
    form_propuesta_title:  'Escribe tu idea',
    cedula_ph:             'Tu número de cédula',
    cedula_hint:           'Necesitamos tu cédula para saber que vives en Tierras Altas.',
    upload_hint:           'Agrega una foto del problema',
    btn_enviar_propuesta:  '📨 Enviar mi idea',
    votacion_title:        '👍 Ideas que están siendo votadas',
    quejas_sub:            'Cuando reportas un problema, el municipio lo recibe y te da un número para que puedas darle seguimiento.',
    ticket_title:          'Reportar un problema',
    ticket_sub:            'Te damos un número para que puedas rastrear tu reporte.',
    geo_btn:               '📍 Dinos dónde está el problema',
    geo_pending:           'Todavía no capturamos tu ubicación.',
    btn_ticket:            '⚡ Enviar mi reporte',
    historial_title:       'Últimos reportes del municipio',
    tramites_sub:          'Haz tus trámites del municipio desde tu celular. Sin hacer filas.',
    rendicion_sub:         'Aquí puedes ver si el alcalde está cumpliendo lo que prometió.',
    opendata_label:        'Todos los datos de esta página son públicos y se pueden descargar gratis.',
    footer_tagline:        'Página oficial del Municipio de Tierras Altas para que todos sepan cómo se usa el dinero.',
    ticket_ok_title:       '¡Reporte enviado!',
    ticket_ok_sub:         'Tu reporte llegó al municipio. Guarda este número para saber qué pasó con tu queja.',
    ticket_code_label:     'Tu número de reporte',
    btn_entendido:         'Listo, entendí',
  },

  ngabe: {
    badge:                 '🏔️ Mun Tierras Altas tärä nibi',
    hero_title_1:          'Ni gwiribitä käite',
    hero_title_2:          'meri gwi tärä.',
    hero_sub:              'Tärä nibi krörö: ño meri käite mün tärä, ño krörö tärä, ni tärä gwi iti, ño trämite mün tärä käite. (Esta página es para ti. Puedes ver el dinero del municipio, las obras, reportar un problema y hacer trámites.)',
    hero_btn1:             '💰 Meri gwi tärä',
    hero_btn2:             '🚨 Krörö iti tärä',
    stat1:                 'Meri 2026',
    stat2:                 'Krörö käite',
    stat3:                 'Iti ngiäkäre',
    mod1: '💰 Meri',       mod2: '🏗️ Krörö', mod3: '💡 Ni kämikä',
    mod4: '🚨 Iti tärä',   mod5: '📋 Trämite', mod6: '✅ Ngwane',
    fiscal_sub:            'Tärä meri güe mün käite. (Aquí puedes ver el dinero del municipio.)',
    kpi1:                  'Meri kite jäkäre',
    kpi2:                  'Meri ngwane',
    kpi3:                  'Meri krörö käite',
    kpi4:                  'Meri tiribä',
    proyectos_sub:         'Tärä krörö tärä ni mapa gwi. (Toca el mapa para ver las obras.)',
    propuestas_sub:        'Ni kämikä tärä mün gwi. Käte kämikä krörö ngwane tärä mün. (Escribe tu idea. La idea más votada va al municipio.)',
    form_propuesta_title:  'Ni kämikä tärä',
    cedula_ph:             'Ni cédula',
    cedula_hint:           'Ni cédula käite ne ti Tierras Altas gwi. (Tu cédula confirma que eres de Tierras Altas.)',
    upload_hint:           'Ni foto tärä iti gwi',
    btn_enviar_propuesta:  '📨 Kämikä tärä',
    votacion_title:        '👍 Kämikä ngwane',
    quejas_sub:            'Ni iti tärä, mün ni krörö gwi numero. (Reportas y te damos un número para seguimiento.)',
    ticket_title:          'Iti tärä',
    ticket_sub:            'Ni numero tärä gwi iti. (Te damos un número para tu reporte.)',
    geo_btn:               '📍 Iti ñö gwi',
    geo_pending:           'Ni ñö tiribä. (Ubicación no capturada.)',
    btn_ticket:            '⚡ Iti tärä kite',
    historial_title:       'Iti käite tärä mün',
    tramites_sub:          'Ni trämite tärä celular gwi. (Haz tus trámites desde el celular.)',
    rendicion_sub:         'Tärä ngwane alcalde gwi. (Aquí puedes ver si el alcalde cumplió.)',
    opendata_label:        'Meri tärä gwi nibi. (Los datos son públicos y gratuitos.)',
    footer_tagline:        'Mün Tierras Altas tärä nibi. (Página oficial del Municipio de Tierras Altas.)',
    ticket_ok_title:       'Iti tärä ngiäkäre!',
    ticket_ok_sub:         'Ni iti tärä mün gwi. Numero ni tärä kite. (Tu reporte llegó al municipio. Guarda el número.)',
    ticket_code_label:     'Ni numero',
    btn_entendido:         'Ngiäkäre',
  }
};
