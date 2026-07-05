(function () {
  var root = document.documentElement;

  /* ---- Language switching ------------------------------------------------ */
  var STORAGE_KEY = 'maagimetsa-lang';
  var langButtons = document.querySelectorAll('[data-set-lang]');

  function setLang(lang) {
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);
    langButtons.forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-set-lang') === lang);
    });
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  // First-time visitors always land on Finnish, regardless of browser language.
  setLang((saved === 'fi' || saved === 'sv' || saved === 'en') ? saved : 'fi');

  langButtons.forEach(function (btn) {
    btn.addEventListener('click', function () { setLang(btn.getAttribute('data-set-lang')); });
  });

  /* ---- Header scroll state ------------------------------------------------ */
  var header = document.querySelector('.site-header');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile nav toggle --------------------------------------------------- */
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('main-nav');
  toggle.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---- Spotlight cards: cursor-tracked glow -------------------------------- */
  document.querySelectorAll('.value-card').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---- Scroll-reveal animation --------------------------------------------- */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.gsap && !prefersReduced) {
    document.body.classList.add('js-ready');
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('[data-reveal]').forEach(function (el, i) {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        delay: (i % 4) * 0.06,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    gsap.utils.toArray('.hero-blob').forEach(function (blob, i) {
      gsap.to(blob, { yPercent: 14 * (i % 2 === 0 ? 1 : -1), ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    });
  }

  /* ---- Footer year ---------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
