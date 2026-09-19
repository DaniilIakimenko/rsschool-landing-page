/* --- Load header, footer, sprite --- */
async function loadComponent(placeholderId, path) {
  const el = document.querySelector(placeholderId);
  if (!el) return;

  const res = await fetch(path);
  if (!res.ok) throw new Error(`Не загрузился ${path}: ${res.status}`);
  el.innerHTML = await res.text();
}

/* --- Theme toggle --- */
function initThemeToggle() {
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadComponent('#sprite-placeholder', 'components/sprite.html');
  await loadComponent('#header-placeholder', 'components/header.html');
  await loadComponent('#footer-placeholder', 'components/footer.html');

  initThemeToggle();
});