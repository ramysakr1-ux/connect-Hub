/* A RECORDING THAT ALWAYS FITS (Ramy, 18 Nov 2026, C/21's interviews: "they go over 10 minutes and then it will tell them
 * that it's too big, or they will go under 10 minutes and it will still tell them that ... some of them can't seem to
 * upload like 5 minutes ... some of them also manage to record on their phone. Is there a way we can get the recording
 * on Lite so it could be transcribed?").
 *
 * The store takes a recording of up to 8 MB. Lite asks the browser for a small voice recording, but the browser decides:
 * Chrome keeps to it, Safari does not, so the same five minutes was 1 MB on one laptop and too big on another. And a
 * recording made on a phone's own recorder had no way in at all.
 *
 * HubAudioFit.fit(blob, { maxSeconds, onProgress }) reads any recording the browser can play (its own, or a file from a
 * phone: m4a, mp3, wav, ogg, webm), keeps the first maxSeconds, and writes it again as a small voice file: MP3, one
 * channel, 16 kHz, 32 kbit/s. Ten minutes is 2.4 MB whatever made it. It resolves { blob, seconds, cut } where cut says
 * the recording was longer than maxSeconds and only the start was kept. Nothing leaves the browser here.
 *
 * The MP3 encoder is lamejs (LGPL), fetched from cdnjs the first time it is needed. */
(function (root) {
  'use strict';
  var LAME = 'https://cdnjs.cloudflare.com/ajax/libs/lamejs/1.2.0/lame.min.js';
  var RATE = 16000, KBPS = 32;
  var lame = null;
  function loadLame() {
    if (root.lamejs && root.lamejs.Mp3Encoder) return Promise.resolve(root.lamejs);
    if (lame) return lame;
    lame = new Promise(function (res, rej) {
      var s = document.createElement('script'); s.src = LAME;
      s.onload = function () { root.lamejs && root.lamejs.Mp3Encoder ? res(root.lamejs) : rej(new Error('the audio tool did not load')); };
      s.onerror = function () { lame = null; rej(new Error('the audio tool could not be fetched. Check the connection and try again')); };
      document.head.appendChild(s);
    });
    return lame;
  }
  function decode(buf) {
    var AC = root.AudioContext || root.webkitAudioContext;
    if (!AC) return Promise.reject(new Error('this browser cannot read audio files'));
    var ctx; try { ctx = new AC({ sampleRate: RATE }); } catch (e) { ctx = new AC(); }   // asked small, so a long file takes less memory
    var done = function (v) { try { ctx.close(); } catch (e) {} return v; };
    return new Promise(function (res, rej) {
      var p; try { p = ctx.decodeAudioData(buf, res, rej); } catch (e) { rej(e); }
      if (p && p.then) p.then(res, rej);
    }).then(done, function (e) { done(); throw new Error('this file could not be read as a recording. Save it as m4a or mp3 and try again'); });
  }
  /* one channel at 16 kHz, the first maxSeconds only */
  function mono16(ab, maxSeconds) {
    var n = ab.length, ch = ab.numberOfChannels, sr = ab.sampleRate;
    var take = Math.min(n, Math.floor(maxSeconds * sr));
    var chans = []; for (var c = 0; c < ch; c++) chans.push(ab.getChannelData(c));
    var outN = Math.floor(take * RATE / sr), out = new Int16Array(outN), step = sr / RATE;
    for (var i = 0; i < outN; i++) {
      var a = Math.floor(i * step), b = Math.min(take, Math.max(a + 1, Math.floor((i + 1) * step))), sum = 0;
      for (var j = a; j < b; j++) { for (var k = 0; k < ch; k++) sum += chans[k][j]; }
      var v = sum / ((b - a) * ch);
      out[i] = v < -1 ? -32768 : v > 1 ? 32767 : Math.round(v * 32767);
    }
    return { pcm: out, cut: n > take + sr };   // a second's grace: a recording stopped at the limit is not "cut"
  }
  function encode(L, pcm, onProgress) {
    return new Promise(function (res, rej) {
      var enc; try { enc = new L.Mp3Encoder(1, RATE, KBPS); } catch (e) { rej(e); return; }
      var parts = [], i = 0, BLOCK = 1152 * 40;
      (function go() {
        try {
          var end = Math.min(pcm.length, i + BLOCK * 8);
          for (; i < end; i += BLOCK) { var buf = enc.encodeBuffer(pcm.subarray(i, Math.min(pcm.length, i + BLOCK))); if (buf.length) parts.push(new Uint8Array(buf)); }
          if (onProgress) onProgress(Math.min(1, i / Math.max(1, pcm.length)));
          if (i < pcm.length) { setTimeout(go, 0); return; }
          var last = enc.flush(); if (last.length) parts.push(new Uint8Array(last));
          res(new Blob(parts, { type: 'audio/mpeg' }));
        } catch (e) { rej(e); }
      })();
    });
  }
  function fit(blob, o) {
    o = o || {};
    var maxSeconds = o.maxSeconds || 600;
    return Promise.all([loadLame(), blob.arrayBuffer()]).then(function (r) {
      return decode(r[1]).then(function (ab) {
        var m = mono16(ab, maxSeconds);
        if (!m.pcm.length) throw new Error('there is no sound in this file');
        return encode(r[0], m.pcm, o.onProgress).then(function (mp3) { return { blob: mp3, seconds: Math.round(m.pcm.length / RATE), cut: m.cut }; });
      });
    });
  }
  /* ready(): fetch the encoder ahead of need (when Record is pressed), so the end of an interview does not wait on the network */
  root.HubAudioFit = { fit: fit, ready: function () { return loadLame().catch(function () {}); } };
})(typeof window !== 'undefined' ? window : globalThis);
