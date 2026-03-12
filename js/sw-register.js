/* ══════════════════════════════════════
   SW-REGISTER.JS — Registro de Service Worker (PWA)
   Tierras Altas Transparente v1.0
══════════════════════════════════════ */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('[TAT] Service Worker registrado:', reg.scope))
      .catch(err => console.log('[TAT] SW no disponible:', err));
  });
}
