// Loaded from web/index.html, deferred: it needs <body>.
//
// iOS 27 draws a blurred band over the top edge of an installed web app,
// over the app's own header (see docs/web-deploy.md). The
// workaround found on r/PWA and written up at
// tips.ojapp.app/en/ios-27-pwa-top-blur-workaround-2: a fixed strip, full
// width, 11px tall, at the very top, with a background colour. WebKit samples
// it as the colour of the status bar and stops drawing the blur.
// `background-clip: text` on a strip with no text keeps it from painting a
// visible bar — the colour is there to be sampled, not seen.
//
// Only in the installed app; a browser tab has Safari's own bar. The colour
// is the page's `theme-color`, followed as it changes, so the strip is always
// the colour the status bar is meant to be.
(function () {
  var standalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
  if (!standalone) return;

  var strip = document.createElement('div');
  strip.className = 'status-strip';
  strip.setAttribute('aria-hidden', 'true');
  document.body.appendChild(strip);

  // The meta that applies: the last one whose media matches, or that has
  // none — the engine and the page's own scripts both write it.
  function colour() {
    var found = null;
    var metas = document.querySelectorAll('meta[name="theme-color"]');
    for (var i = 0; i < metas.length; i++) {
      var media = metas[i].getAttribute('media');
      if (!media || window.matchMedia(media).matches) found = metas[i];
    }
    return found ? found.getAttribute('content') : null;
  }

  function paint() {
    var c = colour();
    if (c) strip.style.backgroundColor = c;
  }

  paint();
  new MutationObserver(paint).observe(document.head, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['content', 'media'],
  });
})();
