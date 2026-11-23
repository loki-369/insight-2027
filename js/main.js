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
      document.documentElement.style.setProperty('--zi', w < 1280 ? String(1280 / w) : '1');
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

/* Mobile menu (hamburger): Escape closes and returns focus, Subjects is an accordion */
(function () {
  var b = document.querySelector('#m .mburger'), menu = document.getElementById('mmenu'), h = document.getElementById('mh');
  if (!b || !menu) return;
  var acc = menu.querySelector('.mdd>button'), accl = document.getElementById('mdd-l');
  function set(o, back) {
    b.setAttribute('aria-expanded', String(o)); b.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
    menu.hidden = !o; h.classList.toggle('open', o);
    if (o) { var f = menu.querySelector('a'); if (f) f.focus({ preventScroll: true }); } else if (back) b.focus();
  }
  b.addEventListener('click', function () { set(menu.hidden); });
  if (acc) acc.addEventListener('click', function () { var o = accl.hidden; accl.hidden = !o; acc.setAttribute('aria-expanded', String(o)); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hidden) set(false, true);
    if (e.key === 'Tab' && !menu.hidden) {
      var els = [b].concat([].slice.call(menu.querySelectorAll('a,button')).filter(function (x) { return x.offsetParent !== null; }));
      var i = els.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); els[els.length - 1].focus(); }
      else if (!e.shiftKey && i === els.length - 1) { e.preventDefault(); els[0].focus(); }
    }
  });
})();

/* Anchor links on phones: the phone layout uses "-m" ids, so map #gallery -> #gallery-m (also for /#gallery from the sub pages). */
(function () {
  function jump() {
    var h = (location.hash || '').slice(1);
    if (!h || (document.documentElement.clientWidth || innerWidth) >= 768) return;
    var t = document.getElementById(h + '-m');
    if (t) t.scrollIntoView({ behavior: 'auto', block: 'start' });
  }
  window.addEventListener('hashchange', jump);
  window.addEventListener('load', function () { jump(); setTimeout(jump, 300); });
})();
