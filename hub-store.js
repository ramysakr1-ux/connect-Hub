// The Hub's store client. The records live in a Google Sheet behind an Apps
// Script web app (Ramy, 20 Sep 2026: "go with 1, start with the store"), so a
// trainee's plan reaches the tutor without a file and comes back the same way.
//
// Access is by link, as in Connect: a trainee's link carries ?t=<token>, a
// tutor's carries ?k=<course key>, an assessor's ?ak=<assessor key> (read-only,
// Ramy 20 Sep 2026). Any of them is remembered in this browser once seen, so
// the pages can link to each other without repeating it.
/* THE TRAINEE VIEW'S OWN TAB (Ramy, 13 Nov 2026: "make it one click"). The tutor's door opens Maya in a new tab with
   ?tv=1 on her link. That tab keeps everything in its own sessionStorage, never in the browser's shared localStorage, so
   the tutor's tab beside it keeps its link, its name and its unsaved work. Every page reads storage through the
   localStorage name, so pointing that name at this tab's own storage is the whole change. The flag sits outside the hub:
   and chub: names, which the visit clean-ups clear. */
(function(){ try {
  if (window.__liteTab) return; window.__liteTab = 1;
  if (new URLSearchParams(location.search).get('tv') === '1') sessionStorage.setItem('liteTraineeViewTab', '1');
  if (sessionStorage.getItem('liteTraineeViewTab') === '1') { var own = window.sessionStorage; Object.defineProperty(window, 'localStorage', { configurable: true, get: function(){ return own; } }); }
} catch (e) {} })();
window.HubStore = (function(){
  var URL = 'https://script.google.com/macros/s/AKfycbz5ESCtTg6kIDNCf7ynt1fB0tOSVusgOUiMub9-wEZunwQ2uTw2wzz1vmbHxzbvpG-eyA/exec';
  var params = new URLSearchParams(location.search);
  // The last link opened wins: a browser that once held a tutor or assessor
  // key would otherwise open a trainee's link as that tutor or assessor
  // (found on the 20 Sep 2026 trainee walk -- a leftover assessor key made a
  // trainee link read-only).
  try {
    /* A new link forgets the PIN kept for the old one (v87): the PIN belongs
       to the link, not to the browser. */
    if (params.get('t')) { if (localStorage.getItem('hub:t') !== params.get('t')) localStorage.removeItem('hub:pin'); localStorage.setItem('hub:t', params.get('t')); localStorage.removeItem('hub:k'); localStorage.removeItem('hub:a'); }
    if (params.get('k')) { if (localStorage.getItem('hub:k') !== params.get('k')) { localStorage.removeItem('hub:kpin'); localStorage.removeItem('hub:apin'); localStorage.removeItem('hub:adminSet'); } localStorage.setItem('hub:k', params.get('k')); localStorage.removeItem('hub:t'); localStorage.removeItem('hub:a'); }
    // The assessor key travels as ?ak= -- ?a= is the assignment key on screens 9-11
    // (a collision found on the 20 Sep 2026 trainee walk: opening FOL stored 'fol' as an assessor key).
    if (params.get('ak')) { localStorage.setItem('hub:a', params.get('ak')); localStorage.removeItem('hub:t'); localStorage.removeItem('hub:k'); }
    /* A volunteer student's own link (30 Sep 2026): "?v=<courseId>-<random>".
       It opens their own page and nothing else, and like every other link it
       is the LAST one that wins in this browser. */
    if (params.get('v')) { localStorage.setItem('hub:v', params.get('v')); localStorage.removeItem('hub:t'); localStorage.removeItem('hub:k'); localStorage.removeItem('hub:a'); }
    if (params.get('t') || params.get('k') || params.get('ak')) localStorage.removeItem('hub:v');
    /* A DATED PASS (25 Oct 2026) lives in this TAB, not the browser: a link sent to a person carries &p=, the
       tab keeps it as it moves between pages, and a link opened fresh (the website's, in a new tab or pasted
       in) carries none and so never expires. */
    if (params.get('t') || params.get('k') || params.get('ak') || params.get('v')) {
      if (params.get('p')) sessionStorage.setItem('hub:p', params.get('p'));
      else { var ref = ''; try { ref = new URL(document.referrer).origin; } catch (e2) {} if (ref !== location.origin) sessionStorage.removeItem('hub:p'); }
    }
    var stray = localStorage.getItem('hub:a'); if (stray && /^(fol|lrt|lsrt|lfc|a5)$/.test(stray)) localStorage.removeItem('hub:a');
  } catch (e) {}
  function token(){ try { return localStorage.getItem('hub:t') || ''; } catch (e) { return ''; } }
  function key(){ try { return localStorage.getItem('hub:k') || ''; } catch (e) { return ''; } }
  function akey(){ try { return localStorage.getItem('hub:a') || ''; } catch (e) { return ''; } }
  function vtoken(){ try { return localStorage.getItem('hub:v') || ''; } catch (e) { return ''; } }
  function passId(){ try { return sessionStorage.getItem('hub:p') || ''; } catch (e) { return ''; } }
  /* THE PAGE KEEPS THE LINK IT OPENED WITH (1 Nov 2026, the role-by-role review's R1). The links live in this browser's
     shared storage, so opening another person's or another course's link in a second tab changed what an older page
     sent: its next save went out under the new link (trainee A's plan with trainee B's token, course A's settings with
     course B's key). The page now remembers its link as it loads; once the stored link differs, it saves nothing and
     says to reload. Reads still answer, so the page does not break while it says so. */
  function linkNow(){ return [token(), key(), akey(), vtoken()].join('|'); }
  var BOUND = linkNow();
  function moved(){ return linkNow() !== BOUND; }
  /* THE PIN (v87, 15 Oct 2026). Course admin can put a PIN on a trainee's
     link and one on the tutor link; the store then refuses every call
     without it. The PIN this device knows rides on each call; when the store
     says 'PIN required' or 'Wrong PIN', the sheet in hub-pin.js asks, the
     answer is kept here, and the call goes again. A page that must not ask
     (the invitation card) sets window.HUB_NO_PIN_PROMPT and gets the
     refusal back instead. */
  var gaveUp = false; // once per page: no sheet again after three wrong or Not now
  function pinName(payload){ return payload.key ? 'hub:kpin' : (payload.token && !payload.a) ? 'hub:pin' : ''; }
  function pinGet(name){ try { return name ? (localStorage.getItem(name) || '') : ''; } catch (e) { return ''; } }
  function pinSet(name, v){ try { if (v) localStorage.setItem(name, v); else localStorage.removeItem(name); } catch (e) {} }
  function pinSheet(){
    if (window.hubPin) return Promise.resolve(window.hubPin);
    return new Promise(function(resolve, reject){
      var sc = document.createElement('script');
      var v = (document.querySelector('script[src^="hub-store.js"]') || {}).src || '';
      sc.src = 'hub-pin.js' + (v.indexOf('?v=') !== -1 ? v.slice(v.indexOf('?v=')) : '');
      sc.onload = function(){ resolve(window.hubPin); }; sc.onerror = function(){ reject(new Error('Could not load the PIN sheet')); };
      document.head.appendChild(sc);
    });
  }
  // text/plain keeps the browser from sending a CORS preflight, which Apps
  // Script would not answer; the response itself is plain JSON.
  // A call that never answers is worse than one that fails: 20 s, then it is
  // treated as transient and retried (20 Sep 2026: a boot hung and the page
  // sat on "Loading from the course" for good).
  async function once(payload, timeoutMs){
    var ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = ctl ? setTimeout(function(){ ctl.abort(); }, timeoutMs || 20000) : null;
    var res, text;
    try {
      res = await fetch(URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload), signal: ctl ? ctl.signal : undefined });
      text = await res.text();
    } catch (e) { var ne = new Error(e && e.name === 'AbortError' ? 'The store took too long to answer' : 'Could not reach the store'); ne.transient = true; throw ne; }
    finally { if (timer) clearTimeout(timer); }
    try { return JSON.parse(text); } catch (e) { var title = (text.match(/<title>([^<]*)<\/title>/) || [])[1] || ''; var err = new Error('The store did not answer as expected' + (title ? ' (' + title + ')' : '')); err.transient = true; throw err; }
  }
  // Apps Script drops the odd call, especially several in quick succession,
  // and answers with an HTML page instead of JSON. One retry after a pause.
  /* A demo course writes nothing (Ramy, 19 Oct 2026): every visit is private,
     see hub-sync.js. These are the calls that only read; anything else on a
     demo is answered here and never sent -- no email, no upload, no roster
     change. feedback and report are the visitor's own note to Lite's maker. */
  var READS = { adminPin:1, poolSet:1, version:1, tidyNotes:1, trainerNotes:1, overallFromNotes:1, stage1Words:1, volunteerCards:1, celta5Assets:1, boot:1, get:1, me:1, course:1, roster:1, audio:1, ping:1, pins:1, materials:1, stats:1, inbox:1, readContribution:1, feedbackSummary:1, centres:1, ownerCourses:1, assessorLink:1, traineeViewLink:1, folderTrainees:1, folderRead:1, getInterviewAudio:1, feedback:1, report:1, demoCard:1, similar:1, webCheck:1, aiCheck:1, checksOn:1, tutorNotes:1, getNoteAudio:1, passInfo:1, peerSheets:1, questions:1, getQuestionAudio:1, bookings:1 };
  /* THE TRAINEE VIEW (12 Nov 2026). Ramy: "I want to show the trainees things from their perspective ... a trainee that is not
     really on the course." A link whose token starts "maya." is the course's made-up trainee: she reads what a trainee in
     Group 1 reads and writes nothing. Here she is treated as a demo visit, so every write is answered in the browser and
     never sent (the store refuses them too), and every page says who she is. */
  /* Decided once, from the link this page loaded with: a tutor's tab left open must not turn into a demo visit when Maya's link is opened in another tab. */
  var TEMPLATE = token().indexOf('maya.') === 0;
  function isTemplate(){ return TEMPLATE; }
  (function(){
    function strip(){
      if (!isTemplate() || !document.body || document.getElementById('hubTraineeView')) return;
      var st = document.createElement('style');
      st.textContent = '#hubTraineeView{position:fixed;top:0;left:0;right:0;z-index:900;margin:0;padding:8px 16px;box-sizing:border-box;background:#7a2e2e;color:#fff;font:700 13px/1.4 Karla,system-ui,sans-serif;text-align:center;}#hubTraineeView span{font-weight:400;}@media print{#hubTraineeView{display:none;}html{padding-top:0 !important;}}';
      document.head.appendChild(st);
      var b = document.createElement('div'); b.id = 'hubTraineeView'; b.setAttribute('role', 'status');
      b.innerHTML = 'Trainee view <span>\u00b7 Maya is a made-up trainee, not on the course. Nothing here is saved.</span>';
      document.body.insertBefore(b, document.body.firstChild);
      /* fixed, with its height kept free at the top of the page: a page whose body is a flex row laid a sticky strip out as a side column */
      var fit = function(){ var h = b.offsetHeight; document.documentElement.style.paddingTop = h + 'px'; document.documentElement.style.scrollPaddingTop = h + 'px'; };
      fit(); window.addEventListener('resize', fit);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', strip); else strip();
  })();
  function isDemo(){ if (isTemplate()) return true; if (window.HUB_DEMO != null) return !!window.HUB_DEMO; try { var c = JSON.parse(localStorage.getItem('connect_course_settings') || '{}') || {}; return !!c.demoToday; } catch (e) { return false; } }
  function cred(){ return key() || akey() || vtoken() || token() || ''; }
  function verGet(){ try { return JSON.parse(localStorage.getItem('hub:ver') || 'null'); } catch (e) { return null; } }
  function verPut(o){ try { localStorage.setItem('hub:ver', JSON.stringify(o)); } catch (e) {} }
  async function call(body, timeoutMs){
    var payload = Object.assign({}, body);
    if (!payload.owner && !READS[payload.op] && isDemo()) return { demo: true, saved: true };
    if (!payload.owner && !READS[payload.op] && moved()) throw new Error('Another Lite link was opened in this browser since this page loaded. Reload this page before saving, so your work goes to the right place.');
    // An owner call carries its own credential and nothing else. The console
    // used to pick up whatever link this browser had opened last -- an
    // assessor key from a pack, say -- and the store, seeing the assessor key
    // first, answered "The assessor link is read-only" to the owner (Ramy,
    // 1 Oct 2026: "I'm trying to enter by console").
    if (payload.owner) {}
    else if (key() && payload.key == null) payload.key = key();
    else if (akey() && payload.a == null) payload.a = akey();
    else if (vtoken() && payload.v == null) payload.v = vtoken();
    if (!payload.owner && payload.pass == null && passId()) payload.pass = passId();
    // Apps Script answers the odd call with an HTML error page ("Sayfa
    // Bulunamadi", 1 in 3 during a bad minute on 20 Sep 2026): three tries.
    var pn = pinName(payload);
    if (pn && payload.pin == null && pinGet(pn)) payload.pin = pinGet(pn);
    /* THE COURSE ADMIN PIN (store v210, 10 Nov 2026): four numbers chosen on Course admin. A device that has typed it
       sends it with the tutor's calls; the store asks for it only on Course admin's door and on the acts that cannot be
       undone, and this asks the person when the store does. */
    if (payload.key && !payload.owner && payload.adminPin == null && pinGet('hub:apin')) payload.adminPin = pinGet('hub:apin');
    var askedAdmin = 0;
    var out, tries = 0, waits = [900, 1800], asked = 0;
    /* A delete or a restore is never sent twice (24 Oct 2026): a request that
       timed out may still be running on the store, and a second one alongside
       it is how deleting c7 took other courses' records. */
    var onlyOnce = /^(deleteCourse|undeleteCourse|purgeCourse|restoreFromBackup)$/.test(payload.op);
    for (;;) {
      try { out = await once(payload, timeoutMs); }
      catch (e) { if (!e.transient || onlyOnce || tries >= waits.length) throw e; await new Promise(function(r){ setTimeout(r, waits[tries++]); }); continue; }
      // The store wants a PIN this device does not have, or has wrong: ask once
      // per refusal, up to three, then give up like any other refusal.
      // 'PIN needed' is the first open of a link on a course with PINs on:
      // the person chooses one (typed twice) and the store keeps its hash;
      // then it is this device's PIN like any other.
      if (!out.ok && pn && /^(PIN needed|PIN required|Wrong PIN)$/.test(String(out.error || '')) && !window.HUB_NO_PIN_PROMPT && !gaveUp) {
        var wrong = out.error === 'Wrong PIN', choose = out.error === 'PIN needed'; if (wrong) pinSet(pn, '');
        // Three wrong, or Not now: this page stops asking; the refusal goes
        // to the page, which says where a new link comes from.
        if (asked >= 3) { gaveUp = true; break; }
        var sheet = await pinSheet();
        var given = await sheet.ask({ who: pn === 'hub:kpin' ? 'tutor' : 'trainee', wrong: wrong, choose: choose });
        if (!given) { gaveUp = true; break; }
        if (choose) {
          var setOp = pn === 'hub:kpin' ? { op: 'setTutorPin', key: payload.key, pin: given } : { op: 'setMyPin', token: payload.token, pin: given };
          var setOut = await once(setOp, timeoutMs);
          if (!setOut.ok) { out = setOut; break; }
        }
        pinSet(pn, given); payload.pin = given; asked++; continue;
      }
      if (!out.ok && payload.key && /^(Admin PIN required|Wrong admin PIN)$/.test(String(out.error || '')) && !window.HUB_NO_PIN_PROMPT) {
        var wrongA = out.error === 'Wrong admin PIN'; if (wrongA) { pinSet('hub:apin', ''); delete payload.adminPin; }
        if (askedAdmin >= 3) break;
        var sheetA = await pinSheet();
        var givenA = await sheetA.ask({ who: 'admin', wrong: wrongA });
        if (!givenA) break;
        pinSet('hub:apin', givenA); payload.adminPin = givenA; askedAdmin++; continue;
      }
      break;
    }
    if (out && out.ok && payload.op === 'boot' && out.result && typeof out.result.adminPin === 'boolean') pinSet('hub:adminSet', out.result.adminPin ? '1' : '0');
    // A refusal is the store answering, not the network failing, and the two
    // must not be treated alike: a refused credential means the link is dead,
    // a transport failure means try again later. `transient` already marks the
    // second; this marks the first.
    /* THE COURSE'S VERSION (v179, 29 Oct 2026). A boot says which version it read; a write says what it moved the
       version from and to. When this browser's copy was that "from", its own write cannot have made it stale: it
       takes the "to" and the next page needs no boot. Anyone else's write leaves the copy behind, and the next page
       boots. */
    if (out && out.ok && out.ver) {
      try {
        var V = verGet();
        if (out.ver.at && payload.op === 'boot' && out.result && typeof out.result === 'object') out.result.__ver = out.ver.at;
        /* THE ROSTER IS NOT MIRRORED (3 Nov 2026). addTrainees, removeTrainee and renameTrainee write the store's roster
           straight from a page, and connect_roster_v1 in this browser is only ever written by a boot. Taking the "to"
           here left the next page sure it was current, with the roster it had before (the Connect demo's TP points said
           "No trainees on the roster yet" after twelve were added). Those three forget the version: the next page boots. */
        var ROSTER_OPS = { addTrainees: 1, removeTrainee: 1, renameTrainee: 1 };
        if (out.ver.before && ROSTER_OPS[payload.op]) { try { localStorage.removeItem('hub:ver'); } catch (e2) {}
          /* ...and the page that wrote boots the course behind itself (HubSync.refresh), so the next page needs no boot */
          setTimeout(function(){ try { if (window.HubSync && window.HubSync.refresh) window.HubSync.refresh().catch(function(){}); } catch (e3) {} }, 0); }
        else if (out.ver.before && V && V.cred === cred() && V.v === out.ver.before) verPut({ cred: V.cred, v: out.ver.after, at: V.at });
      } catch (e) {}
    }
    if (!out.ok) { var refusal = new Error(out.error || 'Store error'); refusal.refused = true; refusal.pin = /^(PIN needed|PIN required|Wrong PIN)$/.test(String(out.error || '')); refusal.adminPin = /^(Admin PIN required|Wrong admin PIN)$/.test(String(out.error || '')); throw refusal; }
    return out.result;
  }
  function base(){ return location.origin + location.pathname.replace(/[^/]*$/, ''); }
  function withAccess(href){
    var sep = href.indexOf('?') === -1 ? '?' : '&';
    var pp = passId(); if (pp && !/[?&]p=/.test(href)) { href += sep + 'p=' + encodeURIComponent(pp); sep = '&'; }
    if (key()) return href + sep + 'k=' + encodeURIComponent(key());
    if (akey()) return href + sep + 'ak=' + encodeURIComponent(akey());
    if (token()) return href + sep + 't=' + encodeURIComponent(token());
    if (vtoken()) return href + sep + 'v=' + encodeURIComponent(vtoken());
    return href;
  }
  return {
    url: URL, token: token, key: key, assessorKey: akey, volunteerToken: vtoken,
    isVolunteer: function(){ return !!vtoken() && !key() && !akey() && !token(); },
    /* A volunteer's link opens their invitation card first, as every other
       link does (the link cards, 7 Oct 2026); the card's button opens their
       page, and 26_volunteer.html?v= still works on its own. */
    volunteerLinkFor: function(v){ return base() + 'invite.html?v=' + encodeURIComponent(v); },
    isTemplate: isTemplate,
    isTutor: function(){ return !!key(); }, isAssessor: function(){ return !!akey() && !key(); }, isTrainee: function(){ return !!token() && !key() && !akey(); },
    call: call,
    ping: function(){ return call({ op: 'ping' }); },
    /* the course's version, a few bytes, and this browser's note of the version its copy holds */
    version: function(){ return call({ op: 'version', token: token() || undefined }, 20000); },
    cred: cred, verGet: verGet, verPut: verPut,
    /* THE BOOT GETS A MINUTE (11 Oct 2026). The library course carries thirteen
       sets -- 1.5 MB -- and the store takes about thirty seconds to send it, so
       the 20-second limit aborted every try and the page sat on "Checking your
       link" for good. Only the first load is this big; every other call keeps 20 s. */
    boot: function(){ return call({ op: 'boot', token: token() || undefined }, 60000); },
    assessorLink: function(){ return call({ op: 'assessorLink' }); },
    rotateAssessorKey: function(){ return call({ op: 'rotateAssessorKey' }); },
    assessorLinkFor: function(k){ return base() + '12_assessor_pack.html?ak=' + encodeURIComponent(k); },
    rotateKey: function(){ return call({ op: 'rotateKey' }).then(function(r){ try { localStorage.setItem('hub:k', r.key); } catch (e) {} BOUND = linkNow(); return true; }); },
    /* true once another link has replaced this page's in the browser (R1); hub-sync asks before it schedules or beacons */
    moved: moved,
    /* PINs (v87, 15 Oct 2026): people choose their own on first open (the
       choose flow above). Course admin sees who has one and gives a trainee
       who lost theirs a NEW link; the old token dies with its PIN. */
    pins: function(){ return call({ op: 'pins' }); },
    /* The Course admin PIN (v210). adminPin asks the store whether one is set and whether this device's opens it;
       adminKnown is what this device last heard ('1' set, '0' none, '' not heard); setAdminPin chooses or changes it
       (the store wants the current one first, and the sheet asks for it). Clearing a forgotten one is the owner's, on the console. */
    adminPin: function(){ return call({ op: 'adminPin' }).then(function(r){ pinSet('hub:adminSet', r && r.set ? '1' : '0'); return r; }); },
    adminKnown: function(){ return pinGet('hub:adminSet'); },
    adminHas: function(){ return !!pinGet('hub:apin'); },
    adminEnter: function(pin){ pinSet('hub:apin', String(pin || '')); },
    setAdminPin: function(pin){ return call({ op: 'setAdminPin', pin: pin }).then(function(r){ if (r && r.saved && !r.demo) { pinSet('hub:apin', String(pin)); pinSet('hub:adminSet', '1'); } return r; }); },

    reissueTrainee: function(tok){ return call({ op: 'reissueTrainee', token: tok }); },
    purgeTrainee: function(tok){ return call({ op: 'purgeTrainee', token: tok }); },
    /* A materials file goes to Drive and comes back as a link; the bytes never
       reach the sheet (a cell holds 50,000 characters). base64 is a third
       bigger than the file, so 10MB on disk is ~13MB on the wire and cannot
       finish inside the 20s every other call gets -- this one is given three
       minutes of its own. */
    putMaterial: function(tok, name, type, base64){
      return call({ op: 'putMaterial', token: tok, name: name, type: type, bytes: base64 }, 180000);
    },
    me: function(){ return call({ op: 'me', token: token() }); },
    get: function(kind, tok){ return call({ op: 'get', token: tok || token(), kind: kind }).then(function(r){ return r.data; }); },
    put: function(kind, data, tok){ return call({ op: 'put', token: tok || token(), kind: kind, data: data }); },
    /* a trainee's link goes with it (12 Nov 2026): without one the store answered "not on a course" and the input sessions page never refreshed */
    course: function(){ var b = { op: 'course' }; if (!key() && !akey() && !vtoken() && token()) b.token = token(); return call(b); },
    /* A Pool set, whole: its pages and recordings as well as its writing (store v209, 10 Nov 2026). A tutor's key
       only. An older store does not know the op and the caller carries on with the public copy. */
    poolSet: function(id){ return call({ op: 'poolSet', set: id }); },
    /* A TP point's track, through the store (v84): Drive refuses Lite's pages
       now. A tutor's or assessor's key speaks for itself; a trainee sends their
       token. */
    /* A track, kept once played (Ramy, 22 Oct 2026: listening offline). The
       store's answer is kept on this device beside the session films (sw.js,
       'lite-media-v1'); with no connection the kept copy answers instead. */
    audio: function(id){
      var b = { op: 'audio', id: id }; if (!key() && !akey() && token()) b.token = token();
      var at = location.origin + '/_kept/' + encodeURIComponent(id);
      var box = function(){ return window.caches ? caches.open('lite-media-v1') : Promise.reject(new Error('no cache')); };
      return call(b, 60000).then(function(r){
        if (r && r.b64) box().then(function(c){ return c.put(at, new Response(JSON.stringify({ b64: r.b64, mime: r.mime }), { headers: { 'Content-Type': 'application/json' } })); }).catch(function(){});
        return r;
      }, function(err){
        return box().then(function(c){ return c.match(at); }).then(function(hit){ if (!hit) throw err; return hit.json(); }, function(){ throw err; });
      });
    },
    putCourse: function(kind, data){ return call({ op: 'putCourse', kind: kind, data: data }); },
    /* v96 (23 Oct 2026): the end-of-course feedback, sent once, anonymous unless `named` */
    mailCourseFeedback: function(m){ return call({ op: 'mailCourseFeedback', to: m.to, subject: m.subject, body: m.body, csv: m.csv, filename: m.filename }); },
    courseFeedback: function(answers, named){ return call({ op: 'courseFeedback', answers: answers, named: named === true }); },
    /* A center's next course starts from what its last one taught the criteria
       suggester. The store decides whether there is anything to take: it
       refuses if this course has tagging of its own, so this can only seed. */
    seedCritLearn: function(){ return call({ op: 'seedCritLearn' }); },
    /* The store now and then answers ok with nothing in it (4 Oct, 21 Oct 2026:
       Course admin showed "Cannot read properties of undefined"). Ask again,
       then say it plainly. */
    roster: async function(){
      for (var i = 0; i < 3; i++) {
        var r = await call({ op: 'roster' });
        if (r && Array.isArray(r.trainees)) return r.trainees;
        await new Promise(function(res){ setTimeout(res, 800 * (i + 1)); });
      }
      throw new Error('The roster did not load. Reload the page in a moment.');
    },
    /* v53 (1 Oct 2026): a trainee may carry an email. Optional everywhere. */
    addTrainee: function(name, group, email){ return call({ op: 'addTrainee', name: name, group: group, email: email || '' }); },
    // A pasted class list in one call, rather than one call per name.
    addTrainees: function(list){ return call({ op: 'addTrainees', trainees: list }); },
    /* the trainee's own name for the certificate, once (3 Nov 2026) */
    confirmName: function(name){ return call({ op: 'confirmName', token: token(), name: name }); },
    renameTrainee: function(tok, name, group, email){ var b = { op: 'renameTrainee', token: tok, name: name, group: group }; if (email != null) b.email = email; return call(b); },
    removeTrainee: function(tok){ return call({ op: 'removeTrainee', token: tok }); },
    traineeLink: function(tok){ return base() + 'index.html?t=' + encodeURIComponent(tok); },
    /* The link a center actually hands out. It opens the invitation card --
       which says whose link it is, what it opens and that it must not be
       passed on -- and the card opens the room. The direct links above still
       work and are what the card's button uses; this is the front door, not a
       gate (23 Sep 2026, for a course being run through Google Classroom). */
    inviteFor: function(kind, v){
      var q = kind === 'tutor' ? 'k=' : kind === 'assessor' ? 'ak=' : kind === 'volunteer' ? 'v=' : 't=';
      return base() + 'invite.html?' + q + encodeURIComponent(v);
    },
    tutorLink: function(){ return base() + '5_tutor_dashboard.html?k=' + encodeURIComponent(key()); },
    withAccess: withAccess,
    /* THE ROOM'S DOOR (28 Oct 2026): no key, no token, and never held back as a demo's write; the store answers
       it with the course's own ask code (ask.html) */
    room: async function(body){
      var r = await fetch(URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ op: 'roomAsk' }, body)) });
      var j = await r.json();
      if (!j.ok) throw new Error(j.error || 'Not sent');
      return j.result;
    }
  };
})();
