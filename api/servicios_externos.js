/* ══════════════════════════════════════════════════════
   SERVICIOS_EXTERNOS.JS — Middleware de Integraciones
   Portal Ciudadano Transparente · Alcaldía de Tierras Altas
   Versión: 1.0 — Marzo 2026

   Integraciones implementadas:
   ✅ PanamaCompra (DGCP) — API OCDS pública, gratuita
   ✅ Manejo de caídas de servicios gubernamentales
   ⏳ SVI Tribunal Electoral — Pendiente contrato institucional
══════════════════════════════════════════════════════ */

'use strict';

// ── Configuración de endpoints
const SERVICIOS = {

  // PanamaCompra — OCDS público, sin autenticación requerida
  // Fuente: data.open-contracting.org/en/publication/120
  PANAMA_COMPRA: {
    base:    'https://www.panamacompra.gob.pa/Inicio/api',
    ocds:    'https://ocds.open-contracting.org/panama',
    timeout: 8000, // ms — servidores gubernamentales pueden ser lentos
  },

  // SVI Tribunal Electoral — requiere contrato institucional
  // La Alcaldía debe solicitar afiliación en: tribunal-electoral.gob.pa
  SVI: {
    base:       'https://svi3.tribunal-electoral.gob.pa/svi',
    habilitado: false, // ← cambiar a true cuando la Alcaldía obtenga credenciales
    credenciales: {
      usuario:    null, // ← reemplazar con usuario SVI institucional
      password:   null, // ← reemplazar con contraseña SVI institucional
    },
    timeout: 6000,
  },

};

// ── Tiempos de caché para evitar sobrecarga en servidores del gobierno
const CACHE_TTL = {
  contrato:    30 * 60 * 1000,  // 30 minutos — contratos no cambian frecuente
  identidad:   5  * 60 * 1000,  // 5 minutos  — validaciones de cédula
};

// Caché en memoria (se limpia al recargar la página)
const _cache = new Map();

// ── Mensajes de error amigables para el ciudadano
const MENSAJES_ERROR = {
  timeout:      'El servicio del gobierno central está tardando en responder. Por favor intenta de nuevo en unos minutos.',
  no_disponible:'Este servicio no está disponible temporalmente. Puedes continuar y tu solicitud será procesada manualmente.',
  sin_contrato: 'La verificación automática de identidad estará disponible próximamente. Por favor continúa con tu solicitud.',
  no_encontrado:'No se encontró información para este número de contrato en PanamaCompra.',
  red:          'No se pudo conectar con los servidores del gobierno. Verifica tu conexión a internet.',
};

// ══════════════════════════════════════════════════════
// UTILIDADES INTERNAS
// ══════════════════════════════════════════════════════

/**
 * Fetch con timeout — evita que una caída del servidor gubernamental
 * bloquee indefinidamente la interfaz del ciudadano.
 */
async function fetchConTimeout(url, opciones = {}, timeoutMs = 8000) {
  const controlador = new AbortController();
  const timer = setTimeout(() => controlador.abort(), timeoutMs);

  try {
    const respuesta = await fetch(url, {
      ...opciones,
      signal: controlador.signal,
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json',
        ...(opciones.headers || {}),
      },
    });
    clearTimeout(timer);
    return respuesta;
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new Error('timeout');
    }
    throw new Error('red');
  }
}

/**
 * Guardar resultado en caché para reducir llamadas repetidas
 * a APIs gubernamentales con capacidad limitada.
 */
function guardarEnCache(clave, valor, ttl) {
  _cache.set(clave, { valor, expira: Date.now() + ttl });
}

function obtenerDeCache(clave) {
  const entrada = _cache.get(clave);
  if (!entrada) return null;
  if (Date.now() > entrada.expira) {
    _cache.delete(clave);
    return null;
  }
  return entrada.valor;
}

// ══════════════════════════════════════════════════════
// INTEGRACIÓN 1: PANAMACOMPRA (DGCP)
// Fuente de datos: OCDS público, actualizado semanalmente
// ══════════════════════════════════════════════════════

/**
 * Consulta un contrato en PanamaCompra por número de acto público.
 * Retorna: { ok, datos, mensaje }
 *
 * Uso en el mapa de proyectos:
 *   const resultado = await PanamaCompra.consultarContrato('MTA-2025-043');
 */
