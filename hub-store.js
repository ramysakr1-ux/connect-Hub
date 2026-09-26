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
    if (params.get('t')) { localStorage.setItem('hub:t', params.get('t')); localStorage.removeItem('hub:k'); localStorage.removeItem('hub:a'); }
    if (params.get('k')) { localStorage.setItem('hub:k', params.get('k')); localStorage.removeItem('hub:t'); localStorage.removeItem('hub:a'); }
    // The assessor key travels as ?ak= -- ?a= is the assignment key on screens 9-11
    // (a collision found on the 20 Sep 2026 trainee walk: opening FOL stored 'fol' as an assessor key).
    if (params.get('ak')) { localStorage.setItem('hub:a', params.get('ak')); localStorage.removeItem('hub:t'); localStorage.removeItem('hub:k'); }
    var stray = localStorage.getItem('hub:a'); if (stray && /^(fol|lrt|lsrt|lfc|a5)$/.test(stray)) localStorage.removeItem('hub:a');
  } catch (e) {}
  function token(){ try { return localStorage.getItem('hub:t') || ''; } catch (e) { return ''; } }
  function key(){ try { return localStorage.getItem('hub:k') || ''; } catch (e) { return ''; } }
  function akey(){ try { return localStorage.getItem('hub:a') || ''; } catch (e) { return ''; } }
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
    if (key() && payload.key == null) payload.key = key();
    else if (akey() && payload.a == null) payload.a = akey();
    // Apps Script answers the odd call with an HTML error page ("Sayfa
    // Bulunamadi", 1 in 3 during a bad minute on 20 Sep 2026): three tries.
    var out, tries = 0, waits = [900, 1800];
    for (;;) {
      try { out = await once(payload, timeoutMs); break; }
      catch (e) { if (!e.transient || tries >= waits.length) throw e; await new Promise(function(r){ setTimeout(r, waits[tries++]); }); }
    }
    // A refusal is the store answering, not the network failing, and the two
    // must not be treated alike: a refused credential means the link is dead,
    // a transport failure means try again later. `transient` already marks the
    // second; this marks the first.
    if (!out.ok) { var refusal = new Error(out.error || 'Store error'); refusal.refused = true; throw refusal; }
    return out.result;
  }
  function base(){ return location.origin + location.pathname.replace(/[^/]*$/, ''); }
  function withAccess(href){
    var sep = href.indexOf('?') === -1 ? '?' : '&';
    if (key()) return href + sep + 'k=' + encodeURIComponent(key());
    if (akey()) return href + sep + 'ak=' + encodeURIComponent(akey());
    if (token()) return href + sep + 't=' + encodeURIComponent(token());
    return href;
  }
  return {
    url: URL, token: token, key: key, assessorKey: akey,
    isTutor: function(){ return !!key(); }, isAssessor: function(){ return !!akey() && !key(); }, isTrainee: function(){ return !!token() && !key() && !akey(); },
    call: call,
    ping: function(){ return call({ op: 'ping' }); },
    boot: function(){ return call({ op: 'boot', token: token() || undefined }); },
    assessorLink: function(){ return call({ op: 'assessorLink' }); },
    rotateAssessorKey: function(){ return call({ op: 'rotateAssessorKey' }); },
    assessorLinkFor: function(k){ return base() + '12_assessor_pack.html?ak=' + encodeURIComponent(k); },
    rotateKey: function(){ return call({ op: 'rotateKey' }).then(function(r){ try { localStorage.setItem('hub:k', r.key); } catch (e) {} return true; }); },
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
    putCourse: function(kind, data){ return call({ op: 'putCourse', kind: kind, data: data }); },
    /* A centre's next course starts from what its last one taught the criteria
       suggester. The store decides whether there is anything to take: it
       refuses if this course has tagging of its own, so this can only seed. */
    seedCritLearn: function(){ return call({ op: 'seedCritLearn' }); },
    roster: function(){ return call({ op: 'roster' }).then(function(r){ return r.trainees; }); },
    addTrainee: function(name, group){ return call({ op: 'addTrainee', name: name, group: group }); },
    // A pasted class list in one call, rather than one call per name.
    addTrainees: function(list){ return call({ op: 'addTrainees', trainees: list }); },
    renameTrainee: function(tok, name, group){ return call({ op: 'renameTrainee', token: tok, name: name, group: group }); },
    removeTrainee: function(tok){ return call({ op: 'removeTrainee', token: tok }); },
    traineeLink: function(tok){ return base() + 'index.html?t=' + encodeURIComponent(tok); },
    /* The link a centre actually hands out. It opens the invitation card --
       which says whose link it is, what it opens and that it must not be
       passed on -- and the card opens the room. The direct links above still
       work and are what the card's button uses; this is the front door, not a
       gate (23 Sep 2026, for a course being run through Google Classroom). */
    inviteFor: function(kind, v){
      var q = kind === 'tutor' ? 'k=' : kind === 'assessor' ? 'ak=' : 't=';
      return base() + 'invite.html?' + q + encodeURIComponent(v);
    },
    tutorLink: function(){ return base() + '5_tutor_dashboard.html?k=' + encodeURIComponent(key()); },
    withAccess: withAccess
  };
})();
