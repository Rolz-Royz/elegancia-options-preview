// Option H: photographs settle in as they arrive. Visible without this script.
(() => {
  const imgs = document.querySelectorAll('.slow');
  if (!('IntersectionObserver' in window)) { imgs.forEach((e) => e.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.filter((e) => e.isIntersecting).forEach((e) => { e.target.classList.add('in'); io.unobserve(e.target); });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
  imgs.forEach((e) => io.observe(e));
})();
