// Option G: video on demand + reveals as sections arrive.
(() => {
  const box = document.querySelector('.watch-video');
  const video = box.querySelector('video');
  box.querySelector('.play').addEventListener('click', () => { box.classList.add('playing'); video.play(); });
  video.addEventListener('play', () => box.classList.add('playing'));

  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { items.forEach((e) => e.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.filter((e) => e.isIntersecting).forEach((e, i) => {
      e.target.style.setProperty('--d', `${Math.min(i, 5) * 70}ms`);
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  items.forEach((e) => io.observe(e));
})();
