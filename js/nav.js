/* Header navigation: Subjects dropdown + hamburger drawer (below 1024px). Used on the homepage and the sub pages. */
(function () {
  var nav = document.getElementById('hnav');
  var burger = document.querySelector('.hburger');
  var dd = document.querySelector('.hnav .dd');
  var btn = dd && dd.querySelector('button');
  var hdr = document.querySelector('.site-hdr');
  function closeDD() { if (dd) { dd.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } }
  function setMenu(o, back) {
    if (!nav || !burger) return;
    nav.classList.toggle('open', o); burger.setAttribute('aria-expanded', String(o));
    burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu');
    if (o) { var f = nav.querySelector('a,button'); if (f) f.focus({ preventScroll: true }); }
    else { closeDD(); if (back) burger.focus(); }
  }
  if (btn) btn.addEventListener('click', function (e) {
    e.stopPropagation(); var o = dd.classList.toggle('open'); btn.setAttribute('aria-expanded', String(o));
  });
  document.addEventListener('click', function (e) {
    if (dd && !dd.contains(e.target)) closeDD();
    if (nav && burger && nav.classList.contains('open') && !nav.contains(e.target) && !burger.contains(e.target)) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    var open = nav && nav.classList.contains('open');
    if (e.key === 'Escape') { if (open) setMenu(false, true); else if (dd && dd.classList.contains('open')) { closeDD(); btn.focus(); } }
    if (e.key === 'Tab' && open) {
      var els = [burger].concat([].slice.call(nav.querySelectorAll('a,button')).filter(function (x) { return x.offsetParent !== null; }));
      var i = els.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); els[els.length - 1].focus(); }
      else if (!e.shiftKey && i === els.length - 1) { e.preventDefault(); els[0].focus(); }
    }
  });
  if (burger) burger.addEventListener('click', function (e) { e.stopPropagation(); setMenu(!nav.classList.contains('open')); });
  if (nav) nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth >= 1024 && nav && nav.classList.contains('open')) setMenu(false); });
})();
