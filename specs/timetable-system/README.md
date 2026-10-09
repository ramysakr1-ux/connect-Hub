# Handoff: Timetable system (Start · Import · Board · Changes · Trainee view)

## Overview
The course timetable in Connect, end to end: how a timetable gets in (import a sheet or file, copy a previous course, start empty), the review step that gives every imported row a meaning, the time-positioned board admins rearrange, the draft/publish flow with a sheet check, and what trainees see. The timetable is the single source for deadlines, the TP schedule, feedback slots, Zoom links, reminders and the tutor and trainee views.

## About the Design Files
The `.dc.html` files in this bundle are **design references built in HTML** — prototypes showing intended look and behaviour, not production code to copy. Recreate them in the target codebase (repo: `ramysakr1-ux/celta-connect`, per `github.md`) using its existing components and patterns. `for-claude-code-timetable-system.md` is the written spec and the source of truth alongside the HTML.

## Fidelity
**High-fidelity** for layout, colour, type, spacing, copy and interaction states. Session data, import rows and sheet differences are sample data (see spec §11).

## Screens / Views
All five live in `Timetable System.dc.html` behind the switcher top right.

- **Start** — three ways in: Import (dark ink-warm card, gold button), Copy C16 (previous course), Start empty. Shown only when the course has no sessions.
- **Import** — two-column review table (`In your sheet` / `Connect understood`), type chips, inline questions for anything unclear (unknown term, vague or TBC time, which assignment, two rows in one slot, row after course end, Zoom with no link), `Build timetable` disabled until every question is answered. `Timetable Import.dc.html` has the fuller flow: Source step, All rows / Needs you filter, "Remember for future imports", Built summary.
- **Board** — sticky 240px sidebar (Status, Selected, Course shape, Checks, Doesn't fit, Legend) + week rows. Each week: big serif numeral, then a 26px hour gutter and one column per teaching day. Each day is a 09:00–17:30 timeline at 34px/hour; sessions are blocks sized by duration in solid type colours; deadlines are red ribbons at 09:00. Click a tile to select: others dim, linked tiles get a gold ring, and SVG threads connect the selection to its prerequisite, dependents, deadline and feedback. Drag a tile: every day tints clean / shift / block and the hovered day names the effect or the reason. Click a date to close that day; weekday chips and the week stepper reshape the course.
- **Changes** — left: edits made in Connect waiting to publish (with knock-on effects) and the publish button; right: differences found in the sheet, each classified clean / shift / block with Accept / Ignore.
- **Trainee view** — Priya, Group A: week pills, the same timeline at 40px/hour, `You teach` / `Observe`, deadline ribbons, next deadline, "Timetable updated" banner after a publish.

## Design Tokens
- Page background `oklch(93.5% 0.02 78)`; card `oklch(98.5% 0.008 85)`; border `oklch(88% 0.016 82)`; divider `oklch(91% 0.012 82)`; hour lines `oklch(91% 0.012 80)`
- Body text `oklch(23.5% 0.017 65)`; secondary `oklch(40% 0.03 65)`; muted `oklch(51% 0.017 70)`; mono labels `oklch(58% 0.017 70)`
- Ink-warm (TP, primary buttons, selected card) `oklch(30% 0.042 58)`; cream text on it `oklch(97% 0.012 80)`
- Gold line/ring `oklch(60% 0.11 70)`; gold fill (inputs, Import button) `oklch(82% 0.1 78)` with text `oklch(25% 0.04 60)`; gold pale (Zoom inputs) `oklch(93% 0.05 80)`; gold text `oklch(42% 0.09 65)`
- Red (deadlines, block) `oklch(55% 0.15 28)`; red text `oklch(45% 0.15 28)`
- Green (checks pass, Published pill) dot `oklch(55% 0.1 150)`, pill bg `oklch(92% 0.05 150)` text `oklch(35% 0.08 150)`
- Feedback `oklch(88% 0.03 60)`; Observe `oklch(93% 0.02 60)` / border `oklch(80% 0.03 60)`; Fixed `oklch(42% 0.015 70)`; Planning and bookable: card bg with 1px dashed `oklch(70% 0.03 70)`
- Drop tints: clean `color-mix(in oklch, ink-warm 9–18%, white)`; shift `oklch(95.5% 0.05 85)` → `oklch(91% 0.08 85)`; block `color-mix(in oklch, red 9–18%, white)`
- Note banner bg `oklch(97% 0.03 85)` border `oklch(85% 0.06 85)`; Draft pill bg `oklch(93% 0.06 80)`
- Fonts: Karla 400–700 (UI), Newsreader 500/600 (titles, week and day numerals), IBM Plex Mono 400/500 (sheet rows, hour labels, day index). Google Fonts.
- Radii: cards 8–10px, tiles 4px, buttons 6px, pills 999px.

## Interactions & Behaviour
- Rules engine (spec §2) runs on every change from any source: clash, order, deadline placement, feedback follows TP, locked, fit. Outcomes clean / shift / block. Clean and shift apply immediately; block does nothing. One-step Undo is required (not in the prototype).
- Deadline placement in production follows `for-claude-code-assignment-schedule-rule.md` (non-teaching day for the group, from the TP roster). The prototype's "two days after the input" is a stand-in for the mechanics.
- Every edit makes the board a Draft; trainees and tutors see the last published version until Publish. Publishing regenerates reminders and downstream views and posts the "Timetable updated" note.
- The sheet is read once at import and then checked daily for differences; nothing changes without Accept.
- Threads and highlights recompute after every render and on resize.

## Assets
No images. Threads are an inline SVG overlay drawn from measured tile positions. No icon library.

## Files
- `Timetable System.dc.html` — all five screens, the primary reference.
- `Timetable Import.dc.html` — fuller import flow (Source → Review → Built) with the filter, Remember checkbox and summary.
- `Adaptive Timetable.dc.html` — earlier board; reference for the shape presets, Undo / Reset to auto, and the Doesn't fit tray.
- `for-claude-code-timetable-system.md` — the spec: data model, rules engine, every screen, copy, integration points, open questions.
- `for-claude-code-timetable-tiles.md` — the 16 Aug tile spec this supersedes (kept for the drag-colour and detail-panel history).
- `for-claude-code-assignment-schedule-rule.md` — the deadline rule the board must implement.
