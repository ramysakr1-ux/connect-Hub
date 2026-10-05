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
cd "$(dirname "$0")"
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
