#!/usr/bin/env bash
# Runs one stage of the test automation flow. See docs/workflow.md.
#
#   scripts/flow.sh plan                 interactive planning session (Claude Code, you approve the plan)
#   scripts/flow.sh implement            implement the approved plan on a branch
#   scripts/flow.sh gate                 tests + privacy guard; required before any push
#   scripts/flow.sh review <PR number>   separate, non-interactive review session that posts comments
#   scripts/flow.sh fix <PR number>      read review comments, fix, re-run gate, push
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
stage="${1:-}"
pr="${2:-}"

gate() {
  npm test
  npm run guard
}

case "$stage" in
  plan)
    claude "Use the plan-tests skill. Ask me about anything unclear, then write plans/<topic>.md and wait for my approval."
    ;;
  implement)
    claude "Use the implement-tests skill on the approved plan in plans/. Stop after committing; do not push."
    ;;
  gate)
    gate
    echo "GATE: passed."
    ;;
  review)
    [ -n "$pr" ] || { echo "usage: $0 review <PR number>"; exit 2; }
    # Separate session: read-only tools plus gh comment posting. It does not edit files or push.
    claude -p "Use the review-tests skill to review pull request #$pr and post comments with gh. Do not edit files." \
      --allowedTools "Read" "Bash(git diff:*)" "Bash(git log:*)" "Bash(gh pr view:*)" "Bash(gh pr diff:*)" "Bash(gh pr comment:*)" "Bash(gh api:*)"
    ;;
  fix)
    [ -n "$pr" ] || { echo "usage: $0 fix <PR number>"; exit 2; }
    claude "Use the fix-review skill for pull request #$pr. Fix valid comments, then run scripts/flow.sh gate before pushing."
    gate
    git push
    ;;
  *)
    echo "usage: $0 {plan|implement|gate|review <PR>|fix <PR>}"
    exit 2
    ;;
esac
