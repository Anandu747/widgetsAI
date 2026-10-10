/* Drop-in loader: <script src="https://YOUR-DOMAIN/embed.js"></script> */
(function () {
  var s = document.currentScript, base = new URL(s.src).origin;
  var f = document.createElement('iframe');
  f.src = base + '/embed'; f.allow = 'microphone; autoplay'; f.title = 'ShopBot';
  function size(open) {
    var m = innerWidth <= 480;
    Object.assign(f.style, {
      position: 'fixed', right: '0', bottom: '0', border: '0', zIndex: 2147483647, background: 'transparent', colorScheme: 'normal',
      width: open ? (m ? '100vw' : '420px') : '90px', height: open ? (m ? '100vh' : '720px') : '90px', maxHeight: '100vh'
    });
  }
  size(false); document.body.appendChild(f);
  addEventListener('message', function (e) { if (e.source === f.contentWindow && e.data && e.data.aiw === 'toggle') size(e.data.open); });
})();