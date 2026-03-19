/* ══════════════════════════════════════════════════════════════
   TRAMITES/PAGOS.JS — Módulo de Pagos Municipales
   Portal Ciudadano Transparente · Alcaldía de Tierras Altas
   Versión: 1.0 — Marzo 2026

   Arquitectura:
   - Este módulo corre en el NAVEGADOR del ciudadano (frontend)
   - Prepara y valida las transacciones antes de enviarlas al banco
   - El procesamiento real ocurre en los servidores de BAC/Yappy
   - Los webhooks de confirmación son recibidos por api/core_logic.js

   Pasarelas configuradas:
   ✅ Yappy (BAC Credomatic) — pagos móviles
   ✅ Tarjetas Visa/MasterCard (Clave/BAC) — crédito y débito
   ✅ ACH — transferencia bancaria directa
   ⏳ SFEP/DGI — factura electrónica (requiere contrato PAC)
══════════════════════════════════════════════════════════════ */

'use strict';

// ── Configuración de pasarelas
// Las credenciales reales se configuran cuando la Alcaldía
// registra el merchant con BAC Credomatic y obtiene el contrato DGI
const PASARELAS = {

  YAPPY: {
    nombre:      'Yappy',
    activo:      false, // ← true cuando BAC entregue merchant_id
    merchant_id: null,  // ← reemplazar: 'ALCALDIA_TIERRAS_ALTAS_XXX'
    // Yappy genera un deeplink que abre la app del ciudadano
    deeplink_base: 'https://yappy.bac.net/yappy/pay',
    webhook_path:  '/api/webhooks/yappy',
    moneda:      'PAB',
    comision_pct: 1.5,  // 1.5% por transacción — tarifa estándar BAC 2026
  },

  CLAVE: {
    nombre:      'Visa / MasterCard',
    activo:      false, // ← true cuando Clave entregue merchant_key
    merchant_key: null, // ← reemplazar con llave pública Clave
    endpoint:    'https://secure.clave.com.pa/payment/v2/charge',
    webhook_path: '/api/webhooks/clave',
    moneda:      'PAB',
    comision_pct: 2.9,  // 2.9% + B/.0.30 por transacción
  },

  ACH: {
    nombre:      'ACH Panamá',
    activo:      false, // ← true cuando el banco municipal configure ACH
    cuenta_destino: null, // ← cuenta oficial de la Alcaldía
    banco:          null, // ← banco custodio
    webhook_path:   '/api/webhooks/ach',
    moneda:         'PAB',
    comision_pct:   0,    // ACH sin comisión para entidades gubernamentales
    tiempo_acred:   '1-2 días hábiles',
  },

};

// ── Tasas municipales vigentes
// Fuente: Acuerdo Municipal Nº 12-2024 · Alcaldía de Tierras Altas
const TASAS = {
  placas:        { base: 50.00,  descripcion: 'Impuesto rodamiento vehicular anual' },
  licencia:      { base: 150.00, descripcion: 'Licencia comercial — actividad económica' },
  paz_salvo:     { base: 15.00,  descripcion: 'Certificado de paz y salvo municipal' },
  construccion:  { base: 75.00,  descripcion: 'Permiso de obra menor — base' },
  ibi:           { base: null,   descripcion: 'IBI — monto según catastro MEF' },
};

// ── Estados de una transacción
const ESTADO_TX = {
  PENDIENTE:   'pendiente',
  PROCESANDO:  'procesando',
  APROBADA:    'aprobada',
  RECHAZADA:   'rechazada',
  REVERTIDA:   'revertida',
  EXPIRADA:    'expirada',
};

// ── Mensajes para el ciudadano
const MENSAJES = {
  pasarela_inactiva: 'Este método de pago estará disponible próximamente. La Alcaldía está en proceso de activación bancaria.',
  monto_invalido:    'El monto ingresado no es válido. Verifica tu deuda en la Alcaldía.',
  cedula_requerida:  'Debes verificar tu identidad antes de realizar un pago municipal.',
  timeout:           'La conexión con el banco tardó demasiado. Tu dinero NO fue debitado. Intenta de nuevo.',
  aprobada:          'Pago procesado exitosamente. Tu factura electrónica fue enviada a tu correo.',
  rechazada:         'El pago fue rechazado por el banco. Verifica los datos de tu tarjeta o saldo disponible.',
};

