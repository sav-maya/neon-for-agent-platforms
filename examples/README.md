# Examples

Runnable sample code for the **[Neon AI Agent Program](https://neon.com/use-cases/ai-agents)** lives in **`api-scripts/`** — Neon Console **Management API** (`fetch` to `console.neon.tech/api/v2`): projects, branches, snapshots, restore, org transfer, consumption, Neon Auth users.

**Fleets & two-org layout:** If you provision **many** tenant projects and separate **free vs paid** Neon orgs, read **[FLEET_AND_ORG_LAYOUT.md](FLEET_AND_ORG_LAYOUT.md)** first—it maps org ids, API keys, **`create-project`**, **`transfer-project`**, **`consumption-query`**, and **`delete-project`** to a fleet mental model.

| Folder | Role |
| ------ | ---- |
| **[api-scripts/](api-scripts/README.md)** | All scripts, env vars, and flows — **start here**. |

**Cross-cutting docs**

- [Fleet provisioning & org layout](FLEET_AND_ORG_LAYOUT.md) — two orgs, keys, create → transfer → consume → delete.
- [Which use case am I?](../docs/AGENT_USE_CASES.md) — Route 1 (embedded / ephemeral Postgres) vs Route 2 (codegen); maps needs to scripts.
- [Database versioning](https://neon.com/docs/ai/ai-database-versioning) (snapshots, restore, checkpoints)—implemented end-to-end in **`api-scripts/versioning-flow.mjs`**.
- [REST routing](https://neon.com/docs/reference/api-reference) for Auth users vs Postgres roles vs consumption—see [../docs/REST_API_META.md](../docs/REST_API_META.md).

**Requirements**

- **Node.js 20+** recommended (for `node --env-file=.env`).
- A Neon **[API key](https://neon.com/docs/manage/api-keys)** (`NEON_API_KEY`). Organization-scoped keys need **`NEON_ORG_ID`** where noted.

Start from the repo **[README](../README.md)** for Agent Program context (two orgs, keys, skills).
