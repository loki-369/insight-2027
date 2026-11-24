/* Speakers carousel: scroll-snap row with prev/next buttons */
(function () {
  document.querySelectorAll('.sp-wrap').forEach(function (w) {
    var row = w.querySelector('.sp-row'), prev = w.querySelector('.spn.l'), next = w.querySelector('.spn.r');
    function step() { var c = row.querySelector('.spc'); return c ? c.getBoundingClientRect().width / (parseFloat(getComputedStyle(document.documentElement).zoom) || 1) + 20 : 260; }
    function upd() {
      prev.hidden = row.scrollLeft <= 1;
      next.hidden = row.scrollLeft >= row.scrollWidth - row.clientWidth - 1;
    }
    prev.addEventListener('click', function () { row.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { row.scrollBy({ left: step(), behavior: 'smooth' }); });
    row.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  });
})();

/* Gallery: "view all" toggle + lightbox (Escape, arrow keys, buttons, swipe) */
(function () {
  document.querySelectorAll('.gl').forEach(function (g) {
    var grid = g.querySelector('.gl-grid'), more = g.querySelector('.gl-more'), lb = g.querySelector('.lb');
    var items = [].slice.call(grid.querySelectorAll('.gl-item'));
    var img = lb.querySelector('img'), cap = lb.querySelector('figcaption'), cur = 0, opener = null, tx = null;
    if (more) more.addEventListener('click', function () {
      var o = grid.classList.toggle('open'); more.setAttribute('aria-expanded', String(o));
      more.textContent = o ? 'Show fewer photos' : 'View all ' + items.length + ' photos';
    });
    function show(n) {
      cur = (n + items.length) % items.length;
      var s = items[cur].querySelector('img');
      img.src = s.currentSrc || s.src; img.alt = 'INSIGHT 2025 photo ' + (cur + 1) + ' of ' + items.length;
      cap.textContent = (cur + 1) + ' / ' + items.length;
    }
    function open(n) { opener = document.activeElement; show(n); lb.hidden = false; document.documentElement.style.overflow = 'hidden'; lb.querySelector('.lb-x').focus(); }
    function close() { lb.hidden = true; document.documentElement.style.overflow = ''; if (opener) opener.focus(); }
    items.forEach(function (it, i) { it.addEventListener('click', function () { open(i); }); });
    lb.querySelector('.lb-x').addEventListener('click', close);
    lb.querySelector('.lb-p').addEventListener('click', function () { show(cur - 1); });
    lb.querySelector('.lb-n').addEventListener('click', function () { show(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    lb.addEventListener('touchstart', function (e) { tx = e.changedTouches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) { if (tx === null) return; var d = e.changedTouches[0].clientX - tx; tx = null; if (Math.abs(d) > 50) show(cur + (d < 0 ? 1 : -1)); }, { passive: true });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(cur - 1);
      else if (e.key === 'ArrowRight') show(cur + 1);
      else if (e.key === 'Tab') { var f = [].slice.call(lb.querySelectorAll('button')); var i = f.indexOf(document.activeElement); e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); }
    });
  });
})();

/* Scaling. Phones (<768px) get the dedicated 320px mobile layout (#m), scaled to the screen width.
   768px and up: fluid flow layout, no scaling. */
(function () {
  var m = document.getElementById('m');
  function fit() {
    var w = document.documentElement.clientWidth || window.innerWidth;
    if (w < 768) {
      document.documentElement.style.zoom = '';
      if (m) m.style.zoom = String(w / 320);
    } else {
      if (m) m.style.zoom = '';
      document.documentElement.style.zoom = '';
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
  document.addEventListener('click', function (e) { if (!menu.hidden && !menu.contains(e.target) && !b.contains(e.target)) set(false); });
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


/* All-speakers dropdown + per-speaker profile toggles (progressive enhancement: without JS everything is visible). */
(function () {
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest && ev.target.closest('[data-acc]');
    if (!b) return;
    var t = document.getElementById(b.getAttribute('aria-controls'));
    if (!t) return;
    var open = !t.classList.contains('open');
    t.classList.toggle('open', open);
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
    var lab = b.querySelector('span');
    if (lab) lab.textContent = open ? b.getAttribute('data-lc') : b.getAttribute('data-lo');
    if (!open && b.classList.contains('as-tog')) {
      var r = b.getBoundingClientRect();
      if (r.top < 0 || r.top > innerHeight) b.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
})();