// ══════════════════════════════════════════════════════════════
// GENERADOR DE REFERENCIA ÚNICA
// Formato: MTA-YYYY-MMDD-XXXXXX
// MTA = Municipio Tierras Altas · cumple formato DGI para SFEP
// ══════════════════════════════════════════════════════════════
function generarReferencia(tipo) {
  const ahora  = new Date();
  const año    = ahora.getFullYear();
  const mes    = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia    = String(ahora.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 900000 + 100000);
  const prefijos = {
    placas:       'PLA',
    licencia:     'LIC',
    paz_salvo:    'PAZ',
    construccion: 'CON',
    ibi:          'IBI',
    generico:     'TRM',
  };
  const pref = prefijos[tipo] || prefijos.generico;
  return `MTA-${pref}-${año}${mes}${dia}-${random}`;
}

// ══════════════════════════════════════════════════════════════
// VALIDACIONES PRE-PAGO
// Se ejecutan en el cliente ANTES de contactar al banco
// ══════════════════════════════════════════════════════════════
const Validacion = {

  monto(monto) {
    const n = parseFloat(monto);
    if (isNaN(n) || n <= 0)      return { valido: false, msg: 'El monto debe ser mayor a cero.' };
    if (n > 50000)                return { valido: false, msg: 'Monto excede el límite por transacción (B/.50,000).' };
    if (!/^\d+(\.\d{1,2})?$/.test(String(monto))) return { valido: false, msg: 'Formato de monto inválido.' };
    return { valido: true };
  },

  cedula(cedula) {
    if (!cedula) return { valido: false, msg: MENSAJES.cedula_requerida };
    // Delegamos a ServiciosExternos si está disponible
    if (window.ServiciosExternos) {
      return window.ServiciosExternos.validarFormatoCedula(cedula);
    }
    return { valido: /^\d{1,2}-\d{1,4}-\d{1,5}$/.test(cedula.trim()), msg: 'Formato de cédula inválido.' };
  },

  tarjeta(numero) {
    // Algoritmo de Luhn — validación estándar de tarjetas de crédito
    const limpio = numero.replace(/\s|-/g, '');
    if (!/^\d{13,19}$/.test(limpio)) return { valido: false, msg: 'Número de tarjeta inválido.' };
    let suma = 0;
    let doble = false;
    for (let i = limpio.length - 1; i >= 0; i--) {
      let d = parseInt(limpio[i]);
      if (doble) { d *= 2; if (d > 9) d -= 9; }
      suma += d;
      doble = !doble;
    }
    return suma % 10 === 0
      ? { valido: true, red: detectarRedTarjeta(limpio) }
      : { valido: false, msg: 'Número de tarjeta inválido.' };
  },

  cvv(cvv, red) {
    const longitud = red === 'amex' ? 4 : 3;
    return /^\d+$/.test(cvv) && cvv.length === longitud
      ? { valido: true }
      : { valido: false, msg: `El CVV debe tener ${longitud} dígitos.` };
  },

  vencimiento(mm, yy) {
    const mes = parseInt(mm), año = 2000 + parseInt(yy);
    const ahora = new Date();
    const expira = new Date(año, mes - 1, 1);
    return expira > ahora
      ? { valido: true }
      : { valido: false, msg: 'Tarjeta vencida.' };
  },

};

function detectarRedTarjeta(numero) {
  if (/^4/.test(numero))          return 'visa';
  if (/^5[1-5]/.test(numero))     return 'mastercard';
  if (/^3[47]/.test(numero))      return 'amex';
  return 'desconocida';
}

