/* ══════════════════════════════════════
   DATA.JS — Datos y traducciones
   Alcaldía de Tierras Altas
   v2.0 — Marzo 2026
   Estándar: OCDS v1.1 · SIAFPA · Ley 6/2002
══════════════════════════════════════ */

/* ── METADATOS DE PUBLICACIÓN (OCDS packageMetadata) ──
   Requerido por Contraloría y ANTAI para datos abiertos  */
const OCDS_METADATA = {
  uri:          'https://shilohackerr.github.io/Tierras-Altas-Transparente-/api/export.json',
  version:      '1.1',
  publisher: {
    name:       'Alcaldía Municipal de Tierras Altas',
    scheme:     'PA-RUC',
    uid:        null,       // ← RUC oficial pendiente de la Alcaldía
    uri:        'https://shilohackerr.github.io/Tierras-Altas-Transparente-/',
  },
  license:      'https://creativecommons.org/licenses/by/4.0/',
  publicationPolicy: 'https://shilohackerr.github.io/Tierras-Altas-Transparente-/politica-datos',
  publishedDate: '2026-03-01T00:00:00Z',
  extensions:   ['https://standard.open-contracting.org/profiles/ppp/latest/en/'],
};

/* ── DATOS DE PRESUPUESTO con referencias SIAFPA/Contraloría ── */
const PRESUPUESTO = {
  todos: {
    recibido: 2430000, ejecutado: 1148400, proceso: 680000, saldo: 601600,

    // Referencias cruzadas SIAFPA — Contraloría General de la República
    // Cada transferencia tiene su número de resolución y acta de refrendo
    siafpa: {
      anio_fiscal:        '2026',
      resolucion_aprobacion: 'MIVIOT-DGA-2026-0142',
      acta_refrendo:      'CGR-REFRENDO-2026-00891',
      fecha_refrendo:     '2026-01-15',
      partida_presupuestaria: '510-21-001-2026',
      fuentes: [
        { nombre: 'PIOPS',         monto: 1800000, resolucion: 'AND-PIOPS-2026-0033', porcentaje: 74.1 },
        { nombre: 'IBI Municipal', monto:  430000, resolucion: 'MTA-IBI-2026-0011',   porcentaje: 17.7 },
        { nombre: 'Fondos Propios',monto:  200000, resolucion: 'MTA-FP-2026-0005',    porcentaje:  8.2 },
      ],
    },

    corregimientos: [
      { nombre: 'Volcán',        recibidoPct: 85, ejecutadoPct: 62, codigo_siafpa: 'MTA-COR-01' },
      { nombre: 'Cerro Punta',   recibidoPct: 70, ejecutadoPct: 40, codigo_siafpa: 'MTA-COR-02' },
      { nombre: 'C. Piedra',     recibidoPct: 55, ejecutadoPct: 48, codigo_siafpa: 'MTA-COR-03' },
      { nombre: 'Paso Ancho',    recibidoPct: 45, ejecutadoPct: 30, codigo_siafpa: 'MTA-COR-04' },
      { nombre: 'Río Sereno',    recibidoPct: 65, ejecutadoPct: 55, codigo_siafpa: 'MTA-COR-05' },
    ],
    rubros: [
      { nombre: 'Infraestructura Vial', pct: 72, color: '#00e64d', partida: '510-21-001-001', acta_cgr: 'CGR-2026-00891-A' },
      { nombre: 'Agua y Saneamiento',   pct: 45, color: '#2563eb', partida: '510-21-001-002', acta_cgr: 'CGR-2026-00891-B' },
      { nombre: 'Ambiente y Parques',   pct: 88, color: '#00b83d', partida: '510-21-001-003', acta_cgr: 'CGR-2026-00891-C' },
      { nombre: 'Educación y Cultura',  pct: 31, color: '#f6c90e', partida: '510-21-001-004', acta_cgr: 'CGR-2026-00891-D' },
      { nombre: 'Alumbrado Público',    pct: 18, color: '#e53e3e', partida: '510-21-001-005', acta_cgr: 'CGR-2026-00891-E' },
    ],
  },
  volcan:       { recibido: 820000, ejecutado: 508400, proceso: 180000, saldo: 131600 },
  cerropunta:   { recibido: 540000, ejecutado: 216000, proceso: 150000, saldo: 174000 },
  cuestapiedra: { recibido: 380000, ejecutado: 182400, proceso: 110000, saldo:  87600 },
  pasoancho:    { recibido: 310000, ejecutado:  93000, proceso: 120000, saldo:  97000 },
  riosereno:    { recibido: 380000, ejecutado: 148600, proceso: 120000, saldo: 111400 },
};

