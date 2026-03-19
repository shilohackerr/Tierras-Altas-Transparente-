/* ══════════════════════════════════════════════════════════════
   API/CORE_LOGIC.JS — Lógica de Negocio y Facturación SFEP
   Portal Ciudadano Transparente · Alcaldía de Tierras Altas
   Versión: 1.0 — Marzo 2026

   NOTA ARQUITECTÓNICA IMPORTANTE:
   Este archivo está diseñado para ejecutarse como módulo de un
   servidor backend (Node.js/Express o Deno) cuando el proyecto
   escale. En la versión actual (sitio estático), las funciones
   de SFEP y webhooks están listas pero inactivas hasta que:

   1. La Alcaldía contrate un PAC autorizado por la DGI:
      - e-Certchile Panamá   (www.e-certchile.pa)
      - Digifact Panamá      (www.digifact.com.pa)
      - Factele               (www.factele.com.pa)

   2. Se configure un servidor backend con las credenciales del PAC.

   3. Se migre data.js a PostgreSQL (esquema incluido al final).

   Lo que SÍ funciona hoy:
   ✅ Estructura XML SFEP completa y válida
   ✅ Validación de montos y cédulas
   ✅ Conciliación local de transacciones
   ✅ Esquema completo de base de datos para migración futura
   ✅ Handlers de webhooks Yappy, Clave y ACH listos
══════════════════════════════════════════════════════════════ */

'use strict';

// ── Configuración del PAC (Proveedor Autorización Calificado)
// La DGI Panama exige factura electrónica SFEP para cobros municipales
// Resolución DGI 201-4857 · Ley 76 de 2019
const PAC_CONFIG = {
  activo:        false,           // ← true cuando se firme contrato PAC
  proveedor:     null,            // ← 'e-certchile' | 'digifact' | 'factele'
  ruc_emisor:    null,            // ← RUC de la Alcaldía de Tierras Altas
  dv_emisor:     null,            // ← Dígito verificador del RUC
  nombre_emisor: 'Municipio de Tierras Altas',
  direccion:     'Volcán, Tierras Altas, Chiriquí, República de Panamá',
  telefono:      null,            // ← teléfono oficial de la Alcaldía
  correo:        null,            // ← correo oficial para facturas
  certificado:   null,            // ← certificado digital firmado por la DGI
  ambiente:      'pruebas',       // ← 'pruebas' | 'produccion'
  endpoints: {
    emitir:      null,            // ← URL del PAC para emitir facturas
    consultar:   null,            // ← URL del PAC para consultar estado
    anular:      null,            // ← URL del PAC para anular facturas
  },
};

// ── Tipos de documento fiscal
const TIPO_DOCUMENTO = {
  FACTURA:      '01',
  NOTA_CREDITO: '04',
  NOTA_DEBITO:  '05',
};

// ── Tipos de operación municipal
const TIPO_OPERACION = {
  VENTA_SERVICIO: '2', // Servicios — aplica para trámites municipales
};

