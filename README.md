# automationexercise Playwright tests

UI test automation practice for [automationexercise.com](https://automationexercise.com), a public site made for automation practice.

## Setup

```
npm install
npx playwright install chromium
```

## Run

```
npm test          # all tests
npm run report    # HTML report after a run
npm run guard     # privacy and secrets check
```

## How it is organized

- `AGENTS.md` and `docs/`: rules for AI agents and the test conventions.
- `.agents/skills/`: skills for planning, implementing, reviewing, and fixing tests.
- `scripts/flow.sh`: runs one stage of the flow. See `docs/workflow.md`.
- `.github/workflows/tests.yml`: runs the privacy guard and the tests on every push and pull request.

## Rules

- No personal data, secrets, or unrelated project names in this repository.
- Tests must pass and the guard must pass before every push and merge.
