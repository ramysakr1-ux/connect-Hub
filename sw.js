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
const VERSION = 'lite-202610231821';
const SHELL = [
  './', 'index.html', 'invite.html', 'hub-qr.js', 'vendor/qrcode.js', 'hub-pin.js',
  '1_trainee_plan_and_analysis.html', '2_trainee_self_evaluation.html', '3_tutor_feedback.html',
  '4_feedback_returned.html', '5_tutor_dashboard.html', '6_centre_admin_dashboard.html',
  '7_candidate_tracker.html', '8_assignment_wording.html', '9_assignment_submission.html',
  '10_tutor_assignment_marking.html', '11_assignment_record.html', '12_assessor_pack.html',
  '13_grades_report.html', '14_owner.html', '15_course_record.html', '16_final_report.html',
  'hub-shared.js', 'hub-store.js', 'hub-sync.js', 'hub-tracker.js', 'hub-due.js', 'hub-exchange.js',
  'hub-crit-learn.js', 'hub-crit-vocab.js', 'hub-rotation.js', 'hub-peers.js', 'hub-timetable-parse.js', 'hub-docx.js', 'hub-xlsx.js', 'hub-attendance.js', 'hub-volunteer-i18n.js', 'hub-ink.js', 'hub-hand.js',
  /* The signature faces. They are in the SHELL but NOT in bump-assets.py's
     list, and that is deliberate rather than the oversight that list warns
     about: no HTML references them, so there is nothing for a ?v= to stamp.
     hub-hand.js asks for them from its own @font-face, and it IS stamped,
     so a change to which faces exist ships with the code that names them. */
  'fonts/allura.ttf', 'fonts/caveat.ttf', 'fonts/parisienne.ttf', 'fonts/sacramento.ttf', 'fonts/zeyada.ttf', 'fonts/greatvibes.ttf', 'hub-pages.js',
  /* 5 Oct 2026: hub-say.js is on every screen, and the five after it had never
     been in the shell at all -- offline, they 404'd. */
  'hub-say.js', 'celta5-appendix.js', 'hub-card-mail.js', 'hub-feedback.js', 'hub-front.js', 'hub-shelf.js',
  '23_timetable.html', '24_tp_points.html', '28_tp_point_sets.html', '25_volunteer_register.html', '26_volunteer.html', '27_volunteer_certificate.html', 'manifest-volunteer.webmanifest', 'manifest-console.webmanifest',
  /* 5 Oct 2026: the candidate agreement, read and signed once at the start. */
  '29_candidate_agreement.html',
  /* 8 Oct 2026: the answer key and the getting-to-know-you bank, with their data. */
  '30_precourse_key.html', '31_getting_to_know_you.html', '32_last_page.html', '33_course_feedback.html', 'precourse-key.js', 'gtky-bank.js', 'fol-interview.js',
  /* 15 Oct 2026: the input sessions (the shelf, its two shared files, the three drawings and
     every session page). They were never in the shell, so one not opened before the
     connection dropped came up as "You are offline". Pages are kept by their directory
     address, which is how the shelf and the doors link to them. The one film in the
     library (guided-discovery-vs-ppp/situational.mp4, 24 MB) is deliberately NOT kept
     with the shell: it is kept once played, like the others (see the media route below). */
  'input-sessions/', 'input-sessions/library.js', 'input-sessions/session.css',
  'input-sessions/_art/drama-frog.svg', 'input-sessions/_art/drama-monster.svg', 'input-sessions/_art/story-map.svg',
  'input-sessions/alternative-teaching-techniques/', 'input-sessions/classroom-management/', 'input-sessions/connected-speech/', 'input-sessions/drama-in-the-elt-classroom/', 'input-sessions/eliciting-and-ccqs/', 'input-sessions/error-correction/', 'input-sessions/functional-language/', 'input-sessions/guided-discovery-vs-ppp/', 'input-sessions/guided-to-less-guided-practice/', 'input-sessions/lesson-framework/', 'input-sessions/life-after-celta/', 'input-sessions/phonology-sounds/', 'input-sessions/ppp/', 'input-sessions/receptive-skills/', 'input-sessions/teaching-exam-classes/', 'input-sessions/teaching-literacy/', 'input-sessions/teaching-productive-skills/', 'input-sessions/teaching-speaking/', 'input-sessions/teaching-writing/', 'input-sessions/text-based-teaching/', 'input-sessions/word-and-sentence-stress/', 'input-sessions/writing-the-lesson-plan/',
  'offer.html',
  'assignment-defaults.js', 'agreement-defaults.js', 'hub-tokens.css', 'hub-house.css', 'hub-record.css',
  /* 8 Oct 2026: the date picker, vendored so the shell has it offline. */
  'assets/flatpickr.min.js', 'assets/flatpickr.min.css',
  'brand/favicon.svg', 'brand/favicon.ico', 'brand/apple-touch-icon.png',
];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
/* The film files live in an R2 bucket, not in the repo (22 Oct 2026). Pages ask for them with
   crossorigin=anonymous, so the answer is readable and can be kept like a same-site film. */
