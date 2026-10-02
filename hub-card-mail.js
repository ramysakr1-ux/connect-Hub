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


  /* The film on its own (Ramy, 3 Oct 2026: "a card where I only send the
     film... and then I can say the phrase we had before"). Sent cold, before
     anyone holds a demo link, so it ends by offering one rather than assuming
     the reader already has three. No price, no doors, one button. */
  function filmDoc(letter, ctx) {
    var card = '<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; width:100%; background:' + C.surface + '; border-left:5px solid ' + C.gold + '; border-radius:8px;">'
      + '<tr><td style="padding:28px 30px 26px;">'
      + '<div style="margin:0 0 22px;"><span style="font-family:\'Instrument Serif\',Georgia,serif; font-style:italic; font-size:21px; color:' + C.gold + ';">Connect</span>'
      + '<span style="font-family:' + SANS + '; font-size:9px; font-weight:600; letter-spacing:0.24em; text-transform:uppercase; color:' + C.ink + '; margin-left:5px;">Lite</span></div>'
      + '<div style="font-family:' + SANS + '; font-size:10px; font-weight:700; letter-spacing:0.22em; text-transform:uppercase; color:' + C.grey + '; margin:0 0 6px;">A film, eight minutes</div>'
      + '<h1 style="font-family:' + SERIF + '; font-weight:700; font-size:25px; line-height:1.22; color:' + C.teal + '; margin:0 0 10px;">A CELTA course, from the link being sent to the final report</h1>'
      + '<p style="font-family:' + SANS + '; font-size:14.5px; line-height:1.65; color:' + C.ink + '; margin:0;">The whole of a course in one sitting: the same course run two ways, then the plans coming in, the feedback going back, the assignments marked, the assessor’s visit, and the reports at the end. Nothing in it is a mock-up — it is a real course being used.</p>'
      + (ctx.film
          ? '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0;"><tr><td align="center" bgcolor="' + C.teal + '" style="border-radius:26px;">'
            + '<a href="' + esc(ctx.film) + '" style="display:inline-block; padding:14px 34px; font-family:' + SANS + '; font-size:16px; font-weight:700; color:#ffffff; text-decoration:none;">Watch the film</a>'
            + '</td></tr></table>'
          : '')
      + '<p style="font-family:' + SANS + '; font-size:14px; line-height:1.65; color:' + C.ink + '; margin:24px 0 0; padding-top:18px; border-top:1px solid ' + C.line + ';">Centres and trainers: email me for a demo link. You get three real courses to walk around — as a tutor, as one of the candidates, as the assessor — and you can type in all of them.</p>'
      + '<div style="font-family:' + SANS + '; font-size:11px; color:' + C.grey + '; margin:18px 0 0; padding-top:14px; border-top:1px solid ' + C.line + ';">designed and built by <b>Ramy</b>' + (ctx.site ? ' · <a href="' + esc(ctx.site) + '" style="color:' + C.grey + ';">' + esc(ctx.site.replace(/^https?:\/\//, '').replace(/\/$/, '')) + '</a>' : '') + '</div>'
      + '</td></tr></table>';
    return '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Connect Lite — the film</title></head>'
      + '<body style="margin:0; padding:0; background:' + C.sand + ';">'
      + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:' + C.sand + ';"><tr><td align="center" style="padding:28px 14px;">'
      + letter + card
      + '</td></tr></table></body></html>';
  }


  /* The rates, as a block an email can carry: a centre that asked what it
     costs gets the answer in the message, not behind a link. */
  function rateRows() {
    var rows = [['One course', '\u00a3300', ''], ['Five courses', '\u00a31,250', '\u00a3250 each'],
                ['Ten courses', '\u00a32,200', '\u00a3220 each'], ['Twenty courses', '\u00a34,000', '\u00a3200 each']];
    return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:14px 0 0;">'
      + rows.map(function (r, i) {
          var top = i ? 'border-top:1px solid ' + C.line + ';' : '';
          return '<tr><td style="padding:8px 0; ' + top + ' font-family:' + SANS + '; font-size:14px; font-weight:600; color:' + C.ink + ';">' + r[0] + '</td>'
            + '<td align="right" style="padding:8px 0; ' + top + ' font-family:' + SANS + '; font-size:14px; font-weight:700; color:' + C.inkWarm + '; white-space:nowrap;">' + r[1]
            + (r[2] ? '<span style="display:block; font-weight:400; font-size:12px; color:' + C.grey + ';">' + r[2] + '</span>' : '') + '</td></tr>';
        }).join('')
      + '</table>';
  }

  /* The price on its own (Ramy, 3 Oct 2026: "someone emails me and asks for
     the price... I need a place for it to live in the console"). */
  function priceDoc(letter, ctx) {
    var card = '<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; width:100%; background:' + C.surface + '; border-left:5px solid ' + C.gold + '; border-radius:8px;">'
      + '<tr><td style="padding:28px 30px 26px;">'
      + '<div style="margin:0 0 22px;"><span style="font-family:\'Instrument Serif\',Georgia,serif; font-style:italic; font-size:21px; color:' + C.gold + ';">Connect</span>'
      + '<span style="font-family:' + SANS + '; font-size:9px; font-weight:600; letter-spacing:0.24em; text-transform:uppercase; color:' + C.ink + '; margin-left:5px;">Lite</span></div>'
      + '<div style="font-family:' + SANS + '; font-size:10px; font-weight:700; letter-spacing:0.22em; text-transform:uppercase; color:' + C.grey + '; margin:0 0 6px;">What it costs</div>'
      + '<h1 style="font-family:' + SERIF + '; font-weight:700; font-size:25px; line-height:1.22; color:' + C.teal + '; margin:0 0 10px;">One price, one course, everything in it</h1>'
      + '<p style="font-family:' + SANS + '; font-size:14.5px; line-height:1.65; color:' + C.ink + '; margin:0;">There is one thing to buy: a course. Every feature is in every course, and nothing is held back for a higher tier, because there isn\u2019t one.</p>'
      + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 0;"><tr><td style="background:' + C.box + '; border-radius:10px; padding:16px 18px;">'
      + '<div style="font-family:' + SERIF + '; font-weight:700; font-size:30px; color:' + C.inkWarm + '; line-height:1;">' + esc(ctx.price || '\u00a3300') + '</div>'
      + '<div style="font-family:' + SANS + '; font-size:13px; color:' + C.grey + '; margin-top:3px;">per course, paid once</div>'
      + '</td></tr></table>'
      + rateRows()
      + '<p style="font-family:' + SANS + '; font-size:13.5px; line-height:1.65; color:' + C.ink + '; margin:16px 0 0;"><b style="color:' + C.inkWarm + ';">Volunteer students are not counted.</b> However many come, their register, their own pages, the day-before reminders and the signed certificates are in the price.</p>'
      + '<p style="font-family:' + SANS + '; font-size:13.5px; line-height:1.65; color:' + C.ink + '; margin:16px 0 0;"><b style="color:' + C.inkWarm + ';">A course with one teaching practice group counts as half a course.</b> Six candidates or fewer is one group. Blocks do not expire, nothing recurs, and the length of a course \u2014 four weeks, five, or part-time over three months \u2014 makes no difference.</p>'
      + (ctx.site ? '<p style="font-family:' + SANS + '; font-size:13.5px; line-height:1.65; margin:14px 0 0;"><a href="' + esc(ctx.site) + 'price.html" style="color:' + C.teal + '; font-weight:700;">The rates in full</a>, to keep or print.</p>' : '')
      + '<div style="font-family:' + SANS + '; font-size:11px; color:' + C.grey + '; margin:18px 0 0; padding-top:14px; border-top:1px solid ' + C.line + ';">designed and built by <b>Ramy</b></div>'
      + '</td></tr></table>';
    return '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Connect Lite \u2014 what it costs</title></head>'
      + '<body style="margin:0; padding:0; background:' + C.sand + ';">'
      + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:' + C.sand + ';"><tr><td align="center" style="padding:28px 14px;">'
      + letter + card
      + '</td></tr></table></body></html>';
  }

  /* ctx: { note, film, price, doors, site, only, showPrice } */
  window.hubCardMail = function(ctx){
    var doors = (ctx.doors || []).map(function(d){ return door(d.label, d.note, d.href, 'Open'); }).join('');
    if (ctx.film) doors += door('The film', 'Eight minutes, start to finish — a course from the first plan to the certificates.', ctx.film, 'Watch');
    /* A quote on the link is the price; with none, the published figure and
       a way to the rates. showPrice:false leaves the money out altogether. */
    var price = '<div style="font-family:' + SERIF + '; font-size:24px; font-weight:700; color:' + C.inkWarm + '; line-height:1.1;">' + esc(ctx.price || '\u00a3300') + '</div>' +
      '<div style="font-family:' + SANS + '; font-size:13px; color:' + C.grey + '; margin:2px 0 0;">per course, paid once</div>' +
      (ctx.price ? '' : '<div style="font-family:' + SANS + '; font-size:13px; line-height:1.6; color:' + C.ink + '; margin:8px 0 0;">Less when you buy several, and a course with one teaching practice group counts as half.' +
        (ctx.site ? ' <a href="' + esc(ctx.site) + 'price.html" style="color:' + C.teal + '; font-weight:700;">The rates in full</a>.' : '') + '</div>');
    /* The letter (Ramy, 2 Oct 2026: "a nice message from me on top, with nice
       font, with my signature, and the card sitting underneath it"). His note,
       in the serif, signed; the card is the enclosure. No note, no letter. */
    var letter = ctx.note
      ? '<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; width:100%;"><tr><td style="padding:6px 8px 26px;">' +
          '<div style="font-family:' + SERIF + '; font-size:17px; line-height:1.7; color:' + C.ink + ';">' + paras(ctx.note) + '</div>' +
          '<div style="font-family:\'Instrument Serif\',Georgia,serif; font-style:italic; font-size:26px; color:' + C.inkWarm + '; margin:14px 0 0;">Ramy</div>' +
          '<div style="font-family:' + SANS + '; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:' + C.grey + '; margin:4px 0 0;">Connect Lite</div>' +
        '</td></tr></table>'
      : '';
    if (ctx.only === 'film') return filmDoc(letter, ctx);
    if (ctx.only === 'price') return priceDoc(letter, ctx);
    var html =
'<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Connect Lite — for your centre</title></head>' +
'<body style="margin:0; padding:0; background:' + C.sand + ';">' +
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:' + C.sand + ';"><tr><td align="center" style="padding:28px 14px;">' +
letter +
'<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; width:100%; background:' + C.surface + '; border-left:5px solid ' + C.gold + '; border-radius:8px;">' +
'<tr><td style="padding:28px 30px 26px;">' +

  // the mark, in type
  '<div style="margin:0 0 22px;"><span style="font-family:\'Instrument Serif\',Georgia,serif; font-style:italic; font-size:21px; color:' + C.gold + ';">Connect</span>' +
  '<span style="font-family:' + SANS + '; font-size:9px; font-weight:600; letter-spacing:0.24em; text-transform:uppercase; color:' + C.ink + '; margin-left:5px;">Lite</span></div>' +

  '<div style="font-family:' + SANS + '; font-size:10px; font-weight:700; letter-spacing:0.22em; text-transform:uppercase; color:' + C.grey + '; margin:0 0 6px;">For a CELTA centre</div>' +
  '<h1 style="font-family:' + SERIF + '; font-weight:700; font-size:26px; line-height:1.2; color:' + C.teal + '; margin:0 0 8px;">Everything your candidates write, and everything you write back</h1>' +
  '<p style="font-family:' + SANS + '; font-size:14.5px; line-height:1.65; color:' + C.ink + '; margin:0;">The assessed paperwork of a CELTA course in one place — plans, language analyses, self-evaluations, the four written assignments, your feedback, the grades and the reports. No accounts, no passwords, nothing to install. A course is three links: one for your tutors, one for each candidate, one for the assessor.</p>' +


  '<h2 style="font-family:' + SERIF + '; font-weight:600; font-size:17px; color:' + C.inkWarm + '; margin:24px 0 4px;">See it working</h2>' +
  '<p style="font-family:' + SANS + '; font-size:13px; line-height:1.6; color:' + C.grey + '; margin:0 0 4px;">Real courses, not screenshots. Each one opens as a tutor, as a candidate, as the assessor and as a volunteer student — type in them; nothing you do there touches anybody’s record.</p>' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ' + C.line + ';">' + doors + '</table>' +

  // the price
  (ctx.showPrice === false ? '' :
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0 0;"><tr><td style="background:' + C.box + '; border-radius:8px; padding:16px 18px;">' +
    price +
    '<div style="font-family:' + SANS + '; font-size:13px; line-height:1.6; color:' + C.ink + '; margin:10px 0 0;"><b style="color:' + C.inkWarm + ';">Per course, not per candidate.</b> One price covers the whole course — up to 24 trainees, all of their tutors and your course administrator. Nothing recurring, nothing per seat, and no charge for the assessor’s access.</div>' +
  '</td></tr></table>') +

  // sign-off, only when the card goes alone: the letter above signs otherwise
  (ctx.note ? '' :
  '<p style="font-family:' + SANS + '; font-size:14px; line-height:1.6; color:' + C.ink + '; margin:22px 0 0;">Any questions, just reply.</p>' +
  '<div style="font-family:\'Instrument Serif\',Georgia,serif; font-style:italic; font-size:21px; color:' + C.inkWarm + '; margin:10px 0 0;">Ramy</div>') +
  '<div style="font-family:' + SANS + '; font-size:11px; color:' + C.grey + '; margin:16px 0 0; padding-top:14px; border-top:1px solid ' + C.line + ';">designed and built by <b>Ramy</b>' + (ctx.site ? ' · <a href="' + esc(ctx.site) + '" style="color:' + C.grey + ';">' + esc(ctx.site.replace(/^https?:\/\//, '').replace(/\/$/, '')) + '</a>' : '') + '</div>' +

'</td></tr></table></td></tr></table></body></html>';
    return html;
  };
})();