/* ── PROYECTOS — Estructura OCDS v1.1 completa ──
   Cada proyecto es un "release" OCDS con las etapas:
   planning → tender → award → contract → implementation  */
const PROYECTOS = [
  {
    // ── Identificadores internos (para el mapa y UI)
    id: 'p1', cx: 120, cy: 290,

    // ── OCDS: Identificador único de contratación
    ocid:           'ocds-pa-mta-2025-043',
    ocds_tag:       ['contract', 'implementation'],

    // ── Datos del proyecto
    nombre:         'Pavimentación Calle Principal',
    descripcion:    'Pavimentación de 2.4 km de calle principal del casco urbano de Volcán, incluyendo señalización horizontal y vertical.',
    zona:           'Volcán',
    estado:         'finalizado',

    // ── OCDS: Licitación (tender)
    licitacion: {
      id:             'MTA-LICIT-2025-043',
      tipo:           'selectiva',         // selectiva | publica | directa
      fecha_publicacion: '2025-06-01',
      fecha_cierre:   '2025-07-15',
      num_oferentes:  4,
      acto_publico:   'AP-2025-043',
    },

    // ── OCDS: Adjudicación (award)
    adjudicacion: {
      empresa:        'Const. Chiriquí S.A.',
      ruc_empresa:    '155-234-1-2019',
      monto:          145000,
      moneda:         'PAB',
      fecha:          '2025-08-01',
    },

    // ── OCDS: Contrato
    contrato:       'MTA-2025-043',
    fecha_inicio:   '2025-09-01',
    fecha_fin:      '2025-12-15',
    fecha:          'Dic 2025',

    // ── SIAFPA / Contraloría
    siafpa: {
      acta_refrendo:    'CGR-REF-2025-04312',
      fecha_refrendo:   '2025-08-20',
      resolucion_pago:  'MTA-ORD-2025-0892',
      partida:          '510-21-001-001-2025',
    },

    // ── OCDS: Implementación
    implementacion: {
      pct_fisico:     100,
      pct_financiero: 100,
      fecha_cierre_real: '2025-12-18',
      acta_entrega:   'MTA-ACT-2025-1204',
    },

    // Alias para compatibilidad con código UI existente
    get costo()   { return `B/.${this.adjudicacion.monto.toLocaleString('es-PA')}`; },
    get empresa() { return this.adjudicacion.empresa; },
  },
  {
    id: 'p2', cx: 265, cy: 200,
    ocid:           'ocds-pa-mta-2026-039',
    ocds_tag:       ['contract', 'implementation'],
    nombre:         'Mejora Acueducto',
    descripcion:    'Sustitución de 3.8 km de tubería de asbestos-cemento por PVC de alta resistencia en el sistema de acueducto de Cerro Punta.',
    zona:           'Cerro Punta',
    estado:         'construccion',
    licitacion: {
      id:             'MTA-LICIT-2026-039',
      tipo:           'publica',
      fecha_publicacion: '2025-11-01',
      fecha_cierre:   '2025-12-10',
      num_oferentes:  7,
      acto_publico:   'AP-2026-039',
    },
    adjudicacion: {
      empresa:        'HidroAndes S.A.',
      ruc_empresa:    '890-112-1-2017',
      monto:          87500,
      moneda:         'PAB',
      fecha:          '2026-01-08',
    },
    contrato:       'MTA-2026-039',
    fecha_inicio:   '2026-01-20',
    fecha_fin:      '2026-03-31',
    fecha:          'Mar 2026 est.',
    siafpa: {
      acta_refrendo:    'CGR-REF-2026-00234',
      fecha_refrendo:   '2026-01-10',
      resolucion_pago:  'MTA-ORD-2026-0041',
      partida:          '510-21-001-002-2026',
    },
    implementacion: { pct_fisico: 78, pct_financiero: 60, fecha_cierre_real: null, acta_entrega: null },
    get costo()   { return `B/.${this.adjudicacion.monto.toLocaleString('es-PA')}`; },
    get empresa() { return this.adjudicacion.empresa; },
  },
  {
    id: 'p3', cx: 410, cy: 255,
    ocid:           'ocds-pa-mta-2025-031',
    ocds_tag:       ['tender'],
    nombre:         'Ampliación Mercado Municipal',
    descripcion:    'Ampliación de 800 m² del mercado municipal existente. Proyecto detenido por revisión de planos. En proceso de licitación.',
    zona:           'Cuesta de Piedra',
    estado:         'detenido',
    licitacion: {
      id:             'MTA-LICIT-2025-031',
      tipo:           'publica',
      fecha_publicacion: '2025-05-01',
      fecha_cierre:   null,
      num_oferentes:  0,
      acto_publico:   null,
      razon_suspension: 'Revisión técnica de planos — Resolución MTA-SUSP-2025-012',
    },
    adjudicacion:   null,
    contrato:       'MTA-2025-031',
    fecha_inicio:   null,
    fecha_fin:      null,
    fecha:          'Sin fecha definida',
    siafpa: {
      acta_refrendo:    null,
      resolucion_presupuesto: 'MTA-PRES-2025-0310',
      partida:          '510-21-001-001-2025',
    },
    implementacion: { pct_fisico: 0, pct_financiero: 0, fecha_cierre_real: null, acta_entrega: null },
    get costo()   { return 'B/.210,000 (estimado)'; },
    get empresa() { return 'Sin adjudicar'; },
  },
  {
    id: 'p4', cx: 500, cy: 175,
    ocid:           'ocds-pa-mta-2025-044',
    ocds_tag:       ['contract', 'implementation'],
    nombre:         'Cancha Multipropósito',
    descripcion:    'Construcción de cancha cubierta de usos múltiples: fútbol sala, baloncesto y voleibol. Capacidad para 250 espectadores.',
    zona:           'Río Sereno',
    estado:         'finalizado',
    licitacion: {
      id:             'MTA-LICIT-2025-044',
      tipo:           'selectiva',
      fecha_publicacion: '2025-04-15',
      fecha_cierre:   '2025-05-30',
      num_oferentes:  3,
      acto_publico:   'AP-2025-044',
    },
    adjudicacion: {
      empresa:        'Deportivo Bocas S.A.',
      ruc_empresa:    '445-889-1-2020',
      monto:          110000,
      moneda:         'PAB',
      fecha:          '2025-06-10',
    },
    contrato:       'MTA-2025-044',
    fecha_inicio:   '2025-07-01',
    fecha_fin:      '2025-11-30',
    fecha:          'Nov 2025',
    siafpa: {
      acta_refrendo:    'CGR-REF-2025-03891',
      fecha_refrendo:   '2025-06-20',
      resolucion_pago:  'MTA-ORD-2025-0751',
      partida:          '510-21-001-003-2025',
    },
    implementacion: { pct_fisico: 100, pct_financiero: 100, fecha_cierre_real: '2025-11-28', acta_entrega: 'MTA-ACT-2025-1128' },
    get costo()   { return `B/.${this.adjudicacion.monto.toLocaleString('es-PA')}`; },
    get empresa() { return this.adjudicacion.empresa; },
  },
  {
    id: 'p5', cx: 195, cy: 365,
    ocid:           'ocds-pa-mta-2026-011',
    ocds_tag:       ['contract', 'implementation'],
    nombre:         'Aceras y Rampas Accesibles',
    descripcion:    'Construcción de 1.2 km de aceras y 24 rampas de accesibilidad para personas con discapacidad conforme a la Ley 42/1999.',
    zona:           'Paso Ancho',
    estado:         'construccion',
    licitacion: {
      id:             'MTA-LICIT-2026-011',
      tipo:           'directa',
      fecha_publicacion: '2026-01-10',
      fecha_cierre:   '2026-01-25',
      num_oferentes:  2,
      acto_publico:   'AP-2026-011',
    },
    adjudicacion: {
      empresa:        'Pavimentos del Sur',
      ruc_empresa:    '223-445-1-2021',
      monto:          42000,
      moneda:         'PAB',
      fecha:          '2026-02-01',
    },
    contrato:       'MTA-2026-011',
    fecha_inicio:   '2026-02-10',
    fecha_fin:      '2026-04-30',
    fecha:          'Abr 2026 est.',
    siafpa: {
      acta_refrendo:    'CGR-REF-2026-00445',
      fecha_refrendo:   '2026-02-05',
      resolucion_pago:  'MTA-ORD-2026-0089',
      partida:          '510-21-001-001-2026',
    },
    implementacion: { pct_fisico: 45, pct_financiero: 35, fecha_cierre_real: null, acta_entrega: null },
    get costo()   { return `B/.${this.adjudicacion.monto.toLocaleString('es-PA')}`; },
    get empresa() { return this.adjudicacion.empresa; },
  },
];

