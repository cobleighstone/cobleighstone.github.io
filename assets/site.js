/* Abbey Cobleigh — shared site behavior: robust scroll reveal + active nav */
(function () {
  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  function initReveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!els.length) return;

    function show(el) {
      if (el.classList.contains('in')) return;
      var d = +(el.getAttribute('data-delay') || 0);
      if (d) setTimeout(function () { el.classList.add('in'); }, d);
      else el.classList.add('in');
    }
    // Hard fallback: force an element fully visible with no transition.
    // Guarantees content can never stay stuck hidden if a transition stalls.
    function force(el) {
      el.classList.add('in');
      el.style.transition = 'none';
      el.style.opacity = '1';
      el.style.transform = 'none';
    }
    function inView(el) {
      var r = el.getBoundingClientRect();
      var h = window.innerHeight || document.documentElement.clientHeight;
      return r.top < h * 0.92 && r.bottom > 0;
    }
    function sweep() {
      for (var i = els.length - 1; i >= 0; i--) {
        if (inView(els[i])) { show(els[i]); els.splice(i, 1); }
      }
    }

    // Primary: IntersectionObserver (with manual fallback below)
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
      els.forEach(function (el) { io.observe(el); });
    }

    // Fallback / guarantee: manual viewport sweeps on load + scroll + resize,
    // so content is never permanently stuck hidden even if IO never fires.
    sweep();
    window.addEventListener('scroll', sweep, { passive: true });
    window.addEventListener('resize', sweep, { passive: true });
    [120, 500, 1100].forEach(function (t) { setTimeout(sweep, t); });
    // Last-resort safety net: force everything fully visible after 2s, no matter what.
    setTimeout(function () { els.forEach(force); }, 2000);
  }

  function initActiveNav() {
    var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (here === '') here = 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').toLowerCase();
      if (href === here || (here === 'index.html' && (href === './' || href === 'index.html'))) {
        a.classList.add('active');
      }
    });
  }

  ready(function () { initReveal(); initActiveNav(); });
})();
