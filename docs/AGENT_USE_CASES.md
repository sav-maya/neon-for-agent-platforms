# Agent platform use cases — how this repo maps

Complete **[README § Start here](../README.md#start-here-agent-program-partners)** first (keys, clone path, skills). Then use **this page** to match **your product shape** to scripts under `**examples/api-scripts/`**.

Most **Agent Program** builders fall into **Route 1** or **Route 2** below.

**Neon product behavior:** [neon.com/docs](https://neon.com/docs) — [Agent Plan](https://neon.com/docs/introduction/agent-plan), [AI Agent integration](https://neon.com/docs/guides/ai-agent-integration), [database versioning](https://neon.com/docs/ai/ai-database-versioning).

---

## Route 1 — Your product deploys embedded Postgres

You run Postgres **inside your product surface**: either as a **durable benefit** for customers or as **short-lived** infrastructure.

### 1a — Offer Postgres to end-users (e.g. free vs paid plans)


| What you need                                                     | Covered here  | Where                                                                                                                                             |
| ----------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route free-tier users vs paying customers to different Neon orgs  | Yes           | [README](../README.md) (two orgs + diagram), [Partner note](NEON_AGENT_PROGRAM_POST_CALL_GUIDE.md)                                                |
| Create a tenant **project** from your control plane               | Yes           | `[create-project.mjs](../examples/api-scripts/README.md)`                                                                                         |
| Move a project when a customer **upgrades** (free org → paid org) | Yes           | `[transfer-project.mjs](../examples/api-scripts/README.md)`, [README](../README.md) (personal API key for transfer)                               |
| Poll **usage / billing-aligned metrics** for quotas or showbacks  | Yes           | `[consumption-query.mjs](../examples/api-scripts/README.md)`, [REST API meta — Consumption](REST_API_META.md#consumption-api-usage-based-metrics) |
| End-user **app accounts** (login) vs Postgres **roles**           | Yes (routing) | `[REST_API_META.md](REST_API_META.md)`, `[auth-users.mjs](../examples/api-scripts/README.md)`                                                     |
| Install `**neon-postgres`** + Agent Program skill in assistants   | Yes           | [README](../README.md) (§ Start here → step 4), `[neon-postgres-agent-platforms](../skills/neon-postgres-agent-platforms/SKILL.md)`               |


### 1b — Ephemeral Postgres (preview envs, sandboxes, session databases)


| What you need                                                   | Covered here                     | Where                                                                                                                                                                                           |
| --------------------------------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Create an isolated **branch** from production for a preview     | Yes                              | `[branch.mjs create](../examples/api-scripts/README.md)`, `[NeonApi.createBranch](../examples/api-scripts/lib/neon-client.mjs)`                                                                 |
| Capture **snapshots** before risky changes; **restore** to undo | Yes                              | `[versioning-flow.mjs](../examples/api-scripts/README.md)`, `[restore-snapshot.mjs](../examples/api-scripts/README.md)`, [database versioning](https://neon.com/docs/ai/ai-database-versioning) |
| Tear down a **project** when an environment ends                | Yes                              | `[delete-project.mjs](../examples/api-scripts/README.md)`                                                                                                                                       |
| Short-lived **project** per session (create → use → delete)     | Partially (building blocks only) | Same scripts; **your** orchestration (TTL, queues) lives in your product — patterns in [AI Agent integration guide](https://neon.com/docs/guides/ai-agent-integration)                          |
| Product naming: **Embedded Postgres** on Neon                   | Pointer only                     | [Embedded Postgres](https://neon.com/docs/guides/embedded-postgres) — use alongside this repo’s provisioning examples                                                                           |


---

## Route 2 — Full-stack codegen (every generated app gets Postgres)

Each **generated app** gets its own database; your generator wires env vars and migrations in the app repo.


| What you need                                                 | Covered here   | Where                                                                                                                                                     |
| ------------------------------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **One Neon project per customer app** (recommended isolation) | Yes            | [README](../README.md) (one project per tenant), [integration guide](https://neon.com/docs/guides/ai-agent-integration)                                   |
| Provision project + return **connection string**              | Yes            | `[create-project.mjs](../examples/api-scripts/README.md)`                                                                                                 |
| **Preview / branch** per PR or per generation attempt         | Yes (API)      | `[branch.mjs](../examples/api-scripts/README.md)` — you map Git branch name ↔ Neon branch name in **your** CI                                             |
| **Undo** bad codegen (restore to known-good snapshot)         | Yes            | `[versioning-flow.mjs](../examples/api-scripts/README.md)`, `[snapshot.mjs](../examples/api-scripts/README.md)`                                           |
| Upgrade path when the customer pays (**transfer** + quotas)   | Yes            | `[transfer-project.mjs](../examples/api-scripts/README.md)`, README two-org model                                                                         |
| ORMs, migrations, Drizzle/Prisma, seed scripts                | No — by design | Install `**neon-postgres`** from [agent-skills](https://github.com/neondatabase/agent-skills); follow framework docs on [neon.com](https://neon.com/docs) |


---

## Shared checklist (both routes)


| Topic                                                                                | Doc / script                                                                            |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| **Fleet provisioning & two-org layout** (create per tier, transfer, consume, delete) | [examples/FLEET_AND_ORG_LAYOUT.md](../examples/FLEET_AND_ORG_LAYOUT.md)                 |
| Runnable examples hub (`examples/api-scripts`)                                       | [examples/README.md](../examples/README.md)                                             |
| Every REST script, env var, and command                                              | [examples/api-scripts/README.md](../examples/api-scripts/README.md)                     |
| REST vs Auth users vs Postgres roles vs consumption API                              | [REST_API_META.md](REST_API_META.md)                                                    |
| AI assistant context (orgs, transfers, cost)                                         | [neon-postgres-agent-platforms SKILL](../skills/neon-postgres-agent-platforms/SKILL.md) |
| Short link index                                                                     | [AGENT_PROGRAM_REFERENCE.md](AGENT_PROGRAM_REFERENCE.md)                                |


---

## Not covered here (use Neon’s main skill + docs)

- Choosing **single shared project + schema-per-tenant** vs **project-per-tenant** — this repo assumes **project-per-app** unless you design otherwise; discuss tradeoffs in [integration guide](https://neon.com/docs/guides/ai-agent-integration).
- Deep **branching**, **PITR**, **compute** tuning beyond script defaults.
- **Neon Auth** UI flows, OAuth plugins, email — [neon.com/docs/auth](https://neon.com/docs/auth).
- **Marketplace / Vercel / GitHub** integrations — platform docs.

Install `**neon-postgres`** first; add `**neon-postgres-agent-platforms**` for Agent Program–specific Q&A ([README](../README.md) — § Start here).