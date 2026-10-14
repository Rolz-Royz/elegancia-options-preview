// Vista previa: cambiar de portada, y entradas suaves de las secciones. Todo es visible sin este script.
(() => {
  document.documentElement.classList.add('js');
  const pick = (n) => {
    document.body.dataset.hero = n;
    document.querySelectorAll('[data-pick]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pick === n)));
    history.replaceState(null, '', `?portada=${n}${location.hash}`);
  };
  const start = new URLSearchParams(location.search).get('portada');
  if (/^[123]$/.test(start || '')) pick(start);
  document.querySelectorAll('[data-pick]').forEach((b) => b.addEventListener('click', () => pick(b.dataset.pick)));

  const items = document.querySelectorAll('.block > h2, .feature, .pack, .why > *, .raffle-in > *, .place > *');
  if (!('IntersectionObserver' in window)) return;
  items.forEach((el) => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  items.forEach((el) => io.observe(el));
})();
