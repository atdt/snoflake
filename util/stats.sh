#!/usr/bin/env bash

sil_todo=$(grep 'return;' lib/snoflake/sil.js | wc -l | sed -e "s/ //g")
sil_done=$(expr 139 - ${sil_todo})

tests_todo=$(grep '// stub' test/test-sil.js | wc -l | sed -e "s/ //g")
tests_done=$(expr 139 - ${tests_todo})

echo "SIL Implementation Status"
echo "========================="
echo "Macros: ${sil_done} implemented, ${sil_todo} remaining."
echo "Tests: ${tests_done} implemented, ${tests_todo} remaining."
