# Quality

Keep this as the project verification menu. Add commands only after they pass locally.

## Harness Checks

| Check | Command | Run When |
|---|---|---|
| Harness structure and source size | `./scripts/check-sonata.sh` | After harness, docs, or skill changes |
| Optional changed-code gates | `node scripts/check-quality-gates.mjs` | Before handoff when SCC or Skylos is enabled |

## Project Checks

| Check | Command | Status |
|---|---|---|
| Bootstrap/install | `npm install` | verified |
| Run application | `npm run server` (WS/API :8787) + `npm run dev` (Vite :5173, proxies /ws + /api) | verified |
| Unit/integration tests | `npm test` (session rules, WS roles, RPS engine) | verified |
| Fast code checks | `npm run check` (svelte-check) then `npm run build` | verified |
| Exercise primary behavior | Navigate all 12 slides; live arc: `node scripts/rehearse.mjs 10` + deck at `/?key=<token>` | verified |
| Observe failures | Browser devtools console; kill server mid-arc → deck mirror + `O` bail hotkey | verified |
| Reset/cleanup | Restart `npm run server` (session is in-memory); reload deck | verified |

Deploy: see `docs/deploy.md`. Rehearsal knob: `DRAW_SECONDS=8` env shortens the draw window.

## Risk Lanes

- Fast: docs, copy, styling, scaffolding, one-line config. One cheap check; no test required.
- Behavior: branches, parsing, state transitions, regression fixes. One public-seam test plus relevant build/typecheck.
- Critical: persistence, concurrency, security, permissions, money, external contracts. Focused integration evidence and review.
- Milestone: broad or cross-cutting work. All relevant verified checks.

## Quality Bar

- Acceptance behavior exists before broad implementation.
- Validation is reproducible by another agent.
- Planned commands stay marked planned until verified.
- Source files above 300 lines fail the smell check. Required exceptions live in `.sonata/large-files.txt`, never product code.
- New decisions update durable repo context.
- Repeated failures become docs, checks, fixtures, logs, or clearer boundaries.
