/* CHOOSE FROM MY DRIVE (Ramy, 18 Nov 2026: "the picker is important ... we want to encourage them to use their own links
 * and their own drive, so we don't overload our drive, or at least then they just have it so they can keep it forever").
 *
 * Google's own file picker, opened over the page. The trainee signs in to Google in Google's window, chooses a file on
 * their Drive (or uploads one from the device into their Drive), and the page gets that one file's name and address.
 * Lite asks Google for the narrowest permission there is (drive.file): the files the person picks here, and nothing else
 * on their Drive. The sign-in and the permission stay in this browser; the store never sees them. What Lite keeps is
 * the file's link, as if it had been pasted.
 *
 * The app's three public names (client ID, browser key, project number) come from the store (op drivePicker), set from
 * the owner console. Until they are set, available() is false and no page shows the choice.
 *
 *   HubDrivePick.available()  -> Promise<boolean>   cheap: "off" is remembered for ten minutes
 *   HubDrivePick.prepare()    -> Promise            fetch Google's two scripts ahead of the press (a sign-in window
 *                                                    opened after a wait is blocked by the browser)
 *   HubDrivePick.pick(opts)   -> Promise<{ id, name, url, mime } | null>     null = closed without choosing;
 *                                                    opts.upload opens on the upload page
 *   HubDrivePick.share(id)    -> Promise<boolean>   "anyone with the link can view", so a tutor can open it
 */
