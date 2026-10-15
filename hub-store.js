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
    /* A new link forgets the PIN kept for the old one (v75): the PIN belongs
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
    var stray = localStorage.getItem('hub:a'); if (stray && /^(fol|lrt|lsrt|lfc|a5)$/.test(stray)) localStorage.removeItem('hub:a');
  } catch (e) {}
  function token(){ try { return localStorage.getItem('hub:t') || ''; } catch (e) { return ''; } }
  function key(){ try { return localStorage.getItem('hub:k') || ''; } catch (e) { return ''; } }
  function akey(){ try { return localStorage.getItem('hub:a') || ''; } catch (e) { return ''; } }
  function vtoken(){ try { return localStorage.getItem('hub:v') || ''; } catch (e) { return ''; } }
  /* THE PIN (v87, 15 Oct 2026). Course admin can put a PIN on a trainee's
     link and one on the tutor link; the store then refuses every call
     without it. The PIN this device knows rides on each call; when the store
     says 'PIN required' or 'Wrong PIN', the sheet in hub-pin.js asks, the
     answer is kept here, and the call goes again. A page that must not ask
     (the invitation card) sets window.HUB_NO_PIN_PROMPT and gets the
     refusal back instead. */
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
  async function call(body, timeoutMs){
    var payload = Object.assign({}, body);
    // An owner call carries its own credential and nothing else. The console
    // used to pick up whatever link this browser had opened last -- an
    // assessor key from a pack, say -- and the store, seeing the assessor key
    // first, answered "The assessor link is read-only" to the owner (Ramy,
    // 1 Oct 2026: "I'm trying to enter by console").
    if (payload.owner) {}
    else if (key() && payload.key == null) payload.key = key();
    else if (akey() && payload.a == null) payload.a = akey();
    else if (vtoken() && payload.v == null) payload.v = vtoken();
    // Apps Script answers the odd call with an HTML error page ("Sayfa
    // Bulunamadi", 1 in 3 during a bad minute on 20 Sep 2026): three tries.
    var pn = pinName(payload);
    if (pn && payload.pin == null && pinGet(pn)) payload.pin = pinGet(pn);
    var out, tries = 0, waits = [900, 1800], asked = 0;
    for (;;) {
      try { out = await once(payload, timeoutMs); }
      catch (e) { if (!e.transient || tries >= waits.length) throw e; await new Promise(function(r){ setTimeout(r, waits[tries++]); }); continue; }
      // The store wants a PIN this device does not have, or has wrong: ask once
      // per refusal, up to three, then give up like any other refusal.
      if (!out.ok && pn && /^(PIN required|Wrong PIN)$/.test(String(out.error || '')) && !window.HUB_NO_PIN_PROMPT && asked < 3) {
        var wrong = out.error === 'Wrong PIN'; if (wrong) pinSet(pn, '');
        var sheet = await pinSheet();
        var given = await sheet.ask({ who: pn === 'hub:kpin' ? 'tutor' : 'trainee', wrong: wrong });
        if (!given) break;
        pinSet(pn, given); payload.pin = given; asked++; continue;
      }
      break;
    }
    // A refusal is the store answering, not the network failing, and the two
    // must not be treated alike: a refused credential means the link is dead,
    // a transport failure means try again later. `transient` already marks the
    // second; this marks the first.
    if (!out.ok) { var refusal = new Error(out.error || 'Store error'); refusal.refused = true; refusal.pin = /^(PIN required|Wrong PIN)$/.test(String(out.error || '')); throw refusal; }
    return out.result;
  }
  function base(){ return location.origin + location.pathname.replace(/[^/]*$/, ''); }
  function withAccess(href){
    var sep = href.indexOf('?') === -1 ? '?' : '&';
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
    /* PINs (v87): course admin only. pin '' clears. */
    pins: function(){ return call({ op: 'pins' }); },
    setTutorPin: function(pin){ return call({ op: 'setTutorPin', pin: pin || '' }).then(function(r){ pinSet('hub:kpin', pin || ''); return r; }); },
    setTraineePin: function(tok, pin){ return call({ op: 'setTraineePin', token: tok, pin: pin || '' }); },
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
    audio: function(id){ var b = { op: 'audio', id: id }; if (!key() && !akey() && token()) b.token = token(); return call(b, 60000); },
    putCourse: function(kind, data){ return call({ op: 'putCourse', kind: kind, data: data }); },
    /* A centre's next course starts from what its last one taught the criteria
       suggester. The store decides whether there is anything to take: it
       refuses if this course has tagging of its own, so this can only seed. */
    seedCritLearn: function(){ return call({ op: 'seedCritLearn' }); },
    roster: function(){ return call({ op: 'roster' }).then(function(r){ return r.trainees; }); },
    /* v53 (1 Oct 2026): a trainee may carry an email. Optional everywhere. */
    addTrainee: function(name, group, email){ return call({ op: 'addTrainee', name: name, group: group, email: email || '' }); },
    // A pasted class list in one call, rather than one call per name.
    addTrainees: function(list){ return call({ op: 'addTrainees', trainees: list }); },
    renameTrainee: function(tok, name, group, email){ var b = { op: 'renameTrainee', token: tok, name: name, group: group }; if (email != null) b.email = email; return call(b); },
    removeTrainee: function(tok){ return call({ op: 'removeTrainee', token: tok }); },
    traineeLink: function(tok){ return base() + 'index.html?t=' + encodeURIComponent(tok); },
    /* The link a centre actually hands out. It opens the invitation card --
       which says whose link it is, what it opens and that it must not be
       passed on -- and the card opens the room. The direct links above still
       work and are what the card's button uses; this is the front door, not a
       gate (23 Sep 2026, for a course being run through Google Classroom). */
    inviteFor: function(kind, v){
      var q = kind === 'tutor' ? 'k=' : kind === 'assessor' ? 'ak=' : kind === 'volunteer' ? 'v=' : 't=';
      return base() + 'invite.html?' + q + encodeURIComponent(v);
    },
    tutorLink: function(){ return base() + '5_tutor_dashboard.html?k=' + encodeURIComponent(key()); },
    withAccess: withAccess
  };
})();
