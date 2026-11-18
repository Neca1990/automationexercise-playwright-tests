#!/usr/bin/env bash
# Runs one stage of the test automation flow. See docs/workflow.md.
#
#   scripts/flow.sh plan                     interactive planning session; you approve the plan
#   scripts/flow.sh implement                implement the approved plan on a feature branch (no push)
#   scripts/flow.sh gate                     typecheck, format, privacy guard, tests; required before any push
#   scripts/flow.sh pr [title]               push the current branch and open a PR into main (reuses an open PR)
#   scripts/flow.sh review <PR>              one non-interactive review session; posts comments, changes no code
#   scripts/flow.sh fix <PR>                 fix the review comments, run the gate, push
#   scripts/flow.sh loop <PR> [max-rounds]   review, then fix, until the review reports no findings (default 5 rounds)
#   scripts/flow.sh merge <PR> [--yes]       merge into main after CI passes and no findings remain (asks first unless --yes)
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
stage="${1:-}"
arg2="${2:-}"
arg3="${3:-}"

gate() {
  npm run check
  npm test
}

current_branch() {
  git branch --show-current
}

require_pr_number() {
  if [ -z "$1" ] || ! [[ "$1" =~ ^[0-9]+$ ]]; then
    echo "usage: $0 $stage <PR number>"
    exit 2
  fi
}

# Returns the number of findings from the newest review summary comment on the PR.
# The review skill posts that comment as "Review findings: <n>".
latest_findings() {
  local pr="$1" body
  body="$(gh pr view "$pr" --json comments --jq '[.comments[].body | select(startswith("Review findings:"))] | last // ""')"
  if [ -z "$body" ]; then
    echo "LOOP: no review summary found on PR #$pr" >&2
    return 1
  fi
  echo "$body" | sed -E 's/^Review findings: *([0-9]+).*/\1/'
}

open_pr_for_branch() {
  gh pr list --head "$(current_branch)" --state open --json number --jq '.[0].number // empty'
}

do_review() {
  local pr="$1"
  claude -p "Use the review-tests skill to review pull request #$pr and post comments with gh. End with one comment that starts with 'Review findings: <number>'. Do not edit files." \
    --allowedTools "Read" "Bash(git diff:*)" "Bash(git log:*)" "Bash(gh pr view:*)" "Bash(gh pr diff:*)" "Bash(gh pr comment:*)" "Bash(gh api:*)"
}

do_fix() {
  local pr="$1"
  claude "Use the fix-review skill for pull request #$pr. Fix valid comments, reply to each one, then run scripts/flow.sh gate before pushing."
  gate
  git push
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

  pr)
    branch="$(current_branch)"
    if [ -z "$branch" ] || [ "$branch" = "main" ]; then
      echo "PR: switch to a feature branch first (current: ${branch:-detached})."
      exit 1
    fi
    gate
    git push -u origin HEAD
    existing="$(open_pr_for_branch)"
    if [ -n "$existing" ]; then
      echo "PR: already open as #$existing"
    else
      title="${arg2:-$(git log -1 --format=%s)}"
      gh pr create --base main --head "$branch" --title "$title" \
        --body "Test automation change. Gate (typecheck, format, privacy guard, tests) passed locally before push."
      echo "PR: opened for $branch"
    fi
    gh pr view --json number,url --jq '"PR #\(.number): \(.url)"'
    ;;

  review)
    require_pr_number "$arg2"
    do_review "$arg2"
    ;;

  fix)
    require_pr_number "$arg2"
    do_fix "$arg2"
    ;;

  loop)
    require_pr_number "$arg2"
    max_rounds="${arg3:-5}"
    for round in $(seq 1 "$max_rounds"); do
      echo "LOOP: round $round of $max_rounds, review"
      do_review "$arg2"
      findings="$(latest_findings "$arg2")"
      echo "LOOP: findings = $findings"
      if [ "$findings" = "0" ]; then
        echo "LOOP: no findings left. Run: scripts/flow.sh merge $arg2"
        exit 0
      fi
      echo "LOOP: round $round, fix"
      do_fix "$arg2"
    done
    echo "LOOP: stopped after $max_rounds rounds with findings still open. Check the PR by hand."
    exit 1
    ;;

  merge)
    require_pr_number "$arg2"
    findings="$(latest_findings "$arg2")"
    if [ "$findings" != "0" ]; then
      echo "MERGE: review still reports $findings finding(s) on PR #$arg2. Run the loop or fix them first."
      exit 1
    fi
    echo "MERGE: waiting for CI on PR #$arg2"
    gh pr checks "$arg2" --watch
    if [ "$arg3" != "--yes" ]; then
      read -r -p "Merge PR #$arg2 into main? Type yes to confirm: " answer
      [ "$answer" = "yes" ] || { echo "MERGE: cancelled."; exit 1; }
    fi
    gh pr merge "$arg2" --merge --delete-branch
    git checkout -q main
    git pull -q origin main
    echo "MERGE: done. main is up to date."
    ;;

  *)
    echo "usage: $0 {plan|implement|gate|pr [title]|review <PR>|fix <PR>|loop <PR> [rounds]|merge <PR> [--yes]}"
    exit 2
    ;;
esac