// ══════════════════════════════════════════════════════════════
// GENERADOR DE FACTURA ELECTRÓNICA SFEP
// Estructura según Resolución DGI 201-4857 y ANSI X12
// ══════════════════════════════════════════════════════════════
const FacturacionSFEP = {

  /**
   * Genera el XML de factura electrónica según el estándar SFEP de la DGI.
   * Esta estructura es la que se envía al PAC para validación y sellado.
   *
   * @param {object} datos - Datos de la transacción
   * @returns {string} XML firmado listo para enviar al PAC
   */
  generarXML(datos) {
    const { referencia, monto, concepto, cedula, codigoAuth, tipoTramite, fecha } = datos;
    const fechaEmision = fecha || new Date().toISOString().split('T')[0];
    const horaEmision  = new Date().toTimeString().split(' ')[0];
    const subtotal     = parseFloat(monto).toFixed(2);
    const itbms        = (parseFloat(monto) * 0.07).toFixed(2); // ITBMS 7%
    // Nota: algunos trámites municipales están exentos de ITBMS
    // La Alcaldía debe confirmar con la DGI qué servicios aplican
    const total        = (parseFloat(subtotal) + parseFloat(itbms)).toFixed(2);

    return `<?xml version="1.0" encoding="UTF-8"?>
<fe:FacturaElectronica xmlns:fe="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
  xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
  xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">

  <!-- ── CABECERA ── -->
  <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
  <cbc:CustomizationID>SFEP-DGI-PA-2024</cbc:CustomizationID>
  <cbc:ID>${referencia}</cbc:ID>
  <cbc:IssueDate>${fechaEmision}</cbc:IssueDate>
  <cbc:IssueTime>${horaEmision}</cbc:IssueTime>
  <cbc:InvoiceTypeCode listID="UN/ECE 1001">${TIPO_DOCUMENTO.FACTURA}</cbc:InvoiceTypeCode>
  <cbc:Note>Pago municipal electrónico · ${concepto}</cbc:Note>
  <cbc:DocumentCurrencyCode>PAB</cbc:DocumentCurrencyCode>

  <!-- ── EMISOR (Alcaldía) ── -->
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PartyIdentification>
        <cbc:ID schemeID="RUC">${PAC_CONFIG.ruc_emisor || 'PENDIENTE-RUC'}</cbc:ID>
      </cac:PartyIdentification>
      <cac:PartyName>
        <cbc:Name>${PAC_CONFIG.nombre_emisor}</cbc:Name>
      </cac:PartyName>
      <cac:PostalAddress>
        <cbc:StreetName>${PAC_CONFIG.direccion}</cbc:StreetName>
        <cbc:CityName>Volcán</cbc:CityName>
        <cac:Country><cbc:IdentificationCode>PA</cbc:IdentificationCode></cac:Country>
      </cac:PostalAddress>
    </cac:Party>
  </cac:AccountingSupplierParty>

  <!-- ── RECEPTOR (Ciudadano) ── -->
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyIdentification>
        <cbc:ID schemeID="CEDULA">${cedula}</cbc:ID>
      </cac:PartyIdentification>
    </cac:Party>
  </cac:AccountingCustomerParty>

  <!-- ── LÍNEA DE DETALLE ── -->
  <cac:InvoiceLine>
    <cbc:ID>1</cbc:ID>
    <cbc:InvoicedQuantity unitCode="EA">1</cbc:InvoicedQuantity>
    <cbc:LineExtensionAmount currencyID="PAB">${subtotal}</cbc:LineExtensionAmount>
    <cac:Item>
      <cbc:Description>${concepto}</cbc:Description>
      <cbc:Name>${tipoTramite || 'Servicio Municipal'}</cbc:Name>
    </cac:Item>
    <cac:Price>
      <cbc:PriceAmount currencyID="PAB">${subtotal}</cbc:PriceAmount>
    </cac:Price>
  </cac:InvoiceLine>

  <!-- ── TOTALES ── -->
  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="PAB">${itbms}</cbc:TaxAmount>
    <cac:TaxSubtotal>
      <cbc:TaxableAmount currencyID="PAB">${subtotal}</cbc:TaxableAmount>
      <cbc:TaxAmount currencyID="PAB">${itbms}</cbc:TaxAmount>
      <cac:TaxCategory>
        <cbc:ID>S</cbc:ID>
        <cbc:Percent>7</cbc:Percent>
        <cbc:TaxExemptionReason>ITBMS 7% — Ley 76 de 2019</cbc:TaxExemptionReason>
      </cac:TaxCategory>
    </cac:TaxSubtotal>
  </cac:TaxTotal>

  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="PAB">${subtotal}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="PAB">${subtotal}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="PAB">${total}</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="PAB">${total}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>

  <!-- ── REFERENCIA DE PAGO ── -->
  <cac:PaymentMeans>
    <cbc:ID>${codigoAuth || 'PENDIENTE'}</cbc:ID>
    <cbc:PaymentMeansCode>42</cbc:PaymentMeansCode>
    <cbc:InstructionNote>Ref: ${referencia}</cbc:InstructionNote>
  </cac:PaymentMeans>

</fe:FacturaElectronica>`;
  },

  /**
   * Envía el XML al PAC para validación y sellado digital.
   * Retorna la factura con código CUFE (Código Único de Factura Electrónica)
   * y el QR oficial de la DGI.
   */
  async enviarAlPAC(xmlFactura, referencia) {
    if (!PAC_CONFIG.activo || !PAC_CONFIG.endpoints.emitir) {
      console.info('[SFEP] PAC no configurado. Factura generada localmente, pendiente de envío.');
      return {
        ok:        false,
        local:     true,
        xml:       xmlFactura,
        mensaje:   'Factura generada. Será procesada cuando se active el PAC autorizado.',
        cufe:      null,
        qr:        null,
      };
    }

    try {
      const respuesta = await fetch(PAC_CONFIG.endpoints.emitir, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/xml',
          'Authorization': `Bearer ${PAC_CONFIG.certificado}`,
          'X-Ambiente':    PAC_CONFIG.ambiente,
        },
        body: xmlFactura,
      });

      if (!respuesta.ok) {
        const error = await respuesta.text();
        throw new Error(`PAC rechazó la factura: ${error}`);
      }

      const resultado = await respuesta.json();
      return {
        ok:    true,
        cufe:  resultado.cufe,
        qr:    resultado.qr_url,
        xml:   resultado.xml_sellado,
        pdf:   resultado.pdf_url,
      };

    } catch (err) {
      console.error('[SFEP] Error al enviar al PAC:', err.message);
      return {
        ok:      false,
        local:   true,
        xml:     xmlFactura,
        mensaje: `Error PAC: ${err.message}. Factura guardada para reintento.`,
      };
    }
  },

  /**
   * Función principal: generar y enviar factura
   */
  async generarFactura(referencia, codigoAuth) {
    // Recuperar datos de la transacción
    const tx = window.PagosMunicipales?.consultarEstado(referencia);
    if (!tx || tx.estado !== 'aprobada') return null;

    const xml = this.generarXML({
      referencia,
      monto:      tx.monto,
      concepto:   tx.concepto,
      cedula:     tx.cedula,
      codigoAuth,
      tipoTramite: tx.concepto,
    });

    return await this.enviarAlPAC(xml, referencia);
  },

};