// ══════════════════════════════════════════════════════════════
// PROCESADOR YAPPY
// Genera deeplink → ciudadano abre app Yappy → banco confirma
// ══════════════════════════════════════════════════════════════
const ProcesadorYappy = {

  async iniciarPago({ monto, concepto, cedula, tipo }) {
    if (!PASARELAS.YAPPY.activo || !PASARELAS.YAPPY.merchant_id) {
      return { ok: false, mensaje: MENSAJES.pasarela_inactiva, estado: ESTADO_TX.RECHAZADA };
    }

    const validMonto = Validacion.monto(monto);
    if (!validMonto.valido) return { ok: false, mensaje: validMonto.msg };

    const referencia = generarReferencia(tipo);
    const montoFinal = parseFloat(monto);

    // Construir deeplink de Yappy
    // Formato oficial BAC Credomatic — documentación merchant 2025
    const params = new URLSearchParams({
      merchant: PASARELAS.YAPPY.merchant_id,
      amount:   montoFinal.toFixed(2),
      ref:      referencia,
      desc:     concepto.substring(0, 60), // Yappy limita descripción a 60 chars
      callback: `${window.location.origin}${PASARELAS.YAPPY.webhook_path}`,
    });

    const deeplink = `${PASARELAS.YAPPY.deeplink_base}?${params.toString()}`;

    // Registrar transacción pendiente localmente
    const tx = {
      referencia,
      pasarela:  'YAPPY',
      monto:     montoFinal,
      concepto,
      cedula,
      estado:    ESTADO_TX.PENDIENTE,
      timestamp: new Date().toISOString(),
    };
    PagosPendientes.guardar(tx);

    // Abrir Yappy en móvil o mostrar QR en escritorio
    if (/Android|iPhone/i.test(navigator.userAgent)) {
      window.location.href = deeplink;
    } else {
      UI.mostrarQRYappy(deeplink, referencia, montoFinal);
    }

    return { ok: true, referencia, deeplink, estado: ESTADO_TX.PENDIENTE };
  },

};

// ══════════════════════════════════════════════════════════════
// PROCESADOR TARJETA (Clave/BAC)
// Tokenización → cargo al banco → webhook confirma
// NOTA: Los datos de tarjeta NUNCA pasan por nuestro servidor.
//       Se envían directamente al servidor PCI-DSS de Clave.
// ══════════════════════════════════════════════════════════════
const ProcesadorTarjeta = {

  async iniciarPago({ monto, concepto, cedula, tipo, tarjeta }) {
    if (!PASARELAS.CLAVE.activo || !PASARELAS.CLAVE.merchant_key) {
      return { ok: false, mensaje: MENSAJES.pasarela_inactiva, estado: ESTADO_TX.RECHAZADA };
    }

    // Validaciones antes de tocar la red
    const validMonto = Validacion.monto(monto);
    if (!validMonto.valido) return { ok: false, mensaje: validMonto.msg };

    const validTarjeta = Validacion.tarjeta(tarjeta.numero);
    if (!validTarjeta.valido) return { ok: false, mensaje: validTarjeta.msg };

    const validCvv = Validacion.cvv(tarjeta.cvv, validTarjeta.red);
    if (!validCvv.valido) return { ok: false, mensaje: validCvv.msg };

    const validVenc = Validacion.vencimiento(tarjeta.mm, tarjeta.yy);
    if (!validVenc.valido) return { ok: false, mensaje: validVenc.msg };

    const referencia = generarReferencia(tipo);

    try {
      // Tokenizar tarjeta con Clave (datos de tarjeta van directo a Clave, no a nuestro servidor)
      const tokenResponse = await this._tokenizar(tarjeta, referencia);
      if (!tokenResponse.ok) return { ok: false, mensaje: tokenResponse.mensaje };

      const tx = {
        referencia,
        pasarela:   'CLAVE',
        monto:      parseFloat(monto),
        concepto,
        cedula,
        token:      tokenResponse.token, // solo el token, nunca el PAN
        estado:     ESTADO_TX.PROCESANDO,
        timestamp:  new Date().toISOString(),
      };
      PagosPendientes.guardar(tx);

      // Mostrar pantalla de procesando al ciudadano
      UI.mostrarProcesando(referencia);

      return { ok: true, referencia, estado: ESTADO_TX.PROCESANDO };

    } catch (err) {
      console.error('[ProcesadorTarjeta] Error:', err.message);
      return { ok: false, mensaje: MENSAJES.timeout, estado: ESTADO_TX.EXPIRADA };
    }
  },

  async _tokenizar(tarjeta, referencia) {
    // Este request va directamente a Clave (PCI-DSS Level 1)
    // Nuestro servidor NUNCA recibe el número de tarjeta
    try {
      const res = await fetch(PASARELAS.CLAVE.endpoint + '/tokenize', {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'X-Merchant-Key': PASARELAS.CLAVE.merchant_key,
        },
        body: JSON.stringify({
          pan:        tarjeta.numero.replace(/\s/g, ''),
          exp_month:  tarjeta.mm,
          exp_year:   tarjeta.yy,
          cvv:        tarjeta.cvv,
          ref:        referencia,
        }),
      });
      if (!res.ok) throw new Error('tokenizacion_fallida');
      const data = await res.json();
      return { ok: true, token: data.token };
    } catch {
      return { ok: false, mensaje: 'No se pudo procesar la tarjeta. Intenta de nuevo.' };
    }
  },

};