/* ── TRANSPARENCIA ACTIVA — 24 puntos ANTAI (Ley 6/2002 Art. 9) ──
   Publicación mensual obligatoria. Actualizar cada mes.          */
const TRANSPARENCIA_ACTIVA = {
  ultima_actualizacion: '2026-03-01',
  periodo:              'Enero–Marzo 2026',
  responsable:          'Oficial de Transparencia · Alcaldía de Tierras Altas',
  contacto:             'transparencia@tierrasaltas.gob.pa',

  // Los 24 puntos exigidos por ANTAI
  puntos: [
    // 1. Estructura orgánica
    { id: 1,  titulo: 'Estructura Orgánica',
      estado: 'publicado', url: '/docs/organigrama-2026.pdf',
      descripcion: 'Organigrama oficial de la Alcaldía de Tierras Altas, vigente 2026.' },

    // 2. Funciones de cada unidad
    { id: 2,  titulo: 'Funciones por Unidad Administrativa',
      estado: 'publicado', url: '/docs/manual-funciones-2026.pdf',
      descripcion: 'Manual de funciones y responsabilidades por unidad.' },

    // 3. Directorio de funcionarios
    { id: 3,  titulo: 'Directorio de Funcionarios',
      estado: 'publicado', url: null,
      datos: [
        { cargo: 'Alcalde', nombre: 'Alexsander Chavarría', correo: 'alcalde@tierrasaltas.gob.pa', telefono: '730-XXXX' },
        { cargo: 'Secretaria Municipal', nombre: 'A. González', correo: 'secretaria@tierrasaltas.gob.pa', telefono: '730-XXXX' },
        { cargo: 'Tesorero Municipal', nombre: 'R. Araúz', correo: 'tesoreria@tierrasaltas.gob.pa', telefono: '730-XXXX' },
      ],
      descripcion: 'Directorio completo de funcionarios de la Alcaldía.' },

    // 4. Planilla de salarios
    { id: 4,  titulo: 'Planilla de Salarios',
      estado: 'publicado', url: null,
      datos: {
        periodo: 'Enero 2026',
        total_funcionarios: 38,
        masa_salarial_mensual: 68400,
        desglose: [
          { categoria: 'Directivos',    cantidad: 4,  salario_promedio: 3200 },
          { categoria: 'Técnicos',      cantidad: 12, salario_promedio: 1800 },
          { categoria: 'Administrativos',cantidad: 14, salario_promedio: 1200 },
          { categoria: 'Operativos',    cantidad: 8,  salario_promedio: 850  },
        ],
        fuente_siafpa: 'SIAFPA-PLAN-2026-0031',
      },
      descripcion: 'Planilla salarial mensual conforme a Ley 6/2002 Art. 9 núm. 4.' },

    // 5. Viáticos
    { id: 5,  titulo: 'Viáticos y Gastos de Transporte',
      estado: 'publicado', url: null,
      datos: {
        periodo: 'Enero–Marzo 2026',
        total: 4850,
        registros: [
          { funcionario: 'Alcalde Chavarría', destino: 'Ciudad de Panamá', motivo: 'Reunión AND', fecha: '2026-01-15', monto: 320, resolucion: 'MTA-VIAT-2026-001' },
          { funcionario: 'Secretaria González', destino: 'David, Chiriquí', motivo: 'Capacitación MEF', fecha: '2026-02-08', monto: 180, resolucion: 'MTA-VIAT-2026-008' },
          { funcionario: 'Tesorero Araúz', destino: 'Ciudad de Panamá', motivo: 'Contraloría', fecha: '2026-02-20', monto: 340, resolucion: 'MTA-VIAT-2026-012' },
        ],
      },
      descripcion: 'Viáticos aprobados y pagados con número de resolución y destino.' },

    // 6. Gastos de representación
    { id: 6,  titulo: 'Gastos de Representación',
      estado: 'publicado', url: null,
      datos: { periodo: 'Q1 2026', total: 1200, detalle: 'Protocolo eventos institucionales y relaciones interinstitucionales.' },
      descripcion: 'Gastos de representación conforme a presupuesto aprobado.' },

    // 7. Presupuesto aprobado
    { id: 7,  titulo: 'Presupuesto Aprobado',
      estado: 'publicado', url: null,
      datos: { anio: 2026, total: 2430000, resolucion: 'MIVIOT-DGA-2026-0142', acta_cgr: 'CGR-REFRENDO-2026-00891' },
      descripcion: 'Presupuesto municipal aprobado con número de resolución y acta de refrendo CGR.' },

    // 8. Ejecución presupuestaria
    { id: 8,  titulo: 'Ejecución Presupuestaria',
      estado: 'publicado', url: null,
      datos: { ejecutado: 1148400, porcentaje: 47.3, corte: '2026-03-01', fuente_siafpa: 'SIAFPA-EJEC-2026-Q1' },
      descripcion: 'Informe de ejecución presupuestaria actualizado mensualmente.' },

    // 9–10. Contrataciones y licitaciones
    { id: 9,  titulo: 'Procesos de Contratación Pública',
      estado: 'publicado', url: null,
      datos: { total_contratos: 5, monto_total: 594500, fuente: 'PanamaCompra · DGCP', ocds_endpoint: '/api/export.json' },
      descripcion: 'Todos los contratos en formato OCDS v1.1. Exportables en JSON/CSV.' },

    { id: 10, titulo: 'Actas de Adjudicación',
      estado: 'publicado', url: null,
      datos: PROYECTOS.filter(p => p.adjudicacion).map(p => ({
        contrato: p.contrato, acto_publico: p.licitacion?.acto_publico,
        empresa: p.adjudicacion?.empresa, monto: p.adjudicacion?.monto,
        acta_cgr: p.siafpa?.acta_refrendo,
      })),
      descripcion: 'Actas de adjudicación con número de acto público y refrendo de la Contraloría.' },

    // 11. Declaraciones juradas
    { id: 11, titulo: 'Declaraciones Juradas de Patrimonio',
      estado: 'pendiente', url: null,
      descripcion: 'Declaraciones juradas de todos los funcionarios de libre nombramiento conforme a Ley 59/1999. Pendiente de publicación.' },

    // 12–13. Informes y auditorías
    { id: 12, titulo: 'Informe de Gestión Anual',
      estado: 'publicado', url: '/docs/informe-gestion-2025.pdf',
      descripcion: 'Informe anual de gestión 2025 presentado al Consejo Municipal.' },

    { id: 13, titulo: 'Informes de Auditoría Interna',
      estado: 'publicado', url: '/docs/auditoria-interna-Q4-2025.pdf',
      descripcion: 'Informes de auditoría interna del período 2025.' },

    // 14. Resoluciones y acuerdos municipales
    { id: 14, titulo: 'Acuerdos y Resoluciones del Consejo Municipal',
      estado: 'publicado', url: '/docs/acuerdos-consejo-2026.pdf',
      descripcion: 'Acuerdos aprobados en sesiones del Consejo Municipal 2026.' },

    // 15–16. Marco legal
    { id: 15, titulo: 'Marco Legal Institucional',
      estado: 'publicado', url: null,
      datos: { leyes: ['Ley 106/1973 · Régimen Municipal', 'Ley 37/2009 · Descentralización', 'Ley 6/2002 · Transparencia'] },
      descripcion: 'Base legal que rige la gestión de la Alcaldía de Tierras Altas.' },

    { id: 16, titulo: 'Reglamento Interno',
      estado: 'publicado', url: '/docs/reglamento-interno-2024.pdf',
      descripcion: 'Reglamento interno de la Alcaldía vigente.' },

    // 17. Proyectos de inversión
    { id: 17, titulo: 'Plan de Inversión Pública',
      estado: 'publicado', url: null,
      datos: { proyectos: PROYECTOS.length, inversion_total: 594500, fuente: 'AND · PIOPS · Fondos Propios' },
      descripcion: 'Plan de inversión con 5 proyectos activos en todos los corregimientos.' },

    // 18. Estadísticas institucionales
    { id: 18, titulo: 'Estadísticas de Servicios Municipales',
      estado: 'publicado', url: null,
      datos: { tramites_2025: 1840, quejas_resueltas: 312, propuestas_recibidas: 47 },
      descripcion: 'Estadísticas de atención ciudadana del período 2025.' },

    // 19–20. Acceso a la información
    { id: 19, titulo: 'Oficial de Información y Transparencia',
      estado: 'publicado', url: null,
      datos: { nombre: 'Por designar', correo: 'transparencia@tierrasaltas.gob.pa', telefono: '730-XXXX' },
      descripcion: 'Datos de contacto del Oficial de Información conforme a Ley 6/2002.' },

    { id: 20, titulo: 'Solicitudes de Acceso a Información Pública',
      estado: 'publicado', url: null,
      datos: { recibidas_2025: 23, respondidas: 21, pendientes: 2, tiempo_promedio_dias: 8 },
      descripcion: 'Registro de solicitudes de información pública y tiempos de respuesta.' },

    // 21. Política de privacidad (Ley 81/2019)
    { id: 21, titulo: 'Política de Protección de Datos Personales',
      estado: 'publicado', url: null,
      descripcion: 'Política de privacidad conforme a Ley 81/2019 de Protección de Datos Personales (ANTAI).' },

    // 22–24. Adicionales exigidos
    { id: 22, titulo: 'Plan Operativo Anual (POA)',
      estado: 'publicado', url: '/docs/poa-2026.pdf',
      descripcion: 'Plan Operativo Anual 2026 aprobado por el Consejo Municipal.' },

    { id: 23, titulo: 'Inventario de Bienes Municipales',
      estado: 'pendiente', url: null,
      descripcion: 'Inventario de bienes muebles e inmuebles del municipio. En proceso de levantamiento.' },

    { id: 24, titulo: 'Convenios e Instrumentos Jurídicos',
      estado: 'publicado', url: null,
      datos: [
        { nombre: 'Convenio AND–Tierras Altas', objeto: 'PIOPS 2026', fecha: '2026-01-10', monto: 1800000 },
        { nombre: 'Acuerdo Interinstitucional MINSA', objeto: 'Salud comunitaria', fecha: '2025-11-01', monto: 0 },
      ],
      descripcion: 'Convenios vigentes con instituciones nacionales e internacionales.' },
  ],
};

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