const FILM_HOST = 'films.connectlitefilms.com';
/* Films and tracks outlive a deploy: a new version must not throw away 74 MB
   somebody kept on purpose. hub-store.js keeps the TP points' tracks here too. */
const MEDIA = 'lite-media-v1';
const KEEPING = {};
function keepWhole(u) {
  if (KEEPING[u]) return; KEEPING[u] = 1;
  fetch(u, { cache: 'no-store' }).then(function (r) {
    if (r && r.status === 200) return caches.open(MEDIA).then(function (c) { return c.put(u, r); });
  }).catch(function () {}).then(function () { delete KEEPING[u]; });
}
function media(req) {
  var u = req.url.split('#')[0].split('?')[0];
  return caches.open(MEDIA).then(function (c) { return c.match(u); }).then(function (hit) {
    if (!hit) return fetch(req).then(function (r) { keepWhole(u); return r; });
    var type = hit.headers.get('Content-Type') || 'video/mp4';
    return hit.blob().then(function (blob) {
      var size = blob.size, range = req.headers.get('range');
      var m = range && /bytes=(\d*)-(\d*)/.exec(range);
      if (!m) return new Response(blob, { status: 200, headers: { 'Content-Type': type, 'Content-Length': String(size), 'Accept-Ranges': 'bytes' } });
      var s = m[1] === '' ? Math.max(0, size - Number(m[2])) : Number(m[1]);
      var en = m[1] !== '' && m[2] !== '' ? Math.min(Number(m[2]), size - 1) : size - 1;
      if (s >= size) return new Response('', { status: 416, headers: { 'Content-Range': 'bytes */' + size } });
      return new Response(blob.slice(s, en + 1), { status: 206, headers: { 'Content-Type': type, 'Content-Range': 'bytes ' + s + '-' + en + '/' + size, 'Content-Length': String(en - s + 1), 'Accept-Ranges': 'bytes' } });
    });
  });
}

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (cache) {
    // One at a time and each on its own, so a single missing file does not
    // stop the rest of the shell being kept.
    return SHELL.reduce(function (p, path) {
      // Past the browser's own cache: a shell filled from it right after a
      // push kept the page from before the push (10 Oct 2026).
      return p.then(function () { return cache.add(new Request(path, { cache: 'reload' })).catch(function () {}); });
    }, Promise.resolve());
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION && k !== MEDIA; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isFont = FONT_HOSTS.indexOf(url.host) !== -1;
  const isFilm = url.host === FILM_HOST;
  if (!sameOrigin && !isFont && !isFilm) return;           // the store, and anything else, is left alone

  /* THE SESSION FILMS, KEPT ONCE WATCHED (Ramy, 22 Oct 2026: "the videos don't
     work" with no internet). They are too big for the shell (24 and 50 MB), so a
     film is kept only on a device where somebody pressed play: the first play
     streams as before and the whole file is fetched once beside it. From then
     on the kept copy answers, and a player's "bytes=" request is cut from it,
     because a video asks for pieces and a plain cache answer is not a piece. */
  if ((sameOrigin || isFilm) && /\.(mp4|m4a|mp3)$/i.test(url.pathname)) { e.respondWith(media(req)); return; }

  if (isFont) {
    // Fonts: the kept copy first, the network fills it in once.
    e.respondWith(caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (r) {
        if (r && (r.ok || r.type === 'opaque')) { var keep = r.clone(); caches.open(VERSION).then(function (c) { c.put(req, keep); }).catch(function () {}); }
        return r;
      });
    }));
    return;
  }

  /* Same origin: network first, kept copy when the network is not there.

     A PAGE IS FETCHED PAST THE BROWSER'S OWN CACHE. "Network first" was not
     enough: fetch() consults the HTTP cache like any other request, and GitHub
     Pages sends HTML with ten minutes on it, so a reload could be answered from
     that cache without the network being touched at all. Ramy, 6 Oct 2026, four
     pushes into a walkthrough: "I'm still looking at the old view... it's like I
     can't see anything anymore." He was, and no amount of reloading would have
     helped. Only documents are forced; the ?v= stamp already settles the shared
     assets, and forcing those would cost a round trip each. */
  var doc = req.mode === 'navigate'
    || (req.headers.get('accept') || '').indexOf('text/html') !== -1;
  /* 10 Oct 2026: a page opened in the minutes after a push still came up as
     the version before it, twice in one afternoon. A page is now fetched by
     its address with no-store -- nothing kept anywhere on the way is
     offered -- and a navigation keeps its redirects for the browser to
     follow (GitHub sends /film on to /film/). */
  var net = doc
    ? fetch(req.url, { cache: 'no-store', credentials: 'same-origin', redirect: req.mode === 'navigate' ? 'manual' : 'follow' })
    : fetch(req);
  e.respondWith(net.then(function (r) {
    /* The copy is taken BEFORE the page is given the response. Cloned later, inside the
       cache's own promise, the body could already be in use and clone() threw, so a
       page visited online was sometimes not kept (found 15 Oct 2026). */
    if (r && r.ok) { var keep = r.clone(); caches.open(VERSION).then(function (c) { c.put(req, keep); }).catch(function () {}); }
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
