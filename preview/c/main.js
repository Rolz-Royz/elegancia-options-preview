// Option C: the date card opens WhatsApp with the family's details already written, package
// buttons preselect their package and focus the card, sections reveal on scroll.
(() => {
  document.body.classList.add('opt-has-bar');
  const form = document.getElementById('fecha');
  const date = form.elements.fecha;
  const name = form.elements.nombre;
  const pkg = form.elements.paquete;
  const error = form.querySelector('.field-error');
  date.min = new Date().toISOString().slice(0, 10);

  const fmt = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const missing = [];
    for (const [input, label] of [[date, 'la fecha'], [name, 'tu nombre']]) {
      const bad = !input.value.trim();
      input.setAttribute('aria-invalid', String(bad));
      if (bad) missing.push(label);
    }
    if (missing.length) {
      error.hidden = false;
      error.textContent = `Escribe ${missing.join(' y ')} para preguntar por tu fecha.`;
      (date.value ? name : date).focus();
      return;
    }
    error.hidden = true;
    const lines = [
      `¡Hola Elegancia! Soy ${name.value.trim()}.`,
      `Quiero saber si tienen disponible el ${fmt(date.value)} para mis XV.`,
      pkg.value ? `Me interesa el paquete ${pkg.value}.` : 'Todavía no sé qué paquete elegir.',
    ];
    window.open(`https://wa.me/13852087395?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
  });

  document.querySelectorAll('[data-pkg]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    pkg.value = a.dataset.pkg;
    form.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    setTimeout(() => date.focus({ preventScroll: true }), 450);
  }));

  const items = document.querySelectorAll('section > *:not(.hero-copy):not(.hero-photo)');
  items.forEach((el) => el.classList.add('reveal'));
  if (!('IntersectionObserver' in window)) { items.forEach((e) => e.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.filter((e) => e.isIntersecting).forEach((e, i) => {
      e.target.style.setProperty('--d', `${Math.min(i, 4) * 80}ms`);
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.1 });
  items.forEach((e) => io.observe(e));
})();
