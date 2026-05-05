# Contributing

## Repository layout

| Area | Role |
|------|------|
| `examples/minimal-node/` | Minimal provision + `pg` query |
| `examples/api-scripts/` | Neon Console REST (`fetch`), shared `lib/neon-client.mjs` |
| `skills/neon-postgres-agent-platforms/` | Companion AI skill (Markdown) |
| `docs/` | Guides and indexes |

## Prerequisites

- **Node.js 20+** for example scripts (`node --env-file=.env`) and for ESLint at the repo root.

## Lint and format (maintainers)

From the **repository root**:

```bash
npm install
npm run lint
npm run format:check
```

Same checks via convenience aliases: **`npm run fmt:check`** and **`npm run fmt`** (same as `format` / `format:check`). Optional naming parity with repos such as [postgres-skills](https://github.com/neondatabase/postgres-skills)—which remains the dedicated Postgres skills collection; this repository is **Agent Program samples** plus a narrow companion skill, not a substitute for that project.

Auto-fix where ESLint can:

```bash
npm run lint:fix
npm run format
```

Agent-oriented overview of this repo: **[AGENTS.md](AGENTS.md)**.

Examples folders (`examples/minimal-node`, `examples/api-scripts`) keep their own **`npm install`** for **runtime** deps (`pg`, etc.). Root **`package.json`** is only for **lint/format** tooling.

## Code expectations

- **ES modules** (`.mjs`) — `import` / `export`, `"type": "module"` in package.json where present.
- **Fail fast** — validate required `process.env` at startup; `process.exit(1)` with a clear stderr message for CLI scripts.
- **Structured CLI output** — prefer `JSON.stringify(obj, null, 2)` for machine-readable success payloads; use `console.error` for human progress lines when a script is multi-step.
- **Errors** — propagate failures from `fetch`; avoid swallowing API error bodies (see `NeonApi._readError` pattern).
- **No secrets** — never commit `.env`, keys, or connection strings; rely on `.env.example` templates only.

## Pull requests

- Run **`npm run lint`** and **`npm run format:check`** before requesting review when you touch `examples/**/*.mjs`.
- Keep changes focused; match existing naming and patterns in the same folder.
