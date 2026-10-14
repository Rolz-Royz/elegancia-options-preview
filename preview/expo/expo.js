(() => {
// /expo/: keeps the cover's countdown current. The count is in calendar days in Utah, so it
// changes at midnight Mountain time, and it settles from a higher number when the cover appears.
const EVENT = { year: 2026, month: 11, day: 8 };

function daysLeft(now = new Date()) {
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Denver', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
  const [y, m, d] = today.split('-').map(Number);
  return Math.round((Date.UTC(EVENT.year, EVENT.month - 1, EVENT.day) - Date.UTC(y, m - 1, d)) / 864e5);
}

const settle = (el, to) => {
  const from = to + 18;
  const duration = 1100;
  const start = performance.now();
  const step = (t) => {
    const p = Math.min(1, (t - start) / duration);
    const eased = 1 - Math.pow(2, -10 * p);
    el.textContent = String(Math.round(from - (from - to) * eased));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

function startExpo() {
  // The shared header and footer were captured on the Inicio, so "Inicio" arrives marked current.
  document.querySelectorAll('a.elementor-item-active[href="/"]').forEach((a) => {
    a.classList.remove('elementor-item-active');
    a.removeAttribute('aria-current');
  });

  const n = daysLeft();
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    || new URLSearchParams(location.search).has('settled');
  document.querySelectorAll('[data-expo-count]').forEach((box) => {
    const num = box.querySelector('[data-expo-days]');
    const unit = box.querySelector('[data-expo-unit]');
    const label = box.querySelector('[data-expo-label]');
    box.querySelectorAll('.expo-count__label, .expo-count__days').forEach((el) => el.setAttribute('aria-hidden', 'true'));

    if (n < 0) {
      box.dataset.state = 'past';
      label.textContent = 'Gracias por visitarnos en la expo';
      box.setAttribute('aria-label', 'Gracias por visitarnos en la expo');
      return;
    }
    if (n === 0) {
      box.dataset.state = 'today';
      label.textContent = 'La expo es';
      num.textContent = 'Hoy';
      box.setAttribute('aria-label', 'La expo es hoy');
      return;
    }
    label.textContent = n === 1 ? 'Falta' : 'Faltan';
    unit.textContent = n === 1 ? 'día' : 'días';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', `${label.textContent} ${n} ${unit.textContent} para la expo`);
    num.textContent = String(n);
    if (calm || !('IntersectionObserver' in window)) return;

    num.textContent = String(n + 18);
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      setTimeout(() => settle(num, n), 350);
    });
    io.observe(box);
  });
}

startExpo();
window.addEventListener('load', () => ['mouseover', 'touchstart'].forEach((t) => window.dispatchEvent(new Event(t))));
})();
