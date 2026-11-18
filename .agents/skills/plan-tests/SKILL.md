---
name: plan-tests
description: Turns a list of features to automate on automationexercise.com into an approved test plan file. Use when the user asks to plan, outline, or scope automated tests for this site before any code is written.
---

# Plan tests

## Steps

1. Read `AGENTS.md` and `docs/workflow.md`.
2. Ask the user about anything unclear: the page, the steps, the expected result, and any data needed. Ask one group of questions at a time, not one at a time forever.
3. Open the relevant public pages to confirm they exist and what they show. Do not submit forms that create real accounts without the user's confirmation.
4. Write `plans/<topic>.md` with:
   - a short goal,
   - a numbered list of scenarios, each with the page, the steps, and the expected result,
   - the data each scenario needs, with generated values only.
5. Show the plan to the user and wait for approval. Do not start implementation without it.

## Rules

- No personal data in the plan. Use generated values such as `user_<timestamp>@example.test`.
- Keep scope to what the user listed.