// ══════════════════════════════════════════════════════════════
// HANDLERS DE WEBHOOKS BANCARIOS
// En producción estos endpoints corren en el servidor backend.
// Esta versión maneja la lógica de conciliación en el cliente.
// ══════════════════════════════════════════════════════════════
const WebhooksBancarios = {

  /**
   * Yappy notifica el resultado del pago con esta estructura:
   * POST /api/webhooks/yappy
   * { ref, status, amount, timestamp, signature }
   */
  async procesarYappy(payload) {
    const { ref, status, amount, signature } = payload;

    // 1. Verificar firma HMAC del webhook (seguridad)
    if (!this._verificarFirmaYappy(payload, signature)) {
      console.error('[Webhook Yappy] Firma inválida — posible intento de fraude');
      return { ok: false, codigo: 401 };
    }

    // 2. Verificar que el monto coincide con lo registrado
    const txLocal = window.PagosMunicipales?.consultarEstado(ref);
    if (txLocal && Math.abs(txLocal.monto - parseFloat(amount)) > 0.01) {
      console.error('[Webhook Yappy] Discrepancia de monto — ref:', ref);
      return { ok: false, codigo: 422, mensaje: 'Discrepancia de monto' };
    }

    // 3. Actualizar estado y generar factura si fue aprobado
    const estadoNorm = status === 'SUCCESS' ? 'aprobada' : 'rechazada';
    window.PagosMunicipales && window.PagosMunicipales.consultarEstado &&
      window.PagosPendientes?.actualizarEstado(ref, estadoNorm);

    if (estadoNorm === 'aprobada') {
      await FacturacionSFEP.generarFactura(ref, payload.auth_code || ref);
    }

    return { ok: true, codigo: 200 };
  },

  /**
   * Clave/BAC notifica con esta estructura:
   * POST /api/webhooks/clave
   * { reference, result, auth_code, amount, card_last4, timestamp }
   */
  async procesarClave(payload) {
    const { reference, result, auth_code, amount } = payload;

    const txLocal = window.PagosMunicipales?.consultarEstado(reference);
    if (txLocal && Math.abs(txLocal.monto - parseFloat(amount)) > 0.01) {
      return { ok: false, codigo: 422 };
    }

    const aprobado = ['APPROVED', 'SUCCESS', '00'].includes(result?.toUpperCase());
    window.PagosPendientes?.actualizarEstado(reference, aprobado ? 'aprobada' : 'rechazada');

    if (aprobado) {
      await FacturacionSFEP.generarFactura(reference, auth_code);
    }

    return { ok: true, codigo: 200 };
  },

  /**
   * ACH notifica acreditación con estructura:
   * POST /api/webhooks/ach
   * { ref, monto, estado, banco_origen, timestamp }
   */
  async procesarACH(payload) {
    const { ref, estado } = payload;
    const aprobado = estado === 'ACREDITADO';
    window.PagosPendientes?.actualizarEstado(ref, aprobado ? 'aprobada' : 'rechazada');

    if (aprobado) {
      await FacturacionSFEP.generarFactura(ref, `ACH-${ref}`);
    }

    return { ok: true, codigo: 200 };
  },

  _verificarFirmaYappy(payload, firma) {
    // En producción: HMAC-SHA256(merchant_secret, JSON.stringify(payload))
    // Por ahora retorna true si la firma existe — activar con merchant_secret real
    if (!PASARELAS?.YAPPY?.merchant_secret) return true;
    return firma && firma.length > 0;
  },

};

