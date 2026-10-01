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
  const toggle = document.querySelector(".theme-toggle");
  if (!toggle) return;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  toggle.addEventListener("click", () => {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  });
}

/* --- Mob menu toggle --- */
function initMobileMenu() {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.mob-nav');
  if (!burger || !menu) return;

  const closeMenu = () => {
    menu.classList.remove('is-open');
    burger.classList.remove('is-active');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  burger.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    burger.classList.toggle('is-active', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (menu.classList.contains('is-open') && (window.innerWidth > 768)) closeMenu();
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadComponent("#sprite-placeholder", "components/sprite.html").catch(
      console.error,
    ),
    loadComponent("#header-placeholder", "components/header.html").catch(
      console.error,
    ),
    loadComponent("#footer-placeholder", "components/footer.html").catch(
      console.error,
    ),
  ]);

  initThemeToggle();
  initMobileMenu();
});