(function (root) {
  'use strict';
  var GSI = 'https://accounts.google.com/gsi/client', GAPI = 'https://apis.google.com/js/api.js';
  var SCOPE = 'https://www.googleapis.com/auth/drive.file';
  var KEEP = 'hub:drivepick', OFF_FOR = 10 * 60 * 1000;
  var cfg = null, cfgAsk = null, ready = null, token = '', tokenUntil = 0;

  function script(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script'); s.src = src; s.async = true;
      s.onload = function () { res(); }; s.onerror = function () { rej(new Error('Google could not be reached. Check the connection and try again')); };
      document.head.appendChild(s);
    });
  }
  function config() {
    if (cfg) return Promise.resolve(cfg);
    if (cfgAsk) return cfgAsk;
    var S = root.HubStore;
    if (!S || !S.call) return Promise.resolve(null);
    var body = { op: 'drivePicker' }; try { if (S.token && S.token()) body.token = S.token(); } catch (e) {}
    cfgAsk = S.call(body, 20000).then(function (r) {
      cfgAsk = null;
      if (r && r.demo) return null;   // answered in the browser (a demo course), not by the store: not remembered
      var on = !!(r && r.on && r.clientId && r.apiKey && r.appId);
      try { localStorage.setItem(KEEP, JSON.stringify({ on: on, at: Date.now() })); } catch (e) {}
      cfg = on ? { clientId: r.clientId, apiKey: r.apiKey, appId: r.appId } : null;
      return cfg;
    }, function () { cfgAsk = null; return null; });
    return cfgAsk;
  }
  function available() {
    if (cfg) return Promise.resolve(true);
    var k = null; try { k = JSON.parse(localStorage.getItem(KEEP) || 'null'); } catch (e) {}
    if (k && k.on === false && Date.now() - (k.at || 0) < OFF_FOR) return Promise.resolve(false);   // "off" is remembered for ten minutes; "on" still needs the names
    return config().then(function (c) { return !!c; });
  }
  function prepare() {
    if (ready) return ready;
    ready = config().then(function (c) {
      if (!c) throw new Error('Choosing from Drive is not switched on');
      return Promise.all([
        root.google && root.google.accounts && root.google.accounts.oauth2 ? null : script(GSI),
        (root.gapi ? Promise.resolve() : script(GAPI)).then(function () {
          return new Promise(function (res, rej) { root.gapi.load('picker', { callback: res, onerror: function () { rej(new Error('Google’s file chooser did not load')); } }); });
        })
      ]);
    }).then(function () { return true; }, function (e) { ready = null; throw e; });
    return ready;
  }
  function signIn() {
    if (token && Date.now() < tokenUntil) return Promise.resolve(token);
    return new Promise(function (res, rej) {
      var done = false, fail = function (m) { if (!done) { done = true; rej(new Error(m)); } };
      var client;
      try {
        client = root.google.accounts.oauth2.initTokenClient({
          client_id: cfg.clientId, scope: SCOPE,
          callback: function (r) {
            if (done) return;
            if (!r || r.error || !r.access_token) { fail(r && r.error === 'access_denied' ? 'Google was not given permission, so nothing was chosen' : 'Google did not sign you in. Try again'); return; }
            done = true; token = r.access_token; tokenUntil = Date.now() + Math.max(60, (Number(r.expires_in) || 3600) - 120) * 1000; res(token);
          },
          error_callback: function (e) {
            fail(e && e.type === 'popup_failed_to_open' ? 'The browser blocked Google’s window. Allow pop-ups for this page, then press the button again'
              : e && e.type === 'popup_closed' ? 'Google’s window was closed, so nothing was chosen' : 'Google did not sign you in. Try again');
          }
        });
        client.requestAccessToken({ prompt: '' });
      } catch (e) { fail('Google did not sign you in. Try again'); }
    });
  }
  /* opts.upload: open on "Upload" (a file from this device goes into the person's own Drive), else on their Drive, where a
     folder can be chosen too (23 Nov 2026: From this device / From my Google Drive) */
  function open(tok, opts) {
    return new Promise(function (res, rej) {
      try {
        var P = root.google.picker;
        var mine = new P.DocsView(P.ViewId.DOCS).setIncludeFolders(true).setSelectFolderEnabled(true).setOwnedByMe(true).setMode(P.DocsViewMode.LIST);
        var up = new P.DocsUploadView();
        var b0 = new P.PickerBuilder(); if (opts && opts.upload) b0.addView(up).addView(mine); else b0.addView(mine).addView(up);
        var b = b0
          .setOAuthToken(tok).setDeveloperKey(cfg.apiKey).setAppId(cfg.appId).setTitle('Choose your material')
          .setCallback(function (d) {
            var act = d && d[P.Response.ACTION];
            if (act === P.Action.PICKED) {
              var doc = (d[P.Response.DOCUMENTS] || [])[0]; if (!doc) { res(null); return; }
              res({ id: doc[P.Document.ID], name: doc[P.Document.NAME] || 'Your file', url: doc[P.Document.URL] || ('https://drive.google.com/file/d/' + doc[P.Document.ID] + '/view'), mime: doc[P.Document.MIME_TYPE] || '' });
            } else if (act === P.Action.CANCEL) res(null);
          });
        b.build().setVisible(true);
      } catch (e) { rej(new Error('Google’s file chooser could not be opened')); }
    });
  }
  /* pick(): everything Google needs is already here when prepare() ran first, so the sign-in window opens straight from
     the press. If it did not, this waits for it, and a browser that then blocks the window says so. */
  function pick(opts) {
    var go = function () { return signIn().then(function (tok) { return open(tok, opts); }); };
    if (cfg && root.google && root.google.accounts && root.google.accounts.oauth2 && root.google.picker) return go();
    return prepare().then(go);
  }
  function share(id) {
    if (!token || !id) return Promise.resolve(false);
    return fetch('https://www.googleapis.com/drive/v3/files/' + encodeURIComponent(id) + '/permissions?supportsAllDrives=true&sendNotificationEmail=false', {
      method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'reader', type: 'anyone' })
    }).then(function (r) { return !!r.ok; }, function () { return false; });
  }
  root.HubDrivePick = { available: available, prepare: prepare, pick: pick, share: share };
})(typeof window !== 'undefined' ? window : globalThis);