const PanamaCompra = {

  async consultarContrato(numeroActo) {
    if (!numeroActo || typeof numeroActo !== 'string') {
      return { ok: false, datos: null, mensaje: MENSAJES_ERROR.no_encontrado };
    }

    // Revisar caché primero
    const cacheKey = `contrato_${numeroActo}`;
    const enCache = obtenerDeCache(cacheKey);
    if (enCache) return { ok: true, datos: enCache, fuente: 'cache' };

    try {
      // PanamaCompra expone datos OCDS públicos por número de contrato
      const url = `${SERVICIOS.PANAMA_COMPRA.base}/contratos/${encodeURIComponent(numeroActo)}`;
      const respuesta = await fetchConTimeout(url, {}, SERVICIOS.PANAMA_COMPRA.timeout);

      if (respuesta.status === 404) {
        // Contrato no encontrado — situación normal para contratos locales pequeños
        return { ok: false, datos: null, mensaje: MENSAJES_ERROR.no_encontrado };
      }

      if (!respuesta.ok) {
        throw new Error('no_disponible');
      }

      const json = await respuesta.json();
      const datos = this._normalizarContrato(json, numeroActo);
      guardarEnCache(cacheKey, datos, CACHE_TTL.contrato);

      return { ok: true, datos, fuente: 'api' };

    } catch (err) {
      const tipo = err.message in MENSAJES_ERROR ? err.message : 'no_disponible';
      console.warn(`[PanamaCompra] Error consultando ${numeroActo}:`, err.message);
      return { ok: false, datos: null, mensaje: MENSAJES_ERROR[tipo] };
    }
  },

  /**
   * Normaliza la respuesta de PanamaCompra al formato interno del portal.
   * Si faltan campos, usa los datos que ya están en data.js como respaldo.
   */
  _normalizarContrato(json, numeroActo) {
    // La respuesta OCDS de PanamaCompra tiene esta estructura:
    const release = json?.releases?.[0] || json || {};
    const award   = release?.awards?.[0] || {};
    const tender  = release?.tender || {};

    return {
      numero:       numeroActo,
      descripcion:  tender?.title        || release?.title       || 'Sin descripción disponible',
      contratista:  award?.suppliers?.[0]?.name || award?.name   || null,
      monto:        award?.value?.amount  || tender?.value?.amount || null,
      moneda:       award?.value?.currency || 'PAB',
      estado:       tender?.status        || award?.status        || null,
      fechaInicio:  award?.contractPeriod?.startDate             || null,
      fechaFin:     award?.contractPeriod?.endDate               || null,
      documentos:   (release?.documents || []).map(d => ({
        titulo: d.title || d.documentType,
        url:    d.url,
      })),
      fuente:       'PanamaCompra — DGCP',
      ultimaActualizacion: release?.date || null,
    };
  },

  /**
   * Enriquecer los datos de un proyecto del mapa con info de PanamaCompra.
   * Si la API falla, los datos originales de data.js se mantienen intactos.
   */
  async enriquecerProyecto(proyecto) {
    if (!proyecto?.contrato) return proyecto;

    const resultado = await this.consultarContrato(proyecto.contrato);
    if (!resultado.ok || !resultado.datos) {
      // Fallo silencioso — el proyecto sigue mostrando sus datos originales
      return { ...proyecto, _panamacompra: { disponible: false, mensaje: resultado.mensaje } };
    }

    const d = resultado.datos;
    return {
      ...proyecto,
      // Solo sobrescribir si PanamaCompra tiene datos más completos
      empresa:   d.contratista || proyecto.empresa,
      costo:     d.monto ? `B/.${Number(d.monto).toLocaleString('es-PA')}` : proyecto.costo,
      documentos: d.documentos.length > 0 ? d.documentos : [],
      _panamacompra: { disponible: true, datos: d },
    };
  },

};

// ══════════════════════════════════════════════════════
// INTEGRACIÓN 2: SVI — TRIBUNAL ELECTORAL
// Estado: preparado, pendiente contrato institucional
// ══════════════════════════════════════════════════════

