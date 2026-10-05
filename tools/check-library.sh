#!/bin/zsh
# Everything that has to hold before a TP point set ships.
#
# It reads the live library off the store, so it needs the library course key:
# LIBRARY_KEY in the environment, or .library-key beside the repo. Neither is
# in the repository and neither should ever be.
#
# Each check is its own file and says at the top what it is for and which fault
# made it necessary. Run one on its own when it reports something:
#
#   node tools/stageref.mjs          the full list, not just the tail
#   node tools/subaim-taught.mjs --all   what satisfied every slot
#   node tools/spread.mjs s5         one set's rotation, trainee by trainee
#
#
# WITH A FILE, it checks a set somebody sent instead of the library:
#
#   ./tools/check-library.sh ~/Downloads/speakout-b1.json
#
# Four checks are left out then, and it says so rather than passing quietly:
# they read our own scans, our own PDFs and our own audio, and a contributed
# set names pages in a book we do not have. What is left is everything about
# the writing, which is what is being judged.
#
cd "$(dirname "$0")"

if [ -n "$1" ]; then
  if [ ! -f "$1" ]; then echo "No such file: $1" >&2; exit 1; fi
  export LIBRARY_FILE="$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
  echo "Checking a contributed set: $LIBRARY_FILE"
  node -e '
    import("./st.mjs").then(async ({ readCourse }) => {
      const L = (await readCourse()).rec.set.library;
      for (const id of Object.keys(L)) {
        const S = L[id];
        let slots = 0, staged = 0;
        Object.values(S.sessions || {}).forEach(x => (x.slots || []).forEach(sl => {
          if (sl.type || sl.aim) slots++;
          if ((sl.stages || []).length) staged++;
        }));
        console.log(`  ${S.book || "(no book named)"} — ${S.level || "(no level)"} — ` +
          `${slots} lessons, ${staged} staged` + (S.by ? `, by ${S.by}` : ""));
      }
    }).catch(e => { console.error("  " + e.message); process.exit(1); });
  ' || exit 1
  echo "###### clocks";     node mins-all.mjs        2>&1 | tail -2
  echo "###### audio gaps"; node gaps-audio.mjs      2>&1 | tail -3
  echo "   (read this one loosely: tracks-plan.json clears the slots in OUR"
  echo "    sets that mention listening and rightly name no track. A set from"
  echo "    somewhere else is in nobody's plan, so its fine ones show up too.)"
  echo "###### the aim rule"; node aimrule.mjs       2>&1 | tail -4
  echo "###### spread";     node spread.mjs s99      2>&1 | tail -1
  echo "###### empties";    node empties.mjs         2>&1 | tail -2
  echo "###### duplicates"; node dupcheck.mjs        2>&1 | tail -2
  echo "###### clarification"; node nolclarify.mjs   2>&1 | tail -2
  echo "###### merged stages and tails"; node tails.mjs 2>&1 | tail -3
  echo "###### sub aims";   node subaim-taught.mjs   2>&1 | tail -2
  echo
  echo "Not run, and nobody should read this as a pass: pages, stage refs,"
  echo "blanks and audio. All four check a citation against OUR copy of the"
  echo "book or OUR recordings, and this set teaches from a book we may not"
  echo "have. Its pages are judged when it goes into the library."
  exit 0
fi

echo "###### pages";      node verify-pages.mjs    2>&1 | tail -6
echo "###### audio";      node audio-store.mjs     2>&1 | tail -2
echo "###### clocks";     node mins-all.mjs        2>&1 | tail -2
echo "###### stage refs"; node stageref.mjs        2>&1 | tail -3
echo "###### audio gaps"; node gaps-audio.mjs      2>&1 | tail -3
echo "###### the aim rule"; node aimrule.mjs       2>&1 | tail -4
echo "###### blanks";     python3 blankpages.py    2>&1 | tail -2
echo "###### spread";     for s in s1 s2 s3 s4 s5; do node spread.mjs $s 2>&1 | tail -1; done
echo "###### empties";    node empties.mjs         2>&1 | tail -2
echo "###### duplicates"; node dupcheck.mjs        2>&1 | tail -2
echo "###### clarification"; node nolclarify.mjs   2>&1 | tail -2
echo "###### merged stages and tails"; node tails.mjs 2>&1 | tail -3
echo "###### sub aims";   node subaim-taught.mjs   2>&1 | tail -2
