#!/usr/bin/env bash
# Privacy and secrets guard. Run before every commit and push.
# Blocked words are read from a file OUTSIDE this repository, so the list itself is never published:
#   ${AUTOMATION_GUARD_BLOCKLIST:-$HOME/.config/automation-guard/blocklist.txt}
BLOCKLIST="${AUTOMATION_GUARD_BLOCKLIST:-$HOME/.config/automation-guard/blocklist.txt}"
ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT" || exit 1

fail=0
report() { echo "GUARD: $1"; fail=1; }

# Files that will be published: tracked files plus staged and untracked files that are not ignored.
FILES=()
while IFS= read -r f; do
  [ -n "$f" ] && FILES+=("$f")
done < <( { git ls-files; git ls-files --others --exclude-standard; } | sort -u | grep -v '^scripts/check-private.sh$' )

# 1. Email addresses (only GitHub noreply and example.test placeholders are allowed).
EMAIL_RE='[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'
for f in "${FILES[@]}"; do
  [ -f "$f" ] || continue
  while IFS= read -r line; do
    while read -r m; do
      case "$m" in
        *@users.noreply.github.com|*@example.test|*@example.com) ;;
        *) report "email-like value in $f: $m" ;;
      esac
    done < <(grep -Eo "$EMAIL_RE" <<< "$line")
  done < "$f"
done

# 2. Phone numbers (international or long digit runs with separators).
PHONE_RE='(\+?[0-9]{1,3}[ .-]?)?\(?[0-9]{3}\)?[ .-][0-9]{3}[ .-][0-9]{3,4}'
for f in "${FILES[@]}"; do
  [ -f "$f" ] || continue
  if grep -Eq "$PHONE_RE" "$f"; then report "phone-like value in $f"; fi
done

# 3. Secrets and keys.
SECRET_RE='(AKIA[0-9A-Z]{16}|sk_live_[0-9A-Za-z]{10,}|pk_live_[0-9A-Za-z]{10,}|gh[pousr]_[0-9A-Za-z]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|xox[baprs]-[0-9A-Za-z-]{10,})'
for f in "${FILES[@]}"; do
  [ -f "$f" ] || continue
  if grep -Eq "$SECRET_RE" "$f"; then report "secret-like value in $f"; fi
done

# 4. Env files must never be published.
for f in "${FILES[@]}"; do
  case "$f" in
    .env|.env.*|*.pem|*.key) [ "$f" = ".env.example" ] || report "forbidden file: $f" ;;
  esac
done

# 5. Blocklist (personal names, employer or client names, course names). Kept outside the repo.
if [ -f "$BLOCKLIST" ]; then
  while IFS= read -r term; do
    term="${term%$'\r'}"
    [ -z "$term" ] && continue
    case "$term" in \#*) continue ;; esac
    for f in "${FILES[@]}"; do
      [ -f "$f" ] || continue
      if grep -Fqi -- "$term" "$f"; then report "blocked term in $f"; fi
    done
    # Also check commit messages and author names of commits not yet pushed.
    if git log --format='%an%n%ae%n%s%n%b' "@{u}..HEAD" 2>/dev/null | grep -Fqi -- "$term"; then
      report "blocked term in unpushed commit metadata"
    fi
  done < "$BLOCKLIST"
elif [ "${CI:-}" = "true" ]; then
  # CI runners do not have the local blocklist. The other checks still run there.
  echo "GUARD: blocklist not available in CI; personal-term check skipped here, run it locally before push."
else
  echo "GUARD: blocklist not found at $BLOCKLIST (create it; see scripts/README.md)"
  fail=1
fi

# 6. Commit author addresses must be GitHub noreply addresses.
bad_authors="$(git log --format='%ae' "@{u}..HEAD" 2>/dev/null | grep -v 'users.noreply.github.com' | sort -u)"
if [ -n "$bad_authors" ]; then report "commit author uses a non-noreply email: $bad_authors"; fi

if [ "$fail" -ne 0 ]; then
  echo "GUARD: FAILED. Fix the items above. Do not bypass this check."
  exit 1
fi
echo "GUARD: passed."
