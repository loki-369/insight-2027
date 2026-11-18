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

/* Narrow screens: the desktop layout is 980px wide. Until a dedicated mobile layout exists,
   scale it down to fit so nothing is cut off or scrolls sideways. */
(function () {
  var BASE = 980;
  function fit() {
    var w = document.documentElement.clientWidth || window.innerWidth;
    document.documentElement.style.zoom = w < BASE ? String(w / BASE) : '';
  }
  window.addEventListener('resize', fit);
  fit();
})();
