// Option D: header turns solid after the stage, the video plays on demand, sections reveal.
(() => {
  const bar = document.querySelector('.bar');
  const stage = document.querySelector('.stage');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => bar.classList.toggle('solid', e.intersectionRatio < 0.85), { threshold: [0, 0.85, 1] }).observe(stage);
  } else {
    bar.classList.add('solid');
  }

  const section = document.querySelector('.video');
  const video = section.querySelector('video');
  section.querySelector('.play').addEventListener('click', () => {
    section.classList.add('playing');
    video.play();
  });
  video.addEventListener('play', () => section.classList.add('playing'));

  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { items.forEach((e) => e.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.filter((e) => e.isIntersecting).forEach((e, i) => {
      e.target.style.setProperty('--d', `${Math.min(i, 5) * 90}ms`);
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  items.forEach((e) => io.observe(e));
})();
