/* Connect Lite — the offline shell.
 *
 * Ramy, 24 Sep 2026: "I have it on my desktop and write the plan, and then
 * when the internet is back, we can upload." Until this, a tab already open
 * kept working without a connection (writes wait in hub-sync's ledger and go
 * out on the `online` event), but a page could not be OPENED offline: there
 * was no copy of the site in the browser. This keeps one.
 *
 * How it behaves:
 *   ONLINE   nothing changes. Every same-origin request goes to the network
 *            first, and a good answer is kept. A new deploy shows at once.
 *   OFFLINE  the kept copy answers. Pages the browser has never opened are
 *            there too, because the shell below is fetched when the worker
 *            installs (first visit, online).
 *   THE STORE is never touched: it is another origin, and hub-store POSTs.
 *            Nothing here intercepts it, so a page offline behaves exactly as
 *            hub-sync already handles -- "showing this browser's copy", and
 *            writes held until the connection returns.
 *
 * VERSION is stamped by bump-assets.py with the same stamp as the ?v= links,
 * so each push retires the previous cache on activate.
 */
const VERSION = 'lite-202609262344';
const SHELL = [
  './', 'index.html', 'invite.html',
  '1_trainee_plan_and_analysis.html', '2_trainee_self_evaluation.html', '3_tutor_feedback.html',
  '4_feedback_returned.html', '5_tutor_dashboard.html', '6_centre_admin_dashboard.html',
  '7_candidate_tracker.html', '8_assignment_wording.html', '9_assignment_submission.html',
  '10_tutor_assignment_marking.html', '11_assignment_record.html', '12_assessor_pack.html',
  '13_grades_report.html', '14_owner.html', '15_course_record.html', '16_final_report.html',
  'hub-shared.js', 'hub-store.js', 'hub-sync.js', 'hub-tracker.js', 'hub-due.js', 'hub-exchange.js',
  'hub-crit-learn.js',
  'offer.html',
  'assignment-defaults.js', 'hub-house.css', 'hub-theme.css', 'hub-record.css',
  'brand/favicon.svg', 'brand/favicon.ico', 'brand/apple-touch-icon.png',
];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (cache) {
    // One at a time and each on its own, so a single missing file does not
    // stop the rest of the shell being kept.
    return SHELL.reduce(function (p, path) {
      return p.then(function () { return cache.add(path).catch(function () {}); });
    }, Promise.resolve());
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isFont = FONT_HOSTS.indexOf(url.host) !== -1;
  if (!sameOrigin && !isFont) return;           // the store, and anything else, is left alone

  if (isFont) {
    // Fonts: the kept copy first, the network fills it in once.
    e.respondWith(caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (r) {
        if (r && (r.ok || r.type === 'opaque')) caches.open(VERSION).then(function (c) { c.put(req, r.clone()); });
        return r;
      });
    }));
    return;
  }

  // Same origin: network first, kept copy when the network is not there.
  e.respondWith(fetch(req).then(function (r) {
    if (r && r.ok) caches.open(VERSION).then(function (c) { c.put(req, r.clone()); });
    return r;
  }).catch(function () {
    return caches.match(req).then(function (hit) {
      // A versioned link (hub-house.css?v=...) the shell kept without its query.
      return hit || caches.match(req, { ignoreSearch: true });
    }).then(function (hit) {
      if (hit) return hit;
      if (req.mode === 'navigate') {
        return new Response(
          '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
          '<title>Connect Lite \u2014 offline</title>' +
          '<body style="margin:0;min-height:100vh;background:oklch(96.4% 0.014 85);color:oklch(23.5% 0.017 65);' +
          'font-family:Karla,\'Helvetica Neue\',Arial,sans-serif;display:flex;align-items:flex-start;justify-content:center;padding:56px 20px;box-sizing:border-box">' +
          '<div style="max-width:560px;width:100%;background:oklch(96.2% 0.02 80);border-left:5px solid oklch(63% 0.096 72);border-radius:6px;padding:26px 30px 28px;box-shadow:0 1px 2px rgba(0,0,0,.04)">' +
          '<div style="font-size:.72rem;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:oklch(51% 0.017 70);margin-bottom:10px">Connect Lite</div>' +
          '<h1 style="font-family:Newsreader,Georgia,serif;font-weight:700;font-size:1.7rem;line-height:1.15;margin:0 0 12px">You are offline</h1>' +
          '<p style="font-size:.95rem;line-height:1.6;margin:0 0 10px">This page has not been opened on this device before, so there is no copy of it here yet.</p>' +
          '<p style="font-size:.95rem;line-height:1.6;margin:0;color:oklch(51% 0.017 70)">Open it once with a connection and it will be here after that. Pages you have already opened still work, and anything you write is kept and sent when the connection returns.</p>' +
          '</div></body>',
          { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      }
      return new Response('', { status: 504 });
    });
  }));
});
