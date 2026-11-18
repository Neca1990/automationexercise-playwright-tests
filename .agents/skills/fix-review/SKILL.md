---
name: fix-review
description: Reads review comments on a pull request for automationexercise.com tests, fixes the valid ones, replies to each comment, and pushes the branch after the test gate passes. Use after the review session has posted comments.
---

# Fix review comments

## Steps

1. Read `AGENTS.md` and `docs/`.
2. List the review comments with `gh pr view <number> --comments` and `gh api repos/<owner>/<repo>/pulls/<number>/comments`.
3. For each comment, decide if it is valid. Fix valid ones. For an invalid one, reply with the reason.
4. Run `npm test` and `npm run guard`. Both must pass.
5. Commit the fixes and push the branch.
6. Reply to each comment with what was done.
7. Wait for CI. Do not merge if any check fails.

## Rules

- Do not merge without the user's approval.
- Fix only what the comment asks for, plus what is needed to make tests pass.