const SVI = {

  /**
   * Verifica si una cédula panameña está en el padrón electoral.
   *
   * IMPORTANTE: Esta función requiere credenciales institucionales del
   * Tribunal Electoral. La Alcaldía debe suscribir el contrato SVI en:
   * tribunal-electoral.gob.pa → Secretaría General → SVI
   *
   * Mientras no esté habilitado, devuelve una validación local básica.
   */
  async verificarCedula(cedula) {
    // Validación local de formato siempre se ejecuta primero
    const formatoValido = this._validarFormatoLocal(cedula);
    if (!formatoValido.valido) {
      return { ok: false, valido: false, mensaje: formatoValido.mensaje, fuente: 'local' };
    }

    // Si el servicio no tiene credenciales, usar solo validación local
    if (!SERVICIOS.SVI.habilitado || !SERVICIOS.SVI.credenciales.usuario) {
      return {
        ok:      true,
        valido:  true, // formato correcto, no podemos verificar contra padrón aún
        mensaje: MENSAJES_ERROR.sin_contrato,
        fuente:  'local',
        nota:    'Verificación de padrón electoral pendiente de activación institucional.',
      };
    }

    // Revisar caché
    const cacheKey = `svi_${cedula}`;
    const enCache  = obtenerDeCache(cacheKey);
    if (enCache)   return { ok: true, ...enCache, fuente: 'cache' };

    // Llamada al SVI cuando esté habilitado
    try {
      const respuesta = await fetchConTimeout(
        `${SERVICIOS.SVI.base}/verificar`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${SERVICIOS.SVI.credenciales.usuario}:${SERVICIOS.SVI.credenciales.password}`)}`,
          },
          body: JSON.stringify({ cedula }),
        },
        SERVICIOS.SVI.timeout
      );

      if (!respuesta.ok) throw new Error('no_disponible');

      const json = await respuesta.json();
      const datos = {
        valido:       json.existe === true,
        nombre:       json.nombre || null,
        enPadron:     json.enPadronTierrasAltas === true,
        mensaje:      json.existe
                      ? 'Cédula verificada en el padrón electoral.'
                      : 'Esta cédula no aparece en el registro del Tribunal Electoral.',
      };

      guardarEnCache(cacheKey, datos, CACHE_TTL.identidad);
      return { ok: true, ...datos, fuente: 'svi' };

    } catch (err) {
      // Si el SVI falla, NO bloqueamos al ciudadano — degradación elegante
      console.warn('[SVI] Servicio no disponible:', err.message);
      return {
        ok:     true,
        valido: true, // formato válido, seguimos sin verificación de padrón
        mensaje: MENSAJES_ERROR.no_disponible,
        fuente: 'fallback',
      };
    }
  },

  /**
   * Validación local de formato de cédula panameña.
   * Funciona sin conexión — es la primera línea de defensa.
   * Formatos válidos: 8-888-8888 | PE-8-888 | E-8-8888 | N-88-8888
   */
  _validarFormatoLocal(cedula) {
    if (!cedula || typeof cedula !== 'string') {
      return { valido: false, mensaje: 'Ingresa tu número de cédula.' };
    }

    const limpia = cedula.trim().toUpperCase();

    // Patrones oficiales del Tribunal Electoral
    const patrones = [
      /^\d{1,2}-\d{1,4}-\d{1,5}$/,    // Nacional: 8-888-8888
      /^PE-\d{1,2}-\d{1,4}$/,           // Panameño por nacimiento en el exterior
      /^E-\d{1,2}-\d{1,4}$/,            // Extranjero naturalizado
      /^N-\d{1,2}-\d{1,4}$/,            // Naturalizados especiales
    ];

    const valido = patrones.some(p => p.test(limpia));
    return {
      valido,
      mensaje: valido ? 'Formato de cédula válido.' : 'El formato de cédula no es válido. Ejemplo: 8-888-8888',
    };
  },

};

// ══════════════════════════════════════════════════════
// API PÚBLICA DEL MÓDULO
// Expone solo lo necesario para app.js y admin.js
// ══════════════════════════════════════════════════════

window.ServiciosExternos = {

  // PanamaCompra
  consultarContrato:    (num)      => PanamaCompra.consultarContrato(num),
  enriquecerProyecto:   (proyecto) => PanamaCompra.enriquecerProyecto(proyecto),

  // SVI — Tribunal Electoral
  verificarCedula:      (cedula)   => SVI.verificarCedula(cedula),
  validarFormatoCedula: (cedula)   => SVI._validarFormatoLocal(cedula),

  // Estado del sistema — útil para el panel admin
  estado: () => ({
    panamaCompra: { habilitado: true,  nota: 'API OCDS pública activa' },
    svi:          { habilitado: SERVICIOS.SVI.habilitado,
                    nota: SERVICIOS.SVI.habilitado
                          ? 'Activo — verificación en padrón electoral disponible'
                          : 'Pendiente contrato institucional con Tribunal Electoral' },
  }),

  // Mensaje de error amigable para mostrar al ciudadano
  mensajeError: (tipo) => MENSAJES_ERROR[tipo] || MENSAJES_ERROR.no_disponible,

};