// ══════════════════════════════════════════════════════════════
// PROCESADOR ACH
// Transferencia bancaria directa — sin comisión gubernamental
// ══════════════════════════════════════════════════════════════
const ProcesadorACH = {

  generarInstrucciones({ monto, concepto, cedula, tipo }) {
    if (!PASARELAS.ACH.activo) {
      return { ok: false, mensaje: MENSAJES.pasarela_inactiva };
    }

    const referencia = generarReferencia(tipo);

    return {
      ok: true,
      referencia,
      instrucciones: {
        banco:          PASARELAS.ACH.banco || 'Banco a configurar por la Alcaldía',
        cuenta:         PASARELAS.ACH.cuenta_destino || 'Cuenta a configurar por la Alcaldía',
        beneficiario:   'Municipio de Tierras Altas',
        monto:          parseFloat(monto).toFixed(2),
        concepto:       `${concepto} — Ref: ${referencia}`,
        cedula,
        importante:     `Debes incluir la referencia ${referencia} en el campo de descripción de la transferencia para que el pago sea identificado automáticamente.`,
        tiempo:         PASARELAS.ACH.tiempo_acred,
      },
    };
  },

};

// ══════════════════════════════════════════════════════════════
// REGISTRO LOCAL DE PAGOS PENDIENTES
// Persiste en localStorage para sobrevivir recargas de página
// Solo guarda referencia, monto y estado — nunca datos sensibles
// ══════════════════════════════════════════════════════════════
const PagosPendientes = {

  _KEY: 'mta_pagos_pendientes',

  guardar(tx) {
    const lista = this.obtenerTodos();
    // Guardar solo datos no sensibles — nunca token ni PAN
    lista.push({
      referencia: tx.referencia,
      pasarela:   tx.pasarela,
      monto:      tx.monto,
      concepto:   tx.concepto,
      estado:     tx.estado,
      timestamp:  tx.timestamp,
    });
    // Mantener solo los últimos 20 pagos para no saturar localStorage
    const recientes = lista.slice(-20);
    try {
      localStorage.setItem(this._KEY, JSON.stringify(recientes));
    } catch {
      // localStorage lleno — continuar sin persistir
    }
  },

  obtenerTodos() {
    try {
      return JSON.parse(localStorage.getItem(this._KEY) || '[]');
    } catch {
      return [];
    }
  },

  actualizarEstado(referencia, nuevoEstado) {
    const lista = this.obtenerTodos().map(tx =>
      tx.referencia === referencia ? { ...tx, estado: nuevoEstado } : tx
    );
    try {
      localStorage.setItem(this._KEY, JSON.stringify(lista));
    } catch { /* continuar */ }
  },

};

