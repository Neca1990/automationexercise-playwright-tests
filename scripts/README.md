# Scripts

- `flow.sh`: runs one stage of the flow (plan, implement, gate, review, fix). See `docs/workflow.md`.
- `check-private.sh`: privacy and secrets guard. Run with `npm run guard`.

## Blocklist (kept outside the repository)

`check-private.sh` reads blocked words from a file on your computer, not from this repository:

```
~/.config/automation-guard/blocklist.txt
```

One term per line. Lines starting with `#` are ignored. Put personal names, email name parts, employer or client names, and course names there. The file is never committed.

Create it once:

```
mkdir -p ~/.config/automation-guard
touch ~/.config/automation-guard/blocklist.txt
```
