/* Header: green bar only at the top of the page (fades out once scrolled, like the original). */
(function () {
  var hdr = document.getElementById('site-header');
  function onScroll() { hdr.classList.toggle('scrolled', (window.pageYOffset || 0) > 0.5); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* Carousel arrows for the Speakers and Gallery strips (the original used Wix Pro Gallery). */
(function () {
  'use strict';
  document.querySelectorAll('.gal').forEach(function (gal) {
    var scroller = gal.querySelector('.gal-scroll');
    var prev = gal.querySelector('.ar-l');
    var next = gal.querySelector('.ar-r');
    var step = gal.classList.contains('spk-gal') ? 252 : 155; // one photo / one column per click

    function update() {
      prev.hidden = scroller.scrollLeft <= 1;
      next.hidden = scroller.scrollLeft >= scroller.scrollWidth - scroller.clientWidth - 1;
    }
    prev.addEventListener('click', function () { scroller.scrollBy({ left: -step, behavior: 'smooth' }); });
    next.addEventListener('click', function () { scroller.scrollBy({ left: step, behavior: 'smooth' }); });
    scroller.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
})();

/* The patrons/committees page is embedded; size the frame to its content so it never shows an inner scrollbar. */
(function () {
  document.querySelectorAll('iframe.coord').forEach(function (f) {
    function fit() {
      var d = f.contentDocument;
      if (d && d.documentElement) f.style.height = d.documentElement.scrollHeight + 'px';
    }
    f.addEventListener('load', function () {
      fit();
      var d = f.contentDocument;
      if (d && d.body && 'ResizeObserver' in window) new ResizeObserver(fit).observe(d.body);
    });
    window.addEventListener('resize', fit);
  });
})();

/* Scaling. Phones (<768px) get the dedicated 320px mobile layout (#m), scaled to the screen width.
   768-1279px: the desktop layout is designed for 1280px, so scale it down to fit. */
(function () {
  var m = document.getElementById('m');
  function fit() {
    var w = document.documentElement.clientWidth || window.innerWidth;
    if (w < 768) {
      document.documentElement.style.zoom = '';
      if (m) m.style.zoom = String(w / 320);
    } else {
      if (m) m.style.zoom = '';
      document.documentElement.style.zoom = w < 1280 ? String(w / 1280) : '';
    }
  }
  window.addEventListener('resize', fit);
  fit();
})();

/* Mobile behaviour: header hides while scrolling down and returns on scroll up (green bar only at the very top),
   swipeable speaker/gallery strips with arrows, and a back-to-top button. */
(function () {
  var m = document.getElementById('m');
  if (!m) return;
  var head = document.getElementById('mh');
  var top = document.getElementById('mtop');
  var last = 0;
  function onScroll() {
    var y = Math.max(0, window.pageYOffset || 0);
    head.classList.toggle('scrolled', y > 0.5);
    if (y > last + 4 && y > 60) head.classList.add('hide');
    else if (y < last - 4 || y <= 0.5) head.classList.remove('hide');
    top.hidden = y < 100;
    last = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  m.querySelectorAll('.strip').forEach(function (strip) {
    var id = strip.id;
    var btns = m.querySelectorAll('.ar[data-strip="' + id + '"]');
    var prev = m.querySelector('.ar-l[data-strip="' + id + '"]');
    var next = m.querySelector('.ar-r[data-strip="' + id + '"]');
    function upd() {
      var max = strip.scrollWidth - strip.clientWidth - 1;
      if (prev) prev.hidden = strip.scrollLeft <= 1;
      if (next) next.hidden = strip.scrollLeft >= max;
    }
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        strip.scrollBy({ left: parseFloat(b.getAttribute('data-step')) * (strip.clientWidth ? 1 : 1), behavior: 'smooth' });
      });
    });
    strip.addEventListener('scroll', upd, { passive: true });
    upd();
  });
})();

/* Mobile menu (hamburger) */
(function () {
  var b = document.querySelector('#m .mburger'), menu = document.getElementById('mmenu'), h = document.getElementById('mh');
  if (!b || !menu) return;
  function set(o) { b.setAttribute('aria-expanded', String(o)); menu.hidden = !o; h.classList.toggle('open', o); }
  b.addEventListener('click', function () { set(menu.hidden); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
})();
