/* Connect Lite — a short voice recording, for a question.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * Ramy, 28 Oct 2026: "hold to ask ... up to thirty seconds ... or type it". One small helper, used by the question
 * button on an input session (hub-ask.js) and by the room's own page (ask.html). No page of its own: it only records.
 *
 *   var r = HubRec.hold(button, { max: 30, onTick(sec), onDone(result), onError(message) });
 *     Holding the button records; letting go keeps it. A quick tap (under 0.6 s) starts a recording that a second tap
 *     keeps, so a phone, a keyboard or a trembling hand can use it too. Thirty seconds, then it stops by itself.
 *   result = { blob, seconds, type }       HubRec.b64(blob) -> Promise<string>
 */
(function(){
  'use strict';
  function mime(){
    var c = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus', 'audio/ogg'];
    for (var i = 0; i < c.length; i++) { try { if (window.MediaRecorder && MediaRecorder.isTypeSupported(c[i])) return c[i]; } catch (e) {} }
    return '';
  }
  function b64(blob){
    return new Promise(function(res, rej){
      var fr = new FileReader();
      fr.onload = function(){ res(String(fr.result).split(',')[1] || ''); };
      fr.onerror = function(){ rej(new Error('Could not read the recording')); };
      fr.readAsDataURL(blob);
    });
  }
  function hold(btn, o){
    o = o || {};
    var MAX = o.max || 30, rec = null, stream = null, chunks = [], t0 = 0, timer = 0, downAt = 0, toggled = false, live = false;
    function tick(){ var s = Math.round((Date.now() - t0) / 1000); if (o.onTick) o.onTick(s); if (s >= MAX) stop(); }
    function cleanup(){ clearInterval(timer); timer = 0; live = false; if (stream) { try { stream.getTracks().forEach(function(t){ t.stop(); }); } catch (e) {} stream = null; } btn.classList.remove('on'); }
    function start(){
      if (live) return; live = true; toggled = false;
      if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) || !window.MediaRecorder) { live = false; if (o.onError) o.onError('This browser cannot record. Type the question instead.'); return; }
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function(s){
        if (!live) { s.getTracks().forEach(function(t){ t.stop(); }); return; }   // let go before the microphone answered
        stream = s; chunks = []; var type = mime();
        rec = new MediaRecorder(s, type ? { mimeType: type } : undefined);
        rec.ondataavailable = function(e){ if (e.data && e.data.size) chunks.push(e.data); };
        rec.onstop = function(){
          var secs = Math.max(1, Math.round((Date.now() - t0) / 1000)), blob = new Blob(chunks, { type: (rec && rec.mimeType) || type || 'audio/webm' });
          cleanup(); if (o.onDone) o.onDone({ blob: blob, seconds: secs, type: blob.type });
        };
        t0 = Date.now(); rec.start(250); btn.classList.add('on'); timer = setInterval(tick, 250); if (o.onTick) o.onTick(0);
      }, function(){ live = false; if (o.onError) o.onError('The microphone was not allowed. Type the question instead.'); });
    }
    function stop(){ if (rec && rec.state === 'recording') { try { rec.stop(); } catch (e) { cleanup(); } } else { cleanup(); } }
    btn.addEventListener('pointerdown', function(e){
      if (e.button != null && e.button > 0) return;
      e.preventDefault(); downAt = Date.now();
      if (live && toggled) { stop(); return; }          // the second tap of a tap-to-record
      start();
    });
    function up(){
      if (!live || !downAt) return;
      var held = Date.now() - downAt; downAt = 0;
      if (held < 600) { toggled = true; return; }       // a tap: keep recording until the next one
      stop();
    }
    btn.addEventListener('pointerup', up); btn.addEventListener('pointercancel', up); btn.addEventListener('pointerleave', function(){ if (downAt && Date.now() - downAt >= 600) up(); });
    btn.addEventListener('contextmenu', function(e){ e.preventDefault(); });
    btn.addEventListener('keydown', function(e){ if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (e.repeat) return; if (live) stop(); else { start(); toggled = true; } } });
    return { stop: stop, live: function(){ return live; } };
  }
  window.HubRec = { hold: hold, b64: b64, mime: mime };
})();
