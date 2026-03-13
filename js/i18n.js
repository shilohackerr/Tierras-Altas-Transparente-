/* ══════════════════════════════════════
   I18N.JS — Motor de internacionalización
   Tierras Altas Transparente v1.0
   Idiomas: español, lenguaje fácil, ngäbere
══════════════════════════════════════ */

let currentLang = 'es';

function setLang(lang) {
  currentLang = lang;

  // Actualizar botones
  document.querySelectorAll('.lang-btn, .footer-lang-btn').forEach(btn => {
    const isActive = btn.textContent.trim().toLowerCase().includes(
      lang === 'es' ? 'español' : lang === 'simple' ? 'fácil' : 'ngäbere'
    );
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  // Aplicar clase al body
  document.body.classList.remove('lang-simple', 'lang-ngabe');
  if (lang === 'simple') document.body.classList.add('lang-simple');
  if (lang === 'ngabe')  document.body.classList.add('lang-ngabe');

  // Aplicar traducciones
  const t = I18N[lang];
  if (!t) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  // Mostrar banner de modo
  showLangBanner(lang);

  // Re-renderizar componentes dinámicos con nuevo idioma
  renderVotaciones();
  renderTickets('todos');
}

function showLangBanner(lang) {
  let banner = document.getElementById('langModeBanner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'langModeBanner';
    banner.className = 'lang-mode-banner';
    banner.innerHTML = `<button class="lang-mode-close" onclick="this.parentElement.classList.remove('visible')" aria-label="Cerrar">✕</button><div id="langBannerText"></div>`;
    document.body.appendChild(banner);
  }

  const messages = {
    es:     '🇵🇦 Español activado',
    simple: '✅ Modo Lenguaje Fácil activado.\nTextos simplificados para mejor comprensión.',
    ngabe:  '🌿 Ngäbere gwi tärä.\nTextos en Ngäbere activados.'
  };

  document.getElementById('langBannerText').textContent = messages[lang];
  banner.classList.add('visible');
  setTimeout(() => banner.classList.remove('visible'), 4000);
}
