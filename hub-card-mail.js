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
 * is where the tutor / trainee / assessor doors live. The store sends it
 * (op sendCard, v64) from lite@celtaconnect.com.
 *
 * Email HTML, so: tables, inline styles, hex colors (the tokens' oklch
 * values converted once, below), web-safe fallbacks for the card's faces.
 * No images and no SVG -- the mark is set in type so nothing has to load.
 */
(function(){
  var C = { sand:'#f3f3f7', surface:'#ebebf0', box:'#e3e6ea', line:'#d9d9e0', ink:'#232220', inkWarm:'#232220',
            grey:'#5b5f6b', teal:'#1e3b2f', gold:'#a8803f',
            /* the welcome family (1a, the link cards, 7 Oct 2026) */
            tealDeep:'#1e3b2f', goldWash:'#f7f1dd', amber:'#c99a2e', goldDeep:'#7a5a1f', paper:'#ffffff',
            onTealGold:'#cc9140', onTealMeta:'#e3e6ea' };
  var MAIL = 'lite@celtaconnect.com';
  /* The tile, as an image: an email cannot draw the mark, and the brand is
     always there (Ramy, 8 Oct 2026). The published icon, from the live site
     whatever page built the mail, with the word as its alt text so a client
     that blocks images still says whose it is. */
  var ICON = 'https://lite.celtaconnect.com/brand/icon-192.png';
  function tile(px){ return '<img src="' + ICON + '" width="' + px + '" height="' + px + '" alt="Connect" style="display:inline-block; vertical-align:middle; border:0; border-radius:' + Math.round(px * 0.22) + 'px;">'; }
  var SERIF = "'Newsreader',Georgia,'Times New Roman',serif", SANS = "'Karla',Helvetica,Arial,sans-serif";
  var esc = function(s){ return (s == null ? '' : String(s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };
  var paras = function(t){ return String(t || '').trim().split(/\n{2,}/).map(function(p){ return '<p style="margin:0 0 10px;">' + esc(p).replace(/\n/g, '<br>') + '</p>'; }).join(''); };

  var STYLE = 'welcome';   // set per call from ctx.cardStyle: 'welcome' (1a) or 'ticket' (1b)
  function button(href, verb, small){
    return STYLE === 'ticket'
      ? '<a href="' + esc(href) + '" style="font-family:' + SANS + '; font-size:' + (small ? '11.5' : '12.5') + 'px; font-weight:700; color:' + C.paper + '; text-decoration:none; background:' + C.tealDeep + '; border-radius:8px; padding:' + (small ? '5px 11px' : '7px 14px') + '; display:inline-block;">' + esc(verb) + '</a>'
      : '<a href="' + esc(href) + '" style="font-family:' + SANS + '; font-size:' + (small ? '12' : '13') + 'px; font-weight:700; color:' + C.teal + '; text-decoration:none; border:1.5px solid ' + C.teal + '; border-radius:20px; padding:' + (small ? '4px 12px' : '6px 14px') + '; display:inline-block;">' + esc(verb) + '</a>';
  }
  /* A door is a row; a door with picks (the three trainees, 25 Oct 2026) is the row and three quiet
     rows under it, each with its own Open, as the card on the web has them. */
  function door(label, note, href, verb, picks){
    var rule = '1px ' + (STYLE === 'ticket' ? 'dashed ' : 'solid ') + C.line;
    var last = !(picks && picks.length);
    var out = '<tr>' +
      '<td style="padding:13px 0 ' + (last ? '13px' : '4px') + '; ' + (last ? 'border-bottom:' + rule + '; ' : '') + 'vertical-align:top;">' +
        '<div style="font-family:' + SANS + '; font-size:14px; font-weight:700; color:' + C.inkWarm + '; margin:0 0 3px;">' + esc(label) + '</div>' +
        '<div style="font-family:' + SANS + '; font-size:13px; line-height:1.55; color:' + C.grey + ';">' + esc(note) + '</div>' +
      '</td>' +
      '<td style="padding:13px 0 ' + (last ? '13px' : '4px') + ' 16px; ' + (last ? 'border-bottom:' + rule + '; ' : '') + 'vertical-align:middle; white-space:nowrap;" align="right">' + (href ? button(href, verb) : '') +
      '</td></tr>';
    (picks || []).forEach(function (p, i) {
      var end = i === picks.length - 1;
      out += '<tr>' +
        '<td style="padding:6px 0 ' + (end ? '13px' : '6px') + ' 14px; ' + (end ? 'border-bottom:' + rule + '; ' : '') + 'vertical-align:middle;">' +
          '<span style="font-family:' + SANS + '; font-size:13px; font-weight:700; color:' + C.inkWarm + ';">' + esc(p.name) + '</span> ' +
          '<span style="font-family:' + SANS + '; font-size:12.5px; color:' + C.grey + ';">' + esc(p.line) + '</span></td>' +
        '<td style="padding:6px 0 ' + (end ? '13px' : '6px') + ' 16px; ' + (end ? 'border-bottom:' + rule + '; ' : '') + 'vertical-align:middle; white-space:nowrap;" align="right">' + button(p.href, 'Open', true) + '</td></tr>';
    });
    return out;
  }


  /* THE WELCOME FAMILY in email (1a, Ramy's pick 7 Oct 2026). The web card's
     teal panel becomes a <td bgcolor>, with no mark at all -- an email client
     drops the SVG and a mark set in type would be a smudge on teal -- then the
     paper sheet underneath. Every document this file makes wears it. */
  function frame(chip, headline, sub, sheet){
    return '<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; width:100%; background:' + C.paper + '; border-radius:18px; border-collapse:separate; overflow:hidden;">'
      + '<tr><td bgcolor="' + C.tealDeep + '" style="background:' + C.tealDeep + '; padding:26px 30px 30px; border-radius:18px 18px 0 0;">'
      +   '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;"><tr>'
      +     '<td style="vertical-align:middle;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="vertical-align:middle;">' + tile(28) + '</td>'
      +     '<td style="vertical-align:middle; padding-left:9px;"><div style="font-family:\'Instrument Serif\',Georgia,serif; font-style:italic; font-size:21px; line-height:1; color:' + C.onTealGold + ';">Connect<span style="font-family:' + SANS + '; font-style:normal; font-size:8px; font-weight:600; line-height:1; letter-spacing:0.24em; text-transform:uppercase; color:' + C.paper + '; margin-left:4px;">Lite</span></div></td></tr></table></td>'
      +     '<td align="right" style="vertical-align:middle;"><span style="font-family:' + SANS + '; font-size:10px; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; color:' + C.onTealGold + '; border:1px solid ' + C.onTealGold + '; border-radius:999px; padding:4px 10px; white-space:nowrap;">' + esc(chip) + '</span></td>'
      +   '</tr></table>'
      +   '<h1 style="font-family:' + SERIF + '; font-weight:700; font-size:28px; line-height:1.12; color:' + C.paper + '; margin:0;">' + esc(headline) + '</h1>'
      +   (sub ? '<p style="font-family:' + SANS + '; font-size:14px; line-height:1.6; color:' + C.onTealMeta + '; margin:12px 0 0;">' + esc(sub) + '</p>' : '')
      + '</td></tr>'
      + '<tr><td style="padding:20px 30px 24px;">' + sheet + '</td></tr>'
      + '</table>';
  }
  /* THE TICKET in email (1b, 8 Oct 2026). No seal and no perforation -- an
     email client keeps neither -- so the face is paper under a 6px gold edge
     and the stub is set off by a dashed line. */
  function frameTicket(chip, headline, sub, face, stub){
    return '<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; width:100%; background:' + C.paper + '; border-radius:16px; border-collapse:separate; overflow:hidden;">'
      + '<tr><td style="background:' + C.paper + '; border-top:6px solid ' + C.gold + '; padding:24px 30px 22px; border-radius:16px 16px 0 0;">'
      +   '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;"><tr>'
      +     '<td style="vertical-align:middle;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="vertical-align:middle;">' + tile(28) + '</td>'
      +     '<td style="vertical-align:middle; padding-left:9px;"><div style="font-family:\'Instrument Serif\',Georgia,serif; font-style:italic; font-size:21px; line-height:1; color:' + C.gold + ';">Connect<span style="font-family:' + SANS + '; font-style:normal; font-size:8px; font-weight:600; line-height:1; letter-spacing:0.24em; text-transform:uppercase; color:' + C.ink + '; margin-left:4px;">Lite</span></div></td></tr></table></td>'
      +     '<td align="right" style="vertical-align:middle; font-family:' + SANS + '; font-size:10px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:' + C.grey + '; white-space:nowrap;">' + esc(chip) + '</td>'
      +   '</tr></table>'
      +   '<h1 style="font-family:' + SERIF + '; font-weight:700; font-size:25px; line-height:1.15; color:' + C.tealDeep + '; margin:0;">' + esc(headline) + '</h1>'
      +   (sub ? '<p style="font-family:' + SANS + '; font-size:14px; line-height:1.6; color:' + C.grey + '; margin:10px 0 18px;">' + esc(sub) + '</p>' : '<div style="height:16px; line-height:16px;">&nbsp;</div>')
      +   face
      + '</td></tr>'
      + '<tr><td bgcolor="' + C.surface + '" style="background:' + C.surface + '; border-top:2px dashed ' + C.line + '; padding:16px 30px 22px; border-radius:0 0 16px 16px;">' + stub + '</td></tr>'
      + '</table>';
  }
  /* One call for both frames: the welcome card puts everything on its sheet;
     the ticket puts what the stub carries under the dashed line. */
  function wrap(ctx, chip, headline, sub, sheet, stub){
    return STYLE === 'ticket'
      ? frameTicket(chip, headline, sub, sheet, stub + credit(ctx).replace('margin:16px 0 0; padding-top:14px; border-top:1px solid ' + C.line + ';', 'margin:14px 0 0;'))
      : frame(chip, headline, sub, sheet + stub + credit(ctx));
  }
  function contact(lead){
    return '<p style="font-family:' + SANS + '; font-size:13.5px; line-height:1.6; color:' + C.ink + '; margin:18px 0 0;">' + esc(lead) + ' <a href="mailto:' + MAIL + '" style="color:' + C.teal + '; font-weight:700; text-decoration:none;">' + MAIL + '</a></p>';
  }
  function credit(ctx){
    /* the price card carries no name (Ramy, 24 Oct 2026: "just remove my credit") */
    if (ctx.only === 'price') return '';
    return '<div style="font-family:' + SANS + '; font-size:11px; color:#8a6534; margin:16px 0 0; padding-top:14px; border-top:1px solid ' + C.line + ';">' + tile(16)
      /* never a link, and nothing beside the name (the credit rule, 19 Oct 2026; the site link went 25 Oct) */
      + '<span style="vertical-align:middle; margin-left:7px;">designed and built by <b style="color:' + C.gold + ';">Ramy</b></span></div>';
  }
  function page(title, letter, card){
    return '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>' + esc(title) + '</title></head>'
      + '<body style="margin:0; padding:0; background:' + C.sand + ';">'
      + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:' + C.sand + ';"><tr><td align="center" style="padding:28px 14px;">'
      + letter + card
      + '</td></tr></table></body></html>';
  }

  /* The film on its own (Ramy, 3 Oct 2026: "a card where I only send the
     film... and then I can say the phrase we had before"). Sent cold, before
     anyone holds a demo link, so it ends by offering one rather than assuming
     the reader already has three. No price, no doors, one button. */
  /* A Watch the film link starts the film: the film page reads #play (Ramy, 25 Oct 2026). */
  function playLink(u) { u = String(u || ''); return u && u.indexOf('#') < 0 ? u + '#play' : u; }
  function filmDoc(letter, ctx) {
    var sheet = '<p style="font-family:' + SANS + '; font-size:14.5px; line-height:1.65; color:' + C.ink + '; margin:0;">The timetable built, the TP points dealt, plans in and feedback back, the assignments marked, the assessor’s visit and the final grades. Nothing in it is a mock-up: it is Lite, being used.</p>'
      + (ctx.film
          ? '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0 0;"><tr><td align="center" bgcolor="' + C.teal + '" style="border-radius:26px;">'
            + '<a href="' + esc(playLink(ctx.film)) + '" style="display:inline-block; padding:14px 34px; font-family:' + SANS + '; font-size:16px; font-weight:700; color:#ffffff; text-decoration:none;">Watch the film</a>'
            + '</td></tr></table>'
          : '')
      ;
    var ask = '<p style="font-family:' + SANS + '; font-size:14px; line-height:1.65; color:' + C.ink + '; margin:' + (STYLE === 'ticket' ? '0' : '22px 0 0; padding-top:16px; border-top:1px solid ' + C.line) + ';">Centers and trainers: email <a href="mailto:' + MAIL + '" style="color:' + C.teal + '; font-weight:700; text-decoration:none;">' + MAIL + '</a> for the rates and a demo link. You get a real course, two weeks in, to walk around as a tutor, a trainee, an assessor or a volunteer student, and you can type in all of it.</p>';
    return page('Connect Lite — the film', letter, wrap(ctx, 'A short film', 'A CELTA course, start to finish', '', sheet, ask));
  }


  /* The rates, as a block an email can carry: a center that asked what it
     costs gets the answer in the message, not behind a link. NO FIGURE LIVES
     IN THIS FILE (Ramy, 7 Oct 2026: the rates are not public, and the code
     is): the console passes the four package totals it keeps in the owner's
     browser, and each "each" is worked out from its total, so the headline,
     the table and the per-course prices can never disagree. */
  function money(n){ return '\u00a3' + Math.round(n).toLocaleString('en-GB'); }
  function rateRows(rates) {
    return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:14px 0 0;">'
      + rates.map(function (r, i) {
          var top = i ? 'border-top:1px solid ' + C.line + ';' : '';
          var each = r.n > 1 ? money(r.total / r.n) + ' each' : '';
          return '<tr><td style="padding:8px 0; ' + top + ' font-family:' + SANS + '; font-size:14px; font-weight:600; color:' + C.ink + ';">' + esc(r.label)
            + (r.note ? '<span style="display:block; font-weight:400; font-size:12px; color:' + C.grey + ';">' + esc(r.note) + '</span>' : '') + '</td>'
            + '<td align="right" style="padding:8px 0; ' + top + ' font-family:' + SANS + '; font-size:14px; font-weight:700; color:' + C.inkWarm + '; white-space:nowrap;">' + money(r.total)
            + (each ? '<span style="display:block; font-weight:400; font-size:12px; color:' + C.grey + ';">' + each + '</span>' : '') + '</td></tr>';
        }).join('')
      + '</table>';
  }

  /* The price on its own (Ramy, 3 Oct 2026: "someone emails me and asks for
     the price... I need a place for it to live in the console"). */
  /* The ONLY place a figure appears (Ramy, 7 Oct 2026: no price on the
     cards; the rates come by email). Sent when someone asks. */
  function priceDoc(letter, ctx) {
    var rates = (ctx.rates || []).filter(function (r) { return r && r.total > 0 && r.n > 0; });
    /* "From £120 a course" (Ramy, 8 Oct 2026: "we can always advertise this
       as starts from a hundred and twenty pounds"). A course with one teaching
       practice group counts as half, so its price is half the one-course
       figure -- worked out, never typed, so it cannot drift from it. */
    var small = rates.length ? rates[0].total / 2 : 0;
    var table = rates.length ? [{ label: 'One small course', note: 'one teaching practice group', n: 1, total: small }].concat(rates) : [];
    /* WHAT IT DOES FOR THEM, then WHAT THE MONEY BUYS (Ramy, 24 Oct 2026: "they still
       don't know what the platform actually does ... smart timetable, smart assignment,
       smart tracking"; "we're just telling them what their money is going to buy them"). */
    var h = function(t){ return '<h3 style="font-family:' + SERIF + '; font-weight:700; font-size:17px; color:' + C.inkWarm + '; margin:22px 0 6px;">' + t + '</h3>'; };
    var li = function(b, t){ return '<li style="margin:0 0 7px;"><b style="color:' + C.inkWarm + ';">' + b + '</b> ' + t + '</li>'; };
    var ul = function(items){ return '<ul style="font-family:' + SANS + '; font-size:13.5px; line-height:1.6; color:' + C.ink + '; margin:0; padding-left:18px;">' + items.join('') + '</ul>'; };
    var does = h('What it does for you')
      + '<p style="font-family:' + SANS + '; font-size:13.5px; line-height:1.6; color:' + C.ink + '; margin:0 0 8px;">Less copying, less chasing, more time in the room.</p>'
      + ul([
          li('Smart timetable.', 'Build it in a minute, or read it from your spreadsheet. Everyone sees their own day.'),
          li('Smart assignments.', 'Write a plan once, and it carries into the feedback, the tracker and the assessor\u2019s pack. Deadlines and marking are in one place.'),
          li('Smart tracking.', 'Every trainee\u2019s teaching, assignments and standing on one screen, so you see who needs you first.'),
          li('Less paperwork.', 'The CELTA 5 is signed on screen and prints as Cambridge\u2019s booklet.')
        ]);
    var buys = h('What your money buys')
      + ul([
          li('The platform,', 'for every tutor, trainee and the course admin.'),
          li('The assessor\u2019s link,', 'read-only.'),
          li('A page for every volunteer student', 'on the register.'),
          li('The four written assignments,', 'and Assignment 5, the plagiarism reflection.'),
          li('The observation tasks:', 'peer, filmed and live.'),
          li('TP points', 'for every book you teach from.'),
          li('Interactive input sessions,', 'with their videos.'),
          li('A timetable where everyone sees their own day,', 'with the course\u2019s clock and your own time beside it.'),
          li('The CELTA 5, the grades report and the course record.', '')
        ]);
    var sheet = '<p style="font-family:' + SANS + '; font-size:14.5px; line-height:1.65; color:' + C.ink + '; margin:0;">There is one thing to buy: a course. Every feature is in every course, and nothing is held back for a higher tier, because there isn\u2019t one.</p>'
      + does
      + (rates.length
          ? '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 0;"><tr><td style="background:' + C.goldWash + '; border:1px solid ' + C.amber + '; border-radius:12px; padding:16px 18px;">'
            + '<div style="font-family:' + SERIF + '; font-weight:700; font-size:30px; color:' + C.inkWarm + '; line-height:1;"><span style="font-size:18px; font-weight:600;">From </span>' + money(small) + '</div>'
            + '<div style="font-family:' + SANS + '; font-size:13px; color:' + C.grey + '; margin-top:3px;">a course, paid once \u00b7 ' + money(rates[0].total) + ' for a full course</div>'
            + '</td></tr></table>'
            + rateRows(table)
          : '')
      + buys
      + '<p style="font-family:' + SANS + '; font-size:13.5px; line-height:1.65; color:' + C.ink + '; margin:16px 0 0;"><b style="color:' + C.inkWarm + ';">Volunteer students are not counted.</b> However many come, their register, their own pages, the day-before reminders and the signed certificates are in the price.</p>'
      + '<p style="font-family:' + SANS + '; font-size:13.5px; line-height:1.65; color:' + C.ink + '; margin:16px 0 0;"><b style="color:' + C.inkWarm + ';">A course with one teaching practice group counts as half a course.</b> Six trainees or fewer is one group. Blocks do not expire, nothing recurs, and the length of a course \u2014 four weeks, five, or part-time over three months \u2014 makes no difference.</p>'
      /* No "rates in full" link: the rates page came down (Ramy, 7 Oct 2026:
         the rates are not public). This email IS the rates. */
      ;
    return page('Connect Lite \u2014 what it costs', letter, wrap(ctx, 'What it costs', 'One price, one course, everything in it', '', sheet, STYLE === 'ticket' ? contact('Questions:').replace('margin:18px 0 0;', 'margin:0;') : contact('Questions:')));
  }

  /* ctx: { note, film, doors, tutorDoor, moment, only, rates, cardStyle } -- rates are
     read by priceDoc only; the full card carries no figure (7 Oct 2026). */
  window.hubCardMail = function(ctx){
    STYLE = ctx.cardStyle === 'ticket' ? 'ticket' : 'welcome';
    var doors = (ctx.doors || []).map(function(d){ return door(d.label, d.note, d.href, 'Open', d.picks); }).join('');
    if (ctx.film) doors += door('The film', 'A whole course, start to finish, in three minutes.', playLink(ctx.film), 'Watch');
    /* The letter (Ramy, 2 Oct 2026: "a nice message from me on top, with nice
       font, with my signature, and the card sitting underneath it"). His note,
       in the serif, signed; the card is the enclosure. No note, no letter. */
    var letter = ctx.note
      ? '<table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; width:100%;"><tr><td style="padding:6px 8px 26px;">' +
          '<div style="font-family:' + SERIF + '; font-size:17px; line-height:1.7; color:' + C.ink + ';">' + paras(ctx.note) + '</div>' +
          '<div style="font-family:\'Instrument Serif\',Georgia,serif; font-style:italic; font-size:26px; color:' + C.inkWarm + '; margin:14px 0 0;">Ramy</div>' +
          /* no lockup under the signature (Ramy, 25 Oct 2026): the card's own bar carries it */
        '</td></tr></table>'
      : '';
    if (ctx.only === 'film') return filmDoc(letter, ctx);
    if (ctx.only === 'price') return priceDoc(letter, ctx);
    var li = function(t){ return '<li style="margin:0 0 3px;">' + esc(t) + '</li>'; };
    var h2 = function(t, top){ return '<h2 style="font-family:' + SERIF + '; font-weight:600; font-size:17px; color:' + C.inkWarm + '; margin:' + (top || 0) + ' 0 4px;">' + esc(t) + '</h2>'; };
    /* THE FOUR QUESTIONS, as the card asks and answers them (offer.html, Ramy, 25 Oct 2026). An email
       cannot fold, so each answer sits under its question. */
    var QA = [
      ['Can we use our own course files?', 'Yes. The timetable, assignments, observation tasks and input sessions can all be yours. Build the timetable in Lite or read it from your spreadsheet. Link files on your Drive or upload them.'],
      ['Do people need accounts?', 'No. Everyone has their own link, which works until the course ends. Turn on PINs and each person sets one the first time. If a tutor link gets out, course admin replaces it in one click and the old copies stop working.'],
      ['Can we take it all away?', 'Yes. One button prints every trainee\u2019s full record: each teaching practice with its plan, language analysis and self-evaluation, and every marked assignment. The grades report, the assessor\u2019s pack and the end-of-course reports print separately. Nothing is deleted on a timer.'],
      ['Does it check for plagiarism?', 'Yes. At the press of a button, Lite checks an assignment against other work across Lite courses and against the web, and for paraphrase.']
    ];
    var questions = h2('Questions before you try it') + QA.map(function (q, i) {
      return '<div style="padding:9px 0; ' + (i ? 'border-top:1px solid ' + C.line + ';' : '') + '">' +
        '<div style="font-family:' + SANS + '; font-size:14px; font-weight:700; color:' + C.inkWarm + '; margin:0 0 3px;">' + esc(q[0]) + '</div>' +
        '<div style="font-family:' + SANS + '; font-size:13px; line-height:1.55; color:' + C.grey + ';">' + esc(q[1]) + '</div></div>';
    }).join('');
    var tutorDoor = ctx.tutorDoor && ctx.tutorDoor.href
      ? '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0 0;"><tr>' +
        '<td style="vertical-align:middle;"><div style="font-family:' + SANS + '; font-size:13px; line-height:1.55; color:' + C.grey + ';">' + esc(ctx.tutorDoor.note) + '</div></td>' +
        '<td style="vertical-align:middle; padding-left:16px; white-space:nowrap;" align="right">' + button(ctx.tutorDoor.href, 'Open the course as a tutor') + '</td></tr></table>'
      : '';
    var sheet =
      questions +
      h2('See it working', '22px') +
      '<p style="font-family:' + SANS + '; font-size:13px; line-height:1.6; color:' + C.grey + '; margin:0 0 4px;">A real course, two weeks in. Type in it. Nothing touches anybody\u2019s record.</p>' +
      (ctx.moment ? '<p style="font-family:' + SANS + '; font-size:13px; line-height:1.6; color:' + C.grey + '; margin:0 0 4px;">' + esc(ctx.moment) + '</p>' : '') +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px ' + (STYLE === 'ticket' ? 'dashed ' : 'solid ') + C.line + '; margin-top:' + (STYLE === 'ticket' ? '14px' : '0') + ';">' + doors + '</table>' +
      /* How it is priced, never what (Ramy, 7 Oct 2026). On the ticket it goes
         on the stub instead (below). */
      (STYLE === 'ticket' ? '' : '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0 0;"><tr><td style="background:' + C.goldWash + '; border:1px solid ' + C.amber + '; border-radius:12px; padding:16px 18px;">' +
        '<div style="font-family:' + SERIF + '; font-size:20px; font-weight:700; color:' + C.inkWarm + '; line-height:1.2; margin:0 0 6px;">Priced per course, not per trainee</div>' +
        '<ul style="margin:0; padding-left:18px; font-family:' + SANS + '; font-size:13px; line-height:1.6; color:' + C.ink + ';">' +
          li('Every feature in every course. The more courses you take, the less each one costs.') +
          li('Duplicate a finished course and run it again.') +
          li('Up to 24 trainees, all their tutors and your course admin. Volunteer students and the assessor are never counted.') +
        '</ul>' +
      '</td></tr></table>') +
      /* the tutor's door comes last, under the price, as on the card (25 Oct 2026) */
      tutorDoor +
      // sign-off, only when the card goes alone: the letter above signs otherwise
      (ctx.note ? '' : '<div style="font-family:\'Instrument Serif\',Georgia,serif; font-style:italic; font-size:24px; color:' + C.inkWarm + '; margin:18px 0 0;">Ramy</div>');
    var stub = STYLE === 'ticket'
      ? '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>'
        + '<td style="vertical-align:bottom;"><div style="font-family:' + SERIF + '; font-weight:700; font-size:21px; color:' + C.inkWarm + '; line-height:1.2;">Per course, not per trainee</div>'
        + '<div style="font-family:' + SANS + '; font-size:12.5px; line-height:1.5; color:' + C.grey + '; margin-top:3px;">The more courses, the less each costs.<br>Duplicate one and run it again.</div></td>'
        + '<td align="right" style="vertical-align:bottom; padding-left:16px; white-space:nowrap;"><a href="mailto:' + MAIL + '" style="font-family:' + SANS + '; font-size:12px; font-weight:600; color:' + C.goldDeep + '; text-decoration:none;">' + MAIL + '</a></td>'
        + '</tr></table>'
      : contact('For the rates and demo links:');
    var html = page('Connect Lite — for your center', letter,
      wrap(ctx, 'For a CELTA center', 'Teach the course. Lite does the rest.',
        /* what it is, then the old line (Ramy, 24 Oct 2026) */
        'Connect Lite is the app a CELTA course runs on, from the first plan to the final grade. Every trainee gets a course of their own. Every tutor gets their evenings back. Built on Cambridge\u2019s handbook, made by a CELTA tutor, and simple enough for anyone.', sheet, stub));
    return html;
  };
})();
