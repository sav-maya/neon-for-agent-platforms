# Examples

Follow **[README § Start here](../README.md#start-here-agent-program-partners)** first. Runnable code for the **[Neon AI Agent Program](https://neon.com/use-cases/ai-agents)** lives only in `**api-scripts/`** — Neon Console **Management API** (`fetch` to `console.neon.tech/api/v2`).

**Fleets & two-org layout:** If you provision **many** tenant projects and separate **free vs paid** Neon orgs, read **[FLEET_AND_ORG_LAYOUT.md](FLEET_AND_ORG_LAYOUT.md)** first—it maps org ids, API keys, `**create-project`**, `**transfer-project**`, `**consumption-query**`, and `**delete-project**` to a fleet mental model.


| Folder                                    | Role                                |
| ----------------------------------------- | ----------------------------------- |
| **[api-scripts/](api-scripts/README.md)** | All scripts, env vars, and commands |


**Cross-cutting docs**

- [Fleet provisioning & org layout](FLEET_AND_ORG_LAYOUT.md) — two orgs, keys, create → transfer → consume → delete.
- [Which use case am I?](../docs/AGENT_USE_CASES.md) — Route 1 vs Route 2; maps needs to scripts.
- [Database versioning](https://neon.com/docs/ai/ai-database-versioning) — end-to-end in `**api-scripts/versioning-flow.mjs`**.
- [REST routing](https://neon.com/docs/reference/api-reference) — Auth vs Postgres vs consumption: [../docs/REST_API_META.md](../docs/REST_API_META.md).

**Requirements**

- **Node.js 20+** recommended (`node --env-file=.env`).
- Neon **[API key](https://neon.com/docs/manage/api-keys)** (`NEON_API_KEY`). Org-scoped keys need `**NEON_ORG_ID`** where noted.