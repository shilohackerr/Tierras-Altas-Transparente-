/* ══════════════════════════════════════
   ADMIN.JS — Utilidades del Panel Administrativo
   Tierras Altas Transparente v1.0
══════════════════════════════════════ */

// Responsivo: abrir sidebar en móvil
function openMobileSidebar() {
  document.getElementById('adminSidebar').classList.add('mobile-open');
}
function closeMobileSidebar() {
  document.getElementById('adminSidebar').classList.remove('mobile-open');
}

// Cerrar sidebar en móvil al hacer clic en enlace
document.querySelectorAll('.sidebar-link').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 768) closeMobileSidebar();
  });
});
