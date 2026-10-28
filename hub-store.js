// The Hub's store client. The records live in a Google Sheet behind an Apps
// Script web app (Ramy, 20 Sep 2026: "go with 1, start with the store"), so a
// trainee's plan reaches the tutor without a file and comes back the same way.
//
// Access is by link, as in Connect: a trainee's link carries ?t=<token>, a
// tutor's carries ?k=<course key>, an assessor's ?ak=<assessor key> (read-only,
// Ramy 20 Sep 2026). Any of them is remembered in this browser once seen, so
// the pages can link to each other without repeating it.
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
    if (params.get('k')) { if (localStorage.getItem('hub:k') !== params.get('k')) localStorage.removeItem('hub:kpin'); localStorage.setItem('hub:k', params.get('k')); localStorage.removeItem('hub:t'); localStorage.removeItem('hub:a'); }
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
  var READS = { tidyNotes:1, trainerNotes:1, overallFromNotes:1, stage1Words:1, volunteerCards:1, celta5Assets:1, boot:1, get:1, me:1, course:1, roster:1, audio:1, ping:1, pins:1, materials:1, stats:1, inbox:1, readContribution:1, feedbackSummary:1, centres:1, ownerCourses:1, assessorLink:1, getInterviewAudio:1, feedback:1, report:1, demoCard:1, similar:1, webCheck:1, aiCheck:1, checksOn:1, tutorNotes:1, getNoteAudio:1, passInfo:1, peerSheets:1, questions:1, getQuestionAudio:1 };
  function isDemo(){ if (window.HUB_DEMO != null) return !!window.HUB_DEMO; try { var c = JSON.parse(localStorage.getItem('connect_course_settings') || '{}') || {}; return !!c.demoToday; } catch (e) { return false; } }
  async function call(body, timeoutMs){
    var payload = Object.assign({}, body);
    if (!payload.owner && !READS[payload.op] && isDemo()) return { demo: true, saved: true };
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
      break;
    }
    // A refusal is the store answering, not the network failing, and the two
    // must not be treated alike: a refused credential means the link is dead,
    // a transport failure means try again later. `transient` already marks the
    // second; this marks the first.
    if (!out.ok) { var refusal = new Error(out.error || 'Store error'); refusal.refused = true; refusal.pin = /^(PIN needed|PIN required|Wrong PIN)$/.test(String(out.error || '')); throw refusal; }
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
    isTutor: function(){ return !!key(); }, isAssessor: function(){ return !!akey() && !key(); }, isTrainee: function(){ return !!token() && !key() && !akey(); },
    call: call,
    ping: function(){ return call({ op: 'ping' }); },
    /* THE BOOT GETS A MINUTE (11 Oct 2026). The library course carries thirteen
       sets -- 1.5 MB -- and the store takes about thirty seconds to send it, so
       the 20-second limit aborted every try and the page sat on "Checking your
       link" for good. Only the first load is this big; every other call keeps 20 s. */
    boot: function(){ return call({ op: 'boot', token: token() || undefined }, 60000); },
    assessorLink: function(){ return call({ op: 'assessorLink' }); },
    rotateAssessorKey: function(){ return call({ op: 'rotateAssessorKey' }); },
    assessorLinkFor: function(k){ return base() + '12_assessor_pack.html?ak=' + encodeURIComponent(k); },
    rotateKey: function(){ return call({ op: 'rotateKey' }).then(function(r){ try { localStorage.setItem('hub:k', r.key); } catch (e) {} return true; }); },
    /* PINs (v87, 15 Oct 2026): people choose their own on first open (the
       choose flow above). Course admin sees who has one and gives a trainee
       who lost theirs a NEW link; the old token dies with its PIN. */
    pins: function(){ return call({ op: 'pins' }); },
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
    course: function(){ return call({ op: 'course' }); },
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
