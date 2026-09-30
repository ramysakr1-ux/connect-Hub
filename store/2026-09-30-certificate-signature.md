# Version 47 — the centre's signature rides on the register row

A tutor signs a volunteer's certificate of attendance on screen (hub-ink, the
same pad as CELTA 5) and it is kept on that student's own register row as
`cert: { name, at, ink }`, written by the tutor through the ordinary
`putCourse` of kind `volunteers`.

## What changed in `Code.gs`

One field. The volunteer boot sends `cert` alongside `name, here, marks,
level, note, agreed`, so the student's own copy of the certificate shows the
signature the centre drew.

No new op: a volunteer still cannot write anything but their `agreed` stamp
(version 46), and the signature is written by a tutor, who may already write
the whole `volunteers` record.

## Proved on c5

Tutor signed Ayşe Demir's certificate as "Jordan Blake" with a drawn
signature (484 characters of SVG path); the store's row carried it; the
student's own `?v=` copy rendered the same ink and the same date.
