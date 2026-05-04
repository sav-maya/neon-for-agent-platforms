# Examples

Runnable samples for the **[Neon AI Agent Program](https://neon.com/use-cases/ai-agents)**—products that provision Neon Postgres **per customer**. Pick one folder based on what you need:

| Folder | Best for | Tech |
|--------|-----------|------|
| **[`minimal-node/`](minimal-node/README.md)** | First-time flow: create a project via API and run a SQL query with **`pg`** | Node.js, no Console REST harness |
| **[`api-scripts/`](api-scripts/README.md)** | Automation and control-plane ops: projects, branches, **snapshots & restore**, org transfer, consumption metrics, Neon Auth users | Node.js, **`fetch`** only (+ optional **`pg`** for demos) |

**Cross-cutting docs**

- [Which use case am I?](../docs/AGENT_USE_CASES.md) — Route 1 (embedded / ephemeral Postgres) vs Route 2 (codegen); maps needs to scripts.
- [Database versioning](https://neon.com/docs/ai/ai-database-versioning) (snapshots, restore, checkpoints)—implemented end-to-end in **`api-scripts/versioning-flow.mjs`**.
- [REST routing](https://neon.com/docs/reference/api-reference) for Auth users vs Postgres roles vs consumption—see [`../docs/REST_API_META.md`](../docs/REST_API_META.md).

**Requirements**

- **Node.js 20+** recommended (for `node --env-file=.env`).
- A Neon **[API key](https://neon.com/docs/manage/api-keys)** (`NEON_API_KEY`). Organization-scoped keys need **`NEON_ORG_ID`** where noted.

Start from the repo **[README](../README.md)** for Agent Program context (two orgs, keys, skills).
