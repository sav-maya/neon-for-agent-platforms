# AGENTS.md

Guidance for AI coding agents (Cursor, Claude Code, Copilot, etc.) working in this repository.

For the Agent Skills file layout and frontmatter rules, see the [Agent Skills specification](https://agentskills.io/specification).

**Relationship to [postgres-skills](https://github.com/neondatabase/postgres-skills):** That repository is Neon’s home for **general Postgres agent skills** (best practices, schema design, etc.). **This repo does not replace it.** Stay subscribed to postgres-skills for that content. Here we only ship **Agent Program–specific** samples plus one **companion** skill; when you edit that skill, you can use postgres-skills’ [`CONTRIBUTING.md`](https://github.com/neondatabase/postgres-skills/blob/main/CONTRIBUTING.md) as an optional guide for **SKILL.md** quality and structure—same ecosystem, different scope.

## What this repository is

Sample **Node** examples and documentation for the **[Neon AI Agent Program](https://neon.com/use-cases/ai-agents)** (platforms that provision Neon Postgres per customer), plus a **companion skill** that complements the upstream [`neon-postgres`](https://github.com/neondatabase/agent-skills) bundle.

| Area | Your focus |
|------|------------|
| `examples/api-scripts/` | Neon Console REST (`fetch`); shared [`lib/neon-client.mjs`](examples/api-scripts/lib/neon-client.mjs) |
| `skills/neon-postgres-agent-platforms/` | Companion skill—Agent Program context (orgs, transfers, fleets). Ship with `neon-postgres`, not instead of it |
| `docs/` | Narrative guides and indexes—keep accurate relative to scripts |

Unlike skill-only repos, **example JavaScript is first-class**. Prefer small, explicit scripts with clear env validation and structured JSON output where appropriate.

## Editing the companion skill

- Directory **`skills/neon-postgres-agent-platforms/`** must stay aligned with the skill **`name`** in YAML frontmatter (see Agent Skills spec).
- Follow [**Skill creation best practices**](https://agentskills.io/skill-creation/best-practices): valid frontmatter, **Gotchas** for non-obvious corrections, **defaults** over long option menus, **progressive disclosure** (detailed tables in `references/` with explicit *when to read* hints in `SKILL.md`).
- For tone and depth on the companion skill only, you may borrow patterns from [postgres-skills `CONTRIBUTING`](https://github.com/neondatabase/postgres-skills/blob/main/CONTRIBUTING.md) (concrete tradeoffs, imperative guidance, `references/` for long material)—that repo remains authoritative for Postgres-wide skills; this skill stays narrowly about Agent Program provisioning and org patterns.

## Editing examples (`examples/**/*.mjs`)

Before opening a PR that touches example scripts:

```bash
npm install          # repo root — lint/format devDependencies only
npm run lint
npm run format:check
```

Convenience aliases (same script names some Neon repos use, e.g. postgres-skills): **`npm run fmt`** and **`npm run fmt:check`** (same as `format` / `format:check`).

Expectations: ES modules; validate required env at startup; prefer structured JSON for machine-readable CLI output; propagate `fetch` errors with useful bodies; never commit `.env`, keys, or connection strings.

## Docs and README

Keep cross-links between `README.md`, `examples/README.md`, and `docs/` consistent when you add or rename scripts.
