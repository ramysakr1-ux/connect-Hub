/* Connect Lite — the card AS an email (2 Oct 2026)
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * Ramy, 2 Oct 2026: "that email itself is just too crowded... I want the
 * email to be the card. The card explains everything, so they don't have to
 * read any of that." A mailto: can only carry plain text, so the console's
 * "Email it" used to hand the reader eight lines of prose and four links.
 * This builds the FRONT of the card (offer.html) as an HTML email instead:
 * the mark, the headline, his note, the three demo courses and the film as
 * doors, the price, his name. Each door opens that course's offer card, which
 * is where the tutor / candidate / assessor doors live. The store sends it
 * (op sendCard, v64) from lite@celtaconnect.com.
 *
 * Email HTML, so: tables, inline styles, hex colours (the tokens' oklch
 * values converted once, below), web-safe fallbacks for the card's faces.
 * No images and no SVG -- the mark is set in type so nothing has to load.
 */
(function(){
  var C = { sand:'#fdfbf7', surface:'#f5eee2', box:'#ede0cc', line:'#d6cec1', ink:'#241d16', inkWarm:'#3e2818',
            grey:'#6d655c', teal:'#0f4a4b', gold:'#ad7f43' };
  var SERIF = "'Newsreader',Georgia,'Times New Roman',serif", SANS = "'Karla',Helvetica,Arial,sans-serif";
  var esc = function(s){ return (s == null ? '' : String(s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };
  var paras = function(t){ return String(t || '').trim().split(/\n{2,}/).map(function(p){ return '<p style="margin:0 0 10px;">' + esc(p).replace(/\n/g, '<br>') + '</p>'; }).join(''); };

  function door(label, note, href, verb){
    return '<tr>' +
      '<td style="padding:13px 0; border-bottom:1px solid ' + C.line + '; vertical-align:top;">' +
        '<div style="font-family:' + SANS + '; font-size:14px; font-weight:700; color:' + C.inkWarm + '; margin:0 0 3px;">' + esc(label) + '</div>' +
        '<div style="font-family:' + SANS + '; font-size:13px; line-height:1.55; color:' + C.grey + ';">' + esc(note) + '</div>' +
      '</td>' +
      '<td style="padding:13px 0 13px 16px; border-bottom:1px solid ' + C.line + '; vertical-align:middle; white-space:nowrap;" align="right">' +
        '<a href="' + esc(href) + '" style="font-family:' + SANS + '; font-size:13px; font-weight:700; color:' + C.teal + '; text-decoration:none; border:1.5px solid ' + C.teal + '; border-radius:20px; padding:6px 14px; display:inline-block;">' + esc(verb) + '</a>' +
      '</td></tr>';
  }

  /* ctx: { note, film, price, doors:[{label, note, href}], site } */
  window.hubCardMail = function(ctx){
    var doors = (ctx.doors || []).map(function(d){ return door(d.label, d.note, d.href, 'Open'); }).join('');
    if (ctx.film) doors += door('The film', 'Eight minutes, start to finish — a course from the first plan to the certificates.', ctx.film, 'Watch');
    var price = ctx.price
      ? '<div style="font-family:' + SERIF + '; font-size:24px; font-weight:700; color:' + C.inkWarm + '; line-height:1.1;">' + esc(ctx.price) + '</div>' +
        '<div style="font-family:' + SANS + '; font-size:13px; color:' + C.grey + '; margin:2px 0 0;">per course, paid once</div>'
      : '<div style="font-family:' + SANS + '; font-size:13px; line-height:1.6; color:' + C.ink + ';">Ask me what it costs — reply to this and I will tell you the same day.</div>';
    var html =
'<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Connect Lite — for your centre</title></head>' +
'<body style="margin:0; padding:0; background:' + C.sand + ';">' +
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:' + C.sand + ';"><tr><td align="center" style="padding:28px 14px;">' +
'<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; width:100%; background:' + C.surface + '; border-left:5px solid ' + C.gold + '; border-radius:8px;">' +
'<tr><td style="padding:28px 30px 26px;">' +

  // the mark, in type
  '<div style="margin:0 0 22px;"><span style="font-family:\'Instrument Serif\',Georgia,serif; font-style:italic; font-size:21px; color:' + C.gold + ';">Connect</span>' +
  '<span style="font-family:' + SANS + '; font-size:9px; font-weight:600; letter-spacing:0.24em; text-transform:uppercase; color:' + C.ink + '; margin-left:5px;">Lite</span></div>' +

  '<div style="font-family:' + SANS + '; font-size:10px; font-weight:700; letter-spacing:0.22em; text-transform:uppercase; color:' + C.grey + '; margin:0 0 6px;">For a CELTA centre</div>' +
  '<h1 style="font-family:' + SERIF + '; font-weight:700; font-size:26px; line-height:1.2; color:' + C.teal + '; margin:0 0 8px;">Everything your candidates write, and everything you write back</h1>' +
  '<p style="font-family:' + SANS + '; font-size:14.5px; line-height:1.65; color:' + C.ink + '; margin:0;">The assessed paperwork of a CELTA course in one place — plans, language analyses, self-evaluations, the four written assignments, your feedback, the grades and the reports. No accounts, no passwords, nothing to install. A course is three links: one for your tutors, one for each candidate, one for the assessor.</p>' +

  // his note, in his hand
  (ctx.note ? '<div style="margin:22px 0 0; padding:16px 0 4px; border-top:1px solid ' + C.line + '; font-family:' + SERIF + '; font-size:15.5px; line-height:1.7; color:' + C.ink + ';">' + paras(ctx.note) + '</div>' : '') +

  '<h2 style="font-family:' + SERIF + '; font-weight:600; font-size:17px; color:' + C.inkWarm + '; margin:24px 0 4px;">See it working</h2>' +
  '<p style="font-family:' + SANS + '; font-size:13px; line-height:1.6; color:' + C.grey + '; margin:0 0 4px;">Real courses, not screenshots. Each one opens as a tutor, as a candidate, as the assessor and as a volunteer student — type in them; nothing you do there touches anybody’s record.</p>' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ' + C.line + ';">' + doors + '</table>' +

  // the price
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0 0;"><tr><td style="background:' + C.box + '; border-radius:8px; padding:16px 18px;">' +
    price +
    '<div style="font-family:' + SANS + '; font-size:13px; line-height:1.6; color:' + C.ink + '; margin:10px 0 0;"><b style="color:' + C.inkWarm + ';">Per course, not per candidate.</b> One price covers the whole course — up to 24 trainees, all of their tutors and your course administrator. Nothing recurring, nothing per seat, and no charge for the assessor’s access.</div>' +
  '</td></tr></table>' +

  // sign-off
  '<p style="font-family:' + SANS + '; font-size:14px; line-height:1.6; color:' + C.ink + '; margin:22px 0 0;">Any questions, just reply.</p>' +
  '<div style="font-family:\'Instrument Serif\',Georgia,serif; font-style:italic; font-size:21px; color:' + C.inkWarm + '; margin:10px 0 0;">Ramy</div>' +
  '<div style="font-family:' + SANS + '; font-size:11px; color:' + C.grey + '; margin:16px 0 0; padding-top:14px; border-top:1px solid ' + C.line + ';">designed and built by <b>Ramy</b>' + (ctx.site ? ' · <a href="' + esc(ctx.site) + '" style="color:' + C.grey + ';">' + esc(ctx.site.replace(/^https?:\/\//, '').replace(/\/$/, '')) + '</a>' : '') + '</div>' +

'</td></tr></table></td></tr></table></body></html>';
    return html;
  };
})();
