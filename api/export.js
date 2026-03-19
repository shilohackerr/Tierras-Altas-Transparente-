/* ══════════════════════════════════════════════════════════════
   API/EXPORT.JS — Exportación de Datos Abiertos
   Portal Ciudadano Transparente · Alcaldía de Tierras Altas
   Versión: 1.0 — Marzo 2026

   Estándares implementados:
   ✅ OCDS v1.1 — Open Contracting Data Standard
   ✅ Ley 6/2002 — Transparencia (ANTAI)
   ✅ AND — Autoridad Nacional de Descentralización
   ✅ Contraloría — referencias SIAFPA en cada contrato
   ✅ CSV compatible con Excel en español (separador ;)
══════════════════════════════════════════════════════════════ */

'use strict';

const ExportadorOCDS = {

  // ── 1. OCDS RELEASE PACKAGE COMPLETO
  // Formato oficial requerido por la Contraloría y la AND
  generarReleasePackage() {
    const releases = PROYECTOS.map(p => this._proyectoToRelease(p));

    return {
      uri:           OCDS_METADATA.uri,
      version:       OCDS_METADATA.version,
      extensions:    OCDS_METADATA.extensions,
      publishedDate: new Date().toISOString(),
      publisher:     OCDS_METADATA.publisher,
      license:       OCDS_METADATA.license,
      publicationPolicy: OCDS_METADATA.publicationPolicy,

      // Metadatos de fiscalización — Contraloría General de la República
      fiscalizacion: {
        presupuesto_aprobado: PRESUPUESTO.todos.siafpa.resolucion_aprobacion,
        acta_refrendo_cgr:    PRESUPUESTO.todos.siafpa.acta_refrendo,
        fecha_refrendo:       PRESUPUESTO.todos.siafpa.fecha_refrendo,
        partida_presupuestaria: PRESUPUESTO.todos.siafpa.partida_presupuestaria,
        fuentes_financiamiento: PRESUPUESTO.todos.siafpa.fuentes,
      },

      releases,
      totals: {
        releases:       releases.length,
        monto_total:    PROYECTOS.reduce((s, p) => s + (p.adjudicacion?.monto || 0), 0),
        moneda:         'PAB',
        periodo:        '2025-2026',
        generado_en:    new Date().toISOString(),
      },
    };
  },

  // ── 2. CONVERTIR PROYECTO A OCDS RELEASE
  _proyectoToRelease(p) {
    return {
      ocid:   p.ocid,
      id:     `${p.ocid}-release-01`,
      date:   new Date().toISOString(),
      tag:    p.ocds_tag,
      language: 'es',
      initiationType: 'tender',

      // Entidad compradora (buyer) — la Alcaldía
      buyer: {
        id:     'PA-MTA-001',
        name:   'Alcaldía Municipal de Tierras Altas',
        scheme: 'PA-AND',
        uri:    'https://shilohackerr.github.io/Tierras-Altas-Transparente-/',
      },

      // Etapa de planeación
      planning: {
        budget: {
          id:           p.siafpa?.partida,
          description:  `Partida presupuestaria: ${p.siafpa?.partida || 'Por asignar'}`,
          amount: {
            amount:   p.adjudicacion?.monto || 0,
            currency: 'PAB',
          },
          project:      p.nombre,
          projectID:    p.id.toUpperCase(),
          source:       'SIAFPA',
          uri:          `https://www.contraloria.gob.pa/siafpa/${p.siafpa?.partida || ''}`,
        },
        rationale: p.descripcion,
        documents: p.siafpa?.resolucion_presupuesto ? [{
          id:           p.siafpa.resolucion_presupuesto,
          documentType: 'budgetApproval',
          title:        `Resolución ${p.siafpa.resolucion_presupuesto}`,
          datePublished: p.fecha_inicio || '2026-01-01',
        }] : [],
      },

      // Licitación
      tender: p.licitacion ? {
        id:           p.licitacion.id,
        title:        p.nombre,
        description:  p.descripcion,
        status:       this._mapearEstadoLicitacion(p.estado),
        procurementMethod: p.licitacion.tipo,
        procurementMethodDetails: p.licitacion.tipo === 'publica'
          ? 'Licitación Pública — Ley 22/2006 DGCP'
          : p.licitacion.tipo === 'selectiva'
          ? 'Licitación por Mejor Valor — Ley 22/2006'
          : 'Contratación Directa — Ley 22/2006 Art. 72',
        tenderPeriod: {
          startDate: p.licitacion.fecha_publicacion,
          endDate:   p.licitacion.fecha_cierre,
        },
        numberOfTenderers: p.licitacion.num_oferentes || 0,
        documents: p.licitacion.acto_publico ? [{
          id:           p.licitacion.acto_publico,
          documentType: 'tenderNotice',
          title:        `Acto Público ${p.licitacion.acto_publico}`,
          url:          `https://www.panamacompra.gob.pa/Inicio/ActoPublico/${p.licitacion.acto_publico}`,
        }] : [],
      } : null,

      // Adjudicación
      awards: p.adjudicacion ? [{
        id:     `${p.ocid}-award-01`,
        title:  `Adjudicación: ${p.nombre}`,
        status: 'active',
        date:   p.adjudicacion.fecha,
        value: {
          amount:   p.adjudicacion.monto,
          currency: p.adjudicacion.moneda,
        },
        suppliers: [{
          id:     p.adjudicacion.ruc_empresa,
          name:   p.adjudicacion.empresa,
          scheme: 'PA-RUC',
        }],
        documents: p.siafpa?.acta_refrendo ? [{
          id:           p.siafpa.acta_refrendo,
          documentType: 'contractAnnexe',
          title:        `Acta de Refrendo CGR: ${p.siafpa.acta_refrendo}`,
          datePublished: p.siafpa.fecha_refrendo,
          url:          `https://www.contraloria.gob.pa/refrendo/${p.siafpa.acta_refrendo}`,
        }] : [],
      }] : [],

      // Contrato firmado
      contracts: p.adjudicacion ? [{
        id:       p.contrato,
        awardID:  `${p.ocid}-award-01`,
        title:    p.nombre,
        status:   p.estado === 'finalizado' ? 'terminated' : 'active',
        period: {
          startDate: p.fecha_inicio,
          endDate:   p.fecha_fin,
        },
        value: {
          amount:   p.adjudicacion.monto,
          currency: p.adjudicacion.moneda,
        },
        dateSigned: p.fecha_inicio,
        documents: [{
          id:           p.contrato,
          documentType: 'signedContract',
          title:        `Contrato ${p.contrato}`,
        }],
        // Referencia cruzada SIAFPA
        implementation: {
          transactions: p.siafpa?.resolucion_pago ? [{
            id:     p.siafpa.resolucion_pago,
            source: 'SIAFPA',
            date:   p.fecha_inicio,
            value: {
              amount:   p.adjudicacion.monto,
              currency: 'PAB',
            },
            payer: { id: 'PA-MTA-001', name: 'Alcaldía de Tierras Altas' },
            payee: { id: p.adjudicacion.ruc_empresa, name: p.adjudicacion.empresa },
            paymentMethod: 'ACH',
            uri: `https://www.contraloria.gob.pa/siafpa/${p.siafpa.resolucion_pago}`,
          }] : [],
          milestones: [{
            id:     `${p.id}-mil-01`,
            title:  'Avance físico',
            status: p.implementacion?.pct_fisico === 100 ? 'met' : 'scheduled',
            code:   'deliveryDateMilestone',
            dueDate: p.fecha_fin,
            dateMet: p.implementacion?.fecha_cierre_real || null,
          }],
          physicalProgress:   { amount: p.implementacion?.pct_fisico || 0 },
          financialProgress:  { amount: p.implementacion?.pct_financiero || 0 },
          finalAudit:         p.implementacion?.acta_entrega ? {
            document: p.implementacion.acta_entrega,
            url:      `/docs/${p.implementacion.acta_entrega}.pdf`,
          } : null,
        },
      }] : [],

      // Partes involucradas
      parties: [
        {
          id:       'PA-MTA-001',
          name:     'Alcaldía Municipal de Tierras Altas',
          roles:    ['buyer'],
          address:  { locality: 'Volcán', region: 'Chiriquí', countryName: 'Panamá' },
          contactPoint: { name: 'Tesorero Municipal', email: 'tesoreria@tierrasaltas.gob.pa' },
        },
        ...(p.adjudicacion ? [{
          id:     p.adjudicacion.ruc_empresa,
          name:   p.adjudicacion.empresa,
          roles:  ['supplier'],
          identifier: { scheme: 'PA-RUC', id: p.adjudicacion.ruc_empresa },
        }] : []),
      ],
    };
  },

  _mapearEstadoLicitacion(estadoProyecto) {
    return {
      finalizado:   'complete',
      construccion: 'active',
      detenido:     'suspended',
      planificacion:'planned',
    }[estadoProyecto] || 'active';
  },

  // ── 3. CSV COMPLETO — Compatible Excel español (separador ;)
  generarCSVProyectos() {
    const encabezado = [
      'OCID','Contrato','Nombre del Proyecto','Descripción','Zona',
      'Estado','Tipo Licitación','Acto Público','Empresa Contratista',
      'RUC Empresa','Monto (PAB)','Fecha Inicio','Fecha Fin',
      'Avance Físico (%)','Avance Financiero (%)','Acta Refrendo CGR',
      'Fecha Refrendo','Resolución Pago SIAFPA','Partida Presupuestaria',
      'Acta Entrega','Fuente',
    ];

    const filas = PROYECTOS.map(p => [
      p.ocid,
      p.contrato,
      p.nombre,
      `"${p.descripcion.replace(/"/g, '""')}"`,
      p.zona,
      p.estado,
      p.licitacion?.tipo || '',
      p.licitacion?.acto_publico || '',
      p.adjudicacion?.empresa || 'Sin adjudicar',
      p.adjudicacion?.ruc_empresa || '',
      p.adjudicacion?.monto || 0,
      p.fecha_inicio || '',
      p.fecha_fin || '',
      p.implementacion?.pct_fisico ?? 0,
      p.implementacion?.pct_financiero ?? 0,
      p.siafpa?.acta_refrendo || '',
      p.siafpa?.fecha_refrendo || '',
      p.siafpa?.resolucion_pago || '',
      p.siafpa?.partida || '',
      p.implementacion?.acta_entrega || '',
      'Alcaldía de Tierras Altas · OCDS v1.1',
    ].join(';'));

    return [encabezado.join(';'), ...filas].join('\n');
  },

  // ── 4. CSV PRESUPUESTO con referencias SIAFPA
  generarCSVPresupuesto() {
    const enc = ['Corregimiento','Presupuesto Asignado (PAB)','Ejecutado (PAB)',
                 'En Proceso (PAB)','Saldo (PAB)','% Ejecutado','Código SIAFPA','Fuente'];
    const corr = ['volcan','cerropunta','cuestapiedra','pasoancho','riosereno'];
    const nombres = ['Volcán','Cerro Punta','Cuesta de Piedra','Paso Ancho','Río Sereno'];
    const siafpaCodes = PRESUPUESTO.todos.corregimientos.map(c => c.codigo_siafpa);

    const filas = corr.map((c, i) => {
      const d = PRESUPUESTO[c];
      const pct = ((d.ejecutado / d.recibido) * 100).toFixed(1);
      return [nombres[i], d.recibido, d.ejecutado, d.proceso, d.saldo,
              pct, siafpaCodes[i], 'SIAFPA · AND · Contraloría CGR'].join(';');
    });

    return [enc.join(';'), ...filas].join('\n');
  },

  // ── 5. CSV TRANSPARENCIA ACTIVA — 24 puntos ANTAI
  generarCSVTransparencia() {
    const enc = ['Punto ANTAI','Título','Estado','Descripción','URL Documento','Última Actualización'];
    const filas = TRANSPARENCIA_ACTIVA.puntos.map(p => [
      p.id,
      `"${p.titulo}"`,
      p.estado,
      `"${p.descripcion.replace(/"/g, '""')}"`,
      p.url || '',
      TRANSPARENCIA_ACTIVA.ultima_actualizacion,
    ].join(';'));

    return [enc.join(';'), ...filas].join('\n');
  },

  // ── 6. DISPARADOR PRINCIPAL DE DESCARGA
  descargar(tipo, formato) {
    let contenido, nombreArchivo, mimeType;
    const fecha = new Date().toISOString().split('T')[0];

    if (formato === 'json') {
      const paquete = this.generarReleasePackage();
      // Agregar transparencia activa al JSON principal
      paquete.transparencia_activa = TRANSPARENCIA_ACTIVA;
      paquete.presupuesto = {
        ...PRESUPUESTO.todos,
        ejecucion_por_corregimiento: {
          volcan:       PRESUPUESTO.volcan,
          cerropunta:   PRESUPUESTO.cerropunta,
          cuestapiedra: PRESUPUESTO.cuestapiedra,
          pasoancho:    PRESUPUESTO.pasoancho,
          riosereno:    PRESUPUESTO.riosereno,
        },
      };
      contenido    = JSON.stringify(paquete, null, 2);
      nombreArchivo = `tierras-altas-ocds-${fecha}.json`;
      mimeType      = 'application/json';

    } else {
      // CSV — generar los 3 hojas concatenadas con separadores claros
      const csvProyectos    = this.generarCSVProyectos();
      const csvPresupuesto  = this.generarCSVPresupuesto();
      const csvTransparencia = this.generarCSVTransparencia();
      contenido = [
        '# ALCALDIA DE TIERRAS ALTAS - DATOS ABIERTOS',
        `# Generado: ${new Date().toLocaleString('es-PA')}`,
        `# Ley 6/2002 · OCDS v1.1 · SIAFPA · ANTAI`,
        '',
        '## SECCION 1: PROYECTOS Y CONTRATOS (OCDS)',
        csvProyectos,
        '',
        '## SECCION 2: EJECUCION PRESUPUESTARIA POR CORREGIMIENTO',
        csvPresupuesto,
        '',
        '## SECCION 3: TRANSPARENCIA ACTIVA - 24 PUNTOS ANTAI',
        csvTransparencia,
      ].join('\n');
      nombreArchivo = `tierras-altas-datos-abiertos-${fecha}.csv`;
      mimeType      = 'text/csv;charset=utf-8;';
    }

    // BOM para Excel en español
    const bom  = formato === 'csv' ? '\uFEFF' : '';
    const blob = new Blob([bom + contenido], { type: mimeType });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};

// ── Exponer globalmente — reemplaza la función exportData de app.js
window.exportData = (formato) => ExportadorOCDS.descargar('completo', formato);
window.ExportadorOCDS = ExportadorOCDS;
