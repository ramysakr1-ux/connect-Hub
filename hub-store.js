// The Hub's store client. The records live in a Google Sheet behind an Apps
// Script web app (Ramy, 20 Sep 2026: "go with 1, start with the store"), so a
// trainee's plan reaches the tutor without a file and comes back the same way.
//
// Access is by link, as in Connect: a trainee's link carries ?t=<token>, a
// tutor's carries ?k=<course key>. Either is remembered in this browser once
// seen, so the pages can link to each other without repeating it.
window.HubStore = (function(){
  var URL = 'https://script.google.com/macros/s/AKfycbz5ESCtTg6kIDNCf7ynt1fB0tOSVusgOUiMub9-wEZunwQ2uTw2wzz1vmbHxzbvpG-eyA/exec';
  var params = new URLSearchParams(location.search);
  try {
    if (params.get('t')) localStorage.setItem('hub:t', params.get('t'));
    if (params.get('k')) localStorage.setItem('hub:k', params.get('k'));
  } catch (e) {}
  function token(){ try { return localStorage.getItem('hub:t') || ''; } catch (e) { return ''; } }
  function key(){ try { return localStorage.getItem('hub:k') || ''; } catch (e) { return ''; } }
  // text/plain keeps the browser from sending a CORS preflight, which Apps
  // Script would not answer; the response itself is plain JSON.
  async function call(body){
    var payload = Object.assign({}, body);
    if (key() && !payload.key) payload.key = key();
    var res = await fetch(URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) });
    var text = await res.text();
    var out;
    try { out = JSON.parse(text); } catch (e) { throw new Error('The store did not answer as expected' + (text.indexOf('<') === 0 ? ' (it may not be authorised yet)' : '')); }
    if (!out.ok) throw new Error(out.error || 'Store error');
    return out.result;
  }
  function base(){ return location.origin + location.pathname.replace(/[^/]*$/, ''); }
  function withAccess(href){
    var sep = href.indexOf('?') === -1 ? '?' : '&';
    if (key()) return href + sep + 'k=' + encodeURIComponent(key());
    if (token()) return href + sep + 't=' + encodeURIComponent(token());
    return href;
  }
  return {
    url: URL, token: token, key: key,
    isTutor: function(){ return !!key(); }, isTrainee: function(){ return !!token() && !key(); },
    call: call,
    ping: function(){ return call({ op: 'ping' }); },
    me: function(){ return call({ op: 'me', token: token() }); },
    get: function(kind, tok){ return call({ op: 'get', token: tok || token(), kind: kind }).then(function(r){ return r.data; }); },
    put: function(kind, data, tok){ return call({ op: 'put', token: tok || token(), kind: kind, data: data }); },
    course: function(){ return call({ op: 'course' }); },
    putCourse: function(kind, data){ return call({ op: 'putCourse', kind: kind, data: data }); },
    roster: function(){ return call({ op: 'roster' }).then(function(r){ return r.trainees; }); },
    addTrainee: function(name, group){ return call({ op: 'addTrainee', name: name, group: group }); },
    renameTrainee: function(tok, name, group){ return call({ op: 'renameTrainee', token: tok, name: name, group: group }); },
    removeTrainee: function(tok){ return call({ op: 'removeTrainee', token: tok }); },
    traineeLink: function(tok){ return base() + 'index.html?t=' + encodeURIComponent(tok); },
    tutorLink: function(){ return base() + '5_tutor_dashboard.html?k=' + encodeURIComponent(key()); },
    withAccess: withAccess
  };
})();
