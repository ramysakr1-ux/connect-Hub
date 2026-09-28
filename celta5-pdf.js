/* Connect Lite — Cambridge's CELTA 5 booklet, drawn in the browser.
 * © 2026 Ramy Sakr. All rights reserved.
 *
 * A port of Connect's src/lib/celta5-replica-pdf (engine.ts, index.ts and the
 * thirteen page modules) from the server to the browser. Every coordinate
 * below was measured off the real July 2023 master PDF with PyMuPDF
 * (top-left origin, "fitz" space) and is copied unchanged; the only things
 * that differ from Connect are the runtime (pdf-lib + fontkit as UMD scripts
 * instead of Node modules) and where the bytes come from (the store hands the
 * master and the two fonts over from the owner's Drive; they are never on the
 * public site, because the master is Cambridge's copyrighted document).
 *
 * Produces a visually identical copy of Cambridge's booklet -- the master's
 * own pages, unchanged, with the candidate's record drawn on top at the
 * form's own positions. Cambridge requires the CELTA 5 a candidate submits
 * to be an unaltered copy of their document; this is why the screen's own
 * printed booklet was never enough.
 *
 * window.hubCelta5Pdf.render(input, assets) -> Promise<Uint8Array>
 *   input:  the same shape Connect's renderCelta5ReplicaBuffer takes
 *   assets: { master: Uint8Array, regular: Uint8Array, bold: Uint8Array }
 */