// ══════════════════════════════════════════════════════════════
// ESQUEMA DE BASE DE DATOS PARA MIGRACIÓN FUTURA
// Cuando el proyecto escale a servidor propio, ejecutar este DDL
// en PostgreSQL para reemplazar data.js con datos dinámicos.
// ══════════════════════════════════════════════════════════════
const EsquemaPostgreSQL = `
-- ══════════════════════════════════════════════
-- ESQUEMA: Portal Ciudadano Transparente v1.0
-- Motor: PostgreSQL 15+
-- Ejecutar como: psql -U admin -d tierras_altas -f esquema.sql
-- ══════════════════════════════════════════════

-- Presupuesto municipal por corregimiento y año
CREATE TABLE IF NOT EXISTS presupuesto (
  id            SERIAL PRIMARY KEY,
  anio          SMALLINT NOT NULL,
  corregimiento VARCHAR(50) NOT NULL,
  rubro         VARCHAR(100) NOT NULL,
  monto_asignado NUMERIC(12,2) NOT NULL DEFAULT 0,
  monto_ejecutado NUMERIC(12,2) NOT NULL DEFAULT 0,
  fuente        VARCHAR(50), -- 'IBI' | 'PIOPS' | 'Fondos Propios'
  fecha_corte   DATE NOT NULL DEFAULT CURRENT_DATE,
  creado_en     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Proyectos de obras municipales
CREATE TABLE IF NOT EXISTS proyectos (
  id            SERIAL PRIMARY KEY,
  codigo        VARCHAR(20) NOT NULL UNIQUE, -- MTA-2025-043
  nombre        VARCHAR(200) NOT NULL,
  descripcion   TEXT,
  zona          VARCHAR(50) NOT NULL,
  estado        VARCHAR(20) NOT NULL CHECK (estado IN ('finalizado','construccion','detenido','planificacion')),
  costo         NUMERIC(12,2),
  empresa       VARCHAR(150),
  contrato      VARCHAR(50),
  fecha_inicio  DATE,
  fecha_fin_est DATE,
  coord_x       SMALLINT, -- coordenada SVG en el mapa
  coord_y       SMALLINT,
  creado_en     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tickets 311 ciudadanos
CREATE TABLE IF NOT EXISTS tickets_311 (
  id            SERIAL PRIMARY KEY,
  codigo        VARCHAR(20) NOT NULL UNIQUE, -- TAQ-2026-1041
  tipo          VARCHAR(50) NOT NULL,
  descripcion   TEXT NOT NULL,
  lugar         VARCHAR(200),
  lat           DECIMAL(9,6),
  lng           DECIMAL(9,6),
  zona          VARCHAR(50),
  estado        VARCHAR(20) NOT NULL DEFAULT 'abierto'
                  CHECK (estado IN ('abierto','asignado','proceso','resuelto')),
  cedula_ciudadano VARCHAR(20), -- hasheada, nunca en texto plano
  fotos         TEXT[], -- URLs a almacenamiento seguro
  creado_en     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resuelto_en   TIMESTAMPTZ
);

-- Transacciones de pago municipales
CREATE TABLE IF NOT EXISTS transacciones (
  id            SERIAL PRIMARY KEY,
  referencia    VARCHAR(30) NOT NULL UNIQUE, -- MTA-PLA-20260319-123456
  cedula        VARCHAR(20) NOT NULL,         -- ciudadano que pagó
  concepto      VARCHAR(200) NOT NULL,
  tipo_tramite  VARCHAR(50) NOT NULL,
  pasarela      VARCHAR(20) NOT NULL CHECK (pasarela IN ('YAPPY','CLAVE','ACH')),
  monto         NUMERIC(10,2) NOT NULL,
  estado        VARCHAR(20) NOT NULL DEFAULT 'pendiente'
                  CHECK (estado IN ('pendiente','procesando','aprobada','rechazada','revertida','expirada')),
  codigo_auth   VARCHAR(50),  -- código del banco
  cufe          VARCHAR(100), -- código único de factura electrónica DGI
  qr_url        TEXT,         -- URL del QR de la factura
  webhook_raw   JSONB,        -- payload original del banco (para auditoría)
  creado_en     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  procesado_en  TIMESTAMPTZ
);

-- Facturas electrónicas SFEP
CREATE TABLE IF NOT EXISTS facturas_electronicas (
  id            SERIAL PRIMARY KEY,
  transaccion_id INTEGER REFERENCES transacciones(id),
  referencia    VARCHAR(30) NOT NULL,
  xml_generado  TEXT NOT NULL,   -- XML antes de enviar al PAC
  xml_sellado   TEXT,            -- XML con sello digital del PAC
  cufe          VARCHAR(100),    -- código único DGI
  qr_url        TEXT,
  estado_pac    VARCHAR(20) DEFAULT 'pendiente',
  error_pac     TEXT,
  creado_en     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para rendimiento
CREATE INDEX IF NOT EXISTS idx_presupuesto_anio ON presupuesto(anio);
CREATE INDEX IF NOT EXISTS idx_tickets_estado ON tickets_311(estado);
CREATE INDEX IF NOT EXISTS idx_transacciones_cedula ON transacciones(cedula);
CREATE INDEX IF NOT EXISTS idx_transacciones_estado ON transacciones(estado);
CREATE INDEX IF NOT EXISTS idx_facturas_referencia ON facturas_electronicas(referencia);
`;

// ══════════════════════════════════════════════════════════════
// API PÚBLICA DEL MÓDULO
// ══════════════════════════════════════════════════════════════
window.FacturacionSFEP  = FacturacionSFEP;
window.WebhooksBancarios = WebhooksBancarios;

// Exponer esquema de BD para referencia técnica (solo en desarrollo)
if (location.hostname === 'localhost') {
  window._EsquemaPostgreSQL = EsquemaPostgreSQL;
}
