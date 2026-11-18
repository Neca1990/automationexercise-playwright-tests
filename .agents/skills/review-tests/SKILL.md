---
name: review-tests
description: Reviews a pull request of Playwright tests for automationexercise.com and posts review comments with gh, without changing code. Use when run as the separate review session of the flow.
---

# Review tests

## Steps

1. Read `AGENTS.md` and `docs/`.
2. Read the diff of the pull request against `main` with `git diff main...HEAD` and `gh pr diff`.
3. Check:
   - privacy rules: no personal data, no secrets, no project or client names;
   - conventions in `docs/testing-conventions.md`, `docs/page-objects.md`, and `docs/selectors.md`;
   - POM: selectors only in `pages/`, no selectors in `tests/`;
   - `docs/quality-rules.md`: no hard-coded data in specs, no `.first()`/`.nth()`, every test tagged, assertions check business results;
   - test quality: assertions that really check behavior, no fixed waits, no order dependence;
   - locators that are fragile or that match more than one element.
4. Post each finding as a comment on the pull request with `gh pr comment <number> --body "<text>"`. Keep each comment short and state the file and line.
5. Post one summary comment at the end. Its first line is `Review findings: <number>`, where the number is the count of findings you posted (0 if none). Its last line is the marker `<!-- review-findings: <head-sha> <number> -->`, where `<head-sha>` is the full output of `gh pr view <number> --json headRefOid --jq .headRefOid` and `<number>` is the same count. The flow reads only the marker, and rejects it if the SHA is not the PR's current head.

## Rules

- Do not edit files. Do not push. Review only.
- Only comment on real issues. If there are none, say so in the summary comment.