(function(){
  'use strict';
  const { PDFDocument, rgb } = window.PDFLib || {};

  // ---- engine ----------------------------------------------------------
  const fitzY = (page, y, adj) => page.getHeight() - y + (adj === undefined ? 2.2 : adj);
  function drawAt(page, font, text, x, y1, size, opts){
    if (!text) return; size = size || 10.5;
    let drawX = x;
    if (opts && opts.align === 'center' && opts.xMid !== undefined) drawX = opts.xMid - font.widthOfTextAtSize(text, size) / 2;
    page.drawText(text, { x: drawX, y: fitzY(page, y1), size, font, color: rgb(0, 0, 0) });
  }
  /* A typed name has no natural length; every signature line on the form sits
     in a fixed gap. Shrink to fit, then ellipsis (Ramy, 27 Aug 2026: "the
     writing doesn't wrap around, so it went outside the page border"). */
  function drawSignature(page, font, text, x, y1, maxWidth, size, minSize){
    if (!text) return; size = size || 10.5; minSize = minSize || 7;
    let fit = size; while (fit > minSize && font.widthOfTextAtSize(text, fit) > maxWidth) fit -= 0.5;
    let t = text;
    if (font.widthOfTextAtSize(t, fit) > maxWidth) { while (t.length > 1 && font.widthOfTextAtSize(t + '...', fit) > maxWidth) t = t.slice(0, -1); t += '...'; }
    page.drawText(t, { x, y: fitzY(page, y1), size: fit, font, color: rgb(0, 0, 0) });
  }
  /* Ramy, 28 Sep 2026: the drawn signature. The ink is an SVG path in
     hub-ink's 300 x 100 box; it is scaled to sit on the signature line, and
     the typed name follows it in small print so the form still reads. */
  const INK_H = 30;
  function drawInk(page, ink, x, y1, maxWidth){
    const scale = INK_H / 100, w = 300 * scale;
    if (w > maxWidth) return 0;
    const cap = (window.PDFLib && window.PDFLib.LineCapStyle) ? window.PDFLib.LineCapStyle.Round : undefined;
    page.drawSvgPath(ink, { x, y: fitzY(page, y1 - INK_H + 6, 0), scale, borderColor: rgb(0.1, 0.08, 0.06), borderWidth: 1.25 / scale, borderLineCap: cap });
    return w;
  }
  function drawSigned(page, font, name, ink, x, y1, maxWidth){
    if (ink) { const w = drawInk(page, ink, x, y1, maxWidth); if (w) { drawSignature(page, font, name, x + w + 8, y1, maxWidth - w - 8, 6.5, 5); return; } }
    drawSignature(page, font, name, x, y1, maxWidth);
  }
  function drawCellGrid(page, font, value, xMids, y1, size){
    const chars = String(value || '').split('');
    xMids.forEach((xMid, i) => { if (chars[i]) drawAt(page, font, chars[i], 0, y1, size || 12, { align: 'center', xMid }); });
  }
  function drawCheck(page, font, box){
    const [x0, y0, x1, y1] = box; const xMid = (x0 + x1) / 2, yMid = (y0 + y1) / 2; const size = Math.min(x1 - x0, y1 - y0) * 0.8;
    drawAt(page, font, 'X', 0, yMid + size / 2.6, size, { align: 'center', xMid });
  }
  function drawWrapped(page, font, paragraphs, box, size, lineHeight){
    size = size || 9.5; lineHeight = lineHeight || 12;
    const maxWidth = box.x1 - box.x0; let cursorY = box.y0;
    for (const paragraph of paragraphs) {
      const words = String(paragraph).split(/\s+/).filter(Boolean); let line = '';
      for (const word of words) {
        const cand = line ? line + ' ' + word : word;
        if (font.widthOfTextAtSize(cand, size) > maxWidth && line) {
          if (cursorY + lineHeight > box.y1) return;
          drawAt(page, font, line, box.x0, cursorY, size); cursorY += lineHeight; line = word;
        } else line = cand;
      }
      if (line) { if (cursorY + lineHeight > box.y1) return; drawAt(page, font, line, box.x0, cursorY, size); cursorY += lineHeight; }
      cursorY += lineHeight * 0.4;
    }
  }
  function drawOvalAround(page, box){
    page.drawEllipse({ x: (box.x0 + box.x1) / 2, y: fitzY(page, (box.y0 + box.y1) / 2, 0), xScale: (box.x1 - box.x0) / 2 + 10, yScale: (box.y1 - box.y0) / 2 + 9, borderColor: rgb(0, 0, 0), borderWidth: 1.1 });
  }
  const copiesNeeded = (n, per) => Math.max(1, Math.ceil(n / per));
  function buildPageList(total, repeat){
    const list = [], start = new Map();
    for (let i = 0; i < total; i++) { const copies = repeat.get(i) || 1; start.set(i, list.length); for (let c = 0; c < copies; c++) list.push(i); }
    return { list, start };
  }
  function drawTableRow(page, font, cells, columns, dividers, rowIndex, size){
    size = size || 8.5; const top = dividers[rowIndex], bottom = dividers[rowIndex + 1];
    columns.forEach((col, i) => { const text = cells[i] || ''; if (!text) return;
      if (col.wrap) drawWrapped(page, font, [text], { x0: col.x0 + 4, y0: top + size + 2.5, x1: col.x1 - 4, y1: bottom - 2 }, size, size + 1.5);
      else drawAt(page, font, text, col.x0 + 4, top + (bottom - top) / 2 + size / 2.6, size); });
  }
  /* A signature is dated where the centre is: the browser's own zone here,
     which is the centre's for a tutor at their desk. */
  const fmtDate = iso => { if (!iso) return ''; const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); };
  const fmtLong = iso => { if (!iso) return ''; const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); };

  // ---- pages -------------------------------------------------------------
  /* Source-page indices into Cambridge's master. stage2Hours is the topic-4
     grid page, whose heading carries "STAGE TWO PROGRESS RECORD - HOURS
     TAUGHT"; stage3Header is the Stage Three page that carries the tutorial
     row AND the topic-4 grid. Both were missing until 29 Sep 2026. */
  const PAGE_INDEX = { attendance: 10, observations: 11, assessedTp: 12, writtenAssignments: 13, stage1: 14, stage2Hours: 16, stage2Notes: 19, stage2Overall: 20, stage3Header: 21, stage3Notes: 24, stage3Overall: 25, finalDeclaration: 26 };

  function drawCover(page, f, d){
    drawAt(page, f.regular, d.traineeName, 148, 443.2);
    drawCellGrid(page, f.regular, (d.centerNumber || '').toUpperCase(), [160.6, 186.35, 211.9, 237.4, 262.9], 485.8 - 6.5);
    drawAt(page, f.regular, d.centerName, 131, 521.0);
    /* Cambridge's Course Number is "......... / ........................":
       a SHORT left field (149.1-176.8, under 28pt) and a longer right one.
       It is not the course notification reference, which is what Lite used
       to put here (audit, 29 Sep 2026) -- that overflows the left box. */
    if (d.courseNumber) { const [first, second] = String(d.courseNumber).split('/').map(s => s.trim()); drawSignature(page, f.regular, first || '', 150, 550.6, 26, 10.5, 6); if (second) drawAt(page, f.regular, second, 181, 550.6); }
    drawAt(page, f.regular, d.courseDates, 145, 580.4);
    (d.tutorNames || []).slice(0, 4).forEach((name, i) => drawAt(page, f.regular, name, 102, [610.0, 633.5, 656.9, 680.4][i]));
    /* The ULN: ten cells, filled only where the centre has one. Required
       "where relevant in UK learning and skills contexts", and obtaining it
       is a centre duty (Handbook 12.1) -- so it is a field, not a blank. */
    if (d.uln) drawCellGrid(page, f.regular, String(d.uln).replace(/\D/g, '').slice(0, 10), [217.7, 243.2, 268.7, 294.3, 319.8, 345.4, 370.9, 396.5, 422.1, 447.6], 716.6 - 6.5);
  }

  function drawStage1(page, f, d){
    const GIVEN = [123.1, 170.1, 138.8, 185.8], HOURS = [267.0, 170.1, 282.8, 185.8], NOT_GIVEN = [429.0, 170.1, 444.8, 185.8];
    drawCheck(page, f.bold, d.tutorialGiven ? GIVEN : NOT_GIVEN);
    if (d.hoursTaught !== null && d.hoursTaught !== undefined && d.hoursTaught !== '') drawAt(page, f.regular, String(d.hoursTaught), 0, (HOURS[1] + HOURS[3]) / 2 + 4, 11, { align: 'center', xMid: (HOURS[0] + HOURS[2]) / 2 });
    if (d.strengths) drawWrapped(page, f.regular, [d.strengths], { x0: 52, y0: 230, x1: 538, y1: 335 });
    if (d.actionPlan) drawWrapped(page, f.regular, [d.actionPlan], { x0: 52, y0: 394, x1: 538, y1: 625 });
    if (d.tutorSignatureName && d.tutorSignedAt) { drawSigned(page, f.regular, d.tutorSignatureName, d.tutorSignatureInk, 156, 666.6, 434 - 156 - 10); drawAt(page, f.regular, fmtDate(d.tutorSignedAt), 434, 666.6); }
    if (d.candidateSignatureName && d.candidateSignedAt) { drawSigned(page, f.regular, d.candidateSignatureName, d.candidateSignatureInk, 181, 729.7, 434 - 181 - 10); drawAt(page, f.regular, fmtDate(d.candidateSignedAt), 434, 729.7); }
    /* "I have read and agree/do not agree with the above comments." The form
       offers a choice and Lite recorded only a signature, so a candidate who
       disputed a record had nowhere to say so (audit, 29 Sep 2026). */
    if (d.candidateAgrees === true) drawOvalAround(page, S1_AGREE);
    if (d.candidateAgrees === false) drawOvalAround(page, S1_DISAGREE);
  }
  const S1_AGREE = { x0: 130.7, y0: 693.5, x1: 160.0, y1: 705.5 }, S1_DISAGREE = { x0: 163.1, y0: 693.5, x1: 229.1, y1: 705.5 };

  /* The Stage Two grid's heading carries the hours taught; the Stage Three
     page carries the whole tutorial row. Handbook 10.2 on Stage 3: "a
     tutorial must be given and the whole record completed" -- so "not given"
     is a state the form can show, and an empty tick is not a claim. */
  function drawStage2Hours(page, f, d){
    if (d && d.hoursTaught !== null && d.hoursTaught !== undefined && d.hoursTaught !== '') drawAt(page, f.regular, String(d.hoursTaught), 0, 75.4, 10.5, { align: 'center', xMid: 583.9 });
  }
  function drawStage3Header(page, f, d){
    const GIVEN = [144.0, 96.2, 159.8, 111.9], HOURS = [324.0, 96.2, 339.8, 111.9], NOT_GIVEN = [522.0, 96.2, 537.8, 111.9];
    if (d.tutorialGiven === true) drawCheck(page, f.bold, GIVEN);
    if (d.tutorialGiven === false) drawCheck(page, f.bold, NOT_GIVEN);
    if (d.hoursTaught !== null && d.hoursTaught !== undefined && d.hoursTaught !== '') drawAt(page, f.regular, String(d.hoursTaught), 0, (HOURS[1] + HOURS[3]) / 2 + 4, 10.5, { align: 'center', xMid: (HOURS[0] + HOURS[2]) / 2 });
  }

  const UNAVOIDABLE_DIV = [216.89, 239.69, 262.49, 285.19, 307.99, 330.79];
  const UNAVOIDABLE_COLS = [{ x0: 66.2, x1: 163.8 }, { x0: 163.8, x1: 313.5, wrap: true }, { x0: 313.5, x1: 473.1, wrap: true }, { x0: 473.1, x1: 695.5, wrap: true }, { x0: 695.5, x1: 809.9, wrap: true }];
  const OTHER_DIV = [419.5, 442.3, 464.98, 487.78];
  const OTHER_COLS = [{ x0: 66.2, x1: 197.7 }, { x0: 197.7, x1: 312.9, wrap: true }, { x0: 312.9, x1: 428.1, wrap: true }, { x0: 428.1, x1: 543.3, wrap: true }, { x0: 543.3, x1: 695.5, wrap: true }, { x0: 695.5, x1: 809.9, wrap: true }];
  function drawAttendance(page, f, d){
    if (d.totalCourseHours !== null && d.totalCourseHours !== undefined && d.totalCourseHours !== '') drawAt(page, f.regular, String(d.totalCourseHours), 0, 89.5, 10.5, { align: 'center', xMid: 252.8 });
    if (d.totalHoursAttended !== null && d.totalHoursAttended !== undefined && d.totalHoursAttended !== '') drawAt(page, f.regular, String(d.totalHoursAttended), 0, 120.7, 10.5, { align: 'center', xMid: 252.8 });
    (d.unavoidableAbsences || []).slice(0, UNAVOIDABLE_DIV.length - 1).forEach((r, i) => drawTableRow(page, f.regular, [r.date, r.sessionMissed || '', r.reason || '', r.workMadeUp || '', r.tutorComment || ''], UNAVOIDABLE_COLS, UNAVOIDABLE_DIV, i, 7));
    (d.otherAbsences || []).slice(0, OTHER_DIV.length - 1).forEach((r, i) => drawTableRow(page, f.regular, [r.date, r.sessionMissed || '', r.reason || '', r.workMadeUp || '', r.candidateComment || '', r.tutorComment || ''], OTHER_COLS, OTHER_DIV, i, 7));
  }

  const OBS_PER_PAGE = 10, OBS_DIV = [129.0, 157.8, 186.5, 215.3, 244.0, 272.8, 301.6, 330.3, 359.1, 387.8, 416.7];
  /* Six columns, as the form has: the last is "Signature of observed teacher
     (where required by centre)". Lite drew five until 29 Sep 2026. */
  const OBS_COLS = [{ x0: 66.2, x1: 152.7 }, { x0: 152.7, x1: 239.1 }, { x0: 239.1, x1: 347.1 }, { x0: 347.1, x1: 419.1 }, { x0: 419.1, x1: 692.9, wrap: true }, { x0: 692.9, x1: 809.9, wrap: true }];
  function drawObservations(page, f, rows, offset){
    rows.slice(offset * OBS_PER_PAGE, offset * OBS_PER_PAGE + OBS_PER_PAGE).forEach((r, i) => drawTableRow(page, f.regular, [r.date, r.lengthMinutes != null ? String(r.lengthMinutes) : '', r.level || '', r.learnersPresent != null ? String(r.learnersPresent) : '', r.lessonFocus || '', r.observedTeacherSignature || ''], OBS_COLS, OBS_DIV, i));
  }

  const TP_PER_PAGE = 12, TP_DIV = [156.0, 182.8, 209.6, 236.2, 263.0, 289.9, 316.5, 343.3, 370.0, 396.9, 423.7, 450.3, 477.2];
  const TP_COLS = [{ x0: 66.2, x1: 123.9 }, { x0: 123.9, x1: 174.3 }, { x0: 174.3, x1: 217.5 }, { x0: 217.5, x1: 275.1 }, { x0: 275.1, x1: 620.9, wrap: true }, { x0: 620.9, x1: 737.9 }, { x0: 737.9, x1: 791.9 }];
  function drawAssessedTp(page, f, rows, offset){
    rows.slice(offset * TP_PER_PAGE, offset * TP_PER_PAGE + TP_PER_PAGE).forEach((r, i) => drawTableRow(page, f.regular, [r.date, r.lengthMinutes != null ? String(r.lengthMinutes) : '', r.level || '', r.learnerCount != null ? String(r.learnerCount) : '', r.lessonFocus || '', r.tutorAssessment || '', r.tutorInitials || ''], TP_COLS, TP_DIV, i));
  }

  const WA_ORDER = ['Focus on Learner', 'LRT', 'Skills', 'LfC'];
  const WA_ROWS = [494.1, 544.2, 594.2, 644.1].map((y0, i) => ({ y0, y1: [543.4, 593.5, 643.4, 693.5][i] }));
  function drawWrittenAssignments(page, f, d){
    const byType = new Map((d.assignments || []).map(a => [a.assignmentType, a]));
    WA_ORDER.forEach((type, i) => { const a = byType.get(type); if (!a || !a.finalGrade) return; const { y0, y1 } = WA_ROWS[i];
      if (a.finalGrade === 'Fail') drawCheck(page, f.bold, [347.7, y0 + 6, 408.7, y0 + 20]);
      else if (a.passedOnResubmission) drawCheck(page, f.bold, [275.7, y0 + 6, 347.7, y0 + 20]);
      else drawCheck(page, f.bold, [194.7, y0 + 6, 275.7, y0 + 20]);
      if (a.candidateSignatureName) drawSignature(page, f.regular, a.candidateSignatureName, 413, (y0 + y1) / 2 + 3, 538 - 413); });
  }

  const STAGE2_PAGES = [
    { sourcePageIndex: 16, youXMid: 617.5, tutorXMid: 693.5, codes: [['4a',169.6],['4b',192.2],['4c',214.6],['4d',246.4],['4e',278.2],['4f',300.9],['4g',323.4],['4h',345.9],['4i',368.4],['4j',390.9],['4k',413.4],['4l',436.0],['4m',458.4],['4n',481.0]] },
    { sourcePageIndex: 17, youXMid: 617.5, tutorXMid: 693.5, codes: [['1a',135.4],['1b',157.9],['1c',189.7],['1d',212.2],['2a',257.2],['2b',279.7],['2c',302.4],['2d',324.8],['2e',347.4],['2f',379.2],['2g',401.7],['3a',446.7],['3b',469.2]] },
    { sourcePageIndex: 18, youXMid: 620.5, tutorXMid: 695.3, codes: [['5a',121.3],['5b',153.1],['5c',175.5],['5d',198.1],['5e',220.6],['5f',243.1],['5g',265.6],['5h',288.1],['5i',310.7],['5j',333.1],['5k',355.7],['5l',387.5],['5m',410.1],['5n',441.9]] },
  ];
  /* THREE pages, not two. The real Stage Three Progress Record opens with
     TOPIC 4 - PLANNING, 4a-4n, on source index 21; Lite drew only the two
     pages after it and left Cambridge's own page blank in a Fail candidate's
     booklet (audit, 29 Sep 2026). Rows measured off the master like the rest.
     What Stage Three actually drops is the candidate's "You" column. */
  const STAGE3_PAGES = [
    { sourcePageIndex: 21, youXMid: null, tutorXMid: 660.0, codes: [['4a',227.7],['4b',248.7],['4c',270.0],['4d',292.4],['4e',321.2],['4f',341.6],['4g',362.9],['4h',384.5],['4i',405.6],['4j',426.4],['4k',448.1],['4l',469.5],['4m',490.5],['4n',511.6]] },
    { sourcePageIndex: 22, youXMid: null, tutorXMid: 621.5, codes: [['1a',131.6],['1b',159.1],['1c',186.2],['1d',208.5],['2a',253.5],['2b',276.2],['2c',298.5],['2d',321.3],['2e',348.2],['2f',375.3],['2g',398.2],['3a',443.2],['3b',470.2]] },
    { sourcePageIndex: 23, youXMid: null, tutorXMid: 617.5, codes: [['5a',114.4],['5b',146.2],['5c',169.0],['5d',191.2],['5e',214.0],['5f',236.2],['5g',259.0],['5h',281.3],['5i',304.1],['5j',326.3],['5k',349.1],['5l',380.9],['5m',403.1],['5n',434.9]] },
  ];
  function drawCriteriaGrid(page, f, grid, candMarks, tutorMarks){
    for (const [code, y] of grid.codes) {
      if (grid.youXMid !== null && candMarks && candMarks[code]) drawAt(page, f.regular, candMarks[code], 0, y, 9, { align: 'center', xMid: grid.youXMid });
      if (tutorMarks && tutorMarks[code]) drawAt(page, f.regular, tutorMarks[code], 0, y, 9, { align: 'center', xMid: grid.tutorXMid });
    }
  }

  function drawStage2Notes(page, f, d){
    const YOU = { x0: 51, x1: 385 }, TUT = { x0: 390, x1: 535 }, WA = { y0: 155, y1: 395 }, OTHER = { y0: 500, y1: 775 };
    if (d.candidateWrittenAssignmentsNotes) drawWrapped(page, f.regular, [d.candidateWrittenAssignmentsNotes], Object.assign({}, YOU, WA));
    if (d.tutorWrittenAssignmentsNotes) drawWrapped(page, f.regular, [d.tutorWrittenAssignmentsNotes], Object.assign({}, TUT, WA));
    if (d.candidateOtherNotes) drawWrapped(page, f.regular, [d.candidateOtherNotes], Object.assign({}, YOU, OTHER));
    if (d.tutorOtherNotes) drawWrapped(page, f.regular, [d.tutorOtherNotes], Object.assign({}, TUT, OTHER));
  }
  const RATINGS = ['above_standard', 'to_standard', 'not_to_standard'];
  function drawStage2Overall(page, f, d){
    const CAND = [{ x0: 70, y0: 97.7, x1: 310, y1: 110.0 }, { x0: 70, y0: 110.4, x1: 292, y1: 122.7 }, { x0: 70, y0: 123.2, x1: 483, y1: 135.5 }];
    const TUT = [{ x0: 70, y0: 353.1, x1: 310, y1: 365.4 }, { x0: 70, y0: 365.7, x1: 292, y1: 378.0 }, { x0: 70, y0: 378.4, x1: 483, y1: 390.7 }];
    if (d.candidateOverall) drawOvalAround(page, CAND[RATINGS.indexOf(d.candidateOverall)]);
    if (d.candidateNotes) drawWrapped(page, f.regular, [d.candidateNotes], { x0: 62, y0: 178, x1: 525, y1: 316 });
    if (d.tutorOverall) drawOvalAround(page, TUT[RATINGS.indexOf(d.tutorOverall)]);
    if (d.tutorNotes) drawWrapped(page, f.regular, [d.tutorNotes], { x0: 57, y0: 431, x1: 525, y1: 618 });
    if (d.tutorSignatureName && d.tutorSignedAt) { drawSigned(page, f.regular, d.tutorSignatureName, d.tutorSignatureInk, 165, 657.4, 440 - 165 - 10); drawAt(page, f.regular, fmtDate(d.tutorSignedAt), 440, 657.4); }
    if (d.candidateSignatureName && d.candidateSignedAt) { drawSigned(page, f.regular, d.candidateSignatureName, d.candidateSignatureInk, 190, 726.5, 440.5 - 190 - 10); drawAt(page, f.regular, fmtDate(d.candidateSignedAt), 440.5, 726.5); }
    /* "This is/is not an accurate record of the tutorial discussion and my
       progress to date. I have read and agree/do not agree with the
       summarising comments." Two separate choices, both the candidate's. */
    if (d.candidateAccurate === true) drawOvalAround(page, { x0: 80.8, y0: 671.5, x1: 90.0, y1: 683.6 });
    if (d.candidateAccurate === false) drawOvalAround(page, { x0: 93.0, y0: 671.5, x1: 122.4, y1: 683.6 });
    if (d.candidateAgrees === true) drawOvalAround(page, { x0: 78.4, y0: 684.3, x1: 107.7, y1: 696.3 });
    if (d.candidateAgrees === false) drawOvalAround(page, { x0: 110.8, y0: 684.3, x1: 176.9, y1: 696.3 });
  }
  function drawStage3Notes(page, f, d){
    if (d.tutorWrittenAssignmentsNotes) drawWrapped(page, f.regular, [d.tutorWrittenAssignmentsNotes], { x0: 65, y0: 132, x1: 530, y1: 335 });
    if (d.tutorOtherNotes) drawWrapped(page, f.regular, [d.tutorOtherNotes], { x0: 65, y0: 437, x1: 530, y1: 750 });
  }
  function drawStage3Overall(page, f, d){
    const TUT = [{ x0: 78, y0: 89.1, x1: 318, y1: 101.5 }, { x0: 78, y0: 101.9, x1: 300, y1: 114.2 }, { x0: 78, y0: 114.5, x1: 492, y1: 126.8 }];
    if (d.tutorOverall) drawOvalAround(page, TUT[RATINGS.indexOf(d.tutorOverall)]);
    if (d.tutorNotes) drawWrapped(page, f.regular, [d.tutorNotes], { x0: 65, y0: 168, x1: 530, y1: 568 });
    if (d.tutorSignatureName && d.tutorSignedAt) { drawSigned(page, f.regular, d.tutorSignatureName, d.tutorSignatureInk, 170, 608.5, 448 - 170 - 10); drawAt(page, f.regular, fmtDate(d.tutorSignedAt), 448, 608.5); }
    if (d.candidateSignatureName && d.candidateSignedAt) { drawSigned(page, f.regular, d.candidateSignatureName, d.candidateSignatureInk, 195, 665.2, 449 - 195 - 10); drawAt(page, f.regular, fmtDate(d.candidateSignedAt), 449, 665.2); }
    if (d.candidateAgrees === true) drawOvalAround(page, { x0: 144.9, y0: 622.8, x1: 174.1, y1: 634.9 });
    if (d.candidateAgrees === false) drawOvalAround(page, { x0: 177.3, y0: 622.8, x1: 243.3, y1: 634.9 });
  }
  function drawFinalDeclaration(page, f, d){
    const BOXES = [[61.8, 167.6, 72.2, 178.6], [61.8, 195.9, 72.2, 206.2], [61.8, 223.5, 72.2, 232.7], [62.5, 251.7, 72.8, 262.6], [62.5, 275.4, 72.8, 286.3]];
    [d.checklistTp, d.checklistObservations, d.checklistAssignments, d.checklistOwnWork, d.checklistAllRecords].forEach((c, i) => { if (c) drawCheck(page, f.bold, BOXES[i]); });
    if (d.candidateSignatureName && d.candidateSignedAt) { drawSigned(page, f.regular, d.candidateSignatureName, d.candidateSignatureInk, 192, 340.3, 412 - 192 - 10); drawAt(page, f.regular, fmtDate(d.candidateSignedAt), 412, 340.3); }
    if (d.tutorSignatureName && d.tutorSignedAt) { drawSigned(page, f.regular, d.tutorSignatureName, d.tutorSignatureInk, 174, 435.8, 412 - 174 - 10); drawAt(page, f.regular, fmtDate(d.tutorSignedAt), 412, 435.8); }
    /* "INFORMATION FOR THE CELTA GRADE REVIEW - TUTOR COMMENTS ON ACTION
       POINTS DETAILED IN STAGE THREE PROGRESS RECORD ... to be completed for
       all candidates whose portfolios are submitted to Cambridge English."
       Exactly the Fail and borderline candidates. No field existed until
       29 Sep 2026. */
    if (d.gradeReviewComments) drawWrapped(page, f.regular, [d.gradeReviewComments], { x0: 62, y0: 583, x1: 534, y1: 772 }, 9.5, 12.5);
  }
  /* An appended page, not one of Cambridge's: the centre's own record that the
     candidate was given, and signed for, the portfolio requirements and the
     appeals procedure. It travels with the export because a Stage One appeal
     comes AFTER the result (Administration Handbook 16.2), when the PDF is
     what survives. Headed as a centre record so it is never mistaken for
     part of the form. */
  function drawConfirmations(page, f, d){
    const LEFT = 60; let y = 760;
    page.drawText('CENTRE RECORD -- CANDIDATE CONFIRMATIONS', { x: LEFT, y, size: 12, font: f.bold }); y -= 18;
    page.drawText('Not part of the Cambridge CELTA 5. Retained by the centre as evidence that the', { x: LEFT, y, size: 8.5, font: f.regular }); y -= 12;
    page.drawText('candidate was given these documents and confirmed reading them.', { x: LEFT, y, size: 8.5, font: f.regular }); y -= 34;
    const block = (title, statement, name, at, ink) => {
      page.drawText(title, { x: LEFT, y, size: 10, font: f.bold }); y -= 15;
      page.drawText(statement, { x: LEFT, y, size: 8.5, font: f.regular }); y -= 20;
      if (at) {
        let sx = LEFT + 12; page.drawText('Signed: ', { x: sx, y, size: 9.5, font: f.regular }); sx += f.regular.widthOfTextAtSize('Signed: ', 9.5);
        if (ink) { const w = drawInk(page, ink, sx, page.getHeight() - y, 240); if (w) sx += w + 8; }
        page.drawText(name || d.candidateName, { x: sx, y, size: ink ? 6.5 : 9.5, font: f.regular });
        page.drawText('Date: ' + fmtLong(at), { x: LEFT + 300, y, size: 9.5, font: f.regular });
      }
      else page.drawText('Not confirmed by the candidate.', { x: LEFT + 12, y, size: 9.5, font: f.regular });
      y -= 34;
    };
    block('Candidate portfolio requirements', 'I confirm that I have understood and accept the requirements for the CELTA portfolio.', d.portfolioSignatureName, d.portfolioConfirmedAt, d.portfolioSignatureInk);
    block('Cambridge English appeals procedure', 'I confirm that I have read the Cambridge English Appeals Procedure.', d.appealsSignatureName, d.appealsConfirmedAt, d.appealsSignatureInk);
  }

  // ---- the booklet ---------------------------------------------------------
  async function render(input, assets){
    if (!window.PDFLib) throw new Error('pdf-lib did not load');
    const master = await PDFDocument.load(assets.master);
    const out = await PDFDocument.create();
    if (window.fontkit) out.registerFontkit(window.fontkit);
    /* subset:false on purpose -- the subsetter drops composite glyphs and
       Turkish and other accented names lose letters (Connect, Aug 2026) */
    const fonts = { regular: await out.embedFont(assets.regular, { subset: false }), bold: await out.embedFont(assets.bold, { subset: false }) };
    const obsCopies = copiesNeeded((input.observations || []).length, OBS_PER_PAGE);
    const tpCopies = copiesNeeded((input.assessedTp || []).length, TP_PER_PAGE);
    const { list, start } = buildPageList(master.getPageCount(), new Map([[PAGE_INDEX.observations, obsCopies], [PAGE_INDEX.assessedTp, tpCopies]]));
    const pages = await out.copyPages(master, list); pages.forEach(p => out.addPage(p));
    const at = i => out.getPage(start.get(i));
    drawCover(at(0), fonts, input.cover);
    drawAttendance(at(PAGE_INDEX.attendance), fonts, input.attendance);
    drawWrittenAssignments(at(PAGE_INDEX.writtenAssignments), fonts, input.writtenAssignments);
    drawStage1(at(PAGE_INDEX.stage1), fonts, input.stage1);
    drawStage2Hours(at(PAGE_INDEX.stage2Hours), fonts, input.stage2Overall);
    drawStage3Header(at(PAGE_INDEX.stage3Header), fonts, input.stage3Header || {});
    for (let i = 0; i < obsCopies; i++) drawObservations(out.getPage(start.get(PAGE_INDEX.observations) + i), fonts, input.observations || [], i);
    for (let i = 0; i < tpCopies; i++) drawAssessedTp(out.getPage(start.get(PAGE_INDEX.assessedTp) + i), fonts, input.assessedTp || [], i);
    for (const g of STAGE2_PAGES) drawCriteriaGrid(at(g.sourcePageIndex), fonts, g, input.candidateStage2Marks, input.tutorStage2Marks);
    for (const g of STAGE3_PAGES) drawCriteriaGrid(at(g.sourcePageIndex), fonts, g, null, input.tutorStage3Marks);
    drawStage2Notes(at(PAGE_INDEX.stage2Notes), fonts, input.stage2Notes);
    drawStage2Overall(at(PAGE_INDEX.stage2Overall), fonts, input.stage2Overall);
    drawStage3Notes(at(PAGE_INDEX.stage3Notes), fonts, input.stage3Notes);
    drawStage3Overall(at(PAGE_INDEX.stage3Overall), fonts, input.stage3Overall);
    drawFinalDeclaration(at(PAGE_INDEX.finalDeclaration), fonts, input.finalDeclaration);
    drawConfirmations(out.addPage([595.28, 841.89]), fonts, input.confirmations);
    return out.save();
  }
  const b64 = s => { const bin = atob(s); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; };
  window.hubCelta5Pdf = { render, fromBase64: b64 };
})();
