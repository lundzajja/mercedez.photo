/* ════════════════════════════════════════════
   mercedez.photo — Gallery JS
   - Nav scroll effect
   - Mobile burger menu
   - Lightbox (click, keyboard, swipe)
   - Scroll-reveal stagger
════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. NAV scroll ── */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── 2. Burger menu ── */
  const burger    = document.getElementById('burger');
  const navLinks  = document.querySelector('.nav-links');

  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── 3. Photo data ── */
  const items  = Array.from(document.querySelectorAll('.photo-item'));
  const photos = items.map(el => ({
    src:    el.dataset.src,
    date:   el.dataset.date,
    camera: el.dataset.camera,
    alt:    el.querySelector('img').alt,
  }));

  /* ── 4. Lightbox elements ── */
  const lb         = document.getElementById('lightbox');
  const backdrop   = document.getElementById('lbBackdrop');
  const lbImg      = document.getElementById('lbImg');
  const lbCamera   = document.getElementById('lbCamera');
  const lbDate     = document.getElementById('lbDate');
  const lbClose    = document.getElementById('lbClose');
  const lbPrev     = document.getElementById('lbPrev');
  const lbNext     = document.getElementById('lbNext');

  let current = 0;
  let isOpen  = false;

  function openLightbox(index) {
    current = index;
    renderLb();
    lb.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    isOpen = true;
    lbClose.focus();
  }

  function closeLightbox() {
    lb.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
    isOpen = false;
  }

  function navigate(dir) {
    current = (current + dir + photos.length) % photos.length;
    renderLb();
  }

  function renderLb() {
    const p = photos[current];
    lbImg.classList.add('loading');
    lbCamera.textContent = p.camera;
    lbDate.textContent   = p.date;

    const tmp = new Image();
    tmp.onload = () => {
      lbImg.src = p.src;
      lbImg.alt = p.alt;
      lbImg.classList.remove('loading');
    };
    tmp.src = p.src;
  }

  /* ── 5. Click to open ── */
  items.forEach((el, i) => {
    el.addEventListener('click', () => openLightbox(i));
  });

  lbClose.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
  lbNext.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });

  /* ── 6. Keyboard ── */
  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   navigate(-1);
    if (e.key === 'ArrowRight')  navigate(1);
  });

  /* ── 7. Touch / swipe ── */
  let touchStartX = 0;
  lb.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
  });

  /* ── 8. Scroll-reveal stagger ── */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = (parseInt(el.dataset.index, 10) % 3) * 80;
          el.style.animationDelay = delay + 'ms';
          io.unobserve(el);
        }
      });
    }, { threshold: 0.1 });

    items.forEach(el => io.observe(el));
  }

})();