// ══════════════════════════════════════════════════════════════
// RECEPCIÓN DE WEBHOOKS
// Los bancos notifican el resultado del pago a esta función.
// En producción, los webhooks llegan a api/core_logic.js (servidor).
// Esta versión maneja las redirecciones post-pago en el cliente.
// ══════════════════════════════════════════════════════════════
const WebhookHandler = {

  // Procesar parámetros de retorno del banco en la URL
  procesarRetorno() {
    const params = new URLSearchParams(window.location.search);
    const referencia = params.get('ref') || params.get('reference');
    const estado     = params.get('status') || params.get('result');
    const codigo     = params.get('auth_code');

    if (!referencia || !estado) return; // No es un retorno de pago

    const estadoNormalizado = this._normalizarEstado(estado);
    PagosPendientes.actualizarEstado(referencia, estadoNormalizado);

    // Si el pago fue aprobado, solicitar generación de factura electrónica
    if (estadoNormalizado === ESTADO_TX.APROBADA) {
      window.FacturacionSFEP?.generarFactura(referencia, codigo);
      UI.mostrarExito(referencia, codigo);
    } else {
      UI.mostrarError(referencia, estadoNormalizado);
    }

    // Limpiar parámetros de la URL para no re-procesar en recargas
    window.history.replaceState({}, document.title, window.location.pathname);
  },

  _normalizarEstado(estado) {
    const mapa = {
      'approved': ESTADO_TX.APROBADA,  'success': ESTADO_TX.APROBADA,
      'aprobado': ESTADO_TX.APROBADA,  'ok':      ESTADO_TX.APROBADA,
      'declined': ESTADO_TX.RECHAZADA, 'failed':  ESTADO_TX.RECHAZADA,
      'rejected': ESTADO_TX.RECHAZADA, 'error':   ESTADO_TX.RECHAZADA,
      'reversed': ESTADO_TX.REVERTIDA, 'expired':  ESTADO_TX.EXPIRADA,
    };
    return mapa[estado?.toLowerCase()] || ESTADO_TX.RECHAZADA;
  },

};

// ══════════════════════════════════════════════════════════════
// UI — Mensajes al ciudadano durante el proceso de pago
// ══════════════════════════════════════════════════════════════
const UI = {

  mostrarProcesando(referencia) {
    this._toast(`Procesando pago ${referencia}…`, 'info', 0);
  },

  mostrarExito(referencia, codigoAuth) {
    this._toast(`Pago aprobado · Ref: ${referencia} · Auth: ${codigoAuth}`, 'exito', 8000);
  },

  mostrarError(referencia, estado) {
    const msg = estado === ESTADO_TX.EXPIRADA ? MENSAJES.timeout : MENSAJES.rechazada;
    this._toast(`${msg} Ref: ${referencia}`, 'error', 8000);
  },

  mostrarQRYappy(deeplink, referencia, monto) {
    // En escritorio mostrar QR en lugar de deeplink
    // La librería qrcode.js se cargaría aquí si está disponible
    console.info('[Yappy] Pago QR generado para:', referencia, 'Monto:', monto);
    this._toast(`Escanea el código QR con tu app Yappy para pagar B/.${monto.toFixed(2)}`, 'info', 0);
  },

  _toast(mensaje, tipo, duracion) {
    // Integrar con el sistema de notificaciones existente del portal
    if (window.showError) {
      window.showError('tramite-feedback', mensaje);
      return;
    }
    // Fallback básico
    console.log(`[Pago ${tipo}]`, mensaje);
  },

};

// ══════════════════════════════════════════════════════════════
// API PÚBLICA DEL MÓDULO
// ══════════════════════════════════════════════════════════════
window.PagosMunicipales = {

  // Iniciar pago según método seleccionado
  async pagar({ metodo, monto, concepto, cedula, tipo, tarjeta }) {
    switch (metodo?.toUpperCase()) {
      case 'YAPPY':
        return ProcesadorYappy.iniciarPago({ monto, concepto, cedula, tipo });
      case 'TARJETA':
      case 'VISA':
      case 'MASTERCARD':
        return ProcesadorTarjeta.iniciarPago({ monto, concepto, cedula, tipo, tarjeta });
      case 'ACH':
        return ProcesadorACH.generarInstrucciones({ monto, concepto, cedula, tipo });
      default:
        return { ok: false, mensaje: 'Método de pago no reconocido.' };
    }
  },

  // Consultar estado de un pago por referencia
  consultarEstado(referencia) {
    const tx = PagosPendientes.obtenerTodos().find(t => t.referencia === referencia);
    return tx || { estado: ESTADO_TX.EXPIRADA, mensaje: 'Transacción no encontrada.' };
  },

  // Obtener tasas municipales vigentes
  obtenerTasa(tipo) {
    return TASAS[tipo] || null;
  },

  // Generar referencia para mostrar al ciudadano antes de pagar
  generarReferencia,

  // Validadores para usar en formularios
  validar: Validacion,

  // Estados disponibles
  ESTADO: ESTADO_TX,

};

// Procesar retorno bancario al cargar la página (por si redirigieron de vuelta)
document.addEventListener('DOMContentLoaded', () => {
  WebhookHandler.procesarRetorno();
});
