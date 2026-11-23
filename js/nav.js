/* Header navigation: Tracks dropdown + mobile menu. Works for the homepage and the sub pages. */
(function () {
  var nav = document.getElementById('hnav');
  var burger = document.querySelector('.hburger');
  var dd = document.querySelector('.hnav .dd');
  var btn = dd && dd.querySelector('button');
  function closeDD() { if (dd) { dd.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } }
  if (btn) btn.addEventListener('click', function (e) {
    e.stopPropagation(); var o = dd.classList.toggle('open'); btn.setAttribute('aria-expanded', String(o));
  });
  document.addEventListener('click', function (e) { if (dd && !dd.contains(e.target)) closeDD(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeDD(); closeMenu(); } });
  function closeMenu() { if (nav && burger) { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } }
  if (burger) burger.addEventListener('click', function (e) {
    e.stopPropagation(); var o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', String(o));
  });
  if (nav) nav.addEventListener('click', function (e) { if (e.target.closest('a')) { closeMenu(); closeDD(); } });
})();
